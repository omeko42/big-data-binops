import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { BdbRekapLpService } from './bdb-rekap-lp.service';

@UseGuards(AuthGuard)
@Controller('bdb/rekap-lp')
export class BdbRekapLpController {
  constructor(private readonly service: BdbRekapLpService) {}

  @Get('nodes')
  async nodes(
    @Query('parentKey') parentKey?: string,
    @Query('year') year?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('includeTest') includeTest?: string,
  ) {
    return this.service.getNodes(parentKey || null, year || null, dateFrom || null, dateTo || null);
  }

  @Get('lps')
  async lps(
    @Query('satkerKey') satkerKey?: string,
    @Query('search') search?: string,
    @Query('year') year?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('includeTest') includeTest?: string,
  ) {
    return this.service.getLps(satkerKey || null, search || '', year || null, dateFrom || null, dateTo || null);
  }

  @Get('worklist')
  async worklist(
    @Query('mode') mode?: string,
    @Query('tab') tab?: string,
    @Query('search') search?: string,
    @Query('year') year?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('includeTest') includeTest?: string,
  ) {
    return this.service.getWorklist({
      mode: mode || '',
      tab: tab || '',
      search: search || '',
      year: year || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      includeTest: String(includeTest || '').toLowerCase() === 'true',
    });
  }

  @Get('distribution-targets')
  async distributionTargets(
    @Query('domain') domain?: string,
    @Query('subDomain') subDomain?: string,
    @Query('level') level?: string,
    @Query('search') search?: string,
  ) {
    return this.service.getDistributionTargets({
      domain: domain || '',
      subDomain: subDomain || '',
      level: level || '',
      search: search || '',
    });
  }

  @Post('detail')
  async updateDetail(@Body() body: any) {
    return this.service.updateLpDetail(body);
  }

  @Post('distribute')
  async distribute(@Body() body: any) {
    return this.service.distributeLp(body);
  }

  @Post('rollback-last')
  async rollbackLast(@Body() body: any) {
    return this.service.rollbackLastEvent(body);
  }
  @Get('history')
  async history(@Query('lpId') lpId?: string) {
    return this.service.getHistory(Number(lpId || 0));
  }

  @Post('history')
  async createHistory(@Body() body: any) {
    return this.service.createHistory(body);
  }

  @Post('report-status')
  async reportStatus(@Body() body: any) {
    return this.service.reportStatus(body);
  }
}





