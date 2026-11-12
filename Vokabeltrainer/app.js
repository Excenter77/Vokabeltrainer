"use strict";

const STORE_PROFILES = "vt_profiles";
const STORE_LISTS = "vt_lists";
const SESSION_SIZE = 10;
const MAX_BOX = 5;      // Lernkartei: Fach 1..5, richtig -> eins hoch, falsch -> Fach 1
const LEARNED_BOX = 3;  // ab diesem Fach gilt ein Wort als "gelernt"
const KLASSEN = [4, 5, 6, 7, 8, 9, 10];
const MODES = { type: "Eintippen", choice: "Auswählen", card: "Karteikarte" };
const PRAISE = ["Richtig!", "Super!", "Klasse!", "Genau!", "Toll!", "Stark!"];

const app = document.getElementById("app");

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

let profiles = load(STORE_PROFILES, []);   // [{id, name, klasse, stars, dir, mode, progress: {key: {box, seen}}}]
let customLists = load(STORE_LISTS, []);   // eigene Listen, gelten fuer alle Kinder auf dem Geraet
const saveProfiles = () => save(STORE_PROFILES, profiles);
const saveLists = () => save(STORE_LISTS, customLists);

let profile = null;      // aktives Kind
let currentList = null;  // ausgewaehlte Liste
let session = null;      // laufende Abfrage

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const allLists = () => [...customLists, ...VOKABELN];
const findList = id => allLists().find(l => l.id === id);
const sides = list => list.seiten ?? ["Englisch", "Deutsch"];
const langs = list => list.sprachen ?? ["en", "de"];
const wordKey = (list, w) => `${list.id}|${w[0]}`;
const box = key => profile.progress[key]?.box ?? 0;

function learnedPct(list) {
  const n = list.woerter.filter(w => box(wordKey(list, w)) >= LEARNED_BOX).length;
  return Math.round(n / list.woerter.length * 100);
}

// ---------- Antwort pruefen ----------

