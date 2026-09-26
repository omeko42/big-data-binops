import fs from 'fs';

function patchUserService() {
    let code = fs.readFileSync('user.service.ts', 'utf8');

    // 1. IMPORT_HEADERS
    const oldHeaders = `private static readonly IMPORT_HEADERS = ['Nama', 'NRP/NIP', 'Email', 'Email Dinas Polri', 'Username', 'Role', 'Kode atau Nama Satker', 'Status'];`;
    const newHeaders = `private static readonly IMPORT_HEADERS = ['Nama', 'NRP/NIP', 'Email Dinas Polri (Utama)', 'Email Sekunder (Opsional)', 'Username', 'Role', 'Kode atau Nama Satker', 'Status'];`;
    if (code.includes(oldHeaders)) {
        code = code.replace(oldHeaders, newHeaders);
        console.log("Patched 1: IMPORT_HEADERS");
    }

    // 2. buildImportTemplateBuffer example row & widths
    const oldTplRow = `sheet.columns = UserService.IMPORT_HEADERS.map((h) => ({ header: h, width: h === 'Kode atau Nama Satker' ? 28 : h === 'Email' || h === 'Email Dinas Polri' ? 26 : 18 }));`;
    const newTplRow = `sheet.columns = UserService.IMPORT_HEADERS.map((h) => ({ header: h, width: h === 'Kode atau Nama Satker' ? 28 : h.includes('Email') ? 28 : 18 }));`;
    if (code.includes(oldTplRow)) {
        code = code.replace(oldTplRow, newTplRow);
    }

    const oldSampleRow = `sheet.addRow(['Contoh Nama', '98010710', 'contoh@polri.go.id', 'contoh@polri.go.id', 'contoh.username', 'operator', '060.01.02 (lihat sheet "Daftar Satker")', 'AKTIF']).font = { italic: true, color: { argb: 'FF94A3B8' } };`;
    const newSampleRow = `sheet.addRow(['Contoh Nama', '98010710', '98010710@polri.go.id', '', 'contoh.username', 'operator', '060.01.02 (lihat sheet "Daftar Satker")', 'AKTIF']).font = { italic: true, color: { argb: 'FF94A3B8' } };`;
    if (code.includes(oldSampleRow)) {
        code = code.replace(oldSampleRow, newSampleRow);
        console.log("Patched 2: buildImportTemplateBuffer sample row");
    }

    // 3. parseImportWorkbook
    const oldParse = `        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // header
            const name = cell(row, 1);
            const nrp = cell(row, 2);
            const email = cell(row, 3);
            const email_polri = cell(row, 4);
            const username = cell(row, 5);
            const role_bdb = cell(row, 6).toLowerCase();
            const satker_raw = cell(row, 7);
            const status = cell(row, 8).toUpperCase();
            if (!name && !email && !nrp) return; // baris kosong, lewati
            out.push({ row: rowNumber, name, nrp, email, email_polri, username, role_bdb, satker_raw, status });
        });`;

    const newParse = `        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // header
            const name = cell(row, 1);
            const nrp = cell(row, 2);
            let val3 = cell(row, 3);
            let val4 = cell(row, 4);
            const username = cell(row, 5);
            const role_bdb = cell(row, 6).toLowerCase();
            const satker_raw = cell(row, 7);
            const status = cell(row, 8).toUpperCase();
            if (!name && !val3 && !val4 && !nrp) return; // baris kosong, lewati

            let email_polri = '';
            let email_sekunder = '';
            if (val3.toLowerCase().endsWith('@polri.go.id')) {
                email_polri = val3;
                email_sekunder = val4;
            } else if (val4.toLowerCase().endsWith('@polri.go.id')) {
                email_polri = val4;
                email_sekunder = val3;
            } else {
                email_polri = val3 || val4;
            }

            out.push({ row: rowNumber, name, nrp, email: email_sekunder || email_polri, email_polri, username, role_bdb, satker_raw, status });
        });`;
    if (code.includes(oldParse)) {
        code = code.replace(oldParse, newParse);
        console.log("Patched 3: parseImportWorkbook dual-column parsing");
    }

    // 4. previewBulkImport validation
    const startTarget = 'for (const r of raw) {';
    const endTarget = 'const roleBdb = this.normalizeBdbRole(r.role_bdb || \'viewer\');';
    const sIdx = code.indexOf(startTarget);
    const eIdx = code.indexOf(endTarget, sIdx);
    if (sIdx === -1 || eIdx === -1) throw new Error("Validation loop range not found");

    const newValidateBlock = `for (const r of raw) {
            try {
                if (!r.name) throw new BadRequestException('Nama wajib diisi.');
                if (!r.nrp) throw new BadRequestException('NRP/NIP wajib diisi.');
                if (!r.email_polri) throw new BadRequestException('Email Dinas Polri (Utama) wajib diisi.');
                const emailPolriNorm = this.normalizeEmail(r.email_polri);
                if (!emailPolriNorm.endsWith('@polri.go.id')) throw new BadRequestException('Email Dinas Polri wajib menggunakan domain @polri.go.id.');

                const secEmailNorm = r.email && r.email.toLowerCase() !== emailPolriNorm ? this.normalizeEmail(r.email) : '';
                if (secEmailNorm && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(secEmailNorm)) throw new BadRequestException('Format email sekunder tidak valid.');
                if (secEmailNorm && secEmailNorm === emailPolriNorm) throw new BadRequestException('Email sekunder tidak boleh sama dengan email dinas Polri.');

                for (const [field, val] of [['email_polri', emailPolriNorm], ['email', secEmailNorm], ['username', r.username ? r.username.toLowerCase() : '']] as const) {
                    if (!val) continue;
                    const dupRow = seen[field].get(val);
                    if (dupRow) throw new BadRequestException(\`\${field === 'email' ? 'Email Sekunder' : field === 'email_polri' ? 'Email Dinas Polri' : 'Username'} ini sudah dipakai di baris \${dupRow} pada file yang sama.\`);
                    seen[field].set(val, r.row);
                }

                const existingPolri = await this.findByEmail(emailPolriNorm);
                if (existingPolri) throw new ConflictException('Email Dinas Polri sudah dipakai akun lain di sistem.');
                if (secEmailNorm) {
                    const existingSec = await this.findByEmail(secEmailNorm);
                    if (existingSec) throw new ConflictException('Email Sekunder sudah dipakai akun lain di sistem.');
                }
                if (r.username) {
                    const checkUser = await this.checkIdentifierAvailability('username', r.username);
                    if (!checkUser.available) throw new ConflictException(\`Username sudah dipakai\${checkUser.satker_nama ? ' oleh ' + checkUser.satker_nama : ''}.\`);
                }

                `;

    code = code.substring(0, sIdx) + newValidateBlock + code.substring(eIdx);
    console.log("Patched 4: previewBulkImport validation");

    // 5. In results.push of previewBulkImport:
    const oldPush = `email: emailNorm,\n                    email_polri: r.email_polri || undefined,`;
    const newPush = `email: secEmailNorm || emailPolriNorm,\n                    email_polri: emailPolriNorm,`;
    if (code.includes(oldPush)) {
        code = code.replace(oldPush, newPush);
        console.log("Patched 5: results.push email assignment");
    }

    fs.writeFileSync('user.service.ts', code, 'utf8');
    console.log("user.service.ts updated successfully.");
}

patchUserService();
