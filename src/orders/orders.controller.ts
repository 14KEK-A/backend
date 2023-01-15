import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import validationMiddleware from "../middlewares/validation";
import orderModel from "./orders.model";
import CreateOrderDto from "./orders.dto";
import Controller from "../interfaces/controller";
import Order from "../interfaces/iorder";
import IdNotValidException from "../exceptions/IdNotValid";
import HttpError from "../exceptions/Http";
import authMiddleware from "../middlewares/auth";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import userModel from "../users/users.model";

export default class UserController implements Controller {
    path = "/orders";
    router = Router();
    private order = orderModel;
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllOrders);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOrderById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, authMiddleware, this.getPaginatedOrders);
        this.router.post(this.path, authMiddleware, this.createOrder);
        this.router.patch(`${this.path}/:id`, [validationMiddleware(CreateOrderDto, true), authMiddleware], this.modifyOrder);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteOrder);
    }

    private getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = this.getDataFromCookie(req);
            const user = await this.user.findById(user_id);

            if (user.role_name == "admin") {
                const orders = await this.order.find().populate("user_id");
                res.send(orders);
            } else {
                const orders = await this.order.find({ users_id: user_id });
                res.send(orders);
            }
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
    private getPaginatedOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order; // order?
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1

            const user_id = this.getDataFromCookie(req);
            const user = await this.user.findById(user_id);

            let orders = [];
            let count = 0;

            if (user.role_name != "admin") return next(new HttpError(401, "You don't have authorization!"));

            if (req.params.keyword) {
                const regex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.order.find({ $or: [{ orderName: { $regex: regex } }, { description: { $regex: regex } }] }).count();
                orders = await this.order
                    .find({ $or: [{ orderName: { $regex: regex } }, { description: { $regex: regex } }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.order.countDocuments();
                orders = await this.order
                    .find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, orders: orders });
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getOrderById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const user_id = this.getDataFromCookie(req);
            const user = await this.user.findById(user_id);

            const order = await this.order.findById(id);
            if (!order) return next(new HttpError(404, "Document doesn't exist."));
            //if (!user) return next(new UserNotFoundException(id));

            if (order.users_id == user_id || user.role_name == "admin") {
                res.send(order);
            } else {
                return next(new HttpError(401, "This order dosen't belong to the user logged in."));
            }
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = this.getDataFromCookie(req);
            const orderData: Order = req.body;
            orderData.users_id = user_id;

            const neworder = this.order.create({ ...orderData });

            if (!neworder) return next(new HttpError(400, "Failed to create order"));
            res.send(neworder);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private modifyOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const user_id = this.getDataFromCookie(req);
            const user = await this.user.findById(user_id);
            let order = await this.order.findById(id);

            if (order.users_id == user_id || user.role_name == "admin") {
                const orderData: Order = req.body;
                order = await this.order.findByIdAndUpdate(id, orderData, { new: true });
            } else {
                return next(new HttpError(401, "This order dosen't belong to the user logged in."));
            }

            //if (!order) return next(new UserNotFoundException(id));

            res.send(order);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const user_id = this.getDataFromCookie(req);
            const user = await this.user.findById(user_id);
            const order = await this.order.findById(id);

            if (order.users_id == user_id || user.role_name == "admin") {
                const successResponse = await this.order.findByIdAndDelete(id);
            } else {
                return next(new HttpError(400, "Order doesn't exist."));
            }

            res.sendStatus(200);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getDataFromCookie(req: Request): string {
        const cookies = req.cookies;
        const secret = process.env.JWT_SECRET;
        const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;

        const user_id = verificationResponse._id;

        return user_id;
    }
}
