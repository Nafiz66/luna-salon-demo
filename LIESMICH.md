# LUNA Coiffeur & Beauty – Demo

**Starten:** Doppelklick auf `index.html` (läuft ohne Installation im Browser).

**Inhaber-Login:** oben „🔒 Login“ → „Demo als Inhaber einloggen“
(oder `inhaber@luna-demo.de` / `luna2026`).

**Mitarbeiter-Login:** „🔒 Login“ → Reiter „Mitarbeiter“ → Mirgel (PIN 2222) oder Ozan (PIN 3333).
Mitarbeiter sehen nur ihren eigenen Bereich: Mein Tag, eigener Kalender, eigene Rückrufe, Telefon-Check.

**Inhaber kann zusätzlich:** Preise & Leistungen ändern (sofort online), Mitarbeiter anlegen/bearbeiten/entfernen
(offene Termine werden auf Kollegen umverteilt oder storniert), Umsatz, Kasse/DATEV.

**Damen-Farbe:** Farb-Leistungen sind online nur *vorläufig* buchbar. Der Stylist ruft an, legt die benötigte Zeit fest
und bestätigt im Reiter „⏳ Rückrufe“. Welche Leistungen das betrifft: Schalter „📞 Rückruf“ unter „Preise“.

**Live-Test für den Kunden:** Seite in zwei Fenstern öffnen – in einem als Inhaber einloggen,
im anderen einen Termin buchen. Die Buchung erscheint sofort im Kalender (mit „NEU“).

**Zurücksetzen:** ganz oben „Demo zurücksetzen“.

| Datei | Inhalt |
|---|---|
| `index.html` | Seitenaufbau |
| `style.css` | Design (Schwarz-Gold) |
| `app.js` | Logik: Leistungen, Team, Buchung, Kalender, Umsatz, Kasse/TSE/DATEV |
| `logo.svg` | Logo, nachgebaut aus dem WhatsApp-Bild (die Original-PDF lag nicht vor) |

Leistungen, Preise, Team und Öffnungszeiten stehen ganz oben in `app.js` und lassen sich dort leicht ändern.
Alle Daten sind Beispieldaten und werden nur im Browser gespeichert (localStorage).
