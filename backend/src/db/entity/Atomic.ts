import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Atomic {
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
  assetIndex?: number | null | undefined;

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
}
