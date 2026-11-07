/* Google-belépés + fehérlista + szintek (Firebase Auth + Firestore users/config) */
const V = "https://www.gstatic.com/firebasejs/10.14.1/";
const ADMIN = "csikos.mate.ovb@gmail.com";
const ROLES = { bl: "BL", gts: "GST", vezetojelolt: "Vezetőjelölt", reprezentans: "Reprezentáns", gyakornok: "Gyakornok", asszisztens: "Asszisztens" };
const MODULES = { 1: "Modul I", 2: "Modul II", 3: "Modul III" };
const CSK = window.CSK = { ROLES, MODULES, ADMIN, user: null, role: null, modul: 0, asszisztens: false, isAdmin: false, tags: [], name: "", denied: "", ready: null };
const top_ = self === top;
const page = (location.pathname.split("/").pop() || "index.html");
const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }, del(k) { try { localStorage.removeItem(k); } catch (e) {} } };

CSK.ready = (async function () {
  const [A, Au, Fs] = await Promise.all([import(V + "firebase-app.js"), import(V + "firebase-auth.js"), import(V + "firebase-firestore.js")]);
  const cfg = await fetch("firebase-config.json").then(r => r.json());
  const app = A.getApps().length ? A.getApp() : A.initializeApp(cfg);
  const auth = Au.getAuth(app), db = Fs.getFirestore(app);
  Object.assign(CSK, { Au, Fs, auth, db, app });
  CSK.signIn = () => Au.signInWithPopup(auth, new Au.GoogleAuthProvider());
  CSK.signOut = () => Au.signOut(auth);

  let acc = {};
  try {
    const sm = await Fs.getDoc(Fs.doc(db, "config", "sitemap"));
    if (sm.exists() && sm.data().json) { const m = JSON.parse(sm.data().json); (m.items || []).forEach(it => { if (it.href && it.href.indexOf("#") < 0) acc[it.href] = it.access || "public"; }); }
    else { const s = await Fs.getDoc(Fs.doc(db, "config", "access")); if (s.exists()) acc = s.data().pages || {}; }
  } catch (e) { acc = JSON.parse(ls.get("csk_acc") || "{}"); }
  CSK.access = acc; ls.set("csk_acc", JSON.stringify(acc));

  await new Promise(res => Au.onAuthStateChanged(auth, async u => {
    CSK.user = null; CSK.role = null; CSK.name = ""; CSK.modul = 0; CSK.asszisztens = false; CSK.isAdmin = false; CSK.tags = [];
    if (u && u.email) {
      const em = u.email.toLowerCase();
      let d = null;
      try { const s = await Fs.getDoc(Fs.doc(db, "users", em)); if (s.exists()) d = s.data(); } catch (e) {}
      if (em === ADMIN) { CSK.isAdmin = true; CSK.user = em; CSK.role = d && ROLES[d.role] ? d.role : "bl"; CSK.modul = d && (d.role === "vezetojelolt" || d.role === "reprezentans") && MODULES[d.modul] ? +d.modul : 0; CSK.asszisztens = !!(d && d.asszisztens); CSK.name = (d && d.name) || u.displayName || "Csikós Máté"; }
      else if (d && ROLES[d.role]) { CSK.user = em; CSK.role = d.role; CSK.name = d.name || u.displayName || em; CSK.asszisztens = !!d.asszisztens; CSK.isAdmin = d.admin === true; CSK.modul = (d.role === "vezetojelolt" || d.role === "reprezentans") && MODULES[d.modul] ? +d.modul : 0; }
      else { CSK.denied = em; await Au.signOut(auth); }
    }
    if (CSK.role) { CSK.tags = (CSK.isAdmin ? ["admin"] : []).concat([CSK.role],CSK.modul ? ["vj" + CSK.modul] : [], CSK.asszisztens && CSK.role !== "asszisztens" ? ["asszisztens"] : []); ls.set("csk_tags", JSON.stringify(CSK.tags)); } else ls.del("csk_tags");
    res();
  }));
  render();
  Au.onAuthStateChanged(auth, () => {});
  return CSK;
})().catch(e => { console.warn("auth", e); });

function allowed(rule, role) {
  if (!rule || rule === "public") return true;
  if (!role) return false;
  if (role === "admin" || CSK.isAdmin || rule === "any") return true;
  return Array.isArray(rule) && CSK.tags.some(t => rule.indexOf(t) >= 0);
}
CSK.allowed = allowed;

