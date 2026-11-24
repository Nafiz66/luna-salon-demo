/* LUNA Coiffeur & Beauty – Demo-Prototyp
   Reines HTML/CSS/JS. Ein gemeinsamer Zustand (S) in localStorage:
   Kundenbuchung -> sofort im Admin-Kalender, Telefon-Check und in den Kennzahlen.
   Mehrere Tabs/Fenster bleiben über das "storage"-Ereignis live synchron. */
'use strict';

/* ---------- Stammdaten ---------- */
const CATS = [
  { id: 'schnitt', name: 'Haarschnitt' },
  { id: 'styling', name: 'Styling' },
  { id: 'farbe', name: 'Farbe & Balayage' },
  { id: 'bart', name: 'Bart & Herren' },
  { id: 'beauty', name: 'Beauty & Pflege' },
];
const DEF_SERVICES = [
  { id: 's1', cat: 'schnitt', name: 'Damenhaarschnitt', desc: 'Waschen, Beratung, Schnitt & Föhnfrisur.', price: 52, dur: 60, w: 9, tag: 'Beliebt' },
  { id: 's2', cat: 'schnitt', name: 'Herrenhaarschnitt', desc: 'Waschen, Schnitt & Styling – klassisch oder Fade.', price: 29, dur: 30, w: 12, tag: 'Beliebt' },
  { id: 's3', cat: 'schnitt', name: 'Kinderhaarschnitt (bis 12 J.)', desc: 'Mit Geduld und Spaß – inkl. kleiner Überraschung.', price: 19, dur: 30, w: 4 },
  { id: 's4', cat: 'schnitt', name: 'Spitzen & Pony', desc: 'Schnelle Auffrischung ohne Waschen.', price: 15, dur: 15, w: 3 },
  { id: 's5', cat: 'styling', name: 'Waschen & Föhnen', desc: 'Volumen, glatt oder Beach Waves.', price: 32, dur: 45, w: 4 },
  { id: 's6', cat: 'styling', name: 'Hochsteckfrisur', desc: 'Für Hochzeiten, Feste & besondere Anlässe.', price: 69, dur: 60, w: 2 },
  { id: 's7', cat: 'styling', name: 'Braut-Styling inkl. Probe', desc: 'Probetermin + Styling am großen Tag.', price: 189, dur: 120, w: 1, tag: 'Premium' },
  { id: 's8', cat: 'farbe', confirm: true, name: 'Ansatzfarbe', desc: 'Ansatz färben inkl. Glanzpflege & Föhnen.', price: 62, dur: 90, w: 5 },
  { id: 's9', cat: 'farbe', confirm: true, name: 'Komplettfarbe', desc: 'Ganzflächige Coloration, Pflege & Föhnen.', price: 84, dur: 120, w: 3 },
  { id: 's10', cat: 'farbe', confirm: true, name: 'Balayage', desc: 'Handgemalte, natürliche Verläufe inkl. Toner & Schnitt.', price: 159, dur: 180, w: 3, tag: 'Signature' },
  { id: 's11', cat: 'farbe', confirm: true, name: 'Foliensträhnen', desc: 'Feine oder kräftige Highlights inkl. Toner.', price: 119, dur: 150, w: 2 },
  { id: 's12', cat: 'farbe', confirm: true, name: 'Glossing / Toner', desc: 'Mehr Glanz, Farbe auffrischen, Gelbstich weg.', price: 39, dur: 30, w: 2 },
  { id: 's13', cat: 'bart', name: 'Bart trimmen & Konturen', desc: 'Form, Konturen mit Klinge, Bartöl.', price: 19, dur: 30, w: 5 },
  { id: 's14', cat: 'bart', name: 'Haarschnitt + Bart', desc: 'Das Komplettpaket für ihn.', price: 44, dur: 60, w: 6, tag: 'Beliebt' },
  { id: 's15', cat: 'bart', name: 'Nassrasur mit heißem Tuch', desc: 'Klassische Rasur, Kompresse & Pflege.', price: 29, dur: 45, w: 2 },
  { id: 's16', cat: 'beauty', name: 'Augenbrauen formen', desc: 'Zupfen oder Wachs inkl. Formberatung.', price: 15, dur: 15, w: 3 },
  { id: 's17', cat: 'beauty', name: 'Brow Lamination', desc: 'Gebürsteter Look, hält 6–8 Wochen.', price: 49, dur: 45, w: 2 },
  { id: 's18', cat: 'beauty', name: 'Olaplex Intensivkur', desc: 'Repariert die Haarstruktur von innen.', price: 35, dur: 30, w: 3 },
];
const EXTRAS = [
  { id: 'x1', name: 'Entspannende Kopfmassage', price: 9, dur: 15 },
  { id: 'x2', name: 'Olaplex-Pflegezusatz', price: 19, dur: 15 },
  { id: 'x3', name: 'Augenbrauen in Form', price: 12, dur: 15 },
];
const DEF_STYLISTS = [
  { id: 'safak', name: 'Şafak', role: 'Inhaber · Master Coiffeur', cats: ['schnitt', 'styling', 'farbe', 'bart'], days: [1, 2, 3, 4, 5, 6], pin: '1111', spec: ['Präzisionsschnitt', 'Fade', 'Farbe'], bio: 'Inhaber und selbst täglich an der Schere. Steht für saubere Linien und Schnitte, die auch nach 6 Wochen noch sitzen.' },
  { id: 'mirgel', name: 'Mirgel', role: 'Coiffeur · Farbe & Styling', cats: ['schnitt', 'styling', 'farbe', 'beauty'], days: [2, 3, 4, 5, 6], pin: '2222', spec: ['Balayage', 'Blond', 'Styling'], bio: 'Spezialisiert auf natürliche Farbverläufe, Blondtöne und Styling für besondere Anlässe.' },
  { id: 'ozan', name: 'Ozan', role: 'Barber', cats: ['schnitt', 'bart'], days: [1, 2, 3, 4, 5], pin: '3333', spec: ['Skin Fade', 'Bartdesign', 'Nassrasur'], bio: 'Klassisches Barber-Handwerk mit heißem Tuch und Klinge – präzise bis ins Detail.' },
];
// Leistungen & Team sind im Inhaber-Bereich änderbar und liegen danach im Zustand (S.services / S.staff).
// Entfernte Einträge bleiben mit gone:true erhalten, damit alte Termine & Umsätze korrekt bleiben.
let SERVICES = DEF_SERVICES, STYLISTS = DEF_STYLISTS;
const OWNER_ID = 'safak';
const team = () => STYLISTS.filter(s => !s.gone);
const svcs = () => SERVICES.filter(s => !s.gone);
const isOpenSt = a => a.status === 'gebucht' || a.status === 'vorlaeufig';
// Öffnungszeiten in Minuten ab 0:00 (0 = Sonntag)
const HOURS = { 1: [690, 1080], 2: [540, 1080], 3: [540, 1080], 4: [540, 1080], 5: [540, 1080], 6: [480, 840] };
const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const WDL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const PAY = { bar: 'Bar', ec: 'EC-Karte', kk: 'Kreditkarte' };
const SRC = { online: 'Online', telefon: 'Telefon', walkin: 'Walk-in', seed: 'Stamm' };
const DEMO_USER = 'inhaber@luna-demo.de', DEMO_PW = 'luna2026';
const STEUERBERATER = 'Kanzlei Weber & Partner, Mühlacker';
const C_CUR = '#a9822f', C_PREV = '#4f86d0'; // validiert (dark, CVD-sicher)

/* ---------- Helfer ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
const today = () => ymd(new Date());
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const hm = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const wd = s => parse(s).getDay();
const ym = s => s.slice(0, 7);
const eur = n => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
const eur0 = n => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const num = n => n.toLocaleString('de-DE');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = (s, long) => { const d = parse(s); return long ? `${WDL[d.getDay()]}, ${d.getDate()}. ${MON[d.getMonth()]} ${d.getFullYear()}` : `${WD[d.getDay()]}, ${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`; };
const relDay = s => s === today() ? 'Heute' : s === addDays(today(), 1) ? 'Morgen' : fmtDate(s);
const svcById = id => SERVICES.find(s => s.id === id);
const stById = id => STYLISTS.find(s => s.id === id);
const catName = id => CATS.find(c => c.id === id)?.name;
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const prevYm = s => { const [y, m] = s.split('-').map(Number); const d = new Date(y, m - 2, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
const clone = o => JSON.parse(JSON.stringify(o));
const firstSvc = id => (svcById(id) && !svcById(id).gone ? id : svcs()[0]?.id);
const ymLabel = s => { const [y, m] = s.split('-').map(Number); return `${MON[m - 1]} ${y}`; };
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function hexOf(seed, len) { const r = mulberry32(seed); let s = ''; while (s.length < len) s += Math.floor(r() * 16).toString(16); return s.toUpperCase(); }

/* ---------- Zustand ---------- */
const KEY = 'luna-demo-v3';
let S;
const FIRST = ['Anna', 'Lea', 'Mia', 'Sophie', 'Emma', 'Laura', 'Elif', 'Zeynep', 'Hannah', 'Julia', 'Sarah', 'Nina', 'Ayşe', 'Lisa', 'Marie', 'Jonas', 'Luca', 'Ben', 'Emre', 'Tim', 'Felix', 'Can', 'David', 'Max', 'Murat', 'Leon', 'Paul', 'Kerem', 'Fatma', 'Clara'];
const LAST = ['Müller', 'Schmidt', 'Yılmaz', 'Weber', 'Fischer', 'Kaya', 'Wagner', 'Becker', 'Hoffmann', 'Demir', 'Schulz', 'Koch', 'Richter', 'Klein', 'Wolf', 'Neumann', 'Şahin', 'Braun', 'Zimmermann', 'Krüger'];

function seed() {
  const rnd = mulberry32(hash(today()));
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const t = today(), nm = nowMin();
  const d0 = new Date(); d0.setMonth(d0.getMonth() - 5, 1);
  const start = ymd(d0), end = addDays(t, 21);
  const total = Math.round((parse(t) - parse(start)) / 864e5);
  const appts = []; let n = 0, receipt = 4000;
  for (let d = start, i = 0; d <= end; d = addDays(d, 1), i++) {
    const w = wd(d), h = HOURS[w]; if (!h) continue;
    const ahead = Math.round((parse(d) - parse(t)) / 864e5);
    const base = 0.36 + 0.4 * Math.min(1, i / total) + (w === 6 || w === 5 ? 0.08 : 0);
    const dens = ahead <= 0 ? base : ahead === 1 ? 0.62 : ahead <= 3 ? 0.48 : ahead <= 7 ? 0.32 : 0.14;
    for (const st of STYLISTS) {
      if (!st.days.includes(w)) continue;
      let m = h[0];
      while (m < h[1]) {
        if (rnd() < dens) {
          const opts = SERVICES.filter(s => st.cats.includes(s.cat) && m + s.dur <= h[1]);
          if (!opts.length) break;
          const tw = opts.reduce((a, s) => a + s.w * (st.id === 'ozan' && s.cat === 'bart' ? 3 : st.id === 'mirgel' && s.cat !== 'schnitt' && s.cat !== 'bart' ? 3 : 1), 0);
          let r = rnd() * tw, svc = opts[0];
          for (const s of opts) { r -= s.w * (st.id === 'ozan' && s.cat === 'bart' ? 3 : st.id === 'mirgel' && s.cat !== 'schnitt' && s.cat !== 'bart' ? 3 : 1); if (r <= 0) { svc = s; break; } }
          const ex = rnd() < 0.15 ? [pick(EXTRAS).id] : [];
          const dur = svc.dur + ex.reduce((a, x) => a + EXTRAS.find(e => e.id === x).dur, 0);
          if (m + dur > h[1]) { m += 30; continue; }
          const past = d < t || (d === t && m + dur <= nm);
          let status = past ? 'erledigt' : 'gebucht';
          const rr = rnd();
          if (past && rr < 0.025) status = 'noshow'; else if (rr > 0.985) status = 'storniert';
          const first = pick(FIRST), last = pick(LAST);
          const a = {
            id: 'a' + (++n), code: genCode(rnd), date: d, start: m, dur, stylist: st.id, service: svc.id, extras: ex,
            price: svc.price + ex.reduce((a, x) => a + EXTRAS.find(e => e.id === x).price, 0),
            name: `${first} ${last[0]}.`, phone: `0176 ${Math.floor(1e6 + rnd() * 8e6)}`, email: '', note: '',
            source: rnd() < 0.55 ? 'online' : rnd() < 0.8 ? 'telefon' : 'walkin', status, createdAt: 0,
          };
          // Damen-Farbe online: ein Teil wartet noch auf den Rückruf
          if (status === 'gebucht' && svc.confirm && ahead >= 1 && ahead <= 12 && rnd() < 0.4) { a.status = 'vorlaeufig'; a.source = 'online'; a.reqAt = Date.now() - Math.floor(1 + rnd() * 30) * 36e5; }
          if (status === 'erledigt') a.paid = { method: rnd() < 0.42 ? 'bar' : rnd() < 0.85 ? 'ec' : 'kk', no: ++receipt, at: d };
          // Wachstumskurve: ältere Monate etwas leerer (Demo zeigt steigenden Umsatz)
          const back = (parse(t).getFullYear() - parse(d).getFullYear()) * 12 + parse(t).getMonth() - parse(d).getMonth();
          if (back <= 0 || rnd() < 0.86 - 0.04 * (back - 1)) appts.push(a); else n--;
          m += dur + (rnd() < 0.25 ? 15 : 0);
        } else m += 30;
      }
    }
  }
  return { v: 1, seedDate: t, services: clone(DEF_SERVICES), staff: clone(DEF_STYLISTS), appts, n, receipt, tse: 18240 + receipt, datevLog: [{ month: prevYm(ym(t)), at: addDays(t, -20), rows: 0, sum: 0, to: STEUERBERATER, auto: true }], fallback: false, offline: 0 };
}
function genCode(rnd = Math.random) {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c;
  do { c = 'LUNA-' + Array.from({ length: 4 }, () => A[Math.floor(rnd() * A.length)]).join(''); } while (S && S.appts.some(a => a.code === c));
  return c;
}
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch { S = null; }
  if (!S || S.v !== 1 || (parse(today()) - parse(S.seedDate)) / 864e5 > 6) { SERVICES = DEF_SERVICES; STYLISTS = DEF_STYLISTS; S = seed(); save(false); }
  if (!S.services) S.services = clone(DEF_SERVICES);
  if (!S.staff) S.staff = clone(DEF_STYLISTS);
  SERVICES = S.services; STYLISTS = S.staff;
  // Vergangene, nicht kassierte Termine gelten als erledigt (bar)
  let ch = false;
  for (const a of S.appts) if (isOpenSt(a) && a.date < today()) { a.status = 'erledigt'; a.paid = { method: 'bar', no: ++S.receipt, at: a.date }; ch = true; }
  if (ch) save(false);
}
function save(broadcast = true) {
  localStorage.setItem(KEY, JSON.stringify(S));
  dayIdx = null;
  if (broadcast) refreshAll();
}
let dayIdx = null;
function apptsOn(date) {
  if (!dayIdx) { dayIdx = new Map(); for (const a of S.appts) { if (!dayIdx.has(a.date)) dayIdx.set(a.date, []); dayIdx.get(a.date).push(a); } }
  return dayIdx.get(date) || [];
}
const active = a => a.status !== 'storniert';
const isNew = a => a.createdAt && Date.now() - a.createdAt < 15 * 60e3;

/* ---------- Verfügbarkeit ---------- */
function works(st, date) { const w = wd(date); return !!HOURS[w] && st.days.includes(w); }
function conflictOf(stId, date, start, dur, ignore) {
  return apptsOn(date).find(a => a.stylist === stId && active(a) && a.status !== 'noshow' && a.id !== ignore && start < a.start + a.dur && a.start < start + dur);
}
function isFree(st, date, start, dur, admin = false) {
  const h = HOURS[wd(date)];
  if (!h || !st.days.includes(wd(date))) return false;
  if (start < h[0] || start + dur > h[1]) return false;
  if (date < today()) return false;
  if (date === today() && start < nowMin() + (admin ? -15 : 30)) return false;
  return !conflictOf(st.id, date, start, dur);
}
function freeStylists(svc, date, start, dur, pref = 'any', admin = false) {
  return team().filter(st => (pref === 'any' || st.id === pref) && st.cats.includes(svc.cat) && isFree(st, date, start, dur, admin));
}
function daySlots(svc, dur, date, pref) {
  const h = HOURS[wd(date)]; if (!h) return [];
  const out = [];
  for (let m = h[0]; m + dur <= h[1]; m += 30) out.push({ start: m, free: freeStylists(svc, date, m, dur, pref) });
  return out;
}
function nextFree(svc, dur, pref, count = 4) {
  const res = [];
  for (let i = 0; i < 30 && res.length < count; i++) {
    const d = addDays(today(), i);
    for (const s of daySlots(svc, dur, d, pref)) { if (s.free.length) { res.push({ date: d, ...s }); if (res.length >= count) break; } }
  }
  return res;
}
function leastBusy(list, date) {
  return [...list].sort((a, b) => apptsOn(date).filter(x => x.stylist === a.id && active(x)).length - apptsOn(date).filter(x => x.stylist === b.id && active(x)).length)[0];
}

/* ---------- UI-Grundlagen ---------- */
function toast(html, ms = 5200) {
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = html;
  $('#toasts').append(el); setTimeout(() => el.remove(), ms);
}
function openModal(html, wide = false) {
  $('#modalBody').innerHTML = html; $('.modal-box').classList.toggle('wide', wide);
  $('#modal').hidden = false;
}
function closeModal() { $('#modal').hidden = true; $('#modalBody').innerHTML = ''; }
$('#modalClose').onclick = closeModal;
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
// Tooltip für alle [data-tip]
const tip = $('#tooltip');
document.addEventListener('mousemove', e => {
  const t = e.target.closest?.('[data-tip]');
  if (!t) { if (!tip.dataset.lock) tip.hidden = true; return; }
  tip.innerHTML = t.dataset.tip; tip.hidden = false;
  placeTip(e.clientX, e.clientY);
});
function placeTip(x, y) {
  const r = tip.getBoundingClientRect();
  tip.style.left = Math.min(x + 14, innerWidth - r.width - 8) + 'px';
  tip.style.top = (y + 16 + r.height > innerHeight ? y - r.height - 10 : y + 16) + 'px';
}
function avatar(st, sm) { return `<span class="avatar${sm ? ' sm' : ''}">${st.name[0]}</span>`; }
function download(name, text, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ---------- Header, Öffnungsstatus ---------- */
$('#burger').onclick = () => $('#mainNav').classList.toggle('open');
$$('#mainNav a').forEach(a => a.addEventListener('click', () => $('#mainNav').classList.remove('open')));
function renderOpen() {
  const w = new Date().getDay(), h = HOURS[w], m = nowMin();
  const open = h && m >= h[0] && m < h[1];
  $('#openDot').classList.toggle('closed', !open);
  if (open) $('#openState').textContent = `Jetzt geöffnet · bis ${hm(h[1])} Uhr`;
  else {
    let d = today(); if (h && m < h[0]) { $('#openState').textContent = `Geschlossen · öffnet heute ${hm(h[0])} Uhr`; return; }
    do d = addDays(d, 1); while (!HOURS[wd(d)]);
    $('#openState').textContent = `Geschlossen · öffnet ${WDL[wd(d)]} ${hm(HOURS[wd(d)][0])} Uhr`;
  }
}
function renderHours() {
  const tw = new Date().getDay();
  $('#hoursTable').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(w => `<tr class="${w === tw ? 'today' : ''}"><td>${WDL[w]}</td><td>${HOURS[w] ? hm(HOURS[w][0]) + ' – ' + hm(HOURS[w][1]) : 'geschlossen'}</td></tr>`).join('');
}

/* ---------- Leistungen ---------- */
let svcCat = 'all';
function renderServices() {
  $('#catChips').innerHTML = [{ id: 'all', name: 'Alle' }, ...CATS].map(c => `<button class="chip ${svcCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>`).join('');
  const list = svcs().filter(s => svcCat === 'all' || s.cat === svcCat);
  $('#serviceGrid').innerHTML = list.map(s => {
    const sts = team().filter(st => st.cats.includes(s.cat));
    return `<article class="service">
      <div class="service-top"><div><h4>${esc(s.name)}</h4>${s.tag ? `<span class="tag">${s.tag}</span>` : ''}</div><div class="price">${s.confirm ? '<small>ab</small> ' : ''}${eur0(s.price)}</div></div>
      <div class="service-meta"><span>⏱ ${s.dur} Min.</span><span>✂ ${catName(s.cat)}</span></div>
      <p>${esc(s.desc)}</p>
      ${s.confirm ? '<p class="callnote">📞 Mit kurzem Beratungs-Anruf: Wir reservieren vorläufig und stimmen die Zeit telefonisch mit Ihnen ab.</p>' : ''}
      <div class="service-actions">
        <select data-stsel="${s.id}" aria-label="Mitarbeiter"><option value="any">Egal / nächster frei</option>${sts.map(st => `<option value="${st.id}">bei ${st.name}</option>`).join('')}</select>
        <button class="btn btn-gold btn-sm" data-book="${s.id}">Buchen</button>
      </div></article>`;
  }).join('');
}
$('#catChips').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { svcCat = b.dataset.cat; renderServices(); } });
$('#serviceGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-book]'); if (!b) return;
  const st = $(`[data-stsel="${b.dataset.book}"]`).value;
  startBooking({ svc: b.dataset.book, stylist: st, step: 3 });
});

