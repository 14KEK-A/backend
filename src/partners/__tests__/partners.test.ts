import request from "supertest";
import App from "../../app";
import AuthenticationController from "../../auth/authentication.controller";
import OrderController from "../../partners/partners.controller";
import ProductController from "../../products/products.controller";
import StatusCode from "../../utils/statusCodes";
import type { Express } from "express";
import "dotenv/config";

let server: Express;
let cookie: string | any;
const { USER_NAME, USER_PASS, ADMIN_NAME, ADMIN_PASS, SALESMAN_NAME, SALESMAN_PASS } = process.env;
const id = "61dc02ebe397a1e9cf988b31";

beforeAll(async () => {
    server = new App([new AuthenticationController(), new OrderController(), new ProductController()]).getServer();
});

describe("PARTNERS, not logged in", () => {
    it("any PATH, should return statuscode 401", async () => {
        expect.assertions(5);
        const allResponse = await request(server).get(`/partners`);
        const idResponse = await request(server).get(`/partners/${id}`);
        const paginatedResponse = await request(server).get("/partners/offset/limit/order/sort/keyword`");
        const patchResponse = await request(server).patch(`/partners/${id}`);
        const deleteResponse = await request(server).delete(`/partners/${id}`);
        expect(allResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(idResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(paginatedResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(patchResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(deleteResponse.statusCode).toBe(StatusCode.Unauthorized);
    });
});

describe("partners, logged in as user", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: USER_NAME,
            password: USER_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /partners should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/partners").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("GET /partners/:id should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/partners/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("GET /partners/:offset/:limit/:order/:sort/:keyword? should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/partners/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("PATCH /partners/:id should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/partners/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("DELETE /partners/:id should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/partners/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });
});

describe("partners, logged in as admin", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: ADMIN_NAME,
            password: ADMIN_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /partners should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/partners").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /partners/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/partners/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /partners/:offset/:limit/:order/:sort/:keyword? should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/partners/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("PATCH /partners/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/partners/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    /*it("DELETE /partners/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/partners/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});

describe("partners, logged in as salesman", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: SALESMAN_NAME,
            password: SALESMAN_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /partners should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/partners").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /partners/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/partners/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /partners/:offset/:limit/:order/:sort/:keyword? should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/partners/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("PATCH /partners/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/partners/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    /*it("DELETE /partners/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/partners/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});
