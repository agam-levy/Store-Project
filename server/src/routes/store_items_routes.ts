import express from "express"
import { createStoreItem, getAllStoreItems, getStoreItemById, restockStoreItem, deleteStoreItem } from "../controller/store_items_controller"

const route = express.Router();
route.post("/", createStoreItem);
route.get("/", getAllStoreItems);
route.get("/:id", getStoreItemById);
route.put("/:id", restockStoreItem);
route.delete("/:id", deleteStoreItem);

export default route;