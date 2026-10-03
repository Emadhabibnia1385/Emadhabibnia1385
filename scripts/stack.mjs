// One-off generator for assets/stack.svg (the toolbox rarely changes; edit GROUPS and re-run).
import { writeFile } from "node:fs/promises";

const GROUPS = [
  ["BACKEND", "#6C8CFF", ["Python", "FastAPI", "Flask", "pyTelegramBotAPI", "SQLite", "PostgreSQL"]],
  ["TELEGRAM", "#4FD1C5", ["Bot API", "Mini Apps", "Webhooks", "Inline UI", "Payments", "Premium emoji"]],
  ["FRONTEND", "#C4C6F8", ["React", "TypeScript", "TanStack", "Tailwind", "Bootstrap", "WordPress"]],
  ["INFRA", "#E9BB79", ["Linux", "systemd", "Nginx", "Docker", "Cloudflare", "Bash", "Ubuntu", "Backups"]],
  ["VPN &amp; NETWORK", "#F28B82", ["Xray", "3x-ui", "PasarGuard", "Marzban", "Reality", "SSH tunnels", "Hiddify", "WireGuard"]],
  ["AI &amp; TOOLING", "#8C8FD4", ["Claude Code", "Agent skills", "Go", "GitHub Actions", "Git", "MCP", "Codex"]],
];
const W = 1200, cols = 3, cw = 352, ch = 196, gx = 24, gy = 24, top = 84;
const H = top + 2 * ch + gy + 40;
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const textW = (s) => s.length * 8.1 + 26;

const cards = GROUPS.map(([name, color, items], i) => {
  const x = 48 + (i % cols) * (cw + gx), y = top + Math.floor(i / cols) * (ch + gy);
  let cx = 20, cy = 58;
  const chips = items.map((it) => {
    const w = textW(it);
    if (cx + w > cw - 20) { cx = 20; cy += 40; }
    const s = `<rect x="${cx}" y="${cy}" width="${w}" height="30" rx="9" fill="${color}" fill-opacity=".09" stroke="${color}" stroke-opacity=".35"/><text x="${cx + w / 2}" y="${cy + 20}" text-anchor="middle" font-size="13" font-weight="600" fill="#E6E6E7">${it}</text>`;
    cx += w + 8;
    return s;
  }).join("\n      ");
  return `<g transform="translate(${x} ${y})">
      <rect x=".5" y=".5" width="${cw - 1}" height="${ch - 1}" rx="16" fill="#12152C" stroke="#2A2F55"/>
      <circle cx="26" cy="31" r="5" fill="${color}"/>
      <text x="40" y="36" font-family="${MONO}" font-size="12" letter-spacing="2.2" fill="${color}">${name}</text>
      ${chips}
    </g>`;
}).join("\n    ");

await writeFile(new URL("../assets/stack.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif">
  <title id="t">Emad's toolbox</title>
  <desc id="d">${GROUPS.map(([n, , it]) => `${n}: ${it.join(", ")}`).join(". ")}.</desc>
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0F1226"/><stop offset="1" stop-color="#090B14"/></linearGradient></defs>
  <rect width="${W}" height="${H}" rx="24" fill="url(#bg)"/>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="23.5" fill="none" stroke="#202440"/>
  <text x="48" y="54" font-family="${MONO}" font-size="12" letter-spacing="2.4" fill="#8C8FD4">TOOLBOX</text>
  <text x="${W - 48}" y="54" font-family="${MONO}" font-size="12" text-anchor="end" fill="#777CAD">what the products are made of</text>
    ${cards}
</svg>
`);
console.log("ok stack.svg");
