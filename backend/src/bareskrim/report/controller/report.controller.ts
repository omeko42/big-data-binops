import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res, Req, Query, BadRequestException } from '@nestjs/common';

import { ReportService } from '@bareskrim/report/service/report.service';
import { CreateReportDto } from '@bareskrim/report/dto/create-report.dto';
import { createManualReportDto, UpdateReportDto, UpdateStatusReportDto, UpdateDistribusiReportDto } from '@bareskrim/report/dto/update-report.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';

@CoreController('bareskrim-report', 'bareskrim/report')
@UseGuards(RoleInternalMiddleware)
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post('/transform')
    @ApiOperation({ summary: 'Action Untuk Transform' })
    async transform(@Body() createReportDto: CreateReportDto, @Res() res, @Req() req) {
        const results = await this.reportService.transform(createReportDto);
        return res.sendSuccess(results);
    }

    @Get()
    @Route({ name: 'manajemen operasional.rekap laporan polisi.index', parent: 'manajemen operasional.rekap laporan polisi' })
    async findAll(@CurrentUser() authUser, @Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.reportService.findAll(req, authUser);
        return res.sendSuccess(results);
    }

    @Post()
    @Route({ name: 'manajemen operasional.rekap laporan polisi.create', parent: 'manajemen operasional.rekap laporan polisi' })
    @ApiOperation({ summary: 'Action Untuk Transform' })
    async create(@CurrentUser() authUser, @Body() dto: createManualReportDto, @Res() res, @Req() req) {
        const results = await this.reportService.create(dto, authUser);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'manajemen operasional.rekap laporan polisi.update', parent: 'manajemen operasional.rekap laporan polisi' })
    async update(@CurrentUser() authUser, @UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: UpdateReportDto, @Res() res) {
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']; // MIME types for PDF, DOC, and DOCX
            if (!allowedTypes.includes(file.mimetype)) {
                throw new BadRequestException('File must be a PDF or DOC/DOCX.');
            }
        }
        const results = await this.reportService.update(+id, dto, file, authUser);
        return res.sendSuccess(results);
    }

    @Patch('update-status/:id')
    @ApiConsumes('multipart/form-data')
    @Route({ name: 'manajemen operasional.rekap laporan polisi.update status', parent: 'manajemen operasional.rekap laporan polisi' })
    async UpdateStatus(@CurrentUser() authUser, @UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: UpdateStatusReportDto, @Req() req, @Res() res) {
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']; // MIME types for PDF, DOC, and DOCX
            if (!allowedTypes.includes(file.mimetype)) {
                throw new BadRequestException('File must be a PDF or DOC/DOCX.');
            }
        }
        const results = await this.reportService.updateStatus(+id, dto, file, authUser);
        return res.sendSuccess(results);
    }

    @Patch('distribusi/:id')
    @ApiConsumes('multipart/form-data')
    @Route({ name: 'manajemen operasional.rekap laporan polisi.distribusi', parent: 'manajemen operasional.rekap laporan polisi' })
    async DistribusiReport(@CurrentUser() authUser, @UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: UpdateDistribusiReportDto, @Req() req, @Res() res) {
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']; // MIME types for PDF, DOC, and DOCX
            if (!allowedTypes.includes(file.mimetype)) {
                throw new BadRequestException('File must be a PDF or DOC/DOCX.');
            }
        }
        
        const results = await this.reportService.distribusiLaporan(+id, dto, file, authUser, req);
        return res.sendSuccess(results);
    }

    @Delete()
    @Route({ name: 'manajemen operasional.rekap laporan polisi.delete', parent: 'manajemen operasional.rekap laporan polisi' })
    @ApiOperation({ summary: 'Action Untuk Transform' })
    async remove(@Body() dto: DeleteDto, @Res() res, @Req() req) {
        const results = await this.reportService.remove(dto, req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'manajemen operasional.rekap laporan polisi.show', parent: 'manajemen operasional.rekap laporan polisi' })
    @ApiOperation({ summary: 'Action Untuk update report hasil tranform' })
    async getOne(@CurrentUser() authUser, @Param('id') id: string, @Res() res) {
        const results = await this.reportService.findOne(+id, authUser);
        return res.sendSuccess(results);
    }
}
