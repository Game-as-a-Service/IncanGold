import { Entity, Column, OneToMany, PrimaryGeneratedColumn,Relation } from "typeorm";
import { SeatData } from "./SeatData";

@Entity()
export class RoomData {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('varchar', { length: 30, nullable: true })
  passwd: string;

  @Column('uuid', { nullable: true })
  hostId: string;

  @OneToMany(() => SeatData, seat => seat.room, {
    cascade: true,
    eager: true,
  })
  seats: Relation<SeatData>[];

  @Column('int', { default: 0 })
  version: number;
}