function norm(s, lang) {
  s = s.toLowerCase().trim()
    .replace(/[’`´]/g, "'")
    .replace(/[.!?,;:]/g, "")
    .replace(/\s+/g, " ")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  const optional = lang === "de" ? /^(der|die|das|den|dem|ein|eine) / : /^(to|a|an|the) /;
  return s.replace(optional, "").trim();
}

function isCorrect(input, answer, lang) {
  const valid = answer.split("/").map(v => norm(v, lang));
  const given = input.split("/").map(v => norm(v, lang)).filter(Boolean);
  return given.length > 0 && given.every(g => valid.includes(g));
}

// ---------- Vorlesen ----------

function speak(text) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ", "));
  u.lang = "en-GB";
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

const speakBtn = (text, lang) =>
  lang === "en" && "speechSynthesis" in window
    ? `<button class="speak" data-action="speak" data-text="${esc(text)}" aria-label="Vorlesen">🔊</button>`
    : "";

// ---------- Bildschirme ----------

function render(html) {
  app.innerHTML = html;
  window.scrollTo(0, 0);
  app.querySelector("[autofocus]")?.focus();
}

function showProfiles() {
  profile = null;
  render(`
    <h1>Vokabeltrainer Englisch</h1>
    <p class="hint">Wer lernt heute?</p>
    <div class="grid">
      ${profiles.map(p => `
        <button class="tile" data-action="pickProfile" data-id="${esc(p.id)}">
          <span class="big">${esc(p.name)}</span>
          <span>Klasse ${p.klasse} · ⭐ ${p.stars}</span>
        </button>`).join("")}
      <button class="tile add" data-action="editProfile">+ Neues Kind</button>
    </div>`);
}

function showProfileForm(p) {
  render(`
    <h1>${p ? "Profil bearbeiten" : "Neues Kind"}</h1>
    <form class="card" data-submit="saveProfile" data-id="${p ? esc(p.id) : ""}">
      <label>Name <input name="name" required maxlength="20" value="${p ? esc(p.name) : ""}" autofocus></label>
      <label>Klasse
        <select name="klasse">${KLASSEN.map(k => `<option ${p?.klasse === k ? "selected" : ""}>${k}</option>`).join("")}</select>
      </label>
      <div class="row">
        <button type="submit" class="primary">Speichern</button>
        <button type="button" data-action="${p ? "home" : "profiles"}">Abbrechen</button>
      </div>
    </form>
    ${p ? `<button class="danger" data-action="deleteProfile">Profil löschen</button>` : ""}`);
}

function listTile(list) {
  const pct = learnedPct(list);
  return `
    <button class="tile" data-action="pickList" data-id="${esc(list.id)}">
      <span class="big">${esc(list.titel)}</span>
      <span>${list.woerter.length} Wörter · ${pct} % gelernt</span>
      <span class="bar"><span style="width:${pct}%"></span></span>
    </button>`;
}

function showHome() {
  session = null;
  const k = profile.klasse;
  const groups = [
    ["Eigene Listen", customLists],
    [`Für Klasse ${k}`, VOKABELN.filter(l => l.klasse[0] <= k && k <= l.klasse[1])],
    ["Wiederholen", VOKABELN.filter(l => l.klasse[1] < k)],
    ["Für später", VOKABELN.filter(l => l.klasse[0] > k)],
  ].filter(([, lists]) => lists.length);
  render(`
    <header class="top">
      <div><h1>Hallo ${esc(profile.name)}!</h1><span class="stars">⭐ ${profile.stars} Sterne</span></div>
      <div class="row">
        <button data-action="editProfile" data-id="${esc(profile.id)}">Profil</button>
        <button data-action="profiles">Wechseln</button>
      </div>
    </header>
    ${groups.map(([title, lists]) => `
      <h2>${esc(title)}</h2>
      <div class="grid">${lists.map(listTile).join("")}</div>`).join("")}
    <button class="add wide" data-action="editList">+ Eigene Liste anlegen oder einfügen</button>`);
}

function showListStart() {
  const list = currentList;
  const [a, b] = sides(list);
  const dir = profile.dir ?? 0;
  const mode = profile.mode ?? "type";
  const own = customLists.includes(list);
  render(`
    <button class="back" data-action="home">← Zurück</button>
    <h1>${esc(list.titel)}</h1>
    <p class="hint">${list.woerter.length} Wörter · ${learnedPct(list)} % gelernt</p>
    <div class="card">
      <h3>Richtung</h3>
      <div class="seg">
        <button data-action="setDir" data-v="0" class="${dir === 0 ? "on" : ""}">${esc(a)} → ${esc(b)}</button>
        <button data-action="setDir" data-v="1" class="${dir === 1 ? "on" : ""}">${esc(b)} → ${esc(a)}</button>
      </div>
      <h3>Abfrage</h3>
      <div class="seg">
        ${Object.entries(MODES).map(([m, label]) =>
          `<button data-action="setMode" data-v="${m}" class="${mode === m ? "on" : ""}">${label}</button>`).join("")}
      </div>
      <button class="primary wide" data-action="start">Los geht's!</button>
    </div>
    ${own ? `
      <div class="row">
        <button data-action="shareList">Liste teilen</button>
        <button class="danger" data-action="deleteList">Liste löschen</button>
      </div>` : ""}
    <details class="card">
      <summary>Alle Wörter anzeigen</summary>
      <table>${list.woerter.map(w => `<tr><td>${esc(w[0])}</td><td>${esc(w[1])}</td></tr>`).join("")}</table>
    </details>`);
}

function showListForm() {
  render(`
    <button class="back" data-action="home">← Zurück</button>
    <h1>Eigene Liste</h1>
    <form class="card" data-submit="saveList">
      <label>Titel <input name="titel" maxlength="40" placeholder="z. B. Unit 3" autofocus></label>
      <label>Wörter – eine Zeile pro Wort: <i>englisch ; deutsch</i>
        <textarea name="woerter" rows="12" placeholder="dog ; der Hund&#10;to run ; rennen / laufen"></textarea>
      </label>
      <p class="hint">Aus Excel kopierte Spalten gehen auch. Eine geteilte Liste hier einfach komplett einfügen.</p>
      <button type="submit" class="primary wide">Speichern</button>
    </form>`);
}

// ---------- Abfrage ----------

function startSession() {
  const list = currentList;
  const seen = key => profile.progress[key]?.seen ?? 0;
  // zufaellig mischen, dann niedrigstes Fach und am laengsten nicht gesehen zuerst
  const items = shuffle(list.woerter.map(w => ({ w, key: wordKey(list, w) })))
    .sort((x, y) => box(x.key) - box(y.key) || seen(x.key) - seen(y.key))
    .slice(0, SESSION_SIZE);
  session = {
    list, dir: profile.dir ?? 0, mode: profile.mode ?? "type",
    queue: items, total: items.length, idx: 0, correct: 0, wrong: [], answered: false,
  };
  showQuestion();
}

function current() {
  const s = session;
  const it = s.queue[s.idx];
  return {
    it,
    prompt: it.w[s.dir], promptLang: langs(s.list)[s.dir],
    answer: it.w[1 - s.dir], answerLang: langs(s.list)[1 - s.dir],
  };
}

function makeOptions(answer) {
  const others = [...new Set(session.list.woerter.map(w => w[1 - session.dir]))].filter(a => a !== answer);
  return shuffle([answer, ...shuffle(others).slice(0, 3)]);
}

function showQuestion() {
  const s = session;
  const { prompt, promptLang, answer } = current();
  s.answered = false;
  let body;
  if (s.mode === "type") {
    body = `
      <form class="answer" data-submit="check">
        <input name="a" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
               placeholder="Deine Antwort" autofocus>
        <button type="submit" class="primary">Prüfen</button>
      </form>
      <p class="hint">Artikel (der/die/das, a/the) und „to“ kannst du weglassen.</p>`;
  } else if (s.mode === "choice") {
    s.options = makeOptions(answer);
    body = `<div class="choices">${s.options.map((o, i) =>
      `<button data-action="choose" data-i="${i}">${esc(o)}</button>`).join("")}</div>`;
  } else {
    body = `<button class="primary wide" data-action="reveal">Lösung zeigen</button>`;
  }
  render(`
    <header class="top">
      <button data-action="home">✕ Beenden</button>
      <span>Frage ${s.idx + 1} von ${s.queue.length}</span>
    </header>
    <span class="bar"><span style="width:${Math.round(s.idx / s.queue.length * 100)}%"></span></span>
    <div class="card prompt"><span class="word">${esc(prompt)}</span>${speakBtn(prompt, promptLang)}</div>
    <div id="feedback"></div>
    <div id="body">${body}</div>`);
}

function record(it, ok) {
  if (!it.repeat) {
    const p = profile.progress[it.key] ?? { box: 0, seen: 0 };
    p.box = ok ? Math.min(p.box + 1, MAX_BOX) : 1;
    p.seen = Date.now();
    profile.progress[it.key] = p;
    if (ok) { session.correct++; profile.stars++; } else session.wrong.push(it.w);
    saveProfiles();
  }
  // falsche Woerter kommen am Ende der Runde noch einmal dran
  if (!ok && !it.repeat) session.queue.push({ ...it, repeat: true });
}

function answerResult(ok) {
  const s = session;
  const { it, answer, answerLang } = current();
  record(it, ok);
  s.answered = true;
  if (s.mode === "type") {
    app.querySelector(".answer input").readOnly = true;
    app.querySelector(".answer button").textContent = "Weiter";
  } else {
    app.querySelectorAll("#body button").forEach(b => { b.disabled = true; });
  }
  document.getElementById("feedback").innerHTML = `
    <div class="card result ${ok ? "ok" : "bad"}">
      <div>
        <span class="big">${ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : "Leider falsch"}</span>
        ${ok ? "" : `<span>Richtig ist: <b>${esc(answer)}</b></span>`}
      </div>
      ${speakBtn(answer, answerLang)}
    </div>
    ${s.mode === "type" ? "" : `<button class="primary wide" data-action="next" id="next">Weiter</button>`}`;
  document.getElementById("next")?.focus();
}

function next() {
  session.idx++;
  if (session.idx < session.queue.length) showQuestion(); else showResult();
}

function showResult() {
  const s = session;
  const share = s.correct / s.total;
  const title = share === 1 ? "Perfekt! 🏆" : share >= 0.7 ? "Super gemacht! 🎉"
    : share >= 0.4 ? "Gut, weiter üben! 💪" : "Nicht aufgeben! 🌱";
  render(`
    <h1>${title}</h1>
    <div class="card center">
      <span class="big">${s.correct} von ${s.total} richtig</span>
      <span>+${s.correct} ⭐ · insgesamt ${profile.stars} Sterne</span>
    </div>
    ${s.wrong.length ? `
      <h2>Diese Wörter üben wir noch</h2>
      <div class="card"><table>${s.wrong.map(w =>
        `<tr><td>${esc(w[0])}</td><td>${esc(w[1])}</td></tr>`).join("")}</table></div>` : ""}
    <div class="row">
      <button class="primary" data-action="start">Nochmal</button>
      <button data-action="home">Zur Übersicht</button>
    </div>`);
}

// ---------- Eigene Listen ----------

function parseList(text) {
  let titel = "";
  const woerter = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (t.startsWith("#")) { titel ||= t.slice(1).trim(); continue; }
    const m = t.match(/^(.+?)\s*(?:\t|;|=|\s-\s)\s*(.+)$/);
    if (m) woerter.push([m[1].trim(), m[2].trim()]);
  }
  return { titel, woerter };
}

async function shareList(list) {
  const text = [`# ${list.titel}`, ...list.woerter.map(w => `${w[0]} ; ${w[1]}`)].join("\n");
  try {
    if (navigator.share) {
      await navigator.share({ title: list.titel, text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Liste kopiert. Per Messenger/Mail schicken und auf dem anderen Gerät unter „Eigene Liste“ einfügen.");
    }
  } catch (err) {
    if (err.name !== "AbortError") alert("Teilen hat nicht geklappt.");
  }
}

// ---------- Ereignisse ----------

const actions = {
  profiles: showProfiles,
  home: showHome,
  pickProfile: el => { profile = profiles.find(p => p.id === el.dataset.id); showHome(); },
  editProfile: el => showProfileForm(profiles.find(p => p.id === el.dataset.id)),
  deleteProfile: () => {
    if (!confirm(`Profil von ${profile.name} mit allen Sternen und dem Lernstand löschen?`)) return;
    profiles = profiles.filter(p => p !== profile);
    saveProfiles();
    showProfiles();
  },
  pickList: el => { currentList = findList(el.dataset.id); showListStart(); },
  setDir: el => { profile.dir = Number(el.dataset.v); saveProfiles(); showListStart(); },
  setMode: el => { profile.mode = el.dataset.v; saveProfiles(); showListStart(); },
  start: startSession,
  speak: el => speak(el.dataset.text),
  choose: el => {
    if (session.answered) return;
    const i = Number(el.dataset.i);
    const { answer } = current();
    app.querySelectorAll(".choices button").forEach((b, j) => {
      if (session.options[j] === answer) b.classList.add("ok");
      else if (j === i) b.classList.add("bad");
    });
    answerResult(session.options[i] === answer);
  },
  reveal: () => {
    const { answer, answerLang } = current();
    document.getElementById("feedback").innerHTML =
      `<div class="card prompt solution"><span class="word">${esc(answer)}</span>${speakBtn(answer, answerLang)}</div>`;
    document.getElementById("body").innerHTML = `
      <p class="hint center">Hast du es gewusst?</p>
      <div class="row">
        <button class="ok" data-action="known">Gewusst ✓</button>
        <button class="bad" data-action="unknown">Noch nicht ✗</button>
      </div>`;
  },
  known: () => { record(current().it, true); next(); },
  unknown: () => { record(current().it, false); next(); },
  next,
  editList: showListForm,
  shareList: () => shareList(currentList),
  deleteList: () => {
    if (!confirm(`Liste „${currentList.titel}“ auf diesem Gerät löschen?`)) return;
    customLists = customLists.filter(l => l !== currentList);
    saveLists();
    showHome();
  },
};

const forms = {
  saveProfile: (f, d) => {
    const name = d.name.trim();
    if (!name) return;
    let p = profiles.find(x => x.id === f.dataset.id);
    if (!p) {
      p = { id: String(Date.now()), stars: 0, progress: {} };
      profiles.push(p);
    }
    p.name = name;
    p.klasse = Number(d.klasse);
    saveProfiles();
    profile = p;
    showHome();
  },
  check: (f, d) => {
    if (session.answered) { next(); return; }
    if (!d.a.trim()) return;
    const { answer, answerLang } = current();
    answerResult(isCorrect(d.a, answer, answerLang));
  },
  saveList: (f, d) => {
    const parsed = parseList(d.woerter);
    if (!parsed.woerter.length) {
      alert("Keine Wörter erkannt. Bitte pro Zeile: englisch ; deutsch");
      return;
    }
    const list = {
      id: `eigen-${Date.now()}`,
      titel: d.titel.trim() || parsed.titel || "Eigene Liste",
      woerter: parsed.woerter,
    };
    customLists.push(list);
    saveLists();
    currentList = list;
    showListStart();
  },
};

app.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (el && !el.disabled) actions[el.dataset.action](el);
});

app.addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  forms[f.dataset.submit](f, Object.fromEntries(new FormData(f)));
});

// ---------- Start ----------

navigator.storage?.persist?.();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js");
}
showProfiles();
