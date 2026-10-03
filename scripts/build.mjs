// Regenerates the data-driven SVGs in assets/ from live GitHub data.
// Runs daily from .github/workflows/refresh.yml; also works locally: `node scripts/build.mjs`.
// No dependencies — Node 20+ (global fetch).

import { writeFile, mkdir } from "node:fs/promises";

const USER = "Emadhabibnia1385";
const ORG = "nyxon-tech";
const OUT = new URL("../assets/", import.meta.url);

const FEATURED = [
  `${USER}/ConfigFlow`,
  `${USER}/KasbBook`,
  `${USER}/GymCore`,
  `${USER}/xui-backup-web`,
  `${USER}/ExpiryHub`,
  `${USER}/GorfeYar`,
  `${ORG}/claude-switcher`,
  `${USER}/xui_HUB`,
];

// NYXON palette (nyxon.tech)
const C = {
  bg: "#090B14", panel: "#0E1120", line: "#202440", indigo: "#636DB6",
  lav: "#C4C6F8", periwinkle: "#8C8FD4", muted: "#777CAD", steel: "#B9C6DE",
  text: "#F4F0E8", dim: "#8A8FB8", gold: "#E9BB79",
};
const LANG = { Python: "#6C8CFF", Go: "#4FD1C5", Shell: "#E9BB79", JavaScript: "#F7DF7C", PowerShell: "#8C8FD4", HTML: "#F28B82", Other: "#3B4673" };
const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

