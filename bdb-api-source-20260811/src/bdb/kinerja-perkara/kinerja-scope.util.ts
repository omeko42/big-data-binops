export type KinerjaSatker = {
    id: number;
    kode: string;
    deskripsi: string;
    parent_id: number | null;
    tipe_satker: string;
};

export type KinerjaFunctionGroup = 'KRIMUM' | 'KRIMSUS' | 'NARKOBA' | 'SIBER';

export type KinerjaScopePlan = {
    allowedIds: number[];
    visibleIds: Set<number>;
    rootId: number;
    rootKode: string;
    rootNama: string;
    functionGroup: KinerjaFunctionGroup | null;
};

const normalized = (value: string): string => value.toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();

export function inferKinerjaFunctionGroup(name: string): KinerjaFunctionGroup | null {
    const n = normalized(name);
    if (n.includes('NARKOBA') || n.includes('NARKOTIKA')) return 'NARKOBA';
    if (n.includes('KRIMSUS') || n.includes('TIPIDEKSUS') || n.includes('EKSUS') || n.includes('KRIMINAL KHUSUS')) return 'KRIMSUS';
    if (n.includes('SIBER')) return 'SIBER';
    if (n.includes('KRIMUM') || n.includes('RESKRIM') || n.includes('TIPIDUM') || n.includes('PIDUM') || n.includes('JATANRAS') || /\bPPA\b/.test(n) || n.includes('KRIMINAL UMUM')) return 'KRIMUM';
    return null;
}

export function belongsToKinerjaFunction(name: string, group: KinerjaFunctionGroup): boolean {
    return inferKinerjaFunctionGroup(name) === group;
}

export function isKinerjaReserseSatker(name: string): boolean {
    const n = normalized(name);
    return n.includes('BARESKRIM') || n.includes('RESKRIM') || n.includes('KRIM') || n.includes('TIPID') ||
        n.includes('PIDANA') || n.includes('NARKO') || n.includes('SIBER') || n.includes('JATANRAS') || /\bPPA\b/.test(n);
}

/** Nasional tetap mempertahankan node wilayah dan leluhur, tetapi fungsi non-reserse dikeluarkan. */
export function buildNationalKinerjaScopePlan(satkers: KinerjaSatker[]): { allowedIds: number[]; visibleIds: Set<number> } {
    const byId = new Map(satkers.map((s) => [Number(s.id), s]));
    const selected = new Set<number>();
    for (const satker of satkers) {
        if (satker.tipe_satker !== 'FUNGSI' || isKinerjaReserseSatker(satker.deskripsi)) {
            selected.add(Number(satker.id));
        }
    }

    // Root/leluhur dibutuhkan agar tree Nasional tetap utuh walaupun namanya bukan fungsi reserse.
    for (const id of [...selected]) {
        let current = byId.get(id);
        const guard = new Set<number>();
        while (current?.parent_id != null && !guard.has(Number(current.id))) {
            guard.add(Number(current.id));
            const parentId = Number(current.parent_id);
            selected.add(parentId);
            current = byId.get(parentId);
        }
    }

    const allowedIds = satkers.map((s) => Number(s.id)).filter((id) => selected.has(id));
    return { allowedIds, visibleIds: new Set(allowedIds) };
}

/**
 * Membentuk scope khusus laporan Kinerja Perkara. Akun fungsi Polda memperoleh wilayah Polda
 * sampai Polsek, tetapi hanya node fungsi yang sekelompok dengan akun tersebut.
 */
export function buildKinerjaScopePlan(satkers: KinerjaSatker[], scopeSatkerId: number): KinerjaScopePlan | null {
    const byId = new Map(satkers.map((s) => [Number(s.id), s]));
    const scopeNode = byId.get(Number(scopeSatkerId));
    if (!scopeNode) return null;

    let root = scopeNode;
    let cursor: KinerjaSatker | undefined = scopeNode;
    const ancestorGuard = new Set<number>();
    while (cursor && !ancestorGuard.has(Number(cursor.id))) {
        ancestorGuard.add(Number(cursor.id));
        if (cursor.tipe_satker === 'POLDA') {
            root = cursor;
            break;
        }
        cursor = cursor.parent_id == null ? undefined : byId.get(Number(cursor.parent_id));
    }

    const functionGroup = inferKinerjaFunctionGroup(scopeNode.deskripsi);
    const inRootSubtree = (satker: KinerjaSatker): boolean => {
        let current: KinerjaSatker | undefined = satker;
        const guard = new Set<number>();
        while (current && !guard.has(Number(current.id))) {
            const id = Number(current.id);
            if (id === Number(root.id)) return true;
            guard.add(id);
            current = current.parent_id == null ? undefined : byId.get(Number(current.parent_id));
        }
        return false;
    };

    const allowedIds: number[] = [];
    for (const satker of satkers) {
        if (!inRootSubtree(satker)) continue;
        const visible = satker.tipe_satker !== 'FUNGSI' || !functionGroup || belongsToKinerjaFunction(satker.deskripsi, functionGroup);
        if (visible) allowedIds.push(Number(satker.id));
    }

    return {
        allowedIds,
        visibleIds: new Set(allowedIds),
        rootId: Number(root.id),
        rootKode: root.kode,
        rootNama: root.deskripsi,
        functionGroup
    };
}
