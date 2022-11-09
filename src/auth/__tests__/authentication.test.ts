import "dotenv/config";
//import { Application } from "express";
import App from "../../app";
import AuthenticationController from "../../auth/authentication.controller";
// import PostController from "../../post/post.controller";
// import ReportController from "../../report/report.controller";
// import UserController from "../../user/user.controller";
import validateEnv from "../../utils/validateEnv";
import request from "supertest";
//import StatusCode from "../../utils/statusCodes";
import "dotenv/config";
//import userModel from "../../users/users.model";
validateEnv();

let server: Express.Application;

beforeAll(async () => {
    //server = new App([new PostController(), new AuthenticationController(), new UserController(), new ReportController()]).getServer();
    server = new App([new AuthenticationController()]).getServer();
});

describe("test API endpoints", () => {
    it("GET /auth/register", async () => {
        const response = await request(server).post("/auth/register").send({
            name: "student001",
            email: "student001@jedlik.eu",
            password: "student001",
        });
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toEqual("User with email student001@jedlik.eu already exists");
        expect(response.body.status).toEqual(400);
    });

    it("GET /auth/login", async () => {
        const response = await request(server).post("/auth/login").send({
            email: "student001@jedlik.eu",
            password: "student001",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body._id).toEqual("61b5e9c0f39e4edcf5b8a3b9");
        expect(response.body.email).toEqual("student001@jedlik.eu");
    });

    it("GET /auth/logout", async () => {
        const response = await request(server).post("/auth/logout");
        expect(response.text).toEqual("OK");
        expect(response.statusCode).toEqual(200);
    });
});
