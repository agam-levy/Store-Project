import express from "express"
import { createOrder } from "../controller/orders_controller"

const route = express.Router();
route.post("/", createOrder);

export default route;