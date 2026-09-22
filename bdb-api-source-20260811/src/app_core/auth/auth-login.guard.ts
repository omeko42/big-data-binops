import { BadRequestException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { DataSource, Repository } from 'typeorm';
import { Device } from './device/entities/device.entity';

@Injectable()
export class AuthLoginGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly dataSource: DataSource
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return true;
    }
}
