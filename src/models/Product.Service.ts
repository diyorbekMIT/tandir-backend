import Errors from "../libs/Errrors";
import ProductModel from "../schema/Product.model";
import { Message } from "../libs/Errrors";
import { HttpCode } from "../libs/Errrors";
import { ProductInput, ProductUpdateInput } from "../libs/types/product";
import { Product } from "../libs/types/product";
import { shapeIntoMongooseObjectId } from "../libs/config";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  // Method to create a product
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try{
        return (await this.productModel.create(input)).toObject();
    } catch(err) {
        console.error("Error, model:createNewProduct:", err); 
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
}

   public async updateProduct(id: string, input: ProductInput): Promise<Product> {
    try{
        id = shapeIntoMongooseObjectId(id);
        const result = await this.productModel.findByIdAndUpdate({_id: id}, input, {new: true}).exec();
        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result.toObject();
    } catch(err) {
        console.error("Error, model:updateProduct:", err); 
        throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);
    }
   }

   public async getAllProducts(): Promise<Product[]> {
    
        const products = await this.productModel.find().exec();
        if (!products) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return products as [];
}
}




export default ProductService;
