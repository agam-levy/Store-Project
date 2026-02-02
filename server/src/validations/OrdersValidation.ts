import Joi from "joi";

export const createOrderSchema = Joi.object({
  address: Joi.string().trim().min(1).required(),
  storeItems: Joi.array()
    .items(
      Joi.object({
        item_id: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .max(10)
    .required(),
});
