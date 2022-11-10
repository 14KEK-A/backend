import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import validationMiddleware from "../middlewares/validation";
import orderModel from "./orders.model";
import CreateOrderDto from "./orders.dto";
import Controller from "../interfaces/controller";
import Order from "../interfaces/iorder";
import IdNotValidException from "../exceptions/IdNotValid";
import HttpError from "../exceptions/Http";

export default class UserController implements Controller {
    path = "/orders";
    router = Router();
    private order = orderModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllOrders);
        this.router.get(`${this.path}/:id`, this.getOrderById);
        this.router.patch(`${this.path}/:id`, [validationMiddleware(CreateOrderDto, true)], this.modifyOrder);
        this.router.delete(`${this.path}/:id`, this.deleteOrder);
    }

    private getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await this.order.find();
            res.send(orders);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getOrderById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const order = await this.order.findById(id);
            //if (!user) return next(new UserNotFoundException(id));

            res.send(order);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private modifyOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const orderData: Order = req.body;
            const order = await this.order.findByIdAndUpdate(id, orderData, { new: true });
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

            //const successResponse = await this.user.findByIdAndDelete(id);
            //if (!successResponse) return next(new UserNotFoundException(id));

            res.sendStatus(200);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
}
