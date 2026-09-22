import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_COMPLEXITY_MESSAGE, PASSWORD_COMPLEXITY_REGEX, PASSWORD_MIN_LENGTH } from './password-policy.util';

export class UserDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: 'sdXucDg9qU0mKTag11QiAA==:R9ifzW+uxCepZ9SN3cXg7ebMb2dSQeD6fTUr1DoOKcGTabJnIx43VKK+gQX8Nng3usu1aN40Pp3SrbJ4URB8sw=='
    })
    @IsNotEmpty()
    captcha_id: string;

    @ApiProperty({
        example: 'fdg542'
    })
    @IsNotEmpty()
    captcha: string;
}

export class RefreshTokenDto {
    @ApiProperty({
        example: 'asdasdasd'
    })
    @IsNotEmpty()
    refresh_token: string;
}

export class RegisterTOTP {
    @ApiProperty({
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    password: string;
}

export class verifyTOTP {
    @ApiProperty({
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: '123456'
    })
    @IsNotEmpty()
    totp_token: string;
}

export class Register {
    @ApiProperty({
        example: 'John Doe'
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    pangkat: string;

    @ApiProperty()
    @IsNotEmpty()
    satuan: string;

    @ApiProperty()
    @IsNotEmpty()
    jabatan: string;

    @ApiProperty({ enum: ['l', 'p'], description: 'Jenis kelamin (l = laki-laki, p = perempuan)' })
    @IsNotEmpty()
    @IsIn(['l', 'p'], { message: 'jenis_kelamin hanya boleh "l" atau "p"' })
    jenis_kelamin: string;

    @ApiProperty()
    @IsNotEmpty()
    no_hp: string;

    @ApiProperty()
    @IsNotEmpty()
    nrp: string;

    @ApiProperty({
        example: '12345678@polri.go.id'
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
    @Matches(/@polri\.go\.id$/i, { message: 'Email Polri harus menggunakan domain polri.go.id' })
    email_polri: string;

    @ApiProperty({ required: false, enum: ['admin_binops', 'operator', 'viewer'] })
    @IsOptional()
    @IsIn(['admin_binops', 'operator', 'viewer'])
    requested_role_bdb: string;

    @ApiProperty({ required: false })
    @IsOptional()
    requested_scope_satker_id: number;

    @ApiProperty({ required: false })
    @IsOptional()
    requested_scope_satker_key: string;

    @ApiProperty({
        example: 'P@ssw0rd123'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_COMPLEXITY_MESSAGE })
    @Matches(PASSWORD_COMPLEXITY_REGEX, { message: PASSWORD_COMPLEXITY_MESSAGE })
    password: string;

    @ApiProperty({
        example: 'P@ssw0rd123'
    })
    @IsNotEmpty()
    @IsString()
    password_confirmation: string;
}
export class receivedInvitation {
    @ApiProperty({
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    nrp: string;

    @ApiProperty({
        example: 'asbi@asbi.com'
    })
    @IsNotEmpty()
    role_code: string;

    @ApiProperty({
        example: '123456'
    })
    inv_code: string;

    @ApiProperty({
        example: '123456'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_COMPLEXITY_MESSAGE })
    @Matches(PASSWORD_COMPLEXITY_REGEX, { message: PASSWORD_COMPLEXITY_MESSAGE })
    password: string;

    @ApiProperty({
        example: '123456'
    })
    @IsNotEmpty()
    @IsString()
    password_confirmation: string;

    @ApiProperty({
        example: '123456'
    })
    @IsNotEmpty()
    otp_id: string;

    @ApiProperty({
        example: '123456'
    })
    @IsNotEmpty()
    otp_token: string;
}
