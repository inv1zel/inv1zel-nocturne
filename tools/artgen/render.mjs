// Procedural art generator: renders raymarched monochrome scenes to PNG via headless Chromium (WebGL2).
// Usage: node tools/artgen/render.mjs [filter] [--preview]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jobs } from './jobs.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(dir, 'out');
fs.mkdirSync(outDir, { recursive: true });
const args = process.argv.slice(2);
const preview = args.includes('--preview');
const filter = args.find((a) => !a.startsWith('--'));
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

function buildShader(scene, aa) {
  const src = read(`${scene}.glsl`).replace('#include march', read('march.glsl'));
  return read('common.glsl') + `\n#define AA ${aa}\n` + src + '\n' + read('post.glsl');
}

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('console', (m) => console.log('[page]', m.text()));

for (const job of jobs.filter((j) => !filter || j.name.includes(filter))) {
  const scale = preview ? 0.3 : job.ss ?? 1;
  const w = Math.round(job.w * scale), h = Math.round(job.h * scale);
  const frag = buildShader(job.scene, preview ? 1 : job.aa ?? 2);
  const t0 = Date.now();
  const dataUrl = await page.evaluate(async ({ frag, w, h, u }) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const gl = c.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
    const mk = (type, s) => { const sh = gl.createShader(type); gl.shaderSource(sh, s); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, '#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0,1);}'));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const set = (n, v) => { const l = gl.getUniformLocation(prog, n); if (l == null) return;
      if (typeof v === 'number') gl.uniform1f(l, v); else if (v.length === 2) gl.uniform2fv(l, v); else gl.uniform3fv(l, v); };
    set('uRes', [w, h]); for (const k in u) set(k, u[k]);
    gl.viewport(0, 0, w, h); gl.enable(gl.SCISSOR_TEST);
    const T = 160; const px = new Uint8Array(4);
    for (let y = 0; y < h; y += T) for (let x = 0; x < w; x += T) {
      gl.scissor(x, y, T, T); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      await new Promise((r) => setTimeout(r, 0));
    }
    return c.toDataURL('image/png');
  }, { frag, w, h, u: { uRo: job.ro, uTa: job.ta, uFov: job.fov ?? 2, uSeed: job.seed ?? 1, uVar: job.v ?? 0, uExp: job.exp ?? 1, uTint: job.tint ?? [1, 1, 1] } });
  const file = path.join(outDir, `${job.name}${preview ? '.preview' : ''}.png`);
  fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log(`${job.name} ${w}x${h} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
await browser.close();
