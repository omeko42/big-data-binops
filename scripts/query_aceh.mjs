import { runBE } from './be_exec.mjs';

const script = `
docker exec bdb-api node -e '
  const { NestFactory } = require("@nestjs/core");
  const { DataSource } = require("typeorm");
  const { AppModule } = require("./dist/app.module");
  async function test() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const ds = app.get(DataSource);
    const rows = await ds.query("select id, kode, kode_canonical, deskripsi, parent_id from bdb_satker where parent_id=24 order by urutan nulls last, id limit 15;");
    console.log("Children of Polda Aceh (parent_id=24):");
    console.log(JSON.stringify(rows, null, 2));
    await app.close();
  }
  test().catch(console.error);
'
`;

console.log(runBE(script));
