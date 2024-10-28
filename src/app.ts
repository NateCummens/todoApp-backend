import "dotenv/config";
const express = require('express');
import type {Response, Request, NextFunction} from 'express';
const mongoose = require('mongoose');
import routes from "./routes/routes";
const client = require("./redis/redisClient");

export const cacheMiddleWare = async (req:Request, res:Response, next:NextFunction)=>{
  try {
    console.log('used middleware');
    const cacheKey = req.originalUrl;
    const data = await client.get(cacheKey);

    if (data !== null) {
      console.log('used redis')
        return res.json(JSON.parse(data));
    } else {
        next();
    }

  } catch (error) {
    console.error(error);
    next();
  }
}

const app = express();
const PORT = process.env.PORT;
const URI = process.env.URI;
app.use(express.json());
app.use("/", cacheMiddleWare, routes);

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

module.exports = {
  app, //for testing
  cacheMiddleWare,
};