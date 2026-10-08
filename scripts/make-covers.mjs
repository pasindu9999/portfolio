/**
 * Generates the cover art for projects that have no screenshot.
 * Run with: npm run covers
 *
 * Each cover is a small illustration drawn from what the project actually is
 * (read src/content/projects/*.md before changing one), set in the site's
 * night-sky palette so the cards belong to the page: deep indigo sky, violet
 * horizon glow, a few stars, frosted-glass shapes, and the title with its last
 * word in the accent colour -- the same device as the section headings.
 *
 * They are deliberately NOT mock screenshots. ShiftReason is the one project
 * with a real screenshot, and it is not generated here.
 *
 * Output names are `<slug>-cover.png`. The dev server serves optimised images
 * with a one-year cache lifetime on a URL that has no content hash, so
 * re-using a filename after a redesign leaves browsers showing the old art
 * until a hard refresh. A new name means a new URL.
 */
import sharp from 'sharp';

const W = 1600;
const H = 1067;

// KEEP IN SYNC with the dark theme in src/styles/tokens.css.
const T = {
  surface: '#0a0e2c', // night-900
  top: '#04061a', // night-950, top of the sky gradient
  bottom: '#1b1340', // night-800, bottom of the sky gradient
  ink: '#e8e9f6', // star-100
  muted: '#aab0cf', // star-300
  subtle: '#8a92b8', // star-500
  rule: '#2d3566',
  accent: '#b39dff', // violet-300
  accentHi: '#cbbcff', // violet-200
  fill: '#7c3aed', // violet-500
};
const FONT = 'Helvetica, Arial, sans-serif';

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

// Deterministic specks, so re-running the script never changes the covers.
function stars(n) {
  let a = 20260814;
  const rnd = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(rnd() * W);
    const y = Math.round(Math.pow(rnd(), 1.3) * H);
    const r = (0.8 + rnd() * 1.4).toFixed(1);
    const o = (0.25 + rnd() * 0.55).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${o}"/>`;
  }
  return out;
}
const starField = stars(70);

// ---------------------------------------------------------------- primitives

