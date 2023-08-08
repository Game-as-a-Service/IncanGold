import "reflect-metadata"
import { DataSource } from "typeorm"
import { IncanGoldData } from "./IncanGold/data/IncanGoldData"
import { CardData } from "./IncanGold/data/CardData"
import { PlayerData } from "./IncanGold/data/PlayerData"

export let AppDataSource : DataSource|null;

export function configDataSource(host:string,port:number):void {
    AppDataSource =  new DataSource({
        type: "mysql",
        host,
        port,
        username: "root",
        password: "123456",
        database: "test",
        synchronize: true,
        logging: false,
        entities: [IncanGoldData,CardData,PlayerData],
        migrations: [],
        subscribers: [],
    })
} 
