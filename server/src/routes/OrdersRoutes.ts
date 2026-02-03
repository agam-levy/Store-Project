import { Router } from "express";
import { createOrder } from "../controller/orders_controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateBody } from "../middlewares/validate";
import { createOrderSchema } from "../validations/orders_validation";

const route = Router();

route.post("/", validateBody(createOrderSchema), asyncHandler(createOrder));

export default route;
