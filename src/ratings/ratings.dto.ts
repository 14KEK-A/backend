import { IsString, IsNumber } from "class-validator";

export default class CreateRatingsDto {
    @IsNumber()
    public stars: number;

    @IsString()
    public comment: string;
}
