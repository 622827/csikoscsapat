/* Vizsgaidőpontok lenyíló a Hasznos linkek mellett (balra). Színes, táblázatos nézet.
   Adatforrás: OVB képzési naptár. A lezajlottak halványak, a következő kiemelve. */
(function () {
  var host = document.querySelector(".topnav .in"); if (!host || host.querySelector(".zm.vk")) return;
  var SZ = [
    { t: "Biztosításközvetítői képzések", c: "#5f8cc4", r: [
      ["2026.11.04–11.07", "2026.12.07", "online", "2026.11.18"],
      ["2026.11.11–11.14", "2026.12.07", "online", "2026.11.18"],
      ["2026.11.18–11.21", "2026.12.10", "tantermi", "2026.11.21"],
      ["2026.12.09–12.12", "2027.01.21", "tantermi", "2027.01.02"],
      ["2026.12.16–12.19", "2027.01.21", "tantermi", "2027.01.02"],
      ["2027.01.06–01.09", "2027.01.28", "tantermi", "2027.01.09"] ] },
    { t: "Pénzügyi képzések", c: "#e2448f", r: [
      ["2026.11.09–11.11", "2026.12.07", "online", "2026.11.18"],
      ["2026.11.23–11.25", "2027.01.21", "tantermi", "2027.01.02"],
      ["2026.11.30–12.02", "2027.01.21", "tantermi", "2027.01.02"],
      ["2026.12.14–12.16", "2027.01.21", "tantermi", "2027.01.02"] ] },
    { t: "Tőkepiaci képzések", c: "#3fa9ab", r: [
      ["2026.11.16–11.18", "2026.12.07", "online", "2026.11.18"] ] }
  ];
  var TANT = ["2026.11.19", "2026.12.10", "2027.01.21", "2027.01.28"], ONL = ["2026.11.16", "2026.12.07", "2027.01.25"], VC = "#8a5cc2";
  function d(s) { var p = s.slice(0, 10).split("."); return new Date(+p[0], +p[1] - 1, +p[2], 23, 59); }
  function endOf(s) { var m = s.match(/(\d{4})\.(\d{2})\.(\d{2})–(\d{2})\.(\d{2})/); if (!m) return d(s); var y = +m[1]; if (+m[4] < +m[2]) y++; return new Date(y, +m[4] - 1, +m[5], 23, 59); }
  function md(s) { return s.slice(5).replace(/^0/, "").replace(".0", ".").replace(/\.$/, ""); } // 2026.11.04 -> 11.4
  var now = new Date();
  function e(t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x !== undefined) n.textContent = x; return n; }
  var css = ".zm.vk .vk-s{display:none}" +
    ".zm.vk .panel.vkp{width:min(620px,calc(100vw - 16px));padding:0;border:2px solid #5f8cc4;border-radius:14px;box-shadow:0 12px 32px rgba(0,30,70,.28),0 0 0 4px rgba(95,140,196,.15);overflow:hidden auto;max-height:min(78vh,720px)}" +
    ".vkp .vkb{margin:0 0 2px}.vkp .vkh{color:#fff;font-weight:800;font-size:1rem;padding:9px 14px;letter-spacing:.01em}" +
    ".vkp table{width:100%;border-collapse:collapse;font-size:.9rem;font-variant-numeric:tabular-nums}" +
    ".vkp th{text-align:left;font-weight:600;font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);padding:7px 14px 5px;border-bottom:2px solid var(--vkc)}" +
    ".vkp td{padding:7px 14px;border-bottom:1px solid var(--track);white-space:nowrap}" +
    ".vkp tr.past td{opacity:.38}.vkp tr.next td{background:color-mix(in srgb,var(--vkc) 13%,transparent);font-weight:700}" +
    ".vkp tr.next td:first-child{box-shadow:inset 4px 0 0 var(--vkc)}" +
    ".vkp .tag{display:inline-block;font-size:.72rem;font-weight:700;border-radius:999px;padding:1px 8px;margin-left:6px;vertical-align:1px}" +
    ".vkp .tag.on{background:#e3f0ff;color:#1f5ea8}.vkp .tag.ta{background:#fde7f1;color:#a3215e}" +
    ".vkp .nb{display:inline-block;font-size:.68rem;font-weight:800;color:#fff;background:var(--vkc);border-radius:999px;padding:1px 7px;margin-left:6px;vertical-align:1px}" +
    ".vkp .vkn{margin:8px 14px 12px;font-size:.78rem;color:var(--muted)}" +
    ".vkp th{white-space:nowrap}.vkp .hs{display:none}.vkp .two{display:grid;grid-template-columns:1fr 1fr}.vkp .two table:first-child{border-right:1px solid var(--track)}" +
    "@media (max-width:640px){.zm.vk .vk-l{display:none}.zm.vk .vk-s{display:inline}.zm.vk + .zm{margin-left:6px}" +
    ".zm.vk .panel.vkp{position:fixed;left:8px!important;right:8px!important;top:64px;width:auto!important}" +
    ".vkp td,.vkp th{padding-left:7px;padding-right:7px}.vkp table{font-size:.8rem}.vkp .hl{display:none}.vkp .hs{display:inline}" +
    ".vkp .nb{font-size:0;padding:0;width:8px;height:8px;margin-left:5px;vertical-align:1px}.vkp .tag{font-size:.66rem;padding:1px 5px;margin-left:4px}.vkp .vkh{font-size:.92rem;padding:8px 10px}}";
  document.head.appendChild(e("style", "", css));
  var wrap = e("div", "zm dv vk"), btn = e("button"), panel = e("div", "panel vkp");
  btn.type = "button"; btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-haspopup", "true");
  btn.appendChild(e("span", "vk-l", "Vizsgaidőpontok")); btn.appendChild(e("span", "vk-s", "Vizsga")); btn.appendChild(e("span", "", " ▾"));
  panel.hidden = true;
  function block(title, color) { var b = e("div", "vkb"); b.style.setProperty("--vkc", color); var h = e("div", "vkh", title); h.style.background = color; b.appendChild(h); panel.appendChild(b); return b; }
  function tag(kind) { return e("span", "tag " + (kind === "online" ? "on" : "ta"), kind); }
  SZ.forEach(function (k) {
    var b = block(k.t, k.c), tb = e("table"), hr = e("tr"), next = false;
    [["Képzés", "Képzés"], ["Legkorábbi vizsga", "Vizsga"], ["Jelentkezési határidő", "Jelentkezés"]].forEach(function (x) { var th = e("th"); th.appendChild(e("span", "hl", x[0])); th.appendChild(e("span", "hs", x[1])); hr.appendChild(th); });
    var th = e("thead"); th.appendChild(hr); tb.appendChild(th); var body = e("tbody");
    k.r.forEach(function (r) {
      var tr = e("tr"), past = endOf(r[0]) < now;
      var c1 = e("td", "", r[0]); if (!past && !next) { c1.appendChild(e("span", "nb", "következő")); }
      var c2 = e("td", "", r[1]); c2.appendChild(tag(r[2]));
      var c3 = e("td", "", r[3]);
      tr.appendChild(c1); tr.appendChild(c2); tr.appendChild(c3);
      if (past) tr.className = "past"; else if (!next) { tr.className = "next"; next = true; }
      body.appendChild(tr);
    });
    tb.appendChild(body); b.appendChild(tb);
  });
  var vb = block("Vizsganapok – 2026 vége, 2027 eleje", VC), two = e("div", "two");
  [["Tantermi vizsga", TANT], ["Online vizsga", ONL]].forEach(function (col) {
    var tb = e("table"), th = e("thead"), hr = e("tr"); hr.appendChild(e("th", "", col[0])); th.appendChild(hr); tb.appendChild(th);
    var body = e("tbody"), next = false;
    col[1].forEach(function (v) { var tr = e("tr"), past = d(v) < now, td = e("td", "", v); if (!past && !next) td.appendChild(e("span", "nb", "következő")); tr.appendChild(td); if (past) tr.className = "past"; else if (!next) { tr.className = "next"; next = true; } body.appendChild(tr); });
    tb.appendChild(body); two.appendChild(tb);
  });
  vb.appendChild(two);
  panel.appendChild(e("p", "vkn", "A halványak már lezajlottak, a kiemelt a következő. Forrás: OVB képzési naptár."));
  wrap.appendChild(btn); wrap.appendChild(panel);
  var hl = null; host.querySelectorAll(".zm.dv").forEach(function (z) { if (!hl && /Hasznos linkek/.test(z.textContent)) hl = z; });
  if (hl) host.insertBefore(wrap, hl); else { var z = host.querySelector(".zm"); if (z) host.insertBefore(wrap, z); else host.appendChild(wrap); }
  function set(open) { panel.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false"); }
  btn.addEventListener("click", function (ev) { ev.stopPropagation(); set(panel.hidden); });
  document.addEventListener("click", function (ev) { if (!wrap.contains(ev.target)) set(false); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") set(false); });
})();
