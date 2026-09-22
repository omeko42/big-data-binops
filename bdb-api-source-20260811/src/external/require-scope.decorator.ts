import { SetMetadata } from '@nestjs/common';

// Menandai endpoint /external/v1/* dengan scope yang wajib dimiliki klien integrasi
// (lihat cas-api-master/src/bdb/integration-client/scopes.ts untuk daftar kode scope).
export const SCOPE_KEY = 'integration_scope';
export const RequireScope = (scope: string) => SetMetadata(SCOPE_KEY, scope);
