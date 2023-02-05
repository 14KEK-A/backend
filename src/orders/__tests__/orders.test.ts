import request, { Response, SuperAgentTest } from "supertest";
import App from "../../app";
import AuthenticationController from "../../auth/authentication.controller";
import OrderController from "../../orders/orders.controller";
import ProductController from "../../products/products.controller";
import StatusCode from "../../utils/statusCodes";
import type { Express } from "express";
import "dotenv/config";

let server: Express;
let cookie: string | any;
const { USER_NAME, USER_PASS, ADMIN_NAME, ADMIN_PASS } = process.env;
const id = "61b63504f39e4edcf5b8a41b";

beforeAll(async () => {
    server = new App([new AuthenticationController(), new OrderController(), new ProductController()]).getServer();
});

describe("ORDERS, not logged in", () => {
    it("any PATH, should return statuscode 401", async () => {
        expect.assertions(5);
        const allResponse = await request(server).get(`/orders`);
        const idResponse = await request(server).get(`/orders/${id}`);
        const paginatedResponse = await request(server).get("/orders/offset/limit/order/sort/keyword`");
        const patchResponse = await request(server).patch(`/orders/${id}`);
        const deleteResponse = await request(server).delete(`/orders/${id}`);
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
            email: USER_NAME,
            password: USER_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /orders should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/orders").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /orders/:id should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/orders/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("GET /orders/:offset/:limit/:order/:sort/:keyword? should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/orders/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("PATCH /orders/:id should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/orders/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    /*it("DELETE /orders/:id should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/orders/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });*/
});

describe("ORDERS, logged in as admin", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: ADMIN_NAME,
            password: ADMIN_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /orders should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/orders").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /orders/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/orders/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /orders/:offset/:limit/:order/:sort/:keyword? should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/orders/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("PATCH /orders/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/orders/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    /*it("DELETE /orders/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/orders/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});
