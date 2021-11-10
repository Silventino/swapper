import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Asset {
  @PrimaryColumn()
  id!: number;

  @Column()
  creator!: string;

  @Column()
  owner!: string;

  @Column()
  total!: number;

  @Column()
  decimals!: number;

  @Column()
  defaultfrozen!: boolean;

  @Column()
  unitname!: string;

  @Column()
  assetname!: string;

  @Column()
  url!: string;

  @Column()
  managerkey!: string;

  @Column()
  reserveaddr!: string;

  @Column()
  circulatingsupply!: number;

  @Column()
  verified!: boolean;

  @Column()
  destroyed!: boolean;
}
