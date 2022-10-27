/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsNumber, IsNotEmpty, IsString, IsUrl } from "class-validator";

export default class CreateUsersDto {
    @IsNotEmpty()
    @IsString()
    public role_name: string;

    @IsNotEmpty()
    @IsString()
    public role_bits: string;

    @IsNotEmpty()
    @IsString()
    public first_name: string;

    @IsNotEmpty()
    @IsString()
    public last_name: string;

    @IsNotEmpty()
    @IsString()
    public user_name: string;

    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public password_hash: string;

    @IsNotEmpty()
    @IsString()
    public email: string;

    @IsNotEmpty()
    @IsUrl()
    @IsString()
    public picture_URL: string;
}