/** Frosted-glass panel. */
const glass = (x, y, w, h, r = 22, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#glass)" stroke="${o.stroke ?? T.accent}" stroke-opacity="${o.strokeOpacity ?? 0.34}" stroke-width="${o.sw ?? 1.6}"${o.extra ? ' ' + o.extra : ''}/>`;

const label = (x, y, text, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${o.size ?? 20}" letter-spacing="${o.ls ?? 4}" fill="${o.fill ?? T.subtle}" text-anchor="${o.anchor ?? 'start'}"${o.weight ? ` font-weight="${o.weight}"` : ''}>${esc(text)}</text>`;

const star5 = (cx, cy, r) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(cx + Math.cos(ang) * rad).toFixed(1)},${(cy + Math.sin(ang) * rad).toFixed(1)}`);
  }
  return pts.join(' ');
};

const polar = (cx, cy, r, deg) => [
  cx + r * Math.cos((deg * Math.PI) / 180),
  cy + r * Math.sin((deg * Math.PI) / 180),
];

// ------------------------------------------------------------------- motifs
// All of them live in the right-hand zone, roughly x 900-1510, y 230-880.

/**
 * Agentic AI: seven agents around one ensemble. Three are the model families
 * the project blends (RAG, a QLoRA fine-tuned Llama, a PyTorch regressor); the
 * rest are plain nodes. Everything converges on the ensemble at the centre.
 */
function agents() {
  const cx = 1230;
  const cy = 545;
  const named = [
    { r: 300, a: -52, name: 'RAG', dx: 26, dy: -16, anchor: 'start' },
    { r: 300, a: 58, name: 'QLoRA', dx: 24, dy: 40, anchor: 'start' },
    { r: 300, a: 192, name: 'PyTorch', dx: -26, dy: -20, anchor: 'end' },
  ];
  const plain = [0, 112, 232, 304].map((a) => ({ r: 190, a }));

  let s = '';
  // Orbits.
  s += `<circle cx="${cx}" cy="${cy}" r="190" fill="none" stroke="${T.accent}" stroke-opacity="0.16" stroke-width="1.5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="300" fill="none" stroke="${T.accent}" stroke-opacity="0.22" stroke-width="1.5" stroke-dasharray="3 12"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="108" fill="none" stroke="${T.accent}" stroke-opacity="0.1" stroke-width="1.5"/>`;

  // Links first, so nodes sit on top.
  for (const n of [...named, ...plain]) {
    const [x, y] = polar(cx, cy, n.r, n.a);
    const hot = 'name' in n;
    s += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${cx}" y2="${cy}" stroke="${T.accent}" stroke-opacity="${hot ? 0.55 : 0.22}" stroke-width="${hot ? 2 : 1.4}"/>`;
  }
  // Plain agents.
  for (const n of plain) {
    const [x, y] = polar(cx, cy, n.r, n.a);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="#141a3c" stroke="${T.accent}" stroke-opacity="0.6" stroke-width="2"/>`;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${T.accent}" opacity="0.8"/>`;
  }
  // Model families: bright, glowing, labelled.
  for (const n of named) {
    const [x, y] = polar(cx, cy, n.r, n.a);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="34" fill="url(#orb)" opacity="0.45"/>`;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${T.accent}" filter="url(#glow)"/>`;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#ffffff"/>`;
    s += label(x + n.dx, y + n.dy, n.name, { size: 24, fill: T.ink, ls: 2, anchor: n.anchor, weight: 600 });
  }
  // The ensemble.
  s += `<circle cx="${cx}" cy="${cy}" r="96" fill="url(#orb)" opacity="0.7"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="40" fill="${T.accentHi}" filter="url(#glow)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="20" fill="#ffffff"/>`;
  // The label sits on its own pill: links run through this spot.
  s += `<rect x="${cx - 86}" y="${cy + 62}" width="172" height="34" rx="17" fill="#0e1233" fill-opacity="0.92" stroke="${T.accent}" stroke-opacity="0.4" stroke-width="1.4"/>`;
  s += label(cx, cy + 86, 'ENSEMBLE', { size: 16, ls: 5, anchor: 'middle', fill: T.accentHi });
  return s;
}

/**
 * AI PDF Chatbot: two glass pages, the answer lines highlighted, page-level
 * citation chips, and the recall@5 jump from hybrid retrieval.
 */
function pages() {
  const lines = (x, y, widths, hi = []) =>
    widths
      .map((w, i) => {
        const yy = y + i * 34;
        const on = hi.includes(i);
        return (
          (on
            ? `<rect x="${x - 10}" y="${yy - 12}" width="${w + 20}" height="30" rx="8" fill="${T.accent}" opacity="0.2"/><rect x="${x - 10}" y="${yy - 12}" width="5" height="30" rx="2.5" fill="${T.accent}"/>`
            : '') +
          `<rect x="${x}" y="${yy}" width="${w}" height="8" rx="4" fill="${on ? T.accentHi : T.muted}" opacity="${on ? 0.9 : 0.34}"/>`
        );
      })
      .join('');

  let s = '';
  // Back page.
  s += `<g transform="rotate(-6 1130 470)">${glass(930, 230, 380, 500, 26, { strokeOpacity: 0.2 })}${lines(970, 300, [250, 300, 210, 280, 260, 190, 290], [])}</g>`;
  // Front page.
  s += `<g transform="rotate(3 1230 480)">`;
  // Solid underlay, so the back page does not show through the glass.
  s += `<rect x="1030" y="215" width="410" height="540" rx="26" fill="#0d1233" fill-opacity="0.94"/>`;
  s += glass(1030, 215, 410, 540, 26, { strokeOpacity: 0.45 });
  s += `<rect x="1072" y="262" width="170" height="16" rx="8" fill="${T.accent}"/>`;
  // Highlighted lines (the answer evidence) are 1, 3 and 8: spaced so each
  // citation chip below has room beside its own line.
  s += lines(1072, 320, [300, 330, 250, 320, 280, 330, 210, 310, 290, 240, 320, 180], [1, 3, 8]);
  s += `</g>`;
  // Page-level citations: chips hanging off the highlighted lines. y is the
  // line's y (320 + 34*i) + ~9 for the page's 3deg tilt out at x~1400, less
  // half the chip height so it is centred on the line.
  const chip = (x, y, t) =>
    `<rect x="${x}" y="${y}" width="104" height="44" rx="22" fill="${T.fill}"/><text x="${x + 52}" y="${y + 29}" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="1" fill="#ffffff" text-anchor="middle">${esc(t)}</text>`;
  s += `<g filter="url(#glow)">${chip(1388, 345, 'p. 4')}${chip(1394, 413, 'p. 11')}${chip(1398, 583, 'p. 27')}</g>`;
  // Recall badge.
  s += glass(940, 790, 570, 96, 24, { strokeOpacity: 0.5 });
  s += label(976, 828, 'RECALL@5', { size: 18, ls: 5 });
  s += `<text x="976" y="868" font-family="${FONT}" font-size="34" font-weight="700" fill="${T.muted}">0.962</text>`;
  s += `<path d="M1090 856 H1180 M1166 842 L1182 856 L1166 870" fill="none" stroke="${T.accent}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<text x="1210" y="868" font-family="${FONT}" font-size="40" font-weight="700" fill="${T.accentHi}">1.000</text>`;
  s += label(1484, 868, 'HYBRID', { size: 16, ls: 5, anchor: 'end', fill: T.accent });
  return s;
}

