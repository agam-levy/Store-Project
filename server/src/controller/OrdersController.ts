import { Request, Response } from "express";
import { OrdersManager } from "../managers/OrdersManager";

export const createOrder = async (req: Request, res: Response) => {
  const created = await OrdersManager.createOrder(req.body);
  res.status(201).json(created);
};
