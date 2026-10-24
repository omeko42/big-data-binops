import { ApiProperty } from "@nestjs/swagger/dist";
import { IsOptional } from "class-validator";

export class CreateDashboardDto {}
export class refreshDataDto{
    @ApiProperty()
    @IsOptional()
    start_date: string;

    @ApiProperty()
    @IsOptional()
    end_date: string;
}