import "reflect-metadata"
import { DataSource } from "typeorm"
import { IncanGoldData } from "../../IncanGold/infra/data/IncanGoldData"
import { ExplorerData } from "../../IncanGold/infra/data/ExplorerData"
import { User } from "../../User/infra/User"
import { RoomData } from "../../Room/infra/RoomData"
import { SeatData } from "../../Room/infra/SeatData"

export let AppDataSource: DataSource | null;

export function configDataSource(host: string, port: number): void {
    AppDataSource = new DataSource({
        type: "mysql",
        host,
        port: port,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [IncanGoldData, ExplorerData, User, RoomData, SeatData],
        migrations: [],
        subscribers: [],
    })
} 
