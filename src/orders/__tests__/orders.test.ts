import request, { Response, SuperAgentTest } from "supertest";
import App from "../../app";
import AuthenticationController from "../../auth/authentication.controller";
import OrderController from "../../orders/orders.controller";
import ProductController from "../../products/products.controller";
import userModel from "../../users/users.model";
import productModel from "../../products/products.model";
import orderModel from "../orders.model";
import StatusCode from "../../utils/statusCodes";
import { Types } from "mongoose";
import type { Express } from "express";
import IProdcut from "../../interfaces/iproduct";
import IUser from "../../interfaces/iuser";
import IOrder from "../../interfaces/iorder";
import IOrderDetalis from "../../interfaces/iorderdetails";
import "dotenv/config";
import { execPath } from "process";

let server: Express;
let cookie: string | any;

beforeAll(async () => {
    server = new App([new AuthenticationController(), new OrderController(), new ProductController()]).getServer();
});

describe("ORDERS, not logged in", () => {
    it("any PATH, should return statuscode 401", async () => {
        expect.assertions(5);
        const allResponse = await request(server).get(`/orders`);
        const idResponse = await request(server).get(`/orders/61b5ea14f39e4edcf5b8a3bd`);
        const paginatedResponse = await request(server).get("/orders/offset/limit/order/sort/keyword`");
        const patchResponse = await request(server).patch("/order/61b5ea14f39e4edcf5b8a3bd");
        const deleteResponse = await request(server).delete(`/order/61b5ea14f39e4edcf5b8a3bd`);
        expect(allResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(idResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(paginatedResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(patchResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(deleteResponse.statusCode).toBe(StatusCode.Unauthorized);
    });
});

describe("ORDERS, logged in as user", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: "email@email.com",
            password: "password",
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /orders should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/orders").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("GET /orders/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/orders/61b5ea14f39e4edcf5b8a3bd").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /orders/:offset/:limit/:order/:sort/:keyword? should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/orders/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("PATCH /orders/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch("/orders/61b5ea14f39e4edcf5b8a3bd").set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    /*it("DELETE /orders/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch("/orders/61b5ea14f39e4edcf5b8a3bd").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});
