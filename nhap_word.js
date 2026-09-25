/* =====================================================================
 * NHẬP ĐỀ TỪ FILE WORD (.docx) – Taode_thi_online (THPT Vĩnh Thạnh)
 * - Đọc công thức MathType (OLE Equation.DSMT) → LaTeX
 * - Đọc công thức Equation của Word (OMML) → LaTeX
 * - Nhận dạng: Câu N; phương án A–D (đáp án đúng GẠCH CHÂN);
 *   ý a) b) c) d) của câu Đúng/Sai (ý đúng GẠCH CHÂN nhãn);
 *   câu trả lời ngắn: dòng "Đáp án: ..." (tối đa 4 kí tự); "Lời giải" → lời giải
 * - Hình PNG/JPG trong câu → thu nhỏ, nhúng vào đề
 * Toàn bộ xử lý chạy trên máy người dùng, không gửi file đi đâu.
 * Dùng: NhapWord.docx(arrayBuffer) → Promise<{exam, warnings, stats}>
 * Cần JSZip.
 * ===================================================================== */
(function (root) {
  "use strict";

  /* ------------------------ 1. Đọc file OLE (CFB) ------------------------ */
  function cfbStream(buf, wanted) {
    const u8 = new Uint8Array(buf), dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    const sig = [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1];
    for (let i = 0; i < 8; i++) if (u8[i] !== sig[i]) return null;
    const secSize = 1 << dv.getUint16(0x1E, true), miniSize = 1 << dv.getUint16(0x20, true);
    const nFat = dv.getUint32(0x2C, true), dirStart = dv.getInt32(0x30, true);
    const cutoff = dv.getUint32(0x38, true), miniFatStart = dv.getInt32(0x3C, true);
    let difatSec = dv.getInt32(0x44, true);
    const off = s => (s + 1) * secSize;
    const fatSecs = [];
    for (let i = 0; i < 109 && fatSecs.length < nFat; i++) fatSecs.push(dv.getInt32(0x4C + 4 * i, true));
    let guard = 0;
    while (difatSec >= 0 && fatSecs.length < nFat && guard++ < 1000) {
      const o = off(difatSec), per = secSize / 4 - 1;
      for (let i = 0; i < per && fatSecs.length < nFat; i++) fatSecs.push(dv.getInt32(o + 4 * i, true));
      difatSec = dv.getInt32(o + 4 * per, true);
    }
    const fat = [];
    fatSecs.forEach(s => { const o = off(s); for (let i = 0; i < secSize / 4; i++) fat.push(o + 4 * i + 4 <= u8.length ? dv.getInt32(o + 4 * i, true) : -2); });
    const chain = (start) => { const r = []; let s = start, g = 0; while (s >= 0 && g++ < 100000) { r.push(s); s = fat[s]; } return r; };
    const readChain = (start) => { const c = chain(start), out = new Uint8Array(c.length * secSize); c.forEach((s, i) => out.set(u8.subarray(off(s), off(s) + secSize), i * secSize)); return out; };
    const dir = readChain(dirStart), ddv = new DataView(dir.buffer);
    const entries = [];
    for (let p = 0; p + 128 <= dir.length; p += 128) {
      const nl = ddv.getUint16(p + 64, true);
      let name = ""; for (let i = 0; i < Math.max(0, nl / 2 - 1); i++) name += String.fromCharCode(ddv.getUint16(p + 2 * i, true));
      entries.push({ name, type: dir[p + 66], start: ddv.getInt32(p + 116, true), size: ddv.getUint32(p + 120, true) });
    }
    const e = entries.find(x => x.type === 2 && x.name === wanted);
    if (!e) return null;
    if (e.size >= cutoff) return readChain(e.start).subarray(0, e.size);
    const rootE = entries[0], ministream = readChain(rootE.start);
    const mfat = []; if (miniFatStart >= 0) { const m = readChain(miniFatStart), mdv = new DataView(m.buffer); for (let i = 0; i < m.length / 4; i++) mfat.push(mdv.getInt32(4 * i, true)); }
    const out = new Uint8Array(Math.ceil(e.size / miniSize) * miniSize); let s = e.start, i = 0, g = 0;
    while (s >= 0 && g++ < 100000) { out.set(ministream.subarray(s * miniSize, (s + 1) * miniSize), i * miniSize); i++; s = mfat[s]; }
    return out.subarray(0, e.size);
  }

  /* ------------------------ 2. Bảng kí tự → LaTeX ------------------------ */
  const U = {
    0x2212: "-", 0x00B1: "\\pm ", 0x2213: "\\mp ", 0x00D7: "\\times ", 0x00F7: "\\div ", 0x22C5: "\\cdot ", 0x00B7: "\\cdot ", 0x2219: "\\cdot ",
    0x2264: "\\le ", 0x2265: "\\ge ", 0x2260: "\\ne ", 0x2248: "\\approx ", 0x2261: "\\equiv ", 0x223C: "\\sim ", 0x2245: "\\cong ", 0x221D: "\\propto ",
    0x226A: "\\ll ", 0x226B: "\\gg ", 0x2192: "\\to ", 0x2190: "\\leftarrow ", 0x2194: "\\leftrightarrow ", 0x21D2: "\\Rightarrow ", 0x21D0: "\\Leftarrow ",
    0x21D4: "\\Leftrightarrow ", 0x27F9: "\\Longrightarrow ", 0x27FA: "\\Longleftrightarrow ", 0x21A6: "\\mapsto ", 0x2191: "\\uparrow ", 0x2193: "\\downarrow ",
    0x2208: "\\in ", 0x2209: "\\notin ", 0x220B: "\\ni ", 0x2282: "\\subset ", 0x2283: "\\supset ", 0x2286: "\\subseteq ", 0x2287: "\\supseteq ", 0x2284: "\\not\\subset ",
    0x222A: "\\cup ", 0x2229: "\\cap ", 0x2205: "\\varnothing ", 0x2200: "\\forall ", 0x2203: "\\exists ", 0x2204: "\\nexists ", 0x00AC: "\\neg ", 0x2227: "\\wedge ", 0x2228: "\\vee ",
    0x221E: "\\infty ", 0x2202: "\\partial ", 0x2207: "\\nabla ", 0x2220: "\\angle ", 0x2221: "\\measuredangle ", 0x22A5: "\\perp ", 0x2225: "\\parallel ", 0x2226: "\\nparallel ",
    0x25B3: "\\triangle ", 0x2206: "\\Delta ", 0x00B0: "^{\\circ}", 0x2218: "\\circ ", 0x2032: "'", 0x2033: "''", 0x2026: "\\ldots ", 0x22EF: "\\cdots ", 0x22EE: "\\vdots ", 0x22F1: "\\ddots ",
    0x2211: "\\sum ", 0x220F: "\\prod ", 0x222B: "\\int ", 0x222C: "\\iint ", 0x222D: "\\iiint ", 0x222E: "\\oint ", 0x221A: "\\surd ",
    0x211D: "\\mathbb{R}", 0x2115: "\\mathbb{N}", 0x2124: "\\mathbb{Z}", 0x211A: "\\mathbb{Q}", 0x2102: "\\mathbb{C}",
    0x2329: "\\langle ", 0x232A: "\\rangle ", 0x27E8: "\\langle ", 0x27E9: "\\rangle ", 0x230A: "\\lfloor ", 0x230B: "\\rfloor ", 0x2308: "\\lceil ", 0x2309: "\\rceil ",
    0x2016: "\\| ", 0x2022: "\\bullet ", 0x2234: "\\therefore ", 0x2235: "\\because ", 0x22A2: "\\vdash ", 0x2135: "\\aleph ", 0x210F: "\\hbar ", 0x2113: "\\ell ",
    0x2197: "\\nearrow ", 0x2198: "\\searrow ", 0x21C4: "\\rightleftarrows ", 0x2020: "\\dagger ", 0x00A0: " ", 0x2009: "\\,", 0x200A: "\\,", 0x2003: "\\quad ", 0x2002: "\\ ",
    0x03B1: "\\alpha ", 0x03B2: "\\beta ", 0x03B3: "\\gamma ", 0x03B4: "\\delta ", 0x03B5: "\\varepsilon ", 0x03F5: "\\epsilon ", 0x03B6: "\\zeta ", 0x03B7: "\\eta ",
    0x03B8: "\\theta ", 0x03D1: "\\vartheta ", 0x03B9: "\\iota ", 0x03BA: "\\kappa ", 0x03BB: "\\lambda ", 0x03BC: "\\mu ", 0x03BD: "\\nu ", 0x03BE: "\\xi ", 0x03BF: "o",
    0x03C0: "\\pi ", 0x03D6: "\\varpi ", 0x03C1: "\\rho ", 0x03C2: "\\varsigma ", 0x03C3: "\\sigma ", 0x03C4: "\\tau ", 0x03C5: "\\upsilon ", 0x03C6: "\\varphi ", 0x03D5: "\\phi ",
    0x03C7: "\\chi ", 0x03C8: "\\psi ", 0x03C9: "\\omega ", 0x0393: "\\Gamma ", 0x0394: "\\Delta ", 0x0398: "\\Theta ", 0x039B: "\\Lambda ", 0x039E: "\\Xi ", 0x03A0: "\\Pi ",
    0x03A3: "\\Sigma ", 0x03A5: "\\Upsilon ", 0x03A6: "\\Phi ", 0x03A8: "\\Psi ", 0x03A9: "\\Omega ", 0x2126: "\\Omega ", 0x0391: "A", 0x0392: "B", 0x0395: "E", 0x0396: "Z",
    0x0397: "H", 0x0399: "I", 0x039A: "K", 0x039C: "M", 0x039D: "N", 0x039F: "O", 0x03A1: "P", 0x03A4: "T", 0x03A7: "X"
  };
  const ESC = { "{": "\\{", "}": "\\}", "#": "\\#", "%": "\\%", "&": "\\&", "_": "\\_", "^": "\\hat{}", "~": "\\sim ", "\\": "\\backslash ", "$": "\\$" };
  function chTex(code) {
    if (code == null) return "";
    if (U[code] !== undefined) return U[code];
    if (code >= 0xE000 && code <= 0xF8FF) return PUA(code);          // vùng riêng của MathType
    const c = String.fromCodePoint(code);
    if (ESC[c]) return ESC[c];
    if (code >= 0x1D400 && code <= 0x1D7FF) return c;                   // chữ toán học Unicode
    return c;
  }
  function PUA(code) {
    // khoảng trắng MathType (EF00–EF0F), dấu ba chấm, mũi tên của MT Extra
    if (code >= 0xEF00 && code <= 0xEF0F) return (code === 0xEF04 || code === 0xEF05) ? "\\ " : "";
    const m = { 0xEB1A: "\\to ", 0xEC08: "\\ldots ", 0xEB00: "\\leftarrow ", 0xEB01: "\\rightarrow ", 0xEC0C: "\\cdots ", 0xE98F: "\\bot " };
    return m[code] || "";
  }

  const FUNCS = ["arcsin", "arccos", "arctan", "arccot", "sinh", "cosh", "tanh", "coth", "sin", "cos", "tan", "cot", "sec", "csc", "log", "ln", "lg", "lim", "exp", "max", "min", "sup", "inf", "det", "deg", "gcd", "arg", "dim", "ker", "Pr"];
  function funcTex(name) {
    if (!name) return "";
    if (FUNCS.indexOf(name) >= 0) return "\\" + name + " ";
    return "\\operatorname{" + name + "}";
  }
  // dấu phẩy thập phân kiểu Việt Nam: 0,5 → 0{,}5
  function vnComma(s) { return s.replace(/(\d)\s*,\s*(?=\d)/g, "$1{,}"); }

  /* ------------------------ 3. MathType MTEF v5 → LaTeX ------------------------ */
  function mtefToLatex(bin) {
    const st = cfbStream(bin, "Equation Native");
    if (!st || st.length < 30) throw new Error("không có luồng Equation Native");
    const dv = new DataView(st.buffer, st.byteOffset, st.byteLength);
    const hdr = dv.getUint16(0, true), len = dv.getUint32(8, true);
    return mtefRaw(st.subarray(hdr, Math.min(st.length, hdr + len)));
  }
  // công thức MathType lưu dưới dạng ảnh WMF: dữ liệu MTEF nằm trong các bản ghi chú thích "AppsMFCC"
  function wmfMathType(u8) {
    const sig = [0x41, 0x70, 0x70, 0x73, 0x4D, 0x46, 0x43, 0x43];
    const chunks = [];
    for (let i = 0; i + 20 < u8.length; i++) {
      let ok = true; for (let k = 0; k < 8; k++) if (u8[i + k] !== sig[k]) { ok = false; break; }
      if (!ok) continue;
      // bản ghi WMF META_ESCAPE: [độ dài dữ liệu u16] ngay trước chữ ký; dữ liệu = chữ ký(8) + 2 + 4 + 4 + phần MTEF
      const cnt = u8[i - 2] | (u8[i - 1] << 8), q = i + 18, n = Math.max(0, cnt - 18);
      chunks.push(u8.subarray(q, Math.min(u8.length, q + n))); i = q + n - 1;
    }
    if (!chunks.length) return null;
    const all = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0)); let o = 0; chunks.forEach(c => { all.set(c, o); o += c.length; });
    let z = 0; while (z < all.length && all[z] !== 0) z++;
    return mtefRaw(all.subarray(z + 1));
  }
  function mtefRaw(d) {
    let p = 0;
    const b = () => { if (p >= d.length) throw new Error("hết dữ liệu"); return d[p++]; };
    const u16 = () => { const v = d[p] | (d[p + 1] << 8); p += 2; return v; };
    const cstr = () => { let s = ""; while (p < d.length && d[p] !== 0) s += String.fromCharCode(d[p++]); p++; return s; };
    const nudge = () => { const x = b(), y = b(); if (x === 128 && y === 128) p += 4; };
    const ruler = () => { const n = b(); p += 3 * n; };
    const dimArr = () => {
      const n = b(); let cnt = 0, hi = true, cur = 0;
      const nib = () => { if (hi) { cur = b(); hi = false; return cur >> 4; } hi = true; return cur & 15; };
      while (cnt < n) { nib(); let x; do { x = nib(); } while (x !== 15); cnt++; }
    };
    let texSrc = "";
    const ver = b(); if (ver !== 5) throw new Error("MTEF phiên bản " + ver + " chưa hỗ trợ");
    b(); b(); b(); b(); cstr(); b();

    function rec(tag) {
      switch (tag) {
        case 1: { const o = b(); if (o & 8) nudge(); if (o & 4) u16(); if (o & 2) { b(); ruler(); } return { t: "line", items: (o & 1) ? [] : list(), nul: !!(o & 1) }; }
        case 2: { const o = b(); if (o & 8) nudge(); const tf = b() - 128; let mt = null; if (!(o & 0x20)) mt = u16(); if (o & 0x04) b(); if (o & 0x10) u16(); const emb = (o & 1) ? list() : []; return { t: "char", tf, mt, emb, fs: !!(o & 2) }; }
        case 3: { const o = b(); if (o & 8) nudge(); const sel = b(); let v = b(); if (v & 0x80) v = (v & 0x7F) | (b() << 7); b(); return { t: "tmpl", sel, v, items: list() }; }
        case 4: { const o = b(); if (o & 8) nudge(); const ha = b(); b(); if (o & 2) { b(); ruler(); } return { t: "pile", ha, items: list() }; }
        case 5: { const o = b(); if (o & 8) nudge(); b(); b(); b(); const rows = b(), cols = b(); p += Math.ceil(2 * (rows + 1) / 8) + Math.ceil(2 * (cols + 1) / 8); return { t: "matrix", rows, cols, items: list() }; }
        case 6: { const o = b(); if (o & 8) nudge(); return { t: "emb", k: b() }; }
        case 7: ruler(); return null;
        case 8: b(); b(); return null;
        case 9: { const l = b(); if (l === 101) u16(); else if (l === 100) { b(); u16(); } else b(); return null; }
        case 10: case 11: case 12: case 13: case 14: return null;
        case 15: b(); return null;
        case 16: { const o = b(); p += ((o & 1) ? 4 : 3) * 2; if (o & 4) cstr(); return null; }
        case 17: b(); cstr(); return null;
        case 18: { b(); dimArr(); dimArr(); const n = b(); for (let i = 0; i < n; i++) { if (b() !== 0) b(); } return null; }
        case 19: cstr(); return null;
        default:
          if (tag >= 100) {
            // MathType 7 ghi bản ghi "TeX Input Language" với độ dài 1 byte hoặc 2 byte
            let n; const one = d[p], txt = String.fromCharCode(d[p + 1] || 0, d[p + 2] || 0, d[p + 3] || 0);
            if (/^TeX/.test(txt)) { n = one; p += 1; } else { const two = String.fromCharCode(d[p + 2] || 0, d[p + 3] || 0, d[p + 4] || 0); if (/^TeX/.test(two)) { n = d[p] | (d[p + 1] << 8); p += 2; } else n = u16(); }
            const s0 = p; p += n; if (tag === 102) { let z = ""; for (let i = s0; i < s0 + n; i++) z += String.fromCharCode(d[i]); const parts = z.split("\u0000"); if (/TeX/i.test(parts[0]) && parts[1]) texSrc = parts[1]; } return null; }
          throw new Error("bản ghi lạ " + tag);
      }
    }
    function list() { const out = []; for (;;) { const tag = b(); if (tag === 0) return out; const r = rec(tag); if (r) out.push(r); } }
    const top = [];
    try { while (p < d.length) { const tag = d[p++]; if (tag === 0) continue; const r = rec(tag); if (r) top.push(r); } }
    catch (e) { if (texSrc) { try { return clean(decodeURIComponent(escape(texSrc))); } catch (x) { return clean(texSrc); } } if (!top.length) throw e; }
    const objs = top.filter(x => x.t === "line" || x.t === "pile" || x.t === "matrix");
    const res = clean(objs.map(o => node(o, 0)).join(" "));
    if (!res && texSrc) { try { return clean(decodeURIComponent(escape(texSrc))); } catch (e) { return clean(texSrc); } }
    if (root.__MTDBG) root.__MTDBG(top);
    return res;
  }

  const FENCE = { 0: ["\\langle ", "\\rangle "], 1: ["(", ")"], 2: ["\\{", "\\}"], 3: ["[", "]"], 4: ["|", "|"], 5: ["\\|", "\\|"], 6: ["\\lfloor ", "\\rfloor "], 7: ["\\lceil ", "\\rceil "], 8: ["[\\![", "]\\!]"] };
  function fenceTex(c) {
    if (!c) return ".";
    const t = chTex(c.mt).trim();
    if (t === "{" || t === "\\{") return "\\{"; if (t === "}" || t === "\\}") return "\\}";
    return t || ".";
  }
  function big(s) { return /\\d?frac|\\begin|\\int|\\sum|\\prod|\\sqrt|\\lim|\\over|\\binom/.test(s); }

  function node(n, dep) {
    if (!n) return "";
    if (n.t === "line") return lineTex(n.items, dep);
    if (n.t === "pile") {
      const rows = n.items.map(x => node(x, dep)).filter((x, i, a) => a.length > 0);
      if (rows.length <= 1) return rows[0] || "";
      const al = n.ha === 2 ? "c" : n.ha === 3 ? "r" : "l";
      return "\\begin{array}{" + al + "}" + rows.join(" \\\\ ") + "\\end{array}";
    }
    if (n.t === "matrix") {
      const cells = n.items.map(x => node(x, dep)); const rows = [];
      for (let r = 0; r < n.rows; r++) rows.push(cells.slice(r * n.cols, (r + 1) * n.cols).join(" & "));
      return "\\begin{array}{" + "c".repeat(Math.max(1, n.cols)) + "}" + rows.join(" \\\\ ") + "\\end{array}";
    }
    if (n.t === "char") return lineTex([n], dep);
    if (n.t === "tmpl") return tmplTex(n, dep, "");
    return "";
  }
  function slotsOf(n) { return n.items.filter(x => x.t !== "char"); }
  function charsOf(n) { return n.items.filter(x => x.t === "char"); }

  function tmplTex(n, dep) {
    const S = slotsOf(n), C = charsOf(n), s = i => node(S[i], dep + 1), sd = i => node(S[i], dep);
    const sel = n.sel, v = n.v;
    if (sel <= 8) {
      const inner = sd(0); const def = FENCE[sel];
      const both = (v & 3) === 0;
      let lt = (v & 1) || both ? def[0].trim() : ".", rt = (v & 2) || both ? def[1].trim() : ".";
      if (lt === "." || rt === "." || big(inner)) return "\\left" + (lt === "{" ? "\\{" : lt) + " " + inner + " \\right" + (rt === "}" ? "\\}" : rt) + " ";
      return lt + inner + rt;
    }
    switch (sel) {
      case 9: { const inner = sd(0); const lt = fenceTex(C[0]), rt = fenceTex(C[1]); return "\\left" + lt + " " + inner + " \\right" + rt + " "; }
      case 10: { const rad = sd(0), idx = S[1] ? node(S[1], dep + 1) : ""; return idx.trim() ? "\\sqrt[" + idx + "]{" + rad + "}" : "\\sqrt{" + rad + "}"; }
      case 11: { const a = s(0), c = s(1); if (v & 2) return a + "/" + c; return (dep > 0 || (v & 1) ? "\\frac{" : "\\dfrac{") + a + "}{" + c + "}"; }
      case 12: return "\\underline{" + sd(0) + "}";
      case 13: return "\\overline{" + sd(0) + "}";
      case 14: { const t = s(0), bt = s(1); return "\\xrightarrow" + (bt ? "[" + bt + "]" : "") + "{" + t + "}"; }
      case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: {
        const main = sd(0), lo = s(1), up = s(2);
        let op = C.length ? chTex(C[C.length - 1].mt).trim() : "";
        if (!op) op = sel === 15 ? ["\\int", "\\int", "\\iint", "\\iiint"][v & 3] || "\\int" : sel === 16 ? "\\sum" : sel === 17 ? "\\prod" : sel === 18 ? "\\coprod" : sel === 19 ? "\\bigcup" : sel === 20 ? "\\bigcap" : "\\int";
        if (op === "\\cup") op = "\\bigcup"; if (op === "\\cap") op = "\\bigcap";
        const lim = (sel === 15 || /int/.test(op)) ? "" : "\\limits";
        return op + lim + (lo ? "_{" + lo + "}" : "") + (up ? "^{" + up + "}" : "") + " " + main;
      }
      case 23: { const main = sd(0), lo = s(1), up = s(2); const m = main.trim(); const op = /^\\(lim|max|min|sup|inf)\s*$/.test(m) ? m : "\\mathop{" + m + "}"; return op + "\\limits" + (lo ? "_{" + lo + "}" : "") + (up ? "^{" + up + "}" : "") + " "; }
      case 24: { const main = sd(0), lab = s(1); return (v & 1) ? "\\overbrace{" + main + "}^{" + lab + "}" : "\\underbrace{" + main + "}_{" + lab + "}"; }
      case 25: { const main = sd(0), lab = s(1); return (v & 1) ? "\\overbrace{" + main + "}^{" + lab + "}" : "\\underbrace{" + main + "}_{" + lab + "}"; }
      case 26: return sd(0);
      case 27: case 28: case 29: {
        const sub = s(0), sup = s(1);
        return (sub ? "_{" + sub + "}" : "") + (sup ? "^{" + sup + "}" : "");
      }
      case 30: return "\\left\\langle " + sd(0) + " \\right\\rangle ";
      case 31: { const m = sd(0); return ((v & 1) && !(v & 2) ? "\\overleftarrow{" : "\\overrightarrow{") + m + "}"; }
      case 32: return "\\widetilde{" + sd(0) + "}";
      case 33: return "\\widehat{" + sd(0) + "}";
      case 34: return "\\overset{\\frown}{" + sd(0) + "}";
      case 36: return sd(0);
      case 37: return "\\boxed{" + sd(0) + "}";
      default: return S.map((x, i) => sd(i)).join(" ");
    }
  }
  function embWrap(t, emb) {
    for (const e of emb || []) {
      switch (e.k) {
        case 2: t = "\\dot{" + t + "}"; break;
        case 3: t = "\\ddot{" + t + "}"; break;
        case 5: t = t + "'"; break;
        case 6: t = t + "''"; break;
        case 18: t = t + "'''"; break;
        case 8: t = "\\tilde{" + t + "}"; break;
        case 9: t = "\\hat{" + t + "}"; break;
        case 10: t = "\\not " + t; break;
        case 11: t = "\\vec{" + t + "}"; break;
        case 12: t = "\\overleftarrow{" + t + "}"; break;
        case 13: t = "\\overleftrightarrow{" + t + "}"; break;
        case 17: t = "\\bar{" + t + "}"; break;
        case 19: t = "\\overset{\\frown}{" + t + "}"; break;
        default: break;
      }
    }
    return t;
  }
  function lineTex(items, dep) {
    let out = "", i = 0;
    while (i < items.length) {
      const it = items[i];
      if (it.t === "char") {
        // gom cụm chữ cùng kiểu (hàm số, văn bản)
        if (it.tf === 2 && it.mt != null && /[A-Za-z]/.test(String.fromCharCode(it.mt)) && !(it.emb && it.emb.length)) {
          let name = ""; while (i < items.length && items[i].t === "char" && items[i].tf === 2 && items[i].mt != null && /[A-Za-z]/.test(String.fromCharCode(items[i].mt)) && !(items[i].emb && items[i].emb.length)) { name += String.fromCharCode(items[i].mt); i++; }
          out += funcTex(name); continue;
        }
        if ((it.tf === 1 || it.tf === 12) && it.mt != null && it.mt > 32 && /[^\d.,;:()\[\]+\-=\/ ]/.test(String.fromCodePoint(it.mt))) {
          let txt = ""; while (i < items.length && items[i].t === "char" && (items[i].tf === 1 || items[i].tf === 12) && items[i].mt != null && !(items[i].emb && items[i].emb.length)) { const c = items[i].mt; txt += (c >= 0xEF00 && c <= 0xEF0F) ? " " : String.fromCodePoint(c); i++; }
          out += "\\text{" + txt.replace(/[{}\\$]/g, "") + "}"; continue;
        }
        let t = it.mt == null ? "" : (it.tf === 24 ? PUA(it.mt) : chTex(it.mt));
        if (it.tf === 7 && /^[A-Za-z]$/.test(t)) t = "\\mathbf{" + t + "}";
        out += embWrap(t, it.emb);
        i++; continue;
      }
      if (it.t === "tmpl" && (it.sel === 27 || it.sel === 28 || it.sel === 29)) {
        const sc = tmplTex(it, dep);
        if (!out.trim()) out += "{}";
        out += sc; i++; continue;
      }
      out += node(it, dep); i++;
    }
    return out;
  }
  function clean(s) {
    s = vnComma(s);
    s = s.replace(/[ \t]+/g, " ").replace(/\s*(\\\\)\s*/g, " $1 ").replace(/\{\s+/g, "{").replace(/\s+\}/g, "}").trim();
    s = s.replace(/\\text\{\s*\}/g, "").replace(/([^\\])\s+([,.;)\]])/g, "$1$2");
    s = s.replace(/\\left\s+/g, "\\left").replace(/\\right\s+/g, "\\right");
    return s.trim();
  }

  /* ------------------------ 4. Equation Word (OMML) → LaTeX ------------------------ */
  const MNS = "http://schemas.openxmlformats.org/officeDocument/2006/math";
  const WNS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  function kids(el, name) { return Array.from(el.childNodes).filter(n => n.nodeType === 1 && (!name || n.localName === name)); }
  function kid(el, name) { return kids(el, name)[0] || null; }
  function mval(el, path) { let e = el; for (const n of path) { e = e && kid(e, n); } return e ? (e.getAttributeNS(MNS, "val") || e.getAttribute("m:val")) : null; }
  function omml(el, dep) {
    if (!el) return "";
    const ch = (e) => kids(e).map(k => omml(k, dep)).join("");
    const arg = (e, n, dd) => { const k = kid(e, n); return k ? kids(k).map(x => omml(x, dd == null ? dep : dd)).join("") : ""; };
    switch (el.localName) {
      case "oMathPara": return kids(el, "oMath").map(x => omml(x, dep)).join(" \\\\ ");
      case "oMath": case "e": case "num": case "den": case "sub": case "sup": case "deg": case "lim": case "fName": return ch(el);
      case "r": {
        const nor = kid(el, "rPr") && kid(kid(el, "rPr"), "nor");
        let t = kids(el, "t").map(x => x.textContent).join("");
        if (nor && /[^\x00-\x7F]|[A-Za-z]{2,}\s/.test(t)) return "\\text{" + t.replace(/[{}\\$]/g, "") + "}";
        let s = ""; for (const c of t) s += chTex(c.codePointAt(0));
        return s;
      }
      case "f": { const ty = mval(el, ["fPr", "type"]); const a = arg(el, "num", dep + 1), c = arg(el, "den", dep + 1); if (ty === "lin" || ty === "skw") return a + "/" + c; if (ty === "noBar") return "\\genfrac{}{}{0pt}{}{" + a + "}{" + c + "}"; return (dep > 0 ? "\\frac{" : "\\dfrac{") + a + "}{" + c + "}"; }
      case "sSup": return "{" + arg(el, "e") + "}^{" + arg(el, "sup", dep + 1) + "}";
      case "sSub": return "{" + arg(el, "e") + "}_{" + arg(el, "sub", dep + 1) + "}";
      case "sSubSup": return "{" + arg(el, "e") + "}_{" + arg(el, "sub", dep + 1) + "}^{" + arg(el, "sup", dep + 1) + "}";
      case "sPre": return "{}_{" + arg(el, "sub", dep + 1) + "}^{" + arg(el, "sup", dep + 1) + "}" + arg(el, "e");
      case "rad": { const hide = mval(el, ["radPr", "degHide"]); const dg = arg(el, "deg", dep + 1); return (hide === "1" || hide === "on" || !dg.trim()) ? "\\sqrt{" + arg(el, "e") + "}" : "\\sqrt[" + dg + "]{" + arg(el, "e") + "}"; }
      case "d": {
        const pr = kid(el, "dPr"); const g = (n, dflt) => { const v = pr && kid(pr, n); if (!v) return dflt; const x = v.getAttributeNS(MNS, "val"); return x == null ? dflt : x; };
        const beg = g("begChr", "("), end = g("endChr", ")"), sep = g("sepChr", "|");
        const es = kids(el, "e").map(x => omml(x, dep));
        const f = c => c === "" ? "." : c === "{" ? "\\{" : c === "}" ? "\\}" : c === "|" ? "|" : c === "‖" ? "\\|" : (chTex(c.codePointAt(0)).trim() || c);
        const inner = es.join(sep === "|" ? "," : f(sep));
        if (beg === "" || end === "" || big(inner)) return "\\left" + f(beg) + " " + inner + " \\right" + f(end) + " ";
        return f(beg) + inner + f(end);
      }
      case "nary": {
        const c = mval(el, ["naryPr", "chr"]) || "∫"; let op = chTex(c.codePointAt(0)).trim();
        if (op === "\\cup") op = "\\bigcup"; if (op === "\\cap") op = "\\bigcap";
        const lo = arg(el, "sub", dep + 1), up = arg(el, "sup", dep + 1), lim = /int/.test(op) ? "" : "\\limits";
        return op + lim + (lo ? "_{" + lo + "}" : "") + (up ? "^{" + up + "}" : "") + " " + arg(el, "e");
      }
      case "func": return arg(el, "fName").replace(/^\s*([a-z]{2,6})\s*$/, (m, n) => funcTex(n)) + " " + arg(el, "e");
      case "limLow": { const e = arg(el, "e").trim(); const op = /^\\(lim|max|min)\s*$/.test(e) ? e : (/^lim$/.test(e) ? "\\lim" : "\\mathop{" + e + "}"); return op + "\\limits_{" + arg(el, "lim", dep + 1) + "} "; }
      case "limUpp": return "\\overset{" + arg(el, "lim", dep + 1) + "}{" + arg(el, "e") + "}";
      case "acc": {
        const c = mval(el, ["accPr", "chr"]) || "̂"; const e = arg(el, "e"); const one = /^\s*(\\[a-zA-Z]+|[A-Za-z0-9])\s*$/.test(e);
        if (c === "⃗" || c === "→") return (one ? "\\vec{" : "\\overrightarrow{") + e + "}";
        if (c === "̅" || c === "¯" || c === "‾") return "\\overline{" + e + "}";
        if (c === "̃") return (one ? "\\tilde{" : "\\widetilde{") + e + "}";
        if (c === "̇") return "\\dot{" + e + "}";
        if (c === "̈") return "\\ddot{" + e + "}";
        if (c === "⌢" || c === "⏜") return "\\overset{\\frown}{" + e + "}";
        return (one ? "\\hat{" : "\\widehat{") + e + "}";
      }
      case "bar": return (mval(el, ["barPr", "pos"]) === "top" ? "\\overline{" : "\\underline{") + arg(el, "e") + "}";
      case "groupChr": { const c = mval(el, ["groupChrPr", "chr"]) || "⏟"; const pos = mval(el, ["groupChrPr", "pos"]); const e = arg(el, "e"); if (c === "→") return "\\xrightarrow{" + e + "}"; return (pos === "top" ? "\\overbrace{" : "\\underbrace{") + e + "}"; }
      case "box": case "borderBox": case "phant": return arg(el, "e");
      case "eqArr": return "\\begin{array}{l}" + kids(el, "e").map(x => omml(x, dep)).join(" \\\\ ") + "\\end{array}";
      case "m": return "\\begin{array}{" + "c".repeat(Math.max(1, kids(kid(el, "mr") || el, "e").length)) + "}" + kids(el, "mr").map(r => kids(r, "e").map(x => omml(x, dep)).join(" & ")).join(" \\\\ ") + "\\end{array}";
      case "rPr": case "ctrlPr": case "fPr": case "dPr": case "naryPr": case "radPr": case "accPr": case "barPr": case "sSupPr": case "sSubPr": case "sSubSupPr": case "funcPr": case "limLowPr": case "limUppPr": case "eqArrPr": case "mPr": case "groupChrPr": case "boxPr": case "borderBoxPr": case "phantPr": case "sPrePr": case "oMathParaPr": return "";
      default: return ch(el);
    }
  }

  // thu nhỏ ảnh (tối đa rộng 900px), nền trắng; chọn bản nhẹ hơn giữa PNG và JPEG
  function shrink(src) {
    if (!root.document || !root.Image) return Promise.resolve(src);
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, 900 / im.naturalWidth), w = Math.max(1, Math.round(im.naturalWidth * k)), h = Math.max(1, Math.round(im.naturalHeight * k));
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        const g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.drawImage(im, 0, 0, w, h);
        const png = cv.toDataURL("image/png"), jpg = cv.toDataURL("image/jpeg", 0.85);
        const best = [src, png, jpg].sort((a, b) => a.length - b.length)[0];
        res(k < 1 && best === src ? (png.length < jpg.length ? png : jpg) : best);
      };
      im.onerror = () => res(src);
      im.src = src;
    });
  }

  /* ------------------------ 5. Đọc tài liệu Word ------------------------ */
  const EQ0 = 0xE000, IM0 = 0xF000;
  async function docx(arrayBuffer, opts) {
    opts = opts || {};
    const JSZ = root.JSZip || (typeof require === "function" ? require("jszip") : null);
    const zip = await JSZ.loadAsync(arrayBuffer);
    const docXml = await zip.file("word/document.xml").async("string");
    const relsXml = await zip.file("word/_rels/document.xml.rels").async("string");
    const Parser = root.DOMParser || opts.DOMParser;
    const dom = new Parser().parseFromString(docXml, "application/xml");
    const rels = {}; relsXml.replace(/<Relationship\b[^>]*>/g, t => { const id = (t.match(/Id="([^"]+)"/) || [])[1], tg = (t.match(/Target="([^"]+)"/) || [])[1]; if (id) rels[id] = tg; return t; });
    const warnings = [], eqs = [], imgs = [];
    const stats = { mathtype: 0, omml: 0, eqFail: 0, images: 0, imgFail: 0 };
    const RNS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
    const attrR = (el, n) => el.getAttributeNS(RNS, n) || el.getAttribute("r:" + n);
    const fileOf = rid => { const t = rels[rid]; if (!t) return null; return t.startsWith("/") ? t.slice(1) : "word/" + t.replace(/^\.\//, ""); };

    async function eqFromObject(obj) {
      const ole = Array.from(obj.getElementsByTagName("*")).find(e => e.localName === "OLEObject");
      const prog = ole ? (ole.getAttribute("ProgID") || "") : "";
      const rid = ole && attrR(ole, "id");
      if (ole && /Equation/i.test(prog) && rid) {
        const f = fileOf(rid);
        try {
          const bin = await zip.file(f).async("uint8array");
          const tex = mtefToLatex(bin); stats.mathtype++;
          return { tex };
        } catch (e) { stats.eqFail++; return { tex: null, why: "MathType: " + e.message }; }
      }
      stats.eqFail++; return { tex: null, why: "đối tượng nhúng " + (prog || "không rõ") };
    }
    async function imgFrom(el) {
      const blip = Array.from(el.getElementsByTagName("*")).find(e => e.localName === "blip" || e.localName === "imagedata");
      const rid = blip && (attrR(blip, "embed") || attrR(blip, "id"));
      const f = rid && fileOf(rid);
      if (!f || !zip.file(f)) return { ok: false, why: "không tìm thấy ảnh" };
      const ext = f.split(".").pop().toLowerCase();
      const ext2 = Array.from(el.getElementsByTagName("*")).find(e => e.localName === "extent");
      const wEmu = ext2 ? +ext2.getAttribute("cx") : 0;
      if (ext === "wmf") { try { const u = await zip.file(f).async("uint8array"); const tex = wmfMathType(u); if (tex) { stats.mathtype++; return { ok: false, eq: tex }; } } catch (e) { } }
      if (!/^(png|jpe?g|gif|bmp|webp)$/.test(ext)) return { ok: false, small: wEmu && wEmu < 1500000, why: "ảnh dạng ." + ext.toUpperCase() + " (trình duyệt không hiển thị được)" };
      const data = await zip.file(f).async("base64");
      const mime = ext === "jpg" ? "image/jpeg" : "image/" + ext;
      let src = "data:" + mime + ";base64," + data;
      try { src = await shrink(src); } catch (e) { }
      return { ok: true, src, wEmu };
    }

    // duyệt một đoạn văn → {s: chuỗi, ul: mảng gạch chân}
    async function para(p) {
      let s = "", ul = [];
      const push = (t, u) => { s += t; for (let i = 0; i < t.length; i++) ul.push(!!u); };
      async function walk(el, u0) {
        for (const n of kids(el)) {
          const ln = n.localName;
          if (ln === "r" && n.namespaceURI === WNS) {
            const rPr = kid(n, "rPr"); const uEl = rPr && kid(rPr, "u"); const uv = uEl && (uEl.getAttributeNS(WNS, "val") || uEl.getAttribute("w:val"));
            const u = !!uEl && uv !== "none";
            for (const c of kids(n)) {
              const cl = c.localName;
              if (cl === "t") push(c.textContent.replace(/ /g, " "), u);
              else if (cl === "tab") push(" ", u);
              else if (cl === "br" || cl === "cr") push(" ", false);
              else if (cl === "sym") { const code = parseInt(c.getAttributeNS(WNS, "char") || c.getAttribute("w:char") || "0", 16); push(code >= 0xF000 ? " " : String.fromCharCode(code), u); }
              else if (cl === "object") { const r = await eqFromObject(c); eqs.push(r); push(String.fromCharCode(EQ0 + eqs.length - 1), false); }
              else if (cl === "drawing" || cl === "pict") {
                const r = await imgFrom(c);
                if (r.eq) { eqs.push({ tex: r.eq }); push(String.fromCharCode(EQ0 + eqs.length - 1), false); }
                else { imgs.push(r); push(String.fromCharCode(IM0 + imgs.length - 1), false); }
              }
            }
          } else if (ln === "oMath" || ln === "oMathPara") {
            let tex = null; try { tex = clean(omml(n, 0)); stats.omml++; } catch (e) { stats.eqFail++; }
            eqs.push({ tex, why: tex ? "" : "công thức Word" }); push(String.fromCharCode(EQ0 + eqs.length - 1), false);
          } else if (ln === "pPr" || ln === "rPr" || ln === "proofErr" || ln === "bookmarkStart" || ln === "bookmarkEnd") {
            /* bỏ qua */
          } else if (ln === "del" || ln === "instrText") {
            /* bỏ phần đã xóa trong theo dõi thay đổi */
          } else await walk(n, u0);
        }
      }
      await walk(p, false);
      return { s, ul };
    }

    const body = kid(dom.documentElement, "body");
    const P = [];
    async function block(el) {
      for (const n of kids(el)) {
        if (n.localName === "p") P.push(await para(n));
        else if (n.localName === "tbl") { for (const tr of kids(n, "tr")) for (const tc of kids(tr, "tc")) await block(tc); }
        else if (n.localName === "sdt") { const c = kid(n, "sdtContent"); if (c) await block(c); }
      }
    }
    await block(body);

    return build(P, eqs, imgs, warnings, stats);
  }

  /* ------------------------ 6. Nhận dạng cấu trúc đề ------------------------ */
  function build(P, eqs, imgs, warnings, stats) {
    const plain = x => x.s.replace(/[-]/g, " ").replace(/\s+/g, " ").trim();
    const reCau = /^\s*C[âa]u\s*(\d+)\s*[.:)]?/i;
    const rePhan = /^\s*PH[ẦA]N\s+(III|II|I|3|2|1)\b/i;

    // tiêu đề, thời gian
    let title = "", time = 0;
    for (const x of P.slice(0, 15)) {
      const t = plain(x);
      if (!time) { const m = t.match(/Th[ờo]i gian l[àa]m b[àa]i\s*[:：]?\s*(\d+)\s*ph/i); if (m) time = +m[1]; }
      if (!title) { const m = t.match(/((?:ĐỀ|KIỂM TRA|ĐỀ THI)[^:]{4,120}?)(?=NĂM HỌC|MÔN|Thời gian|$)/); if (m && !/SỞ|TRƯỜNG/.test(m[1])) title = m[1].trim(); }
    }
    let mon = ""; for (const x of P.slice(0, 15)) { const m = plain(x).match(/MÔN\s*[:：]\s*([^\d]*\d{1,2})/i); if (m) { mon = m[1].trim(); break; } }
    const hoa = t => t.charAt(0) + t.slice(1).toLowerCase().replace(/\b(i{1,3}|iv|vi{0,3}|ix|x{1,3})\b/g, m => m.toUpperCase());
    if (title) title = hoa(title); if (mon) title += " – " + hoa(mon);

    // chia khối câu hỏi
    const blocks = []; let cur = null, sec = "";
    for (const x of P) {
      const t = plain(x);
      const ph = t.match(rePhan);
      if (ph) { sec = { I: "mcq", "1": "mcq", II: "tf", "2": "tf", III: "short", "3": "short" }[ph[1].toUpperCase()]; cur = null; continue; }
      const m = x.s.replace(/^[\s-]*/, "").match(reCau);
      if (m && x.s.search(/C[âa]u/i) <= x.s.length) { cur = { no: +m[1], sec, paras: [x] }; blocks.push(cur); continue; }
      if (cur) cur.paras.push(x);
    }

    const toText = (s, host) => {
      let out = "", sp = false;
      for (const ch of s) {
        const c = ch.charCodeAt(0);
        if (sp) { sp = false; if (/[\p{L}\d(]/u.test(ch)) out += " "; }
        if (c >= EQ0 && c < EQ0 + 0x1000) { const e = eqs[c - EQ0]; if (e && e.tex) { let t = e.tex, tail = ""; const mm = /\\(right|left)\s*\.$/.test(t) ? null : t.match(/^(.*?)\s*([.,;:])$/); if (mm && mm[1]) { t = mm[1]; tail = mm[2]; } if (/[\p{L}\d)]$/u.test(out)) out += " "; out += "$" + t + "$" + tail; sp = true; continue; } else { out += "[công thức]"; host.warn.push("có công thức không đọc được (" + (e && e.why || "?") + ") – cần gõ lại"); } }
        else if (c >= IM0 && c < IM0 + 0x1000) { const im = imgs[c - IM0]; if (im && im.ok) host.img.push(im.src); else if (im && im.small) { out += "[công thức dạng ảnh]"; host.warn.push("có công thức dạng ảnh – cần gõ lại"); } else { host.warn.push(im ? im.why : "ảnh lỗi"); } }
        else out += ch;
      }
      return out.replace(/\s+/g, " ").replace(/\$\s*\$/g, "").replace(/\s+([.,;:?])/g, "$1").trim();
    };
    const cat = (arr) => { let s = "", ul = []; arr.forEach((x, i) => { if (i) { s += " \n "; ul.push(false, false, false); } s += x.s; ul = ul.concat(x.ul); }); return { s, ul }; };

    const mcq = [], tf = [], short = [];
    for (const bl of blocks) {
      const host = { warn: [], img: [] };
      const ps = bl.paras.slice();
      // bỏ "Câu N." ở đoạn đầu
      const first = ps[0]; const cut = /C[âa]u\s*\d+/i.test(first.s) ? (() => { const m = first.s.match(/C[âa]u\s*\d+\s*[.:)]?/i); const k = first.s.indexOf(m[0]) + m[0].length; const pre = first.s.slice(0, first.s.indexOf(m[0])); return { s: pre + first.s.slice(k), ul: first.ul.slice(0, first.s.indexOf(m[0])).concat(first.ul.slice(k)) }; })() : first;
      ps[0] = cut;
      // lời giải / đáp án
      let iLG = ps.findIndex((x, i) => i > 0 && /^\s*(L[ờo]i gi[ảa]i|H[ướư]+ng d[ẫa]n gi[ảa]i|Gi[ảa]i)\s*[:.]?\s*$/i.test(plain(x)));
      let answer = null, iDA = -1;
      ps.forEach((x, i) => { const m = plain(x).match(/^\s*Đ[áa]p [áa]n\s*[:：]\s*(\S+)/i); if (m && i > 0) { answer = m[1].replace(/[.;]$/, ""); iDA = i; } });
      const endQ = [iLG, iDA].filter(i => i > 0).reduce((a, b) => Math.min(a, b), ps.length);
      const q = ps.slice(0, endQ);
      const solParas = iLG > 0 ? ps.slice(iLG + 1).filter((x, i) => (iLG + 1 + i) !== iDA) : [];
      const sol = solParas.map(x => toText(x.s, host)).filter(Boolean).join(" ");

      // Đúng/Sai?
      const reSt = /^[\s_]*([a-d])\s*\)/;
      const stIdx = q.map((x, i) => reSt.test(x.s.replace(/[-]/g, "")) ? i : -1).filter(i => i > 0);
      const optStart = q.findIndex((x, i) => i > 0 && /^\s*A\s*[.)]/.test(plain(x)));
      let kind = stIdx.length >= 4 ? "tf" : optStart > 0 ? "mcq" : (answer != null ? "short" : (bl.sec || "mcq"));
      if (kind === "mcq" && optStart < 0) { kind = answer != null ? "short" : bl.sec || "short"; }

      if (kind === "tf") {
        const stem = toText(cat(q.slice(0, stIdx[0])).s, host);
        const statements = [];
        const lbs = ["a", "b", "c", "d"];
        lbs.forEach((lb, k) => {
          const i = stIdx.find(ii => (q[ii].s.replace(/[-]/g, "").match(reSt) || [])[1] === lb);
          if (i == null) { statements.push({ text: "", correct: true, expl: "" }); host.warn.push("thiếu ý " + lb + ")"); return; }
          const nxt = stIdx.filter(j => j > i)[0] || q.length;
          const g = cat(q.slice(i, nxt));
          const m = g.s.match(/([a-d])\s*\)/); const pos = g.s.indexOf(m[0]);
          const labU = g.ul[pos] || g.ul.slice(pos, pos + m[0].length).some(Boolean);
          statements.push({ text: toText(g.s.slice(pos + m[0].length), host), correct: !!labU, expl: "" });
        });
        if (sol) { const parts = sol.split(/\s(?=[a-d]\)\s)/); if (parts.length >= 4) parts.slice(-4).forEach((t, k) => statements[k].expl = t.replace(/^[a-d]\)\s*/, "")); else statements[0].expl = sol; }
        if (!statements.some(s => s.correct)) host.warn.push("không thấy ý nào gạch chân (tất cả đang để Sai) – kiểm tra lại");
        tf.push({ no: bl.no, content: stem, imageUrl: host.img[0] || "", statements, host });
      } else if (kind === "mcq") {
        const stem = toText(cat(q.slice(0, optStart)).s, host);
        const g = cat(q.slice(optStart));
        const re = /(^|[\s(])([A-D])\s*[.)]/g; let m; const found = {}; let want = 0;
        while ((m = re.exec(g.s)) && want < 4) { const L = "ABCD"[want]; if (m[2] === L) { found[L] = { at: m.index + m[1].length, end: m.index + m[0].length }; want++; } }
        const options = []; let correct = "";
        "ABCD".split("").forEach((L, k) => {
          const f = found[L]; if (!f) { options.push({ l: L, t: "" }); host.warn.push("thiếu phương án " + L); return; }
          const nx = k < 3 && found["ABCD"[k + 1]] ? found["ABCD"[k + 1]].at : g.s.length;
          if (g.ul[f.at]) correct = correct || L;
          const nImg = host.img.length; let t = toText(g.s.slice(f.end, nx), host).replace(/[.;]\s*$/, "");
          if (host.img.length > nImg) { host.img.length = nImg; host.warn.push("phương án " + L + " là hình – chưa hỗ trợ"); }
          options.push({ l: L, t });
        });
        if (!correct) { const mm = sol.match(/Ch[ọo]n\s*(?:đáp án|phương án)?\s*([A-D])\b/i); if (mm) correct = mm[1].toUpperCase(); }
        if (!correct) { host.warn.push("không thấy phương án gạch chân – đang để A, cần chọn lại"); correct = "A"; }
        mcq.push({ no: bl.no, content: stem, imageUrl: host.img[0] || "", options, correct, expl: sol, host });
      } else {
        const stem = toText(cat(q).s, host);
        let a = answer == null ? "" : answer.replace(/^[=:]+/, "");
        if (!a) host.warn.push("không thấy dòng \"Đáp án: …\"");
        else if (a.length > 4) host.warn.push("đáp án \"" + a + "\" dài hơn 4 kí tự");
        else if (isNaN(parseFloat(a.replace(",", ".")))) host.warn.push("đáp án \"" + a + "\" không phải số");
        short.push({ no: bl.no, content: stem, imageUrl: host.img[0] || "", answer: a, expl: sol, host });
      }
    }
    const all = [].concat(mcq, tf, short);
    all.forEach(q => {
      if (q.host.img.length > 1) q.host.warn.push("có " + q.host.img.length + " hình, chỉ giữ hình đầu tiên");
      [...new Set(q.host.warn)].forEach(w => warnings.push({ cau: q.no, msg: w }));
      delete q.host;
    });
    stats.images = all.filter(q => q.imageUrl).length;
    const parts = [];
    if (mcq.length) parts.push({ type: "mcq", title: "PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn", pointsPerQuestion: 0.25, questions: mcq });
    if (tf.length) parts.push({ type: "tf", title: "PHẦN II. Câu trắc nghiệm đúng sai", maxPoints: 1, questions: tf });
    if (short.length) parts.push({ type: "short", title: "PHẦN III. Câu trắc nghiệm trả lời ngắn", pointsPerQuestion: 0.5, questions: short });
    const exam = {
      meta: { title: title || "Đề kiểm tra", subtitle: [mcq.length && mcq.length + " câu nhiều lựa chọn", tf.length && tf.length + " câu đúng sai", short.length && short.length + " câu trả lời ngắn"].filter(Boolean).join(" · "), timeMinutes: time || 45, requireName: true, shuffleOptions: true, shuffleQuestions: true },
      parts
    };
    return { exam, warnings, stats: Object.assign(stats, { mcq: mcq.length, tf: tf.length, short: short.length }) };
  }

  const api = { docx, mtefToLatex, omml, cfbStream };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NhapWord = api;
})(typeof window !== "undefined" ? window : globalThis);
