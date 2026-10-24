import { jwtConstants } from '@app_core/auth/constants';
import { User } from '@app_core/auth/user/entities/user.entity';
import { Auth } from '@app_core/helper/service/auth.helper.service';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
@Injectable()
export class RoleInternalMiddleware implements CanActivate {
    private readonly userRepository: Repository<User>;
    private readonly response: any;
    constructor(
        private readonly auth: Auth,
        private jwtService: JwtService,
        private readonly dataSource: DataSource
    ) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // const request = context.switchToHttp().getRequest();
        // const token = this.extractTokenFromHeader(request);
        // if (!token) {
        //     throw new UnauthorizedException();
        // }
        // try {
        //     const payload = await this.jwtService.verifyAsync(token, {
        //         secret: jwtConstants.secret
        //     });
        //     request['user'] = payload;
        //     const authUser = await this.auth.user(request, []);
        //     if (authUser.role_name == 'admin') {
        //         return true;
        //     }
        // } catch {
        //     throw new HttpException('No Access Here', HttpStatus.FORBIDDEN);
        // }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
