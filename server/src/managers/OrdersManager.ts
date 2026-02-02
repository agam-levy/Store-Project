import mongoose from "mongoose";
import StoreItem from "../models/StoreItemsModel";
import Order, { IOrderItem } from "../models/OrdersModel";
import { AppError } from "../errors/AppError";

type ReqItem = { item_id: string; quantity: number };

export class OrdersManager {
  static async createOrder(input: { address: string; storeItems: ReqItem[] }) {
    const { address, storeItems } = input;

    //makes sure there are no duplicate items in the order
    const uniqueIds = new Set(storeItems.map((i) => i.item_id));
    if (uniqueIds.size !== storeItems.length) {
      throw new AppError(400, "Duplicate item_id in order");
    }
    if(uniqueIds.size>10){
        throw new AppError(400, "Every order can have a maximum of 10 unique items") 
    }
        
    const totalQuantity = storeItems.reduce((sum, i) => sum + i.quantity, 0);
    if (totalQuantity > 50) {
      throw new AppError(400, "A customer can order a maximum of 50 items in total");
    }

    const ids = storeItems.map((i) => new mongoose.Types.ObjectId(i.item_id));

    
    const storeItemsFromDB = await StoreItem.find({ _id: { $in: ids } }).populate({
      path: "supplierItem_id",
      populate: { path: "supplier_id" },
    });

    if (storeItemsFromDB.length !== storeItems.length) {
      throw new AppError(400, "One or more items not found");
    }

    const quantityById = new Map<string, number>(storeItems.map((i) => [i.item_id, i.quantity]));


    let totalProfitCents = 0;
    let totalPriceCents = 0;
    const orderItems: IOrderItem[] = [];

    for (const dbItem of storeItemsFromDB) {
      const id = dbItem._id.toString();
      const quantity = quantityById.get(id);

      if (!quantity) throw new AppError(400, "quantity missing");

    
      if (quantity > dbItem.stock) {
        throw new AppError(409, `Out of stock for item ${dbItem.name}`);
      }

      const supplierItem: any = dbItem.supplierItem_id;
      if (!supplierItem || typeof supplierItem !== "object") {
        throw new AppError(500, "supplierItem not populated");
      }

      const supplier: any = supplierItem.supplier_id;
      if (!supplier || typeof supplier !== "object") {
        throw new AppError(500, "supplier not populated");
      }

      totalPriceCents += dbItem.sellPriceCents * quantity;
      totalProfitCents += (dbItem.sellPriceCents - supplierItem.costPriceCents) * quantity;

      orderItems.push({
        item_id: dbItem._id,
        supplierItem_id: supplierItem._id,
        supplier_id: supplier._id,


        name: dbItem.name,
        category: dbItem.category,
        supplierName: supplier.name,

        costPriceCents: supplierItem.costPriceCents,
        sellPriceCents: dbItem.sellPriceCents,
        quantity,
      });
    }


    const ops = storeItems.map((i) => ({
        updateOne: {
          filter: {
            _id: new mongoose.Types.ObjectId(i.item_id),
            stock: { $gte: i.quantity },
          },
          update: { $inc: { stock: -i.quantity } },
        },
    }));

    const bulkResult = await StoreItem.bulkWrite(ops, { ordered: true });

    if (bulkResult.modifiedCount !== storeItems.length) {
      throw new AppError(409, "Out of stock for one or more items");
    }


    const newOrder = await Order.create({
      items: orderItems,
      address,
      totalProfitCents,
      totalPriceCents,
    });

    return newOrder;
  }
}
