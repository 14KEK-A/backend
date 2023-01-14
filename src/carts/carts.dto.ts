import { IsNotEmpty, IsNumber } from "class-validator";

export default class CreateCartsDto {
    @IsNotEmpty()
    @IsNumber()
    public count: number;
}
