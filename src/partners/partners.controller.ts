import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import validationMiddleware from "../middlewares/validation";
import partnerModel from "./partners.model";
import CreatePartnerDto from "./partners.dto";
import Controller from "../interfaces/controller";
import Partner from "../interfaces/ipartner";
//import UserNotFoundException from "../exceptions/UserNotFound";
import IdNotValidException from "../exceptions/IdNotValid";
import HttpError from "../exceptions/Http";

export default class UserController implements Controller {
    path = "/partners";
    router = Router();
    private partner = partnerModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPartners);
        this.router.get(`${this.path}/:id`, this.getPartnerById);
        this.router.patch(`${this.path}/:id`, [validationMiddleware(CreatePartnerDto, true)], this.modifyPartner);
        this.router.delete(`${this.path}/:id`, this.deletePartner);
    }

    private getAllPartners = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const partners = await this.partner.find();
            res.send(partners);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private getPartnerById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const partner = await this.partner.findById(id);
            //if (!user) return next(new UserNotFoundException(id));

            res.send(partner);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private modifyPartner = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            const partnerData: Partner = req.body;
            const partner = await this.partner.findByIdAndUpdate(id, partnerData, { new: true });
            //if (!partner) return next(new UserNotFoundException(id));

            res.send(partner);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };

    private deletePartner = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Types.ObjectId.isValid(id)) return next(new IdNotValidException(id));

            //const successResponse = await this.partner.findByIdAndDelete(id);
            //if (!successResponse) return next(new UserNotFoundException(id));

            res.sendStatus(200);
        } catch (error) {
            next(new HttpError(400, error.message));
        }
    };
}
