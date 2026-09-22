import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ExternalService } from '../service/external.service';
import { CreateExternalDto } from '../dto/create-external.dto';
import { UpdateExternalDto } from '../dto/update-external.dto';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { ExternalMiddleware } from '../external.middleware';
import { ApiBearerAuth } from '@nestjs/swagger/dist';
import { CustomValidationPipe } from '@app_core/helper/service/pipe.helper.service';

@Controller('external')
@ApiBearerAuth('access-token')
@UseGuards(ExternalMiddleware)
@UsePipes(new CustomValidationPipe())
export class ExternalController {
    constructor(private readonly externalService: ExternalService) {}

    // @Post()
    // create(@Body() createExternalDto: CreateExternalDto) {
    //     return this.externalService.create(createExternalDto);
    // }

    @Get('report')
    async findAll( @Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.externalService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get('report/:id')
    async   findOne(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.externalService.findOne(+id));
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateExternalDto: UpdateExternalDto) {
    //     return this.externalService.update(+id, updateExternalDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.externalService.remove(+id);
    // }
}
