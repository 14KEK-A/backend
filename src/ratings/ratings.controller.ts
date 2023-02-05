import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller";
import CreateRatingsDto from "./ratings.dto";
import IdNotValidException from "../exceptions/IdNotValid";
import Rating from "../interfaces/irating";
import { Types } from "mongoose";
import ratingModel from "./ratings.model";
import validationMiddleware from "../middlewares/validation";
import HttpError from "../exceptions/Http";
import authMiddleware from "../middlewares/auth";
import getDataFromCookie from "../utils/dataFromCookie";
import userModel from "../users/users.model";
export default class RatingController implements Controller {
    public path = "/ratings";
    public router = Router();
    private rating = ratingModel;
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllRatings);
        this.router.get(`${this.path}/:id`, this.getRatingById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, authMiddleware, this.getPaginatedRatings);
        this.router.post(this.path, [authMiddleware, validationMiddleware(CreateRatingsDto, false)], this.createRating);
        this.router.patch(`${this.path}/:id`, [validationMiddleware(CreateRatingsDto, true), authMiddleware], this.modifyRating);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteRating);
    }

    private getAllRatings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getDataFromCookie(req);
            const user = await this.user.findById(userId);
            if (user.role_name != "admin") return next(new HttpError(401, "You don't have permisson to get that!"));

            const ratings = await this.rating.find();
            res.send(ratings);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getPaginatedRatings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getDataFromCookie(req);
            const user = await this.user.findById(userId);
            if (user.role_name != "admin") return next(new HttpError(401, "You don't have permisson to get that!"));

            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order; // order?
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let ratings = [];
            let count = 0;
            if (req.params.keyword) {
                const regex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.rating.find({ $or: [{ ratingName: { $regex: regex } }, { description: { $regex: regex } }] }).count();
                ratings = await this.rating
                    .find({ $or: [{ ratingName: { $regex: regex } }, { description: { $regex: regex } }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.rating.countDocuments();
                ratings = await this.rating
                    .find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, ratings: ratings });
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getRatingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const rating = await this.rating.findById(id);
            // if (!rating) return next(new UserNotFoundException(id));

            res.send(rating);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private modifyRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getDataFromCookie(req);
            const user = await this.user.findById(userId);

            const id = req.params.id;
            //if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const ratingData: Rating = req.body;
            let rating = await this.rating.findById(id);
            if (user.role_name != "admin" && rating.users_id != userId) return next(new HttpError(401, "You don't have permisson to do that!"));
            rating = await this.rating.findByIdAndUpdate(id, ratingData, { new: true });
            //if (!user) return next(new UserNotFoundException(id));

            res.send(rating);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
    private createRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ratingData = req.body;
            const newrating = await this.rating.create({ ...ratingData });
            if (!newrating) return next(new HttpError(400, "Failed to create product"));
            res.send(newrating);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private deleteRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getDataFromCookie(req);
            const user = await this.user.findById(userId);

            const id = req.params.id;
            //if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const rating = await this.rating.findById(id);
            if (user.role_name != "admin" && rating.users_id != userId) return next(new HttpError(401, "You don't have permisson to do that!"));

            const successResponse = await this.rating.findByIdAndDelete(id);
            if (!successResponse) return next(new HttpError(400, "An error occured."));

            res.sendStatus(200);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
}
