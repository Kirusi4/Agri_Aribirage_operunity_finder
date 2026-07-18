import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AgriService } from './agri.service';
import { AgriController } from './agri.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketData } from './market-data.entity';
import { AlertLog } from './alert-log.entity';
import { TelegramService } from '../alerts/telegram.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([MarketData, AlertLog]),
  ],
  providers: [AgriService, TelegramService],
  controllers: [AgriController],
  exports: [AgriService, TypeOrmModule],
})
export class AgriModule {}
