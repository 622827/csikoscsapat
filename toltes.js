/* Betöltőképernyő minden oldalhoz: az oldal tartalma addig rejtve marad, amíg be nem töltött.
   A fejlécben, szinkron töltődik, így frissítéskor sem villan fel előbb az oldal.
   Lépések: oldal → belépés → adatok → összeállítás; a végén a két fél a középvonaltól széthúzódik.
   Kézi használat (pl. admin): window.CSKLP.open(felirat, cím) / step(szöveg) / done() / fail(szöveg). */
(function () {
  try {
    if (window.CSKLP) return;
    if (self !== top) return;   // beágyazott (iframe) oldalban nincs betöltő: azt a főoldal (admin) teljes ablakos betöltője fedi
    if (/(^|\/)(cegbemutato-nomenu|felbercsapat|teljesitmeny-uj)\.html$/.test(location.pathname)) return;   // nem töltenek be semmit
    var de = document.documentElement;
    var CSS =
      "html.csk-tolt{background:#fff}@media (prefers-color-scheme:dark){html.csk-tolt{background:#001f3d}}" +
      "html.csk-tolt body>*:not(.lpage){visibility:hidden!important}html.csk-tolt body{overflow:hidden}" +
      ".lpage{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .35s ease;font-family:'Stag Sans','Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif}" +
      ".lpage.on{opacity:1}.lpage.nf{transition:none}" +
      ".lpage .lh{position:absolute;top:0;bottom:0;width:50.2%;background:var(--bg,#fff);transition:transform .55s cubic-bezier(.76,0,.24,1) .05s;will-change:transform}" +
      ".lpage .lh.l{left:0}.lpage .lh.r{right:0}" +
      ".lpage.out .lh.l{transform:translateX(-101%)}.lpage.out .lh.r{transform:translateX(101%)}" +
      ".lpage .ln{position:absolute;left:50%;top:50%;width:2px;margin-left:-1px;height:46vh;transform:translateY(-50%);background:var(--accent,#036);opacity:.55;border-radius:2px;transition:height .35s cubic-bezier(.76,0,.24,1),opacity .3s ease}" +
      ".lpage.out .ln{height:101vh;opacity:0;transition:height .5s cubic-bezier(.76,0,.24,1),opacity .3s ease .4s}" +
      ".lpage .lc{position:relative;z-index:1;width:min(400px,100%);box-sizing:border-box;padding:24px 26px;border-radius:22px;background:var(--card,#e5e5e5);color:var(--ink,#036);overflow:hidden;transform:translateY(10px) scale(.98);filter:blur(6px);opacity:0;transition:transform .45s cubic-bezier(.22,1,.36,1),filter .45s ease,opacity .35s ease,height .42s cubic-bezier(.22,1,.36,1)}" +
      ".lpage.on .lc{transform:none;filter:none;opacity:1}" +
      ".lpage.out .lc{transform:translateY(-8px) scale(.97);filter:blur(8px);opacity:0;transition:transform .4s ease,filter .4s ease,opacity .3s ease}" +
      ".lpage .lk{margin:0 0 4px;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#369)}" +
      ".lpage .lt{margin:0 0 14px;font-size:1.25rem;font-weight:700}" +
      ".lpage .lst{list-style:none;margin:0;padding:0;display:grid;gap:7px}" +
      ".lpage .lst li{display:flex;align-items:center;gap:10px;font-size:.9rem;line-height:1.3;min-width:0;animation:lpin .28s ease-out both}" +
      ".lpage .lst li.ok{color:var(--muted,#369)}.lpage .lst li.err{color:#ff8da1}" +
      ".lpage .lst .tx{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
      ".lpage .lst .ic{flex:none;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center}" +
      ".lpage .lst .spin{width:14px;height:14px;border-radius:50%;border:2px solid var(--track,#ddd);border-top-color:var(--accent,#036);animation:lpspin .7s linear infinite}" +
      ".lpage .lst .ic svg{width:16px;height:16px;fill:none;stroke:var(--ok,#066);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;animation:lppop .3s ease-out both}" +
      ".lpage .lst .ic svg path{stroke-dasharray:24;stroke-dashoffset:24;animation:lpchk .36s .05s ease-out forwards}" +
      ".lpage .lst li.err .ic svg{stroke:#ff6b8a}" +
      ".lpage .lx{margin-top:16px;display:flex;gap:8px}.lpage .lx[hidden]{display:none}" +
      ".lpage .lx button{font:inherit;font-weight:600;padding:8px 16px;border:0;border-radius:999px;background:var(--accent,#036);color:var(--on-accent,#fff);cursor:pointer}" +
      "@keyframes lpspin{to{transform:rotate(360deg)}}@keyframes lpchk{to{stroke-dashoffset:0}}@keyframes lppop{0%{transform:scale(.6)}60%{transform:scale(1.18)}100%{transform:scale(1)}}@keyframes lpin{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}" +
      "@media (prefers-reduced-motion:reduce){.lpage,.lpage .lc{transition-duration:.01s!important;filter:none!important;transform:none!important}.lpage .lh{transition-duration:.01s!important;transition-delay:0s!important}}";
    var st = document.createElement("style"); st.id = "csk-lp-css"; st.textContent = CSS; (document.head || de).appendChild(st);

    var CHK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>', XX = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
    var el = null, ul = null, card = null, q = Promise.resolve(), gen = 0, DWELL = 90;
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    function release() { de.classList.remove("csk-tolt"); }
    function whenBody(cb) {
      if (document.body) return cb();
      var mo = new MutationObserver(function () { if (document.body) { mo.disconnect(); cb(); } });
      mo.observe(de, { childList: true });
    }
    function grow(fn) {   // a kártya magassága animálva követi az új sort
      var h0 = card.offsetHeight; card.style.height = "auto"; fn(); var h1 = card.offsetHeight;
      card.style.height = h0 + "px"; void card.offsetHeight; card.style.height = h1 + "px";
      clearTimeout(card._t); card._t = setTimeout(function () { card.style.height = "auto"; }, 460);
    }
    function close(kind) { var a = ul && ul.querySelector("li.act"); if (!a) return; a.className = kind || "ok"; a.querySelector(".ic").innerHTML = kind === "err" ? XX : CHK; }
    function row(t) { var li = document.createElement("li"); li.className = "act"; var ic = document.createElement("span"); ic.className = "ic"; ic.innerHTML = '<i class="spin"></i>'; var tx = document.createElement("span"); tx.className = "tx"; tx.textContent = t; li.appendChild(ic); li.appendChild(tx); ul.appendChild(li); }
    function hide() {
      if (!el) return; var e = el; el = null; release(); e.classList.add("out");
      setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 1000);
    }
    var LP = {
      gen: function () { return gen; },
      open: function (kicker, title, instant) {
        gen++; q = Promise.resolve();
        if (el) { el.querySelector(".lk").textContent = kicker; el.querySelector(".lt").textContent = title; ul.textContent = ""; card.style.height = "auto"; return; }
        el = document.createElement("div"); el.className = "lpage" + (instant ? " nf" : ""); el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
        el.innerHTML = '<div class="lh l"></div><div class="lh r"></div><div class="ln"></div><div class="lc"><p class="lk"></p><h2 class="lt"></h2><ul class="lst"></ul><div class="lx" hidden><button type="button">Bezárás</button></div></div>';
        el.querySelector(".lk").textContent = kicker; el.querySelector(".lt").textContent = title;
        card = el.querySelector(".lc"); ul = el.querySelector("ul"); el.querySelector("button").onclick = hide;
        var mine = el;
        whenBody(function () { if (el !== mine) return; document.body.appendChild(el); void el.offsetHeight; el.classList.add("on"); if (instant) setTimeout(function () { if (mine.classList) mine.classList.remove("nf"); }, 60); });
      },
      step: function (t) { var g = gen; q = q.then(function () { if (g !== gen || !el) return; close(); grow(function () { row(t); }); return wait(DWELL); }); },
      done: function () { var g = gen; q = q.then(function () { if (g !== gen || !el) return; close(); return wait(120).then(function () { if (g === gen) hide(); }); }); },
      fail: function (t) { var g = gen; q = q.then(function () { if (g !== gen || !el) return; close("err"); grow(function () { var li = document.createElement("li"); li.className = "err"; li.innerHTML = '<span class="ic">' + XX + '</span><span class="tx"></span>'; li.lastChild.textContent = t; li.lastChild.style.whiteSpace = "normal"; ul.appendChild(li); el.querySelector(".lx").hidden = false; }); }); }
    };
    window.CSKLP = LP;

    /* Automatikus betöltés: az Apps Script-hívásokat figyeljük, a belépést a CSK.ready jelzi */
    var pend = 0, last = Date.now(), of = window.fetch;
    if (of) window.fetch = function (u) {
      var s = String((u && u.url) || u);
      if (!/script\.google(usercontent)?\.com/.test(s)) return of.apply(this, arguments);
      pend++; var p = of.apply(this, arguments), d = function () { pend--; last = Date.now(); }; p.then(d, d); return p;
    };
    de.classList.add("csk-tolt");
    var title = (document.title || "").split(/\s[·–-]\s/)[0] || "Betöltés";
    LP.open("Csikós BL csapat", title, true);
    var g0 = gen, alive = function () { return g0 === gen && el; };
    (async function () {
      LP.step("Oldal betöltése");
      if (document.readyState === "loading") await Promise.race([new Promise(function (r) { document.addEventListener("DOMContentLoaded", r, { once: true }); }), wait(8000)]);
      if (!alive()) return;
      var t0 = Date.now(); while (!window.CSK && Date.now() - t0 < 2500) await wait(60);
      if (!alive()) return;
      if (window.CSK && window.CSK.ready) { LP.step("Belépés ellenőrzése"); await Promise.race([Promise.resolve(window.CSK.ready).catch(function () {}), wait(9000)]); if (!alive()) return; }
      LP.step("Adatok lekérése");
      var t1 = Date.now(); last = Date.now();
      while (pend > 0 && Date.now() - t1 < 1200) await wait(60);   // az adatlekérést legfeljebb rövid ideig várjuk meg, az oldal addig is használható
      if (!alive()) return;
      LP.step("Oldal összeállítása"); LP.done();
    })().catch(function () { release(); });
    setTimeout(function () { if (de.classList.contains("csk-tolt")) hide(); }, 30000);   // biztonsági feloldás
  } catch (e) { try { document.documentElement.classList.remove("csk-tolt"); } catch (x) {} }
})();
