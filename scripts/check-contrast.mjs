// WCAG AA audit for both themes. Text sits on a sky GRADIENT and on frosted
// glass, so every text colour is checked against every gradient stop and
// against the glass flattened over each stop (worst case wins).
//
// KEEP IN SYNC with src/styles/tokens.css.

const hex = (n) => '#' + n.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
// Flatten fg at `alpha` over opaque bg.
const over = (fg, alpha, bg) => hex(rgb(fg).map((c, i) => c * alpha + rgb(bg)[i] * (1 - alpha)));

const themes = {
  light: {
    stops: ['#c4defb', '#ddd7fb', '#fbe1d3'],
    surface: '#dde3fb', surfaceRaised: '#f2f0fd', surfaceSunken: '#d3dcf8',
    glass: { color: '#ffffff', alpha: 0.62 },
    // Mobile / no-backdrop-filter fallback is more opaque -- also audited.
    glassOpaque: { color: '#ffffff', alpha: 0.78 },
    ink: '#0f1733', inkMuted: '#3b4566', inkSubtle: '#4d5578',
    accent: '#5b2fd0', accentFill: '#6d28d9', accentInk: '#ffffff',
    focus: '#5b2fd0',
    // --field-border is navy-900 at 55% flattened over --field-bg (#f7f6fe).
    fieldBg: '#f7f6fe', fieldBorder: over('#0f1733', 0.55, '#f7f6fe'),
  },
  dark: {
    stops: ['#04061a', '#0a0e2c', '#1b1340'],
    surface: '#0a0e2c', surfaceRaised: '#101536', surfaceSunken: '#04061a',
    glass: { color: '#141a3c', alpha: 0.6 },
    glassOpaque: { color: '#141a3c', alpha: 0.82 },
    ink: '#e8e9f6', inkMuted: '#aab0cf', inkSubtle: '#8a92b8',
    accent: '#b39dff', accentFill: '#7c3aed', accentInk: '#ffffff',
    focus: '#b39dff',
    // --field-border is star-100 at 45% flattened over --field-bg (#04061a).
    fieldBg: '#04061a', fieldBorder: over('#e8e9f6', 0.45, '#04061a'),
  },
};

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = (h) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// Every background text can land on: the sky stops, the solid fallbacks, and
// glass over each stop (normal + the more opaque mobile variant).
const backdrops = (t) => ({
  sky: t.stops,
  solid: [t.surface, t.surfaceRaised, t.surfaceSunken],
  glass: t.stops.flatMap((s) => [
    over(t.glass.color, t.glass.alpha, s),
    over(t.glassOpaque.color, t.glassOpaque.alpha, s),
  ]),
});

const worst = (fg, bgs) => Math.min(...bgs.map((bg) => ratio(fg, bg)));

// [label, fg key, backdrop group(s), minimum]
const textChecks = [
  ['body text', 'ink', ['sky', 'solid', 'glass'], 4.5],
  ['muted text', 'inkMuted', ['sky', 'solid', 'glass'], 4.5],
  ['subtle text (labels, meta)', 'inkSubtle', ['sky', 'solid', 'glass'], 4.5],
  ['accent text / links', 'accent', ['sky', 'solid', 'glass'], 4.5],
  ['focus ring', 'focus', ['sky', 'glass'], 3.0],
];

let fail = 0;
const report = (ok, r, min, label) => {
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(6)}:1  (min ${min})  ${label}`);
};

for (const [name, t] of Object.entries(themes)) {
  console.log(`\n=== ${name.toUpperCase()} ===`);
  const b = backdrops(t);
  for (const [label, key, groups, min] of textChecks) {
    const r = worst(t[key], groups.flatMap((g) => b[g]));
    report(r >= min, r, min, `${label} -- worst over ${groups.join(' + ')}`);
  }
  // Filled button: text on the fill colour (a solid pair).
  let r = ratio(t.accentInk, t.accentFill);
  report(r >= 4.5, r, 4.5, 'text on accent fill (buttons)');
  // Form fields are solid.
  r = ratio(t.fieldBorder, t.fieldBg);
  report(r >= 3, r, 3, 'form field border vs field');
  r = ratio(t.focus, t.fieldBg);
  report(r >= 3, r, 3, 'focus ring vs form field');
}
console.log(fail === 0 ? '\nAll pairs meet WCAG AA in both themes.' : `\n${fail} FAILING PAIR(S)`);
process.exit(fail ? 1 : 0);
