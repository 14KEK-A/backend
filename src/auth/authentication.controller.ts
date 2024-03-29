import * as bcrypt from "bcrypt";
import { Router, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import UserEmailAlreadyExists from "../exceptions/UserEmailAlreadyExists";
import WrongCredentialsException from "../exceptions/WrongCredentials";
import HttpException from "../exceptions/Http";
import Controller from "../interfaces/controller";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import TokenData from "../interfaces/tokenData";
import validationMiddleware from "../middlewares/validation";
import User from "../interfaces/iuser";
import userModel from "../users/users.model";
import CreateUserDto from "../users/users.dto";
import LogInDto from "./logIn.dto";
import { OAuth2Client } from "google-auth-library";
import IGoogleUserInfo from "interfaces/googleUserInfo";

export default class AuthenticationController implements Controller {
    public path = "/auth";
    public router = Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        this.router.post(`${this.path}/google`, this.loginAndRegisterWithGoogle);
    }

    private registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            if (await this.user.findOne({ email: userData.email })) {
                next(new UserEmailAlreadyExists(userData.email));
            } else {
                const hashedPassword = await bcrypt.hash(userData.password, 10);

                const user = await this.user.create({
                    ...userData,
                    password: hashedPassword,
                });
                user.password = undefined;
                const tokenData: TokenData = this.createToken(user);
                res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                res.send(user);
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const logInData: User = req.body;
            const user = await this.user.findOne({ email: logInData.email });
            if (user) {
                const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined;
                    const tokenData = this.createToken(user);
                    res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                    res.send(user);
                } else {
                    next(new WrongCredentialsException());
                }
            } else {
                next(new WrongCredentialsException());
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private loggingOut = (req: Request, res: Response) => {
        res.setHeader("Set-Cookie", ["Authorization=; SameSite=None; Secure; Path=/; Max-age=0"]);
        res.sendStatus(200);
    };

    private loginAndRegisterWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const client: OAuth2Client = new OAuth2Client();
            const verifyToken = async (token: string) => {
                client.setCredentials({ access_token: token });
                const userinfo = await client.request({
                    url: "https://www.googleapis.com/oauth2/v3/userinfo",
                });
                return userinfo.data;
            };

            verifyToken(req.body.atoken)
                .then(userInfo => {
                    const googleUser = userInfo as IGoogleUserInfo;
                    this.user.findOne({ email: googleUser.email }).then(user => {
                        if (user) {
                            const tokenData = this.createToken(user);
                            res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                            res.send(user);
                        } else {
                            // Register as new Google user
                            this.user
                                .create({
                                    ...googleUser,
                                    password: "stored at Google",
                                })
                                .then(user => {
                                    const tokenData: TokenData = this.createToken(user);
                                    res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                                    res.send(user);
                                });
                        }
                    });
                })
                .catch(() => {
                    next(new WrongCredentialsException());
                });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; SameSite=None; Secure; Path=/; Max-Age=${tokenData.expiresIn}`;
    }

    private createToken(user: User): TokenData {
        const expiresIn = 24 * 60 * 60; // 1 day
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id.toString(),
            //role_name: user.role_name.toString(),
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
