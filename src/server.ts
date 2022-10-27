import { config } from "dotenv";
import App from "./app";
// import AuthenticationController from "./auth/index";
import UserController from "../src/users/users.controller";
import validateEnv from "./utils/validateEnv";

config();
// validateEnv(process.env.NODE_ENV === "development" ? "dev" : "prod");
validateEnv();
const app = new App([new UserController()]);

app.listen();
