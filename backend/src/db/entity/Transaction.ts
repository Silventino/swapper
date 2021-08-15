import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TextDecoder } from 'util';
import TransactionReq from '../../types/TransactionReq';

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

  @Column()
  firstRound!: number;

  @Column()
  genesisHash!: string;

  @Column()
  genesisID!: string;

  @Column()
  lastRound!: number;

  @Column({ default: null })
  blob?: string;

  @Column({ default: '' })
  txID?: string;

  fromTransactionReq(s: TransactionReq, parent?: string) {
    Object.assign(this, s);
    this.parentTransaction = parent ?? '';
    this.note = s.note ?? '';
  }
}
