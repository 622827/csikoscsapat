/* Közös animációk: minden kattintásra visszajelzés (hullám + lenyomás), oldal be-/kifakulás */

/* Almenü: a fejléc menüpontjai fölé víve megjelennek az aloldalak */
(function () {
  var SUB = { "verseny.html": [["Erdélyi Incentive", "verseny.html#erdely"], ["Téli Incentive", "verseny.html#teli"]],
              "teljesitmeny-uj.html": [["Elemzések utáni teendők", "teljesitmeny-uj.html#elemzesek"], ["Asszisztensi feladatok", "teljesitmeny-uj.html#asszisztens"]] };
  function init() {
    var nav = document.querySelector(".topnav"); if (!nav || !window.matchMedia("(hover:hover)").matches) return;
    var st = document.createElement("style");
    st.textContent = ".csk-sub{position:fixed;z-index:60;min-width:210px;padding:6px;border-radius:14px;background:var(--bg,#fff);color:var(--ink,#111);border:1px solid var(--track,#ddd);box-shadow:0 10px 30px rgba(0,0,0,.18);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .16s ease,transform .16s ease}" +
      ".csk-sub.on{opacity:1;transform:none;pointer-events:auto}.csk-sub a{display:block;padding:9px 14px;border-radius:10px;color:inherit;text-decoration:none;font-weight:600;white-space:nowrap}.csk-sub a:hover,.csk-sub a:focus-visible{background:var(--track,#eee)}";
    document.head.appendChild(st);
    var box = document.createElement("div"); box.className = "csk-sub"; document.body.appendChild(box);
    var tm = 0, cur = null;
    function hide() { box.classList.remove("on"); cur = null; }
    function later() { clearTimeout(tm); tm = setTimeout(hide, 180); }
    nav.querySelectorAll("li > a[href]").forEach(function (a) {
      var key = (a.getAttribute("href") || "").split("#")[0]; var items = SUB[key]; if (!items) return;
      a.addEventListener("mouseenter", function () {
        clearTimeout(tm); if (cur === a) return; cur = a; box.textContent = "";
        items.forEach(function (it) { var l = document.createElement("a"); l.href = it[1]; l.textContent = it[0]; box.appendChild(l); });
        var r = a.getBoundingClientRect(); box.style.top = (r.bottom + 4) + "px"; box.style.left = Math.max(8, Math.min(r.left, innerWidth - 230)) + "px";
        box.classList.add("on");
      });
      a.addEventListener("mouseleave", later);
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
