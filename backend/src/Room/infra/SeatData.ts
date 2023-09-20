import { Entity, PrimaryColumn, Column, ManyToOne, Relation, JoinColumn } from "typeorm";
import { RoomData } from "./RoomData";
import { STATE } from "../domain/constant/State";

@Entity()
export class SeatData {

  @PrimaryColumn('int')
  position: number;

  @Column('bool', { nullable: true })
  locked: boolean;

  @Column('uuid', { nullable: true })
  playerId: string;

  @Column({
    type: 'enum',
    enum: STATE
  })
  state: STATE;

  @PrimaryColumn({ type: 'varchar', name: 'roomId' })
  @ManyToOne(() => RoomData, room => room.seats, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'roomId' })
  room: Relation<RoomData>;


  modify(locked: boolean, playerId: string, state: STATE) {
    this.locked = locked;
    this.playerId = playerId;
    this.state = state;
  }
}