/**
 * ALE Portal: a support portal. Services you manage, a custom solution being
 * assembled, and time-to-resolve falling. No numbers: the project has no
 * public metrics, so the picture does not invent any.
 */
function portal() {
  let s = '';
  s += glass(930, 235, 580, 622, 28, { strokeOpacity: 0.45 });
  // Window chrome.
  s += `<circle cx="972" cy="274" r="7" fill="${T.accent}" opacity="0.9"/><circle cx="998" cy="274" r="7" fill="${T.accent}" opacity="0.5"/><circle cx="1024" cy="274" r="7" fill="${T.accent}" opacity="0.25"/>`;
  s += `<line x1="930" y1="308" x2="1510" y2="308" stroke="${T.accent}" stroke-opacity="0.2" stroke-width="1.5"/>`;
  // Sidebar.
  s += `<line x1="1070" y1="308" x2="1070" y2="857" stroke="${T.accent}" stroke-opacity="0.16" stroke-width="1.5"/>`;
  [0, 1, 2, 3].forEach((i) => {
    const y = 342 + i * 52;
    if (i === 0) s += `<rect x="948" y="${y - 8}" width="108" height="34" rx="17" fill="${T.accent}" opacity="0.28"/>`;
    s += `<rect x="962" y="${y + 3}" width="${i === 0 ? 70 : 56 + (i % 2) * 18}" height="9" rx="4.5" fill="${i === 0 ? T.accentHi : T.muted}" opacity="${i === 0 ? 0.95 : 0.4}"/>`;
  });
  // Service tiles.
  s += label(1098, 346, 'SUPPORT SERVICES', { size: 15, ls: 4 });
  const tile = (x, y, on) =>
    `${glass(x, y, 190, 112, 18, { strokeOpacity: on ? 0.85 : 0.22, sw: on ? 2.2 : 1.4 })}` +
    `<circle cx="${x + 36}" cy="${y + 38}" r="15" fill="${on ? T.accent : T.muted}" opacity="${on ? 1 : 0.35}"${on ? ' filter="url(#glow)"' : ''}/>` +
    `<rect x="${x + 22}" y="${y + 70}" width="${on ? 120 : 96}" height="9" rx="4.5" fill="${on ? T.accentHi : T.muted}" opacity="${on ? 0.9 : 0.35}"/>` +
    `<rect x="${x + 22}" y="${y + 88}" width="64" height="7" rx="3.5" fill="${T.muted}" opacity="0.2"/>`;
  s += tile(1098, 366, true) + tile(1306, 366, false) + tile(1098, 492, false) + tile(1306, 492, false);
  // Custom solution: blocks snapping together, the last one still dashed.
  s += label(1098, 650, 'CUSTOM SOLUTION', { size: 15, ls: 4 });
  s += `<rect x="1098" y="664" width="100" height="58" rx="12" fill="${T.accent}" opacity="0.55"/>`;
  s += `<rect x="1208" y="664" width="100" height="58" rx="12" fill="${T.accent}" opacity="0.8"/>`;
  s += `<rect x="1318" y="664" width="100" height="58" rx="12" fill="none" stroke="${T.accent}" stroke-width="2.4" stroke-dasharray="7 7"/>`;
  s += `<path d="M1368 680 V706 M1355 693 H1381" stroke="${T.accent}" stroke-width="3" stroke-linecap="round"/>`;
  // Time to resolve, falling.
  s += label(1098, 772, 'TIME TO RESOLVE', { size: 15, ls: 4 });
  s += `<path d="M1098 796 C1160 798 1180 812 1230 818 S 1330 828 1402 828" fill="none" stroke="${T.accent}" stroke-width="3.5" stroke-linecap="round" filter="url(#glow)"/>`;
  s += `<path d="M1436 798 V826 M1424 813 L1436 828 L1448 813" fill="none" stroke="${T.accentHi}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}

/**
 * Performance Appraisal: a rating becomes a salary increment. Stars and
 * criteria bars on top, a step up below.
 */
function appraisal() {
  let s = '';
  s += label(940, 268, 'RATING', { size: 18, ls: 6 });
  [0, 1, 2, 3, 4].forEach((i) => {
    const on = i < 4;
    s += `<polygon points="${star5(972 + i * 84, 330, 36)}" fill="${on ? T.accent : 'none'}" stroke="${T.accent}" stroke-opacity="${on ? 1 : 0.5}" stroke-width="2.4" stroke-linejoin="round"${on ? ' filter="url(#glow)"' : ''}/>`;
  });
  const bars = [
    ['QUALITY', 0.74],
    ['TIMELINESS', 0.6],
    ['TEAMWORK', 0.88],
  ];
  bars.forEach(([name, v], i) => {
    const y = 420 + i * 78;
    s += label(940, y, name, { size: 15, ls: 5 });
    s += `<rect x="940" y="${y + 14}" width="560" height="22" rx="11" fill="url(#glass)" stroke="${T.accent}" stroke-opacity="0.3" stroke-width="1.4"/>`;
    s += `<rect x="940" y="${y + 14}" width="${Math.round(560 * v)}" height="22" rx="11" fill="url(#vio)"/>`;
  });
  // From rating to increment.
  s += `<path d="M1220 660 V716 M1200 696 L1220 718 L1240 696" fill="none" stroke="${T.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
  [0, 1, 2, 3, 4].forEach((i) => {
    const h = 40 + i * 30;
    const x = 1070 + i * 86;
    const top = i === 4;
    s += `<rect x="${x}" y="${860 - h}" width="74" height="${h}" rx="10" fill="${top ? T.accent : T.accent}" opacity="${top ? 1 : 0.28 + i * 0.12}"${top ? ' filter="url(#glow)"' : ''}/>`;
  });
  s += label(1070, 892, 'SALARY INCREMENT', { size: 16, ls: 6, fill: T.accentHi });
  return s;
}

