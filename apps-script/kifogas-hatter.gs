/**
 * KIFOGÁSKEZELŐ – háttér (a csapat Apps Script projektjéhez, AKfycbxQ…)
 * Még NINCS élesítve. A következő körben kerül be a meglévő szkriptbe.
 *
 * Bekötés: a meglévő doGet(e) és doPost(e) legelejére:
 *     var kk = kkRoute_(e); if (kk) return kk;
 *
 * Szkripttulajdonságok:
 *   KK_SPACE        – a Firestore-tár azonosítója (perf/<KK_SPACE>/kk_content …)
 *   GEMINI_API_KEY  – később; amíg üres, a felület a helyi (teszt) értékelést használja
 *   GEMINI_MODEL    – opcionális, alapértelmezés: gemini-2.0-flash
 */

var KK_PROJECT = "csikoscsapat";

function kkRoute_(e) {
  var p = (e && e.parameter) || {}, body = {};
  if (e && e.postData && e.postData.contents) { try { body = JSON.parse(e.postData.contents); } catch (x) {} }
  var action = body.action || p.action;
  if (action === "kk_init") return kkJson_(kkInit_(p.t || body.t));
  if (action === "kk_ai") return kkJson_(kkAi_(body));
  return null;
}

/* Élesítés után a munkatárs ezzel kapja meg a tár azonosítóját: érvényes csk_token + bekapcsolt admin kapcsoló. */
function kkInit_(token) {
  if (!kkTokenOk_(token)) return { ok: false, error: "auth" };
  var space = PropertiesService.getScriptProperties().getProperty("KK_SPACE");
  if (!space) return { ok: false, error: "nincs" };
  var cfg = kkFs_(space, "kk_content/config");
  if (!cfg || !cfg.live) return { ok: false, error: "beta" };
  return { ok: true, space: space };
}

/* TODO: a meglévő szkript token-ellenőrzőjét kell itt hívni (ugyanaz, ami a "auth" hibát adja). */
function kkTokenOk_(token) {
  return !!token && typeof checkToken_ === "function" ? checkToken_(token) : false;
}

/* AI-hívás: csak a tár azonosítóját ismerő kliens hívhatja. */
function kkAi_(b) {
  var props = PropertiesService.getScriptProperties();
  if (!b.s || b.s !== props.getProperty("KK_SPACE")) return { ok: false, error: "auth" };
  var key = props.getProperty("GEMINI_API_KEY");
  if (!key) return { ok: false, error: "noai" };
  var model = props.getProperty("GEMINI_MODEL") || "gemini-2.0-flash";
  var crit = (b.criteria || []).map(function (c) { return "- " + c.id + ": " + c.name + " (" + (c.desc || "") + ")"; }).join("\n");
  var prompt =
    "Pénzügyi tanácsadók kifogáskezelését gyakoroltatod magyarul.\n" +
    "Te vagy az ügyfél: " + (b.client && b.client.name) + ". Jellem: " + (b.client && b.client.persona) + "\n" +
    "Az ügyfél kifogása: " + (b.item && b.item.prompt) + "\n" +
    "Korábbi körök: " + JSON.stringify(b.history || []) + "\n" +
    "A tanácsadó válasza: " + b.answer + "\n" +
    "Értékelési szempontok:\n" + crit + "\n" +
    "Mintaválasz (viszonyítási alap): " + (b.item && b.item.sample) + "\n\n" +
    "Válaszolj CSAK JSON-nal: {\"reply\": \"az ügyfél 1-2 mondatos reakciója a jelleme szerint\", " +
    "\"hits\": [{\"id\":\"…\",\"name\":\"…\",\"ok\":true/false,\"desc\":\"rövid tanács\"}], \"score\": 0-100, \"tip\": \"egy mondat, mit mondjon legközelebb\"}";
  var res = UrlFetchApp.fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + key, {
    method: "post", contentType: "application/json", muteHttpExceptions: true,
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.7 } })
  });
  try {
    var txt = JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
    var o = JSON.parse(txt); o.ok = true; return o;
  } catch (x) { return { ok: false, error: "ai" }; }
}

/* Firestore REST olvasás (a perf/… útvonal nyilvánosan olvasható, ahogy a többi oldalnál). */
function kkFs_(space, path) {
  var url = "https://firestore.googleapis.com/v1/projects/" + KK_PROJECT + "/databases/(default)/documents/perf/" + space + "/" + path;
  var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return null;
  var f = JSON.parse(r.getContentText()).fields || {}, o = {};
  Object.keys(f).forEach(function (k) { var v = f[k]; o[k] = "booleanValue" in v ? v.booleanValue : "stringValue" in v ? v.stringValue : "integerValue" in v ? +v.integerValue : null; });
  return o;
}

function kkJson_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
