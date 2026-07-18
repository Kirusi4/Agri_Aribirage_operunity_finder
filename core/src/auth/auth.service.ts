import { Injectable, UnauthorizedException, OnModuleInit, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Admin } from './admin.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async onModuleInit() {
    // Seed admin user in admins table if not exists
    const adminEmail = 'admin@agri.com';
    const existingAdmin = await this.adminRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const admin = this.adminRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Super Admin',
        role: 'admin',
        adminLevel: 'Root'
      });
      await this.adminRepository.save(admin);
      console.log('Admin user seeded in admins table');
    }
  }

  async register(email: string, pass: string, name: string): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    return this.userRepository.save(user);
  }

  async login(email: string, pass: string) {
    // Check admins table first
    let account: any = await this.adminRepository.findOne({ where: { email } });
    
    // If not in admins, check users table
    if (!account) {
      account = await this.userRepository.findOne({ where: { email } });
    }

    if (account && await bcrypt.compare(pass, account.password)) {
      const payload = { email: account.email, sub: account.id, role: account.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: account.id, email: account.email, role: account.role, name: account.name }
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUser(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }

  async updateProfile(userId: number, role: string, data: any) {
    const { password, role: dataRole, ...updateData } = data; // Prevent updating sensitive fields
    const repo = role === 'admin' ? this.adminRepository : this.userRepository;
    await repo.update(userId, updateData);
    return repo.findOne({ where: { id: userId } as any });
  }

  async getProfile(userId: number, role: string) {
    const repo = role === 'admin' ? this.adminRepository : this.userRepository;
    return repo.findOne({ where: { id: userId } as any });
  }
}
