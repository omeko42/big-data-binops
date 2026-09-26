import { runBE } from './be_exec.mjs';

const script = `
docker exec bdb-api node -e '
  const { NestFactory } = require("@nestjs/core");
  const { AppModule } = require("./dist/app.module");
  async function test() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const { SatkerService } = require("./dist/bdb/satker/satker.service");
    const service = app.get(SatkerService);
    const roots = await service.roots();
    console.log("Roots result:", JSON.stringify(roots));
    if (roots && roots.data && roots.data.length > 0) {
      const rootId = roots.data[0].id;
      const children = await service.children(rootId);
      console.log("Children of root " + rootId + " (total " + children.data.length + "):");
      console.log(JSON.stringify(children.data.slice(0, 5), null, 2));
    }
    await app.close();
  }
  test().catch(e => { console.error("Error:", e); process.exit(1); });
'
`;

console.log(runBE(script));
