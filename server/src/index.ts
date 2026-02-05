import 'dotenv/config';
import { config } from './config'

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import suppliersRoutes from "./routes/SuppliersRoutes";
import supplierItemsRoutes from "./routes/SupplierItemsRoutes";
import storeItemsRoutes from "./routes/StoreItemsRoutes";
import ordersRoutes from "./routes/OrdersRoutes";

import { errorMiddleware } from "./middlewares/errorMiddleware";


const app = express();

app.use(cors());
app.use(express.json());


app.use("/suppliers", suppliersRoutes);
app.use("/supplier_items", supplierItemsRoutes);
app.use("/store_items", storeItemsRoutes);
app.use("/orders", ordersRoutes);


const PORT: number = Number(process.env.PORT) || 8000;

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error('Missing MONGO_URL');
}

mongoose
        .connect(config.mongoUrl)
        .then(()=>{
            console.log("DB connected succsessfully.")
            app.listen(config.port,()=>{
                console.log(`server is running on port: ${config.port}`)
            });
        })
        .catch((error)=> console.log(error));


