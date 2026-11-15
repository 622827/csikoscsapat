/**
 * Vagyon háttér – a "Magán Könyvelés 2026" táblázat "Ingatlan" lapját adja az admin oldalnak.
 * Védelem: a kérés a belépett admin Firebase (Google) azonosítóját hozza, a szkript ezt ellenőrzi, és csak az admin e-mail-címnek ad adatot.
 * Önálló web-alkalmazás (Execute as: a telepítő, Access: bárki), a kódot a clasp-pel töltjük fel a repón kívüli mappából. Ez a fájl a tisztított másolat.
 */
var SPREADSHEET_ID = "";   // a "Magán Könyvelés 2026" táblázat azonosítója (a telepített példányban van kitöltve, a repóban nem)
var ADMIN_EMAIL = "csikos.mate.ovb@gmail.com";
var FIREBASE_API_KEY = "AIzaSyDekvnHB2WjwfWg2PO_JK_P3z5FFTpWo4I";

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return out_({ ok: true, msg: "Vagyon háttér működik. Adatot csak admin Google-belépéssel ad." }); }
function doPost(e) {
  try {
    var b = {}; try { b = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, error: "bad request" }); }
    var em = emailFromToken_(b.idToken);
    if (!em || em !== ADMIN_EMAIL) return out_({ ok: false, error: "auth" });
    if (b.action === "vagyon") return out_(vagyonValasz_());
    return out_({ ok: false, error: "unknown action" });
  } catch (err) { return out_({ ok: false, error: "Háttér hiba: " + String(err && err.message || err) }); }
}
// A Firebase azonosító ellenőrzése: érvényes-e, és kié. Hibás vagy lejárt azonosítónál üres választ ad.
function emailFromToken_(t) {
  if (!t || typeof t !== "string" || t.length > 4000) return "";
  try {
    var r = UrlFetchApp.fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + FIREBASE_API_KEY, { method: "post", contentType: "application/json", payload: JSON.stringify({ idToken: t }), muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) return "";
    var u = (JSON.parse(r.getContentText()).users || [])[0];
    return u && u.email && u.emailVerified !== false ? String(u.email).toLowerCase() : "";
  } catch (e) { return ""; }
}

var VAGYON_LAP = "Ingatlan";

function vagyonIso_(v) {
  if (v === "" || v == null) return "";
  if (Object.prototype.toString.call(v) === "[object Date]") return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  var m = /^(\d{4})[-.\/ ]+(\d{1,2})[-.\/ ]+(\d{1,2})/.exec(String(v).trim());
  return m ? m[1] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[3]).slice(-2) : "";
}
function vagyonNum_(v) { var x = typeof v === "number" ? v : parseFloat(String(v).replace(/\s/g, "").replace(",", ".")); return isNaN(x) ? 0 : x; }
function vagyonNorm_(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); }

// A lap beolvasása (csak olvasás; a kód semmit nem ír a táblázatba).
function lapAdat_() {
  var lap = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(VAGYON_LAP);
  return lap ? lap.getDataRange().getValues() : [];
}

function vagyonValasz_() {
  var v = lapAdat_(), blokk = "", kv = {}, ktg = [];
  if (!v.length) return { ok: false, error: "Nincs \"" + VAGYON_LAP + "\" lap, vagy üres a táblázatban." };
  v.forEach(function (r) {
    var a = String(r[0] || "").trim(); if (!a) { return; }
    var n = vagyonNorm_(a);
    if (n === "ingatlan") { blokk = "ingatlan"; return; }
    if (n.indexOf("jarulekos") === 0) { blokk = "koltseg"; return; }
    if (n === "hitel") { blokk = "hitel"; return; }
    if (blokk === "koltseg") { ktg.push({ tetel: a, osszeg: vagyonNum_(r[1]), allapot: String(r[2] || "").trim(), kifizetve: vagyonNum_(r[3]) }); return; }
    kv[blokk + ":" + n] = r[1];
  });
  function g(b, kulcs) { return kv[b + ":" + vagyonNorm_(kulcs)]; }
  return {
    ok: true,
    ingatlan: {
      nev: String(g("ingatlan", "Megnevezés") || ""),
      cim: String(g("ingatlan", "Cím") || ""),
      vetelar: vagyonNum_(g("ingatlan", "Vételár (Ft)")),
      sajater: vagyonNum_(g("ingatlan", "Saját erő (Ft)")),
      ertek: vagyonNum_(g("ingatlan", "Az ingatlan értéke (Ft)") != null ? g("ingatlan", "Az ingatlan értéke (Ft)") : g("ingatlan", "Becsült érték (Ft)")),
      adasvetel: vagyonIso_(g("ingatlan", "Adásvétel dátuma")),
      koltsegek: ktg,
      hitel: {
        bank: String(g("hitel", "Bank") || ""),
        tipus: String(g("hitel", "Típus") || ""),
        osszeg: vagyonNum_(g("hitel", "Hitelösszeg (Ft)")),
        kamat: vagyonNum_(g("hitel", "Kamat (% / év)")),
        futamido: vagyonNum_(g("hitel", "Futamidő (hónap)")),
        torleszto: vagyonNum_(g("hitel", "Havi törlesztőrészlet (Ft)")),
        mod: String(g("hitel", "Törlesztés módja") || ""),
        allapot: String(g("hitel", "Állapot") || ""),
        folyositas: vagyonIso_(g("hitel", "Folyósítás dátuma")),
        elso: vagyonIso_(g("hitel", "Első törlesztés dátuma")),
        eloTorlesztes: vagyonNum_(g("hitel", "Előtörlesztés összesen (Ft)")),
        reszletek: vagyonNum_(g("hitel", "Kifizetett részletek (db)"))
      }
    }
  };
}
