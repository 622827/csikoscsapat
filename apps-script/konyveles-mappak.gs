// Könyvelés mappák – önálló Apps Script webalkalmazás (script.google.com → Új projekt).
// Az admin oldal Könyvelés → „Mappa-ellenőrzés” gombja hívja: kilistázza a TFC Könyvelés 2026 mappa fájljait (melyik almappában vannak),
// és kérésre egy fájlt áthelyez a megfelelő hónapmappába („2026-03 Március” stb.).
// Telepítés: Telepítés → Új telepítés → Webalkalmazás → Végrehajtás: Én → Hozzáférés: Bárki. A …/exec címet és a KULCS-ot az admin oldal első használatkor kéri.
// A KULCS helyére írj egy hosszú, csak általad ismert szót. A repóba ezt NE írd be!
var KULCS = "IDE_EGY_HOSSZU_TITKOS_SZO";
var GYOKER = "1c-eoABzABeWbeIsEdn1GZGXKcDf9XpXy";   // TFC könyvelés 2026 mappa

function doPost(e) {
  try {
    var b = JSON.parse(e.postData.contents);
    if (!b || b.k !== KULCS || KULCS.indexOf("IDE_") === 0) return ki_({ ok: false, err: "Hibás kulcs." });
    if (b.action === "lista") { var out = []; bejar_(DriveApp.getFolderById(GYOKER), "", out); return ki_({ ok: true, files: out }); }
    if (b.action === "athelyez") {
      if (!/^20\d\d-\d\d$/.test(b.ho || "")) throw new Error("rossz hónap");
      var f = DriveApp.getFileById(b.id), cel = honapMappa_(b.ho);
      f.moveTo(cel); return ki_({ ok: true, folder: cel.getName() });
    }
    return ki_({ ok: false, err: "Ismeretlen művelet." });
  } catch (x) { return ki_({ ok: false, err: String(x.message || x) }); }
}

function bejar_(mappa, ut, out) {
  var it = mappa.getFiles();
  while (it.hasNext()) { var f = it.next(); out.push({ id: f.getId(), n: f.getName(), p: ut || "(gyökér)", u: f.getUrl() }); }
  var al = mappa.getFolders();
  while (al.hasNext()) { var m = al.next(); bejar_(m, (ut ? ut + "/" : "") + m.getName(), out); }
}

function honapMappa_(ho) {
  var it = DriveApp.getFolderById(GYOKER).getFolders();
  while (it.hasNext()) { var m = it.next(); if (m.getName().indexOf(ho + " ") === 0 || m.getName() === ho) return m; }
  throw new Error("Nincs " + ho + " mappa.");
}

function ki_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// Egyszer futtasd le a szerkesztőben (Futtatás → engedd meg a Drive-hozzáférést).
function engedelyezes() { Logger.log(DriveApp.getFolderById(GYOKER).getName()); }
