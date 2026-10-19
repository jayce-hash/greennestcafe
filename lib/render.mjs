import { esc, inline, format } from "./markup.mjs";

const SITE_URL = (process.env.URL || "https://greennestcafe.netlify.app").replace(/\/$/, "");
const ASSET_V = "1";

const safeUrl = (u) => (/^https?:\/\//i.test(String(u || "").trim()) ? String(u).trim() : "");
const digits = (p) => String(p || "").replace(/[^\d+]/g, "");
const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---------- hours ----------
const DAY_ABBR = { Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th", Friday: "Fr", Saturday: "Sa", Sunday: "Su" };
function fmtTime(t) {
  const m = String(t || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return "";
  let h = +m[1];
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return m[2] === "00" ? `${h} ${ap}` : `${h}:${m[2]} ${ap}`;
}
const hoursText = (d) => (d.closed ? "Closed" : `${fmtTime(d.open)} – ${fmtTime(d.close)}`);

// ---------- drink illustrations ----------
// Each signature drink gets a glass whose layers come from words in its name.
// [pattern, color, layer]: syrups/fruit sit at the bottom, milk in the middle, tea/coffee on top.
const INGREDIENTS = [
  [/strawberr/i, "#e7899a", 0],
  [/mango/i, "#f1b545", 0],
  [/lavender/i, "#b9a3d8", 0],
  [/honey/i, "#e3b55b", 0],
  [/lemon|citron|yuzu/i, "#ead96f", 0],
  [/ginger/i, "#d8a548", 0],
  [/caramel|toffee/i, "#c98a4b", 0],
  [/tonic/i, "#e9eee0", 1],
  [/coconut/i, "#f3eee2", 1],
  [/ube|taro/i, "#8d6bb3", 2],
  [/chai/i, "#c79a6c", 2],
  [/earl grey|black tea/i, "#b08a5b", 2],
  [/hojicha/i, "#9a6743", 2],
  [/espresso|cold brew|coffee|mocha|americano|dalgona/i, "#4d3427", 2],
  [/matcha/i, "#8eae58", 3],
];
const MILK = "#f4eee2";
function drinkLayers(name, desc) {
  const text = `${name || ""} ${desc || ""}`;
  const found = INGREDIENTS.filter(([re]) => re.test(text)).map(([, color, layer]) => ({ color, layer }));
  const milky = /latte|milk|cloud|cream|frappe/i.test(text);
  if (milky && !found.some((f) => f.layer === 1)) found.push({ color: MILK, layer: 1 });
  if (!found.length) found.push({ color: "#4d3427", layer: 2 });
  found.sort((a, b) => a.layer - b.layer);
  const layers = found.map((f) => f.color);
  if (/cold foam|cloud|whipped/i.test(text)) layers.push("#f7f2e6");
  if (layers.length === 1) layers.push(layers[0]);
  return layers;
}
function glassSvg(name, desc, i, iced) {
  const layers = drinkLayers(name, desc);
  const id = `g${i}`;
  const n = layers.length;
  const stops = layers
    .map((c, k) => {
      const a = (k / n) * 100;
      const b = ((k + 1) / n) * 100;
      return `<stop offset="${(100 - b).toFixed(1)}%" stop-color="${c}"/><stop offset="${(100 - a).toFixed(1)}%" stop-color="${c}"/>`;
    })
    .reverse()
    .join("");
  const ice = iced
    ? `<g fill="#fff" fill-opacity=".38" stroke="#fff" stroke-opacity=".55"><rect x="22" y="40" width="20" height="18" rx="4" transform="rotate(-12 32 49)"/><rect x="46" y="52" width="19" height="17" rx="4" transform="rotate(10 55 60)"/><rect x="28" y="70" width="18" height="16" rx="4" transform="rotate(6 37 78)"/></g>`
    : "";
  return `<svg class="glass" viewBox="0 0 90 130" aria-hidden="true" focusable="false">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>
    <clipPath id="${id}c"><path d="M14 26 L76 26 L70 118 Q69 124 63 124 L27 124 Q21 124 20 118 Z"/></clipPath></defs>
    <g clip-path="url(#${id}c)"><rect x="0" y="30" width="90" height="100" fill="url(#${id})"/>${ice}</g>
    <path d="M10 18 L80 18 L72 119 Q71 127 63 127 L27 127 Q19 127 18 119 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M60 4 L52 40" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;
}

// ---------- sections ----------
function signature(c) {
  const drinks = [];
  for (const tab of c.menu.tabs) for (const cat of tab.categories) for (const it of cat.items) if (it.featured && it.name) drinks.push(it);
  if (!drinks.length) return "";
  return `
  <section class="sig" aria-labelledby="sig-title">
    <div class="wrap">
      <div class="sig-head">
        <h2 id="sig-title">${inline(c.signature.heading)}</h2>
        ${c.signature.intro ? `<p>${inline(c.signature.intro)}</p>` : ""}
      </div>
    </div>
    <ul class="sig-row" role="list">
      ${drinks
        .map(
          (d, i) => `<li class="sig-item">
          ${glassSvg(d.name, d.desc, i, /iced/i.test(d.tag))}
          <h3>${inline(d.name)}</h3>
          ${d.desc ? `<p class="sig-desc">${inline(d.desc)}</p>` : ""}
          ${d.price ? `<p class="sig-price">${esc(d.price.split("/")[0].trim())}${d.price.includes("/") ? "+" : ""}</p>` : ""}
        </li>`
        )
        .join("")}
    </ul>
  </section>`;
}

function menu(c) {
  const tabs = c.menu.tabs.filter((t) => t.name && t.categories.some((cat) => cat.items.length));
  if (!tabs.length) return "";
  return `
  <section id="menu" class="menu" aria-labelledby="menu-title">
    <div class="wrap">
      <div class="menu-head">
        <h2 id="menu-title">${inline(c.menu.heading)}</h2>
        <div class="menu-tabs" role="tablist" aria-label="Menu sections">
          ${tabs
            .map(
              (t, i) =>
                `<button role="tab" id="mt-${i}" aria-controls="mp-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t.name)}</button>`
            )
            .join("")}
        </div>
      </div>
      ${tabs
        .map(
          (t, i) => `
        <div class="menu-panel" role="tabpanel" id="mp-${i}" aria-labelledby="mt-${i}"${i === 0 ? "" : " hidden"}>
          ${t.categories
            .filter((cat) => cat.items.length)
            .map(
              (cat) => `
            <div class="cat">
              <h3>${inline(cat.name)}${cat.note ? ` <span class="cat-note">${inline(cat.note)}</span>` : ""}</h3>
              <ul role="list">
                ${cat.items
                  .filter((it) => it.name)
                  .map(
                    (it) => `<li class="dish">
                  <p class="dish-line"><span class="dish-name">${inline(it.name)}${it.tag ? ` <span class="tag tag-${slug(it.tag)}">${esc(it.tag)}</span>` : ""}</span><span class="dots" aria-hidden="true"></span><span class="dish-price">${esc(it.price)}</span></p>
                  ${it.desc ? `<p class="dish-desc">${inline(it.desc)}</p>` : ""}
                </li>`
                  )
                  .join("")}
              </ul>
            </div>`
            )
            .join("")}
        </div>`
        )
        .join("")}
      ${c.menu.note ? `<p class="menu-note">${inline(c.menu.note)}</p>` : ""}
    </div>
  </section>`;
}

function photos(c, list) {
  const visible = list.filter((p) => !p.hidden && p.src);
  if (!visible.length) return { story: "", gallery: "" };
  const altFor = (p) => p.alt || (p.category ? `${p.category} at ${c.business.name}` : `Photo from ${c.business.name}`);
  const first = visible[0];
  const story = `<figure class="story-photo"><img src="${esc(first.src)}" alt="${esc(altFor(first))}" loading="lazy" decoding="async"></figure>`;
  const rest = visible.length > 1 ? visible : [];
  if (!rest.length) return { story, gallery: "" };
  const used = new Set(rest.map((p) => p.category).filter(Boolean));
  const cats = c.gallery.categories.filter((x) => used.has(x));
  for (const u of used) if (!cats.includes(u)) cats.push(u);
  const chips =
    cats.length > 1
      ? `<div class="chips" role="group" aria-label="Filter photos"><button type="button" class="chip" aria-pressed="true" data-filter="all">All</button>${cats
          .map((x) => `<button type="button" class="chip" aria-pressed="false" data-filter="${esc(slug(x))}">${esc(x)}</button>`)
          .join("")}</div>`
      : "";
  const gallery = `
  <section id="photos" class="photos" aria-labelledby="photos-title">
    <div class="wrap">
      <div class="photos-head">
        <h2 id="photos-title">${inline(c.gallery.heading)}</h2>
        ${c.gallery.intro ? `<p>${inline(c.gallery.intro)}</p>` : ""}
      </div>
      ${chips}
      <ul class="grid" data-page="12" role="list">
        ${rest
          .map(
            (p, i) => `<li class="tile" data-cat="${esc(slug(p.category))}"><button type="button" class="tile-btn" data-full="${esc(p.src)}" aria-label="View larger: ${esc(altFor(p))}"><img src="${esc(p.thumb || p.src)}" alt="${esc(altFor(p))}" loading="${i < 4 ? "eager" : "lazy"}" decoding="async"${p.w && p.h ? ` width="${p.w}" height="${p.h}"` : ""}></button></li>`
          )
          .join("")}
      </ul>
      <div class="more-wrap"><button type="button" class="btn line more" hidden>Show more photos</button></div>
    </div>
  </section>`;
  return { story, gallery };
}

function reviews(c) {
  const r = c.reviews;
  const items = r.items.filter((x) => x && x.text);
  const url = safeUrl(r.reviewsUrl);
  if (!items.length && !r.rating) return "";
  return `
  <section id="reviews" class="reviews" aria-labelledby="reviews-title">
    <div class="wrap reviews-wrap">
      <div class="reviews-side">
        <h2 id="reviews-title">${inline(r.heading)}</h2>
        ${
          r.rating
            ? `<p class="rating"><span class="rating-num">${esc(r.rating)}</span><span class="rating-meta"><span class="stars" aria-hidden="true">★★★★★</span><span>${esc(r.rating)} stars ${esc(r.ratingSource)}</span></span></p>`
            : ""
        }
        ${url ? `<a class="text-link" href="${esc(url)}" target="_blank" rel="noopener">Read reviews on Google</a>` : ""}
      </div>
      ${
        items.length
          ? `<div class="quotes">${items
              .map((q) => `<figure class="quote"><blockquote><p>${inline(q.text)}</p></blockquote>${q.name ? `<figcaption>${esc(q.name)}</figcaption>` : ""}</figure>`)
              .join("")}</div>`
          : ""
      }
    </div>
  </section>`;
}

export function renderPage(c, photoList) {
  const b = c.business;
  const phone = digits(b.phone);
  const year = new Date().getFullYear();
  const address = [b.street, [b.city, [b.state, b.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(`${b.name}, ${address}`);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const appleMaps = `https://maps.apple.com/?daddr=${encodeURIComponent(address)}&q=${encodeURIComponent(b.name)}`;
  const title = `${b.name} | Coffee, Matcha & Rice Bowls in ${b.city}, ${b.state}`;
  const desc = b.intro;
  const ig = safeUrl(b.instagram);
  const fb = safeUrl(b.facebook);
  const order = safeUrl(b.orderUrl);
  const { story: storyPhoto, gallery } = photos(c, photoList);
  const hasReviews = c.reviews.rating || c.reviews.items.some((x) => x && x.text);
  const hoursJson = JSON.stringify(c.hours.map((d) => ({ d: d.day, o: d.open, c: d.close, x: !!d.closed }))).replace(/</g, "\\u003c");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: b.name,
    url: SITE_URL + "/",
    image: SITE_URL + "/img/social-preview.jpg",
    telephone: b.phone || undefined,
    email: b.email || undefined,
    address: { "@type": "PostalAddress", streetAddress: b.street, addressLocality: b.city, addressRegion: b.state, postalCode: b.zip, addressCountry: "US" },
    openingHoursSpecification: c.hours
      .filter((d) => !d.closed && d.open && d.close)
      .map((d) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${d.day}`, opens: d.open, closes: d.close })),
    servesCuisine: ["Coffee", "Tea", "Breakfast", "Sandwiches", "Korean"],
    hasMenu: SITE_URL + "/#menu",
    sameAs: [ig, fb].filter(Boolean),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE_URL}/">
<meta name="theme-color" content="#5f6e43">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}/">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE_URL}/img/social-preview.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/favicon.png">
<link rel="apple-touch-icon" href="/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=${ASSET_V}">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${c.announcement.show && c.announcement.text ? `<div class="announce" role="note">${inline(c.announcement.text)}</div>` : ""}
<header class="nav">
  <a href="#top" class="nav-brand"><img src="/img/logo-light.webp" alt="" width="905" height="1100"><span>${esc(b.name)}</span></a>
  <nav class="nav-links" id="nav-links" aria-label="Main">
    <a href="#menu">Menu</a>
    <a href="#story">Our story</a>
    ${gallery ? `<a href="#photos">Photos</a>` : ""}
    ${hasReviews ? `<a href="#reviews">Reviews</a>` : ""}
    <a href="#visit" class="nav-visit">Visit</a>
  </nav>
  <button class="hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span></button>
</header>

<main id="main">
  <div id="top" class="hero">
    <div class="hero-text">
      <h1>${esc(b.name)}</h1>
      <p class="hero-tagline">${inline(b.tagline)}</p>
      <p class="hero-intro">${inline(b.intro)}</p>
      <p class="status" data-hours='${hoursJson}' hidden><span class="status-dot" aria-hidden="true"></span><span class="status-text"></span></p>
      <div class="hero-ctas">
        <a class="btn solid" href="#menu">See the menu</a>
        ${order ? `<a class="btn line" href="${esc(order)}" target="_blank" rel="noopener">Order ahead</a>` : `<a class="btn line" href="${esc(directions)}" target="_blank" rel="noopener">Get directions</a>`}
      </div>
    </div>
    <img class="hero-mark" src="/img/logo-light.webp" alt="" width="905" height="1100">
  </div>

  ${signature(c)}
  ${menu(c)}

  <section id="story" class="story" aria-labelledby="story-title">
    <div class="wrap story-wrap${storyPhoto ? " has-photo" : ""}">
      ${storyPhoto || `<div class="story-mark"><img src="/img/logo-dark.webp" alt="" width="905" height="1100" loading="lazy"></div>`}
      <div class="story-text">
        <h2 id="story-title">${inline(c.story.heading)}</h2>
        ${format(c.story.body)}
        ${c.story.facts.length ? `<ul class="facts" role="list">${c.story.facts.filter(Boolean).map((f) => `<li>${inline(f)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>
  </section>

  ${gallery}
  ${reviews(c)}

  <section id="visit" class="visit" aria-labelledby="visit-title">
    <div class="wrap visit-wrap">
      <div class="visit-info">
        <h2 id="visit-title">Visit us</h2>
        <address>
          <a class="addr" href="${esc(directions)}" target="_blank" rel="noopener">${esc(b.street)}<br>${esc(b.city)}, ${esc(b.state)} ${esc(b.zip)}</a>
        </address>
        <div class="visit-links">
          <a class="btn solid" href="${esc(directions)}" target="_blank" rel="noopener">Google Maps</a>
          <a class="btn line" href="${esc(appleMaps)}" target="_blank" rel="noopener">Apple Maps</a>
        </div>
        <dl class="contact">
          ${phone ? `<div><dt>Phone</dt><dd><a href="tel:${esc(phone)}">${esc(b.phone)}</a></dd></div>` : ""}
          ${b.email ? `<div><dt>Email</dt><dd><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></dd></div>` : ""}
          ${ig ? `<div><dt>Instagram</dt><dd><a href="${esc(ig)}" target="_blank" rel="noopener">@${esc((ig.match(/instagram\.com\/([A-Za-z0-9._]+)/i) || [])[1] || "instagram")}</a></dd></div>` : ""}
        </dl>
        ${c.services.length ? `<ul class="services" role="list">${c.services.filter(Boolean).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
      </div>
      <div class="visit-hours">
        <h3>Hours</h3>
        <table class="hours">
          <tbody>
            ${c.hours.map((d) => `<tr data-day="${esc(d.day)}"><th scope="row">${esc(d.day)}</th><td>${esc(hoursText(d))}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="visit-map">
        <iframe title="Map showing ${esc(b.name)}" src="https://www.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="wrap footer-wrap">
    <img src="/img/logo-light.webp" alt="${esc(b.name)}" class="footer-mark" width="905" height="1100" loading="lazy">
    <div class="footer-cols">
      <p>${esc(b.street)}<br>${esc(b.city)}, ${esc(b.state)} ${esc(b.zip)}</p>
      <p>${phone ? `<a href="tel:${esc(phone)}">${esc(b.phone)}</a><br>` : ""}${ig ? `<a href="${esc(ig)}" target="_blank" rel="noopener">Instagram</a>` : ""}${ig && fb ? " and " : ""}${fb ? `<a href="${esc(fb)}" target="_blank" rel="noopener">Facebook</a>` : ""}</p>
    </div>
  </div>
  <div class="wrap footer-base">
    <p>© ${year} ${esc(b.name)}</p>
    <p>Website by <a href="https://jwdigital.ink" target="_blank" rel="noopener">JW Digital</a></p>
  </div>
</footer>

<dialog class="lightbox" aria-label="Photo viewer">
  <button type="button" class="lb-close" aria-label="Close">×</button>
  <button type="button" class="lb-prev" aria-label="Previous photo">‹</button>
  <figure><img alt=""><figcaption></figcaption></figure>
  <button type="button" class="lb-next" aria-label="Next photo">›</button>
</dialog>
<script src="/assets/site.js?v=${ASSET_V}" defer></script>
</body>
</html>`;
}
