const P = {
  paper50:'#fbfaf7', paper100:'#f4f1eb', paper200:'#e8e4db',
  ink900:'#16130f', ink700:'#3a352d', ink500:'#5c574e', ink400:'#7a7469',
  ink200:'#a29d93', ink100:'#edeae3',
  night900:'#08090b', night800:'#0c0d10', night700:'#16181d',
  olive600:'#4a6000', citron400:'#d8ff47', white:'#ffffff',
};
const themes = {
  light: {
    surface:P.paper100, surfaceRaised:P.paper50, surfaceSunken:P.paper200,
    ink:P.ink900, inkMuted:P.ink500, inkSubtle:P.ink400,
    accent:P.olive600, accentInk:P.white, focus:P.olive600,
    // --field-bg is paper-200; --field-border is ink-900 at 55% flattened
    // over it (fully opaque values, since ratio() takes solid hex only).
    fieldBg:P.paper200, fieldBorder:'#75716b',
  },
  dark: {
    surface:P.night800, surfaceRaised:P.night700, surfaceSunken:P.night900,
    ink:P.ink100, inkMuted:P.ink200, inkSubtle:'#6e6960',
    accent:P.citron400, accentInk:P.night800, focus:P.citron400,
    // --field-bg is night-900; --field-border is ink-100 at 45% flattened.
    fieldBg:P.night900, fieldBorder:'#6f6e6c',
  },
};
const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
const lum = hex => {
  const n = parseInt(hex.slice(1),16);
  return 0.2126*lin((n>>16)&255) + 0.7152*lin((n>>8)&255) + 0.0722*lin(n&255);
};
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

// [fg, bg, label, minimum required]
// Not checked here: --texture. It's a low-opacity decorative wash (the hero
// dot grid), never used for text or a state that must itself carry meaning.
const checks = t => [
  ['ink','surface','body text on surface',4.5],
  ['ink','surfaceRaised','body text on raised',4.5],
  ['ink','surfaceSunken','body text on sunken',4.5],
  ['inkMuted','surface','muted text on surface',4.5],
  ['inkMuted','surfaceRaised','muted text on raised',4.5],
  ['inkMuted','surfaceSunken','muted text on sunken',4.5],
  ['inkSubtle','surface','subtle (large/UI only)',3.0],
  ['accent','surface','accent text/link on surface',4.5],
  ['accent','surfaceRaised','accent on raised',4.5],
  ['accent','surfaceSunken','accent on sunken (status pills, covers)',4.5],
  ['accentInk','accent','text on accent fill',4.5],
  ['focus','surface','focus ring vs surface',3.0],
  ['focus','surfaceRaised','focus ring vs raised',3.0],
  ['focus','fieldBg','focus ring vs form field',3.0],
  ['fieldBorder','fieldBg','form field border vs field',3.0],
];

let fail = 0;
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n=== ${name.toUpperCase()} ===`);
  for (const [fg,bg,label,min] of checks(t)) {
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) fail++;
    console.log(`${ok?'PASS':'FAIL'}  ${r.toFixed(2).padStart(6)}:1  (min ${min})  ${label}`);
  }
}
console.log(fail === 0 ? '\nAll pairs meet WCAG AA in both themes.' : `\n${fail} FAILING PAIR(S)`);
process.exit(fail ? 1 : 0);
