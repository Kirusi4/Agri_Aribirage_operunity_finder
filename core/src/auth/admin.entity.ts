import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ default: 'Super Admin' })
  adminLevel: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  state: string;

  @CreateDateColumn()
  createdAt: Date;
}
