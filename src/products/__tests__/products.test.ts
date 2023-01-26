import request, { Response, SuperAgentTest } from "supertest";
import App from "../../app";
import AuthenticationController from "../../auth/authentication.controller";
import ProductController from "../../products/products.controller";
import StatusCode from "../../utils/statusCodes";
import type { Express } from "express";
import "dotenv/config";

let server: Express;
let cookie: string | any;
const { USER_NAME, USER_PASS, ADMIN_NAME, ADMIN_PASS } = process.env;

beforeAll(async () => {
    server = new App([new AuthenticationController(), new ProductController()]).getServer();
});

describe("PRODUCTS, not logged in", () => {
    it("GET requests should return statuscode 200", async () => {
        expect.assertions(6);
        const allResponse = await request(server).get(`/products`);
        const idResponse = await request(server).get(`/products/61b6332df39e4edcf5b8a407`);
        const paginatedResponse = await request(server).get("/products/offset/limit/order/sort/keyword");
        expect(allResponse.statusCode).toBe(StatusCode.OK);
        expect(idResponse.statusCode).toBe(StatusCode.OK);
        expect(paginatedResponse.statusCode).toBe(StatusCode.OK);
    });

    it("POST, PATCH and DELETE requests should return statuscode 401", async () => {
        const createResponse = await request(server).post("/products");
        const patchResponse = await request(server).patch("/products/61b6332df39e4edcf5b8a407");
        const deleteResponse = await request(server).delete(`/products/61b6332df39e4edcf5b8a407`);
        expect(createResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(patchResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(deleteResponse.statusCode).toBe(StatusCode.Unauthorized);
    });
});

describe("products, logged in as admin", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: ADMIN_NAME,
            password: ADMIN_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /products should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/products").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /products/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/products/63aa1816fd8881c0d1b089d4").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /products/:offset/:limit/:order/:sort/:keyword? should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/products/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("PATCH /products/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch("/products/61b6332df39e4edcf5b8a407").set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    /*it("DELETE /products/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch("/products/61b6332df39e4edcf5b8a407").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});
