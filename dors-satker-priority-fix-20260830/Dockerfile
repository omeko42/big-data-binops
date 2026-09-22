FROM bdb-api:pre-dors-satker-priority-fix-20260830
COPY laporan-polisi.service.js /usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js
COPY satker-legacy-reconciliation.service.js /usr/src/app/dist/bdb/satker/satker-legacy-reconciliation.service.js
RUN node --check /usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js \
 && node --check /usr/src/app/dist/bdb/satker/satker-legacy-reconciliation.service.js