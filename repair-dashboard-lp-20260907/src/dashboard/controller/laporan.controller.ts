import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req } from '@nestjs/common';
import { CreateDashboardDto } from '../dto/create-dashboard.dto';
import { UpdateDashboardDto } from '../dto/update-dashboard.dto';
import { SummaryTableService } from '../service/summary-view.service';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { LaporanService } from '../service/laporan.service';

@CoreController('analytic-dashboards', 'analytic-laporan')
export class LaporanController {
    constructor(
        private readonly dashboardService: LaporanService,
        private readonly summaryTableService: SummaryTableService
    ) {}

    @Get('jenis-kejahatan')
    @Route({ name: 'dashboard.dashboard utama.Total Data Kejahatan', parent: 'dashboard.dashboard utama' })
    async total(@CurrentUser() authUser, @Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.dashboardService.jenisKejahatan(req, authUser);
        return res.sendSuccess(results);
    }
}
