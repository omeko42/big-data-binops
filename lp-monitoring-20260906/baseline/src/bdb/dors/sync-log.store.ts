import { Pool } from 'pg';

export class SyncLogStore {
    dataSource;
    logger;
    pool = null;
    progressTail = Promise.resolve();
    closed = false;
    delay;
    poolFactory;

    constructor(dataSource, logger, delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), poolFactory = (options) => new Pool(options)) {
        this.dataSource = dataSource;
        this.logger = logger;
        this.delay = delay;
        this.poolFactory = poolFactory;
    }

    getPool() {
        if (this.closed) throw new Error('DORS control store is closed');
        if (!this.pool) {
            // Reuse the live primary connection options, including credentials/SSL.
            // Only two small control-plane connections; LP queries still use the normal pool.
            const shared = this.dataSource.driver?.master;
            if (!shared?.options) throw new Error('PostgreSQL primary pool is unavailable');
            this.pool = this.poolFactory({
                ...shared.options,
                password: shared.options.password,
                max: 2,
                min: 0,
                connectionTimeoutMillis: 5000,
                idleTimeoutMillis: 30000,
                statement_timeout: 10000,
                lock_timeout: 3000,
                application_name: 'bdb-dors-control',
            });
            this.pool.on('error', (error) => this.logger.warn('DORS control connection: ' + error.message));
        }
        return this.pool;
    }

    transient(error) {
        const code = String(error?.code || '');
        return code.startsWith('08') ||
            ['40001', '40P01', '55P03', '57014', '53300', '57P01', '57P02', '57P03',
             'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EPIPE', 'EAI_AGAIN'].includes(code) ||
            /timeout exceeded when trying to connect|connection terminated|connection timeout/i.test(String(error?.message || ''));
    }

    async query(sql, params = [], retry = true) {
        for (let attempt = 0; ; attempt++) {
            try {
                const result = await this.getPool().query(sql, params);
                return result.rows;
            } catch (error) {
                if (this.closed || !retry || !this.transient(error) || attempt >= 3) throw error;
                await this.delay([250, 1000, 2000][attempt]);
            }
        }
    }

    progress(sql, params) {
        // Ordered snapshots prevent concurrent A/B responses moving the checkpoint backwards.
        const result = this.progressTail.then(() => this.query(sql, params));
        this.progressTail = result.then(() => undefined, () => undefined);
        return result;
    }

    async terminal(sql, params) {
        for (;;) {
            try {
                return await this.query(sql, params);
            } catch (error) {
                if (this.closed || !this.transient(error)) throw error;
                // Keep the job guard held while retrying only its final status, not its LP inserts.
                this.logger.warn('Status akhir sync belum tersimpan; mencoba lagi: ' + error.message);
                await this.delay(5000);
            }
        }
    }

    async close() {
        this.closed = true;
        if (this.pool) await this.pool.end();
    }
}
