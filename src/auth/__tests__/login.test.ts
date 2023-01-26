import { Application } from "express";
import request, { Response } from "supertest";
import { hash } from "bcrypt";
import "dotenv/config";
import validateEnv from "../../utils/validateEnv";
import App from "../../app";
import userModel from "../../users/users.model";
import AuthenticationController from "../authentication.controller";

validateEnv();

describe("POST /login", () => {
    let server: Application;

    beforeAll(() => {
        server = new App([new AuthenticationController()]).getServer();
    });

    it("returns statuscode 401 if user not exists", async () => {
        const res: Response = await request(server).post("/auth/login").send({
            email: "student001@jedlik.uk",
            password: "student001",
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual("Wrong credentials provided");
    });
});
