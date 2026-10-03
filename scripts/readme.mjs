// Writes README.md (English, shown on the profile) and its translations from one template.
// Edit the text in LANGS, then run `node scripts/readme.mjs`.

import { writeFile } from "node:fs/promises";

const REPO = "https://github.com/Emadhabibnia1385/Emadhabibnia1385/blob/main";
const PROFILE = "https://github.com/Emadhabibnia1385";
const PARSA = "https://github.com/Parsa5436";
const SAEED = "https://github.com/qqsaeedpp";
const SEAMLESS = "https://seamless.nyxon.tech/";

const LANGS = {
  en: {
    label: "English", file: "README.md", url: PROFILE, nyxon: "https://nyxon.tech/en",
    hello: "Hi, I'm Emad 👋",
    about: (n) => `I believe a good product is built from more than code — it brings together **ideas, people, design and infrastructure**. That belief became **[NYXON](${n})**, a software studio at the Mashhad Innovation Factory that I founded with [Parsa Amirabadi](${PARSA}) and [Mohammad Saeed Babaei](${SAEED}). We build web products, AI experiences and automation — *systems that work while you sleep.*`,
    now: `I build Telegram bots and Mini Apps, tools for small businesses, automation, and the Linux servers that keep it all running. My main product these days is **[Seamless](${SEAMLESS})**, a commerce platform on Telegram.`,
    work: "Selected work", all: "Browse all repositories →", tools: "Toolbox", numbers: "By the numbers", contact: "Reach me",
    footer: "Think · Build · Ship — systems that work while you sleep.",
  },
  fa: {
    label: "فارسی", file: "README.fa.md", rtl: true, nyxon: "https://nyxon.tech/fa",
    hello: "سلام، عماد هستم 👋",
    about: (n) => `به نظرم محصول خوب فقط از کد ساخته نمی‌شود؛ **ایده، آدم‌ها، طراحی و زیرساخت** کنار هم آن را می‌سازند. **[نیکسون](${n})** از همین نگاه شکل گرفت: استودیوی نرم‌افزاری در کارخانهٔ نوآوری مشهد که با [پارسا امیرآبادی](${PARSA}) و [محمدسعید بابایی](${SAEED}) بنیانش گذاشتیم. محصولات وب، تجربه‌های هوش مصنوعی و اتوماسیون می‌سازیم — *سیستم‌هایی که وقتی خوابید هم کار می‌کنند.*`,
    now: `ربات و مینی‌اپ تلگرام، ابزار برای کسب‌وکارهای کوچک، اتوماسیون و سرورهای لینوکسی‌ای را می‌سازم که همه‌چیز را سرپا نگه می‌دارند. محصول اصلی‌ام این روزها **[Seamless](${SEAMLESS})** است؛ یک پلتفرم فروش در تلگرام.`,
    work: "پروژه‌های منتخب", all: "← همهٔ ریپازیتوری‌ها", tools: "جعبه‌ابزار", numbers: "در یک نگاه", contact: "راه‌های ارتباط",
    footer: "فکر · ساخت · عرضه — سیستم‌هایی که وقتی خوابید هم کار می‌کنند.",
  },
  ru: {
    label: "Русский", file: "README.ru.md", nyxon: "https://nyxon.tech/en",
    hello: "Привет, я Эмад 👋",
    about: (n) => `Я считаю, что хороший продукт — это не только код: в нём сходятся **идеи, люди, дизайн и инфраструктура**. Из этой мысли выросла **[NYXON](${n})** — студия разработки в Mashhad Innovation Factory, которую я основал вместе с [Парсой Амирабади](${PARSA}) и [Мохаммадом Саидом Бабаи](${SAEED}). Мы делаем веб-продукты, AI-решения и автоматизацию — *системы, которые работают, пока вы спите.*`,
    now: `Я создаю Telegram-ботов и Mini Apps, инструменты для малого бизнеса, автоматизацию и Linux-серверы, на которых всё это держится. Мой основной продукт сейчас — **[Seamless](${SEAMLESS})**, платформа для продаж в Telegram.`,
    work: "Избранные проекты", all: "Все репозитории →", tools: "Инструменты", numbers: "В цифрах", contact: "Связаться",
    footer: "Думать · Строить · Запускать — системы, которые работают, пока вы спите.",
  },
  ar: {
    label: "العربية", file: "README.ar.md", rtl: true, nyxon: "https://nyxon.tech/ar",
    hello: "مرحبًا، أنا عماد 👋",
    about: (n) => `أؤمن أن المنتج الجيد لا يُبنى بالكود وحده؛ بل يجمع **الأفكار والناس والتصميم والبنية التحتية**. من هذه الرؤية وُلدت **[NYXON](${n})**، استوديو برمجيات في مصنع الابتكار في مشهد، أسّسته مع [بارسا أميرآبادي](${PARSA}) و[محمد سعيد بابائي](${SAEED}). نبني منتجات ويب وتجارب ذكاء اصطناعي وأتمتة — *أنظمة تعمل بينما أنت نائم.*`,
    now: `أبني بوتات تيليجرام وتطبيقاتها المصغّرة (Mini Apps)، وأدوات للأعمال الصغيرة، وأنظمة أتمتة، وخوادم لينكس تُبقي كل ذلك يعمل. منتجي الرئيسي حاليًا هو **[Seamless](${SEAMLESS})**، منصة للبيع عبر تيليجرام.`,
    work: "أعمال مختارة", all: "← جميع المستودعات", tools: "الأدوات", numbers: "بالأرقام", contact: "تواصل معي",
    footer: "فكّر · ابنِ · أطلق — أنظمة تعمل بينما أنت نائم.",
  },
  zh: {
    label: "中文", file: "README.zh.md", nyxon: "https://nyxon.tech/en",
    hello: "你好，我是 Emad 👋",
    about: (n) => `我相信好的产品不只是代码——它汇聚了**想法、人、设计与基础设施**。正是这个理念催生了 **[NYXON](${n})**：我与 [Parsa Amirabadi](${PARSA}) 和 [Mohammad Saeed Babaei](${SAEED}) 在马什哈德创新工场共同创立的软件工作室。我们打造 Web 产品、AI 体验和自动化系统——*在你睡觉时也在运转的系统。*`,
    now: `我开发 Telegram 机器人与 Mini App、面向小企业的工具、自动化流程，以及支撑这一切的 Linux 服务器。目前我的主要产品是 **[Seamless](${SEAMLESS})**——一个基于 Telegram 的电商平台。`,
    work: "精选项目", all: "查看全部仓库 →", tools: "技术栈", numbers: "数据一览", contact: "联系我",
    footer: "思考 · 构建 · 发布——在你睡觉时也在运转的系统。",
  },
};

