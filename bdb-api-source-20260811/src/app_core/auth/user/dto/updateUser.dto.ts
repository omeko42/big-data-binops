import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_COMPLEXITY_MESSAGE, PASSWORD_COMPLEXITY_REGEX, PASSWORD_MIN_LENGTH } from './password-policy.util';

export class UpdateUserDto {
    @ApiProperty({
        example: 'asbi@asbi.com',
        description: "The user's email address"
    })
    @IsOptional()
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
    @IsOptional()
    name: string;

    @ApiProperty({ required: false, example: '98010710' })
    @IsOptional()
    nrp: string;

    @ApiProperty({ required: false, example: 'Mabes - Bareskrim Polri - Robinopsnal' })
    @IsOptional()
    satuan: string;

    @ApiProperty({ required: false, example: '08123456789' })
    @IsOptional()
    no_hp: string;

    @ApiProperty({
        example: 'P@ssw0rd123',
        description: "The user's password"
    })
    @IsOptional()
    @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_COMPLEXITY_MESSAGE })
    @Matches(PASSWORD_COMPLEXITY_REGEX, { message: PASSWORD_COMPLEXITY_MESSAGE })
    password: string;

    @ApiProperty({
        example: 'P@ssw0rd123',
        description: 'Password confirmation'
    })
    @IsOptional()
    password_confirmation: string;

    @ApiProperty({
        example: 'user',
        description: "The user's role"
    })
    @IsOptional()
    role_name: string;

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

    @ApiProperty({ required: false, enum: ['LOCAL', 'GOOGLE', 'POLRI_SSO', 'HYBRID'] })
    @IsOptional()
    @IsIn(['LOCAL', 'GOOGLE', 'POLRI_SSO', 'HYBRID'])
    login_method: string;

    @ApiProperty({ required: false })
    @IsOptional()
    local_password_enabled: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    two_factor_required: boolean;

    @ApiProperty({ required: false, enum: ['AKTIF', 'NONAKTIF', 'PENDING_APPROVAL', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'] })
    @IsOptional()
    @IsIn(['AKTIF', 'NONAKTIF', 'PENDING_APPROVAL', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'])
    status: string;

    @ApiProperty({ required: false, enum: ['PENDING_EMAIL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'REQUEST_DELETE', 'REQUEST_DEACTIVATE', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'] })
    @IsOptional()
    @IsIn(['PENDING_EMAIL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'REQUEST_DELETE', 'REQUEST_DEACTIVATE', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'])
    approval_status: string;

    @ApiProperty({ required: false })
    @IsOptional()
    nomor_surat?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    keterangan_mutasi?: string;
}
export class sendOtpEmailDto {
    @ApiProperty({
        example: 'asbi@asbi.com',
        description: "The user's email address"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ForgotPasswordRequestDto {
    @ApiProperty({
        example: 'user@polri.go.id',
        description: 'Email akun yang akan reset password'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'encrypted-captcha-id'
    })
    @IsNotEmpty()
    captcha_id: string;

    @ApiProperty({
        example: 'a1b2c3'
    })
    @IsNotEmpty()
    captcha: string;
}

export class ForgotPasswordConfirmDto {
    @ApiProperty({
        example: 'user@polri.go.id',
        description: 'Email akun yang akan reset password'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'encrypted-otp-id' })
    @IsNotEmpty()
    otp_id: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    otp_token: string;

    @ApiProperty({
        example: 'P@ssw0rd123'
    })
    @IsNotEmpty()
    @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_COMPLEXITY_MESSAGE })
    @Matches(PASSWORD_COMPLEXITY_REGEX, { message: PASSWORD_COMPLEXITY_MESSAGE })
    password: string;

    @ApiProperty({
        example: 'P@ssw0rd123'
    })
    @IsNotEmpty()
    password_confirmation: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_COMPLEXITY_MESSAGE })
  @Matches(PASSWORD_COMPLEXITY_REGEX, { message: PASSWORD_COMPLEXITY_MESSAGE })
  newPassword: string;
}

export class SelfDeactivateDto {
    @ApiProperty({ example: 'encrypted-otp-id' })
    @IsNotEmpty()
    otp_id: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    otp_token: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    reason: string;
}

export class ReviewUserApprovalDto {
    @ApiProperty({ enum: ['approve', 'reject'] })
    @IsIn(['approve', 'reject'])
    action: 'approve' | 'reject';

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
    @IsString()
    reason: string;
}
