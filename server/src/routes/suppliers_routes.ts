import { Router } from "express";
import {createSupplier,getAllSuppliers,getSupplierById,changeNameSupplier,deleteSupplier,} from "../controller/suppliers_controller";

import { validateBody, validateParams } from "../middlewares/validate";
import { asyncHandler } from "../middlewares/asyncHandler";
import {createSupplierSchema,updateSupplierNameSchema,supplierIdParamSchema} from "../validations/suppliers_validation";

const route = Router();


route.post("/",validateBody(createSupplierSchema), asyncHandler(createSupplier));
route.get("/", asyncHandler(getAllSuppliers));
route.get("/:id",validateParams(supplierIdParamSchema),asyncHandler(getSupplierById));
route.put("/:id",validateParams(supplierIdParamSchema),validateBody(updateSupplierNameSchema),asyncHandler(changeNameSupplier));
route.delete("/:id",validateParams(supplierIdParamSchema),asyncHandler(deleteSupplier));

export default route;
