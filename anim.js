/* Oldaltérkép: a menüt az admin "Oldaltérkép" csempéje szabja meg (config/sitemap). Gyorsítótár: localStorage csk_sitemap */
(function () {
  var m = null; try { m = JSON.parse(localStorage.getItem("csk_sitemap") || "null"); } catch (e) {}
  window.__cskMap = m && m.items ? m : null;
  window.__cskKids = function (id) { return ((window.__cskMap && window.__cskMap.items) || []).filter(function (x) { return x.parent === id; }); };
  if (self !== top) return;
  fetch("firebase-config.json").then(function (r) { return r.json(); }).then(function (c) {
    return fetch("https://firestore.googleapis.com/v1/projects/" + c.projectId + "/databases/(default)/documents/config/sitemap?key=" + c.apiKey);
  }).then(function (r) { return r.status === 404 ? null : r.json(); }).then(function (d) {
    var j = (d && d.fields && d.fields.json && d.fields.json.stringValue) || "", old = localStorage.getItem("csk_sitemap") || "";
    if (j === old) return;
    if (j) localStorage.setItem("csk_sitemap", j); else localStorage.removeItem("csk_sitemap");
    if (sessionStorage.getItem("csk_smr") === j) return; sessionStorage.setItem("csk_smr", j); location.reload();
  }).catch(function () {});
})();
/* Közös animációk: minden kattintásra visszajelzés (hullám + lenyomás), oldal be-/kifakulás */