/* ---------- Team ---------- */
function renderTeam() {
  const st0 = $('#statStylists'); if (st0) st0.textContent = team().length;
  $('#teamGrid').innerHTML = team().map(st => `<div class="member">${avatar(st)}<h4>${st.name}</h4><div class="role">${st.role}</div>
    <p>${esc(st.bio)}</p><p>${st.spec.map(x => `<span class="tag">${x}</span>`).join(' ')}</p>
    <p class="small dim">${st.days.map(d => WD[d]).join(' · ')}</p>
    <button class="btn btn-ghost btn-sm" data-team="${st.id}">Bei ${st.name} buchen</button></div>`).join('');
}
$('#teamGrid').addEventListener('click', e => { const b = e.target.closest('[data-team]'); if (b) startBooking({ stylist: b.dataset.team, step: 1 }); });

/* ---------- Schnellfinder ---------- */
function initFinder() {
  const prev = $('#finderService').value;
  $('#finderService').innerHTML = CATS.map(c => { const l = svcs().filter(s => s.cat === c.id); return l.length ? `<optgroup label="${c.name}">${l.map(s => `<option value="${s.id}">${esc(s.name)} · ${s.confirm ? 'ab ' : ''}${eur0(s.price)} · ${s.dur} Min.</option>`).join('')}</optgroup>` : ''; }).join('');
  $('#finderService').value = firstSvc(prev || 's1');
  $('#finderService').onchange = () => { fillFinderStylists(); renderFinder(); };
  $('#finderStylist').onchange = renderFinder;
  fillFinderStylists();
}
function fillFinderStylists() {
  const svc = svcById($('#finderService').value);
  const prev = $('#finderStylist').value;
  $('#finderStylist').innerHTML = `<option value="any">Egal – wer zuerst frei ist</option>` + team().filter(st => st.cats.includes(svc.cat)).map(st => `<option value="${st.id}">${st.name}</option>`).join('');
  if ([...$('#finderStylist').options].some(o => o.value === prev)) $('#finderStylist').value = prev;
}
function renderFinder() {
  const svc = svcById($('#finderService').value), pref = $('#finderStylist').value;
  if (!svc) { $('#finderResults').innerHTML = ''; return; }
  const res = nextFree(svc, svc.dur, pref, 4);
  $('#finderResults').innerHTML = res.length ? res.map(r => {
    const st = pref === 'any' ? leastBusy(r.free, r.date) : stById(pref);
    return `<button class="slot-card" data-fdate="${r.date}" data-fstart="${r.start}" data-fst="${st.id}">
      <span><small class="muted">${relDay(r.date)}</small><b>${hm(r.start)} Uhr</b><small class="muted">mit ${st.name}${r.free.length > 1 && pref === 'any' ? ` · ${r.free.length} frei` : ''}</small></span><span class="arrow">→</span></button>`;
  }).join('') : '<div class="empty">In den nächsten 30 Tagen leider nichts frei.</div>';
}
$('#finderResults').addEventListener('click', e => {
  const b = e.target.closest('[data-fdate]'); if (!b) return;
  startBooking({ svc: $('#finderService').value, stylist: b.dataset.fst, date: b.dataset.fdate, start: +b.dataset.fstart, step: 4 });
});