const headers = { "User-Agent": "profile-readme-builder", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function api(path) {
  const res = await fetch(`https://api.github.com/${path}`, { headers });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (n) => n.toLocaleString("en-US");

function card(w, h, body, { title, desc }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d" font-family="${SANS}">
  <title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0D1020"/><stop offset="1" stop-color="${C.bg}"/></linearGradient>
    <linearGradient id="brand" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.indigo}"/><stop offset="1" stop-color="${C.lav}"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="20" fill="url(#bg)"/>
  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="19.5" fill="none" stroke="${C.line}"/>
${body}
</svg>
`;
}

// ── Contributions (public calendar HTML, no token needed) ─────────────────
async function contributions() {
  const html = await (await fetch(`https://github.com/users/${USER}/contributions`, { headers: { "User-Agent": headers["User-Agent"] } })).text();
  const dates = {};
  for (const m of html.matchAll(/data-date="([\d-]+)" id="([^"]+)"/g)) dates[m[2]] = m[1];
  const days = [];
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)/g)) {
    const date = dates[m[1]];
    if (!date) continue;
    const n = /^(\d[\d,]*) contribution/.exec(m[2]);
    days.push({ date, count: n ? +n[1].replace(/,/g, "") : 0 });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function streaks(days) {
  let longest = 0, run = 0;
  for (const d of days) { run = d.count ? run + 1 : 0; longest = Math.max(longest, run); }
  let current = 0;
  const rev = [...days].reverse();
  if (rev[0] && !rev[0].count) rev.shift(); // today not counted yet
  for (const d of rev) { if (!d.count) break; current++; }
  return { current, longest };
}

function activitySvg(days) {
  const W = 1200, H = 340;
  const months = new Map();
  for (const d of days) months.set(d.date.slice(0, 7), (months.get(d.date.slice(0, 7)) ?? 0) + d.count);
  const series = [...months].slice(-12);
  const total = days.reduce((s, d) => s + d.count, 0);
  const active = days.filter((d) => d.count).length;
  const { current, longest } = streaks(days);
  const max = Math.max(1, ...series.map(([, v]) => v));
  const peak = series.reduce((a, b) => (b[1] > a[1] ? b : a), series[0]);
  const monthName = (k) => new Date(`${k}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", timeZone: "UTC" });

  const stats = [
    [fmt(total), "contributions", "last 12 months"],
    [`${active}`, "active days", `${Math.round((active / Math.max(1, days.length)) * 100)}% of the year`],
    [`${longest}d`, "longest streak", current ? `current: ${current}d` : "recharging"],
  ];
  const statsSvg = stats.map(([v, l, s], i) => `
  <g transform="translate(48 ${102 + i * 72})">
    <text font-size="30" font-weight="700" fill="${i === 0 ? C.gold : C.text}" letter-spacing="-.5">${esc(v)}</text>
    <text x="0" y="22" font-size="13" fill="${C.steel}">${esc(l)}<tspan fill="${C.dim}">  ·  ${esc(s)}</tspan></text>
  </g>`).join("");

  const x0 = 400, x1 = W - 48, top = 92, base = 280;
  const step = (x1 - x0) / series.length, bw = Math.min(40, step * 0.56);
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = base - (base - top) * f;
    return `<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="${C.line}" stroke-dasharray="2 6"/>
  <text x="${x0 - 12}" y="${y + 4}" font-size="11" text-anchor="end" fill="${C.dim}" font-family="${MONO}">${Math.round(max * f)}</text>`;
  }).join("\n  ");
  const bars = series.map(([k, v], i) => {
    const h = Math.max(v ? 4 : 2, ((base - top) * v) / max);
    const x = x0 + step * i + (step - bw) / 2;
    const isPeak = k === peak[0] && v > 0;
    const label = v ? `<text x="${x + bw / 2}" y="${base - h - 10}" font-size="12" text-anchor="middle" fill="${isPeak ? C.gold : C.steel}" font-weight="${isPeak ? 700 : 500}" font-family="${MONO}">${v}</text>` : "";
    return `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="${Math.min(8, bw / 2)}" fill="${isPeak ? C.gold : "url(#brand)"}" opacity="${v ? 1 : 0.35}"${isPeak ? ' class="pk"' : ""}/>
  ${label}
  <text x="${x + bw / 2}" y="${base + 24}" font-size="12" text-anchor="middle" fill="${C.dim}">${monthName(k)}</text>`;
  }).join("\n  ");

  const body = `
  <style>
    .pk { animation: pk 2.8s ease-in-out infinite; }
    @keyframes pk { 50% { opacity: .55; } }
    @media (prefers-reduced-motion: reduce) { .pk { animation: none; } }
  </style>
  <text x="48" y="54" font-size="12" letter-spacing="2.4" fill="${C.periwinkle}" font-family="${MONO}">SHIPPING CADENCE</text>
  <text x="${x0}" y="54" font-size="12" letter-spacing="2.4" fill="${C.dim}" font-family="${MONO}">CONTRIBUTIONS PER MONTH · PUBLIC</text>
  <text x="${x1}" y="54" font-size="12" text-anchor="end" fill="${C.dim}" font-family="${MONO}">updated ${new Date().toISOString().slice(0, 10)}</text>
  ${statsSvg}
  <line x1="352" x2="352" y1="92" y2="300" stroke="${C.line}"/>
  ${grid}
  <line x1="${x0}" x2="${x1}" y1="${base}" y2="${base}" stroke="${C.line}"/>
  ${bars}`;
  return card(W, H, body, {
    title: "Emad's GitHub activity",
    desc: `${total} public contributions in the last 12 months, ${active} active days, longest streak ${longest} days. Busiest month: ${peak?.[0]} with ${peak?.[1]}.`,
  });
}

// ── Languages (bytes across own + NYXON repos) ────────────────────────────
async function languages(repos) {
  const totals = {};
  for (const r of repos) {
    for (const [lang, bytes] of Object.entries(await api(`repos/${r.full_name}/languages`))) totals[lang] = (totals[lang] ?? 0) + bytes;
  }
  return totals;
}

function languagesSvg(totals, repoCount) {
  const W = 1200, H = 250;
  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  let rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const major = rows.filter(([, b]) => b / sum >= 0.01);
  const other = rows.filter(([, b]) => b / sum < 0.01).reduce((s, [, b]) => s + b, 0);
  rows = other ? [...major, ["Other", other]] : major;

  const x0 = 48, x1 = W - 48, y = 104, bh = 22;
  let x = x0;
  const segs = rows.map(([lang, b], i) => {
    const w = ((x1 - x0) * b) / sum;
    const s = `<rect x="${x}" y="${y}" width="${Math.max(w - 3, 2)}" height="${bh}" rx="6" fill="${LANG[lang] ?? LANG.Other}"/>`;
    x += w;
    return s;
  }).join("\n  ");
  const colW = (x1 - x0) / Math.min(rows.length, 6);
  const legend = rows.map(([lang, b], i) => `
  <g transform="translate(${x0 + colW * (i % 6)} ${172 + Math.floor(i / 6) * 40})">
    <circle cx="6" cy="-5" r="6" fill="${LANG[lang] ?? LANG.Other}"/>
    <text x="20" y="0" font-size="15" font-weight="600" fill="${C.text}">${esc(lang)}</text>
    <text x="20" y="20" font-size="12" fill="${C.dim}" font-family="${MONO}">${((b / sum) * 100).toFixed(1)}%</text>
  </g>`).join("");

  const body = `
  <text x="48" y="54" font-size="12" letter-spacing="2.4" fill="${C.periwinkle}" font-family="${MONO}">CODE BY LANGUAGE</text>
  <text x="${x1}" y="54" font-size="12" text-anchor="end" fill="${C.dim}" font-family="${MONO}">${repoCount} public repos · ${(sum / 1e6).toFixed(1)} MB of source</text>
  <rect x="${x0}" y="${y}" width="${x1 - x0}" height="${bh}" rx="6" fill="${C.line}"/>
  ${segs}
  ${legend}`;
  return card(W, H, body, {
    title: "Languages across Emad's repositories",
    desc: rows.map(([l, b]) => `${l} ${((b / sum) * 100).toFixed(1)}%`).join(", "),
  });
}

// ── Project cards ─────────────────────────────────────────────────────────
function wrap(text, maxChars, maxLines) {
  const words = String(text ?? "").replace(/\*\*/g, "").split(/\s+/);
  const lines = [""];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + " " + w).trim().length <= maxChars) lines[lines.length - 1] = (cur + " " + w).trim();
    else if (lines.length < maxLines) lines.push(w);
    else { lines[lines.length - 1] = cur.replace(/[\s,.;:|—-]*$/, "") + "…"; break; }
  }
  return lines;
}

function projectSvg(r, lang) {
  const W = 600, H = 220;
  const owner = r.owner.login === ORG ? "NYXON" : "personal";
  const desc = wrap(r.description || "Work in progress.", 50, 3)
    .map((l, i) => `<text x="32" y="${96 + i * 27}" font-size="18" fill="${C.steel}">${esc(l)}</text>`).join("\n  ");
  const star = `<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>`;
  const fork = `<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>`;
  const body = `
  <rect x="32" y="20" width="36" height="4" rx="2" fill="${owner === "NYXON" ? C.gold : C.indigo}"/>
  <text x="32" y="58" font-size="27" font-weight="700" fill="${C.text}" letter-spacing="-.3">${esc(r.name)}</text>
  <text x="${W - 32}" y="56" font-size="13" letter-spacing="2" text-anchor="end" fill="${owner === "NYXON" ? C.gold : C.periwinkle}" font-family="${MONO}">${owner.toUpperCase()}</text>
  ${desc}
  <g transform="translate(32 ${H - 26}) scale(1.25)" font-size="13" fill="${C.dim}">
    <circle cx="6" cy="-4.5" r="6" fill="${LANG[lang] ?? LANG.Other}"/>
    <text x="18" y="0">${esc(lang ?? "—")}</text>
    <g transform="translate(120 -15)" fill="${C.dim}">${star}</g><text x="142" y="0">${fmt(r.stargazers_count)}</text>
    <g transform="translate(196 -15)" fill="${C.dim}">${fork}</g><text x="218" y="0">${fmt(r.forks_count)}</text>
  </g>`;
  return card(W, H, body, { title: r.name, desc: `${r.description ?? ""} — ${r.stargazers_count} stars, ${r.forks_count} forks.` });
}

// ── main ──────────────────────────────────────────────────────────────────
await mkdir(new URL("projects/", OUT), { recursive: true });

const own = (await api(`users/${USER}/repos?per_page=100`)).filter((r) => !r.fork && r.name !== USER);
const org = (await api(`orgs/${ORG}/repos?per_page=100`)).filter((r) => !r.fork);
const all = [...own, ...org];

const totals = await languages(all);
await writeFile(new URL("languages.svg", OUT), languagesSvg(totals, all.length));

const days = await contributions();
if (days.length > 300) await writeFile(new URL("activity.svg", OUT), activitySvg(days));
else console.warn(`contribution calendar looked wrong (${days.length} days) — keeping old activity.svg`);

for (const full of FEATURED) {
  const r = all.find((x) => x.full_name === full) ?? (await api(`repos/${full}`));
  await writeFile(new URL(`projects/${r.name}.svg`, OUT), projectSvg(r, r.language));
}
console.log(`ok: ${all.length} repos, ${days.length} days, ${FEATURED.length} cards`);
