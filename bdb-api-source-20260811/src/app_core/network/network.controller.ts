import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

// Payload tetap (~195 KB) buat estimasi throughput unduh/unggah dari Topbar (indikator jaringan).
// Publik (tanpa AuthGuard) -- sengaja sama spt captcha yg sudah dipakai utk cek "online" sblm ini,
// supaya indikator jaringan tetap jalan meski token belum/sudah tak valid.
const PROBE_SIZE = 200_000;
const PROBE_BUFFER = Buffer.alloc(PROBE_SIZE, 'x');

@Controller('network')
export class NetworkController {
    /** Round-trip minimal -- dipakai ukur ping/latency. */
    @Get('ping')
    ping() {
        return { ok: true, ts: Date.now() };
    }

    /** Unduh payload tetap -- klien hitung throughput dari ukuran/durasi. */
    @Get('probe')
    probeDown(@Res() res: Response) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store');
        res.send(PROBE_BUFFER);
    }

    /**
     * Terima payload dari klien -- HARUS ditunggu sampai stream benar2 habis ('end') sebelum
     * balas response, supaya durasi yg diukur klien (waktu kirim sampai dpt balasan) benar2
     * mencerminkan kecepatan unggah, bukan cuma waktu request diterima server.
     */
    @Post('probe')
    async probeUp(@Req() req: Request) {
        await new Promise<void>((resolve, reject) => {
            req.on('data', () => {});
            req.on('end', () => resolve());
            req.on('error', reject);
        });
        return { ok: true };
    }
}
