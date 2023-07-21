import { Entity, PrimaryColumn, Column, ManyToOne,JoinColumn } from "typeorm"
import { IncanGoldData } from "./IncanGoldData"
import { Choice } from "../../../../packages/incan-gold-core/src/domain/constant/Choice"

@Entity()
export class PlayerData {
    @PrimaryColumn('uuid')
    id:string

    @Column({
        type:"enum",
        enum:Choice,
        default:Choice.NotSelected,
    })
    choice:Choice

    @Column({default: true})
    inTent: boolean   
    
    @Column("int",{default: 0})
    gemsInBag: number      

    @Column("int",{default: 0})
    gemsInTent: number      
    
    @Column("int",{default: 0})
    totalPoints: number 
    
    @Column("simple-array",{nullable: true})
    artifacts: string[] 

    @ManyToOne(()=>IncanGoldData,(incanGold)=>incanGold.players)
    incanGold:IncanGoldData
}