/* ---------- Buchungs-Assistent ---------- */
let B = { step: 1, svc: null, extras: [], stylist: 'any', date: null, start: null, cat: 'all', form: {}, error: '' };
const bDur = () => (B.svc ? svcById(B.svc).dur : 0) + B.extras.reduce((a, x) => a + EXTRAS.find(e => e.id === x).dur, 0);
const bPrice = () => (B.svc ? svcById(B.svc).price : 0) + B.extras.reduce((a, x) => a + EXTRAS.find(e => e.id === x).price, 0);
function startBooking(o) {
  B = { step: 1, svc: null, extras: [], stylist: 'any', date: null, start: null, cat: 'all', form: B.form || {}, error: '', ...o };
  if (!B.svc && B.step > 1) B.step = 1;
  renderBooking();
  $('#buchen').scrollIntoView({ behavior: 'smooth' });
}
function renderSteps() {
  $$('#steps li').forEach(li => { const s = +li.dataset.step; li.className = B.step === 'done' || s < B.step ? 'done' : s === B.step ? 'active' : ''; });
}
function summaryLine() {
  if (!B.svc) return '<span class="summary-line">Noch keine Leistung gewählt</span>';
  const s = svcById(B.svc), st = B.stylist === 'any' ? 'Egal' : stById(B.stylist).name;
  return `<span class="summary-line"><b>${esc(s.name)}</b>${B.extras.length ? ` + ${B.extras.length} Extra` : ''} · ${bDur()} Min. · <b>${eur(bPrice())}</b> · ${st}${B.date && B.start != null ? ` · ${relDay(B.date)} ${hm(B.start)}` : ''}</span>`;
}
function renderBooking() {
  renderSteps();
  const body = $('#bookingBody');
  if (B.step === 'done') return renderConfirmation();
  let html = '';
  if (B.stylist !== 'any' && (!stById(B.stylist) || stById(B.stylist).gone)) B.stylist = 'any';
  if (B.svc && svcById(B.svc)?.gone) { B.svc = null; B.step = 1; }
  if (B.step === 1) {
    const allowed = svcs().filter(s => B.stylist === 'any' || stById(B.stylist).cats.includes(s.cat));
    const cats = CATS.filter(c => allowed.some(s => s.cat === c.id));
    html = `${B.stylist !== 'any' ? `<div class="notice" style="margin-bottom:16px">Leistungen von <b>${stById(B.stylist).name}</b> · <button class="linkbtn" data-act="anyst">alle anzeigen</button></div>` : ''}
      <div class="chips">${[{ id: 'all', name: 'Alle' }, ...cats].map(c => `<button class="chip ${B.cat === c.id ? 'active' : ''}" data-bcat="${c.id}">${c.name}</button>`).join('')}</div>
      <div class="pick-grid">${allowed.filter(s => B.cat === 'all' || s.cat === B.cat).map(s => `<button class="pick ${B.svc === s.id ? 'active' : ''}" data-svc="${s.id}"><span>${esc(s.name)}<small>${s.dur} Min. · ${catName(s.cat)}${s.confirm ? ' · 📞 mit Beratungs-Anruf' : ''}</small></span><span class="p">${s.confirm ? '<small>ab</small> ' : ''}${eur0(s.price)}</span></button>`).join('')}</div>
      <div class="subhead">Zusatzoptionen</div>
      <div class="extras">${EXTRAS.map(x => `<button class="pick ${B.extras.includes(x.id) ? 'active' : ''}" data-extra="${x.id}"><span>${x.name}<small>+${x.dur} Min.</small></span><span class="p">+${eur0(x.price)}</span></button>`).join('')}</div>`;
  } else if (B.step === 2) {
    const svc = svcById(B.svc);
    const sts = team().filter(st => st.cats.includes(svc.cat));
    const nf = nextFree(svc, bDur(), 'any', 1)[0];
    html = `<div class="pick-grid">
      <button class="pick ${B.stylist === 'any' ? 'active' : ''}" data-st="any"><span><b>Egal – nächster freier Platz</b><small>${nf ? `Frühestens ${relDay(nf.date)}, ${hm(nf.start)} Uhr` : '—'}</small></span><span class="p">⚡</span></button>
      ${sts.map(st => { const n = nextFree(svc, bDur(), st.id, 1)[0]; return `<button class="pick ${B.stylist === st.id ? 'active' : ''}" data-st="${st.id}"><span class="who">${avatar(st, 1)}<span><b>${st.name}</b><small>${st.role}${n ? ` · frei ab ${relDay(n.date)} ${hm(n.start)}` : ''}</small></span></span></button>`; }).join('')}</div>`;
  } else if (B.step === 3) {
    const svc = svcById(B.svc), dur = bDur();
    if (!B.date) { const n = nextFree(svc, dur, B.stylist, 1)[0]; B.date = n ? n.date : today(); }
    const days = Array.from({ length: 21 }, (_, i) => addDays(today(), i)).map(d => {
      const n = daySlots(svc, dur, d, B.stylist).filter(s => s.free.length).length;
      const closed = !HOURS[wd(d)];
      const dt = parse(d);
      return `<button class="day ${B.date === d ? 'active' : ''} ${n ? '' : 'full'}" data-day="${d}" ${closed ? 'disabled' : ''}><small>${i0(d)}</small><b>${dt.getDate()}</b><small>${MON[dt.getMonth()].slice(0, 3)}</small><i>${closed ? 'zu' : n ? n + ' frei' : 'voll'}</i></button>`;
    }).join('');
    const slots = daySlots(svc, dur, B.date, B.stylist);
    html = `${B.error ? `<div class="notice err" style="margin-bottom:16px">${B.error}</div>` : ''}
      <div class="subhead">Datum</div><div class="days">${days}</div>
      <div class="subhead">Uhrzeit · ${fmtDate(B.date, true)}</div>
      ${slots.length ? `<div class="slots">${slots.map(s => `<button class="slot ${B.start === s.start ? 'active' : ''}" data-slot="${s.start}" ${s.free.length ? '' : 'disabled'} title="${s.free.length ? 'Frei: ' + s.free.map(x => x.name).join(', ') : 'Belegt'}">${hm(s.start)}</button>`).join('')}</div>
      <div class="legend"><span>frei</span><span class="l-busy">belegt</span><span class="l-sel">Ihre Wahl</span><span>Dauer Ihres Termins: ${dur} Min.</span></div>` : '<div class="empty">An diesem Tag geschlossen.</div>'}`;
  } else if (B.step === 4) {
    const f = B.form;
    html = `<div class="grid2">
      <form id="bookForm" autocomplete="on">
        <div class="row"><div class="field"><label>Vor- und Nachname *</label><input name="name" required value="${esc(f.name || '')}"></div>
        <div class="field"><label>Mobilnummer * (für SMS-Bestätigung)</label><input name="phone" required type="tel" value="${esc(f.phone || '')}"></div></div>
        <div class="field"><label>E-Mail (für Bestätigung &amp; Kalender)</label><input name="email" type="email" value="${esc(f.email || '')}"></div>
        <div class="field"><label>Wunsch-Notiz an Ihren Stylisten (optional)</label><textarea name="note" rows="3" placeholder="z. B. nur 2 cm ab, Inspirationsfoto bringe ich mit, empfindliche Kopfhaut …">${esc(f.note || '')}</textarea></div>
        <label class="check"><input type="checkbox" name="remind" checked> SMS-Erinnerung 24 h vorher</label>
        <label class="check"><input type="checkbox" name="firstVisit"> Ich bin zum ersten Mal bei LUNA</label>
        <label class="check"><input type="checkbox" name="consent" required> Ich akzeptiere die Stornobedingungen (kostenlos bis 24 h vorher) und den Datenschutz. *</label>
      </form>
      <div class="ticket">
        <p class="eyebrow">Ihre Auswahl</p>
        <dl class="dl">
          <dt>Leistung</dt><dd>${esc(svcById(B.svc).name)}</dd>
          ${B.extras.length ? `<dt>Extras</dt><dd>${B.extras.map(x => EXTRAS.find(e => e.id === x).name).join(', ')}</dd>` : ''}
          <dt>Stylist</dt><dd>${B.stylist === 'any' ? 'Nächster freier' : stById(B.stylist).name}</dd>
          <dt>Termin</dt><dd>${fmtDate(B.date, true)}<br>${hm(B.start)} – ${hm(B.start + bDur())} Uhr</dd>
          <dt>Preis</dt><dd class="gold"><b>${svcById(B.svc).confirm ? 'ab ' : ''}${eur(bPrice())}</b> <span class="muted small">${svcById(B.svc).confirm ? 'endgültig nach Beratung' : 'zahlbar vor Ort'}</span></dd>
        </dl>
        ${svcById(B.svc).confirm
          ? `<div class="notice warn" style="margin-top:14px">📞 <b>Vorläufige Reservierung.</b> Bei Farbbehandlungen rufen wir Sie kurz an (Haarlänge, Ausgangsfarbe, Wunschergebnis), damit Ihr Stylist die Zeit richtig einplant. Nach dem Telefonat ist der Termin fest bestätigt – Ihr Zeitfenster bleibt bis dahin für Sie reserviert.</div>`
          : '<p class="small muted" style="margin-top:14px">✓ Sofort verbindlich bestätigt – keine Wartezeit auf Freigabe.</p>'}
      </div></div>`;
  }
  const canNext = B.step === 1 ? !!B.svc : B.step === 2 ? true : B.step === 3 ? B.start != null : true;
  html += `<div class="booking-foot">${summaryLine()}<div style="display:flex;gap:10px">
    ${B.step > 1 ? '<button class="btn btn-ghost" data-act="back">Zurück</button>' : ''}
    ${B.step < 4 ? `<button class="btn btn-gold" data-act="next" ${canNext ? '' : 'disabled'}>Weiter</button>` : `<button class="btn btn-gold" data-act="submit">${svcById(B.svc).confirm ? 'Vorläufig reservieren' : 'Verbindlich buchen'}</button>`}
  </div></div>`;
  body.innerHTML = html;
}
function i0(d) { return d === today() ? 'Heute' : WD[wd(d)]; }
$('#bookingBody').addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  const d = t.dataset;
  if (d.bcat) { B.cat = d.bcat; }
  else if (d.svc) { B.svc = d.svc; B.date = null; B.start = null; if (B.stylist !== 'any' && !stById(B.stylist).cats.includes(svcById(d.svc).cat)) B.stylist = 'any'; }
  else if (d.extra) { B.extras = B.extras.includes(d.extra) ? B.extras.filter(x => x !== d.extra) : [...B.extras, d.extra]; B.start = null; }
  else if (d.st) { B.stylist = d.st; B.date = null; B.start = null; }
  else if (d.day) { B.date = d.day; B.start = null; B.error = ''; }
  else if (d.slot) { B.start = +d.slot; B.error = ''; }
  else if (d.act === 'anyst') { B.stylist = 'any'; }
  else if (d.act === 'next') { B.step++; }
  else if (d.act === 'back') { if (B.step === 4) saveForm(); B.step--; }
  else if (d.act === 'submit') { return submitBooking(); }
  else if (d.act === 'again') { startBooking({}); return; }
  else if (d.act === 'ics') { return downloadIcs(S.appts.find(a => a.id === d.id)); }
  else return;
  renderBooking();
});
function saveForm() {
  const f = $('#bookForm'); if (!f) return;
  B.form = Object.fromEntries(new FormData(f));
}
function submitBooking() {
  const form = $('#bookForm');
  if (!form.reportValidity()) return;
  saveForm();
  const svc = svcById(B.svc), dur = bDur();
  // Echtzeit-Prüfung direkt vor dem Anlegen: ist der Platz noch frei?
  load();
  const free = freeStylists(svc, B.date, B.start, dur, B.stylist);
  if (!free.length) {
    B.error = '⚠ Dieser Platz wurde gerade eben vergeben. Bitte wählen Sie eine andere Uhrzeit – die Liste ist aktualisiert.';
    B.step = 3; B.start = null; renderBooking(); return;
  }
  const st = B.stylist === 'any' ? leastBusy(free, B.date) : free[0];
  const a = {
    id: 'a' + (++S.n), code: genCode(), date: B.date, start: B.start, dur, stylist: st.id, service: svc.id, extras: [...B.extras], price: bPrice(),
    name: B.form.name.trim(), phone: B.form.phone.trim(), email: (B.form.email || '').trim(), note: (B.form.note || '').trim(),
    firstVisit: !!B.form.firstVisit, remind: !!B.form.remind, source: 'online', status: svc.confirm ? 'vorlaeufig' : 'gebucht', createdAt: Date.now(),
  };
  S.appts.push(a);
  save();
  B.step = 'done'; B.done = a.id;
  renderBooking();
  if (isAdmin()) toast(`🔔 <b>Neue ${a.status === 'vorlaeufig' ? 'vorläufige ' : ''}Online-Buchung</b>${a.status === 'vorlaeufig' ? ' · ⏳ Rückruf nötig' : ''}<br>${esc(a.name)} · ${esc(svc.name)}<br>${relDay(a.date)} ${hm(a.start)} bei ${st.name}`);
}
function renderConfirmation() {
  const a = S.appts.find(x => x.id === B.done); if (!a) return startBooking({});
  const svc = svcById(a.service), st = stById(a.stylist);
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('LUNA: ' + svc.name)}&dates=${icsDate(a.date, a.start)}/${icsDate(a.date, a.start + a.dur)}&details=${encodeURIComponent('Buchungscode ' + a.code + ' · bei ' + st.name)}&location=${encodeURIComponent('LUNA Coiffeur & Beauty, Bahnhofstraße 82, 75417 Mühlacker')}`;
  const pend = a.status === 'vorlaeufig', first = esc(a.name.split(' ')[0]);
  $('#bookingBody').innerHTML = `<div class="confirm">
    <div class="ticket">
      ${pend ? '<div class="ok warn">⏳ Vorläufig reserviert – wir rufen Sie an</div>' : '<div class="ok">✓ Termin ist fest gebucht &amp; bestätigt</div>'}
      <p class="muted small" style="margin:0">Ihr Buchungscode</p>
      <div class="code">${a.code}</div>
      <dl class="dl">
        <dt>Leistung</dt><dd>${esc(svc.name)}${a.extras.length ? ' + ' + a.extras.map(x => EXTRAS.find(e => e.id === x).name).join(', ') : ''}</dd>
        <dt>Wann</dt><dd>${fmtDate(a.date, true)}<br>${hm(a.start)} – ${hm(a.start + a.dur)} Uhr</dd>
        <dt>Stylist</dt><dd>${st.name} <span class="muted small">(${st.role})</span></dd>
        <dt>Preis</dt><dd>${pend ? 'ab ' : ''}${eur(a.price)} · ${pend ? 'endgültig nach Beratung' : 'zahlbar vor Ort (bar/Karte)'}</dd>
        ${pend ? `<dt>Status</dt><dd><span class="badge b-warn">VORLÄUFIG</span> Wir melden uns innerhalb von 24 h (werktags) unter ${esc(a.phone)}.</dd>` : ''}
        <dt>Wo</dt><dd>Bahnhofstraße 82, 75417 Mühlacker</dd>
        ${a.note ? `<dt>Ihre Notiz</dt><dd>${esc(a.note)}</dd>` : ''}
      </dl>
      ${pend ? `<div class="notice warn" style="margin-top:18px"><b>Warum ein Anruf?</b> Wie lange eine Farbe dauert, hängt stark von Haarlänge, Dichte und Ausgangsfarbe ab. Im kurzen Telefonat klärt ${st.name} das mit Ihnen und plant die passende Zeit ein. Sie erreichen uns auch selbst: <a href="tel:+4970418281650">07041 8281650</a>.</div>` : ''}
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px">
        <button class="btn btn-gold btn-sm" data-act="ics" data-id="${a.id}">📅 In Kalender eintragen (.ics)</button>
        <a class="btn btn-ghost btn-sm" href="${gcal}" target="_blank" rel="noopener">Google Kalender</a>
        <button class="btn btn-ghost btn-sm" data-act="again">Weiteren Termin buchen</button>
      </div>
    </div>
    <div class="msgs">
      <div class="msg"><div class="msg-h"><span>✉ E-Mail an ${esc(a.email || 'Ihre Adresse')}</span><span class="dstat" data-delay="900">wird gesendet …</span></div>
        ${pend ? `<b>Betreff: Ihre Terminanfrage bei LUNA – ${a.code}</b><br><br>
        Hallo ${first},<br>vielen Dank! Wir haben <b>${fmtDate(a.date, true)}</b> um <b>${hm(a.start)} Uhr</b> bei ${st.name} <b>vorläufig</b> für Sie reserviert.<br>
        Für ${esc(svc.name)} rufen wir Sie kurz an, um die benötigte Zeit abzustimmen. Danach erhalten Sie die feste Bestätigung.<br><br>Ihr LUNA-Team ✂`
        : `<b>Betreff: Ihr Termin bei LUNA ist bestätigt – ${a.code}</b><br><br>
        Hallo ${first},<br>wir freuen uns auf Sie am <b>${fmtDate(a.date, true)}</b> um <b>${hm(a.start)} Uhr</b> bei ${st.name}.<br>
        Leistung: ${esc(svc.name)} (${a.dur} Min., ${eur(a.price)}).<br>Kalendereintrag hängt an. Stornieren kostenlos bis 24 h vorher mit Code ${a.code}.<br><br>Ihr LUNA-Team ✂`}</div>
      <div class="msg sms"><div class="msg-h"><span>💬 SMS an ${esc(a.phone)}</span><span class="dstat" data-delay="1600">wird gesendet …</span></div>
        ${pend ? `LUNA Coiffeur: Danke für Ihre Anfrage! ${relDay(a.date)} ${hm(a.start)} Uhr bei ${st.name} ist vorläufig reserviert. Wir rufen Sie kurz zur Zeitabstimmung an. Code ${a.code}.`
        : `LUNA Coiffeur: Termin bestätigt ✓ ${relDay(a.date)} ${hm(a.start)} Uhr bei ${st.name} (${esc(svc.name)}). Code ${a.code}. ${a.remind ? 'Wir erinnern Sie 24 h vorher.' : ''}`}</div>
      <p class="small dim">Simulation: In der echten Version gehen E-Mail &amp; SMS automatisch raus (z. B. über den Mail-/SMS-Dienst der Kassen- bzw. Buchungssoftware).</p>
    </div></div>`;
  $$('.dstat').forEach(el => setTimeout(() => { el.textContent = 'zugestellt ✓'; el.style.color = 'var(--ok)'; }, +el.dataset.delay));
}
function icsDate(date, min) { return date.replace(/-/g, '') + 'T' + pad(Math.floor(min / 60)) + pad(min % 60) + '00'; }
function downloadIcs(a) {
  const svc = svcById(a.service), st = stById(a.stylist);
  download(`LUNA-Termin-${a.code}.ics`, ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LUNA Demo//DE', 'BEGIN:VEVENT', `UID:${a.code}@luna-demo`,
    `DTSTART;TZID=Europe/Berlin:${icsDate(a.date, a.start)}`, `DTEND;TZID=Europe/Berlin:${icsDate(a.date, a.start + a.dur)}`,
    `SUMMARY:LUNA Coiffeur: ${svc.name}`, `DESCRIPTION:Bei ${st.name} · Buchungscode ${a.code}`, 'LOCATION:Bahnhofstraße 82\\, 75417 Mühlacker',
    'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Termin bei LUNA', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'), 'text/calendar');
}

/* Termin verwalten (Kunde) */
$('#manageForm').addEventListener('submit', e => {
  e.preventDefault();
  const code = $('#manageCode').value.trim().toUpperCase();
  const a = S.appts.find(x => x.code === code);
  const out = $('#manageResult');
  if (!a) { out.innerHTML = '<div class="notice err">Kein Termin mit diesem Code gefunden.</div>'; return; }
  const svc = svcById(a.service), st = stById(a.stylist);
  const stat = { gebucht: 'bestätigt', vorlaeufig: 'vorläufig – wir rufen Sie zur Zeitabstimmung an', erledigt: 'abgeschlossen', storniert: 'storniert', noshow: 'nicht wahrgenommen' }[a.status];
  out.innerHTML = `<div class="notice">${esc(svc.name)} bei ${st.name} · ${fmtDate(a.date, true)}, ${hm(a.start)} Uhr · Status: <b>${stat}</b>
    ${isOpenSt(a) ? ` · <button class="linkbtn" id="cancelMine">Termin stornieren</button>` : ''}</div>`;
  const c = $('#cancelMine');
  if (c) c.onclick = () => { if (!confirm('Termin wirklich stornieren? Der Platz wird sofort wieder freigegeben.')) return; a.status = 'storniert'; a.cancelledAt = Date.now(); save(); out.innerHTML = '<div class="notice">✓ Storniert. Der Platz ist wieder frei. Bis bald!</div>'; if (isAdmin()) toast(`↩ <b>Online-Storno</b>: ${esc(a.name)} · ${relDay(a.date)} ${hm(a.start)}`); };
});

/* ---------- Pflege-Finder ---------- */
const CARE = [
  { id: 'trocken', name: 'Trocken & spröde', tips: ['Feuchtigkeitsmaske 1× pro Woche', 'Hitzeschutz vor jedem Föhnen', 'Lauwarm statt heiß waschen'], svc: 's18' },
  { id: 'color', name: 'Coloriert / blondiert', tips: ['Sulfatfreies Shampoo für Farbglanz', 'Silbershampoo gegen Gelbstich (1×/Woche)', 'Glossing alle 6–8 Wochen'], svc: 's12' },
  { id: 'fein', name: 'Feines Haar', tips: ['Leichte Conditioner nur in die Längen', 'Volumenspray am Ansatz', 'Stufenschnitt für mehr Fülle'], svc: 's1' },
  { id: 'locken', name: 'Locken & Wellen', tips: ['Nicht trocken bürsten – mit Fingern formen', 'Diffusor auf niedriger Stufe', 'Satin-Kissenbezug gegen Frizz'], svc: 's5' },
  { id: 'kopfhaut', name: 'Empfindliche Kopfhaut', tips: ['Mildes, parfumfreies Shampoo', 'Kopfmassage regt die Durchblutung an', 'Farbe nur mit Verträglichkeitstest'], svc: 's18' },
  { id: 'bart', name: 'Bart', tips: ['Bartöl täglich, Bartbalsam zum Formen', 'Konturen alle 2–3 Wochen nachziehen', 'Nach dem Waschen gegen den Strich föhnen'], svc: 's13' },
];
let careSel = 'trocken';
function renderCare() {
  $('#careChips').innerHTML = CARE.map(c => `<button class="chip ${careSel === c.id ? 'active' : ''}" data-care="${c.id}">${c.name}</button>`).join('');
  const c = CARE.find(x => x.id === careSel), s = svcById(c.svc);
  $('#careOut').innerHTML = `<p class="eyebrow">Empfehlung: ${c.name}</p><ul>${c.tips.map(t => `<li>${t}</li>`).join('')}</ul>` + (!s || s.gone ? '' : `
    <p class="small muted">Passende Behandlung: <b class="gold">${esc(s.name)}</b> · ${eur0(s.price)} · ${s.dur} Min.</p>
    <button class="btn btn-ghost btn-sm" data-carebook="${s.id}">Diese Behandlung buchen</button>`);
}
$('#careChips').addEventListener('click', e => { const b = e.target.closest('[data-care]'); if (b) { careSel = b.dataset.care; renderCare(); } });
$('#careOut').addEventListener('click', e => { const b = e.target.closest('[data-carebook]'); if (b) startBooking({ svc: b.dataset.carebook, step: 2 }); });

/* =====================================================================
   INHABER-BEREICH
   ===================================================================== */
// Sitzung: { role: 'owner' } oder { role: 'staff', id }
const sess = () => { try { return JSON.parse(sessionStorage.getItem('luna-sess')); } catch { return null; } };
const isAdmin = () => !!sess();            // irgendein interner Zugang
const isOwner = () => sess()?.role === 'owner';
const me = () => isOwner() ? null : sess()?.id;   // Mitarbeiter-ID (null = Inhaber sieht alles)
const myId = () => me() || OWNER_ID;
const userName = () => stById(myId())?.name || 'Inhaber';
function setSession(v) {
  if (v) sessionStorage.setItem('luna-sess', JSON.stringify(v)); else sessionStorage.removeItem('luna-sess');
  document.body.classList.toggle('is-admin', !!v);
  if (v) { A.tab = v.role === 'owner' ? 'kalender' : 'mein'; renderAdmin(); }
}
$('#loginBtn').onclick = () => loginModal('owner');
function loginModal(mode) {
  const staff = team().filter(st => st.id !== OWNER_ID);
  openModal(`<img src="logo.svg" class="login-logo" alt="LUNA">
    <p class="small muted" style="text-align:center;margin:0 0 8px">Ich bin …</p>
    <div class="seg login-seg"><button data-lm="owner" class="${mode === 'owner' ? 'active' : ''}">◆ Inhaber</button><button data-lm="staff" class="${mode === 'staff' ? 'active' : ''}">✂ Mitarbeiter</button></div>
    ${mode === 'owner' ? `
    <h3 class="h3" style="text-align:center">Inhaber-Login</h3>
    <p class="muted small" style="text-align:center">Alles: Kalender, Rückrufe, Umsätze, Kasse &amp; DATEV, Preise und Mitarbeiter.</p>
    <form id="loginForm">
      <div class="field"><label>E-Mail <span class="dim">(Mitarbeiter: Name)</span></label><input name="u" type="text" autocomplete="username" placeholder="${DEMO_USER}" required></div>
      <div class="field"><label>Passwort <span class="dim">(Mitarbeiter: PIN)</span></label><input name="p" type="password" autocomplete="current-password" placeholder="${DEMO_PW}" required></div>
      <div id="loginErr"></div>
      <button class="btn btn-gold" style="width:100%">Anmelden</button>
    </form>
    <div class="divider">oder</div>
    <button class="btn btn-ghost" style="width:100%" id="demoLogin">◆ Demo als Inhaber (${esc(stById(OWNER_ID).name)}) einloggen</button>
    <p class="small dim" style="text-align:center;margin-top:12px">Demo-Zugang: ${DEMO_USER} / ${DEMO_PW}</p>
    <p class="small muted" style="text-align:center;margin-top:4px">Mitarbeiter? <button class="linkbtn" data-lm="staff">Hier mit Name &amp; PIN anmelden →</button></p>` : `
    <h3 class="h3" style="text-align:center">Mitarbeiter-Login</h3>
    <p class="muted small" style="text-align:center">Eigener Bereich: eigener Kalender, eigene Rückrufe &amp; eigene Zahlen.</p>
    ${staff.length ? `<form id="pinForm">
      <div class="field"><label>Name</label><select name="id">${staff.map(st => `<option value="${st.id}">${esc(st.name)}</option>`).join('')}</select></div>
      <div class="field"><label>PIN (4-stellig)</label><input name="pin" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" required autocomplete="off"></div>
      <div id="loginErr"></div>
      <button class="btn btn-gold" style="width:100%">Anmelden</button>
    </form>
    <div class="divider">Demo</div>
    <div style="display:grid;gap:8px">${staff.map(st => `<button class="btn btn-ghost" data-demost="${st.id}">Als ${esc(st.name)} einloggen <span class="dim small">· PIN ${esc(st.pin)}</span></button>`).join('')}</div>`
    : '<div class="empty">Noch keine Mitarbeiter angelegt.</div>'}`}`);
  $$('[data-lm]').forEach(b => b.onclick = () => loginModal(b.dataset.lm));
  const err = () => $('#loginErr').innerHTML = `<div class="notice err" style="margin-bottom:12px">${mode === 'owner' ? 'E-Mail oder Passwort falsch.' : 'PIN falsch.'}</div>`;
  if (mode === 'owner') {
    $('#loginForm').onsubmit = e => {
      e.preventDefault(); const f = new FormData(e.target);
      const u = f.get('u').trim().toLowerCase(), p = f.get('p').trim();
      if (u === DEMO_USER && p === DEMO_PW) return doLogin({ role: 'owner' });
      // Mitarbeiter dürfen sich auch hier mit Name + PIN anmelden
      const st = team().find(x => x.id !== OWNER_ID && x.name.toLowerCase() === u);
      if (st && st.pin === p) return doLogin({ role: 'staff', id: st.id });
      $('#loginErr').innerHTML = `<div class="notice err" style="margin-bottom:12px">${st ? 'PIN falsch.' : u.includes('@') ? 'E-Mail oder Passwort falsch.' : 'Unbekannter Name. Mitarbeiter: oben „✂ Mitarbeiter“ wählen oder Name + PIN eingeben.'}</div>`;
    };
    $('#demoLogin').onclick = () => doLogin({ role: 'owner' });
  } else if ($('#pinForm')) {
    $('#pinForm').onsubmit = e => {
      e.preventDefault(); const f = new FormData(e.target), st = stById(f.get('id'));
      if (st && !st.gone && st.pin === f.get('pin')) doLogin({ role: 'staff', id: st.id }); else err();
    };
    $$('[data-demost]').forEach(b => b.onclick = () => doLogin({ role: 'staff', id: b.dataset.demost }));
  }
}
function doLogin(v) {
  closeModal(); setSession(v);
  toast(v.role === 'owner' ? '✓ Angemeldet als <b>Inhaber</b> – alle internen Bereiche sind sichtbar.' : `✓ Hallo <b>${esc(stById(v.id).name)}</b> – Ihr persönlicher Bereich ist geöffnet.`);
  setTimeout(() => $('#admin').scrollIntoView({ behavior: 'smooth' }), 50);
}
$('#logoutBtn').onclick = () => { setSession(null); toast('Abgemeldet.'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

const A = { tab: 'kalender', view: 'tag', date: today(), ph: { date: today(), time: null, svc: 's2' }, per: 'monat', datevMonth: null };
const TABS = [
  ['mein', '✂ Mein Tag', 'all'], ['kalender', '📅 Kalender', 'all'], ['rueckruf', '⏳ Rückrufe', 'all'], ['telefon', '📞 Telefon-Check', 'all'],
  ['umsatz', '📈 Umsatz', 'owner'], ['kasse', '🧾 Kasse · DATEV', 'owner'],
  ['preise', '🏷 Preise', 'owner'], ['team', '👥 Mitarbeiter', 'owner'], ['geraete', '💻 Geräte', 'owner'],
];
const pendingList = () => S.appts.filter(a => a.status === 'vorlaeufig' && (!me() || a.stylist === me())).sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);
$('#adminTabs').addEventListener('click', e => {
  const b = e.target.closest('[data-tab]'); if (!b) return;
  A.tab = b.dataset.tab; renderAdmin();
});
function renderAdmin() {
  if (!isAdmin()) return;
  const se = sess();
  if (se.role === 'staff' && (!stById(se.id) || stById(se.id).gone)) { setSession(null); toast('Ihr Zugang wurde vom Inhaber deaktiviert.'); return; }
  const tabs = TABS.filter(t => t[2] === 'all' || isOwner());
  if (!tabs.some(t => t[0] === A.tab)) A.tab = isOwner() ? 'kalender' : 'mein';
  const pn = pendingList().length;
  $('#adminTabs').innerHTML = tabs.map(t => `<button data-tab="${t[0]}" class="${A.tab === t[0] ? 'active' : ''}">${t[1]}${t[0] === 'rueckruf' && pn ? ` <span class="badge b-warn">${pn}</span>` : ''}</button>`).join('');
  $('#adminEyebrow').textContent = isOwner() ? 'Intern · Inhaber-Zugang' : 'Intern · Mitarbeiter-Zugang';
  $('#adminTitle').textContent = isOwner() ? `Inhaber-Bereich · ${stById(OWNER_ID).name}` : `Mein Bereich · ${userName()}`;
  $('#navAdmin').textContent = isOwner() ? '◆ Inhaber-Bereich' : '◆ Mein Bereich';
  const fb = S.fallback && isOwner() ? `<div class="fallback-banner"><span>⚠ <b>iPad-Notbetrieb aktiv</b> – Kassen-PC gestört. Belege werden auf dem iPad mit Cloud-TSE signiert (${S.offline} seit Aktivierung).</span>${A.tab === 'geraete' ? '' : '<button class="btn btn-dark btn-sm" data-goto="geraete">Zum Geräte-Status</button>'}</div>` : '';
  const f = { mein: viewMine, kalender: viewCalendar, rueckruf: viewCallbacks, telefon: viewPhone, umsatz: viewRevenue, kasse: viewKasse, preise: viewPrices, team: viewStaff, geraete: viewDevices }[A.tab];
  $('#adminBody').onclick = null;
  $('#adminBody').onchange = null;
  $('#adminBody').innerHTML = fb + f();
  afterRender[A.tab]?.();
}
const afterRender = {};
$('#adminBody').addEventListener('click', e => {
  const g = e.target.closest('[data-goto]'); if (g) { A.tab = g.dataset.goto; renderAdmin(); }
});

/* ---------- Kalender ---------- */
const PX = 15; // Pixel pro 15 Minuten
function viewCalendar() {
  const d = A.date, w = wd(d);
  const nav = `<div class="toolbar">
    <button class="btn btn-dark btn-sm" data-cal="prev">◀</button><button class="btn btn-dark btn-sm" data-cal="today">Heute</button><button class="btn btn-dark btn-sm" data-cal="next">▶</button>
    <input type="date" id="calDate" value="${d}">
    <span class="cal-title">${A.view === 'tag' ? fmtDate(d, true) : 'Woche ab ' + fmtDate(weekStart(d))}</span>
    <span class="grow"></span>
    <div class="seg"><button data-view="tag" class="${A.view === 'tag' ? 'active' : ''}">Tag</button><button data-view="woche" class="${A.view === 'woche' ? 'active' : ''}">Woche</button></div>
    <button class="btn btn-gold btn-sm" data-quick="1">+ Telefon- / Walk-in-Termin</button></div>`;
  if (A.view === 'woche') return nav + viewWeek();
  const h = HOURS[w];
  if (!h) return nav + '<div class="empty">Sonntag – Salon geschlossen.</div>';
  const H = (h[1] - h[0]) / 15 * PX;
  const day = apptsOn(d).filter(active);
  const cols = (me() ? STYLISTS.filter(st => st.id === me()) : STYLISTS.filter(st => !st.gone || day.some(a => a.stylist === st.id))).map(st => {
    const on = works(st, d);
    const list = day.filter(a => a.stylist === st.id);
    const util = on ? Math.round(list.filter(a => a.status !== 'noshow').reduce((x, a) => x + a.dur, 0) / (h[1] - h[0]) * 100) : 0;
    return { st, on, list, util };
  });
  let lines = ''; for (let m = h[0]; m < h[1]; m += 30) lines += `<div class="cal-line ${m % 60 === 0 ? 'hour' : ''}" style="top:${(m - h[0]) / 15 * PX}px"></div>`;
  let times = ''; for (let m = h[0] + 60; m < h[1]; m += 60) times += `<div style="top:${(m - h[0]) / 15 * PX}px">${hm(m)}</div>`;
  const nowL = d === today() && nowMin() > h[0] && nowMin() < h[1] ? `<div class="now-line" style="top:${(nowMin() - h[0]) / 15 * PX}px"></div>` : '';
  const mine = me() ? day.filter(a => a.stylist === me()) : day;
  const total = mine.filter(a => a.status !== 'noshow'), pendN = mine.filter(a => a.status === 'vorlaeufig').length;
  return nav + `<div class="kpis">
      <div class="kpi"><small>Termine</small><b>${total.length}</b><span class="dim small">${mine.filter(isNew).length ? `<span class="badge">${mine.filter(isNew).length} NEU</span> ` : ''}${pendN ? `<span class="badge b-warn">${pendN} vorläufig</span>` : 'davon online: ' + mine.filter(a => a.source === 'online').length}</span></div>
      <div class="kpi"><small>Geplanter Umsatz</small><b>${eur0(total.reduce((x, a) => x + a.price, 0))}</b><span class="dim small">kassiert: ${eur0(total.filter(a => a.status === 'erledigt').reduce((x, a) => x + a.price, 0))}</span></div>
      <div class="kpi"><small>Auslastung</small><b>${Math.round(cols.filter(c => c.on).reduce((x, c) => x + c.util, 0) / Math.max(1, cols.filter(c => c.on).length))} %</b><span class="dim small">${cols.filter(c => c.on).length} von ${cols.length} im Dienst</span></div>
      <div class="kpi"><small>Öffnungszeit</small><b>${hm(h[0])}–${hm(h[1])}</b><span class="dim small">Klick in freie Fläche = Termin eintragen</span></div></div>
    <div class="cal-wrap"><div class="cal" style="grid-template-columns:56px repeat(${cols.length},minmax(170px,1fr))">
      <div class="cal-h"></div>
      ${cols.map(c => `<div class="cal-h">${avatar(c.st, 1)}<div><b>${c.st.name}${c.st.gone ? ' <span class="badge b-mute">ehem.</span>' : ''}</b><small>${c.on ? `${c.list.length} Termine · ${c.util}% belegt` : 'nicht im Dienst'}</small></div></div>`).join('')}
      <div class="cal-times" style="height:${H}px">${times}</div>
      ${cols.map(c => `<div class="cal-col ${c.on ? '' : 'off'}" data-col="${c.st.id}" style="height:${H}px">${lines}${nowL}
        ${c.list.map(a => apptBlock(a, h[0])).join('')}</div>`).join('')}
    </div></div>
    <div class="cal-legend"><span><i style="background:var(--gold)"></i>Online gebucht</span><span><i style="background:var(--info)"></i>Telefon</span><span><i style="background:#b48ad9"></i>Walk-in</span><span><i style="background:var(--ok)"></i>Kassiert</span><span><i style="background:var(--bad)"></i>Nicht erschienen</span><span><i class="i-pend"></i>Vorläufig · Rückruf offen</span><span><span class="badge">NEU</span> = in den letzten 15 Min. gebucht</span></div>`;
}
function apptBlock(a, open) {
  const svc = svcById(a.service);
  const cls = ['appt', a.status === 'erledigt' ? 'done' : '', a.status === 'noshow' ? 'noshow' : '', a.status === 'vorlaeufig' ? 'pending' : '', 'src-' + a.source, isNew(a) ? 'new' : ''].join(' ');
  return `<div class="${cls}" data-appt="${a.id}" style="top:${(a.start - open) / 15 * PX + 1}px;height:${a.dur / 15 * PX - 2}px"
    data-tip="<b>${esc(esc(a.name))}</b><br>${hm(a.start)}–${hm(a.start + a.dur)} · ${esc(svc.name)}<br>${eur(a.price)} · ${SRC[a.source]}${a.status === 'vorlaeufig' ? '<br>⏳ vorläufig – Rückruf offen' : ''}${a.note ? '<br>📝 ' + esc(esc(a.note)) : ''}">
    <b>${a.status === 'vorlaeufig' ? '⏳ ' : ''}${isNew(a) ? '<span class="badge">NEU</span> ' : ''}${esc(a.name)}</b><span>${hm(a.start)}–${hm(a.start + a.dur)} · ${esc(svc.name)}</span></div>`;
}
function weekStart(d) { const w = wd(d); return addDays(d, w === 0 ? -6 : 1 - w); }
function viewWeek() {
  const ws = weekStart(A.date);
  return `<div class="week">${Array.from({ length: 7 }, (_, i) => {
    const d = addDays(ws, i), h = HOURS[wd(d)];
    const list = apptsOn(d).filter(a => active(a) && a.status !== 'noshow' && (!me() || a.stylist === me())).sort((a, b) => a.start - b.start);
    if (!h) return `<div class="wday"><h5>${fmtDate(d)}</h5><div class="dim small">geschlossen</div></div>`;
    const per = (me() ? team().filter(st => st.id === me()) : team()).filter(st => works(st, d)).map(st => ({ st, u: Math.round(list.filter(a => a.stylist === st.id).reduce((x, a) => x + a.dur, 0) / (h[1] - h[0]) * 100) }));
    const nw = list.filter(isNew).length;
    return `<div class="wday ${d === today() ? 'today' : ''}" data-wday="${d}"><h5><span>${fmtDate(d)}</span><span class="gold">${list.length}</span></h5>
      ${nw ? `<span class="badge">${nw} NEU</span>` : ''}
      ${per.map(p => `<div class="util">${p.st.name} · ${p.u}%<div class="bar"><i style="width:${Math.min(100, p.u)}%"></i></div></div>`).join('')}
      <div class="wlist">${list.slice(0, 4).map(a => `<span>${hm(a.start)} ${esc(a.name)}</span>`).join('')}${list.length > 4 ? `<span>+ ${list.length - 4} weitere</span>` : ''}</div>
      <div class="small gold" style="margin-top:6px">${eur0(list.reduce((x, a) => x + a.price, 0))}</div></div>`;
  }).join('')}</div>`;
}
afterRender.kalender = () => {
  $('#calDate').onchange = e => { A.date = e.target.value || today(); renderAdmin(); };
  const body = $('#adminBody');
  body.onclick = e => {
    const t = e.target;
    const cal = t.closest('[data-cal]'); if (cal) { const step = A.view === 'woche' ? 7 : 1; A.date = cal.dataset.cal === 'today' ? today() : addDays(A.date, cal.dataset.cal === 'next' ? step : -step); return renderAdmin(); }
    const v = t.closest('[data-view]'); if (v) { A.view = v.dataset.view; return renderAdmin(); }
    const wdEl = t.closest('[data-wday]'); if (wdEl) { A.date = wdEl.dataset.wday; A.view = 'tag'; return renderAdmin(); }
    if (t.closest('[data-quick]')) return quickAdd({ date: A.date, stylist: me() || 'any' });
    const ap = t.closest('[data-appt]'); if (ap) return apptModal(ap.dataset.appt);
    const col = t.closest('.cal-col'); if (col && !col.classList.contains('off')) {
      const h = HOURS[wd(A.date)], r = col.getBoundingClientRect();
      const m = h[0] + Math.floor((e.clientY - r.top) / PX) * 15;
      return quickAdd({ date: A.date, stylist: col.dataset.col, start: m });
    }
  };
};

/* Termin-Details */
function apptModal(id) {
  const a = S.appts.find(x => x.id === id), svc = svcById(a.service), st = stById(a.stylist);
  const stat = { gebucht: '<span class="badge b-info">Gebucht</span>', vorlaeufig: '<span class="badge b-warn">Vorläufig</span>', erledigt: '<span class="badge b-ok">Kassiert</span>', noshow: '<span class="badge b-bad">Nicht erschienen</span>', storniert: '<span class="badge b-mute">Storniert</span>' }[a.status];
  openModal(`<p class="eyebrow">Termin ${a.code}</p><h3 class="h3">${esc(a.name)} ${stat}</h3>
    <dl class="dl" style="margin:14px 0 20px">
      <dt>Leistung</dt><dd>${esc(svc.name)}${a.extras.length ? ' + ' + a.extras.map(x => EXTRAS.find(e => e.id === x).name).join(', ') : ''}</dd>
      <dt>Zeit</dt><dd>${fmtDate(a.date, true)}, ${hm(a.start)}–${hm(a.start + a.dur)}</dd>
      <dt>Stylist</dt><dd>${st.name}</dd><dt>Preis</dt><dd>${eur(a.price)}</dd>
      <dt>Telefon</dt><dd><a href="tel:${esc(a.phone)}">${esc(a.phone)}</a></dd>${a.email ? `<dt>E-Mail</dt><dd>${esc(a.email)}</dd>` : ''}
      <dt>Quelle</dt><dd>${SRC[a.source]}${a.createdAt ? ' · ' + new Date(a.createdAt).toLocaleString('de-DE') : ''} · ${a.status === 'vorlaeufig' ? 'wartet auf telefonische Bestätigung' : a.confirmedAt ? `telefonisch bestätigt von ${esc(a.confirmedBy)} (${new Date(a.confirmedAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })})` : a.source === 'online' ? 'automatisch bestätigt' : 'intern eingetragen'}</dd>
      ${a.callNote ? `<dt>Gespräch</dt><dd>☎ ${esc(a.callNote)}</dd>` : ''}${a.cancelReason ? `<dt>Grund</dt><dd>${esc(a.cancelReason)}</dd>` : ''}
      ${a.firstVisit ? '<dt>Hinweis</dt><dd>✨ Erstbesuch</dd>' : ''}${a.note ? `<dt>Notiz</dt><dd>📝 ${esc(a.note)}</dd>` : ''}
      ${a.paid ? `<dt>Bezahlt</dt><dd>${PAY[a.paid.method]} · Bon ${a.paid.no}</dd>` : ''}
    </dl>
    ${a.status === 'vorlaeufig' ? confirmBox(a) : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${a.status === 'vorlaeufig' ? '<button class="btn btn-danger btn-sm" id="mCancel">Absagen / stornieren</button>' : ''}
      ${a.status === 'gebucht' ? `<button class="btn btn-gold btn-sm" id="mPay">🧾 Kassieren</button><button class="btn btn-dark btn-sm" id="mNo">Nicht erschienen</button><button class="btn btn-danger btn-sm" id="mCancel">Stornieren</button>` : ''}
      ${a.paid ? `<button class="btn btn-ghost btn-sm" id="mBon">Beleg anzeigen</button>` : ''}
    </div>`);
  const on = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
  on('#mPay', () => checkout(a.id));
  on('#mNo', () => { a.status = 'noshow'; save(); closeModal(); toast('Als „nicht erschienen“ markiert – Slot wieder frei.'); });
  on('#mCancel', () => { if (confirm('Termin stornieren? Slot wird sofort freigegeben.')) { a.status = 'storniert'; save(); closeModal(); toast('Termin storniert – Slot ist wieder buchbar.'); } });
  on('#mBon', () => showReceipt(a.id));
  if (a.status === 'vorlaeufig') bindConfirm(a);
}
// Rückruf: Stylist klärt am Telefon die Zeit und bestätigt erst dann fest
function confirmBox(a) {
  const durs = []; for (let m = 30; m <= 360; m += 15) durs.push(m);
  const waited = Math.max(1, Math.round((Date.now() - (a.reqAt || a.createdAt || Date.now())) / 36e5));
  return `<div class="confirm-box">
    <p class="eyebrow" style="color:var(--warn)">⏳ Vorläufig · Bestätigung nach Telefonat</p>
    <p class="small muted" style="margin:0 0 12px">Anfrage seit ca. ${waited} Std. Bitte anrufen, Haarlänge, Ausgangsfarbe &amp; Wunsch klären und die nötige Zeit festlegen – erst dann ist der Termin fest.</p>
    <a class="btn btn-ghost btn-sm" href="tel:${esc(a.phone.replace(/\s/g, ''))}" style="margin-bottom:14px">📞 ${esc(a.phone)} anrufen</a>
    ${a.calls ? `<span class="small dim" style="margin-left:8px">${a.calls}× nicht erreicht · zuletzt ${new Date(a.lastCall).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>` : ''}
    <div class="row"><div class="field"><label>Benötigte Zeit (Einschätzung)</label><select id="cDur">${durs.map(m => `<option value="${m}" ${m === a.dur ? 'selected' : ''}>${Math.floor(m / 60) ? Math.floor(m / 60) + ' Std. ' : ''}${m % 60 ? (m % 60) + ' Min.' : ''}</option>`).join('')}</select></div>
    <div class="field"><label>Preis nach Beratung (€)</label><input id="cPrice" type="number" min="0" step="1" value="${a.price}"></div></div>
    <div class="field"><label>Gesprächsnotiz</label><input id="cNote" value="${esc(a.callNote || '')}" placeholder="z. B. schulterlang, dunkelblond, Balayage + Spitzen"></div>
    <div id="cMsg" style="margin-bottom:12px"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-gold btn-sm" id="cOk">✓ Nach Telefonat fest bestätigen</button><button class="btn btn-dark btn-sm" id="cMiss">Nicht erreicht</button></div>
  </div>`;
}
function bindConfirm(a) {
  let move = null;
  const check = () => {
    const dur = +$('#cDur').value, h = HOURS[wd(a.date)], end = a.start + dur;
    const c = conflictOf(a.stylist, a.date, a.start, dur, a.id);
    move = null;
    if (!c && end <= h[1]) { $('#cMsg').innerHTML = `<div class="notice ok">✓ Passt: ${hm(a.start)}–${hm(end)} Uhr bei ${stById(a.stylist).name} ist frei.</div>`; $('#cOk').disabled = false; return; }
    const svc = svcById(a.service);
    const alt = team().filter(st => st.id !== a.stylist && st.cats.includes(svc.cat) && isFree(st, a.date, a.start, dur, true));
    const why = end > h[1] ? `endet nach Ladenschluss (${hm(h[1])})` : `überschneidet sich mit ${hm(c.start)} ${esc(c.name)}`;
    $('#cMsg').innerHTML = `<div class="notice err">✗ ${hm(a.start)}–${hm(end)} ${why}.${alt.length ? ` <br>Frei wäre: ${alt.map(st => `<button class="linkbtn" data-mv="${st.id}">auf ${st.name} umlegen</button>`).join(' · ')}` : ' Bitte kürzere Zeit oder mit der Kundin einen anderen Termin vereinbaren (Absagen + neu eintragen).'}</div>`;
    $('#cOk').disabled = true;
    $$('[data-mv]').forEach(b => b.onclick = () => { move = b.dataset.mv; $('#cMsg').innerHTML = `<div class="notice ok">✓ Wird beim Bestätigen auf <b>${stById(move).name}</b> umgelegt (${hm(a.start)}–${hm(end)}).</div>`; $('#cOk').disabled = false; });
  };
  $('#cDur').onchange = check; check();
  $('#cOk').onclick = () => {
    load(); const x = S.appts.find(y => y.id === a.id); if (!x || x.status !== 'vorlaeufig') { closeModal(); return; }
    x.dur = +$('#cDur').value; x.price = Math.max(0, Math.round(+$('#cPrice').value || x.price));
    x.callNote = $('#cNote').value.trim(); if (move) x.stylist = move;
    if (conflictOf(x.stylist, x.date, x.start, x.dur, x.id)) { toast('⚠ Der Platz wurde inzwischen belegt – bitte neu prüfen.'); return apptModal(x.id); }
    x.status = 'gebucht'; x.confirmedAt = Date.now(); x.confirmedBy = userName();
    save(); closeModal();
    toast(`✓ <b>${esc(x.name)}</b> fest bestätigt · ${relDay(x.date)} ${hm(x.start)}–${hm(x.start + x.dur)} bei ${stById(x.stylist).name}<br><span class="dim">💬 Bestätigungs-SMS an ${esc(x.phone)} gesendet (Simulation)</span>`, 7000);
  };
  $('#cMiss').onclick = () => {
    load(); const x = S.appts.find(y => y.id === a.id); if (!x) return;
    x.calls = (x.calls || 0) + 1; x.lastCall = Date.now(); save();
    toast(`📵 Nicht erreicht – notiert. 💬 SMS an ${esc(x.phone)}: „Bitte rufen Sie uns kurz zurück: 07041 8281650“ (Simulation)`);
    apptModal(x.id);
  };
}

/* Telefon-/Walk-in-Termin eintragen */
function quickAdd(o = {}) {
  const q = { type: 'telefon', svc: firstSvc('s2'), stylist: 'any', date: today(), start: null, ...o };
  if (q.stylist !== 'any' && !team().some(st => st.id === q.stylist)) q.stylist = 'any';
  if (q.type === 'walkin') { q.date = today(); q.start = Math.floor(nowMin() / 15) * 15; }
  const times = () => { const h = HOURS[wd(q.date)]; if (!h) return []; const r = []; for (let m = h[0]; m < h[1]; m += 15) r.push(m); return r; };
  if (q.start == null) { const t = times(); q.start = t.find(m => q.date !== today() || m >= nowMin()) ?? t[0]; }
  openModal(`<p class="eyebrow">Intern eintragen</p><h3 class="h3">Telefon- / Walk-in-Termin</h3>
    <form id="qForm">
      <div class="seg" style="margin-bottom:16px"><button type="button" data-qt="telefon">📞 Telefon</button><button type="button" data-qt="walkin">🚶 Walk-in (jetzt)</button></div>
      <div class="row"><div class="field"><label>Leistung</label><select name="svc">${svcs().map(s => `<option value="${s.id}">${esc(s.name)} (${s.dur} Min.)</option>`).join('')}</select></div>
      <div class="field"><label>Stylist</label><select name="stylist"><option value="any">Egal – wer frei ist</option>${team().map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div></div>
      <div class="row"><div class="field"><label>Datum</label><input type="date" name="date" min="${today()}"></div>
      <div class="field"><label>Uhrzeit</label><select name="start"></select></div></div>
      <div id="qAvail" style="margin-bottom:14px"></div>
      <div class="row"><div class="field"><label>Name *</label><input name="name" required placeholder="z. B. Frau Kaya"></div>
      <div class="field"><label>Telefon</label><input name="phone" type="tel"></div></div>
      <div class="field"><label>Notiz</label><input name="note" placeholder="optional"></div>
      <p class="small dim" style="margin:-4px 0 12px">Telefonisch vereinbarte Termine (auch Farbe) gelten direkt als fest – das Gespräch hat ja schon stattgefunden.</p>
      <button class="btn btn-gold" style="width:100%" id="qSave">Termin eintragen &amp; Slot sperren</button>
    </form>`);
  const f = $('#qForm');
  const sync = () => {
    $$('[data-qt]').forEach(b => b.classList.toggle('active', b.dataset.qt === q.type));
    f.svc.value = q.svc; f.stylist.value = q.stylist; f.date.value = q.date;
    f.start.innerHTML = times().map(m => `<option value="${m}">${hm(m)}</option>`).join('') || '<option>geschlossen</option>';
    f.start.value = q.start;
    const svc = svcById(q.svc);
    const able = team().filter(st => (q.stylist === 'any' || st.id === q.stylist));
    const rows = able.map(st => {
      if (!works(st, q.date)) return `<span class="dim">${st.name}: nicht im Dienst</span>`;
      if (!st.cats.includes(svc.cat)) return `<span class="dim">${st.name}: bietet Leistung nicht an</span>`;
      const c = conflictOf(st.id, q.date, q.start, svc.dur);
      if (c) return `<span style="color:var(--bad)">✗ ${st.name}: belegt (${hm(c.start)}–${hm(c.start + c.dur)} ${esc(c.name)})</span>`;
      return isFree(st, q.date, q.start, svc.dur, true) ? `<span style="color:var(--ok)">✓ ${st.name}: frei</span>` : `<span class="dim">${st.name}: außerhalb Öffnungszeit</span>`;
    });
    const free = freeStylists(svc, q.date, q.start, svc.dur, q.stylist, true);
    $('#qAvail').innerHTML = `<div class="notice ${free.length ? '' : 'err'}">${rows.join('<br>')}</div>`;
    $('#qSave').disabled = !free.length;
  };
  f.addEventListener('change', e => {
    const n = e.target.name; if (!n) return;
    q[n] = n === 'start' ? +e.target.value : e.target.value;
    if (n === 'date') { const t = times(); q.start = t.includes(q.start) ? q.start : t[0]; }
    sync();
  });
  $$('[data-qt]').forEach(b => b.onclick = () => { q.type = b.dataset.qt; if (q.type === 'walkin') { q.date = today(); q.start = Math.floor(nowMin() / 15) * 15; } sync(); });
  f.onsubmit = e => {
    e.preventDefault();
    const svc = svcById(q.svc); load();
    const free = freeStylists(svc, q.date, q.start, svc.dur, q.stylist, true);
    if (!free.length) { sync(); return; }
    const st = q.stylist === 'any' ? leastBusy(free, q.date) : free[0];
    S.appts.push({ id: 'a' + (++S.n), code: genCode(), date: q.date, start: q.start, dur: svc.dur, stylist: st.id, service: svc.id, extras: [], price: svc.price,
      name: f.elements.name.value.trim(), phone: f.elements.phone.value.trim(), email: '', note: f.elements.note.value.trim(), source: q.type, status: 'gebucht', createdAt: Date.now() });
    const who = f.elements.name.value;
    save(); closeModal();
    toast(`✓ ${q.type === 'walkin' ? 'Walk-in' : 'Telefontermin'} eingetragen: <b>${esc(who)}</b> · ${relDay(q.date)} ${hm(q.start)} bei ${st.name}. Online ist der Slot ab sofort gesperrt.`);
  };
  sync();
}

/* ---------- Telefon-Check ---------- */
function viewPhone() {
  const p = A.ph, h = HOURS[wd(p.date)];
  p.svc = firstSvc(p.svc);
  const times = []; if (h) for (let m = h[0]; m < h[1]; m += 15) times.push(m);
  if (p.time == null || !times.includes(p.time)) p.time = times.find(m => p.date !== today() || m >= Math.ceil(nowMin() / 15) * 15) ?? times[0];
  const svc = svcById(p.svc);
  let rows = '', freeN = 0;
  for (const st of team()) {
    let cls = 'off', status = '–', detail = '', btn = '';
    if (!h || !works(st, p.date)) { status = 'Nicht im Dienst'; }
    else if (!st.cats.includes(svc.cat)) { status = 'Bietet Leistung nicht an'; }
    else {
      const c = conflictOf(st.id, p.date, p.time, svc.dur);
      if (c) { cls = 'busy'; status = '✗ Belegt'; detail = `${hm(c.start)}–${hm(c.start + c.dur)} · ${esc(c.name)} · ${esc(svcById(c.service).name)} <span class="badge b-mute">${SRC[c.source]}</span>`; }
      else if (isFree(st, p.date, p.time, svc.dur, true)) { cls = 'free'; status = '✓ Frei'; freeN++; detail = `bis ${hm(nextBusy(st.id, p.date, p.time) ?? h[1])} Uhr durchgehend frei`; btn = `<button class="btn btn-gold btn-sm" data-phbook="${st.id}">Eintragen</button>`; }
      else { status = 'Passt nicht in Öffnungszeit'; }
    }
    rows += `<div class="st-row ${cls}">${avatar(st, 1)}<div class="grow"><b>${st.name}</b><div class="small muted">${detail || st.role}</div></div><span class="status ${cls}">${status}</span>${btn}</div>`;
  }
  const alts = h ? daySlots(svc, svc.dur, p.date, 'any').filter(s => s.free.length && (p.date !== today() || s.start >= nowMin())) : [];
  const recent = S.appts.filter(a => a.createdAt).sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
  return `<div class="grid2">
    <div class="panel">
      <h4>📞 Anrufer fragt nach … <span class="small dim" style="text-transform:none;letter-spacing:0">Ergebnis sofort, ohne Speichern</span></h4>
      <div class="row" style="grid-template-columns:1fr 1fr 1.4fr">
        <div class="field"><label>Datum</label><input type="date" id="phDate" value="${p.date}" min="${today()}"></div>
        <div class="field"><label>Uhrzeit</label><select id="phTime">${times.map(m => `<option value="${m}" ${m === p.time ? 'selected' : ''}>${hm(m)}</option>`).join('') || '<option>geschlossen</option>'}</select></div>
        <div class="field"><label>Leistung</label><select id="phSvc">${svcs().map(s => `<option value="${s.id}" ${s.id === p.svc ? 'selected' : ''}>${esc(s.name)} (${s.dur}′)</option>`).join('')}</select></div>
      </div>
      <p class="big-answer" style="color:${freeN ? 'var(--ok)' : 'var(--bad)'}">${!h ? 'Geschlossen' : freeN ? `Ja – ${freeN} ${freeN > 1 ? 'Stylisten' : 'Stylist'} frei` : 'Leider belegt'}</p>
      <p class="muted small">${fmtDate(p.date, true)}, ${p.time != null ? hm(p.time) : ''} Uhr · ${esc(svc.name)} (${svc.dur} Min.)</p>
      <div class="phone-result">${rows}</div>
      ${alts.length ? `<div class="subhead">Alternativen an diesem Tag</div><div class="chips">${alts.slice(0, 14).map(s => `<button class="chip" data-phalt="${s.start}">${hm(s.start)} · ${s.free.map(x => x.name).join('/')}</button>`).join('')}</div>` : ''}
    </div>
    <div class="panel">
      <h4>🔔 Live-Eingang <span class="chart-legend"><span><span class="live-dot" style="display:inline-block"></span>&nbsp;synchron in allen Fenstern</span></span></h4>
      <div class="feed">${recent.length ? recent.map(a => `<div class="feed-item ${isNew(a) ? 'new' : ''}" data-appt="${a.id}" style="cursor:pointer">
        <span>${a.status === 'storniert' ? '↩' : a.status === 'vorlaeufig' ? '⏳' : a.source === 'online' ? '🌐' : a.source === 'telefon' ? '📞' : '🚶'}</span>
        <div><b>${esc(a.name)}</b> ${isNew(a) ? '<span class="badge">NEU</span>' : ''} ${a.status === 'storniert' ? '<span class="badge b-mute">storniert</span>' : ''}<br>
        <span class="muted">${esc(svcById(a.service).name)} · ${relDay(a.date)} ${hm(a.start)} · ${stById(a.stylist).name}</span><br>
        <span class="dim small">${SRC[a.source]} · ${new Date(a.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · ${a.status === 'vorlaeufig' ? '<span style="color:var(--warn)">wartet auf Rückruf</span>' : a.confirmedAt ? 'nach Telefonat bestätigt' : 'automatisch bestätigt'}</span></div></div>`).join('')
        : `<div class="empty">Noch keine neuen Buchungen in dieser Sitzung.<br><br><b>Testen:</b> Oben im Kundenbereich einen Termin buchen – oder <button class="linkbtn" id="openSecond">zweites Fenster öffnen</button> und dort buchen. Die Buchung erscheint hier sofort.</div>`}</div>
    </div></div>`;
}
function nextBusy(stId, date, from) {
  const l = apptsOn(date).filter(a => a.stylist === stId && active(a) && a.status !== 'noshow' && a.start >= from).sort((a, b) => a.start - b.start);
  return l[0]?.start;
}
afterRender.telefon = () => {
  $('#phDate').onchange = e => { A.ph.date = e.target.value || today(); A.ph.time = null; renderAdmin(); };
  $('#phTime').onchange = e => { A.ph.time = +e.target.value; renderAdmin(); };
  $('#phSvc').onchange = e => { A.ph.svc = e.target.value; renderAdmin(); };
  $('#adminBody').onclick = e => {
    const b = e.target.closest('[data-phbook]'); if (b) return quickAdd({ date: A.ph.date, start: A.ph.time, svc: A.ph.svc, stylist: b.dataset.phbook });
    const al = e.target.closest('[data-phalt]'); if (al) { A.ph.time = +al.dataset.phalt; return renderAdmin(); }
    const ap = e.target.closest('[data-appt]'); if (ap) return apptModal(ap.dataset.appt);
    if (e.target.id === 'openSecond') window.open(location.href.split('#')[0] + '#buchen', '_blank');
  };
};

/* ---------- Umsatz & Team ---------- */
const done = a => a.status === 'erledigt';
const sum = l => l.reduce((x, a) => x + a.price, 0);
function inMonth(m, uptoDay) { return S.appts.filter(a => done(a) && ym(a.date) === m && (!uptoDay || +a.date.slice(8) <= uptoDay)); }
function viewRevenue() {
  const t = today(), cm = ym(t), pm = prevYm(cm), dNow = +t.slice(8);
  const cur = inMonth(cm), prevFull = inMonth(pm);
  // fairer Vergleich: abgeschlossene Tage (1. bis gestern) beider Monate
  const cmpDay = Math.max(1, dNow - 1), curCmp = inMonth(cm, cmpDay), prevSame = inMonth(pm, cmpDay);
  const all = S.appts.filter(done);
  const first = S.appts.reduce((m, a) => a.date < m ? a.date : m, t);
  const todayL = all.filter(a => a.date === t);
  const upcoming = S.appts.filter(a => a.status === 'gebucht' && a.date >= t && a.date <= addDays(t, 14));
  const dPct = prevSame.length ? (sum(curCmp) / sum(prevSame) - 1) * 100 : 0;
  const delta = (v, txt) => `<span class="delta ${v >= 0 ? 'up' : 'down'}">${v >= 0 ? '▲' : '▼'} ${Math.abs(v).toFixed(1).replace('.', ',')} %</span> <span class="dim small">${txt}</span>`;
  const avgC = curCmp.length ? sum(curCmp) / curCmp.length : 0, avgP = prevSame.length ? sum(prevSame) / prevSame.length : 0;

  // 6 Monate
  const months = []; let m = cm; for (let i = 0; i < 6; i++) { months.unshift(m); m = prevYm(m); }
  const [cy, cmo] = cm.split('-').map(Number), dim = daysInMonth(cy, cmo - 1);
  const mData = months.map(x => ({ m: x, v: sum(inMonth(x)), partial: x === cm }));
  const forecast = sum(cur) / dNow * dim;

  // Mitarbeiter
  const per = A.per;
  const pool = per === 'monat' ? cur : per === 'vormonat' ? prevFull : all;
  const tot = sum(pool) || 1;
  const staff = STYLISTS.filter(st => !st.gone || pool.some(a => a.stylist === st.id)).map(st => {
    const l = pool.filter(a => a.stylist === st.id), cmp = prevSame.filter(a => a.stylist === st.id), cc = curCmp.filter(a => a.stylist === st.id);
    return { st, n: l.length, v: sum(l), avg: l.length ? sum(l) / l.length : 0, d: per === 'monat' && sum(cmp) ? (sum(cc) / sum(cmp) - 1) * 100 : null };
  }).sort((a, b) => b.v - a.v);
  const cats = CATS.map(c => ({ c, v: sum(pool.filter(a => svcById(a.service).cat === c.id)) })).sort((a, b) => b.v - a.v);
  const top = SERVICES.map(s => ({ s, l: pool.filter(a => a.service === s.id) })).filter(x => x.l.length).sort((a, b) => sum(b.l) - sum(a.l)).slice(0, 6);
  const maxCat = Math.max(...cats.map(x => x.v), 1);
  const perLbl = { monat: ymLabel(cm) + ' (bis heute)', vormonat: ymLabel(pm), gesamt: 'Gesamt seit ' + fmtDate(first) + first.slice(0, 4) };

  return `<div class="kpis">
    <div class="kpi hl"><small>Monatsumsatz ${MON[cmo - 1]} (bis heute)</small><b>${eur0(sum(cur))}</b>${delta(dPct, `1.–${cmpDay}. vs. ${MON[+pm.slice(5) - 1]} 1.–${cmpDay}.`)}</div>
    <div class="kpi"><small>Vormonat ${MON[+pm.slice(5) - 1]} gesamt</small><b>${eur0(sum(prevFull))}</b><span class="dim small">bis zum ${cmpDay}.: ${eur0(sum(prevSame))}</span></div>
    <div class="kpi"><small>Gesamtumsatz</small><b>${eur0(sum(all))}</b><span class="dim small">seit ${fmtDate(first)}${first.slice(0, 4)} · ${num(all.length)} Behandlungen</span></div>
    <div class="kpi"><small>Umsatz heute</small><b>${eur0(sum(todayL))}</b><span class="dim small">${todayL.length} kassiert · ${S.appts.filter(a => a.date === t && a.status === 'gebucht').length} offen</span></div>
    <div class="kpi"><small>Ø Bon (Monat)</small><b>${eur(avgC)}</b>${delta(avgP ? (avgC / avgP - 1) * 100 : 0, 'vs. Vormonat')}</div>
    <div class="kpi"><small>Behandlungen (Monat)</small><b>${cur.length}</b>${delta(prevSame.length ? (curCmp.length / prevSame.length - 1) * 100 : 0, 'vs. Vormonat')}</div>
    <div class="kpi"><small>Prognose ${MON[cmo - 1]}</small><b>${eur0(forecast)}</b><span class="dim small">bei aktuellem Tempo</span></div>
    <div class="kpi"><small>Gebucht, nächste 14 Tage</small><b>${eur0(sum(upcoming))}</b><span class="dim small">${upcoming.length} Termine · ${upcoming.filter(a => a.source === 'online').length} online</span></div>
  </div>
  <div class="grid2">
    <div class="panel"><h4>Kumulierter Umsatz · ${MON[cmo - 1]} vs. ${MON[+pm.slice(5) - 1]}
      <span class="chart-legend"><span><i style="background:${C_CUR}"></i>${MON[cmo - 1]}</span><span><i style="background:${C_PREV}"></i>${MON[+pm.slice(5) - 1]}</span></span></h4>
      <div id="cumChart"></div></div>
    <div class="panel"><h4>Monatsumsatz · letzte 6 Monate</h4>${barChart(mData, forecast)}</div>
  </div>
  <div class="panel" style="margin-top:16px">
    <h4>Umsatz pro Mitarbeiter · ${perLbl[per]}
      <span class="seg"><button data-per="monat" class="${per === 'monat' ? 'active' : ''}">Dieser Monat</button><button data-per="vormonat" class="${per === 'vormonat' ? 'active' : ''}">Vormonat</button><button data-per="gesamt" class="${per === 'gesamt' ? 'active' : ''}">Gesamt</button></span></h4>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mitarbeiter</th><th class="num">Behandlungen</th><th class="num">Umsatz</th><th class="num">Ø pro Behandlung</th><th style="width:28%">Anteil</th>${per === 'monat' ? '<th class="num">vs. Vormonat</th>' : ''}</tr></thead>
    <tbody>${staff.map(x => `<tr><td><span class="who">${avatar(x.st, 1)}<span><b>${x.st.name}</b><br><span class="small dim">${x.st.role}${x.st.gone ? ' · ausgeschieden' : ''}</span></span></span></td>
      <td class="num">${x.n}</td><td class="num"><b>${eur(x.v)}</b></td><td class="num">${eur(x.avg)}</td>
      <td><div class="bar" style="height:8px" data-tip="${x.st.name}: ${eur(x.v)} (${(x.v / tot * 100).toFixed(1)} %)"><i style="width:${x.v / tot * 100}%;background:${C_CUR}"></i></div><span class="small dim">${(x.v / tot * 100).toFixed(1).replace('.', ',')} %</span></td>
      ${per === 'monat' ? `<td class="num">${x.d == null ? '–' : `<span class="delta ${x.d >= 0 ? 'up' : 'down'}">${x.d >= 0 ? '▲' : '▼'} ${Math.abs(x.d).toFixed(1).replace('.', ',')} %</span>`}</td>` : ''}</tr>`).join('')}
      <tr><td><b>Gesamt</b></td><td class="num"><b>${pool.length}</b></td><td class="num"><b class="gold">${eur(sum(pool))}</b></td><td class="num">${eur(pool.length ? sum(pool) / pool.length : 0)}</td><td></td>${per === 'monat' ? '<td></td>' : ''}</tr>
    </tbody></table></div>
  </div>
  <div class="grid2" style="margin-top:16px">
    <div class="panel"><h4>Umsatz nach Kategorie · ${perLbl[per]}</h4>
      ${cats.map(x => `<div style="margin-bottom:12px" data-tip="${x.c.name}: ${eur(x.v)}"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${x.c.name}</span><b>${eur0(x.v)}</b></div><div class="bar" style="height:8px"><i style="width:${x.v / maxCat * 100}%;background:${C_CUR}"></i></div></div>`).join('')}</div>
    <div class="panel"><h4>Top-Leistungen · ${perLbl[per]}</h4><table class="tbl"><thead><tr><th>Leistung</th><th class="num">Anzahl</th><th class="num">Umsatz</th></tr></thead>
      <tbody>${top.map(x => `<tr><td>${esc(x.s.name)}</td><td class="num">${x.l.length}</td><td class="num">${eur0(sum(x.l))}</td></tr>`).join('')}</tbody></table></div>
  </div>`;
}
function barChart(data, forecast) {
  const W = 560, H = 230, L = 52, B = 26, T = 18, maxV = Math.max(...data.map(d => d.v), forecast) * 1.1;
  const bw = (W - L) / data.length, y = v => T + (H - T - B) * (1 - v / maxV);
  const ticks = niceTicks(maxV);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Monatsumsatz letzte 6 Monate">`;
  ticks.forEach(v => { s += `<line class="grid" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v / 1000} T€</text>`; });
  data.forEach((d, i) => {
    const x = L + i * bw + bw * 0.22, w = bw * 0.56;
    if (d.partial) s += `<rect x="${x}" y="${y(forecast)}" width="${w}" height="${y(d.v) - y(forecast)}" fill="none" stroke="${C_CUR}" stroke-dasharray="4 3" rx="4" data-tip="Prognose ${ymLabel(d.m)}: ${eur0(forecast)}"/>`;
    s += `<path d="M${x} ${H - B} V${y(d.v) + 4} q0 -4 4 -4 h${w - 8} q4 0 4 4 V${H - B} Z" fill="${C_CUR}" opacity="${d.partial ? 1 : .75}" data-tip="<b>${ymLabel(d.m)}</b><br>${eur(d.v)}${d.partial ? ' (bis heute)' : ''}"/>`;
    s += `<text x="${x + w / 2}" y="${y(d.partial ? forecast : d.v) - 6}" text-anchor="middle" class="lbl">${(d.v / 1000).toFixed(1).replace('.', ',')} T</text>`;
    s += `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle">${MON[+d.m.slice(5) - 1].slice(0, 3)}${d.partial ? '*' : ''}</text>`;
  });
  return s + `</svg><p class="small dim" style="margin:6px 0 0">* laufender Monat · gestrichelt = Prognose bei aktuellem Tempo</p>`;
}
function niceTicks(max) { const step = [1000, 2000, 5000, 10000, 20000].find(s => max / s <= 5) || 50000; const r = []; for (let v = 0; v <= max; v += step) r.push(v); return r; }
afterRender.umsatz = () => {
  $('#adminBody').onclick = e => { const b = e.target.closest('[data-per]'); if (b) { A.per = b.dataset.per; renderAdmin(); } };
  // Kumulierte Linien mit Fadenkreuz-Tooltip
  const t = today(), cm = ym(t), pm = prevYm(cm), dNow = +t.slice(8);
  const [py, pmo] = pm.split('-').map(Number), [cy, cmo] = cm.split('-').map(Number);
  const dimP = daysInMonth(py, pmo - 1), dimC = daysInMonth(cy, cmo - 1), days = Math.max(dimP, dimC);
  const cum = (m, n) => { const l = inMonth(m); let acc = 0; return Array.from({ length: n }, (_, i) => (acc += sum(l.filter(a => +a.date.slice(8) === i + 1)))); };
  const P = cum(pm, dimP), C = cum(cm, dNow);
  const W = 560, H = 230, L = 52, R = 70, B = 26, T = 14, maxV = Math.max(P[P.length - 1], C[C.length - 1]) * 1.08;
  const x = d => L + (W - L - R) * (d - 1) / (days - 1), y = v => T + (H - T - B) * (1 - v / maxV);
  const path = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i + 1).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" id="cumSvg" role="img" aria-label="Kumulierter Umsatz">`;
  niceTicks(maxV).forEach(v => { s += `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v / 1000} T€</text>`; });
  [1, 8, 15, 22, days].forEach(d => { s += `<text x="${x(d)}" y="${H - 8}" text-anchor="middle">${d}.</text>`; });
  s += `<path d="${path(P)}" fill="none" stroke="${C_PREV}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += `<path d="${path(C)}" fill="none" stroke="${C_CUR}" stroke-width="2.5"/>`;
  s += `<circle cx="${x(dNow)}" cy="${y(C[dNow - 1])}" r="4.5" fill="${C_CUR}" stroke="#121214" stroke-width="2"/>`;
  s += `<text x="${x(dimP) + 6}" y="${y(P[dimP - 1]) + 4}" class="lbl">${MON[pmo - 1].slice(0, 3)} ${(P[dimP - 1] / 1000).toFixed(1).replace('.', ',')} T</text>`;
  s += `<text x="${x(dNow) + 8}" y="${y(C[dNow - 1]) + 4}" class="lbl">${MON[cmo - 1].slice(0, 3)} ${(C[dNow - 1] / 1000).toFixed(1).replace('.', ',')} T</text>`;
  s += `<line id="cross" y1="${T}" y2="${H - B}" stroke="rgba(255,255,255,.3)" visibility="hidden"/><rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent" id="cumHit"/></svg>`;
  $('#cumChart').innerHTML = s;
  const svg = $('#cumSvg'), hit = $('#cumHit'), cross = $('#cross');
  hit.addEventListener('mousemove', e => {
    const r = svg.getBoundingClientRect(), sx = (e.clientX - r.left) / r.width * W;
    const d = Math.min(days, Math.max(1, Math.round((sx - L) / (W - L - R) * (days - 1) + 1)));
    cross.setAttribute('x1', x(d)); cross.setAttribute('x2', x(d)); cross.setAttribute('visibility', 'visible');
    tip.dataset.lock = 1; tip.hidden = false;
    tip.innerHTML = `<b>bis zum ${d}.</b><br><span style="color:${C_CUR}">━</span> ${MON[cmo - 1]}: ${d <= dNow ? eur0(C[d - 1]) : '–'}<br><span style="color:${C_PREV}">┅</span> ${MON[pmo - 1]}: ${d <= dimP ? eur0(P[d - 1]) : '–'}`;
    placeTip(e.clientX, e.clientY);
  });
  hit.addEventListener('mouseleave', () => { cross.setAttribute('visibility', 'hidden'); delete tip.dataset.lock; tip.hidden = true; });
};

