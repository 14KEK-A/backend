import { IsNotEmpty, IsDate, IsOptional, ValidateNested } from "class-validator";
import CreateOrderdetailsDto from "./orderdetails.dto";

export default class CreateOrdersDto {
    @IsNotEmpty()
    @IsDate()
    public ship_date: string;

    @IsNotEmpty()
    @IsDate()
    public order_date: string;

    @IsOptional()
    @ValidateNested()
    public products?: CreateOrderdetailsDto;
}
