import express, { Express, json } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import errorMiddleware from "./middlewares/error";
import Controller from "./interfaces/controller";
import cookieParser from "cookie-parser";

export default class App {
    public app: Express;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public getServer(): Express {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(json());
        this.app.use(cookieParser());
        // // Enabled CORS:
        // this.app.use(
        //     cors({
        //         origin: ["http://localhost:4000", "http://127.0.0.1:4000"],
        //         credentials: true,
        //     }),
        // );
        // this.app.use(loggerMiddleware);
        this.app.use(
            cors({
                origin: ["https://fanciful-pudding-2d9808.netlify.app/", "http://localhost:8080", "http://127.0.0.1:8080"],
                allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie", "Cache-Control", "Content-Language", "Expires", "Last-Modified", "Pragma"],
                credentials: true,
                exposedHeaders: ["Set-Cookie"],
            }),
        );
        this.app.use(morgan("dev"));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    //private async connectToTheDatabase() {
    // let connectionString: string;

    // if (process.env.NODE_ENV === "development") {
    //     connectionString = process.env.DEV_MONGO_URI;
    // } else if (process.env.NODE_ENV === "test") {
    //     connectionString = process.env.TEST_MONGO_URI;
    // } else {
    //     const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
    //     connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}${MONGO_DB}?retryWrites=true&w=majority`;
    // }
    // const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
    // mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}${MONGO_DB}?retryWrites=true&w=majority`, err => {
    //     if (err) {
    //         console.log("Unable to connect to the server. Please start MongoDB.");
    //     }
    // });

    // mongoose.connection.on("error", error => {
    //     console.log(`Mongoose error message: ${error.message}`);
    // });
    // mongoose.connection.on("connected", () => {
    //     console.log("

    private connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
        // Connect to MongoDB Atlas, create database if not exist::
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}${MONGO_DB}?retryWrites=true&w=majority`, err => {
            if (err) {
                console.log("Unable to connect to the server. Please start MongoDB.");
            }
        });

        mongoose.connection.on("error", error => {
            console.log(`Mongoose error message: ${error.message}`);
        });
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB server.");
        });
    }

    public listen(): void {
        // const port = process.env.NODE_ENV === "test" ? process.env.PORT + 1 : process.env.PORT;
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}