/* ---------- Kasse, TSE, DATEV ---------- */
function viewKasse() {
  const t = today();
  const open = S.appts.filter(a => a.date === t && a.status === 'gebucht').sort((a, b) => a.start - b.start);
  const paid = S.appts.filter(a => a.date === t && a.status === 'erledigt').sort((a, b) => b.start - a.start);
  const months = []; let m = ym(t); for (let i = 0; i < 6; i++) { months.push(m); m = prevYm(m); }
  A.datevMonth ||= prevYm(ym(t));
  const rows = datevRows(A.datevMonth);
  const brutto = rows.reduce((x, r) => x + r.amount, 0), netto = brutto / 1.19;
  const last = S.datevLog[0];
  return `<div class="grid3">
    <div class="panel sys"><div class="sys-h"><h5>helloCash Friseursalon</h5><span class="badge b-warn">Einrichtung · Demo</span></div>
      <p class="small muted" style="margin:0">Geplante Kassenlösung: cloudbasiert, läuft im Browser auf PC, Mac und als App auf dem iPad.</p>
      <ul class="checklist"><li><span class="c-ok">✓</span>Konto &amp; Stammdaten angelegt</li><li><span class="c-ok">✓</span>${svcs().length} Leistungen + Preise importiert</li><li><span class="c-ok">✓</span>${team().length} Mitarbeiter mit eigener PIN</li><li><span class="c-ok">✓</span>Termine → Kassenvorgang (Schnittstelle)</li><li><span class="c-wait">◷</span>Kartenterminal (ZVT) koppeln</li><li><span class="c-wait">◷</span>Bondrucker Epson TM-m30 einrichten</li></ul>
      <button class="btn btn-dark btn-sm" id="hcTest">Verbindung testen</button><div id="hcOut" class="small"></div></div>
    <div class="panel sys"><div class="sys-h"><h5>TSE · KassenSichV</h5><span class="badge b-ok">● aktiv</span></div>
      <dl class="kv"><dt>Typ</dt><dd>Cloud-TSE (in helloCash enthalten)</dd><dt>Seriennr.</dt><dd>${hexOf(42, 32).slice(0, 24)}…</dd><dt>Signaturzähler</dt><dd>${num(S.tse)}</dd><dt>Zertifikat</dt><dd>gültig bis 31.12.2031</dd><dt>Kasse</dt><dd>${S.fallback ? 'iPad-Fallback (Kasse 2)' : 'Kassen-PC (Kasse 1)'}</dd></dl>
      <ul class="checklist"><li><span class="c-ok">✓</span>Belegausgabe bei jedem Vorgang</li><li><span class="c-ok">✓</span>Kasse ans Finanzamt gemeldet (ELSTER, § 146a AO)</li><li><span class="c-ok">✓</span>DSFinV-K-Export für Prüfungen</li></ul>
      <button class="btn btn-dark btn-sm" id="dsfinv">DSFinV-K-Export (Demo)</button></div>
    <div class="panel sys"><div class="sys-h"><h5>DATEV · Steuerberater</h5><span class="badge b-ok">bereit</span></div>
      <dl class="kv"><dt>Empfänger</dt><dd>${STEUERBERATER}</dd><dt>Format</dt><dd>DATEV-Buchungsstapel (EXTF), SKR03</dd><dt>Konten</dt><dd>1000 Kasse · 1360 Geldtransit · 8400 Erlöse 19 %</dd><dt>Rhythmus</dt><dd>monatlich bis zum 5.</dd><dt>Letzter Versand</dt><dd>${last ? `${ymLabel(last.month)} · ${fmtDate(last.at)}` : '—'}</dd></dl>
      <button class="btn btn-ghost btn-sm" data-goto-datev="1">Zum Export ↓</button></div>
  </div>
  <div class="grid2" style="margin-top:16px">
    <div class="panel"><h4>Heute kassieren <span class="small dim" style="text-transform:none;letter-spacing:0">${open.length} offen</span></h4>
      ${open.length ? `<table class="tbl"><tbody>${open.map(a => `<tr><td>${hm(a.start)}</td><td><b>${esc(a.name)}</b><br><span class="small dim">${esc(svcById(a.service).name)} · ${stById(a.stylist).name}</span></td><td class="num">${eur(a.price)}</td><td class="num"><button class="btn btn-gold btn-sm" data-pay="${a.id}">Kassieren</button></td></tr>`).join('')}</tbody></table>` : '<div class="empty">Keine offenen Termine heute.</div>'}
    </div>
    <div class="panel"><h4>Belege heute <button class="btn btn-dark btn-sm" id="zbon">Tagesabschluss (Z-Bon)</button></h4>
      ${paid.length ? `<div class="tbl-wrap" style="max-height:330px;overflow:auto"><table class="tbl"><tbody>${paid.map(a => `<tr><td class="small dim">#${a.paid.no}</td><td>${esc(a.name)}<br><span class="small dim">${esc(svcById(a.service).name)}</span></td><td>${PAY[a.paid.method]}${a.paid.offline ? ' <span class="badge b-warn">iPad</span>' : ''}</td><td class="num">${eur(a.price)}</td><td class="num"><button class="btn btn-dark btn-sm" data-bon="${a.id}">Beleg</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">Heute noch nichts kassiert.</div>'}
    </div>
  </div>
  <div class="panel" style="margin-top:16px" id="datevPanel">
    <h4>DATEV-Export für den Steuerberater
      <select id="datevMonth" style="width:auto">${months.map(x => `<option value="${x}" ${x === A.datevMonth ? 'selected' : ''}>${ymLabel(x)}${x === ym(t) ? ' (laufend)' : ''}</option>`).join('')}</select></h4>
    <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi"><small>Buchungen</small><b>${num(rows.length)}</b></div>
      <div class="kpi"><small>Umsatz brutto</small><b>${eur0(brutto)}</b></div>
      <div class="kpi"><small>netto / USt 19 %</small><b>${eur0(netto)}</b><span class="dim small">USt: ${eur(brutto - netto)}</span></div>
      <div class="kpi"><small>Bar-Anteil</small><b>${Math.round(rows.filter(r => r.method === 'bar').reduce((x, r) => x + r.amount, 0) / (brutto || 1) * 100)} %</b><span class="dim small">Karte: ${eur0(rows.filter(r => r.method !== 'bar').reduce((x, r) => x + r.amount, 0))}</span></div>
    </div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Belegdatum</th><th>Beleg</th><th>Buchungstext</th><th>Konto</th><th>Gegenkonto</th><th class="num">Umsatz</th></tr></thead>
      <tbody>${rows.slice(0, 6).map(r => `<tr><td>${fmtDate(r.date)}</td><td>${r.no}</td><td>${esc(r.text)}</td><td>${r.konto}</td><td>8400</td><td class="num">${eur(r.amount)}</td></tr>`).join('')}
      <tr><td colspan="6" class="dim small">… ${rows.length > 6 ? num(rows.length - 6) + ' weitere Zeilen' : ''}</td></tr></tbody></table></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
      <button class="btn btn-ghost btn-sm" id="datevCsv">⬇ DATEV-CSV herunterladen</button>
      <button class="btn btn-gold btn-sm" id="datevSend">✉ An Steuerberater senden</button>
    </div>
    <ul class="progress-steps" id="datevProg"></ul>
    <div class="subhead">Versand-Historie</div>
    <table class="tbl"><thead><tr><th>Zeitraum</th><th>Gesendet</th><th>Empfänger</th><th class="num">Buchungen</th><th class="num">Summe</th></tr></thead>
      <tbody>${S.datevLog.map(l => `<tr><td>${ymLabel(l.month)}</td><td>${fmtDate(l.at)}${l.auto ? ' <span class="badge b-mute">Beispiel</span>' : ''}</td><td>${esc(l.to)}</td><td class="num">${l.rows ? num(l.rows) : '—'}</td><td class="num">${l.sum ? eur0(l.sum) : '—'}</td></tr>`).join('')}</tbody></table>
  </div>`;
}
function datevRows(month) {
  return S.appts.filter(a => done(a) && ym(a.date) === month && a.paid).sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start)
    .map(a => ({ date: a.date, no: 'B-' + a.paid.no, text: `${svcById(a.service).name} ${stById(a.stylist).name}`.slice(0, 60), konto: a.paid.method === 'bar' ? 1000 : 1360, amount: a.price, method: a.paid.method }));
}
function datevCsv(month) {
  const rows = datevRows(month), [y, m] = month.split('-').map(Number);
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 17);
  const head = `"EXTF";700;21;"Buchungsstapel";13;${stamp};;"LU";"Luna";"";10010;20001;${y}0101;4;${y}${pad(m)}01;${y}${pad(m)}${daysInMonth(y, m - 1)};"Kasse ${ymLabel(month)}";"";1;0;0;"EUR"`;
  const cols = 'Umsatz (ohne Soll/Haben-Kz);Soll/Haben-Kennzeichen;WKZ Umsatz;Kurs;Basis-Umsatz;WKZ Basis-Umsatz;Konto;Gegenkonto (ohne BU-Schlüssel);BU-Schlüssel;Belegdatum;Belegfeld 1;Belegfeld 2;Skonto;Buchungstext';
  const lines = rows.map(r => `${r.amount.toFixed(2).replace('.', ',')};"S";"EUR";;;;${r.konto};8400;;${r.date.slice(8)}${r.date.slice(5, 7)};"${r.no}";;;"${r.text.replace(/"/g, '')}"`);
  return [head, cols, ...lines].join('\r\n');
}
afterRender.kasse = () => {
  $('#datevMonth').onchange = e => { A.datevMonth = e.target.value; renderAdmin(); setTimeout(() => $('#datevPanel').scrollIntoView({ block: 'start' }), 0); };
  $('#datevCsv').onclick = () => { download(`DATEV_Buchungsstapel_LUNA_${A.datevMonth}.csv`, '﻿' + datevCsv(A.datevMonth), 'text/csv'); toast('⬇ DATEV-Datei erstellt (vereinfachtes EXTF-Format, Demo).'); };
  $('#datevSend').onclick = sendDatev;
  $('#hcTest').onclick = () => { $('#hcOut').innerHTML = '<span class="spin"></span> verbinde …'; setTimeout(() => $('#hcOut').innerHTML = `<span style="color:var(--ok)">✓ API erreichbar · ${80 + Math.floor(Math.random() * 90)} ms · ${S.appts.filter(a => a.date >= today() && a.status === 'gebucht').length} Termine synchronisiert</span>`, 1100); };
  $('#dsfinv').onclick = () => toast('DSFinV-K-Export erzeugt (Demo) – in der echten Version direkt aus helloCash als ZIP für die Betriebsprüfung.');
  $('#zbon').onclick = zBon;
  $('#adminBody').onclick = e => {
    const p = e.target.closest('[data-pay]'); if (p) return checkout(p.dataset.pay);
    const b = e.target.closest('[data-bon]'); if (b) return showReceipt(b.dataset.bon);
    if (e.target.closest('[data-goto-datev]')) $('#datevPanel').scrollIntoView({ behavior: 'smooth' });
  };
};
function sendDatev() {
  const month = A.datevMonth, rows = datevRows(month), btn = $('#datevSend');
  btn.disabled = true;
  const steps = ['Buchungsstapel erzeugen (' + num(rows.length) + ' Buchungen)', 'Plausibilitätsprüfung: Konten, Belegnummern, USt', 'Kassenbuch & Z-Bons als PDF anhängen', 'Verschlüsselte Übertragung an DATEV Unternehmen online', 'Steuerberater benachrichtigen: ' + STEUERBERATER];
  const ul = $('#datevProg');
  let i = 0;
  const draw = () => { ul.innerHTML = steps.map((s, k) => `<li class="${k < i ? 'done' : k === i ? 'run' : ''}"><span class="ic">${k < i ? '✓' : k === i ? '<span class="spin"></span>' : '○'}</span>${s}</li>`).join(''); };
  draw();
  const tick = setInterval(() => {
    i++; draw();
    if (i >= steps.length) {
      clearInterval(tick);
      S.datevLog.unshift({ month, at: today(), rows: rows.length, sum: rows.reduce((x, r) => x + r.amount, 0), to: STEUERBERATER });
      save(false);
      toast(`✓ <b>DATEV-Export ${ymLabel(month)}</b> an ${STEUERBERATER} übermittelt.`);
      setTimeout(() => { if (A.tab === 'kasse') { renderAdmin(); $('#datevPanel')?.scrollIntoView({ block: 'start' }); } }, 1200);
    }
  }, 750);
}
function checkout(id) {
  const a = S.appts.find(x => x.id === id), svc = svcById(a.service);
  let method = 'ec';
  openModal(`<p class="eyebrow">Kasse · ${S.fallback ? 'iPad-Notbetrieb' : 'Kassen-PC'}</p><h3 class="h3">Kassieren: ${esc(a.name)}</h3>
    <table class="tbl" style="margin:10px 0 16px"><tbody><tr><td>${esc(svc.name)}</td><td class="num">${eur(svc.price)}</td></tr>
    ${a.extras.map(x => { const e = EXTRAS.find(y => y.id === x); return `<tr><td>${e.name}</td><td class="num">${eur(e.price)}</td></tr>`; }).join('')}
    <tr><td><b>Gesamt</b> <span class="small dim">inkl. 19 % MwSt.</span></td><td class="num"><b class="gold" style="font-size:20px">${eur(a.price)}</b></td></tr></tbody></table>
    <label>Zahlungsart</label><div class="seg" id="payseg" style="margin-bottom:18px">${Object.entries(PAY).map(([k, v]) => `<button type="button" data-m="${k}" class="${k === method ? 'active' : ''}">${v}</button>`).join('')}</div>
    <button class="btn btn-gold" style="width:100%" id="doPay">Bezahlt – Beleg mit TSE-Signatur erstellen</button>`);
  $('#payseg').onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; method = b.dataset.m; $$('#payseg button').forEach(x => x.classList.toggle('active', x === b)); };
  $('#doPay').onclick = () => {
    a.status = 'erledigt'; S.tse++; if (S.fallback) S.offline++;
    a.paid = { method, no: ++S.receipt, at: today(), ts: Date.now(), tse: S.tse, offline: S.fallback };
    save(); showReceipt(a.id);
    toast(`🧾 ${eur(a.price)} kassiert (${PAY[method]}) – Umsatz &amp; DATEV aktualisiert.`);
  };
}
function showReceipt(id) {
  const a = S.appts.find(x => x.id === id), svc = svcById(a.service), st = stById(a.stylist), p = a.paid;
  const ts = p.ts ? new Date(p.ts) : new Date(parse(a.date).getTime() + (a.start + a.dur) * 60e3);
  const sig = btoa(hexOf(hash(a.code + p.no), 64)).slice(0, 88);
  const net = a.price / 1.19;
  const seedQ = mulberry32(hash(sig));
  const qr = Array.from({ length: 441 }, (_, i) => { const r = Math.floor(i / 21), c = i % 21; const fin = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7); if (fin) { const rr = r % 14, cc = c % 14; const e = rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr > 1 && rr < 5 && cc > 1 && cc < 5); return e ? '<i></i>' : '<i class="w"></i>'; } return seedQ() < .5 ? '<i></i>' : '<i class="w"></i>'; }).join('');
  openModal(`<div class="receipt">
    <img src="logo.svg" alt="LUNA" style="filter:brightness(0)">
    <div class="c">LUNA Coiffeur &amp; Beauty<br>Bahnhofstraße 82 · 75417 Mühlacker<br>Tel. 07041 8281650<br>St.-Nr. 99/123/45678</div><hr>
    <div class="r"><span>Bon ${p.no}</span><span>${ts.toLocaleString('de-DE')}</span></div>
    <div class="r"><span>Kasse ${p.offline ? '2 (iPad)' : '1'}</span><span>Bedient: ${st.name}</span></div><hr>
    <div class="r"><span>${esc(svc.name)}</span><span>${eur(svc.price)}</span></div>
    ${a.extras.map(x => { const e = EXTRAS.find(y => y.id === x); return `<div class="r"><span>${e.name}</span><span>${eur(e.price)}</span></div>`; }).join('')}<hr>
    <div class="r"><b>SUMME</b><b>${eur(a.price)}</b></div>
    <div class="r"><span>Netto</span><span>${eur(net)}</span></div><div class="r"><span>MwSt. 19 %</span><span>${eur(a.price - net)}</span></div>
    <div class="r"><span>Gegeben ${PAY[p.method]}</span><span>${eur(a.price)}</span></div><hr>
    <div class="tse">TSE-Seriennr.: ${hexOf(42, 32)}<br>Transaktion: ${p.no + 731200} · Sig.-Zähler: ${p.tse || S.tse - 1}<br>Start: ${new Date(ts - 6e4).toISOString()}<br>Ende: ${ts.toISOString()}<br>Signatur: ${sig}</div>
    <div class="qr">${qr}</div>
    <div class="c" style="margin-top:8px">Vielen Dank &amp; bis bald! ✂</div></div>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:22px"><button class="btn btn-ghost btn-sm" id="rMail">Beleg per E-Mail</button><button class="btn btn-gold btn-sm" id="rClose">Fertig</button></div>`);
  $('#rMail').onclick = () => toast('✉ Digitaler Beleg versendet (Demo).');
  $('#rClose').onclick = closeModal;
}
function zBon() {
  const t = today(), l = S.appts.filter(a => a.date === t && a.status === 'erledigt');
  const by = k => l.filter(a => a.paid.method === k).reduce((x, a) => x + a.price, 0), tot = sum(l);
  openModal(`<div class="receipt"><img src="logo.svg" alt="" style="filter:brightness(0)"><div class="c"><b>Z-BON · TAGESABSCHLUSS</b><br>${fmtDate(t, true)}</div><hr>
    <div class="r"><span>Vorgänge</span><span>${l.length}</span></div>
    ${Object.entries(PAY).map(([k, v]) => `<div class="r"><span>${v}</span><span>${eur(by(k))}</span></div>`).join('')}<hr>
    <div class="r"><b>Umsatz brutto</b><b>${eur(tot)}</b></div><div class="r"><span>Netto 19 %</span><span>${eur(tot / 1.19)}</span></div><div class="r"><span>USt 19 %</span><span>${eur(tot - tot / 1.19)}</span></div><hr>
    ${STYLISTS.filter(st => l.some(a => a.stylist === st.id)).map(st => `<div class="r"><span>${st.name}</span><span>${eur(sum(l.filter(a => a.stylist === st.id)))}</span></div>`).join('')}<hr>
    <div class="r"><span>Kassensoll Bar</span><span>${eur(by('bar'))}</span></div><div class="tse">Z-Nr. ${Math.floor(S.receipt / 30)} · TSE-Sig.-Zähler ${S.tse}</div></div>
    <div style="text-align:center;margin-top:22px"><button class="btn btn-gold btn-sm" onclick="closeModal()">Schließen</button></div>`);
}

