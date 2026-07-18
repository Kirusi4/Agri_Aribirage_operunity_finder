import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly baseUrl = `https://api.telegram.org/bot${this.token}`;

  async sendPriceAlert(chatId: string, details: { product: string; price: string; market: string; time: string; date: string }) {
    const message = `
🚀 *Price Increase Alert!*
----------------------------
📅 *Date:* ${details.date}
⏰ *Time:* ${details.time}
📦 *Product:* ${details.product}
🏢 *Market:* ${details.market}
💰 *New Price:* ₹${details.price}/qtl

Check AgriArb for details!
    `;

    try {
      await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      });
      this.logger.log(`Alert sent to Telegram for ${details.product}`);
    } catch (err) {
      this.logger.error(`Failed to send Telegram message: ${err.message}`);
    }
  }
}
