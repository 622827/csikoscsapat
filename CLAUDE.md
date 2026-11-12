# csikoscsapat.hu – rövid útmutató (csak amit a kódból nem lehet kiolvasni)

Statikus oldal (GitHub Pages, `main` → éles, kb. 1–2 perc), build nincs. Minden oldal egy HTML fájl beágyazott JS-sel. A felület magyar. Közvetlenül a `main`-re megy a módosítás (a tulajdonos kérte, PR nem kell).

## Gyorsítótár – minden módosítás után emelni
- Az **admin** (`admin.html`, `EMB` térkép) iframe-ben tölti be a szerkesztő oldalakat verziószámmal: pl. `teljesitmeny-szerk.html?v=as&c=N`, `csapatkassza.html?c=N`, `kampany-szerk.html?v=N`. Ha az ilyen oldalt módosítod, a számot emeld (különben a böngésző a régit tölti, a Pages 10 percig gyorsítótáraz).
- Az `anim.js?v=N` minden HTML-ben szerepel: `anim.js` módosítása után `sed`-del az összes HTML-ben emeld.

## Adatforrások
- **Apps Script** (egyetlen webalkalmazás, `AKfycbxQ-…/exec`) szolgál ki mindent (negyedéves, verseny, naptár, kassza). A **forrása nincs ebben a repóban** (itt csak `apps-script/*.gs` másolatok). A tulajdonos kézzel szerkeszti a böngészőben (`Kód.gs`), és minden módosítás után **új verziót kell telepíteni**. Az eredményt 5 percig gyorsítótárazza. Jelszó/token védi, kintről nem kérdezhető le.
- **Google Táblázat** (Csikós BL csapat Pipeline): minden munkatársnak saját lapja. Az oszlopok lapról lapra mások (ES/folyamat/hónap: Csikós Máté `I/J/K`, Toth–Szilágyi–Gulyás `F/G/H`, a Farkas-csapat lapjai `D/E/F`). Státusz: `100% Leadva💰`, `Elszámolt🍻`. A HÓNAP oszlop a termelési hónap (ÉÉÉÉHH); a hónap az első kedd utáni pénteken vált.
- **Firestore**: felhasználók (`users`: role, asszisztens, admin), flotta (`perf/<jelszóhash>/fl_rows`), asszisztensi feladatok (`…/atasks`), nyilvános flotta-lekérdezés (`perf/pub-flotta-v1/fl_pub/<hash>`, a Flotta oldal írja).
- Bejelentkezés: `auth.js` (Google), a `window.CSK` a felhasználót adja (`user`, `isAdmin`, `asszisztens`, `ready`).

## Negyedéves számok
- A lapokon a teljesítmény **csak az aktuális termelési hónap** (100% Leadva + Elszámolt). A **negyedév összegét az oldalak számolják** (`negyedev.html`, `index.html` `quarterTeams`, `verseny.html`): a lezárt hónapok **befagyasztott** értéke + az élő hónapok (`people[].proc`).
- A lezárt hónapok a táblázat **"Havi zárás"** lapjáról jönnek (`closed` mező a szkript válaszában: hónap, név, leadva, elszámolt, összesen, rögzítve, kampány ES). Az `apps-script/havi-zaras.gs` napi triggere írja be az új hónapot.
- **A neveknél a lap neve számít** (pl. `Vas Marcsi`), nem az A1 cella (`Vas Marietta`), különben duplán jelenik meg a személy.
- Az Erdélyi incentive (`verseny.html`): a rangsor a kampányegységek összege szerint; a kampánytermékek hónaponként a `Kód.gs` `CAMPAIGN` listájában vannak; kézi befagyasztás: `FROZEN`.

## Flotta (`csapatkassza.html`)
- A sor típusa: mobilszám vagy `tipus: "keszulek"` (+ `gazda` = akinek a száma alá tartozik). A régi, telefonszám nélküli sorokat név alapján találgatja. A nyilvános ügyfél-lekérdezés (`flotta-fizetes.html`) az admin oldal betöltésekor frissül (`fpubSync`), tehát a változás látszik, ha az admin Flotta oldalt megnyitják.

## Egyéb
- `teljesitmeny-szerk.html` és a `feladatok-*.html` változatok ugyanazt a kódot használják: módosításnál nézd meg, melyikben kell még.
- Az oldalak statikus fájljai **nyilvánosak**, a jelszókérő csak a felületet takarja: **soha ne tegyél a repóba jelszót, tokent, bankszámlaszámot, munkatársak teljesítményadatait**.
- Nincs tesztkészlet: az inline szkriptet `node -e "new Function(...)"`-nel szintaxisra ellenőrizd, a működést Playwrighttal (route-mock a Firestore-ra és az Apps Scriptre).
- A tulajdonos rövid, lényegre törő válaszokat kér, fájlt csak kérésre készíts, és szóljon, ha egy feladat sok tokent visz (akkor Gemini is szóba jön).
