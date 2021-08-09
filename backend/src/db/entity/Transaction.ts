import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TextDecoder } from 'util';
import SimpleTransaction from '../../types/SimpleTransaction';

@Entity()
export default class Transaction {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  parentTransaction!: string;

  @Column()
  fee!: number;

  @Column()
  flatFee!: boolean;

  @Column()
  type!: string;

  @Column()
  assetIndex!: number;

  @Column()
  from!: string;

  @Column()
  to!: string;

  @Column()
  amount!: number;

  @Column()
  note?: string;

  @Column()
  group?: string;

  fromSimpleTransaction(s: SimpleTransaction, parent?: string) {
    this.parentTransaction = parent ?? '';
    this.fee = s.fee;
    this.flatFee = s.flatFee;
    this.type = s.type;
    this.assetIndex = s.assetIndex ?? 0;
    this.from = s.from;
    this.to = s.to;
    this.amount = s.amount;
    this.note = '';
    this.group = JSON.stringify(s.group);
  }
}
