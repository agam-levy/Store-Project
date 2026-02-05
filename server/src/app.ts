//הוא מגדיר איך השרת יתבצע
import express from "express";
import cors from "cors";

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


app.use(errorMiddleware);

export default app;
