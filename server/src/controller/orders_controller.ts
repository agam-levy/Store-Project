import { Request, Response } from "express";
import StoreItem from "../models/store_items_model";
import Order, { IOrderItem } from "../models/orders_model";


type ReqItem = { item_id: string; quantity: number };

type CreateOrderBody = {
  storeItems: ReqItem[];
};


  

export const createOrder= async(req:Request,res:Response) => {
    try {
        const { storeItems} = req.body as CreateOrderBody;

        if(!storeItems||!Array.isArray(storeItems)||storeItems.length===0){
            return res.status(400).json({message:"items input is not valid"})
        }
        if(!req.body.address||typeof req.body.address !== "string"){
            return res.status(400).json({message:"address input is not valid"})
        }
        if(storeItems.length>10 ){
            return res.status(400).json({message:"Every order can have a maximum of 10 unique items"})
        }

        //array of store items- from db 
        const storeItemsFromDB = await StoreItem.find({
            _id: { $in: storeItems.map(i => i.item_id) },
        }).populate({
            path: "supplierItem_id", //the supplier item object instead of the id
            populate: { path: "supplier_id" } //the supplier object instead of the id
        });

        if(storeItemsFromDB.length !== storeItems.length){
            return res.status(400).json({message:"One or more items not found"})
        }


        // array: item_id -> quantity
        const quantityById = new Map<string, number>(
        storeItems.map(i => [i.item_id, i.quantity])
        );

        let totalProfitCents=0,totalPriceCents=0, totalQuantity=0;
        const orderItems: IOrderItem[] = [];

        for (const dbItem of storeItemsFromDB) {
            const id = dbItem._id.toString();
            const quantity = quantityById.get(id);

            if (quantity === undefined) {
               return res.status(400).json({ message: "quantity missing" });
            }

            if (quantity <= 0) {
                return res.status(400).json({ message: "quantity must be >= 1" });
            }

            if (quantity > dbItem.stock) {
              return res.status(409).json({ message: `Out of stock for item ${dbItem.name}` });
            }

            totalQuantity+=quantity;
            if(totalQuantity>50){
                return res.status(400).json({message:"Every order can have a maximum of 50 items"})
            }

            totalPriceCents+=dbItem.sellPriceCents*quantity;

            const supplierItem = dbItem.supplierItem_id;
            if (!supplierItem ||typeof supplierItem !== "object" ||!("costPriceCents" in supplierItem)) {
                return res.status(500).json({ message: "supplierItem not populated" });
            }
            totalProfitCents+=(dbItem.sellPriceCents-supplierItem.costPriceCents)*quantity;

            const supplier = supplierItem.supplier_id;
            if (!supplier || typeof supplier !== "object" || !("_id" in supplier) || !("name" in supplier)) {
                return res.status(500).json({ message: "supplier not populated" });
            }

            dbItem.stock -= quantity;
            await dbItem.save();

            orderItems.push({
                item_id: dbItem._id,
                supplierItem_id: supplierItem._id,
                supplier_id: supplier._id,
        
                //snapshot
                name: dbItem.name,
                category: dbItem.category,
                supplierName: supplier.name,
        
                costPriceCents: supplierItem.costPriceCents,
                sellPriceCents: dbItem.sellPriceCents,
        
                quantity,
            });

        }

        const newOrder = new Order({
            items: orderItems,
            address: req.body.address,
            totalProfitCents: totalProfitCents,
            totalPriceCents: totalPriceCents,
        });
        await newOrder.save();
        return res.status(200).json(newOrder);

    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message:error.message})
        }
        return res.status(500).json({message:"Unknown error"})
    }

}