/* ---------- Geräte / Multi-Device / Fallback ---------- */
function viewDevices() {
  const w = innerWidth, me = w < 600 ? 'phone' : w < 1100 ? 'ipad' : 'pc';
  const dev = [
    { id: 'pc', ico: '🖥', name: 'Kassen-PC Empfang', sub: 'Windows · helloCash im Browser', st: S.fallback ? '<span class="badge b-bad">gestört</span>' : '<span class="badge b-ok">online</span>' },
    { id: 'laptop', ico: '💻', name: 'Büro-Laptop Inhaber', sub: 'Auswertungen, DATEV, Kalender', st: '<span class="badge b-ok">online</span>' },
    { id: 'ipad', ico: '📱', name: 'iPad Salon', sub: 'helloCash-App · Fallback-Kasse', st: S.fallback ? '<span class="badge b-warn">aktiv als Kasse</span>' : '<span class="badge b-mute">Standby</span>' },
    { id: 'phone', ico: '📲', name: 'Smartphone Inhaber', sub: 'Termine & Zahlen unterwegs', st: '<span class="badge b-ok">online</span>' },
  ];
  return `<div class="devices">${dev.map(d => `<div class="device ${d.id === me ? 'me' : ''}"><div class="ico">${d.ico}</div><h5>${d.name}</h5><p class="small muted">${d.sub}</p>${d.st}${d.id === me ? '<p class="small gold" style="margin:8px 0 0">◆ dieses Gerät</p>' : ''}</div>`).join('')}</div>
  <div class="grid2" style="margin-top:16px">
    <div class="panel"><h4>Zugriff von mehreren Geräten</h4>
      <ul class="checklist" style="font-size:14px;gap:10px">
        <li><span class="c-ok">✓</span><span>Alle Daten liegen in der Cloud – Login von jedem PC, Laptop, iPad oder Handy mit eigenem Benutzer.</span></li>
        <li><span class="c-ok">✓</span><span>Termine, Kasse und Umsätze sind auf allen Geräten <b>gleichzeitig</b> aktuell.</span></li>
        <li><span class="c-ok">✓</span><span>Rechte pro Person: Mitarbeiter sehen Kalender &amp; Kasse, nur der Inhaber Umsätze &amp; DATEV.</span></li>
        <li><span class="c-ok">✓</span><span>Gerät verloren? Sitzung aus der Ferne abmelden.</span></li>
      </ul>
      <div class="notice" style="margin-top:16px"><b>Jetzt ausprobieren:</b> Öffnen Sie die Seite in einem zweiten Fenster, buchen Sie dort einen Termin – er erscheint hier im Kalender sofort mit „NEU“.<br><br><button class="btn btn-gold btn-sm" id="second">Zweites Fenster öffnen</button></div>
    </div>
    <div class="panel"><h4>iPad-Fallback · Notbetrieb</h4>
      <div class="st-row ${S.fallback ? 'busy' : ''}" style="margin-bottom:14px"><div class="grow"><b>Kassen-PC gestört → iPad als Kasse nutzen</b><div class="small muted">${S.fallback ? `Aktiv · ${S.offline} Beleg(e) auf dem iPad erfasst` : 'Ein Klick – das iPad übernimmt mit derselben Cloud-TSE.'}</div></div>
        <label class="switch"><input type="checkbox" id="fbSwitch" ${S.fallback ? 'checked' : ''}><span></span></label></div>
      <div class="subhead">Notfallplan, falls die Kasse nicht greift</div>
      <ol class="small" style="padding-left:18px;margin:0;display:grid;gap:6px;color:var(--champ)">
        <li>iPad entsperren → helloCash-App öffnen (Kasse 2 ist schon eingerichtet).</li>
        <li>Cloud-TSE signiert weiter – auch über Handy-Hotspot, falls das WLAN weg ist.</li>
        <li>Kartenzahlung über das mobile Terminal (Bluetooth) statt am PC.</li>
        <li>Fällt alles aus: Notfall-Quittungsblock nutzen, später nacherfassen und den TSE-Ausfall dokumentieren.</li>
        <li>Nach der Störung: Fallback beenden – Belege synchronisieren automatisch.</li>
      </ol>
    </div>
  </div>`;
}
afterRender.geraete = () => {
  $('#second').onclick = () => window.open(location.href.split('#')[0] + '#buchen', '_blank');
  $('#fbSwitch').onchange = e => {
    if (e.target.checked) { S.fallback = true; S.offline = 0; save(false); toast('⚠ <b>iPad-Notbetrieb aktiv.</b> Neue Belege laufen über Kasse 2 (iPad).'); }
    else { const n = S.offline; S.fallback = false; S.offline = 0; save(false); toast(`✓ Kassen-PC wieder aktiv – ${n} iPad-Beleg(e) mit helloCash synchronisiert.`); }
    renderAdmin();
  };
};

