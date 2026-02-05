import { Router } from "express";
import {createSupplierItem,getAllSupplierItems,getSupplierItemsById,changePriceSupplierItem,deleteSupplierItem} from "../controller/SupplierItemsController";

import { asyncHandler } from "../middlewares/asyncHandler";
import { validateBody, validateParams } from "../middlewares/validate";
import {createSupplierItemSchema,updateSupplierItemPriceSchema,supplierItemIdParamSchema} from "../validations/SupplierItemsValidation";

const route = Router();

route.post("/", validateBody(createSupplierItemSchema), asyncHandler(createSupplierItem));
route.get("/", asyncHandler(getAllSupplierItems));
route.get("/:id", validateParams(supplierItemIdParamSchema), asyncHandler(getSupplierItemsById));
route.put("/:id",validateParams(supplierItemIdParamSchema),validateBody(updateSupplierItemPriceSchema),asyncHandler(changePriceSupplierItem));
route.delete("/:id", validateParams(supplierItemIdParamSchema), asyncHandler(deleteSupplierItem));

export default route;
