import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const source = "D:\\Prototype CAS\\EDIT MASTER MASAL\\Paparan_Teknis_CAS_Programmer_20260812.pptx";
const outDir = "D:\\Prototype CAS\\EDIT MASTER MASAL\\ppt-update-20260812\\manual-inspect";

await fs.mkdir(outDir, { recursive: true });
const deck = await PresentationFile.importPptx(await FileBlob.load(source));
const snapshot = await deck.inspect({
  kind: "slide,textbox,shape,image,table,chart,notes,layout",
  maxChars: 200000,
});
await fs.writeFile(path.join(outDir, "inspect.ndjson"), snapshot.ndjson, "utf8");

for (const [index, slide] of deck.slides.items.entries()) {
  const n = String(index + 1).padStart(2, "0");
  const png = await deck.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(outDir, `slide-${n}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(outDir, `slide-${n}.layout.json`), await layout.text(), "utf8");
}

const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(outDir, "montage.webp"), new Uint8Array(await montage.arrayBuffer()));
console.log(JSON.stringify({ slides: deck.slides.items.length, outDir }));
