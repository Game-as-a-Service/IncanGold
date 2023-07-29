import "reflect-metadata"
import { DataSource } from "typeorm"
import { IncanGoldData } from "./IncanGoldData"
import { CardData } from "./CardData"
import { PlayerData } from "./PlayerData"

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
