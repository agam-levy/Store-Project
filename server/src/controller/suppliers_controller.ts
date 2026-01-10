import { Request, Response } from "express";
import Supplier from "../models/suppliers_model";
import SupplierItem from "../models/supplier_items_model";
import StoreItem from "../models/store_items_model";

export const createSupplier = async (req: Request, res: Response) => {
  try {
    if(!req.body.name||typeof req.body.name !== "string"){
      return res.status(400).json({message:"name input is not valid"})
    }
    const newSupplier = new Supplier({name: req.body.name,});

    await newSupplier.save();
    return res.status(200).json(newSupplier);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ errorMessage: error.message });
    }
    return res.status(500).json({ errorMessage: "Unknown error" });
  }
}

export const getAllSuppliers = async (req: Request, res: Response) => {
    try {
      const suppliers = await Supplier.find();
      
      return res.status(200).json(suppliers);
    } catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

export const getSupplierById = async (req: Request, res: Response) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      return res.status(200).json(supplier);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

export const changeNameSupplier = async (req: Request, res: Response) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        if (!req.body.name) {
            return res.status(400).json({ message: "Name is required" });
        }
        supplier.name = req.body.name;
        const updatedSupplier = await supplier.save();
        return res.status(200).json(updatedSupplier);
  
    } catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
      }
}


export const deleteSupplier = async (req: Request, res: Response) => {
    try {
      const supplierId=req.params.id;
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // {a1, a2, a3} : list of supplier item ids
      const supplierItemIds = await SupplierItem.distinct("_id",{ supplier_id: supplierId });
      if (supplierItemIds.length == 0){
        await supplier.deleteOne();
        return res.status(200).json({ message: "Supplier deleted successfully" }); 
      } 

      await StoreItem.deleteMany({ supplier_item_id: { $in: supplierItemIds } });
      await SupplierItem.deleteMany({  supplier_id: supplierId } );
      await supplier.deleteOne();

      return res.status(200).json({ message: "Supplier and all its items deleted successfully" });
        
    } catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}