import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import suppliersRoutes from "./routes/suppliers_routes";
import supplierItemsRoutes from "./routes/supplier_items_routes";
import storeItemsRoutes from "./routes/store_items_routes";
import ordersRoutes from "./routes/orders_routes";


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
        .connect(MONGO_URL)
        .then(()=>{
            console.log("DB connected succsessfully.")
            app.listen(PORT,()=>{
                console.log(`server is running on port: ${PORT}`)
            });
        })
        .catch((error)=> console.log(error));


