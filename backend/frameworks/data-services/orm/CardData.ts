import { Entity, PrimaryColumn, Column, ManyToOne,JoinColumn } from "typeorm"
import { IncanGoldData } from "./IncanGoldData"

export enum CardLocation {
    Deck = "deck",
    TrashDeck = "trashDeck",
    Tunnel = "tunnel",
    Temple = "temple"
}

@Entity()
export class CardData {

    @PrimaryColumn("varchar")
    cardID:string
    
    @Column({nullable: true})
    gems :number

    @Column({nullable: true})
    remainingGems :number

    @Column({nullable: true})
    remainingArtifact:boolean

    @Column({
        type:"enum",
        enum:CardLocation,
    })
    location:CardLocation

    @Column("int",{nullable: true})
    whenInTrashDeck:number

    @PrimaryColumn({ type: 'varchar', name: 'incanGoldId' })
    @ManyToOne(() => IncanGoldData, (incanGold) => incanGold.cards)
    @JoinColumn({name:'incanGoldId'})
    incanGold: IncanGoldData
}