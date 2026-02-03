import Joi from "joi";

export const supplierIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const supplierItemIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const createSupplierItemSchema = Joi.object({
  supplier_id: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().min(1).required(),
  costPriceCents: Joi.number().integer().min(0).required(),
});

export const updateSupplierItemPriceSchema = Joi.object({
  costPriceCents: Joi.number().integer().min(0).required(),
});
