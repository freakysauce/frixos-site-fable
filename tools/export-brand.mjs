// Export brand SVGs from the canonical golden-spiral geometry (v14 params,
// same values as assets/js/main.js). Run: node tools/export-brand.mjs
import { writeFileSync } from 'node:fs';

const PHI = (1 + Math.sqrt(5)) / 2;
const B = Math.log(PHI) / (Math.PI / 2);
const D2R = Math.PI / 180;

function ribbon(H, mirror) {
  const o = [], n = [], S = 110;
  for (let i = 0; i <= S; i++) {
    const t = i / S;
    const th = H.sweepTurns * 2 * Math.PI * t;
    const r = H.rRoot * Math.exp(-B * th);
    const a = H.startAngle * D2R + th;
    let x = H.cx + r * Math.cos(a), y = H.cy + r * Math.sin(a);
    if (mirror) x = 512 - x;
    let w = H.wRoot + (H.wTip - H.wRoot) * Math.pow(t, H.taperPow);
    w = Math.min(w, H.widthCap * r);
    const s = mirror ? -1 : 1, nx = Math.cos(a) * s, ny = Math.sin(a);
    o.push([x + nx * w, y + ny * w]); n.push([x - nx * w, y - ny * w]);
  }
  const pts = o.concat(n.reverse());
  return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
}

const MAIN = { cx: 332, cy: 252, rRoot: 140, startAngle: -102, sweepTurns: 1.18,
               wRoot: 34, wTip: 1.5, taperPow: 1.4, widthCap: 0.52 };
const FAT  = { cx: 332, cy: 252, rRoot: 140, startAngle: -102, sweepTurns: 1.18,
               wRoot: 42, wTip: 2.5, taperPow: 1.6, widthCap: 0.60 };
const FACE = 'M228 158L284 158L279 296L256 414L233 296L228 158Z';
const FACE_FAT = 'M224 156L288 156L282 298L256 418L230 298L224 156Z';

const paths = (H, F, fill) =>
  `<path d="${ribbon(H, false)}" fill="${fill}"/><path d="${ribbon(H, true)}" fill="${fill}"/><path d="${F}" fill="${fill}"/>`;

// master: gold on transparent, tight square
writeFileSync('assets/brand/sigil.svg',
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${paths(MAIN, FACE, '#C89B3C')}</svg>\n`);

// ink variant
writeFileSync('assets/brand/sigil-ink.svg',
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${paths(MAIN, FACE, '#141414')}</svg>\n`);

// favicon: fat variant, gold on ink rounded square
writeFileSync('favicon.svg',
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" rx="72" fill="#141414"/>
<g transform="translate(256 246) scale(.82) translate(-256 -256)">${paths(FAT, FACE_FAT, '#D4A843')}</g>
</svg>\n`);

console.log('brand svgs written');
