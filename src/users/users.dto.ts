/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsNumber, IsString, IsUrl } from "class-validator";

export default class CreateUsersDto {
    @IsString()
    public role_name: string;

    @IsNumber()
    public role_bits: number;

    @IsString()
    public first_name: string;

    @IsString()
    public last_name: string;

    @IsString()
    public user_name: string;

    @IsString()
    public password: string;

    @IsString()
    public email: string;

    @IsUrl()
    @IsString()
    public picture_URL: string;
}
