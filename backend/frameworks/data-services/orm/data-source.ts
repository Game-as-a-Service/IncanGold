import "reflect-metadata"
import { DataSource } from "typeorm"
import { IncanGoldData } from "./IncanGoldData"
import { CardData } from "./CardData"
import { PlayerData } from "./PlayerData"

export const AppDataSource = new DataSource({
    type: "mysql",
    // host: "localhost",
    host: "sql2",
    port: 3306,
    username: "root",
    password: "123456",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [IncanGoldData,CardData,PlayerData],
    migrations: [],
    subscribers: [],
})
