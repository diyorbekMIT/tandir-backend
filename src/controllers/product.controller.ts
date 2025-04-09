import { AdminRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errrors";
import  { Response , Request} from "express";
import ProductService from "../models/Product.Service";
import { Product, ProductInput, ProductUpdateInput } from "../libs/types/product";
import { ProductSize } from "../libs/enums/product.enum";
import { ProductStatus } from "../libs/enums/product.enum";
import { ProductVolume } from "../libs/enums/product.enum";


const productService = new ProductService();

const productController: T = {};

productController.getAllProducts = async (req: AdminRequest, res: Response) => {
    try {
        console.log("getAllProducts");
        const result = await productService.getAllProducts();
        res.render("products", {products: result});
        console.log(result);
      
       
        // TODO: Token
    } catch (err) {
        console.log("Error, getAllProducts", err);
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard)
    }
};

productController.createProduct = async (req: AdminRequest, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
        }

        const data: ProductInput = {
            productStatus: req.body.productStatus || ProductStatus.PAUSE,
            productCollection: req.body.productCollection,
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productLeftCount: req.body.productLeftCount,
            productSize: req.body.productSize || ProductSize.NORMAL,
            productVolume: req.body.productVolume || ProductVolume.ONE,
            productDesc: req.body.productDesc || "",
            productImages: req.files.map((ele) => ele.path),
            productViews: req.body.productViews || 0,
        };

        if (!data.productName || !data.productPrice || !data.productLeftCount || !data.productCollection) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }

      
        const newProduct = await productService.createNewProduct(data);

        res.send(
            `<script>alert("Successful creation"); window.location.replace('/admin/product/all');</script>`
        );
        console.log(newProduct);
    } catch (err) {
        console.log("Error, createProduct", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script>alert("${message}"); window.location.replace('/admin/product/all');</script>`
        );
    }
};

productController.updateProduct = async (req: AdminRequest, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
        console.log(id);
        const data: ProductInput = req.body;
        const result: Product = await productService.updateProduct(id, data)
       
        console.log(result);

        res.status(HttpCode.OK) // Send updated product
    } catch (err) {
        console.log("Error, updateProduct", err);
        res.status(Errors.standard.code).json(Errors.standard);
    }
}

export default productController;