import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { User } from '@app_core/auth/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import { OrganisasiLevel } from 'src/orgaisasi/entity/level.entity';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(
        private readonly dataSource: DataSource,
        private readonly jwtService: JwtService
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        // Allow DPO archive and photo direct preview, and secure tokenized media stream
        if (request.url && (((request.url.includes('/dpo/') || request.url.includes('/pihak-terlibat/')) && (request.url.includes('/arsip') || request.url.includes('/foto'))) || request.url.includes('/bdb/jukrah/stream/'))) {
            return next.handle();
        }
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization token not found');
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload: any = this.jwtService.verify(token);
            const userRepo = this.dataSource.getRepository(User);

            // Cari user berdasarkan token
            const user = await userRepo.findOne({
                where: { id: payload.id },
                relations: ['Organisasi', 'Organisasi.KategoriLp', 'Organisasi.OrganisasiLevel', 'Organisasi.OrganisasiLevel.aksesChild']
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Inject user ke request
            request.user = user;

            const kategoriLpIds = user.Organisasi?.KategoriLp?.map(k => k.id) || [];
            request.user.aksesKategoriLpIds = kategoriLpIds;

            const aksesChild = user.Organisasi?.OrganisasiLevel?.aksesChild;
            if (aksesChild && aksesChild.length > 0) {
                const orgLevelPath = user.Organisasi.OrganisasiLevel.path || '';
                const orgPath = user.Organisasi.path || '';

                const childPaths = aksesChild.map(child => ({
                    id: Number(child.id),
                    path: child.path || ''
                }));

                const aksesLevel = this.findTitikTemuAllPaths(orgLevelPath, orgPath, childPaths);
                request.user.aksesLevel = aksesLevel;
            } else {
                request.user.aksesLevel = [];
            }
            return next.handle();
        } catch (err) {
            console.log('invalid di interceptor');
            throw new UnauthorizedException('Invalid token');
        }
    }
    collectAksesChildIds(startLevels: OrganisasiLevel[]): number[] {
        const visited = new Set<number>();
        const result: number[] = [];
        const stack: OrganisasiLevel[] = [...startLevels];

        while (stack.length > 0) {
            const current = stack.pop();
            if (!current || visited.has(current.id)) continue;

            visited.add(current.id);
            result.push(current.id);

            if (current.aksesChild && current.aksesChild.length > 0) {
                stack.push(...current.aksesChild);
            }
        }

        return result;
    }
    findTitikTemuAllPaths(organisasiLevelPath: string, organisasiPath: string, childPaths: { id: number; path: string }[]) {
        const parsePath = (path: string) => (path || '').split('/').filter(Boolean);

        const levelParts = parsePath(organisasiLevelPath);
        const orgParts = parsePath(organisasiPath);

        return childPaths.map(child => {
            const childParts = parsePath(child.path);

            // Titik temu dengan OrganisasiLevel path
            let i = 0;
            while (i < Math.min(childParts.length, levelParts.length) && childParts[i] === levelParts[i]) {
                i++;
            }

            const commonLevelId = i > 0 ? Number(levelParts[i - 1]) : null;
            const commonLevelPath = '/' + levelParts.slice(0, i).join('/');

            // Titik temu dengan Organisasi path (menggunakan posisi dari titik temu Level)
            let commonOrgId: number | null = null;
            let commonOrgPath = '';
            if (i > 0) {
                if (i - 1 < orgParts.length) {
                    commonOrgId = Number(orgParts[i - 1]);
                    commonOrgPath = '/' + orgParts.slice(0, i).join('/');
                } else {
                    // fallback kalau level lebih panjang dari organisasi
                    commonOrgId = Number(orgParts[orgParts.length - 1]);
                    commonOrgPath = '/' + orgParts.join('/');
                }
            }

            return {
                childId: child.id,
                commonFromOrganisasiLevel: commonLevelId,
                commonFromOrganisasi: commonOrgId,
                commonFromOrganisasiLevelPath: commonLevelPath,
                commonFromOrganisasiPath: commonOrgPath
            };
        });
    }
}