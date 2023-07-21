import { Entity, Column, PrimaryColumn,OneToMany } from "typeorm"
import { CardData } from "./CardData"
import { PlayerData } from "./PlayerData"

@Entity()
export class IncanGoldData {
    @PrimaryColumn("uuid")
    id: string

    @Column("int")
    round: number

    @Column("int")
    turn: number

    @OneToMany(() => CardData, (card) => card.incanGold,{
        cascade:true,
        eager: true,
    })
    cards: CardData[]

    @OneToMany(() => PlayerData, (player) => player.incanGold,{
        cascade:true,
        eager: true,
    })
    players: PlayerData[]
}
