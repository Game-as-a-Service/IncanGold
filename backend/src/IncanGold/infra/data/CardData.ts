import { Entity, PrimaryColumn, Column, ManyToOne,JoinColumn,Relation } from "typeorm"
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
    
    @Column("int",{nullable: true})
    gems :number

    @Column("int",{nullable: true})
    remainingGems :number

    @Column("bool",{nullable: true})
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
    incanGold: Relation<IncanGoldData>
}