import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import validationMiddleware from "../middlewares/validation";
import cartModel from "./carts.model";
import CreateCartDto from "./carts.dto";
import Controller from "../interfaces/controller";
import Cart from "../interfaces/icart";
//import UserNotFoundException from "../exceptions/UserNotFound";
import IdNotValidException from "../exceptions/IdNotValid";
import HttpError from "../exceptions/Http";
import authMiddleware from "../middlewares/auth";

export default class UserController implements Controller {
    path = "/carts";
    router = Router();
    private cart = cartModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllCarts);
        this.router.get(`${this.path}/:id`, this.getCartById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, authMiddleware, this.getPaginatedCarts);
        this.router.post(this.path, this.createCart);
        this.router.patch(`${this.path}/:id`, [validationMiddleware(CreateCartDto, true)], this.modifyCart);
        // this.router.patch(`${this.path}/:id`, [validationMiddleware(CreateCartDto, true)], this.addToCart);
        this.router.delete(`${this.path}/:id`, this.deleteCart);
    }

    private getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const carts = await this.cart.find();
            res.send(carts);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
    private getPaginatedCarts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order; // order?
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let carts = [];
            let count = 0;
            if (req.params.keyword) {
                const regex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.cart.find({ $or: [{ cartName: { $regex: regex } }, { description: { $regex: regex } }] }).count();
                carts = await this.cart
                    .find({ $or: [{ cartName: { $regex: regex } }, { description: { $regex: regex } }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.cart.countDocuments();
                carts = await this.cart
                    .find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, carts: carts });
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getCartById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const cart = await this.cart.findById(id);
            //if (!user) return next(new UserNotFoundException(id));

            res.send(cart);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
    private createCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cartData = req.body;
            const newcart = await this.cart.create({ ...cartData });
            if (!newcart) return next(new HttpError(400, "Failed to create product"));
            res.send(newcart);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
    private modifyCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const cartData: Cart = req.body;
            const cart = await this.cart.findByIdAndUpdate(id, cartData, { new: true });
            //if (!cart) return next(new UserNotFoundException(id));

            res.send(cart);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    // private addToCart = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const id = req.params.id;
    //         if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

    //         const cartData: Cart = req.body;
    //         const cart = await this.cart.findByIdAndUpdate(id, cartData, { new: true });
    //         //if (!cart) return next(new UserNotFoundException(id));

    //         res.send(cart);
    //     } catch (error) {
    //         next(new HttpError(400, error.message));
    //     }
    // };

    private deleteCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));
            res.sendStatus(200);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
}
