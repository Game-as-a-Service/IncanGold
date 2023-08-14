import { Entity, Column, PrimaryColumn,OneToMany,Relation } from "typeorm"
import { CardData } from "./CardData"
import { ExplorerData } from "./ExplorerData"

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

    @OneToMany(() => ExplorerData, (explorer) => explorer.incanGold,{
        cascade:true,
        eager: true,
    })
    explorers: Relation<ExplorerData>[]
}
