/**
 * Generates typographic covers for projects that have no screenshot.
 * Run with: npm run covers
 *
 * These are deliberately NOT mock screenshots. They are editorial cards drawn
 * from the same tokens as the site, so a project without a UI to photograph
 * (a CLI pipeline, a proprietary internal portal) still reads as designed
 * rather than as a missing image.
 */
import sharp from 'sharp';

const W = 1600;
const H = 1067;

const T = {
  surface: '#0c0d10',
  raised: '#16181d',
  ink: '#edeae3',
  subtle: '#6e6960',
  rule: '#2b2e35',
  accent: '#d8ff47',
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Crude wrap for a display line at the given char budget. */
function wrap(text, max) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

const COVERS = [
  {
    file: 'agentic-ai.png',
    index: '01',
    kicker: 'SELF-DIRECTED ENGINEERING',
    title: 'Agentic AI & LLM Engineering',
    meta: '7 AGENTS · 400K VECTORS · QLORA 3B',
    motif: 'agents',
  },
  {
    file: 'ai-pdf-chatbot.png',
    index: '02',
    kicker: 'RETRIEVAL-AUGMENTED GENERATION',
    title: 'AI PDF Chatbot',
    meta: '45-CONFIG SWEEP · RECALL@5 1.000',
    motif: 'bars',
  },
  {
    file: 'ale-portal.png',
    index: '03',
    kicker: 'IFS — PRODUCTION',
    title: 'ALE Portal',
    meta: 'ANGULAR · .NET FRAMEWORK',
    motif: 'grid',
  },
  {
    file: 'performance-appraisal.png',
    index: '04',
    kicker: 'ACADEMIC RESEARCH — UOM',
    title: 'Employee Performance Appraisal System',
    meta: 'RATING · SALARY INCREMENTS',
    motif: 'meter',
  },
  {
    file: 'movie-rating.png',
    index: '05',
    kicker: 'FINAL YEAR THESIS — UOM',
    title: 'Automated Movie Content Rating System',
    meta: 'YOLOV8 · ACTION RECOGNITION',
    motif: 'reel',
  },
];

function motifSvg(kind) {
  if (kind === 'agents') {
    // Seven nodes converging on one — the ensemble.
    let s = '';
    for (let i = 0; i < 7; i++) {
      const y = 250 + i * 78;
      s += `<line x1="1040" y1="${y}" x2="1360" y2="600" stroke="${T.rule}" stroke-width="1.5"/>`;
      s += `<circle cx="1040" cy="${y}" r="9" fill="${i === 3 ? T.accent : T.raised}" stroke="${T.rule}" stroke-width="1.5"/>`;
    }
    s += `<circle cx="1360" cy="600" r="20" fill="${T.accent}"/>`;
    return s;
  }
  if (kind === 'bars') {
    // A retrieval benchmark ladder.
    const vals = [0.42, 0.61, 0.77, 0.86, 0.962, 1.0];
    let s = '';
    vals.forEach((v, i) => {
      const h = Math.round(v * 420);
      const x = 1040 + i * 62;
      s += `<rect x="${x}" y="${820 - h}" width="40" height="${h}" fill="${i >= 4 ? T.accent : T.raised}" stroke="${T.rule}" stroke-width="1.5"/>`;
    });
    s += `<line x1="1030" y1="821" x2="1420" y2="821" stroke="${T.rule}" stroke-width="1.5"/>`;
    return s;
  }
  if (kind === 'grid') {
    let s = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 4; c++) {
        const on = r === 1 && c === 2;
        s += `<rect x="${1050 + c * 95}" y="${330 + r * 95}" width="72" height="72" fill="${on ? T.accent : T.raised}" stroke="${T.rule}" stroke-width="1.5"/>`;
      }
    }
    return s;
  }
  if (kind === 'meter') {
    // A scorecard: rating criteria as horizontal bars, the overall score
    // (last, full-width) picked out in accent.
    const rows = [
      { label: 'QUALITY', v: 0.72 },
      { label: 'TIMELINESS', v: 0.6 },
      { label: 'TEAMWORK', v: 0.85 },
      { label: 'OVERALL', v: 0.95 },
    ];
    let s = '';
    rows.forEach((row, i) => {
      const y = 300 + i * 130;
      const w = Math.round(row.v * 460);
      const isLast = i === rows.length - 1;
      s += `<text x="1050" y="${y - 14}" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="4" fill="${T.subtle}">${esc(row.label)}</text>`;
      s += `<rect x="1050" y="${y}" width="460" height="34" fill="none" stroke="${T.rule}" stroke-width="1.5"/>`;
      s += `<rect x="1050" y="${y}" width="${w}" height="34" fill="${isLast ? T.accent : T.raised}"/>`;
    });
    return s;
  }
  // reel -- a filmstrip of frames, one picked out as the classified frame.
  let s = '';
  for (let i = 0; i < 6; i++) {
    const y = 280 + i * 92;
    const on = i === 3;
    s += `<rect x="1050" y="${y}" width="460" height="72" fill="${on ? T.accent : T.raised}" stroke="${T.rule}" stroke-width="1.5"/>`;
    // Sprocket ticks along the left edge of each frame.
    s += `<rect x="1030" y="${y + 26}" width="14" height="20" fill="${T.rule}"/>`;
  }
  return s;
}

for (const c of COVERS) {
  const lines = wrap(c.title, 15);
  const titleSvg = lines
    .map(
      (l, i) =>
        `<text x="96" y="${520 + i * 104}" font-family="Helvetica, Arial, sans-serif" font-size="94" font-weight="700" letter-spacing="-4" fill="${T.ink}">${esc(l)}</text>`,
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${T.surface}"/>
    <rect x="0" y="0" width="${W}" height="5" fill="${T.accent}"/>
    <line x1="96" y1="180" x2="${W - 96}" y2="180" stroke="${T.rule}" stroke-width="1.5"/>
    <text x="96" y="150" font-family="Helvetica, Arial, sans-serif" font-size="26"
          letter-spacing="7" fill="${T.subtle}">${esc(c.index)} / ${esc(c.kicker)}</text>
    ${titleSvg}
    <line x1="96" y1="${H - 150}" x2="${W - 96}" y2="${H - 150}" stroke="${T.rule}" stroke-width="1.5"/>
    <text x="96" y="${H - 100}" font-family="Helvetica, Arial, sans-serif" font-size="24"
          letter-spacing="5" fill="${T.subtle}">${esc(c.meta)}</text>
    ${motifSvg(c.motif)}
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`src/assets/projects/${c.file}`);
  console.log('wrote src/assets/projects/' + c.file);
}
