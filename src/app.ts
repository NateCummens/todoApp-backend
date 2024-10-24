import "dotenv/config";
const express = require('express');
import type {Response, Request, NextFunction} from 'express';
const mongoose = require('mongoose');
// const apicache = require("apicache");
const redis = require("redis");
import routes from "./routes/routes"

const client = redis.createClient();
client.on('connect', ()=>{
    console.log("Connected to Redis...");
})
client.on("error", (err:Error)=>{
    console.error("Redis Error", err);
})

const app = express();
const PORT = process.env.PORT;
const URI = process.env.URI;
// let cache = apicache.middleware;
app.use(express.json());
// app.use(cache('5 minutes'));


// app.get("*",async (req:Request, res:Response, next:NextFunction)=>{
//     const cacheKey = 'myData';

//     client.get(cacheKey, (err:Error, data:any)=>{
//         if(err) throw err;

//         if(data){
//             return res.send(JSON.parse(data))
//         } else{
//             next();
//         }
//     })
// })
app.use("/", routes);

mongoose.set("strictQuery", false)
mongoose.connect(URI)
        .then((): void => console.log("[SERVER]: Database is connected"))
        .catch((err: string): void =>
          console.log("[ERROR]: Database is not connected", err)
        );

app.listen(
    PORT, 
    () => console.log(`app is running on http://localhost:${PORT}`)
)

module.exports = app; // for testing