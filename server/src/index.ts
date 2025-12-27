import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';


const app = express();
app.use(express.json());

const PORT: number = Number(process.env.PORT) || 8000;

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error('Missing MONGO_URL');
}

mongoose
        .connect(MONGO_URL)
        .then(()=>{
            console.log("DB connected succsessfully.")
            app.listen(PORT,()=>{
                console.log(`server is running on port: ${PORT}`)
            });
        })
        .catch((error)=> console.log(error));

