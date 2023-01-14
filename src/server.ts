import { config } from "dotenv";
import App from "./app";
import AuthenticationController from "../src/auth/authentication.controller";
import UserController from "../src/users/users.controller";
import validateEnv from "./utils/validateEnv";
import ProductController from "../src/products/products.controller";
import PartnerController from "../src/partners/partners.controller";
import RatingController from "../src/ratings/ratings.controller";
import OrderController from "../src/orders/orders.controller";
import CartController from "../src/carts/carts.controller";

config();
// validateEnv(process.env.NODE_ENV === "development" ? "dev" : "prod");
validateEnv();
const app = new App([new AuthenticationController(), new UserController(), new ProductController(), new PartnerController(), new RatingController(), new OrderController(), new CartController()]);

app.listen();
