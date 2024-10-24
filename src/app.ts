import "dotenv/config";
const express = require('express');
import type {Response, Request, NextFunction} from 'express';
const mongoose = require('mongoose');
// const apicache = require("apicache");
// const redis = require("redis");
import routes from "./routes/routes"

// export const client = redis.createClient({
//     host: 'rediscache',
//     port: 6379,
//     enable_offline_queue: false
// });

// client.connect().then(()=>{
//     console.log("Connected to Redis...");
// })
// .catch((err:Error)=>{
//     console.error("Redis Error", err);
// });

const app = express();
const PORT = process.env.PORT;
const URI = process.env.URI;
app.use(express.json());
// let cache = apicache.middleware;
app.use("/", routes);
// app.use(cache('5 minutes'));



// app.get("*",async (req:Request, res:Response, next:NextFunction)=>{
//     const cacheKey = 'myData';
//     try {
//             client.get(cacheKey, (err:Error, data:any)=>{
//             if(err) throw err;

//             if(data){
//                 console.log("used redis")
//                 return res.send(JSON.parse(data))
//             }
//         })
//         next();
//     } catch (error) {
        
//     }

// })

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