/**
 * Movie Content Rating: a film frame with a person detected and their pose
 * tracked -- human action recognition -- with neighbouring frames and a
 * scrubber below.
 */
function vision() {
  let s = '';
  // Film frame with sprocket strips.
  s += glass(920, 240, 590, 470, 22, { strokeOpacity: 0.45 });
  for (let i = 0; i < 12; i++) {
    s += `<rect x="${944 + i * 47}" y="252" width="26" height="14" rx="4" fill="${T.accent}" opacity="0.32"/>`;
    s += `<rect x="${944 + i * 47}" y="684" width="26" height="14" rx="4" fill="${T.accent}" opacity="0.32"/>`;
  }
  // Scene floor glow.
  s += `<ellipse cx="1215" cy="650" rx="230" ry="26" fill="url(#orb)" opacity="0.5"/>`;
  // Pose skeleton.
  const J = {
    head: [1220, 372],
    neck: [1220, 408],
    ls: [1176, 418],
    rs: [1264, 418],
    lh: [1120, 536],
    rh: [1340, 322],
    le: [1138, 478],
    re: [1308, 372],
    hip: [1220, 520],
    lk: [1190, 590],
    rk: [1258, 592],
    lf: [1172, 648],
    rf: [1288, 650],
  };
  const bone = (a, b) =>
    `<line x1="${J[a][0]}" y1="${J[a][1]}" x2="${J[b][0]}" y2="${J[b][1]}"/>`;
  s += `<g stroke="${T.accent}" stroke-width="5" stroke-linecap="round" filter="url(#glow)">`;
  s += bone('neck', 'hip') + bone('ls', 'rs') + bone('ls', 'le') + bone('le', 'lh');
  s += bone('rs', 're') + bone('re', 'rh') + bone('hip', 'lk') + bone('lk', 'lf');
  s += bone('hip', 'rk') + bone('rk', 'rf') + bone('neck', 'head');
  s += `</g>`;
  s += `<circle cx="${J.head[0]}" cy="${J.head[1]}" r="26" fill="none" stroke="${T.accent}" stroke-width="5" filter="url(#glow)"/>`;
  for (const k of Object.keys(J)) {
    if (k === 'head') continue;
    s += `<circle cx="${J[k][0]}" cy="${J[k][1]}" r="8" fill="#ffffff"/>`;
  }
  // Detection box with corner brackets and a tag.
  const bx = 1086, by = 306, bw = 294, bh = 366;
  s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="6" fill="${T.accent}" fill-opacity="0.05" stroke="${T.accent}" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="10 8"/>`;
  const corner = (x, y, dx, dy) =>
    `<path d="M${x} ${y + dy * 34} V${y} H${x + dx * 34}" fill="none" stroke="${T.accentHi}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += corner(bx, by, 1, 1) + corner(bx + bw, by, -1, 1) + corner(bx, by + bh, 1, -1) + corner(bx + bw, by + bh, -1, -1);
  s += `<rect x="${bx}" y="${by - 38}" width="188" height="34" rx="8" fill="${T.fill}"/>`;
  s += label(bx + 94, by - 14, 'PERSON · ACTION', { size: 15, ls: 2, anchor: 'middle', fill: '#ffffff', weight: 700 });
  // Neighbouring frames and the scrubber.
  [0, 1, 2, 3].forEach((i) => {
    // 4 thumbnails of 136px spanning the frame's 590px width, flush both sides.
    const x = 920 + i * 151.33;
    const on = i === 2;
    s += `<rect x="${x}" y="738" width="136" height="88" rx="12" fill="url(#glass)" stroke="${T.accent}" stroke-opacity="${on ? 0.95 : 0.25}" stroke-width="${on ? 2.6 : 1.4}"${on ? ' filter="url(#glow)"' : ''}/>`;
    s += `<circle cx="${x + 68}" cy="772" r="9" fill="${T.accent}" opacity="${on ? 0.95 : 0.25}"/><rect x="${x + 56}" y="786" width="24" height="26" rx="8" fill="${T.accent}" opacity="${on ? 0.95 : 0.25}"/>`;
  });
  s += `<line x1="920" y1="858" x2="1510" y2="858" stroke="${T.accent}" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round"/>`;
  s += `<line x1="920" y1="858" x2="1228" y2="858" stroke="${T.accent}" stroke-width="3" stroke-linecap="round"/>`;
  s += `<circle cx="1228" cy="858" r="9" fill="#ffffff" filter="url(#glow)"/>`;
  return s;
}