const PROJECTS = [
  ["Emadhabibnia1385", "KasbBook"], ["Emadhabibnia1385", "GymCore"],
  ["Emadhabibnia1385", "ExpiryHub"], ["Emadhabibnia1385", "GorfeYar"],
  ["nyxon-tech", "claude-switcher"], ["nyxon-tech", "poolak-sdk"],
  ["Emadhabibnia1385", "ConfigFlow"], ["Emadhabibnia1385", "xui-backup-web"],
];

const badge = (label, msg, color, logo) =>
  `https://img.shields.io/badge/${encodeURIComponent(label.replace(/-/g, "--").replace(/_/g, "__"))}-${encodeURIComponent(msg.replace(/-/g, "--").replace(/_/g, "__"))}-${color}?style=for-the-badge${logo ? `&logo=${logo}&logoColor=white` : ""}&labelColor=090B14`;

function switcher(cur) {
  return Object.entries(LANGS)
    .map(([code, l]) => (code === cur ? `<b>${l.label}</b>` : `<a href="${l.url ?? `${REPO}/${l.file}`}">${l.label}</a>`))
    .join(" · ");
}

function render(code) {
  const t = LANGS[code];
  const cards = PROJECTS.map(([o, n]) => `<td width="50%"><a href="https://github.com/${o}/${n}"><img src="./assets/projects/${n}.svg" width="100%" alt="${n}"></a></td>`);
  const rows = [];
  for (let i = 0; i < cards.length; i += 2) rows.push(`  <tr>\n    ${cards[i]}\n    ${cards[i + 1]}\n  </tr>`);
  // <b>/<i> instead of **/* — CommonMark won't close emphasis next to CJK punctuation.
  const html = (s) => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
  const text = (s) => html(t.rtl ? `<div dir="rtl">\n\n${s}\n\n</div>` : s);

  return `<!-- Generated by scripts/readme.mjs — edit the text there, not here. -->

<p align="center">
  <a href="https://nyxon.tech/en/people/emad-habibnia"><img src="./assets/hero.svg" width="100%" alt="Emad Habibnia — software product builder and founder of NYXON. From an idea to a team."></a>
</p>

<p align="center">🌐 ${switcher(code)}</p>

<p align="center">
  <a href="${t.nyxon}"><img alt="NYXON" src="${badge("NYXON", "founder", "E9BB79")}"></a>
  <a href="https://nyxon.tech/en/people/emad-habibnia"><img alt="nyxon.tech" src="${badge("résumé", "nyxon.tech", "C4C6F8")}"></a>
  <a href="https://github.com/nyxon-tech"><img alt="nyxon-tech" src="${badge("org", "nyxon-tech", "8C8FD4", "github")}"></a>${code === "en" ? `
  <img alt="Profile views" src="https://komarev.com/ghpvc/?username=Emadhabibnia1385&label=views&color=636DB6&style=for-the-badge&labelColor=090B14">` : ""}
</p>

${text(`### ${t.hello}

${t.about(t.nyxon)}

${t.now}`)}

<br>

${text(`## ◆ ${t.work}`)}

<table>
${rows.join("\n")}
</table>

<p align="center"><sub><a href="${PROFILE}?tab=repositories">${t.all}</a></sub></p>

<br>

${text(`## ◆ ${t.tools}`)}

<p align="center">
  <img src="./assets/stack.svg" width="100%" alt="Toolbox: backend, Telegram, frontend, infra, network, AI and tooling.">
</p>
<p align="center">
  <img src="https://skillicons.dev/icons?i=py,fastapi,flask,sqlite,postgres,react,ts,tailwind,go,linux,ubuntu,bash,nginx,docker,cloudflare,githubactions&theme=dark&perline=16" alt="Tech icons">
</p>

<br>

${text(`## ◆ ${t.numbers}`)}

<p align="center">
  <img src="./assets/activity.svg" width="100%" alt="Contribution activity over the last 12 months">
</p>
<p align="center">
  <img src="./assets/languages.svg" width="100%" alt="Code by language across my public repositories">
</p>
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Emadhabibnia1385/Emadhabibnia1385/output/snake-dark.svg">
    <img alt="Contribution snake" src="https://raw.githubusercontent.com/Emadhabibnia1385/Emadhabibnia1385/output/snake.svg" width="100%">
  </picture>
</p>

<br>

${text(`## ◆ ${t.contact}`)}

<p align="center">
  <a href="https://t.me/Emad_Habibnia"><img alt="Telegram" src="${badge("Telegram", "@Emad_Habibnia", "2CA5E0", "telegram")}"></a>
  <a href="mailto:emad.habibnia1385@gmail.com"><img alt="Email" src="${badge("Email", "say hello", "E9BB79", "gmail")}"></a>
  <a href="https://x.com/KINGEMAD1385"><img alt="X" src="${badge("X", "@KINGEMAD1385", "F4F0E8", "x")}"></a>
  <a href="https://instagram.com/Emad_habibnia"><img alt="Instagram" src="${badge("Instagram", "@Emad_habibnia", "E1306C", "instagram")}"></a>
  <a href="https://discord.gg/z9K2BrsZNS"><img alt="Discord" src="${badge("Discord", "emadhabibnia", "5865F2", "discord")}"></a>
</p>

<p align="center"><sub><code>☾</code> ${t.footer}</sub></p>
`;
}

for (const [code, l] of Object.entries(LANGS)) {
  await writeFile(new URL(`../${l.file}`, import.meta.url), render(code));
}
console.log(`ok: ${Object.values(LANGS).map((l) => l.file).join(", ")}`);
