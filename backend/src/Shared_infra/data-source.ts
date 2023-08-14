import "reflect-metadata"
import { DataSource } from "typeorm"
import { IncanGoldData } from "../IncanGold/infra/data/IncanGoldData"
import { CardData } from "../IncanGold/infra/data/CardData"
import { ExplorerData } from "../IncanGold/infra/data/ExplorerData"
import { User } from "../User/infra/User"
import { RoomData } from "../Room/infra/RoomData"
import { PlayerData } from "../Room/infra/PlayerData"

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
        entities: [IncanGoldData,CardData,ExplorerData,User,RoomData,PlayerData],
        migrations: [],
        subscribers: [],
    })
} 
