import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export default class CreateProductsDto {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsNumber()
    public price: number;

    @IsNotEmpty()
    @IsString()
    public description: string;

    @IsNotEmpty()
    @IsString()
    public types: string;
}
