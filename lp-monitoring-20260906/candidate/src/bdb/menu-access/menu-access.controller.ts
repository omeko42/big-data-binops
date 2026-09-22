import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { MenuAccessService } from './menu-access.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/menu-access')
export class MenuAccessController {
    constructor(private readonly service: MenuAccessService) {}

    @Get()
    get() {
        return this.service.get();
    }

    @Post()
    save(@Req() req: any, @Body() body: any) {
        return this.service.save(req?.user, body || {});
    }
}
