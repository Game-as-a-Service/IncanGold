import { Entity,PrimaryColumn,Column,ManyToOne,Relation,JoinColumn } from "typeorm";
import { RoomData } from "./RoomData";
import { STATE } from "../domain/constant/State";

@Entity() 
export class PlayerData {

  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: STATE
  })
  state: STATE;

  @ManyToOne(() => RoomData, room => room.players)
  @JoinColumn({name:'roomId'})
  room: Relation<RoomData>;

}