/* ---------- Mein Tag (eigener Bereich jedes Mitarbeiters) ---------- */
function viewMine() {
  const id = myId(), st = stById(id), t = today(), nm = nowMin(), cm = ym(t);
  const todayL = apptsOn(t).filter(a => a.stylist === id && active(a)).sort((a, b) => a.start - b.start);
  const monL = S.appts.filter(a => a.stylist === id && done(a) && ym(a.date) === cm);
  const pend = S.appts.filter(a => a.stylist === id && a.status === 'vorlaeufig');
  const next = S.appts.filter(a => a.stylist === id && isOpenSt(a) && a.date > t && a.date <= addDays(t, 7)).sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);
  const cur = todayL.find(a => a.status !== 'noshow' && a.start <= nm && nm < a.start + a.dur);
  const nxt = todayL.find(a => isOpenSt(a) && a.start > nm);
  const row = (a, withDay) => {
    const s = svcById(a.service);
    const badge = a.status === 'vorlaeufig' ? '<span class="badge b-warn">vorläufig</span>' : a.status === 'erledigt' ? '<span class="badge b-ok">kassiert</span>' : a.status === 'noshow' ? '<span class="badge b-bad">nicht erschienen</span>' : a === cur ? '<span class="badge">JETZT</span>' : a === nxt ? '<span class="badge b-info">als Nächstes</span>' : '';
    return `<div class="agenda-row ${a === cur ? 'now' : ''} ${a.status === 'erledigt' || a.status === 'noshow' ? 'past' : ''}" data-appt="${a.id}">
      <span class="t">${withDay ? `<small>${relDay(a.date)}</small>` : ''}${hm(a.start)}<small>bis ${hm(a.start + a.dur)}</small></span>
      <span class="grow"><b>${esc(a.name)}</b> ${badge}${a.firstVisit ? ' <span class="badge b-mute">Erstbesuch</span>' : ''}<br><span class="small muted">${esc(s.name)}${a.extras.length ? ' + ' + a.extras.length + ' Extra' : ''} · ${eur(a.price)}</span>${a.note ? `<br><span class="small dim">📝 ${esc(a.note)}</span>` : ''}</span></div>`;
  };
  const h = HOURS[wd(t)], working = works(st, t);
  const free = working ? Math.max(0, (h[1] - Math.max(h[0], nm)) - todayL.filter(a => isOpenSt(a) && a.start + a.dur > nm).reduce((x, a) => x + Math.min(a.dur, a.start + a.dur - nm), 0)) : 0;
  return `<div class="kpis">
    <div class="kpi hl"><small>Heute · ${fmtDate(t)}</small><b>${todayL.filter(a => a.status !== 'noshow').length} Termine</b><span class="dim small">${working ? `noch ca. ${Math.floor(free / 60)} Std. ${free % 60} Min. frei` : 'heute nicht im Dienst'}</span></div>
    <div class="kpi"><small>Mein Umsatz ${MON[+cm.slice(5) - 1]}</small><b>${eur0(sum(monL))}</b><span class="dim small">${monL.length} Behandlungen</span></div>
    <div class="kpi"><small>Nächste 7 Tage</small><b>${next.length}</b><span class="dim small">Termine gebucht</span></div>
    <div class="kpi ${pend.length ? 'warn' : ''}"><small>Offene Rückrufe</small><b>${pend.length}</b><span class="dim small">${pend.length ? '<button class="linkbtn" data-goto="rueckruf">jetzt anrufen →</button>' : 'alles erledigt ✓'}</span></div>
  </div>
  <div class="grid2">
    <div class="panel"><h4>✂ Mein Tag · ${fmtDate(t, true)} <button class="btn btn-gold btn-sm" data-quick="1">+ Termin</button></h4>
      ${!working ? '<div class="empty">Heute ist kein Arbeitstag für Sie. Schönen freien Tag!</div>' : todayL.length ? `<div class="agenda">${todayL.map(a => row(a)).join('')}</div>` : '<div class="empty">Heute noch keine Termine.</div>'}</div>
    <div>
      <div class="panel"><h4>Nächste 7 Tage</h4>${next.length ? `<div class="agenda">${next.slice(0, 12).map(a => row(a, true)).join('')}</div>${next.length > 12 ? `<p class="small dim">+ ${next.length - 12} weitere – siehe Kalender</p>` : ''}` : '<div class="empty">Keine Termine in den nächsten 7 Tagen.</div>'}</div>
      <div class="panel" style="margin-top:16px"><h4>Mein Profil</h4>
        <div class="who" style="margin-bottom:12px">${avatar(st, 1)}<span><b>${esc(st.name)}</b><br><span class="small dim">${esc(st.role)}</span></span></div>
        <dl class="dl small"><dt>Arbeitstage</dt><dd>${st.days.map(d => WD[d]).join(' · ')}</dd><dt>Leistungen</dt><dd>${st.cats.map(catName).join(', ')}</dd><dt>Online</dt><dd>${st.bio ? esc(st.bio) : '—'}</dd></dl>
        ${isOwner() ? '<p class="small dim" style="margin:12px 0 0">Profil, Arbeitstage &amp; PINs: <button class="linkbtn" data-goto="team">Mitarbeiter verwalten</button></p>' : `<p class="small dim" style="margin:12px 0 0">Änderungen an Profil oder Arbeitstagen bitte über ${esc(stById(OWNER_ID).name)} (Inhaber).</p>`}
      </div>
    </div>
  </div>`;
}
afterRender.mein = () => {
  $('#adminBody').onclick = e => {
    if (e.target.closest('[data-goto]')) return;
    if (e.target.closest('[data-quick]')) return quickAdd({ date: today(), stylist: myId() });
    const ap = e.target.closest('[data-appt]'); if (ap) apptModal(ap.dataset.appt);
  };
};

