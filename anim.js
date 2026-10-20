/* Közös animációk: minden kattintásra visszajelzés (hullám + lenyomás), oldal be-/kifakulás */
(function () {
  if (window.__cskAnim) return; window.__cskAnim = 1;
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var st = document.createElement("style");
  st.textContent =
    "@keyframes cskPage{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
    "@keyframes cskRip{from{transform:translate(-50%,-50%) scale(0);opacity:.35}to{transform:translate(-50%,-50%) scale(1);opacity:0}}" +
    "@keyframes cskPop{0%{transform:scale(1)}40%{transform:scale(.94)}100%{transform:scale(1)}}" +
    "body{animation:cskPage .4s cubic-bezier(.22,1,.36,1) both}" +
    "body.csk-leave{opacity:0;transform:translateY(-6px);transition:opacity .18s ease,transform .18s ease}" +
    "button,summary,[role=button],[role=tab],select,input[type=submit],input[type=date],label{transition:transform .15s ease,filter .15s ease,box-shadow .2s ease,background-color .2s ease,border-color .2s ease,opacity .2s ease}" +
    "button:not(:disabled):active,summary:active,[role=button]:active,[role=tab]:active,input[type=submit]:active{transform:scale(.95)}" +
    "a{transition:color .2s ease,opacity .2s ease,background-color .2s ease}" +
    "a:active{opacity:.7}" +
    ".csk-rip{position:fixed;z-index:2147483000;width:140px;height:140px;border-radius:50%;background:currentColor;pointer-events:none;animation:cskRip .55s ease-out forwards}" +
    ".csk-pop{animation:cskPop .3s ease}" +
    "details>summary~*{animation:cskPage .3s ease both}" +
    "@media (prefers-reduced-motion:reduce){body,body.csk-leave,.csk-rip,.csk-pop,details>summary~*{animation:none!important;transition:none!important}.csk-rip{display:none}}";
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
    var t = e.target.closest && e.target.closest("button,summary,[role=tab],input[type=checkbox],input[type=radio]");
    if (t && t.tagName !== "INPUT") { t.classList.remove("csk-pop"); void t.offsetWidth; t.classList.add("csk-pop"); setTimeout(function () { t.classList.remove("csk-pop"); }, 350); }
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var h = a.getAttribute("href") || "";
    if (a.target === "_blank" || a.hasAttribute("download") || /^(#|mailto:|tel:|javascript:)/.test(h) || a.origin !== location.origin) return;
    if (a.pathname === location.pathname && a.search === location.search) return;
    e.preventDefault(); document.body.classList.add("csk-leave");
    setTimeout(function () { location.href = a.href; }, 170);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("csk-leave"); });
})();
