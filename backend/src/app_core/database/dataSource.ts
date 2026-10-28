import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
// Initialize the DataSource with configuration
const AppDataSource = new DataSource({
    type: (process.env.DB_TYPE as any) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'test',
    synchronize: false,
    dropSchema: false,
    logging: false,
    logger: 'file',
    // Lihat catatan lengkap di database.module.ts (dipakai runtime NestJS -- DataSource ini cuma
    // dipakai CLI/migration, tapi disamakan supaya tak membingungkan kalau dibaca terpisah).
    extra: {
        max: 8,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000
    },
    poolSize: 8,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['src/app_core/migrations/**/*.ts'],
    subscribers: ['dist/subscriber/**/*.ts'],
    migrationsTableName: 'migrations_table'
});

let dataSourceInitialized = false;

async function initializeDataSource() {
    if (!dataSourceInitialized) {
        try {
            await AppDataSource.initialize();
            dataSourceInitialized = true;
            console.log('Data source initialized');
        } catch (err) {
            console.error('Error during Data Source initialization', err);
        }
    }
}

export { AppDataSource, initializeDataSource };