function css() {
  if (document.getElementById("csk-auth-css")) return;
  const s = document.createElement("style"); s.id = "csk-auth-css";
  s.textContent = `
  html.csk-prelock body > *:not(#csk-lock) { visibility: hidden !important; }
  .csk-u { margin-left: auto; flex: none; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
  @media (max-width: 640px) { .csk-u small { display: none; } }
  .csk-u button, #csk-lock button { font: inherit; font-weight: 700; cursor: pointer; border-radius: 999px; padding: 7px 14px; border: 1px solid currentColor; background: transparent; color: inherit; }
  .csk-u small { opacity: .75; font-weight: 600; }
  .csk-u .csk-b { background: #003b95; border-color: #003b95; color: #fff; }
  #csk-lock { position: fixed; inset: 0; z-index: 99999; background: #001f3d; color: #fff; display: grid; place-items: center; padding: 20px; font-family: "Instrument Sans", system-ui, sans-serif; }
  #csk-lock .box { max-width: 420px; text-align: center; background: #003366; border: 3px solid #00305a; border-radius: 18px; padding: 28px 24px; }
  #csk-lock h2 { margin: 0 0 10px; font-size: 1.5rem; } #csk-lock p { margin: 0 0 18px; color: #99bbdd; line-height: 1.45; }
  #csk-lock button { background: #ff99cc; color: #001f3d; border-color: #ff99cc; padding: 12px 22px; font-size: 1rem; }
  #csk-lock a { display: block; margin-top: 14px; color: #99bbdd; font-size: .9rem; }
  #csk-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); background: #c8102e; color: #fff; padding: 12px 18px; border-radius: 10px; z-index: 99998; font-weight: 600; max-width: 90vw; }`;
  document.head.appendChild(s);
}

function render() {
  document.documentElement.classList.remove("csk-prelock");
  if (!top_) return;
  css();
  const inn = document.querySelector(".topnav .in");
  if (inn && !inn.querySelector(".csk-u")) {
    const li = document.createElement("div"); li.className = "csk-u"; inn.appendChild(li);
  }
  const li = document.querySelector(".csk-u");
  if (li) {
    li.textContent = "";
    if (CSK.role) {
      const sp = document.createElement("span"); sp.innerHTML = ""; const n = document.createElement("small"); n.textContent = (CSK.name.split(" ")[0] || CSK.user) + " · " + ROLES[CSK.role] + (CSK.modul ? " (" + MODULES[CSK.modul] + ")" : "") + (CSK.asszisztens && CSK.role !== "asszisztens" ? " + Asszisztens" : "") + (CSK.isAdmin ? " + Admin" : "");
      const b = document.createElement("button"); b.type = "button"; b.textContent = "Kilépés"; b.onclick = () => CSK.signOut().then(() => location.reload());
      li.appendChild(n); li.appendChild(b);
    } else {
      const b = document.createElement("button"); b.type = "button"; b.className = "csk-b"; b.textContent = "Belépés"; b.onclick = () => CSK.signIn().then(() => location.reload()).catch(e => toast("A belépés nem sikerült: " + (e && e.code || e)));
      li.appendChild(b);
    }
  }
  if (CSK.denied) toast("Ez a Google-fiók (" + CSK.denied + ") nincs engedélyezve. Kérd meg Mátét, hogy vegyen fel a listára.");
  const old = document.getElementById("csk-lock"); if (old) old.remove();
  const rule = (CSK.access || {})[page];
  if (!allowed(rule, CSK.role)) lock(!CSK.role);
}

function toast(t) {
  const d = document.createElement("div"); d.id = "csk-toast"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 9000);
}
function lock(needLogin) {
  const d = document.createElement("div"); d.id = "csk-lock";
  const box = document.createElement("div"); box.className = "box";
  box.innerHTML = "<h2></h2><p></p>";
  box.querySelector("h2").textContent = needLogin ? "Belépés szükséges" : "Ehhez az oldalhoz nincs jogosultságod";
  box.querySelector("p").textContent = needLogin ? "Lépj be a Google-fiókoddal. Csak a listán szereplő munkatársak léphetnek be." : "A te pozíciód (" + ROLES[CSK.role] + (CSK.modul ? ", " + MODULES[CSK.modul] : "") + (CSK.asszisztens && CSK.role !== "asszisztens" ? ", asszisztens" : "") + ") ehhez az oldalhoz nem ad hozzáférést.";
  if (needLogin) { const b = document.createElement("button"); b.type = "button"; b.textContent = "Belépés Google-fiókkal"; b.onclick = () => CSK.signIn().then(() => location.reload()).catch(e => toast("A belépés nem sikerült: " + (e && e.code || e))); box.appendChild(b); }
  const a = document.createElement("a"); a.href = "index.html"; a.textContent = "← Vissza a főoldalra"; if (page !== "index.html") box.appendChild(a);
  d.appendChild(box); document.body.appendChild(d);
}
