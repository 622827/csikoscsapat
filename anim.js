/* Közös animációk: minden kattintásra visszajelzés (hullám + lenyomás), oldal be-/kifakulás */

/* Oldalsó menüsáv: ikonok + címek, összecsukható (összecsukva csak az ikon látszik) */
(function () {
  var IC = {
    index: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    negyedev: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    verseny: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    kassza: '<path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2"/><circle cx="16.5" cy="14.5" r="1"/>',
    elemzo: '<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6zM6 3v18M9.5 8h6M9.5 12h6"/>',
    teljesitmeny: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    vizsga: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1 3 3 6 3s6-2 6-3v-5"/>',
    ppt: '<path d="M3 4h18v12H3zM8 20h8M12 16v4"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'
  };
  function icon(href, txt) {
    var h = href || "";
    if (h.indexOf("negyedev") === 0) return IC.negyedev; if (h.indexOf("verseny") === 0) return IC.verseny;
    if (h.indexOf("csapatkassza") === 0) return IC.kassza; if (h.indexOf("elemzo") === 0) return IC.elemzo;
    if (h.indexOf("teljesitmeny") === 0) return IC.teljesitmeny; if (h.indexOf("vizsga") === 0) return IC.vizsga;
    if (h.indexOf("index") === 0) return IC.index; if (/PPT/i.test(txt)) return IC.ppt; return IC.star;
  }
  function init() {
    var nav = document.querySelector(".topnav"), host = nav && nav.querySelector(".in"), ul = host && host.querySelector("ul");
    if (!ul || document.querySelector(".csk-sidebar")) return;
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
      "@media (hover:hover) and (min-width:800px){html.csk-rail .csk-sidebar.csk-peek{width:264px;box-shadow:8px 0 30px rgba(0,0,0,.16)}" +
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
    side.appendChild(lis); document.body.appendChild(side);
    var bd = document.createElement("div"); bd.className = "csk-bd"; document.body.appendChild(bd);
    var mb = document.createElement("button"); mb.type = "button"; mb.className = "csk-mbtn"; mb.setAttribute("aria-label", "Menü");
    mb.innerHTML = svg('<path d="M4 7h16M4 12h16M4 17h16"/>'); host.insertBefore(mb, host.firstChild);
    var pt = 0;
    side.addEventListener("mouseenter", function () { clearTimeout(pt); side.classList.add("csk-peek"); });
    side.addEventListener("mouseleave", function () { clearTimeout(pt); side.classList.remove("csk-peek"); });
    root.classList.add("csk-side", "csk-rail");
    function closeM() { root.classList.remove("csk-mopen"); }
    mb.addEventListener("click", function () { root.classList.toggle("csk-mopen"); });
    bd.addEventListener("click", closeM); side.addEventListener("click", function (e) { if (e.target.closest("a[href]") && mobile()) closeM(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeM(); });
    window.addEventListener("resize", function () { if (!mobile()) closeM(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

/* Almenü: a fejléc menüpontjai fölé víve megjelennek az aloldalak */
(function () {
  var SUB = { "verseny.html": [["Erdélyi Incentive", "verseny.html#erdely"], ["Téli Incentive", "verseny.html#teli"], ["2026 Lengyelország karácsony", "verseny.html#lengyel"]],
              "csapatkassza.html": [["Csapatkassza", "csapatkassza.html#kassza"], ["OVB flotta", "csapatkassza.html#flotta"], ["Iroda kassza", "csapatkassza.html#iroda"]],
              "teljesitmeny-uj.html": [["Elemzések utáni teendők", "teljesitmeny-uj.html#elemzesek"], ["Asszisztensi feladatok", "teljesitmeny-uj.html#asszisztens"], ["Start bónusz", "teljesitmeny-uj.html#startbonusz"]] };
  function init() {
    var nav = document.querySelector(".topnav"); if (!nav || !window.matchMedia("(hover:hover)").matches) return;
    var st = document.createElement("style");
    st.textContent = ".csk-sub{position:fixed;z-index:60;min-width:210px;padding:6px;border-radius:14px;background:var(--bg,#fff);color:var(--ink,#111);border:1px solid var(--track,#ddd);box-shadow:0 10px 30px rgba(0,0,0,.18);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .16s ease,transform .16s ease}" +
      ".csk-sub.on{opacity:1;transform:none;pointer-events:auto}.csk-sub a{display:block;padding:9px 14px;border-radius:10px;color:inherit;text-decoration:none;font-weight:600;white-space:nowrap}.csk-sub a:hover,.csk-sub a:focus-visible{background:var(--track,#eee)}";
    st.textContent += ".csk-sub a.cur{background:var(--accent,#036);color:var(--on-accent,#fff)}html.csk-hastabs .vtabs,html.csk-hastabs .vtabs2,html.csk-hastabs #ktabs{display:none!important}";
    document.head.appendChild(st); document.documentElement.classList.add("csk-hastabs");
    var box = document.createElement("div"); box.className = "csk-sub"; document.body.appendChild(box);
    var tm = 0, op = 0, cur = null;
    function hide() { box.classList.remove("on"); cur = null; }
    function later() { clearTimeout(tm); tm = setTimeout(hide, 180); }
    document.querySelectorAll(".topnav li > a[href], .csk-sidebar li > a[href]").forEach(function (a) {
      var key = (a.getAttribute("href") || "").split("#")[0]; var items = SUB[key]; if (!items) return;
      a.addEventListener("mouseenter", function () {
        clearTimeout(tm); if (cur === a) return; clearTimeout(op); op = setTimeout(function () { open(); }, 550);
      });
      function open() {
        cur = a; box.textContent = "";
        items.forEach(function (it) { var l = document.createElement("a"); l.href = it[1]; l.textContent = it[0];
          var h = location.hash, onPage = location.pathname.split("/").pop() === key || (key === "verseny.html" && location.pathname.slice(-1) === "/" && false);
          var curKey = ""; try { curKey = key === "csapatkassza.html" ? (h === "#flotta" || h === "#iroda" ? h : "#kassza") : key === "verseny.html" ? (h === "#teli" ? "#teli" : "#erdely") : (h ? h : (sessionStorage.getItem("tj_view") === "as" ? "#asszisztens" : "#elemzesek")); } catch (e) {}
          if (onPage && it[1].slice(it[1].indexOf("#")) === curKey) l.className = "cur";
          box.appendChild(l); });
        var r = a.getBoundingClientRect(), sd = !!a.closest(".csk-sidebar"); box.style.top = (sd ? r.top : r.bottom + 4) + "px"; box.style.left = sd ? (r.right + 8) + "px" : Math.max(8, Math.min(r.left, innerWidth - 230)) + "px";
        box.classList.add("on");
      }
      a.addEventListener("mouseleave", function () { clearTimeout(op); later(); });
    });
    box.addEventListener("mouseenter", function () { clearTimeout(tm); });
    box.addEventListener("mouseleave", later);
    box.addEventListener("click", hide);
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
