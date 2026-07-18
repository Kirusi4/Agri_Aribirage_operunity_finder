import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketData } from './market-data.entity';
import { AlertLog } from './alert-log.entity';
import { TelegramService } from '../alerts/telegram.service';

@Injectable()
export class AgriService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.data.gov.in/resource';
  private requestCache = new Map<string, { data: any, timestamp: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(MarketData)
    private readonly marketDataRepository: Repository<MarketData>,
    @InjectRepository(AlertLog)
    private readonly alertLogRepository: Repository<AlertLog>,
    private readonly telegramService: TelegramService,
  ) {
    this.apiKey = this.configService.get<string>('AGRI_API_KEY') || '';
  }

  async getMarketPrices(
    resourceId: string = '9ef84268-d588-465a-a308-a864a43d0070', 
    limit: number = 100,
    offset: number = 0,
    state: string = '',
    commodity?: string,
    district?: string
  ) {
    const cacheKey = `${resourceId}-${limit}-${offset}-${state}-${commodity}-${district}`;

    // Check Cache
    const cached = this.requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Check Pending Requests to deduplicate
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._fetchMarketPrices(resourceId, limit, offset, state, commodity, district);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      this.requestCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async _fetchMarketPrices(
    resourceId: string,
    limit: number,
    offset: number,
    state: string,
    commodity?: string,
    district?: string
  ) {
    try {
      if (!this.apiKey) {
        throw new Error('API Key is missing. Please check AGRI_API_KEY in .env');
      }

      let url = `${this.baseUrl}/${resourceId}?api-key=${this.apiKey}&format=json&limit=${limit}&offset=${offset}`;
      
      if (state) url += `&filters[state]=${encodeURIComponent(state)}`;
      if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
      if (district) url += `&filters[district]=${encodeURIComponent(district)}`;

      console.log(`Fetching data from OGD: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get(url, { timeout: 15000 })
      );
      const data = response.data;

      if (data.status === 'error') {
        console.warn(`OGD API returned error: ${data.message}`);
        const localRecords = await this.marketDataRepository.find({
          take: limit,
          skip: offset,
          where: {
            ...(state && { state }),
            ...(commodity && { commodity }),
            ...(district && { district })
          },
          order: { arrivalDate: 'DESC' }
        });

        return {
          records: localRecords.map(r => ({
            ...r,
            arrival_date: r.arrivalDate,
            min_price: r.minPrice,
            max_price: r.maxPrice,
            modal_price: r.modalPrice
          })),
          total: localRecords.length,
          count: localRecords.length,
          status: 'success',
          source: 'local_db'
        };
      }

      console.log(`Fetched ${data.records?.length || 0} records from OGD`);

      if (data.records && data.records.length > 0) {
        // Use await here to ensure we don't overlap too many DB operations, 
        // or at least it's more controlled.
        await this.syncRecords(data.records);
      }

      return {
        ...data,
        source: 'ogd_api'
      };
    } catch (error) {
      console.error('AgriService Error:', error.message);
      
      const localRecords = await this.marketDataRepository.find({
        take: limit,
        skip: offset,
        where: {
          ...(state && { state }),
          ...(commodity && { commodity }),
          ...(district && { district })
        },
        order: { arrivalDate: 'DESC' }
      });

      return {
        records: localRecords.map(r => ({
          ...r,
          arrival_date: r.arrivalDate,
          min_price: r.minPrice,
          max_price: r.maxPrice,
          modal_price: r.modalPrice
        })),
        total: localRecords.length,
        status: 'fallback',
        source: 'local_db'
      };
    }
  }

  private async syncRecords(records: any[]) {
    try {
      const entitiesMap = new Map<string, any>();
      
      records.forEach(record => {
        const key = `${record.market}-${record.commodity}-${record.arrival_date}`;
        entitiesMap.set(key, {
          state: record.state,
          district: record.district,
          market: record.market,
          commodity: record.commodity,
          variety: record.variety,
          arrivalDate: record.arrival_date,
          minPrice: record.min_price,
          maxPrice: record.max_price,
          modalPrice: record.modal_price
        });
      });

      const entities = Array.from(entitiesMap.values());

      // TypeORM upsert is much more efficient than one-by-one check
      await this.marketDataRepository.upsert(entities, ['market', 'commodity', 'arrivalDate']);
    } catch (err) {
      console.error('Batched sync failed:', err.message);
    }
  }

  async getDashboardStats() {
    let opportunities = [];
    try {
      opportunities = await this.findArbitrageOpportunities();
    } catch (err) {
      console.warn('Dashboard stats: Could not fetch opportunities, showing 0');
    }
    
    const data = await this.getMarketPrices(undefined, 100); // Reduce limit for faster stats
    const records = data.records || [];
    
    const uniqueMarkets = new Set(records.map(r => r.market));
    const uniqueCommodities = new Set(records.map(r => r.commodity));
    
    return {
      totalMarkets: uniqueMarkets.size,
      activeCommodities: uniqueCommodities.size,
      activeOpportunities: opportunities.length,
      lastUpdated: new Date(),
      source: data.source
    };
  }

  async findArbitrageOpportunities() {
    const data = await this.getMarketPrices(undefined, 200);
    const records = data.records || [];
    
    if (records.length === 0) return [];

    const commodityMap = new Map<string, any[]>();
    records.forEach(record => {
      const { commodity, market, modal_price, state, district } = record;
      const price = parseFloat(modal_price);
      if (isNaN(price)) return;
      
      if (!commodityMap.has(commodity)) commodityMap.set(commodity, []);
      commodityMap.get(commodity).push({ market, price, state, district });
    });

    const opportunities: any[] = [];
    commodityMap.forEach((markets, commodity) => {
      if (markets.length > 1) {
        markets.sort((a, b) => a.price - b.price);
        const minMarket = markets[0];
        const maxMarket = markets[markets.length - 1];
        const spread = maxMarket.price - minMarket.price;
        
        if (spread > 50 && minMarket.price > 0) { 
          opportunities.push({
            commodity,
            buyAt: {
              market: minMarket.market,
              state: minMarket.state,
              price: minMarket.price
            },
            sellAt: {
              market: maxMarket.market,
              state: maxMarket.state,
              price: maxMarket.price
            },
            profit: spread,
            profitPercentage: ((spread / minMarket.price) * 100).toFixed(2)
          });
        }
      }
    });

    return opportunities.sort((a, b) => b.profit - a.profit);
  }

  async sendTelegramAlert(chatId: string, details: any) {
    const finalChatId = chatId || this.configService.get<string>('TELEGRAM_CHAT_ID');
    if (!finalChatId) {
      throw new Error('No Chat ID provided and no default configured');
    }

    const now = new Date();
    const alertDetails = {
      product: details.commodity || 'Unknown Product',
      price: details.price || '0',
      market: details.market || 'Unknown Market',
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    // Save to DB
    try {
      const alertLog = this.alertLogRepository.create({
        commodity: alertDetails.product,
        market: alertDetails.market,
        price: alertDetails.price.toString(),
        chatId: finalChatId,
        type: 'telegram',
        status: 'sent'
      });
      await this.alertLogRepository.save(alertLog);
    } catch (dbErr) {
      console.error('Failed to log alert to DB:', dbErr.message);
    }

    return this.telegramService.sendPriceAlert(finalChatId, alertDetails);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCronArbitrageAlert() {
    console.log('Running automatic arbitrage check for Telegram...');
    try {
      const opportunities = await this.findArbitrageOpportunities();
      if (opportunities && opportunities.length > 0) {
        const top = opportunities[0];
        
        const details = {
          commodity: top.commodity,
          price: top.sellAt.price,
          market: top.sellAt.market,
        };
        
        await this.sendTelegramAlert('', details);
        console.log(`Automatic alert sent for ${top.commodity}`);
      }
    } catch (err) {
      console.error('Failed to run automatic alert check:', err.message);
    }
  }
}
