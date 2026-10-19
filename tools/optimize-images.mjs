// Builds responsive AVIF/WebP sets + a manifest consumed by <Art />.
// Source priority: art-source/<name>.(jpg|jpeg|png|webp|avif)  >  tools/artgen/out/<name>.png
// To swap an image for a real photograph, drop a file with the same name into art-source/ and re-run.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const genDir = path.join(root, 'tools/artgen/out');
const srcDir = path.join(root, 'art-source');
const outDir = path.join(root, 'public/art');
const manifestFile = path.join(root, 'src/data/art-manifest.json');
const WIDTHS = [800, 1600, 2400];
fs.mkdirSync(outDir, { recursive: true });

const sources = new Map();
for (const f of fs.existsSync(genDir) ? fs.readdirSync(genDir) : []) {
  if (f.endsWith('.png') && !f.includes('.preview')) sources.set(path.parse(f).name, path.join(genDir, f));
}
for (const f of fs.existsSync(srcDir) ? fs.readdirSync(srcDir) : []) {
  if (/\.(jpe?g|png|webp|avif)$/i.test(f)) sources.set(path.parse(f).name, path.join(srcDir, f));
}

if (!sources.size) {
  console.error('No source images. Run `npm run art:render` or add files to art-source/.');
  process.exit(1);
}

const manifest = {};
for (const [name, file] of [...sources].sort()) {
  const img = sharp(file).rotate();
  const { width, height } = await img.metadata();
  const widths = WIDTHS.filter((w) => w < width);
  if (!widths.length || widths.at(-1) < Math.min(width, 2400)) widths.push(Math.min(width, 2400));
  for (const w of widths) {
    const r = sharp(file).rotate().resize({ width: w, withoutEnlargement: true });
    await r.clone().avif({ quality: 52, effort: 6, chromaSubsampling: '4:2:0' }).toFile(path.join(outDir, `${name}-${w}.avif`));
    await r.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(outDir, `${name}-${w}.webp`));
  }
  const ph = await sharp(file).resize({ width: 24 }).blur(0.6).webp({ quality: 40 }).toBuffer();
  manifest[name] = { width, height, widths, placeholder: `data:image/webp;base64,${ph.toString('base64')}` };
  console.log(`${name.padEnd(16)} ${width}x${height} → ${widths.join(', ')}`);
}

// Film grain tile (static, tiny)
const N = 192;
const raw = Buffer.alloc(N * N * 2);
for (let i = 0; i < N * N; i++) { raw[i * 2] = Math.random() * 255; raw[i * 2 + 1] = 255; }
await sharp(raw, { raw: { width: N, height: N, channels: 2 } }).png({ compressionLevel: 9 }).toFile(path.join(root, 'public/grain.png'));

fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest → ${path.relative(root, manifestFile)}`);
