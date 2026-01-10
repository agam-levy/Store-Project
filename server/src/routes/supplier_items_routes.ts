import express from "express"
import { createSupplierItem, getAllSupplierItems, getSupplierItemsById, changePriceSupplierItem, deleteSupplierItem } from "../controller/supplier_items_controller"

const route = express.Router();
route.post("/", createSupplierItem);
route.get("/", getAllSupplierItems);
route.get("/:id", getSupplierItemsById);
route.put("/:id", changePriceSupplierItem);
route.delete("/:id", deleteSupplierItem);

export default route;