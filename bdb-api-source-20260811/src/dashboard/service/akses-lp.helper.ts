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

export class AksesLpHelperDashboard {
    static applyToQuery<T>(queryBuilder: SelectQueryBuilder<T>, authUser: AuthUser): SelectQueryBuilder<T> {
        const path = authUser.Organisasi?.path;
        const aksesLevel = authUser.aksesLevel || [];


        queryBuilder.andWhere(
            new Brackets(qb => {
                // Path utama user, tanpa wajib KategoriLp
                qb.where('Dashboard.organisasi_path LIKE :path', { path: `${authUser.Organisasi.path}%` });

                // Tambahkan aksesLevel dengan syarat KategoriLp harus sesuai
                // authUser.aksesLevel.forEach((element, index) => {
                //     const pathParam = `aksesPath${index}`;
                //     const levelParam = `aksesLevel${index}`;

                //     qb.orWhere(
                //         new Brackets(subQb => {
                //             subQb
                //                 // .where(`Dashboard.organisasi_path LIKE :${pathParam}`, { [pathParam]: `${element.commonFromOrganisasiPath}%` })
                //                 // .andWhere(`Dashboard.organisasi_level_id = :${levelParam}`, { [levelParam]: element.childId })
                //                 // .andWhere('Dashboard.kategori_lp_id IN (:...ids)', { ids: authUser.aksesKategoriLpIds });
                //         })
                //     );
                // });
            })
        );

        return queryBuilder;
    }
}
