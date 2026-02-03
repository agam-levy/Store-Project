import { Request, Response } from "express";
import { SuppliersManager } from "../managers/SuppliersManager";

export const createSupplier = async (req: Request, res: Response) => {
  const created = await SuppliersManager.createSupplier(req.body.name);
  res.status(201).json(created);
};

export const getAllSuppliers = async (req: Request, res: Response) => {
  const suppliers = await SuppliersManager.getAllSuppliers();
  res.status(200).json(suppliers);
};

export const getSupplierById = async (req: Request, res: Response) => {
  const supplier = await SuppliersManager.getSupplierById(req.params.id);
  res.status(200).json(supplier);
};

export const changeNameSupplier = async (req: Request, res: Response) => {
  const updated = await SuppliersManager.changeNameSupplier(req.params.id, req.body.name);
  res.status(200).json(updated);
};

export const deleteSupplier = async (req: Request, res: Response) => {
  const result = await SuppliersManager.deleteSupplierAndCascade(req.params.id);
  res.status(200).json({
    message: "Supplier and related data deleted successfully",
    ...result,
  });
};
