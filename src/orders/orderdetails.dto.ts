import { IsNotEmpty, IsNumber, IsBoolean } from "class-validator";

export default class CreateOrderdetailsDto {
    @IsNotEmpty()
    @IsBoolean()
    public discount: string;

    @IsNotEmpty()
    @IsNumber()
    public price: string;

    @IsNotEmpty()
    @IsNumber()
    public quantity: string;
}
