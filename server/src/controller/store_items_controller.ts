import { Request, Response } from "express";
import SupplierItem from "../models/supplier_items_model";
import StoreItem from "../models/store_items_model";

export const createStoreItem= async(req:Request,res:Response) => {
    try {
        const supplierItem= await SupplierItem.findById(req.body.supplierItem_id)
        if(!supplierItem){
            return res.status(404).json({ message: "Supplier item not found" });
        }
        if(!req.body.name||typeof req.body.name !== "string"){
            return res.status(400).json({message:"name input is not valid"})
        }
        if(req.body.sellPriceCents == undefined||typeof req.body.sellPriceCents !== "number" || req.body.sellPriceCents < 0){
            return res.status(400).json({message:"sellPriceCents input is not valid"})
        }
        if(!req.body.category||typeof req.body.category !== "string"){
            return res.status(400).json({message:"category input is not valid"})
        }
        if(!req.body.imageUrl||typeof req.body.imageUrl !== "string"){
            return res.status(400).json({message:"imageUrl input is not valid"})
        }

        
        const minSellPrice=Math.ceil(supplierItem.costPriceCents*1.3);
        let sellPriceCents=req.body.sellPriceCents;
        if(minSellPrice>req.body.sellPriceCents){
            sellPriceCents=minSellPrice;
        }
        

        const newStoreItems= new StoreItem({
            supplierItem_id:req.body.supplierItem_id,
            name:req.body.name,
            sellPriceCents:sellPriceCents,
            category:req.body.category,
            imageUrl:req.body.imageUrl,
            stock:0,
            color:req.body.color,
        });
        await newStoreItems.save();
        return res.status(200).json(newStoreItems);
        

    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
        
    }
}

export const restockStoreItem= async(req:Request,res:Response) => {
    try {
        const storeItem= await StoreItem.findById(req.params.id);
        const amount=req.body.amount;
        if(!storeItem){
            return res.status(404).json({ message: "Store item not found" });
        }
        if(amount==undefined||typeof amount !== "number" || amount < 0){
            return res.status(400).json({ message: "Stock input is not valid" });
        }
        storeItem.stock+=amount;
        await storeItem.save();
        return res.status(200).json(StoreItem);
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

export const getAllStoreItems= async(req:Request,res:Response) => {
    try {
        const storeItems= await StoreItem.find()
        return res.status(200).json(storeItems);
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }

}

export const getStoreItemById= async(req:Request,res:Response) => {
    try {
        const storeItem= await StoreItem.findById(req.params.id);
        if(!storeItem){
            return res.status(404).json({ message: "Store item not found" });
        }
        return res.status(200).json(storeItem);
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

export const deleteStoreItem= async(req:Request,res:Response) => {
    try {
        const storeItem= await StoreItem.findById(req.params.id);
        if(!storeItem){
            return res.status(404).json({ message: "Store item not found" });
        }
        await storeItem.deleteOne();
        return res.status(200).json({ message: "Store item deleted successfully" });
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: "Unknown error" });
    }
}

