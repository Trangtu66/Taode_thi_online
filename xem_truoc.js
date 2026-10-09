/* Xem trước học liệu ngay trên web (không cần tải về) – dùng chung cho hoc_lieu.html, luyen_thi.html.
   XemTruoc.mo({url, ten, file})
   - .docx/.pptx/.xlsx: Microsoft Office Web Viewer (mặc định) hoặc Google Docs Viewer (tab dự phòng) trong <iframe>.
   - Sơ đồ tư duy có mã Mermaid (window.SO_DO, file so_do_mermaid.js): vẽ trực tiếp bằng mermaid.js – bong bóng Gradient Bordeaux/Navy;
     tab "Ảnh" xem bản PNG.
   - .pdf: iframe trực tiếp; ảnh: <img>.
   Trình xem Office/Google cần link công khai (GitHub Pages); khi mở trang từ máy (file://, localhost) sẽ hiện hướng dẫn. */
(function () {
  const MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
  const OFFICE = u => "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(u);
  const GOOGLE = u => "https://docs.google.com/gview?embedded=true&url=" + encodeURIComponent(u);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const duoi = f => (String(f).split("?")[0].split(".").pop() || "").toLowerCase();
  const congKhai = () => /^https?:$/.test(location.protocol) && !/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname);

  const css = `
  .xt-nen{position:fixed;inset:0;background:rgba(15,23,42,.62);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px}
  .xt-nen.mo{display:flex}
  .xt-hop{font-family:"Be Vietnam Pro",Calibri,"Segoe UI",Arial,sans-serif;max-width:100%;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.35);width:min(1180px,100%);height:min(92vh,900px);display:flex;flex-direction:column;overflow:hidden;min-width:0}
  .xt-dau{display:flex;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid #E2E8F0;background:linear-gradient(90deg,#001233,#0B3D91 55%,#7A0F2E)}
  .xt-dau h2{flex:1;min-width:0;margin:0;font-size:16px;color:#fff;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .xt-dau a,.xt-dau button{font:inherit;font-size:13px;font-weight:600;border-radius:8px;padding:6px 10px;border:1px solid rgba(255,255,255,.55);background:rgba(255,255,255,.12);color:#fff;text-decoration:none;cursor:pointer;white-space:nowrap}
  .xt-dau a:hover,.xt-dau button:hover{background:rgba(255,255,255,.25)}
  .xt-tab{display:flex;gap:6px;padding:8px 14px;border-bottom:1px solid #E2E8F0;background:#F8FAFC;flex-wrap:wrap}
  .xt-tab button{font:inherit;font-size:13px;font-weight:600;border:1px solid #CBD5E1;background:#fff;color:#1E293B;border-radius:999px;padding:5px 12px;cursor:pointer}
  .xt-tab button.on{background:#1E40AF;border-color:#1E40AF;color:#fff}
  .xt-than{flex:1;min-height:0;min-width:0;position:relative;background:#F1F5F9;overflow:auto}
  .xt-than iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
  .xt-than img{display:block;max-width:100%;margin:0 auto;background:#fff}
  .xt-sd{width:100%;box-sizing:border-box;padding:12px;min-height:100%;background:#fff;display:flex;align-items:center;justify-content:center}
  .xt-sd svg{display:block;min-width:0;flex:1 1 0;max-width:100% !important;width:100% !important;height:auto}
  .xt-cho{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#5B6474;font-size:14px;pointer-events:none}
  .xt-tb{max-width:560px;margin:40px auto;padding:18px;background:#fff;border:1px solid #E2E8F0;border-radius:12px;color:#1E293B;font-size:15px;line-height:1.6}
  .xem{display:inline-flex;gap:5px;align-items:center;font:inherit;font-size:14px;font-weight:600;border-radius:8px;padding:6px 10px;border:1px solid #CBD5E1;background:#fff;color:#0B3D91;cursor:pointer}
  .xem:hover{background:#EFF4FF;border-color:#93C5FD}
  @media (max-width:640px){.xt-nen{padding:0}.xt-hop{height:100%;border-radius:0}.xt-dau h2{font-size:14px}.xt-dau .xt-an{display:none}.xt-dau{padding:8px 10px;gap:6px}.xt-dau a,.xt-dau button{padding:5px 8px;font-size:12px}.xt-tab{padding:6px 10px}}`;
  let nen, hop, than, tab, tieuDe, taiVe, moTab, dong, truoc = null;

  function dung() {
    if (nen) return;
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    nen = document.createElement("div"); nen.className = "xt-nen"; nen.setAttribute("aria-hidden", "true");
    nen.innerHTML = `<div class="xt-hop" role="dialog" aria-modal="true" aria-labelledby="xt-td">
      <div class="xt-dau"><h2 id="xt-td"></h2><a class="xt-an" id="xt-tab-moi" target="_blank" rel="noopener">↗ Mở tab mới</a>
      <a id="xt-tai" download>⬇ Tải về</a><button id="xt-dong" aria-label="Đóng">✕ Đóng</button></div>
      <div class="xt-tab" id="xt-tabs"></div><div class="xt-than" id="xt-than"></div></div>`;
    document.body.appendChild(nen);
    hop = nen.firstElementChild; than = nen.querySelector("#xt-than"); tab = nen.querySelector("#xt-tabs");
    tieuDe = nen.querySelector("#xt-td"); taiVe = nen.querySelector("#xt-tai"); moTab = nen.querySelector("#xt-tab-moi");
    dong = nen.querySelector("#xt-dong");
    dong.onclick = an; nen.addEventListener("click", e => { if (e.target === nen) an(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && nen.classList.contains("mo")) an(); });
  }
  function an() {
    nen.classList.remove("mo"); nen.setAttribute("aria-hidden", "true"); than.innerHTML = ""; document.body.style.overflow = "";
    if (truoc) truoc.focus();
  }
  function khung(src) {
    than.innerHTML = `<div class="xt-cho">Đang mở tài liệu…</div><iframe title="Xem trước" allowfullscreen></iframe>`;
    const f = than.querySelector("iframe"); f.onload = () => { const c = than.querySelector(".xt-cho"); if (c) c.remove(); }; f.src = src;
  }
  function napMermaid() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    return new Promise((ok, loi) => { const s = document.createElement("script"); s.src = MERMAID;
      s.onload = () => { window.mermaid.initialize({startOnLoad: false, securityLevel: "strict"}); ok(window.mermaid); }; s.onerror = loi;
      document.head.appendChild(s); });
  }
  const DEFS = `<defs><linearGradient id="gNavy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B3D91"/><stop offset="1" stop-color="#001233"/></linearGradient>
    <linearGradient id="gBordeaux" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A4133C"/><stop offset="1" stop-color="#5C0017"/></linearGradient></defs>`;
  let dem = 0;
  async function veSoDo(ma, png) {
    than.innerHTML = `<div class="xt-sd"><div class="xt-cho">Đang vẽ sơ đồ…</div></div>`;
    try {
      const m = await napMermaid(); const {svg} = await m.render("xt-sd-" + (++dem), ma);
      than.innerHTML = `<div class="xt-sd">${svg.replace(/(<svg[^>]*>)/, "$1" + DEFS)}</div>`;
      const TO = {goc: ["url(#gNavy)", "#C9A227", "#fff"], bdx: ["url(#gBordeaux)", "#fff", "#fff"], nvy: ["url(#gNavy)", "#fff", "#fff"], l2: ["#F8FAFC", "#0B3D91", "#0F172A"]};
      Object.entries(TO).forEach(([lop, [nen_, vien, chu]]) => than.querySelectorAll("g." + lop).forEach(g => {
        g.querySelectorAll("rect,circle,ellipse,path,polygon").forEach(h => { h.style.fill = nen_; h.style.stroke = vien; h.style.strokeWidth = lop === "l2" ? "1.5px" : "2.5px"; });
        g.querySelectorAll("text,tspan,.nodeLabel,span,div,p").forEach(t => { t.style.fill = chu; t.style.color = chu; if (lop !== "l2") t.style.fontWeight = "700"; });
      }));
    } catch (e) { than.innerHTML = png ? `<img alt="Sơ đồ tư duy" src="${esc(png)}">` : `<div class="xt-tb">Không vẽ được sơ đồ (cần Internet để tải mermaid.js).</div>`; }
  }
  function cacTab(ds) {
    tab.innerHTML = ds.map((t, i) => `<button type="button" class="${i ? "" : "on"}">${t[0]}</button>`).join("");
    tab.style.display = ds.length > 1 ? "" : "none";
    tab.querySelectorAll("button").forEach((b, i) => b.onclick = () => {
      tab.querySelectorAll("button").forEach(x => x.classList.remove("on")); b.classList.add("on"); ds[i][1](); });
    if (ds.length) ds[0][1]();
  }

  function mo(o) {
    dung(); truoc = document.activeElement;
    const tuyetDoi = new URL(o.url, location.href).href, d = duoi(o.file || o.url);
    tieuDe.textContent = (o.ten || o.file || "Xem trước"); taiVe.href = o.url; taiVe.setAttribute("download", o.file || "");
    moTab.href = ["docx", "pptx", "xlsx", "doc", "ppt"].includes(d) ? OFFICE(tuyetDoi).replace("embed.aspx", "view.aspx") : o.url;
    nen.classList.add("mo"); nen.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; dong.focus();
    const sd = (window.SO_DO || {})[o.file];
    if (sd) return cacTab([["🧠 Sơ đồ bong bóng (Mermaid)", () => veSoDo(sd, o.url)], ["🖼️ Ảnh PNG", () => { than.innerHTML = `<img alt="Sơ đồ tư duy" src="${esc(o.url)}">`; }]]);
    if (["docx", "pptx", "xlsx", "doc", "ppt"].includes(d)) {
      if (!congKhai()) { cacTab([]); than.innerHTML = `<div class="xt-tb"><b>Trình xem trực tuyến cần link công khai.</b><br>Trang đang mở từ máy (${esc(location.host || "file")}), Microsoft/Google không đọc được file ở máy. Hãy mở trang qua GitHub Pages (trangtu66.github.io/Taode_thi_online) để xem trước, hoặc bấm “Tải về”.</div>`; return; }
      return cacTab([["Microsoft Office Viewer", () => khung(OFFICE(tuyetDoi))], ["Google Docs Viewer (dự phòng)", () => khung(GOOGLE(tuyetDoi))]]);
    }
    cacTab([]);
    if (d === "pdf") return khung(o.url);
    if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(d)) { than.innerHTML = `<img alt="${esc(o.ten || "")}" src="${esc(o.url)}">`; return; }
    than.innerHTML = `<div class="xt-tb">Định dạng .${esc(d)} chưa xem trước được – bấm “Tải về”.</div>`;
  }
  window.XemTruoc = {mo, xemDuoc: f => ["docx", "pptx", "xlsx", "doc", "ppt", "pdf", "png", "jpg", "jpeg", "webp"].includes(duoi(f))};
})();
