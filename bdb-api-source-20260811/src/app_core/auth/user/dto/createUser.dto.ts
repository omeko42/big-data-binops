import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_COMPLEXITY_MESSAGE, PASSWORD_COMPLEXITY_REGEX, PASSWORD_MIN_LENGTH } from './password-policy.util';

export class CreateUserDto {
    @ApiProperty({
        example: 'asbi@asbi.com',
        description: "The user's email address"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false, example: 'user@gmail.com' })
    @IsOptional()
    @IsEmail()
    email_google: string;

    @ApiProperty({ required: false, example: '12345678@polri.go.id' })
    @IsOptional()
    @IsEmail()
    email_polri: string;

    @ApiProperty({ required: false, example: 'bripka.andi' })
    @IsOptional()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'John Doe',
        description: "The user's name"
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false, example: '98010710' })
    @IsOptional()
    @IsString()
    nrp: string;

    @ApiProperty({ required: false, example: 'Mabes - Bareskrim Polri - Robinopsnal' })
    @IsOptional()
    @IsString()
    satuan: string;

    @ApiProperty({ required: false, example: '08123456789' })
    @IsOptional()
    @IsString()
    no_hp: string;

    @ApiProperty({
        example: 'P@ssw0rd123',
        description: "The user's password"
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_COMPLEXITY_MESSAGE })
    @Matches(PASSWORD_COMPLEXITY_REGEX, { message: PASSWORD_COMPLEXITY_MESSAGE })
    password: string;

    @ApiProperty({
        example: 'P@ssw0rd123',
        description: 'Password confirmation'
    })
    @IsNotEmpty()
    @IsString()
    password_confirmation: string;

    @ApiProperty({ required: false, enum: ['superadmin', 'admin_binops', 'operator', 'viewer'] })
    @IsOptional()
    @IsIn(['superadmin', 'admin_binops', 'operator', 'viewer'])
    role_bdb: string;

    @ApiProperty({ required: false })
    @IsOptional()
    scope_satker_id: number;

    @ApiProperty({ required: false })
    @IsOptional()
    scope_satker_key: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    local_password_enabled: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    two_factor_required: boolean;

    @ApiProperty({ required: false, enum: ['AKTIF', 'PENDING_APPROVAL', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'] })
    @IsOptional()
    @IsIn(['AKTIF', 'PENDING_APPROVAL', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'])
    status: string;

    @ApiProperty({ required: false, enum: ['PENDING_EMAIL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'] })
    @IsOptional()
    @IsIn(['PENDING_EMAIL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'])
    approval_status: string;
}
