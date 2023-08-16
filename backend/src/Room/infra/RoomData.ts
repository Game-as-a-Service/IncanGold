import { Entity, Column, OneToMany, PrimaryGeneratedColumn,Relation } from "typeorm";
import { PlayerData } from "./PlayerData";
import { Seat } from "../domain/Seat";

@Entity()
export class RoomData {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('varchar', { length: 8, nullable: true })
  passwd: string;

  @Column('uuid', { nullable: true })
  hostId: string;

  @OneToMany(() => PlayerData, player => player.room, {
    cascade: true,
    eager: true,
  })
  players: Relation<PlayerData>[];

  @Column('json', { nullable: true })
  seats: Record<number, Seat>;

  @Column('int', { default: 0 })
  version: number;
}