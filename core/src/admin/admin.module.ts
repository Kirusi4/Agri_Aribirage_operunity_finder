import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../auth/user.entity';
import { Admin } from '../auth/admin.entity';
import { AlertLog } from '../agri/alert-log.entity';
import { AgriModule } from '../agri/agri.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, AlertLog]),
    AgriModule,
    AuthModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
