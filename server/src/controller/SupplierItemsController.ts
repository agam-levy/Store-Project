import { Request, Response } from "express";
import { SupplierItemsManager } from "../managers/SupplierItemsManager";

export const createSupplierItem = async (req: Request, res: Response) => {
  const created = await SupplierItemsManager.createSupplierItem(req.body);
  res.status(201).json(created);
};

export const getAllSupplierItems = async (req: Request, res: Response) => {
  const items = await SupplierItemsManager.getAllSupplierItems();
  res.status(200).json(items);
};

export const getSupplierItemsById = async (req: Request, res: Response) => {
  const item = await SupplierItemsManager.getSupplierItemById(req.params.id);
  res.status(200).json(item);
};

export const changePriceSupplierItem = async (req: Request, res: Response) => {
  const result = await SupplierItemsManager.changeSupplierItemPrice(
    req.params.id,
    req.body.costPriceCents
  );

  res.status(200).json({
    message: "Supplier item price changed successfully",
    ...result,
  });
};

export const deleteSupplierItem = async (req: Request, res: Response) => {
  const result = await SupplierItemsManager.deleteSupplierItemAndCascade(req.params.id);
  res.status(200).json({
    message: "Supplier item and all its store items deleted successfully",
    ...result,
  });
};
