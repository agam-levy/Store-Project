import { Router } from "express";
import {createStoreItem,getAllStoreItems,getStoreItemById,restockStoreItem,deleteStoreItem,} from "../controller/store_items_controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateBody, validateParams } from "../middlewares/validate";
import {createStoreItemSchema,restockStoreItemSchema,storeItemIdParamSchema,} from "../validations/store_items_validation";

const route = Router();

route.post("/", validateBody(createStoreItemSchema), asyncHandler(createStoreItem));
route.get("/", asyncHandler(getAllStoreItems));
route.get("/:id", validateParams(storeItemIdParamSchema), asyncHandler(getStoreItemById));
route.put("/:id",validateParams(storeItemIdParamSchema),validateBody(restockStoreItemSchema),asyncHandler(restockStoreItem));
route.delete("/:id", validateParams(storeItemIdParamSchema), asyncHandler(deleteStoreItem));

export default route;