// ------------------------------------------------------------------- covers

const COVERS = [
  {
    file: 'agentic-ai-cover.png',
    index: '01',
    kicker: 'SELF-DIRECTED ENGINEERING',
    title: 'Agentic AI & LLM Engineering',
    meta: '7 AGENTS · 400K VECTORS · QLORA 3B',
    motif: agents,
  },
  {
    file: 'ai-pdf-chatbot-cover.png',
    index: '02',
    kicker: 'RETRIEVAL-AUGMENTED GENERATION',
    title: 'AI PDF Chatbot',
    meta: '45-CONFIG SWEEP · 113 TESTS · PAGE-LEVEL CITATIONS',
    motif: pages,
  },
  {
    file: 'ale-portal-cover.png',
    index: '03',
    kicker: 'IFS — PRODUCTION',
    title: 'ALE Portal',
    meta: 'ANGULAR · .NET FRAMEWORK',
    motif: portal,
  },
  {
    file: 'performance-appraisal-cover.png',
    index: '04',
    kicker: 'ACADEMIC RESEARCH — UOM',
    title: 'Employee Performance Appraisal System',
    meta: 'ANGULAR · ASP.NET · SQL SERVER',
    motif: appraisal,
  },
  {
    file: 'movie-rating-cover.png',
    index: '05',
    kicker: 'FINAL YEAR THESIS — UOM',
    title: 'Automated Movie Content Rating System',
    meta: 'YOLOV8 · HUMAN ACTION RECOGNITION',
    motif: vision,
  },
];

