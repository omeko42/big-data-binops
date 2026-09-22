import { ApiProperty } from '@nestjs/swagger/dist';

export class CreatePermissionDto {
    @ApiProperty()
    to: string;

    @ApiProperty()
    icon: string;

    @ApiProperty()
    hide: boolean;
}
