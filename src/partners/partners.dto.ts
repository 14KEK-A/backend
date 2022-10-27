import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export default class CreateProductsDto {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public address: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public phone_number: string;
}
