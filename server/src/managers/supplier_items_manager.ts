import Supplier from "../models/suppliers_model";
import SupplierItem from "../models/supplier_items_model";
import StoreItem from "../models/store_items_model";
import { AppError } from "../errors/AppError";

export class SupplierItemsManager {
  static async createSupplierItem(input: {
    supplier_id: string;
    name: string;
    costPriceCents: number;
  }) {
    const supplier = await Supplier.findById(input.supplier_id);
    if (!supplier) throw new AppError(404, "Supplier not found");

    const created = await SupplierItem.create({
      supplier_id: input.supplier_id,
      name: input.name,
      costPriceCents: input.costPriceCents,
    });

    return created;
  }

  static async getAllSupplierItems() {
    return SupplierItem.find();
  }

  static async getSupplierItemById(id: string) {
    const supplierItem = await SupplierItem.findById(id);
    if (!supplierItem) throw new AppError(404, "Supplier item not found");
    return supplierItem;
  }

  static async changeSupplierItemPrice(id: string, costPriceCents: number) {
    const updatedSupplierItem = await SupplierItem.findByIdAndUpdate(
      id,
      { $set: { costPriceCents } },
      { new: true, runValidators: true }
    );

    if (!updatedSupplierItem) throw new AppError(404, "Supplier item not found");


    const minSellPriceCents = Math.ceil(costPriceCents * 1.3);

    const updateResult = await StoreItem.updateMany(
      {
        supplierItem_id: id,
        sellPriceCents: { $lt: minSellPriceCents },
      },
      { $set: { sellPriceCents: minSellPriceCents } }
    );

    return { updatedSupplierItem, minSellPriceCents, updateResult };
  }

  static async deleteSupplierItemAndCascade(id: string) {
    const supplierItem = await SupplierItem.findById(id);
    if (!supplierItem) throw new AppError(404, "Supplier item not found");


    const storeRes = await StoreItem.deleteMany({ supplierItem_id: id });
    await supplierItem.deleteOne();

    return {
      deletedSupplierItem: true,
      deletedStoreItems: storeRes.deletedCount ?? 0,
    };
  }
}
