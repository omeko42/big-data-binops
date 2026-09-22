import { Brackets, SelectQueryBuilder } from 'typeorm';

interface AksesLevelEntry {
    childId: number;
    commonFromOrganisasiPath: string;
}

interface Organisasi {
    path: string;
}

interface AuthUser {
    Organisasi: Organisasi;
    aksesLevel: AksesLevelEntry[];
    aksesKategoriLpIds: number[];
}

export class AksesLpHelper {
    static applyToQuery<T>(queryBuilder: SelectQueryBuilder<T>, authUser: AuthUser): SelectQueryBuilder<T> {
        const path = authUser.Organisasi?.path;
        const aksesLevel = authUser.aksesLevel || [];

        // Tambah kondisi akses utama (organisasi milik user)
        queryBuilder.leftJoinAndSelect('Report.Organisasi', 'Organisasi');
        queryBuilder.leftJoinAndSelect('Report.JenisKejahatan', 'JenisKejahatan');
        queryBuilder.leftJoinAndSelect('JenisKejahatan.KategoriLp', 'KategoriLp');

        queryBuilder.andWhere(
            new Brackets(qb => {
                // Path utama user, tanpa wajib KategoriLp
                qb.where('Organisasi.path LIKE :path', { path: `${authUser.Organisasi.path}%` });

                // Tambahkan aksesLevel dengan syarat KategoriLp harus sesuai
                authUser.aksesLevel.forEach((element, index) => {
                    const pathParam = `aksesPath${index}`;
                    const levelParam = `aksesLevel${index}`;

                    qb.orWhere(
                        new Brackets(subQb => {
                            subQb
                                .where(`Organisasi.path LIKE :${pathParam}`, { [pathParam]: `${element.commonFromOrganisasiPath}%` })
                                .andWhere(`Organisasi.organisasiLevelId = :${levelParam}`, { [levelParam]: element.childId })
                                .andWhere('KategoriLp.id IN (:...ids)', { ids: authUser.aksesKategoriLpIds });
                        })
                    );
                });
            })
        );

        return queryBuilder;
    }
}