/* ---------- Rückrufe (vorläufige Damen-Farbe) ---------- */
function viewCallbacks() {
  const list = pendingList(), t = today();
  const doneL = S.appts.filter(a => a.confirmedAt && (!me() || a.stylist === me())).sort((a, b) => b.confirmedAt - a.confirmedAt).slice(0, 6);
  const svcNames = svcs().filter(s => s.confirm).map(s => esc(s.name)).join(', ');
  return `<div class="notice warn" style="margin-bottom:16px">⏳ <b>So funktioniert's:</b> Leistungen mit Beratungs-Anruf (${svcNames || '—'}) werden online nur <b>vorläufig</b> reserviert – der Platz ist blockiert, aber noch nicht fest. ${me() ? 'Sie rufen' : 'Der Stylist ruft'} die Kundin an, schätzt die benötigte Zeit ein und bestätigt dann. Erst danach bekommt die Kundin die feste Bestätigung per SMS.${isOwner() ? ' Welche Leistungen das betrifft, stellen Sie unter <button class="linkbtn" data-goto="preise">Preise &amp; Leistungen</button> ein.' : ''}</div>
  <div class="panel"><h4>Offene Rückrufe · ${list.length}</h4>
    ${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kundin</th><th>Wunsch</th><th>Vorläufiger Termin</th>${me() ? '' : '<th>Stylist</th>'}<th>Wartet seit</th><th></th></tr></thead><tbody>
    ${list.map(a => {
      const urgent = a.date <= addDays(t, 2), hrs = Math.max(1, Math.round((Date.now() - (a.reqAt || a.createdAt || Date.now())) / 36e5));
      return `<tr class="${urgent ? 'urgent' : ''}"><td><b>${esc(a.name)}</b><br><a class="small" href="tel:${esc(a.phone.replace(/\s/g, ''))}">📞 ${esc(a.phone)}</a>${a.calls ? `<br><span class="small dim">${a.calls}× nicht erreicht</span>` : ''}</td>
        <td>${esc(svcById(a.service).name)}${a.note ? `<br><span class="small dim">📝 ${esc(a.note)}</span>` : ''}</td>
        <td>${relDay(a.date)}, ${hm(a.start)} Uhr${urgent ? ' <span class="badge b-bad">dringend</span>' : ''}<br><span class="small dim">reserviert: ${a.dur} Min.</span></td>
        ${me() ? '' : `<td>${stById(a.stylist).name}</td>`}
        <td class="small">${hrs < 24 ? hrs + ' Std.' : Math.round(hrs / 24) + ' Tag(e)'}</td>
        <td><button class="btn btn-gold btn-sm" data-appt="${a.id}">Anrufen &amp; bestätigen</button></td></tr>`;
    }).join('')}</tbody></table></div>` : '<div class="empty">✓ Keine offenen Rückrufe – alle Farbtermine sind bestätigt.</div>'}
  </div>
  ${doneL.length ? `<div class="panel" style="margin-top:16px"><h4>Zuletzt nach Telefonat bestätigt</h4><div class="agenda">${doneL.map(a => `<div class="agenda-row" data-appt="${a.id}"><span class="t">${hm(a.start)}<small>${relDay(a.date)}</small></span><span class="grow"><b>${esc(a.name)}</b> <span class="badge b-ok">fest</span><br><span class="small muted">${esc(svcById(a.service).name)} · ${a.dur} Min. · ${eur(a.price)} · bestätigt von ${esc(a.confirmedBy)}</span>${a.callNote ? `<br><span class="small dim">☎ ${esc(a.callNote)}</span>` : ''}</span></div>`).join('')}</div></div>` : ''}`;
}
afterRender.rueckruf = () => {
  $('#adminBody').onclick = e => { if (e.target.closest('[data-goto]') || e.target.closest('a')) return; const ap = e.target.closest('[data-appt]'); if (ap) apptModal(ap.dataset.appt); };
};

/* ---------- Preise & Leistungen (nur Inhaber) ---------- */
function durOpts(sel) { let o = ''; for (let m = 15; m <= 300; m += 15) o += `<option value="${m}" ${m === sel ? 'selected' : ''}>${m} Min.</option>`; return o; }
function viewPrices() {
  const gone = SERVICES.filter(s => s.gone);
  return `<div class="toolbar">
    <button class="btn btn-gold btn-sm" data-svcnew="1">+ Neue Leistung</button>
    <span class="grow"></span>
    <span class="small muted">Alle Preise anpassen um</span><input type="number" id="pctIn" value="5" step="1" style="width:80px"><span class="small muted">%</span>
    <button class="btn btn-dark btn-sm" id="pctGo">Anwenden</button></div>
  <div class="notice" style="margin-bottom:16px">Änderungen sind <b>sofort online</b> sichtbar (Preisliste, Buchung, Schnellfinder). Bereits gebuchte Termine behalten ihren Preis. <b>📞 Rückruf</b> = online nur vorläufig buchbar, fest erst nach Telefonat.</div>
  ${CATS.map(c => { const l = svcs().filter(s => s.cat === c.id); return `<div class="panel" style="margin-bottom:16px"><h4>${c.name} <span class="small dim" style="text-transform:none;letter-spacing:0">${l.length} Leistungen</span></h4>
    ${l.length ? `<div class="tbl-wrap"><table class="tbl price-tbl"><thead><tr><th>Leistung</th><th class="num">Preis €</th><th>Dauer</th><th>📞 Rückruf</th><th></th></tr></thead><tbody>
    ${l.map(s => `<tr><td><b>${esc(s.name)}</b>${s.tag ? ` <span class="tag">${esc(s.tag)}</span>` : ''}<br><span class="small dim">${esc(s.desc)}</span></td>
      <td class="num"><input type="number" min="0" step="1" value="${s.price}" data-sp="${s.id}" class="in-price"></td>
      <td><select data-sd="${s.id}" class="in-dur">${durOpts(s.dur)}</select></td>
      <td><label class="switch"><input type="checkbox" data-sc="${s.id}" ${s.confirm ? 'checked' : ''}><span></span></label></td>
      <td style="white-space:nowrap"><button class="btn btn-dark btn-sm" data-svcedit="${s.id}">✎</button> <button class="btn btn-danger btn-sm" data-svcdel="${s.id}" title="Entfernen">🗑</button></td></tr>`).join('')}
    </tbody></table></div>` : '<div class="empty">Keine Leistungen in dieser Kategorie.</div>'}</div>`; }).join('')}
  ${gone.length ? `<div class="panel"><h4>Entfernte Leistungen</h4>${gone.map(s => `<div class="st-row off"><div class="grow"><b>${esc(s.name)}</b><div class="small dim">${catName(s.cat)} · zuletzt ${eur0(s.price)}</div></div><button class="btn btn-ghost btn-sm" data-svcback="${s.id}">Wiederherstellen</button></div>`).join('')}</div>` : ''}`;
}
afterRender.preise = () => {
  const body = $('#adminBody');
  body.onchange = e => {
    const t = e.target, d = t.dataset;
    const s = svcById(d.sp || d.sd || d.sc); if (!s) return;
    if (d.sp) { const v = Math.round(+t.value); if (!(v >= 0)) { t.value = s.price; return; } if (v === s.price) return; toast(`✓ <b>${esc(s.name)}</b>: ${eur0(s.price)} → ${eur0(v)} · online aktualisiert`); s.price = v; }
    if (d.sd) { s.dur = +t.value; toast(`✓ <b>${esc(s.name)}</b>: Dauer ${s.dur} Min. – freie Zeiten neu berechnet`); }
    if (d.sc) { s.confirm = t.checked; toast(s.confirm ? `📞 <b>${esc(s.name)}</b> wird online nur noch vorläufig gebucht (Rückruf nötig).` : `✓ <b>${esc(s.name)}</b> ist online wieder sofort fest buchbar.`); }
    save(false); renderPublic();
  };
  body.onclick = e => {
    const t = e.target;
    if (t.closest('[data-goto]')) return;
    if (t.closest('[data-svcnew]')) return serviceForm();
    const ed = t.closest('[data-svcedit]'); if (ed) return serviceForm(ed.dataset.svcedit);
    const del = t.closest('[data-svcdel]'); if (del) {
      const s = svcById(del.dataset.svcdel), n = S.appts.filter(a => a.service === s.id && isOpenSt(a) && a.date >= today()).length;
      if (!confirm(`„${s.name}“ aus dem Angebot nehmen?\n\nSie ist dann online nicht mehr buchbar.${n ? `\n${n} bereits gebuchte Termin(e) bleiben bestehen.` : ''}\nUmsätze aus der Vergangenheit bleiben erhalten.`)) return;
      s.gone = true; save(false); renderPublic(); renderAdmin(); toast(`🗑 „${esc(s.name)}“ entfernt – online nicht mehr buchbar.`); return;
    }
    const bk = t.closest('[data-svcback]'); if (bk) { const s = svcById(bk.dataset.svcback); s.gone = false; save(false); renderPublic(); renderAdmin(); toast(`✓ „${esc(s.name)}“ ist wieder im Angebot.`); return; }
    if (t.id === 'pctGo') {
      const p = +$('#pctIn').value; if (!p) return;
      if (!confirm(`Alle ${svcs().length} Preise um ${p > 0 ? '+' : ''}${p} % ändern (auf volle Euro gerundet)?`)) return;
      svcs().forEach(s => { s.price = Math.max(0, Math.round(s.price * (1 + p / 100))); });
      save(false); renderPublic(); renderAdmin(); toast(`✓ Alle Preise um ${p > 0 ? '+' : ''}${p} % angepasst – online aktualisiert.`);
    }
  };
};
function serviceForm(id) {
  const s = id ? svcById(id) : { name: '', cat: 'schnitt', desc: '', price: 30, dur: 30, tag: '', confirm: false };
  openModal(`<p class="eyebrow">${id ? 'Leistung bearbeiten' : 'Neue Leistung'}</p><h3 class="h3">${id ? esc(s.name) : 'Leistung anlegen'}</h3>
    <form id="svcForm">
      <div class="field"><label>Name *</label><input name="name" required value="${esc(s.name)}" placeholder="z. B. Keratin-Glättung"></div>
      <div class="row"><div class="field"><label>Kategorie</label><select name="cat">${CATS.map(c => `<option value="${c.id}" ${c.id === s.cat ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
      <div class="field"><label>Label (optional)</label><input name="tag" value="${esc(s.tag || '')}" placeholder="z. B. Neu, Beliebt"></div></div>
      <div class="field"><label>Beschreibung</label><input name="desc" value="${esc(s.desc)}" placeholder="Was ist enthalten?"></div>
      <div class="row"><div class="field"><label>Preis (€) *</label><input name="price" type="number" min="0" step="1" required value="${s.price}"></div>
      <div class="field"><label>Dauer</label><select name="dur">${durOpts(s.dur)}</select></div></div>
      <label class="check"><input type="checkbox" name="confirm" ${s.confirm ? 'checked' : ''}> 📞 Online nur vorläufig – Bestätigung erst nach Telefonat (z. B. Damen-Farbe)</label>
      <button class="btn btn-gold" style="width:100%;margin-top:10px">${id ? 'Speichern' : 'Leistung anlegen'}</button>
    </form>`);
  $('#svcForm').onsubmit = e => {
    e.preventDefault(); const f = e.target.elements;
    const v = { name: f.name.value.trim(), cat: f.cat.value, tag: f.tag.value.trim(), desc: f.desc.value.trim(), price: Math.max(0, Math.round(+f.price.value)), dur: +f.dur.value, confirm: f.confirm.checked };
    if (!v.name) return;
    if (id) Object.assign(s, v); else SERVICES.push({ id: 's' + Date.now().toString(36), w: 2, ...v });
    save(false); closeModal(); renderPublic(); renderAdmin();
    toast(`✓ „${esc(v.name)}“ ${id ? 'gespeichert' : 'angelegt'} – sofort online buchbar.`);
  };
}

