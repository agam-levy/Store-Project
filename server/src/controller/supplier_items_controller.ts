import { Request, Response } from "express";
import Supplier from "../models/suppliers_model";
import SupplierItem from "../models/supplier_items_model";
import StoreItem from "../models/store_items_model";


export const createSupplierItem = async (req: Request, res: Response) => {
    try {
        /*
        console.log("BODY:", req.body);
        console.log("supplier_id:", req.body?.supplier_id);
        */
        const supplier= await Supplier.findById(req.body.supplier_id)
        if(!supplier){
            return res.status(404).json({ message: "Supplier not found" });
        }
        if(!req.body.name||typeof req.body.name !== "string"){
            return res.status(400).json({message:"name input is not valid"})
        }
        if(req.body.costPriceCents == undefined||typeof req.body.costPriceCents !== "number" || req.body.costPriceCents < 0){
            return res.status(400).json({message:"costPriceCents input is not valid"})
        }
        const newSupplierItem= new SupplierItem({
            supplier_id: req.body.supplier_id,
            name:req.body.name,
            costPriceCents:req.body.costPriceCents,
        });

        await newSupplierItem.save();
        return res.status(200).json(newSupplierItem);
    } catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

export const getAllSupplierItems= async (req: Request, res: Response) => {
    try {
        const supplier_items=await SupplierItem.find()
        return res.status(200).json(supplier_items)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

export const getSupplierItemsById= async(req:Request,res:Response) => {
    try {
        const supplier=await SupplierItem.findById(req.params.id);
        if(!supplier){
            return res.status(404).json({ message: "Supplier item not found" });
        }
        return res.status(200).json(supplier);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

export const changePriceSupplierItem= async(req:Request,res:Response) => {
    try {
        const supplierItemId=req.params.id;
        const costPriceCents=req.body.costPriceCents;
        const supplierItem= await SupplierItem.findById(supplierItemId);
        if(!supplierItem){
            return res.status(404).json({ message: "Supplier item not found" });
        }
        if (costPriceCents == undefined || typeof costPriceCents !== "number" || costPriceCents < 0) {
            return res.status(400).json({ message: "Cost price input is not valid" });
        }
        supplierItem.costPriceCents=costPriceCents;
        const newSupplierItems= await supplierItem.save();

        // update the store items that their sell price is less than the min cost price
        const minSellPriceCents = Math.ceil(costPriceCents * 1.3);// ceil- מעגל למעלה
        const updateResult = await StoreItem.updateMany(
            {
              supplierItem_id: supplierItemId,
              sellPriceCents: { $lt: minSellPriceCents }, // $it: less than
            },
            { $set: { sellPriceCents: minSellPriceCents } }
        );
        return res.status(200).json({ message: "Supplier item price changed successfully", updateResult });


    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
        
    }
}

export const deleteSupplierItem= async(req:Request,res:Response) => {
    try {
        const supplierItemId=req.params.id;
        const supplierItem= await SupplierItem.findById(supplierItemId);
        if(!supplierItem){
            return res.status(404).json({ message: "Supplier item not found" });
        }

        await StoreItem.deleteMany({ supplier_item_id: supplierItemId });
        await supplierItem.deleteOne();
        return res.status(200).json({ message: "Supplier item and all its store items deleted successfully" });      

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
        
    }
}