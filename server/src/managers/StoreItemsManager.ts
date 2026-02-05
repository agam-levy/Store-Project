import SupplierItem from "../models/SupplierItemsModel";
import StoreItem from "../models/StoreItemsModel";
import { AppError } from "../errors/AppError";

export class StoreItemsManager {
  static async createStoreItem(input: {
    supplierItem_id: string;
    name: string;
    sellPriceCents: number;
    category: string;
    imageUrl?: string;
    color: string;
  }) {
    const supplierItem = await SupplierItem.findById(input.supplierItem_id);
    if (!supplierItem) throw new AppError(404, "Supplier item not found");


    const minSellPriceCents = Math.ceil(supplierItem.costPriceCents * 1.3);
    const finalSellPriceCents = Math.max(input.sellPriceCents, minSellPriceCents);

    const created = await StoreItem.create({
      supplierItem_id: input.supplierItem_id,
      name: input.name,
      sellPriceCents: finalSellPriceCents,
      category: input.category,
      imageUrl: input.imageUrl,
      stock: 0,
      color: input.color,
    });

    return { created, minSellPriceCents, finalSellPriceCents };
  }

  static async restockStoreItem(id: string, amount: number) {
    const updated = await StoreItem.findByIdAndUpdate(
      id,
      { $inc: { stock: amount } },
      { new: true, runValidators: true }
    );

    if (!updated) throw new AppError(404, "Store item not found");
    return updated;
  }

  static async getAllStoreItems() {
    return StoreItem.find();
  }

  static async getStoreItemById(id: string) {
    const storeItem = await StoreItem.findById(id);
    if (!storeItem) throw new AppError(404, "Store item not found");
    return storeItem;
  }

  static async deleteStoreItem(id: string) {
    const deleted = await StoreItem.findByIdAndDelete(id);
    if (!deleted) throw new AppError(404, "Store item not found");
    return deleted;
  }
}
