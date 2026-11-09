/**
 * HAVI ZÁRÁS – a lezárt termelési hónapok állásának befagyasztása.
 *
 * Mit csinál: amikor új termelési hónap kezdődik, az előző hónap egységeit (100% Leadva + Elszámolt)
 * nevenként beírja a "Havi zárás" lapra. A beírt sor végleges, nem íródik felül, így akkor sem vész el,
 * ha a pipeline-lapokról később kitörlik a régi szerződéseket. A honlap a lezárt hónapoknál ezt használja.
 *
 * Telepítés (egyszer):
 *  1) Az Apps Script projektben új fájl: másold be ezt a kódot.
 *  2) Futtasd egyszer kézzel az installHaviZarasTrigger() függvényt (engedélyt kér).
 *  3) A meglévő doGet válaszába vedd fel:   closed: readClosed()
 *     (pl. return ContentService.createTextOutput(JSON.stringify({ ...eddigi mezők..., closed: readClosed() })) )
 */
var ZARAS_LAP = "Havi zárás";
var KIHAGY = ["Dicsőségfal V1.0", "Heti Admin", "Gépjármű", "Telefonparti", "Hibabejelentő ", "Hibabejelentő", "Üres pipeline", ZARAS_LAP];

// Az aktuális termelési hónap (ÉÉÉÉHH) – ugyanaz a szabály, mint a lapok HÓNAP cellájában:
// a hónap az adott hónap első keddje utáni pénteken vált.
function termelesiHonap_(t) {
  var s = new Date(t.getFullYear(), t.getMonth(), 1);
  var kedd = (2 - (s.getDay() === 0 ? 7 : s.getDay()) + 7) % 7;
  s.setDate(1 + kedd + 3);
  var d = t >= s ? t : new Date(t.getFullYear(), t.getMonth() - 1, 15);
  return d.getFullYear() * 100 + d.getMonth() + 1;
}
function elozoHonap_(m) { var y = Math.floor(m / 100), mm = m % 100; return mm === 1 ? (y - 1) * 100 + 12 : y * 100 + mm - 1; }

function oszlop_(fej, re) { for (var i = 0; i < fej.length; i++) if (re.test(String(fej[i]).trim())) return i; return -1; }

// Egy pipeline-lap egy hónapjának összege: {lead, el}; null, ha a lap nem pipeline-lap.
function lapOsszeg_(sh, honap) {
  var fej = sh.getRange(2, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  var cEs = oszlop_(fej, /^(egys[eé]g|es)$/i), cFo = oszlop_(fej, /^folyamat$/i), cHo = oszlop_(fej, /^h[oó]nap$/i);
  if (cEs < 0 || cFo < 0 || cHo < 0) return null;
  var n = sh.getLastRow() - 2; if (n < 1) return { lead: 0, el: 0 };
  var v = sh.getRange(3, 1, n, sh.getLastColumn()).getValues(), lead = 0, el = 0;
  v.forEach(function (r) {
    if (Number(r[cHo]) !== honap) return;
    var f = String(r[cFo]).toLowerCase(), es = Number(r[cEs]) || 0;
    if (f.indexOf("100% leadva") === 0) lead += es; else if (f.indexOf("elszámolt") === 0) el += es;
  });
  return { lead: lead, el: el };
}

// Napi trigger: ha az előző hónap még nincs a "Havi zárás" lapon, beírja. Meglévő sort sosem módosít.
function snapshotClosedMonths() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), lap = ss.getSheetByName(ZARAS_LAP);
  if (!lap) { lap = ss.insertSheet(ZARAS_LAP); lap.appendRow(["Hónap", "Név", "100% Leadva", "Elszámolt", "Összesen", "Rögzítve"]); lap.setFrozenRows(1); }
  var honap = elozoHonap_(termelesiHonap_(new Date()));
  var van = lap.getLastRow() > 1 && lap.getRange(2, 1, lap.getLastRow() - 1, 1).getValues().some(function (r) { return Number(r[0]) === honap; });
  if (van) return;
  var sorok = [], most = new Date();
  ss.getSheets().forEach(function (sh) {
    if (KIHAGY.indexOf(sh.getName()) > -1) return;
    var o = lapOsszeg_(sh, honap); if (!o) return;
    var nev = String(sh.getRange(1, 1).getValue()).trim() || sh.getName();
    sorok.push([honap, nev, o.lead, o.el, o.lead + o.el, Utilities.formatDate(most, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm")]);
  });
  if (sorok.length) lap.getRange(lap.getLastRow() + 1, 1, sorok.length, 6).setValues(sorok);
}

// A honlapnak: a lezárt hónapok mentett sorai.
function readClosed() {
  var lap = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ZARAS_LAP);
  if (!lap || lap.getLastRow() < 2) return [];
  return lap.getRange(2, 1, lap.getLastRow() - 1, 5).getValues()
    .filter(function (r) { return r[0] && r[1]; })
    .map(function (r) { return { m: Number(r[0]), name: String(r[1]), lead: Number(r[2]) || 0, el: Number(r[3]) || 0 }; });
}

// Egyszer futtasd: napi 1:00 körüli időzítés.
function installHaviZarasTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === "snapshotClosedMonths") ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger("snapshotClosedMonths").timeBased().everyDays(1).atHour(1).create();
}
