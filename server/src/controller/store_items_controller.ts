import { Request, Response } from "express";
import { StoreItemsManager } from "../managers/store_items_manager";

export const createStoreItem = async (req: Request, res: Response) => {
  const result = await StoreItemsManager.createStoreItem(req.body);

  res.status(201).json({
    storeItem: result.created,
    minSellPriceCents: result.minSellPriceCents,
    finalSellPriceCents: result.finalSellPriceCents,
  });
};

export const restockStoreItem = async (req: Request, res: Response) => {
  const updated = await StoreItemsManager.restockStoreItem(req.params.id, req.body.amount);
  res.status(200).json(updated);
};

export const getAllStoreItems = async (req: Request, res: Response) => {
  const items = await StoreItemsManager.getAllStoreItems();
  res.status(200).json(items);
};

export const getStoreItemById = async (req: Request, res: Response) => {
  const item = await StoreItemsManager.getStoreItemById(req.params.id);
  res.status(200).json(item);
};

export const deleteStoreItem = async (req: Request, res: Response) => {
  await StoreItemsManager.deleteStoreItem(req.params.id);
  res.status(200).json({ message: "Store item deleted successfully" });
};
