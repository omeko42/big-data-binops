import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Matches, Min } from 'class-validator';

/**
 * BDB-001 (CWE-89) -- body endpoint POST /bdb/anev/lampiran/generate.
 *
 * Semua nilai yang masuk ke SQL harus lolos validasi skema DI SINI, sebelum
 * service pernah assemble-nya jadi query. Tanpa DTO, body masuk mentah sebagai
 * `any` sehingga quote attacker langsung jadi literal SQL.
 *
 * Aturan: kelompokHitung / modelLp / closureReason hanya boleh huruf kapital,
 * angka, dan underscore (kelompokHitung boleh berupa daftar yang dipisah koma).
 * golonganId dan satkerId harus integer positif.
 */
export const KODE_FILTER_PATTERN = /^[A-Z0-9_]+$/;
export const KELOMPOK_FILTER_PATTERN = /^[A-Z0-9_]+(,[A-Z0-9_]+)*$/;

const toOptionalInt = ({ value }: { value: any }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
};

export class GenerateLampiranDto {
    /** Daftar kelompok hitung, mis. "TIPIDUM" atau "TIPIDUM,TIPIDSIBER". */
    @IsOptional()
    @Matches(KELOMPOK_FILTER_PATTERN, {
        message: 'kelompokHitung hanya boleh huruf kapital, angka, underscore, dan pemisah koma.'
    })
    kelompokHitung?: string;

    /** Id golongan kejahatan (integer positif). */
    @IsOptional()
    @Transform(toOptionalInt)
    @IsInt({ message: 'golonganId harus berupa bilangan bulat.' })
    @Min(1, { message: 'golonganId harus lebih besar dari 0.' })
    golonganId?: number;

    /** Model LP, mis. "A" / "B". */
    @IsOptional()
    @Matches(KODE_FILTER_PATTERN, {
        message: 'modelLp hanya boleh huruf kapital, angka, dan underscore.'
    })
    modelLp?: string;

    /** Alasan closure, mis. "RJ" / "NON_RJ". */
    @IsOptional()
    @Matches(KODE_FILTER_PATTERN, {
        message: 'closureReason hanya boleh huruf kapital, angka, dan underscore.'
    })
    closureReason?: string;

    /** Id satker target (integer positif). */
    @IsOptional()
    @Transform(toOptionalInt)
    @IsInt({ message: 'satkerId harus berupa bilangan bulat.' })
    @Min(1, { message: 'satkerId harus lebih besar dari 0.' })
    satkerId?: number;
}
