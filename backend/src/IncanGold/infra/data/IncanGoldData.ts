import { Entity, Column, PrimaryColumn, OneToMany, Relation } from "typeorm"
import { CardData } from "./CardData"
import { ExplorerData } from "./ExplorerData"

@Entity()
export class IncanGoldData {
    @PrimaryColumn("uuid")
    id: string

    @Column("int", { nullable: true })
    round: number

    @Column("int", { nullable: true })
    turn: number

    @Column("simple-json", { nullable: true })
    tunnel: CardData[]

    @Column("simple-json")
    deck: CardData[]

    @Column("simple-json", { nullable: true })
    trashDeck: Record<number, CardData[]>

    @OneToMany(() => ExplorerData, (explorer) => explorer.incanGold, {
        cascade: true,
        eager: true,
    })
    explorers: Relation<ExplorerData>[]

    static generateBy(
        id: string,
        round: number,
        turn: number,
        tunnel: CardData[],
        deck: CardData[],
        trashDeck: Record<number, CardData[]>,
        explorers: ExplorerData[],
    ) {
        const incanGold = new IncanGoldData()
        incanGold.id = id
        incanGold.round = round
        incanGold.turn = turn
        incanGold.tunnel = tunnel
        incanGold.deck = deck
        incanGold.trashDeck = trashDeck
        incanGold.explorers = explorers
        return incanGold
    }
}
