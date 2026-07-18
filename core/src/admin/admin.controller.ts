import { Controller, Get, UseGuards, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AgriService } from '../agri/agri.service';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Admin } from '../auth/admin.entity';
import { Repository } from 'typeorm';
import { AlertLog } from '../agri/alert-log.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly agriService: AgriService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(AlertLog)
    private readonly alertLogRepository: Repository<AlertLog>,
  ) {}

  @Get('users')
  async getAllUsers() {
    return this.userRepository.find({ 
      select: ['id', 'email', 'name', 'role', 'contact', 'location', 'state', 'createdAt'] 
    });
  }

  @Get('stats')
  async getAdminStats() {
    const userCount = await this.userRepository.count();
    const adminCount = await this.adminRepository.count();
    const alertCount = await this.alertLogRepository.count();
    const marketStats = await this.agriService.getDashboardStats();
    
    return {
      userCount,
      adminCount,
      alertCount,
      marketStats
    };
  }

  @Get('alerts')
  async getAlertLogs() {
    return this.alertLogRepository.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userRepository.delete(id);
  }
}
