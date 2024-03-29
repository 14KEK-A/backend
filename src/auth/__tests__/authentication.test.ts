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
const { USER_NAME, USER_PASS, ADMIN_NAME, ADMIN_PASS } = process.env;

beforeAll(async () => {
    //server = new App([new PostController(), new AuthenticationController(), new UserController(), new ReportController()]).getServer();
    server = new App([new AuthenticationController()]).getServer();
});

//register test user and admin
describe("test API endpoints", () => {
    it("GET /auth/register", async () => {
        const response = await request(server).post("/auth/register").send({
            name: "user",
            email: USER_NAME,
            password: USER_PASS,
        });
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toEqual(`User with email ${USER_NAME} already exists`);
        expect(response.body.status).toEqual(400);
    });

    it("GET /auth/login", async () => {
        const response = await request(server).post("/auth/login").send({
            email: USER_NAME,
            password: USER_PASS,
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toEqual(USER_NAME);
    });

    it("GET /auth/logout", async () => {
        const response = await request(server).post("/auth/logout");
        expect(response.text).toEqual("OK");
        expect(response.statusCode).toEqual(200);
    });
});