/* Oldalsó menüsáv: ikonok + címek, összecsukható (összecsukva csak az ikon látszik) */
(function () {
  var IC = {
    naptar: '<rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    index: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    negyedev: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    verseny: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    kassza: '<path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2"/><circle cx="16.5" cy="14.5" r="1"/>',
    elemzo: '<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6zM6 3v18M9.5 8h6M9.5 12h6"/>',
    teljesitmeny: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    vizsga: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1 3 3 6 3s6-2 6-3v-5"/>',
    ppt: '<path d="M3 4h18v12H3zM8 20h8M12 16v4"/>',
    admin: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'
  };
  function icon(href, txt) {
    var h = href || "";
    if (h.indexOf("negyedev") === 0) return IC.negyedev; if (h.indexOf("verseny") === 0) return IC.verseny;
    if (h.indexOf("csapatkassza") === 0) return IC.kassza; if (h.indexOf("elemzo") === 0) return IC.elemzo;
    if (h.indexOf("teljesitmeny") === 0) return IC.teljesitmeny; if (h.indexOf("vizsga") === 0) return IC.vizsga;
    if (/development/i.test(txt || "")) return IC.vizsga; if (h.indexOf("gyakorlo") === 0) return IC.star;
    if (h.indexOf("index") === 0) return IC.index; if (h.indexOf("kampanynaptar") === 0) return IC.naptar; if (/PPT/i.test(txt)) return IC.ppt; return IC.star;
  }
  function init() {
    var nav = document.querySelector(".topnav"), host = nav && nav.querySelector(".in"), ul = host && host.querySelector("ul");
    if (!ul || self !== top || document.querySelector(".csk-sidebar")) return;
    if (window.__cskMap) {
      var curF = (location.pathname.split("/").pop() || "index.html"); ul.textContent = "";
      window.__cskKids("menu").forEach(function (it) {
        if (it.menu === "hidden") return;
        var li = document.createElement("li"), an = document.createElement("a"), lk = it.menu === "locked";
        an.textContent = it.title + (lk ? " 🔒" : "");
        if (!lk) { an.setAttribute("href", it.href || ("#g-" + it.id)); if (it.href && it.href === curF) an.setAttribute("aria-current", "page"); }
        li.appendChild(an); ul.appendChild(li);
      });
    }
    var root = document.documentElement, KEY = "csk_side", mobile = function () { return window.innerWidth < 800; };
    var st = document.createElement("style");
    st.textContent =
      "html.csk-side{--csk-sw:264px}html.csk-side.csk-rail{--csk-sw:68px}" +
      ".topnav ul{display:none!important}" +
      "html.csk-side body{padding-left:var(--csk-sw)!important;transition:padding-left .22s ease}" +
      "html.csk-side .topnav{padding-left:var(--csk-sw)!important;transition:padding-left .22s ease}" +
      ".csk-sidebar{position:fixed;top:57px;left:0;bottom:0;width:var(--csk-sw);background:var(--bg);border-right:1px solid var(--track);z-index:35;padding:10px 10px 16px;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;gap:3px;transition:width .22s ease,transform .22s ease;scrollbar-width:none}" +
      ".csk-sidebar::-webkit-scrollbar{display:none}" +
      ".csk-sidebar a,.csk-sidebar button.csk-tg{display:flex;align-items:center;gap:14px;height:44px;padding:0 13px;border-radius:12px;color:var(--ink);text-decoration:none;font:inherit;font-weight:600;font-size:.95rem;white-space:nowrap;border:0;background:none;cursor:pointer;width:100%;text-align:left;box-sizing:border-box}" +
      ".csk-sidebar svg{flex:none;width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}" +
      ".csk-sidebar a:hover,.csk-sidebar button.csk-tg:hover{background:var(--track)}" +
      ".csk-sidebar a[aria-current=page]{background:var(--accent);color:var(--on-accent,#fff)}" +
      ".csk-sidebar a[aria-disabled=true]{opacity:.5;cursor:default;pointer-events:none}" +
      ".csk-sidebar .csk-tg{margin-bottom:6px;color:var(--muted)}.csk-sidebar .csk-tg svg{transition:transform .22s}" +
      "html.csk-rail .csk-sidebar .csk-tg svg{transform:rotate(180deg)}" +
      ".csk-sidebar .lb{overflow:hidden;text-overflow:ellipsis;transition:opacity .15s}" +
      "html.csk-rail .csk-sidebar .lb{opacity:0;width:0}html.csk-rail .csk-sidebar a,html.csk-rail .csk-sidebar button.csk-tg{padding:0;justify-content:center;gap:0}" +
      "@media (min-width:800px){html.csk-rail .csk-sidebar.csk-peek{width:264px;box-shadow:8px 0 30px rgba(0,0,0,.16)}" +
      "html.csk-rail .csk-sidebar.csk-peek .lb{opacity:1;width:auto}html.csk-rail .csk-sidebar.csk-peek a,html.csk-rail .csk-sidebar.csk-peek button.csk-tg{padding:0 13px;justify-content:flex-start;gap:14px}}" +
      ".csk-mbtn{display:none;align-items:center;justify-content:center;width:40px;height:40px;margin-right:6px;border:0;border-radius:12px;background:var(--track);color:var(--ink);cursor:pointer;flex:none}" +
      ".csk-mbtn svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}" +
      ".csk-bd{display:none;position:fixed;inset:57px 0 0 0;background:rgba(0,0,0,.4);z-index:34}" +
      "@media (max-width:799px){html.csk-side{--csk-sw:0px}html.csk-side body,html.csk-side .topnav{padding-left:0!important}" +
      ".csk-sidebar{width:260px;transform:translateX(-100%);box-shadow:none}html.csk-mopen .csk-sidebar{transform:none;box-shadow:0 0 40px rgba(0,0,0,.35)}html.csk-mopen .csk-bd{display:block}" +
      "html.csk-rail .csk-sidebar .lb{opacity:1;width:auto}html.csk-rail .csk-sidebar a{padding:0 13px;justify-content:flex-start;gap:14px}.csk-mbtn{display:inline-flex}.csk-sidebar button.csk-tg{display:none!important}}";
    document.head.appendChild(st);
    var side = document.createElement("nav"); side.className = "csk-sidebar"; side.setAttribute("aria-label", "Oldalsó menü");
    function svg(inner) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + inner + "</svg>"; }
    
    var lis = document.createElement("ul"); lis.style.cssText = "list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px";
    ul.querySelectorAll("li > a").forEach(function (a) {
      var href = a.getAttribute("href"), txt = a.textContent.replace(/\s*🔒\s*/, "").trim(), lock = /🔒/.test(a.textContent);
      var li = document.createElement("li"), n = document.createElement("a");
      if (href && !lock) n.href = href; else n.setAttribute("aria-disabled", "true");
      if (a.getAttribute("aria-current")) n.setAttribute("aria-current", a.getAttribute("aria-current"));
      n.title = txt + (lock ? " (hamarosan)" : "");
      n.innerHTML = svg(icon(href, txt)) + '<span class="lb">' + txt.replace(/</g, "&lt;") + (lock ? " 🔒" : "") + "</span>";
      li.appendChild(n); lis.appendChild(li);
    });
    side.appendChild(lis);
    /* ADMIN: mindig a menü legalján, a többi ponttól elválasztva */
    var adm = document.createElement("ul"); adm.className = "csk-adm";
    adm.style.cssText = "list-style:none;margin:auto 0 0;padding:8px 0 0;border-top:1px solid var(--track);display:flex;flex-direction:column;gap:3px";
    var ali = document.createElement("li"), aa = document.createElement("a");
    aa.href = "admin.html"; aa.title = "ADMIN";
    if (/(^|\/)admin\.html$/.test(location.pathname)) aa.setAttribute("aria-current", "page");
    aa.innerHTML = svg(IC.admin) + '<span class="lb">ADMIN</span>';
    ali.appendChild(aa); adm.appendChild(ali); side.appendChild(adm);
    document.body.appendChild(side);
    var bd = document.createElement("div"); bd.className = "csk-bd"; document.body.appendChild(bd);
    var mb = document.createElement("button"); mb.type = "button"; mb.className = "csk-mbtn"; mb.setAttribute("aria-label", "Menü");
    mb.innerHTML = svg('<path d="M4 7h16M4 12h16M4 17h16"/>'); host.insertBefore(mb, host.firstChild);
    var pt = 0;
    side.addEventListener("mouseenter", function () { clearTimeout(pt); side.classList.add("csk-peek"); });
    side.addEventListener("mouseleave", function (e) { clearTimeout(pt); if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".csk-sub")) return; side.classList.remove("csk-peek"); });
    root.classList.add("csk-side", "csk-rail");
    function closeM() { root.classList.remove("csk-mopen"); }
    mb.addEventListener("click", function () { root.classList.toggle("csk-mopen"); });
    bd.addEventListener("click", closeM); side.addEventListener("click", function (e) { if (e.target.closest("a[href]") && mobile()) closeM(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeM(); });
    window.addEventListener("resize", function () { if (!mobile()) closeM(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

/* Almenü: a lefelé nyíllal jelölt menüpontra kattintva lenyílnak az aloldalak */
(function () {
  var SUB = { "verseny.html": [["Erdélyi Incentive", "verseny.html#erdely"], ["Téli Incentive", "verseny.html#teli"], ["2026 Lengyelország karácsony", "verseny.html#lengyel"]]};
  if (window.__cskMap) { SUB = {}; window.__cskKids("menu").forEach(function (it) { var vis = window.__cskKids(it.id).filter(function (c) { return c.menu !== "hidden"; }); if (vis.length && it.menu !== "locked" && it.menu !== "hidden") SUB[it.href || ("#g-" + it.id)] = vis.map(function (c) { return [c.title, c.href || "#"]; }); }); }   // csak akkor lesz lenyíló, ha van látható almenüpont
  function init() {
    var nav = document.querySelector(".topnav"); if (!nav) return;
    var st = document.createElement("style");
    st.textContent = ".csk-sub{position:fixed;z-index:60;min-width:210px;padding:6px;border-radius:14px;background:var(--bg,#fff);color:var(--ink,#111);border:1px solid var(--track,#ddd);box-shadow:0 10px 30px rgba(0,0,0,.18);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .16s ease,transform .16s ease}" +
      ".csk-sub.on{opacity:1;transform:none;pointer-events:auto}.csk-sub a{display:block;padding:9px 14px;border-radius:10px;color:inherit;text-decoration:none;font-weight:600;white-space:nowrap}.csk-sub a:hover,.csk-sub a:focus-visible{background:var(--track,#eee)}";
    st.textContent += ".csk-sub.inl{position:static;min-width:0;margin:0;padding:0;border:0;box-shadow:none;background:transparent;transform:none;border-radius:0;max-height:0;overflow:hidden;opacity:0;transition:max-height .26s ease,opacity .2s ease,margin .26s ease,padding .26s ease}.csk-sub.inl.on{margin:2px 0 6px;padding:2px 0;opacity:1}.csk-sub.inl.nt{transition:none}.csk-sub.inl a{transform:translateY(-4px);transition:transform .26s ease,background-color .2s ease}.csk-sub.inl.on a{transform:none}@media (prefers-reduced-motion:reduce){.csk-sub,.csk-sub a{transition:none!important}}.csk-sidebar .csk-sub.inl a{display:block!important;height:auto!important;padding:7px 12px 7px 49px!important;font-size:.9rem;font-weight:600;border-radius:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}html.csk-rail .csk-sidebar:not(.csk-peek) .csk-sub.inl{display:none}";
    st.textContent += ".csk-sub a.cur{background:var(--accent,#036);color:var(--on-accent,#fff)}html.csk-hastabs .vtabs,html.csk-hastabs .vtabs2,html.csk-hastabs #ktabs{display:none!important}";
    document.head.appendChild(st); document.documentElement.classList.add("csk-hastabs");
    var box = document.createElement("div"); box.className = "csk-sub"; document.body.appendChild(box);
    st.textContent += ".csk-chev{display:inline-flex;margin-left:auto;padding-left:6px;opacity:.75;transition:transform .2s ease}.csk-chev svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}a.csk-open .csk-chev{transform:rotate(180deg)}.topnav .csk-chev{margin-left:4px;padding-left:0;vertical-align:middle}html.csk-rail .csk-sidebar:not(.csk-peek) .csk-chev{display:none}";
    var cur = null;
    function hide() {
      if (box.classList.contains("inl") && box.classList.contains("on") && box.parentNode) {
        var g = box.cloneNode(true); g.style.maxHeight = box.scrollHeight + "px"; box.parentNode.insertBefore(g, box);
        box.classList.add("nt"); box.classList.remove("on"); box.style.maxHeight = "0px"; void box.offsetWidth; box.classList.remove("nt");
        void g.offsetWidth; g.classList.remove("on"); g.style.maxHeight = "0px"; setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 320);
      } else box.classList.remove("on");
      if (cur) { cur.classList.remove("csk-open"); cur.setAttribute("aria-expanded", "false"); } cur = null;
    }
    document.querySelectorAll(".topnav li > a[href], .csk-sidebar li > a[href]").forEach(function (a) {
      var fullH = a.getAttribute("href") || "", key = fullH.split("#")[0]; var items = SUB[fullH] || SUB[key]; if (!items) return;
      var ch = document.createElement("span"); ch.className = "csk-chev"; ch.setAttribute("aria-hidden", "true"); ch.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'; a.appendChild(ch);
      a.setAttribute("aria-haspopup", "true"); a.setAttribute("aria-expanded", "false");
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        e.preventDefault(); e.stopPropagation();
        if (cur === a) { hide(); a.setAttribute("aria-expanded", "false"); return; }
        hide(); open(); a.setAttribute("aria-expanded", "true");
      });
      function open() {
        cur = a; a.classList.add("csk-open"); box.textContent = "";
        var list = items.slice(), pageHref = fullH.charAt(0) === "#" ? "" : fullH;
        // saját oldallal rendelkező menüpontnál az első elem maga az oldal, hogy a szülő is megnyitható legyen (ha egy almenüpont már ugyanarra az oldalra visz, nem kell)
        if (window.__cskMap && pageHref && !list.some(function (x) { return x[1].split("#")[0] === pageHref; })) list.unshift([(a.textContent || "").trim() || pageHref, pageHref]);
        list.forEach(function (it) { var l = document.createElement("a"); l.href = it[1]; l.textContent = it[0];
          var h = location.hash, onPage = location.pathname.split("/").pop() === key;
          var curKey = ""; try { curKey = key === "csapatkassza.html" ? (h === "#flotta" || h === "#iroda" ? h : "#kassza") : key === "verseny.html" ? (h === "#teli" || h === "#lengyel" ? h : "#erdely") : key === "admin.html" ? (h || "#konyveles") : (h ? h : (sessionStorage.getItem("tj_view") === "as" ? "#asszisztens" : "#elemzesek")); } catch (e) {}
          if (onPage && it[1].slice(it[1].indexOf("#")) === curKey) l.className = "cur";
          box.appendChild(l); });
        var r = a.getBoundingClientRect(), sd = !!a.closest(".csk-sidebar");
        if (sd) { box.classList.add("inl", "nt"); box.classList.remove("on"); box.style.maxHeight = "0px"; box.style.top = box.style.left = ""; a.parentNode.appendChild(box); void box.offsetWidth; box.classList.remove("nt"); box.classList.add("on"); box.style.maxHeight = box.scrollHeight + "px"; return; }
        else { box.classList.remove("inl"); box.style.maxHeight = ""; document.body.appendChild(box); box.style.top = (r.bottom + 4) + "px"; box.style.left = Math.max(8, Math.min(r.left, innerWidth - 230)) + "px"; }
        box.classList.add("on");
      }
    });
    var sb = document.querySelector(".csk-sidebar");
    if (sb) sb.addEventListener("mouseleave", function () { if (cur && cur.closest(".csk-sidebar") && !document.documentElement.classList.contains("csk-mopen")) hide(); });
    document.addEventListener("click", function (e) { if (cur && !box.contains(e.target) && !cur.contains(e.target)) hide(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
    box.addEventListener("click", function () { setTimeout(hide, 0); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
(function () {
  if (window.__cskAnim) return; window.__cskAnim = 1;
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var st = document.createElement("style");
  st.textContent =
    "@keyframes cskPage{from{opacity:0}to{opacity:1}}@keyframes cskPageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
    "@keyframes cskRip{from{transform:translate(-50%,-50%) scale(0);opacity:.35}to{transform:translate(-50%,-50%) scale(1);opacity:0}}" +
    "@keyframes cskPop{0%{transform:scale(1)}40%{transform:scale(.94)}100%{transform:scale(1)}}" +
    "body{animation:cskPage .35s ease backwards}" +
    "body.csk-leave{opacity:0;transition:opacity .18s ease}" +
    "button,summary,[role=button],[role=tab],select,input[type=submit],input[type=date],label{transition:transform .15s ease,filter .15s ease,box-shadow .2s ease,background-color .2s ease,border-color .2s ease,color .2s ease,opacity .2s ease}" +
    "button:not(:disabled):active,summary:active,[role=button]:active,[role=tab]:active,input[type=submit]:active{transform:scale(.95)}" +
    "a{transition:color .2s ease,opacity .2s ease,background-color .2s ease}" +
    "a:active{opacity:.7}" +
    ".csk-rip{position:fixed;z-index:2147483000;width:140px;height:140px;border-radius:50%;background:currentColor;pointer-events:none;animation:cskRip .55s ease-out forwards}" +
    ".csk-pop{animation:cskPop .3s ease}" +
    "details>summary~*{animation:cskPageIn .3s ease both}" +
    "@keyframes cskIn{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}" +
    "@keyframes cskDrop{from{opacity:0;transform:translateY(-8px);clip-path:inset(0 0 100% 0 round 14px)}to{opacity:1;transform:none;clip-path:inset(0 0 0 0 round 14px)}}" +
    ".csk-in{animation:cskIn .42s cubic-bezier(.22,1,.36,1) both}" +
    ".csk-drop{animation:cskDrop .3s cubic-bezier(.22,1,.36,1) both!important}" +
    "input,select,textarea{transition:border-color .2s ease,box-shadow .2s ease,background-color .2s ease}" +
    "input:focus,select:focus,textarea:focus{box-shadow:0 0 0 3px rgba(120,150,255,.25)}" +
    "button:not(:disabled):hover,summary:hover,[role=tab]:hover{filter:brightness(1.07)}" +
    "input[type=checkbox],input[type=radio]{transition:transform .15s ease}" +
    "input[type=checkbox]:active,input[type=radio]:active{transform:scale(.8)}" +
    "@media (prefers-reduced-motion:reduce){.csk-in,.csk-drop,body,body.csk-leave,.csk-rip,.csk-pop,details>summary~*{animation:none!important;transition:none!important}.csk-rip{display:none}}";
  document.head.appendChild(st);
  if (rm) return;
  var SEL = "button,a,summary,[role=button],[role=tab],label,select,input,.tab,.mt,.zm>button";
  document.addEventListener("pointerdown", function (e) {
    var t = e.target.closest && e.target.closest(SEL); if (!t || t.disabled) return;
    var r = document.createElement("span"); r.className = "csk-rip";
    var cs = getComputedStyle(t); r.style.color = cs.color || "#888";
    r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
    document.body.appendChild(r); setTimeout(function () { r.remove(); }, 600);
  }, { passive: true });
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("button,summary,[role=tab],input[type=checkbox],input[type=radio],label,.card,[onclick]");
    if (t) { t.classList.remove("csk-pop"); void t.offsetWidth; t.classList.add("csk-pop"); setTimeout(function () { t.classList.remove("csk-pop"); }, 350); }
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var h = a.getAttribute("href") || "";
    if (a.target === "_blank" || a.hasAttribute("download") || /^(#|mailto:|tel:|javascript:)/.test(h) || a.origin !== location.origin) return;
    if (a.pathname === location.pathname && a.search === location.search) return;
    e.preventDefault(); document.body.classList.add("csk-leave");
    setTimeout(function () { location.href = a.href; }, 170);
  });
  /* Bármi, ami a felhasználó művelete után megjelenik (felnyíló panel, új sor, fülváltás), beúszik */
  var lastIn = 0, t0 = Date.now();
  ["pointerdown", "keydown", "change"].forEach(function (n) { document.addEventListener(n, function () { lastIn = Date.now(); }, true); });
  function animIn(el) {
    if (el.nodeType !== 1 || /^(SCRIPT|STYLE|LINK|OPTION|TR|TD|TH|LI|BR)$/.test(el.tagName) || /csk-/.test(el.className || "")) return;
    var cs = getComputedStyle(el); if (cs.display === "none" || (cs.animationName && cs.animationName !== "none")) return;
    el.classList.add(el.closest(".zm") && el.classList.contains("panel") ? "csk-drop" : "csk-in");
    setTimeout(function () { el.classList.remove("csk-in", "csk-drop"); }, 600);
  }
  new MutationObserver(function (ms) {
    if (Date.now() - lastIn > 1500 || Date.now() - t0 < 500) return;
    var added = [];
    ms.forEach(function (m) {
      if (m.type === "attributes") { if (m.attributeName === "hidden" && !m.target.hidden) animIn(m.target); }
      else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) added.push(n); });
    });
    if (added.length && added.length <= 3) added.forEach(animIn);
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] });
  window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("csk-leave"); });
})();

/* Csapat-logók a fejlécben a „Csikós BL csapat” felirat előtt: csikós → Csikós csapat főoldala, oroszlán → Ónodi csapat (Start bónusz) */
(function () {
  function go() {
    var b = document.querySelector(".topnav .brand"); if (!b || document.querySelector(".csk-logos")) return;
    var st = document.createElement("style");
    st.textContent = ".csk-logos{display:inline-flex;align-items:center;gap:6px;margin-right:10px;flex:none}" +
      ".csk-logos a{display:inline-flex;width:34px;height:34px;border-radius:50%;align-items:center;justify-content:center;transition:transform .18s ease,background .2s ease}" +
      ".csk-logos a:hover{transform:scale(1.1);background:var(--track,#e5e5e5)}.csk-logos a:focus-visible{outline:3px solid var(--accent,#003366);outline-offset:2px}" +
      ".csk-logos .lg-k{display:block;width:30px;height:30px;background:var(--ink,#003366);-webkit-mask:url(ikon/csikos-96.png) center/contain no-repeat;mask:url(ikon/csikos-96.png) center/contain no-repeat}" +
      ".csk-logos img{width:26px;height:26px;display:block}.csk-logos a.lg-o,.csk-logos a.lg-c{background:#eaf3ff}.csk-logos a.lg-o:hover,.csk-logos a.lg-c:hover{background:#d6e8ff}.csk-logos a.lg-c .lg-k{background:#003366;width:26px;height:26px}.csk-logos a.lg-f{background:#eaf3ff}.csk-logos a.lg-f:hover{background:#d6e8ff}.csk-logos .lg-v{display:block;width:22px;height:22px;background:#0f7a45;-webkit-mask:url(ikon/villam-96.png) center/contain no-repeat;mask:url(ikon/villam-96.png) center/contain no-repeat}" +
      "@media (max-width:640px){.topnav .csk-logos{display:inline-flex!important}}";
    document.head.appendChild(st);
    var w = document.createElement("span"); w.className = "csk-logos";
    var a1 = document.createElement("a"); a1.className = "lg-c"; a1.href = "index.html"; a1.title = "Csikós csapat"; a1.setAttribute("aria-label", "Csikós csapat főoldala");
    var k = document.createElement("span"); k.className = "lg-k"; a1.appendChild(k);
    var a2 = document.createElement("a"); a2.className = "lg-o"; a2.href = "onodicsapat.html"; a2.title = "Ónodi csapat"; a2.setAttribute("aria-label", "Ónodi csapat – Start bónusz");
    var im = document.createElement("img"); im.src = "ikon/oroszlan-96.png"; im.alt = ""; a2.appendChild(im);
    var a3 = document.createElement("a"); a3.className = "lg-f"; a3.href = "http://felbercsapat.hu/"; a3.title = "Felber csapat"; a3.setAttribute("aria-label", "Felber csapat"); var vv = document.createElement("span"); vv.className = "lg-v"; a3.appendChild(vv);
    w.appendChild(a1); w.appendChild(a2); w.appendChild(a3); b.parentNode.insertBefore(w, b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();

/* Belépés (Google) – csak betöltés, a logika az auth.js-ben */
(function(){
  try{
    var k=(location.pathname.split("/").pop()||"index.html"),a=JSON.parse(localStorage.getItem("csk_acc")||"{}"),r=a[k],u=JSON.parse(localStorage.getItem("csk_tags")||"[]");
    if(self===top&&r&&r!=="public"&&!(u.length&&(u.indexOf("admin")>=0||r==="any"||(typeof r!=="string"&&u.some(function(t){return r.indexOf(t)>=0}))))){
      var st=document.createElement("style");st.textContent="html.csk-prelock body > *:not(#csk-lock){visibility:hidden!important}";document.head.appendChild(st);document.documentElement.classList.add("csk-prelock");
    }
  }catch(e){}
  var s=document.createElement("script");s.type="module";s.src="auth.js?v=9";document.head.appendChild(s);
})();

/* Revamp: anime.js (helyi anime.min.js) – lépcsőzetes beúszás, számlálók, haladássávok + finom vizuális frissítés.
   Csak :where()-es (0 specificitású) alapstílusok, így az oldalak saját szabályai mindig erősebbek. */
(function () {
  if (window.__cskRv || self !== top) return; window.__cskRv = 1;
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var st = document.createElement("style");
  st.textContent =
    ":root{--csk-shc:0,30,60;--csk-ease:cubic-bezier(.22,1,.36,1)}" +
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--csk-shc:0,0,0}}:root[data-theme=dark]{--csk-shc:0,0,0}" +
    "body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}" +
    ":where(h1,h2,h3){text-wrap:balance}:where(p,.lead,.note){text-wrap:pretty}" +
    "::selection{background:color-mix(in srgb,var(--hot,#ff3399) 26%,transparent)}" +
    "html{scrollbar-color:color-mix(in srgb,var(--ink,#036) 22%,transparent) transparent}" +
    /* Felületek: halk, kétrétegű árnyék */
    ":where(.card,.tile,.kpi,.news .item){box-shadow:0 1px 2px rgba(var(--csk-shc),.05),0 8px 24px -14px rgba(var(--csk-shc),.22);transition:transform .3s var(--csk-ease),box-shadow .3s ease,background-color .2s ease,border-color .2s ease}" +
    ":where(a.card,a.tile,.news .item,.tile[onclick],.card[onclick],.kpi[onclick]):hover{transform:translateY(-2px);box-shadow:0 2px 4px rgba(var(--csk-shc),.06),0 16px 32px -14px rgba(var(--csk-shc),.3)}" +
    /* Fejléc: áttetsző, elmosott háttér; görgetéskor finom árnyék */
    "html .topnav{background:color-mix(in srgb,var(--bg,#fff) 80%,transparent);-webkit-backdrop-filter:saturate(1.6) blur(14px);backdrop-filter:saturate(1.6) blur(14px);transition:box-shadow .25s ease,padding-left .22s ease}" +
    "html.csk-scr .topnav{box-shadow:0 10px 30px -18px rgba(var(--csk-shc),.35)}" +
    /* Gombok, sorok */
    ":where(.btn,a.btn,button.primary,.pri):not(:disabled):hover{transform:translateY(-1px)}" +
    ":where(.btn,a.btn,button.primary,.pri){transition:transform .2s var(--csk-ease),filter .15s ease,box-shadow .2s ease,background-color .2s ease,color .2s ease}" +
    ":where(table) tbody tr{transition:background-color .15s ease}:where(table) tbody tr:hover{background-color:color-mix(in srgb,var(--accent,#036) 5%,transparent)}" +
    ":where(.pill,.chip){transition:transform .2s var(--csk-ease),background-color .2s ease}" +
    "@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}" +
    "[data-rv='0']{opacity:0!important}" +
    "@media (prefers-reduced-motion:reduce){:where(.card,.tile,.kpi,.news .item,.btn):hover{transform:none!important}}";
  document.head.appendChild(st);
  function onScr() { document.documentElement.classList.toggle("csk-scr", scrollY > 4); }
  addEventListener("scroll", onScr, { passive: true }); onScr();
  if (rm) return;

  var A = null, t0 = Date.now(), lastAct = 0, lastKey = 0;
  ["pointerdown", "change"].forEach(function (n) { document.addEventListener(n, function () { lastAct = Date.now(); }, true); });
  ["keydown", "input"].forEach(function (n) { document.addEventListener(n, function () { lastKey = Date.now(); }, true); });
  /* Animálunk: betöltéskor, adatbetöltéskor (első 10 mp) és felhasználói művelet után; háttérfrissítésnél és gépelés közben nem. */
  function live() { var n = Date.now(); return n - lastKey > 900 && (n - t0 < 10000 || n - lastAct < 1500); }

  var CAND = ".card,.tile,.kpi,.news .item,.hero,main h1,.closes li,.links li,#csk-gate form > *";
  var SKIP = ".csk-sidebar,.topnav,.csk-sub,#csk-lock,dialog,[role=dialog],.csk-in,.csk-drop";
  var pend = [], all = [];
  function rect(el) { var r = el.getBoundingClientRect(); return r.width || r.height ? r : null; }
  function tag(el) {
    if (el.__rv || el.closest(SKIP) || !rect(el)) return;
    var p = el.parentElement && el.parentElement.closest("[data-rv]"); if (p && p.__rv) return;
    el.__rv = 1; el.__rvO = parseFloat(getComputedStyle(el).opacity) || 1;
    el.setAttribute("data-rv", "0"); all.push(el); io.observe(el);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); pend.push(e.target); } });
    if (pend.length) requestAnimationFrame(flush);
  }, { rootMargin: "0px 0px -6% 0px" });
  function show(el) { el.removeAttribute("data-rv"); el.style.removeProperty("opacity"); el.style.removeProperty("translate"); }
  function flush() {
    var q = pend.splice(0); if (!q.length) return;
    if (!A) { q.forEach(show); return; }
    q.sort(function (a, b) { return (a.__y = a.getBoundingClientRect().top) - (b.__y = b.getBoundingClientRect().top); });
    q.forEach(function (el, i) {
      var o = { v: 0 }, to = el.__rvO; el.style.opacity = "0"; el.removeAttribute("data-rv");
      A.animate(o, { v: 1, duration: 560, delay: Math.min(i * 45, 360), ease: "outCubic",
        onUpdate: function () { el.style.opacity = String(to * o.v); el.style.translate = "0 " + ((1 - o.v) * 14).toFixed(2) + "px"; },
        onComplete: function () { show(el); } });
      bars(el, 1); nums(el, 1);
    });
  }

  /* Számlálók: nagy (≥20px) számok 0-ról a végértékig */
  var NRE = /^\s*([+\-−]?)(\d{1,3}(?:[   .]\d{3})+|\d+)(?:,(\d+))?(\s*(?:%|Ft|e\s?Ft|M\s?Ft|MFt|db|ES|egység|nap|pont|pt|fő|M|millió)?)\s*$/i;
  function num(el) {
    if (el.childElementCount || el.closest(SKIP + ",[data-rv],input,textarea,select,option,button,.topnav")) return;
    var tx = el.textContent; if (!tx || tx.length > 24 || el.__w === tx) return;
    var m = NRE.exec(tx); if (!m) return;
    var sep = (m[2].match(/[   .]/) || [""])[0], dec = m[3] ? m[3].length : 0;
    var val = parseFloat(m[2].replace(/[   .]/g, "") + (dec ? "." + m[3] : ""));
    if (!val || (!m[4].trim() && !sep && val >= 1900 && val <= 2100 && !dec)) return;
    var r = el.getBoundingClientRect(); if (!r.width || r.top > innerHeight || r.bottom < 0 || parseFloat(getComputedStyle(el).fontSize) < 20) return;
    var lead = tx.slice(0, tx.indexOf(m[1] + m[2])), tail = tx.slice(tx.indexOf(m[2]) + m[2].length);
    function fmt(v) {
      var s = v.toFixed(dec), ip = s.split(".")[0], fp = s.split(".")[1];
      if (sep) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
      return lead + m[1] + ip + (dec ? "," + fp : "") + tail.replace(/^,\d+/, "");
    }
    var o = { v: 0 }, final = tx; el.__w = fmt(0); el.textContent = el.__w;
    var an = A.animate(o, { v: val, duration: 1100, ease: "outExpo",
      onUpdate: function () { if (el.textContent !== el.__w) { an.pause(); return; } el.__w = fmt(o.v); el.textContent = el.__w; },
      onComplete: function () { if (el.textContent === el.__w) { el.textContent = final; el.__w = final; } } });
  }
  function nums(root, force) {
    if (!A || !(force || live())) return;
    var els = root.matches && root.childElementCount === 0 ? [root] : root.querySelectorAll("b,strong,span,div,p,h1,h2,h3,h4,dd,output");
    for (var i = 0; i < els.length; i++) if (!els[i].childElementCount) num(els[i]);
  }

  /* Haladássávok: a kitöltés balról jobbra „söpör” be (clip-path, a szélességet nem bántjuk).
     Minden sáv külön indul, amikor görgetéskor a képernyőre ér; az egyszerre látszók kis lépcsőzéssel. */
  function kidsOf(p) { return [].slice.call(p.children).map(function (k) { return { k: k, c: k.style.clipPath }; }); }
  function clipAll(p, x, W) {
    var pr = p.getBoundingClientRect();
    p.__kids.forEach(function (d) {
      var r = d.k.getBoundingClientRect(), l = r.left - pr.left, w = r.width, vis = Math.max(0, Math.min(w, x - l));
      d.k.style.clipPath = "inset(0 " + (w - vis).toFixed(1) + "px 0 0)";
    });
  }
  var bq = [], bw = [];
  var bio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { bio.unobserve(e.target); bq.push(e.target); } });
    if (!bq.length) return;
    bw = bw.filter(function (p) { return bq.indexOf(p) < 0; });
    var q = bq.splice(0).sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
    q.forEach(function (p, i) {
      var o = { v: 0 }, W = p.getBoundingClientRect().width;
      A.animate(o, { v: 1, duration: 1000, delay: 80 + Math.min(i * 90, 540), ease: "inOutQuart",
        onUpdate: function () { clipAll(p, o.v * W, W); },
        onComplete: function () { p.__kids.forEach(function (d) { d.k.style.clipPath = d.c || ""; }); } });
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.6 });
  function bars(root, force) {
    if (!A || !(force || live())) return;
    var fs = root.querySelectorAll ? root.querySelectorAll("[style*='width']") : [], seen = [];
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i], p = f.parentElement; if (!/%\s*$/.test(f.style.width) || !p) continue;
      /* a szakaszok lehetnek egy belső rétegben is (pl. .bar > .sgs > i): a legközelebbi vágó (overflow:hidden) szülőig megyünk fel */
      for (var up = 0; up < 3 && p.parentElement && getComputedStyle(p).overflow === "visible"; up++) p = p.parentElement;
      if (p.__sw || seen.indexOf(p) >= 0) continue;
      var pr = p.getBoundingClientRect(); if (pr.height > 28 || pr.width < 60 || getComputedStyle(p).overflow === "visible") continue;
      seen.push(p);
    }
    seen.forEach(function (p) { p.__sw = 1; p.__kids = kidsOf(p); clipAll(p, 0); bio.observe(p); bw.push(p); });
  }
  /* Gyors görgetésnél (ugrásnál) átugrott sávok: azonnal teljesek, ne maradjanak üresen */
  var bt = 0;
  addEventListener("scroll", function () {
    if (bt || !bw.length) return;
    bt = requestAnimationFrame(function () {
      bt = 0;
      bw = bw.filter(function (p) {
        if (!p.isConnected) return false;
        if (p.getBoundingClientRect().bottom > 0) return true;
        bio.unobserve(p); p.__kids.forEach(function (d) { d.k.style.clipPath = d.c || ""; }); return false;
      });
    });
  }, { passive: true, capture: true });

  /* Kampánynaptár kereke: betöltéskor cikkelyenként (az óramutató szerint) beúszik, utána a heti gyűrű szakaszonként kitöltődik.
     Kattintáskor (újrarajzoláskor) nem animál újra. */
  var whDone = 0, whT0 = 0, whW = null, de = document.documentElement, WH_TOTAL = 3600;
  /* Amíg a kerék animációja el nem indul, a kerék rejtve marad (különben betöltéskor bevillan). */
  st.textContent += "html.csk-whwait #wheel>*{opacity:0}";
  de.classList.add("csk-whwait");
  function whFree() { de.classList.remove("csk-whwait"); }
  setTimeout(function () { if (!whT0) { whDone = 1; whFree(); } }, 6000);
  /* Az oldal betöltés közben többször is újrarajzolja a kereket (alapadatok, majd az adatbázis válasza).
     Ilyenkor az animáció az új kereken onnan folytatódik, ahol tartott. Felhasználói kattintásnál nincs animáció. */
  function wheel() {
    var w = document.getElementById("wheel"); if (!w || !A || w === whW) return;
    whW = w;
    if (whDone) return;
    var now = Date.now();
    if (now - lastAct < 1500) { whDone = 1; whFree(); return; }
    if (!whT0) whT0 = now;
    var el = now - whT0; if (el >= WH_TOTAL) { whDone = 1; whFree(); return; }
    var sgs = [].slice.call(w.querySelectorAll(".sg")), rest = [].slice.call(w.children).filter(function (n) { return sgs.indexOf(n) < 0; });
    var wks = [].slice.call(w.querySelectorAll(".wk"));
    function run(n, D, U, set, clear) {
      if (el >= D + U) return;
      var t = el > D ? (el - D) / U : 0, o = { v: 1 - Math.pow(1 - t, 3) };
      set(n, o.v);
      A.animate(o, { v: 1, duration: U * (1 - t), delay: Math.max(0, D - el), ease: t ? "outQuad" : "outQuart",
        onUpdate: function () { set(n, o.v); }, onComplete: function () { clear(n); } });
    }
    function sgSet(g, v) { g.style.transition = "none"; g.style.transformBox = "view-box"; g.style.transformOrigin = "300px 300px"; g.style.opacity = String(v); g.style.scale = String(.93 + .07 * v); }
    function sgClr(g) { ["opacity", "scale", "transform-box", "transform-origin", "transition"].forEach(function (k) { g.style.removeProperty(k); }); }
    function opSet(n, v) { n.style.transition = "none"; n.style.opacity = String(v); }
    function opClr(n) { n.style.removeProperty("opacity"); n.style.removeProperty("transition"); }
    sgs.forEach(function (g, i) { run(g, 150 + i * 130, 1100, sgSet, sgClr); });
    wks.forEach(function (c, i) { run(c, 700 + i * 40, 500, opSet, opClr); });
    rest.forEach(function (n) { run(n, 150 + 12 * 130 + 200, 800, opSet, opClr); });
    whFree();
  }

  function scan(root) {
    if (!root.querySelectorAll) return;
    if (root.matches && root.matches(CAND)) tag(root);
    root.querySelectorAll(CAND).forEach(tag);
    wheel();
  }
  var mq = [], mt = 0;
  new MutationObserver(function (ms) {
    if (!whDone) wheel(); /* még a kirajzolás előtt, különben az újrarajzolt kerék bevillan */
    if (!live()) return;
    ms.forEach(function (m) {
      if (m.target.nodeType === 1 && m.addedNodes.length && m.target.childElementCount === 0) mq.push(m.target); /* szövegcsere (adatbetöltés) */
      m.addedNodes.forEach(function (n) { if (n.nodeType === 1) mq.push(n); });
    });
    if (mq.length && !mt) mt = requestAnimationFrame(function () {
      mt = 0; var q = mq.splice(0);
      q.forEach(function (n) { if (!n.isConnected) return; scan(n); if (!n.closest("[data-rv]") && rect(n)) { nums(n); bars(n); } });
    });
  }).observe(document.body, { subtree: true, childList: true });

  scan(document.body);
  function ready() { A = window.anime; window.cskAnime = A; if (pend.length) flush(); nums(document.body); bars(document.body); wheel(); }
  var s = document.createElement("script"); s.src = "anime.min.js?v=4.5.0";
  s.onload = ready;
  s.onerror = function () { all.forEach(show); pend.length = 0; whDone = 1; whFree(); };
  document.head.appendChild(s);
  setTimeout(function () { if (!A) all.forEach(show); }, 2500);
})();