const DEFS = `<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${T.top}"/>
    <stop offset="0.55" stop-color="${T.surface}"/>
    <stop offset="1" stop-color="${T.bottom}"/>
  </linearGradient>
  <radialGradient id="horizon" cx="0.5" cy="1.08" r="0.75">
    <stop offset="0" stop-color="#7c3aed" stop-opacity="0.34"/>
    <stop offset="1" stop-color="#7c3aed" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="orb">
    <stop offset="0" stop-color="#cbbcff" stop-opacity="0.9"/>
    <stop offset="0.35" stop-color="#7c3aed" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#7c3aed" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.13"/>
    <stop offset="1" stop-color="#b39dff" stop-opacity="0.04"/>
  </linearGradient>
  <linearGradient id="vio" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#7c3aed"/>
    <stop offset="1" stop-color="#cbbcff"/>
  </linearGradient>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="9" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>`;

for (const c of COVERS) {
  const lines = wrap(c.title, 15);
  const firstY = 520 - (lines.length - 2) * 52;
  const titleSvg = lines
    .map((l, i) => {
      const isLast = i === lines.length - 1;
      const words = l.split(' ');
      const head = isLast && words.length > 1 ? words.slice(0, -1).join(' ') + ' ' : '';
      const tail = isLast ? words[words.length - 1] : l;
      return `<text x="96" y="${firstY + i * 104}" font-family="${FONT}" font-size="94" font-weight="700" letter-spacing="-4" fill="${T.ink}">${esc(head)}${isLast ? `<tspan fill="${T.accent}">${esc(tail)}</tspan>` : esc(tail)}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    ${DEFS}
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <rect width="${W}" height="${H}" fill="url(#horizon)"/>
    ${starField}
    <line x1="96" y1="180" x2="${W - 96}" y2="180" stroke="${T.rule}" stroke-width="1.5"/>
    <text x="96" y="150" font-family="${FONT}" font-size="26" letter-spacing="7" fill="${T.subtle}">${esc(c.index)} / ${esc(c.kicker)}</text>
    ${titleSvg}
    <line x1="96" y1="${H - 150}" x2="${W - 96}" y2="${H - 150}" stroke="${T.rule}" stroke-width="1.5"/>
    <text x="96" y="${H - 100}" font-family="${FONT}" font-size="24" letter-spacing="5" fill="${T.subtle}">${esc(c.meta)}</text>
    ${c.motif()}
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(`src/assets/projects/${c.file}`);
  console.log('wrote src/assets/projects/' + c.file);
}
