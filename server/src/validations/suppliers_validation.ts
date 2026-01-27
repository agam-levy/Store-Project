import Joi from "joi";

export const createSupplierSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
});

export const updateSupplierNameSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
});

export const supplierIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

