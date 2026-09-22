import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { AnevService } from './anev.service';

@UseGuards(AuthGuard)
@Controller('bdb/anev')
export class AnevController {
    constructor(private readonly service: AnevService) {}

    @Get('meta')
    meta() {
        return this.service.meta();
    }

    /** Ringkasan dashboard CT/CC (di-scope per role: superadmin/admin=semua, operator=subtree satkernya). */
    @Get('dashboard')
    dashboard(@Query() q: Record<string, any>, @Req() req: any) {
        const uid = req?.user?.id ? Number(req.user.id) : undefined;
        return this.service.dashboard(q || {}, uid);
    }

    @Get('rekap')
    rekap(@Query() q: Record<string, any>) {
        return this.service.rekap(q || {}, q?.parent);
    }

    @Get('rekap/export')
    async export(@Query() q: Record<string, any>, @Res() res: Response) {
        const { columns, rows } = await this.service.exportRows(q || {});
        const lbl: Record<string, string> = { PENYELIDIKAN: 'LIDIK', PENYIDIKAN: 'SIDIK' };
        const header = ['Kode', 'Satker', ...columns.map((c) => `${lbl[c.code] || c.code.replace(/_/g, ' ')} (${c.kategori})`), 'CT', 'CC', 'TOTAL', '% CC'];
        const esc = (v: any) => {
            const s = v == null ? '' : String(v);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const lines = [header.map(esc).join(',')];
        for (const r of rows) {
            const pct = r.TOTAL ? Math.round((r.CC / r.TOTAL) * 100) + '%' : '';
            const line = [r.kode, r.satker, ...columns.map((c) => r[c.code] ?? 0), r.CT, r.CC, r.TOTAL, pct];
            lines.push(line.map(esc).join(','));
        }
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="anev-ct-cc-${stamp}.csv"`);
        return res.send('﻿' + lines.join('\n'));
    }
}
