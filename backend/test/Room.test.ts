import { test,describe,beforeAll,afterAll, expect, } from "vitest";
import { Server } from "socket.io";
import { io ,Socket } from "socket.io-client"
import { boostrap } from "../index";
// import express,{ Express } from "express";
// import { createServer } from "http";


function waitForEvent(client:Socket, eventType:string) {
    return new Promise(resolve => {
        client.on(eventType, resolve);
    });
}

function handleClientConnection(client:Socket, port:number){
    client = io(`http://localhost:${port}`);

    return new Promise((resolve:any) => {
        client.on('connect', () => {
            console.log(`${client.id} has connected to server.`);
            resolve();
        })
        client.on("disconnect", () => {
            console.log(`client : disconnected.`); // undefined
        });
        client.on("connect_error", () => {
            console.log('can not connect');
        });
    })
}


describe('create Room',async()=>{
    let client1: Socket,
        client2: Socket,
        io_server: Server;

    beforeAll(async()=>{
        io_server = await boostrap();
        // const arr = [client1].map(client => handleClientConnection(client,8000));
        // await Promise.all(arr);
        // await handleClientConnection(client1,8000);
        const port = 8000;
        client1 = io(`http://localhost:${port}`);
        await new Promise((resolve:any) => {
            client1.on('connect', () => {
                console.log(`client : ${client1.id} has connected to server.`);
                resolve();
            })
            client1.on("disconnect", () => {
                console.log(`client : disconnected.`); // undefined
            });
            client1.on("connect_error", () => {
                console.log('can not connect');
            });
        })

    },30000) 

    afterAll(async () => {
        client1.close();
        io_server.close();
    },10000);

    
    test('routine1',async()=>{
        console.log(client1.connected);
    })
})