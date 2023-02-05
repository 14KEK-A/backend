import request from "supertest";
import App from "../../app";
import AuthenticationController from "../../auth/authentication.controller";
import OrderController from "../../orders/orders.controller";
import RatingController from "../ratings.controller";
import ProductController from "../../products/products.controller";
import StatusCode from "../../utils/statusCodes";
import type { Express } from "express";
import "dotenv/config";

let server: Express;
let cookie: string | any;
const { USER_NAME, USER_PASS, ADMIN_NAME, ADMIN_PASS, SALESMAN_NAME, SALESMAN_PASS } = process.env;
const id = "61dc0232e397a1e9cf988b2b";
const id2 = "61dc02ebe397a1e9cf988b31";

beforeAll(async () => {
    server = new App([new AuthenticationController(), new OrderController(), new ProductController(), new RatingController()]).getServer();
});

describe("ratings, not logged in", () => {
    it("any PATH except getById(200), should return statuscode 401", async () => {
        expect.assertions(5);
        const allResponse = await request(server).get(`/ratings`);
        const idResponse = await request(server).get(`/ratings/${id}`);
        const paginatedResponse = await request(server).get("/ratings/offset/limit/order/sort/keyword`");
        const patchResponse = await request(server).patch(`/ratings/${id}`);
        const deleteResponse = await request(server).delete(`/ratings/${id}`);
        expect(allResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(idResponse.statusCode).toBe(StatusCode.OK);
        expect(paginatedResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(patchResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(deleteResponse.statusCode).toBe(StatusCode.Unauthorized);
    });
});

describe("ratings, logged in as user", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: USER_NAME,
            password: USER_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /ratings should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/ratings").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("GET /ratings/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/ratings/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /ratings/:offset/:limit/:order/:sort/:keyword? should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/ratings/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("PATCH /ratings/:id should return 401 (modify someone else's rating as a user)", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/ratings/${id2}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("PATCH /ratings/:id should return 200 (modify your own rating)", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/ratings/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("DELETE /ratings/:id should return 401 (delete someone else's rating as a user)", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/ratings/${id2}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });
});

describe("ratings, logged in as admin", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: ADMIN_NAME,
            password: ADMIN_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /ratings should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/ratings").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /ratings/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/ratings/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /ratings/:offset/:limit/:order/:sort/:keyword? should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/ratings/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("PATCH /ratings/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/ratings/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    /*it("DELETE /ratings/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/ratings/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});
