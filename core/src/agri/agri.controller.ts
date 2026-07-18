import { Controller, Get, Query, UseGuards, Post, Body } from '@nestjs/common';
import { AgriService } from './agri.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('agri')
export class AgriController {
  constructor(private readonly agriService: AgriService) {}

  @Get('markets')
  async getMarkets(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('state') state?: string,
    @Query('commodity') commodity?: string,
    @Query('district') district?: string,
  ) {
    return this.agriService.getMarketPrices(undefined, limit, offset, state, commodity, district);
  }

  @Get('stats')
  async getStats() {
    return this.agriService.getDashboardStats();
  }

  @Get('opportunities')
  async getOpportunities() {
    return this.agriService.findArbitrageOpportunities();
  }

  @Get('pro-data')
  async getProData() {
    return { message: 'This is premium real-time data', timestamp: new Date() };
  }

  @Post('telegram-alert')
  async sendAlert(@Body() body: { chatId: string; details: any }) {
    return this.agriService.sendTelegramAlert(body.chatId, body.details);
  }
}
