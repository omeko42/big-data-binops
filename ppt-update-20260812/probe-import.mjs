import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const source = "D:\\Prototype CAS\\EDIT MASTER MASAL\\Paparan_Teknis_CAS_Programmer_v1.4_20260812.pptx";
const deck = await PresentationFile.importPptx(await FileBlob.load(source));
const slide = deck.slides.items[0];
console.log("SLIDE_KEYS", Object.keys(slide));
console.log("SLIDE_PROTO", Object.getOwnPropertyNames(Object.getPrototypeOf(slide)));
console.log("SHAPES_KEYS", slide.shapes ? Object.keys(slide.shapes) : null);
console.log("SHAPES_PROTO", slide.shapes ? Object.getOwnPropertyNames(Object.getPrototypeOf(slide.shapes)) : null);
console.log("ELEMENTS_KEYS", slide.elements ? Object.keys(slide.elements) : null);
console.log("ELEMENTS_PROTO", slide.elements ? Object.getOwnPropertyNames(Object.getPrototypeOf(slide.elements)) : null);
const item = slide.shapes?.items?.[0] ?? slide.elements?.items?.[0];
console.log("ITEM_KEYS", item ? Object.keys(item) : null);
console.log("ITEM_PROTO", item ? Object.getOwnPropertyNames(Object.getPrototypeOf(item)) : null);
console.log("ITEM_ID", item?.id, "TEXT", item?.text);
console.log("NOTES", slide.notes, slide.speakerNotes);
const known = slide.shapes.getById("sh/2lozyton") || slide.elements.getById("sh/2lozyton");
console.log("KNOWN", known?.id, known?.type, known?.data, Object.keys(known || {}), known ? Object.getOwnPropertyNames(Object.getPrototypeOf(known)) : null);
console.log("KNOWN_TEXT", known?.text, known?.text ? Object.keys(known.text) : null, known?.text ? Object.getOwnPropertyNames(Object.getPrototypeOf(known.text)) : null);
console.log("NOTES_PROTO", Object.getOwnPropertyNames(Object.getPrototypeOf(slide.speakerNotes)));
console.log("NOTES_KEYS", Object.keys(slide.speakerNotes), slide.speakerNotes.toString?.());
console.log("NOTES_TEXT", slide.speakerNotes.text);
for (const [i, sh] of slide.shapes.items.entries()) {
  console.log("SH", i, sh.id, sh.type, JSON.stringify(sh.toSnapshot?.()).slice(0,1000));
}
const t = slide.shapes.getById("6");
console.log("TEXT_OBJ", t.text, Object.keys(t.text), Object.getOwnPropertyNames(Object.getPrototypeOf(t.text)));
