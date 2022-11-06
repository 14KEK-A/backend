import { Router, Request, Response, NextFunction } from "express";
import validation from "../middlewares/validation";
import HttpError from "../exceptions/Http";
import Controller from "../interfaces/controller";
import productModel from "./products.model";
import orderModel from "../orders/orders.model";

export default class ProductController implements Controller {
    path = "/product";
    router = Router();
    private product = productModel;
    private order = orderModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/all`, this.getAllProducts);
        this.router.get(`${this.path}/:id`, this.getProductById);
        this.router.post(this.path, this.createProduct);
        this.router.delete(`${this.path}/:id`, this.deleteProductById);
    }

    private getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await this.product.find();
            res.send(products);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId: string = req.params.id;
            // if (!(await isIdValid(this.product, [productId], next))) return;

            const product = await this.product.findById(productId);
            if (!product) return next(new HttpError(404, `Failed to get product by id ${productId}`));

            res.send(product);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productData = req.body;
            const newproduct = await this.product.create({ ...productData });
            if (!newproduct) return next(new HttpError(400, "Failed to create product"));
            res.send(newproduct);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId: string = req.params.id;
            // if (!(await isIdValid(this.product, [productId], next))) return;

            const response = await this.product.findByIdAndDelete(productId);
            if (!response) return next(new HttpError(404, `Failed to delete product by id ${productId}`));

            res.sendStatus(200);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
}
