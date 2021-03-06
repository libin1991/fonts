import * as fs from "fs";
import * as path from "path";
// tslint:disable-next-line:no-implicit-dependencies
import { performance } from "perf_hooks";
import { promisify } from "util";
import {
  CmapTable,
  Font,
  GlyphTable,
  HeadTable,
  HheaTable,
  HmtxTable,
  LocaTable,
  MaxpTable,
  NameTable,
  PostTable,
  TableTag,
  BufferWriter,
  Minifier
} from "../src";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async () => {
  const buf = await readFile(path.resolve(__dirname, "方正瘦金书简体.ttf"));

  performance.mark("font.satisfy.begin");
  const font = new Font(buf);
  font.satisfy();
  performance.mark("font.satisfy.end");
  performance.measure("font.satisfy", "font.satisfy.begin", "font.satisfy.end");
  console.log(performance.getEntriesByName("font.satisfy")[0].duration + "ms");

  font.tableRecords.forEach(r => console.log(r.tagName));
  const cmap = font.tables.get(TableTag.cmap)!.as<CmapTable>();
  console.log(cmap.subTables);
  const head = font.tables.get(TableTag.head)!.as<HeadTable>();
  console.log(head);
  const glyph = font.tables.get(TableTag.glyf)!.as<GlyphTable>();
  console.log(glyph);
  const maxp = font.tables.get(TableTag.maxp)!.as<MaxpTable>();
  console.log(maxp);
  const name = font.tables.get(TableTag.name)!.as<NameTable>();
  console.log(name);
  const loca = font.tables.get(TableTag.loca)!.as<LocaTable>();
  console.log(loca);
  const hhea = font.tables.get(TableTag.hhea)!.as<HheaTable>();
  console.log(hhea);
  const hmtx = font.tables.get(TableTag.hmtx)!.as<HmtxTable>();
  console.log(hmtx);
  const post = font.tables.get(TableTag.post)!.as<PostTable>();
  console.log(post);

  const mini = new Minifier();
  const newFont = mini.filter(font, "方正瘦金书简体");
  console.log(newFont);

  const f = path.resolve(__dirname, "..", "..", "test", `test.ttf`);
  const wb = new BufferWriter();
  newFont.write2(wb);
  writeFile(f, wb.buffer);
})();
