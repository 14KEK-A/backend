import { IsNotEmpty, IsDate } from "class-validator";
//import CreateOrderdetailsDto from "./orderdetails.dto";

export default class CreateOrdersDto {
    @IsNotEmpty()
    @IsDate()
    public ship_date: string;

    @IsNotEmpty()
    @IsDate()
    public order_date: string;
}
