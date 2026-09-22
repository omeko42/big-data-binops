import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsNumber, IsBoolean, IsObject, ValidateNested } from 'class-validator';

class JoinObject {
    @ApiPropertyOptional({ description: 'ID of the join object.' })
    id: number;

    @ApiPropertyOptional({ description: 'code pengganti id' })
    code: any;
}

export class DeleteDto {
    @ApiPropertyOptional({
        type: [JoinObject],
        description: 'Tables to join in the query.'
    })
    @IsOptional()
    @IsArray()
    // @ValidateNested({ each: true })
    @Type(() => JoinObject)
    data?: JoinObject[];
}
