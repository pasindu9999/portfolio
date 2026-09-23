/**
 * Generates the default Open Graph card at public/og/default.png.
 * Run with: npm run og
 *
 * Uses sharp (already present via Astro's image pipeline). Deliberately drawn
 * on the dark theme -- it reads better as a thumbnail against both light and
 * dark chat/social UIs than the paper theme does.
 */
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0c0d10"/>
  <rect x="0" y="0" width="1200" height="6" fill="#d8ff47"/>
  <text x="80" y="120" font-family="Helvetica, Arial, sans-serif" font-size="22"
        letter-spacing="6" fill="#6e6960">SOFTWARE ENGINEER — PORTFOLIO</text>
  <text x="76" y="290" font-family="Helvetica, Arial, sans-serif" font-size="140"
        font-weight="700" letter-spacing="-6" fill="#edeae3">UDARA</text>
  <text x="76" y="420" font-family="Helvetica, Arial, sans-serif" font-size="140"
        font-weight="700" letter-spacing="-6" fill="#edeae3">KURUKULA</text>
  <text x="76" y="550" font-family="Helvetica, Arial, sans-serif" font-size="140"
        font-weight="700" letter-spacing="-6" fill="#d8ff47">SOORIYA</text>
  <rect x="80" y="586" width="1040" height="1" fill="#2b2e35"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og/default.png');
console.log('public/og/default.png written');
