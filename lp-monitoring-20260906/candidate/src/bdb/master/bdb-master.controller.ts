import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { BdbMasterService } from './bdb-master.service';

@UseGuards(AuthGuard)
@Controller('bdb/master')
export class BdbMasterController {
    constructor(private readonly service: BdbMasterService) {}

    @Get('satker')
    getSatker(@Query() query: Record<string, any>) {
        return this.service.getSatker(query);
    }

    @Get('satker-profile')
    getSatkerProfile(@Query() query: Record<string, any>) {
        return this.service.getSatkerProfile(query);
    }

    @Patch('satker-profile')
    updateSatkerProfile(@Body() body: Record<string, any>) {
        return this.service.updateSatkerProfile(body);
    }

    @Post('satker/dors-upsert')
    upsertDorsSatker(@Body() body: Record<string, any>) {
        return this.service.upsertDorsSatker(body);
    }

    @Post('satker/manual')
    createManualSatker(@Body() body: Record<string, any>) {
        return this.service.createManualSatker(body);
    }

    @Patch('satker/:id')
    updateSatker(@Param('id') id: string, @Body() body: Record<string, any>) {
        return this.service.updateSatker(id, body);
    }

    @Get('kejahatan')
    getKejahatan(@Query() query: Record<string, any>) {
        return this.service.getKejahatan(query);
    }

    @Patch('kejahatan/:id')
    updateKejahatan(@Param('id') id: string, @Body() body: Record<string, any>) {
        return this.service.updateKejahatan(id, body);
    }

    @Get('laporan-polisi')
    getLaporanPolisi(@Query() query: Record<string, any>) {
        return this.service.getLaporanPolisi(query);
    }

    @Post('laporan-polisi')
    @UseGuards(AuthGuard)
    createLaporanPolisi(@Req() req, @Body() body: Record<string, any>) {
        return this.service.createLaporanPolisi(req.user, body);
    }

    @Patch('laporan-polisi/:id/detail')
    @UseGuards(AuthGuard)
    updateLaporanPolisiDetail(@Param('id') id: string, @Body() body: Record<string, any>) {
        return this.service.updateLaporanPolisiDetail(id, body);
    }
}
