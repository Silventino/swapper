import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import TransactionReq from '../../types/TransactionReq';
import Swap from './Swap';

@Entity()
export default class Transaction {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: 'parentTransaction' })
  parentTxID!: string;

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

  @ManyToOne(() => Swap)
  @JoinColumn({ name: 'parentTransaction', referencedColumnName: 'txId' })
  swap!: Swap;

  fromTransactionReq(s: TransactionReq, parent?: string) {
    Object.assign(this, s);
    this.parentTxID = parent ?? '';
    this.note = s.note ?? '';
  }
}
