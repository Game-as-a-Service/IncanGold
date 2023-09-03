import { Entity, PrimaryColumn, Column, ManyToOne, Relation } from "typeorm"
import { IncanGoldData } from "./IncanGoldData"
import { Choice } from "../../domain/IncanGold"

@Entity()
export class ExplorerData {
    @PrimaryColumn('uuid')
    id: string

    @Column({
        type: "enum",
        enum: Choice,
        default: Choice.NotSelected,
    })
    choice: Choice

    @Column("bool", { default: true })
    inTent: boolean

    @Column("int", { default: 0 })
    gemsInBag: number

    @Column("int", { default: 0 })
    gemsInTent: number

    @Column("int", { default: 0 })
    totalPoints: number

    @Column("simple-array", { nullable: true })
    artifacts: string[]

    @ManyToOne(() => IncanGoldData, (incanGold) => incanGold.explorers)
    incanGold: Relation<IncanGoldData>

    static generateBy(
        id: string,
        choice: Choice,
        inTent: boolean,
        gemsInBag: number,
        gemsInTent: number,
        totalPoints: number,
        artifacts: string[]
    ) {
        const explorer = new ExplorerData()
        explorer.id = id;
        explorer.choice = choice;
        explorer.inTent = inTent;
        explorer.gemsInBag = gemsInBag;
        explorer.gemsInTent = gemsInTent;
        explorer.totalPoints = totalPoints;
        explorer.totalPoints = totalPoints;
        explorer.artifacts = artifacts;
        return explorer;
    }
}
