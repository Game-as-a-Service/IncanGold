import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { PlayerData } from "./PlayerData";
import { Seat } from "../domain/Seat";

@Entity()
export class RoomData {

  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('varchar', { length: 8, nullable: true })
  passwd: string;

  @Column('uuid')
  hostId: string;

  @OneToMany(() => PlayerData, player => player.room, {
    cascade: true
  })
  players: PlayerData[];

  @Column('json', { nullable: true })
  seats: Record<number, Seat>;
}