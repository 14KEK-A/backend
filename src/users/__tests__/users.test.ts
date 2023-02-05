import request, { Response, SuperAgentTest } from "supertest";
import App from "../../app";
import AuthenticationController from "../../auth/authentication.controller";
import OrderController from "../../users/users.controller";
import ProductController from "../../products/products.controller";
import UserController from "../users.controller";
import StatusCode from "../../utils/statusCodes";
import type { Express } from "express";
import "dotenv/config";

let server: Express;
let cookie: string | any;
const { USER_NAME, USER_PASS, ADMIN_NAME, ADMIN_PASS } = process.env;
const id = "63d2a760caa546646b1ce1f4";

beforeAll(async () => {
    server = new App([new AuthenticationController(), new OrderController(), new ProductController(), new UserController()]).getServer();
});

describe("USERS, not logged in", () => {
    it("any PATH, should return statuscode 401", async () => {
        expect.assertions(5);
        const allResponse = await request(server).get(`/users`);
        const idResponse = await request(server).get(`/users/${id}`);
        const paginatedResponse = await request(server).get("/users/offset/limit/order/sort/keyword`");
        const patchResponse = await request(server).patch(`/users/${id}`);
        const deleteResponse = await request(server).delete(`/users/${id}`);
        expect(allResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(idResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(paginatedResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(patchResponse.statusCode).toBe(StatusCode.Unauthorized);
        expect(deleteResponse.statusCode).toBe(StatusCode.Unauthorized);
    });
});

describe("users, logged in as user", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: USER_NAME,
            password: USER_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /users should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/users").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("GET /users/:id should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/users/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("GET /users/:offset/:limit/:order/:sort/:keyword? should return 401", async () => {
        expect.assertions(1);
        const res = await request(server).get("/users/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    it("PATCH /users/:id should return 200 (modify your own account)", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/users/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("PATCH /users/:id should return 401 (modify someone else's account as a user)", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/users/${id}sajdh`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.Unauthorized);
    });

    /*it("DELETE /users/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/users/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});

describe("users, logged in as admin", () => {
    beforeAll(async () => {
        const res = await request(server).post("/auth/login").send({
            email: ADMIN_NAME,
            password: ADMIN_PASS,
        });
        cookie = res.headers["set-cookie"];
    });

    it("GET /users should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/users").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /users/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get(`/users/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("GET /users/:offset/:limit/:order/:sort/:keyword? should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).get("/users/offset/limit/order/sort/keyword").set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    it("PATCH /users/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/users/${id}`).set("Cookie", cookie).send({ order_date: Date.now });
        expect(res.statusCode).toBe(StatusCode.OK);
    });

    /*it("DELETE /users/:id should return 200", async () => {
        expect.assertions(1);
        const res = await request(server).patch(`/users/${id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(StatusCode.OK);
    });*/
});
