// Flotta levelek – önálló Apps Script webalkalmazás (script.google.com → Új projekt).
// A csapatkassza.html "Fizetési emlékeztető e-mailben" gombja hívja: a leveleket a telepítő Gmail-fiókjából küldi.
// Telepítés: Telepítés → Új telepítés → Típus: Webalkalmazás → Végrehajtás: Én → Hozzáférés: Bárki → a kapott …/exec címet az oldal első küldéskor kéri.
// A JELSZO helyére a flotta jelszava kerül (ugyanaz, amivel a Flotta fület megnyitod). A repóba ezt NE írd be!
var JELSZO = "IDE_A_FLOTTA_JELSZAVA";

function doPost(e) {
  try {
    var b = JSON.parse(e.postData.contents);
    if (!b || b.k !== kulcs_()) return ki_({ ok: false, err: "Hibás kulcs: a webalkalmazásban más a flotta jelszava." });
    var lev = (b.mails || []).slice(0, 100), sent = 0, errs = [];
    lev.forEach(function (m) {
      try {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.to || "")) throw new Error("rossz cím");
        GmailApp.sendEmail(m.to, String(m.subject || "").slice(0, 200), String(m.body || "").slice(0, 5000), { name: String(b.from || "Csikós Máté") });
        sent++;
      } catch (x) { errs.push((m.to || "?") + ": " + x.message); }
    });
    return ki_({ ok: true, sent: sent, errs: errs });
  } catch (x) { return ki_({ ok: false, err: String(x.message || x) }); }
}

function kulcs_() {
  var d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "csk-flotta|" + JELSZO, Utilities.Charset.UTF_8);
  return d.map(function (x) { return ("0" + ((x + 256) % 256).toString(16)).slice(-2); }).join("");
}

function ki_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// Egyszer futtasd le a szerkesztőben (Futtatás → engedd meg a Gmail-hozzáférést), utána működik a küldés.
function engedelyezes() { GmailApp.getAliases(); Logger.log("Rendben, a Gmail-hozzáférés engedélyezve."); }
