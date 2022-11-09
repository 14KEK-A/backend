import { NextFunction, Request, Response, Router } from "express";

import Controller from "../interfaces/controller";
import CreateRatingsDto from "./ratings.dto";
import HttpException from "../exceptions/Http";
import IdNotValidException from "../exceptions/IdNotValid";
import Rating from "../interfaces/irating";
import { Types } from "mongoose";
import ratingModel from "./ratings.model";
import validationMiddleware from "../middlewares/validation";
import HttpError from "../exceptions/Http";
export default class RatingController implements Controller {
    public path = "/ratings";
    public router = Router();
    private rating = ratingModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllRatings);
        this.router.get(`${this.path}/:id`, this.getRatingById);
        this.router.patch(`${this.path}/:id`, [validationMiddleware(CreateRatingsDto, true)], this.modifyRating);
        this.router.delete(`${this.path}/:id`, this.deleteRating);
    }

    private getAllRatings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ratings = await this.rating.find();
            res.send(ratings);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    /* private getPaginatedRecipes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order;
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let recipes = [];
            let count = 0;
            if (req.params.keyword) {
                const regex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.recipeM.find({ $or: [{ recipeName: { $regex: regex } }, { description: { $regex: regex } }] }).count();
                recipes = await this.recipeM
                    .find({ $or: [{ recipeName: { $regex: regex } }, { description: { $regex: regex } }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.recipeM.countDocuments();
                recipes = await this.recipeM
                    .find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, recipes: recipes });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
*/
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
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const ratingData: Rating = req.body;
            const rating = await this.rating.findByIdAndUpdate(id, ratingData, { new: true });
            //if (!user) return next(new UserNotFoundException(id));

            res.send(rating);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private deleteRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            //const successResponse = await this.rating.findByIdAndDelete(id);
            // if (!successResponse) return next(new UserNotFoundException(id));

            res.sendStatus(200);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
}