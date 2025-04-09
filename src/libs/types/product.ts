import { ProductCollection, ProductSize, ProductStatus, ProductVolume } from "../enums/product.enum";
import mongoose, {ObjectId, Types} from "mongoose";

export interface Product {
    _id: mongoose.Types.ObjectId;
    productStatus: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize : ProductSize;
    productVolume?:ProductVolume;
    productDesc: String;
    productImages: string[];
    productViews: number;
    createdAt: Date;
    updatedAt: Date;

}

export interface ProductInput {
    productStatus?: ProductStatus; // Optional, with correct type
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize?: ProductSize;
    productVolume?: ProductVolume;
    productDesc?: string; // Use lowercase 'string' for consistency
    productImages?: string[];
    productViews?: number;
}

export interface ProductUpdateInput {
    _id: Types.ObjectId;
    productStatus?: ProductStatus;
    productCollection?: ProductCollection;
    productName?: string;
    productPrice?:number;
    productLeftCount?: number;
    productSize?: ProductSize;
    productVolume?: number;
    productDesc?:string;
    productImages?: string[];
    productViews?: number;    
}