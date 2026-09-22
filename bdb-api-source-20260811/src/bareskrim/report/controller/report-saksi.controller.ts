import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res, Query, Req } from '@nestjs/common';
import { ReportService } from '@bareskrim/report/service/report.service';
import { UpdateReportDto } from '@bareskrim/report/dto/update-report.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { ReportStatusService } from '../service/report-status.service';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { ReportSaksiService } from '../service/report-saksi.service';
import { CreateReportSaksiDto, UpdateReportSaksiDto } from '../dto/report-saksi.dto';

@CoreController('bareskrim-report-saksi', 'bareskrim/report-saksi')
// @UseGuards(RoleInternalMiddleware)
export class ReportSaksiController {
    constructor(private readonly service: ReportSaksiService) {}

    @Post()
    @Route({ name: 'manajemen operasional.laporan saksi.create', parent: 'manajemen operasional.laporan saksi' })
    @ApiOperation({ summary: 'Action Untuk Transform' })
    async create(@Body() dto: CreateReportSaksiDto, @Res() res) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Get()
    @Route({ name: 'manajemen operasional.laporan saksi.index', parent: 'manajemen operasional.laporan saksi' })
    @ApiOperation({ summary: '' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'manajemen operasional.laporan saksi.show', parent: 'manajemen operasional.laporan saksi' })
    @ApiOperation({ summary: '' })
    async getOne(@Param('id') id: string, @Res() res) {
        const results = await this.service.findOne(+id);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'manajemen operasional.laporan saksi.update', parent: 'manajemen operasional.laporan saksi' })
    @ApiOperation({ summary: 'Action Untuk Transform' })
    async update(@Param('id') id: string, @Body() CreateReportStatusDto: UpdateReportSaksiDto, @Res() res) {
        const results = await this.service.update(+id, CreateReportStatusDto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'manajemen operasional.laporan saksi.delete', parent: 'manajemen operasional.laporan saksi' })
    @ApiOperation({ summary: 'Action Untuk Delete Bulk status' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
