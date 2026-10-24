import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res, Query, Req, BadRequestException } from '@nestjs/common';
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
import { ReportTerlaporService } from '../service/report-terlapor.service';
import { CreateReportTerlaporDto, UpdateReportTerlaporDPODto, UpdateReportTerlaporDto } from '../dto/report-terlapor.dto';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';

@CoreController('bareskrim-report-terlapor', 'bareskrim/report-terlapor')
// @UseGuards(RoleInternalMiddleware)
export class ReportTerlaporController {
    constructor(private readonly service: ReportTerlaporService) {}

    @Post()
    @Route({ name: 'manajemen operasional.laporan terlapor.create', parent: 'manajemen operasional.laporan terlapor' })
    @ApiOperation({ summary: 'Action Untuk Transform' })
    async create(@Body() dto: CreateReportTerlaporDto, @Res() res) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Get()
    @Route({ name: 'manajemen operasional.laporan terlapor.index', parent: 'manajemen operasional.laporan terlapor' })
    @ApiOperation({ summary: '' })
    async findAll(@CurrentUser() authUser, @Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req, authUser);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'manajemen operasional.laporan terlapor.show', parent: 'manajemen operasional.laporan terlapor' })
    @ApiOperation({ summary: '' })
    async getOne(@Param('id') id: string, @Res() res) {
        const results = await this.service.findOne(+id);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'manajemen operasional.laporan terlapor.update', parent: 'manajemen operasional.laporan terlapor' })
    @ApiOperation({ summary: 'Action Untuk Transform' })
    async update(@Param('id') id: string, @Body() CreateReportStatusDto: UpdateReportTerlaporDto, @Res() res) {
        const results = await this.service.update(+id, CreateReportStatusDto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'manajemen operasional.laporan terlapor.delete', parent: 'manajemen operasional.laporan terlapor' })
    @ApiOperation({ summary: 'Action Untuk Delete Bulk status' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }

    @Patch('jadikan-tersangka/:id')
    @ApiConsumes('multipart/form-data')
    @Route({ name: 'manajemen operasional.laporan terlapor.jadikan tersangka', parent: 'manajemen operasional.laporan terlapor' })
    async DistribusiReport(@CurrentUser() authUser, @UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: UpdateReportTerlaporDPODto, @Req() req, @Res() res) {
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']; // MIME types for PDF, DOC, and DOCX
            if (!allowedTypes.includes(file.mimetype)) {
                throw new BadRequestException('File must be a PDF or DOC/DOCX.');
            }
        }
        const results = await this.service.jadikaTersangka(+id, dto, file, authUser, req);
        return res.sendSuccess(results);
    }

    @Patch('masuk-ke-dpo/:id')
    @ApiConsumes('multipart/form-data')
    @Route({ name: 'manajemen operasional.laporan terlapor.masuk ke DPO', parent: 'manajemen operasional.laporan terlapor' })
    async MasukKeDpo(@CurrentUser() authUser, @UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() dto: UpdateReportTerlaporDPODto, @Req() req, @Res() res) {
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']; // MIME types for PDF, DOC, and DOCX
            if (!allowedTypes.includes(file.mimetype)) {
                throw new BadRequestException('File must be a PDF or DOC/DOCX.');
            }
        }
        const results = await this.service.masukKeDpo(+id, dto, file, authUser, req);
        return res.sendSuccess(results);
    }
}
