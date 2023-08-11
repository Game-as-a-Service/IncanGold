import { Entity, Column, PrimaryColumn,OneToMany,Relation } from "typeorm"
import { CardData } from "./CardData"
import { PlayerData } from "./PlayerData"

@Entity()
export class IncanGoldData {
    @PrimaryColumn("uuid")
    id: string

    @Column("int",{nullable: true})
    round: number

    @Column("int",{nullable: true})
    turn: number

    @OneToMany(() => CardData, (card) => card.incanGold,{
        cascade:true,
        eager: true,
    })
    cards: Relation<CardData>[]

    @OneToMany(() => PlayerData, (player) => player.incanGold,{
        cascade:true,
        eager: true,
    })
    players: Relation<PlayerData>[]
}
