import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, Unique } from 'typeorm';

@Entity('market_data')
@Unique(['market', 'commodity', 'arrivalDate'])
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @Column()
  district: string;

  @Column()
  market: string;

  @Column()
  commodity: string;

  @Column()
  variety: string;

  @Column()
  arrivalDate: string;

  @Column()
  minPrice: string;

  @Column()
  maxPrice: string;

  @Column()
  modalPrice: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
