import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class ExternalMiddleware implements CanActivate {
    private readonly validTokens: string[] = (process.env.EXTERNAL_SERVICE_TOKENS || 'test').split(',').map(t => t.trim());

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token required');
        }

        if (!this.validTokens.includes(token)) {
            throw new ForbiddenException('Invalid service token');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
