import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('alert_logs')
export class AlertLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commodity: string;

  @Column()
  market: string;

  @Column()
  price: string;

  @Column({ nullable: true })
  chatId: string;

  @Column({ default: 'telegram' })
  type: string;

  @Column({ default: 'sent' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
