import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Transaction from './Transaction';

@Entity()
export default class Swap {
  @PrimaryColumn()
  txId!: string;

  @Column()
  status!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Transaction, (tx: Transaction) => tx.swap)
  transactions!: Transaction[];
}
