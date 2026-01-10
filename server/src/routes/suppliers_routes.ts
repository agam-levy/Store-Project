

import express from "express"
import { createSupplier, getAllSuppliers, getSupplierById, changeNameSupplier, deleteSupplier } from "../controller/suppliers_controller"

const route = express.Router();
route.post("/", createSupplier);
route.get("/",getAllSuppliers);
route.get("/:id",getSupplierById);
route.put("/:id",changeNameSupplier);
route.delete("/suppliers/:id",deleteSupplier);

export default route;  