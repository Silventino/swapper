import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Transaction from './Transaction';

@Entity()
export default class Swap {
  @PrimaryColumn()
  txId!: string;

  @Column()
  completed!: boolean;

  @OneToMany(() => Transaction, (tx: Transaction) => tx.swap)
  transactions!: Transaction[];
}