/* ---------- Mitarbeiter verwalten (nur Inhaber) ---------- */
function viewStaff() {
  const t = today(), cm = ym(t), gone = STYLISTS.filter(st => st.gone);
  return `<div class="toolbar"><button class="btn btn-gold btn-sm" data-stnew="1">+ Mitarbeiter hinzufügen</button><span class="grow"></span>
    <span class="small muted">Jeder Mitarbeiter meldet sich mit eigener PIN an und sieht nur seinen eigenen Bereich.</span></div>
  <div class="staff-grid">${team().map(st => {
    const up = S.appts.filter(a => a.stylist === st.id && isOpenSt(a) && a.date >= t && a.date <= addDays(t, 14)).length;
    const rev = sum(S.appts.filter(a => a.stylist === st.id && done(a) && ym(a.date) === cm));
    return `<div class="staff-card">
      <div class="who">${avatar(st, 1)}<span><b>${esc(st.name)}</b> ${st.id === OWNER_ID ? '<span class="badge">INHABER</span>' : ''}<br><span class="small dim">${esc(st.role)}</span></span></div>
      <dl class="dl small" style="margin:14px 0">
        <dt>Arbeitstage</dt><dd>${[1, 2, 3, 4, 5, 6].map(d => `<span class="daypill ${st.days.includes(d) ? 'on' : ''}">${WD[d]}</span>`).join('')}</dd>
        <dt>Leistungen</dt><dd>${st.cats.map(catName).join(', ')}</dd>
        <dt>Login</dt><dd>${st.id === OWNER_ID ? 'E-Mail &amp; Passwort' : `PIN <span class="pin" data-pin="${esc(st.pin)}">••••</span> <button class="linkbtn small" data-showpin="1">zeigen</button>`}</dd>
        <dt>Nächste 14 T.</dt><dd>${up} Termine</dd><dt>Umsatz ${MON[+cm.slice(5) - 1].slice(0, 3)}</dt><dd>${eur0(rev)}</dd>
      </dl>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-dark btn-sm" data-stedit="${st.id}">✎ Bearbeiten</button>${st.id === OWNER_ID ? '' : `<button class="btn btn-danger btn-sm" data-stdel="${st.id}">Entfernen</button>`}</div>
    </div>`;
  }).join('')}</div>
  ${gone.length ? `<div class="panel" style="margin-top:16px"><h4>Ehemalige Mitarbeiter</h4><p class="small dim" style="margin-top:-6px">Bleiben in Umsatz-Auswertungen &amp; DATEV erhalten. Login ist gesperrt.</p>
    ${gone.map(st => `<div class="st-row off">${avatar(st, 1)}<div class="grow"><b>${esc(st.name)}</b><div class="small dim">${esc(st.role)} · ausgeschieden ${st.goneAt ? fmtDate(st.goneAt) + st.goneAt.slice(0, 4) : ''} · Umsatz gesamt ${eur0(sum(S.appts.filter(a => a.stylist === st.id && done(a))))}</div></div><button class="btn btn-ghost btn-sm" data-stback="${st.id}">Wieder aktivieren</button></div>`).join('')}</div>` : ''}`;
}
afterRender.team = () => {
  $('#adminBody').onclick = e => {
    const t = e.target;
    if (t.closest('[data-stnew]')) return staffForm();
    const ed = t.closest('[data-stedit]'); if (ed) return staffForm(ed.dataset.stedit);
    const del = t.closest('[data-stdel]'); if (del) return removeStaff(del.dataset.stdel);
    const bk = t.closest('[data-stback]'); if (bk) { const st = stById(bk.dataset.stback); st.gone = false; delete st.goneAt; save(false); renderPublic(); renderAdmin(); toast(`✓ ${esc(st.name)} ist wieder aktiv – online buchbar, Login mit PIN ${esc(st.pin)}.`); return; }
    if (t.dataset.showpin) { const p = t.previousElementSibling; const shown = p.textContent !== '••••'; p.textContent = shown ? '••••' : p.dataset.pin; t.textContent = shown ? 'zeigen' : 'verbergen'; }
  };
};
function newPin() { let p; do p = String(1000 + Math.floor(Math.random() * 9000)); while (STYLISTS.some(s => s.pin === p)); return p; }
function staffForm(id) {
  const st = id ? stById(id) : { name: '', role: '', bio: '', spec: [], days: [2, 3, 4, 5, 6], cats: ['schnitt', 'styling'], pin: newPin() };
  const own = id === OWNER_ID;
  openModal(`<p class="eyebrow">${id ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}</p><h3 class="h3">${id ? esc(st.name) : 'Mitarbeiter hinzufügen'}</h3>
    <form id="stForm">
      <div class="row"><div class="field"><label>Name (wie er online erscheint) *</label><input name="name" required value="${esc(st.name)}" placeholder="z. B. Elif"></div>
      <div class="field"><label>Position</label><input name="role" value="${esc(st.role)}" placeholder="z. B. Friseurin, Auszubildende"></div></div>
      <div class="field"><label>Kurzvorstellung für die Website</label><input name="bio" value="${esc(st.bio)}" placeholder="1–2 Sätze"></div>
      <div class="field"><label>Spezialgebiete (mit Komma getrennt)</label><input name="spec" value="${esc(st.spec.join(', '))}" placeholder="z. B. Balayage, Hochsteckfrisur"></div>
      <div class="field"><label>Arbeitstage *</label><div class="cb-row">${[1, 2, 3, 4, 5, 6].map(d => `<label class="cb"><input type="checkbox" name="day" value="${d}" ${st.days.includes(d) ? 'checked' : ''}><span>${WD[d]}</span></label>`).join('')}</div></div>
      <div class="field"><label>Bietet an *</label><div class="cb-row">${CATS.map(c => `<label class="cb"><input type="checkbox" name="cat" value="${c.id}" ${st.cats.includes(c.id) ? 'checked' : ''}><span>${c.name}</span></label>`).join('')}</div></div>
      ${own ? '' : `<div class="field"><label>Login-PIN (4-stellig) *</label><div style="display:flex;gap:8px"><input name="pin" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric" value="${esc(st.pin)}" style="max-width:140px"><button type="button" class="btn btn-dark btn-sm" id="pinGen">Neue PIN</button></div></div>`}
      <div id="stErr"></div>
      <button class="btn btn-gold" style="width:100%">${id ? 'Speichern' : 'Mitarbeiter anlegen'}</button>
    </form>`);
  const f = $('#stForm');
  if ($('#pinGen')) $('#pinGen').onclick = () => { f.elements.pin.value = newPin(); };
  f.onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(f);
    const v = { name: fd.get('name').trim(), role: fd.get('role').trim() || 'Friseur/in', bio: fd.get('bio').trim(), spec: fd.get('spec').split(',').map(x => x.trim()).filter(Boolean), days: fd.getAll('day').map(Number), cats: fd.getAll('cat') };
    const err = m => $('#stErr').innerHTML = `<div class="notice err" style="margin-bottom:12px">${m}</div>`;
    if (!v.name) return err('Bitte einen Namen eingeben.');
    if (!v.days.length) return err('Bitte mindestens einen Arbeitstag wählen.');
    if (!v.cats.length) return err('Bitte mindestens einen Leistungsbereich wählen.');
    if (!own) { v.pin = fd.get('pin'); if (STYLISTS.some(s => s.pin === v.pin && s.id !== id)) return err('Diese PIN ist schon vergeben.'); }
    if (id) {
      const lost = S.appts.filter(a => a.stylist === id && isOpenSt(a) && a.date >= today() && !v.days.includes(wd(a.date))).length;
      Object.assign(st, v);
      save(false); closeModal(); renderPublic(); renderAdmin();
      toast(`✓ ${esc(v.name)} gespeichert.${lost ? `<br>⚠ ${lost} Termin(e) liegen an Tagen, die jetzt frei sind – bitte im Kalender prüfen.` : ''}`, lost ? 8000 : 5200);
    } else {
      const nid = v.name.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '').slice(0, 10) + '-' + Date.now().toString(36).slice(-4);
      STYLISTS.push({ id: nid, ...v });
      save(false); closeModal(); renderPublic(); renderAdmin();
      toast(`✓ <b>${esc(v.name)}</b> ist angelegt – erscheint sofort im Team, in der Online-Buchung und im Kalender.<br>Login: Mitarbeiter · PIN <b>${esc(v.pin)}</b>`, 8000);
    }
  };
}
function removeStaff(id) {
  const st = stById(id), t = today(), nm = nowMin();
  const fut = S.appts.filter(a => a.stylist === id && isOpenSt(a) && (a.date > t || (a.date === t && a.start >= nm))).sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);
  openModal(`<p class="eyebrow">Mitarbeiter entfernen</p><h3 class="h3">${esc(st.name)} entfernen?</h3>
    <p class="muted small">${esc(st.name)} verschwindet sofort von der Website und aus der Online-Buchung, der Login wird gesperrt. Vergangene Termine und Umsätze bleiben für Auswertung &amp; DATEV erhalten.</p>
    ${fut.length ? `<div class="notice warn" style="margin:14px 0">${esc(st.name)} hat noch <b>${fut.length} offene Termin(e)</b>:<br>${fut.slice(0, 5).map(a => `· ${relDay(a.date)} ${hm(a.start)} – ${esc(a.name)} (${esc(svcById(a.service).name)})`).join('<br>')}${fut.length > 5 ? `<br>· … und ${fut.length - 5} weitere` : ''}</div>
    <label class="check"><input type="radio" name="rm" value="move" checked> Auf freie Kollegen umverteilen (empfohlen) – Kunden erhalten eine SMS mit dem neuen Stylisten</label>
    <label class="check"><input type="radio" name="rm" value="cancel"> Alle stornieren – Kunden erhalten eine Absage-SMS</label>` : '<div class="notice ok" style="margin:14px 0">✓ Keine offenen Termine – kann direkt entfernt werden.</div>'}
    <div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-danger" id="rmGo">${esc(st.name)} entfernen</button><button class="btn btn-ghost" onclick="closeModal()">Abbrechen</button></div>`);
  $('#rmGo').onclick = () => {
    load(); const s2 = stById(id); const mode = $('input[name=rm]:checked')?.value || 'move';
    let moved = 0, cancelled = 0;
    S.appts.filter(a => a.stylist === id && isOpenSt(a) && (a.date > t || (a.date === t && a.start >= nm))).forEach(a => {
      const svc = svcById(a.service);
      const cand = mode === 'move' ? team().filter(x => x.id !== id && x.cats.includes(svc.cat) && works(x, a.date) && !conflictOf(x.id, a.date, a.start, a.dur)) : [];
      if (cand.length) { a.stylist = leastBusy(cand, a.date).id; a.movedFrom = id; moved++; dayIdx = null; }
      else { a.status = 'storniert'; a.cancelReason = `${s2.name} nicht mehr im Team`; a.cancelledAt = Date.now(); cancelled++; }
    });
    s2.gone = true; s2.goneAt = t;
    save(false); closeModal(); renderPublic(); renderAdmin();
    toast(`✓ ${esc(s2.name)} entfernt.${moved ? `<br>↪ ${moved} Termin(e) auf Kollegen umverteilt` : ''}${cancelled ? `<br>✗ ${cancelled} Termin(e) storniert – ${mode === 'move' ? 'kein Kollege frei, ' : ''}Kunden per SMS informiert (Simulation)` : ''}`, 8000);
  };
}

/* ---------- Live-Synchronisation ---------- */
function renderPublic() {
  renderServices(); renderTeam(); initFinder(); fillFinderStylists(); renderFinder(); renderCare();
  if (B.step === 1 || B.step === 2 || B.step === 3) renderBooking();
}
function refreshAll() {
  renderPublic();
  if (isAdmin() && !(A.tab === 'kasse' && $('#datevProg')?.children.length)) renderAdmin();
}
window.addEventListener('storage', e => {
  if (e.key !== KEY) return;
  const before = new Set(S.appts.map(a => a.id));
  const beforeStatus = new Map(S.appts.map(a => [a.id, a.status]));
  load(); dayIdx = null;
  if (isAdmin()) {
    S.appts.filter(a => !before.has(a.id)).forEach(a => toast(`🔔 <b>Neue ${a.status === 'vorlaeufig' ? 'vorläufige ' : ''}${SRC[a.source]}-Buchung</b> (anderes Fenster)<br>${esc(a.name)} · ${esc(svcById(a.service).name)}<br>${relDay(a.date)} ${hm(a.start)} bei ${stById(a.stylist).name}`));
    S.appts.filter(a => before.has(a.id) && beforeStatus.get(a.id) !== 'storniert' && a.status === 'storniert').forEach(a => toast(`↩ <b>Storno</b>: ${esc(a.name)} · ${relDay(a.date)} ${hm(a.start)}`));
  }
  refreshAll();
});
$('#resetDemo').onclick = () => { if (confirm('Alle Demo-Daten auf den Ausgangszustand zurücksetzen?')) { localStorage.removeItem(KEY); location.reload(); } };

/* ---------- Start ---------- */
load();
renderOpen(); renderHours(); renderServices(); renderTeam(); initFinder(); renderFinder(); renderCare(); renderBooking();
sessionStorage.removeItem('luna-admin');
document.body.classList.toggle('is-admin', isAdmin());
if (isAdmin()) renderAdmin();
setInterval(() => { $('#liveClock').textContent = new Date().toLocaleTimeString('de-DE'); }, 1000);
setInterval(() => { renderOpen(); if (isAdmin() && A.tab === 'kalender' && $('#modal').hidden) renderAdmin(); }, 60e3);
