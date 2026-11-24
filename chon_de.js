// BỘ CHỌN ĐỀ DÙNG CHUNG cho mọi trò chơi (Rung chuông vàng, Kéo co, Đua xe – dau_truong.html; Thi đấu theo nhịp độ – nhip_do.html).
// Một giao diện, một thứ tự nguồn đề: 🎮 Đề game · 📘 Bài củng cố · 🗂 Ngân hàng đề của tôi · 🔗 Dán link.
// Đề vừa chọn được nhớ trên máy (localStorage) để trò chơi khác nạp lại đúng đề đó bằng một nút.
// Dùng: ChonDe.mo((de, ten) => { ...nạp đề vào game...; }[, {tabs:['game','cc'], tieuDe, moTa}])  – tabs: chỉ hiện các ngăn này (trang HS tự chơi)   – de: {meta, parts:[{type, questions}]}; hàm nạp báo lỗi bằng throw.
//       ChonDe.ganNhat() -> {ten, link|id} hoặc null;  ChonDe.napGanNhat(onPick) -> Promise
// Cần: cau_hinh.js (DANH_SACH_BAI, KQ_API), lz-string.
(function () {
  'use strict';
  var KEY_DE = 'chon_de_gan_nhat', KEY_TAB = 'chon_de_tab', KEY_KHOI = 'chon_de_khoi';
  var GAME = /Ngân hàng đề game/i;
  var TAT_CA = ['game', 'cc', 'nh', 'link'], TIEU_DE = '📚 Chọn đề cho trò chơi',
      MO_TA = 'Dùng chung cho Rung chuông vàng, Kéo co, Đua xe và Thi đấu theo nhịp độ. Đề được chia 3 phần: 4 lựa chọn · Đúng/Sai · Trả lời ngắn.';
  var st = { tab: lay(KEY_TAB) || 'game', khoi: lay(KEY_KHOI) || '', mon: '', tim: '', onPick: null, nh: [], tabs: TAT_CA };

  function lay(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ghi(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ds() { return Array.isArray(window.DANH_SACH_BAI) ? window.DANH_SACH_BAI : []; }
  function monCua(b) { return String(b.nhom || 'Khác').split(' · ')[0].replace(/\s*\d+\s*$/, '').trim(); }
  function $(id) { return document.getElementById(id); }

  // ---------------------------------------------------------------- đọc đề
  function giaiNen(str) {
    try { var j = window.LZString && LZString.decompressFromEncodedURIComponent(str); if (j) return Promise.resolve(JSON.parse(j)); } catch (e) {}
    try {
      if (/^eN/.test(str) && 'DecompressionStream' in window) {
        var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        var bin = Uint8Array.from(atob(b64 + '==='.slice((b64.length + 3) % 4)), function (c) { return c.charCodeAt(0); });
        return new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('deflate'))).text().then(JSON.parse);
      }
    } catch (e) {}
    return Promise.resolve(null);
  }
  function jsonp(p) {
    return new Promise(function (resolve, reject) {
      var api = window.KQ_API || '';
      if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(api)) return reject('Chưa cấu hình máy chủ trong cau_hinh.js.');
      var cb = 'cdcb_' + Math.random().toString(36).slice(2), sc = document.createElement('script');
      var tm = setTimeout(function () { xong(); reject('Không kết nối được máy chủ (kiểm tra mạng).'); }, 20000);
      function xong() { clearTimeout(tm); delete window[cb]; sc.remove(); }
      window[cb] = function (d) { xong(); (d && d.ok) ? resolve(d) : reject((d && d.loi) || 'Lỗi dữ liệu'); };
      sc.onerror = function () { xong(); reject('Không kết nối được máy chủ (kiểm tra mạng).'); };
      sc.src = api + '?' + new URLSearchParams(Object.assign({}, p, { callback: cb })).toString();
      document.body.appendChild(sc);
    });
  }
  function deTheoId(id) { return jsonp({ action: 'de', id: id }).then(function (d) { return JSON.parse(d.de); }); }
  function deTheoLink(link) {
    var u = new URL(String(link).trim(), location.href);
    var m = u.hash.match(/[#&]e=([^&]+)/);
    if (m) return giaiNen(m[1]);
    if (u.searchParams.get('de')) return deTheoId(u.searchParams.get('de'));
    if (/\.json$/i.test(u.pathname)) return fetch(u.href, { cache: 'no-cache' }).then(function (r) { return r.json(); });
    return fetch(u.href, { cache: 'no-cache' }).then(function (r) { return r.text(); }).then(function (html) {
      var hm = html.match(/#e=([A-Za-z0-9+\-$_]+)/);
      if (hm) return giaiNen(hm[1]);
      var im = html.match(/[?&]de=([A-Za-z0-9_\-]+)/);
      if (im) return deTheoId(im[1]);
      return null;
    });
  }

  // ---------------------------------------------------------------- giao diện
  var CSS = '#cd-modal{position:fixed;inset:0;z-index:99990;background:rgba(2,6,23,.78);display:none;align-items:center;justify-content:center;padding:14px;font-family:inherit}' +
    '#cd-modal.on{display:flex}#cd-box{background:#fff;color:#0f172a;width:min(980px,100%);max-height:92vh;border-radius:22px;box-shadow:0 25px 60px rgba(0,0,0,.45);display:flex;flex-direction:column;overflow:hidden}' +
    '#cd-head{padding:16px 20px 10px;border-bottom:1px solid #e2e8f0}#cd-head h3{margin:0;font-size:20px;font-weight:900;color:#4338ca}#cd-head p{margin:4px 0 0;font-size:12.5px;color:#64748b}' +
    '#cd-x{float:right;border:0;background:#f1f5f9;border-radius:12px;width:38px;height:38px;font-size:18px;cursor:pointer}' +
    '#cd-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.cd-tab{border:0;border-radius:12px;padding:8px 14px;font-weight:800;font-size:14px;cursor:pointer;background:#f1f5f9;color:#334155}' +
    '.cd-tab.on{background:#4f46e5;color:#fff;box-shadow:0 4px 12px rgba(79,70,229,.35)}' +
    '#cd-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:10px 20px;border-bottom:1px solid #f1f5f9}' +
    '.cd-pill{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:6px 14px;font-weight:800;font-size:13px;cursor:pointer;color:#334155}.cd-pill.on{background:#0f172a;color:#fff;border-color:#0f172a}' +
    '#cd-bar select,#cd-bar input,.cd-inp{border:1px solid #cbd5e1;border-radius:10px;padding:8px 10px;font-size:14px;background:#fff;color:#0f172a}#cd-tim{flex:1;min-width:180px}' +
    '#cd-body{padding:12px 20px 16px;overflow:auto;flex:1}.cd-h{font-size:12px;font-weight:900;color:#6366f1;text-transform:uppercase;margin:12px 0 6px;letter-spacing:.3px}' +
    '.cd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px}' +
    '.cd-card{text-align:left;border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;padding:10px 12px;cursor:pointer;font-size:14px;font-weight:700;color:#0f172a}' +
    '.cd-card:hover,.cd-de:hover{border-color:#6366f1;background:#eef2ff}.cd-row{display:flex;align-items:center;gap:8px;border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;padding:8px 10px}' +
    '.cd-row .t{flex:1;font-size:14px;font-weight:700}.cd-de{border:1px solid #c7d2fe;background:#fff;color:#4338ca;border-radius:10px;padding:7px 12px;font-weight:900;font-size:13px;cursor:pointer;white-space:nowrap}' +
    '.cd-sel{outline:3px solid #22c55e}#cd-foot{padding:10px 20px;border-top:1px solid #e2e8f0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:#f8fafc}' +
    '#cd-status{flex:1;font-size:13.5px;font-weight:700;color:#334155;min-width:200px}#cd-status.ok{color:#15803d}#cd-status.err{color:#b91c1c}' +
    '.cd-btn{border:0;border-radius:12px;padding:9px 14px;font-weight:900;font-size:13.5px;cursor:pointer;background:#4f46e5;color:#fff}.cd-btn.ghost{background:#e2e8f0;color:#0f172a}' +
    '.cd-muted{font-size:13px;color:#64748b;padding:8px 2px}';

  function dung() {
    if ($('cd-modal')) return;
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var m = document.createElement('div'); m.id = 'cd-modal';
    m.innerHTML = '<div id="cd-box" role="dialog" aria-modal="true" aria-labelledby="cd-tt">' +
      '<div id="cd-head"><button id="cd-x" type="button" aria-label="Đóng">✕</button><h3 id="cd-tt"></h3>' +
      '<p id="cd-mota"></p>' +
      '<div id="cd-tabs">' +
      '<button class="cd-tab" data-t="game" type="button">🎮 Đề game</button><button class="cd-tab" data-t="cc" type="button">📘 Bài củng cố</button>' +
      '<button class="cd-tab" data-t="nh" type="button">🗂 Ngân hàng đề của tôi</button><button class="cd-tab" data-t="link" type="button">🔗 Dán link</button></div></div>' +
      '<div id="cd-bar"></div><div id="cd-body"></div>' +
      '<div id="cd-foot"><div id="cd-status">Chọn một đề trong danh sách.</div><button id="cd-lai" class="cd-btn ghost" type="button" hidden></button></div></div>';
    document.body.appendChild(m);
    $('cd-x').onclick = dong;
    m.addEventListener('click', function (e) { if (e.target === m) dong(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && m.classList.contains('on')) dong(); });
    $('cd-tabs').onclick = function (e) { var b = e.target.closest('.cd-tab'); if (b) { st.tab = b.dataset.t; ghi(KEY_TAB, st.tab); ve(); } };
    $('cd-lai').onclick = function () { napGanNhat(st.onPick); };
  }

  function trangThai(msg, cls) { var s = $('cd-status'); if (s) { s.className = cls || ''; s.textContent = msg; } }

  function ve() {
    if (st.tabs.indexOf(st.tab) < 0) st.tab = st.tabs[0];
    document.querySelectorAll('.cd-tab').forEach(function (b) { b.classList.toggle('on', b.dataset.t === st.tab); b.hidden = st.tabs.indexOf(b.dataset.t) < 0; });
    var g = ganNhat(); var lai = $('cd-lai');
    lai.hidden = !g; if (g) lai.textContent = '↺ Dùng lại đề vừa chọn: ' + (g.ten.length > 46 ? g.ten.slice(0, 45) + '…' : g.ten);
    if (st.tab === 'nh') return veNH();
    if (st.tab === 'link') return veLink();
    veDanhSach(st.tab === 'game');
  }

  function veDanhSach(game) {
    var all = ds().filter(function (b) { return game ? GAME.test(b.nhom || '') : !GAME.test(b.nhom || ''); });
    var khois = Array.from(new Set(all.map(function (b) { return String(b.khoi); }))).sort();
    if (khois.indexOf(st.khoi) < 0) st.khoi = khois.indexOf('12') >= 0 ? '12' : (khois[0] || '');
    var ofK = all.filter(function (b) { return String(b.khoi) === st.khoi; });
    var mons = Array.from(new Set(ofK.map(monCua)));
    if (mons.indexOf(st.mon) < 0) st.mon = mons.indexOf('Toán') >= 0 ? 'Toán' : (mons[0] || '');
    $('cd-bar').innerHTML = khois.map(function (k) { return '<button type="button" class="cd-pill' + (k === st.khoi ? ' on' : '') + '" data-k="' + k + '">Khối ' + k + '</button>'; }).join('') +
      (mons.length > 1 ? '<select id="cd-mon" aria-label="Môn">' + mons.map(function (x) { return '<option' + (x === st.mon ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select>' : '') +
      '<input id="cd-tim" type="search" placeholder="Tìm bài, ví dụ: Bài 6, vectơ, chương II…" value="' + esc(st.tim) + '">';
    $('cd-bar').onclick = function (e) { var b = e.target.closest('.cd-pill'); if (b) { st.khoi = b.dataset.k; ghi(KEY_KHOI, st.khoi); st.mon = ''; ve(); } };
    if ($('cd-mon')) $('cd-mon').onchange = function () { st.mon = this.value; ve(); };
    $('cd-tim').oninput = function () { st.tim = this.value; veKetQua(game, ofK); var t = $('cd-tim'); t.focus(); };
    veKetQua(game, ofK);
  }

  function veKetQua(game, ofK) {
    var q = st.tim.trim().toLowerCase();
    var items = ofK.filter(function (b) { return monCua(b) === st.mon && (!q || (b.ten + ' ' + (b.ma || '') + ' ' + (b.nhom || '')).toLowerCase().indexOf(q) >= 0); });
    var all = ds(), body = $('cd-body');
    if (!items.length) { body.innerHTML = '<div class="cd-muted">' + (game ? 'Chưa có đề game cho lựa chọn này.' : 'Không có bài phù hợp.') + '</div>'; return; }
    var html = '';
    if (game) {   // gom theo bài: một dòng, các nút Đề 1, Đề 2…
      var nhom = {}, thuTu = [];
      items.forEach(function (b) {
        var m = String(b.ten).match(/^(.*?)\s*[–-]\s*(Đề\s*\d+|Đua xe 3 mức)\s*$/), ten = m ? m[1] : b.ten, de = m ? (m[2] === 'Đua xe 3 mức' ? '🏁 Đua xe 3 mức' : m[2]) : 'Mở đề';
        if (!nhom[ten]) { nhom[ten] = []; thuTu.push(ten); } nhom[ten].push([de, all.indexOf(b)]);
      });
      html = '<div class="cd-grid">' + thuTu.map(function (t) {
        return '<div class="cd-row"><span class="t">' + esc(t) + '</span>' + nhom[t].map(function (x) { return '<button type="button" class="cd-de" data-i="' + x[1] + '">' + esc(x[0]) + '</button>'; }).join('') + '</div>';
      }).join('') + '</div>';
    } else {      // gom theo nhóm (Toán 12, Toán 12 · Ôn tập chương…)
      var g = {}, ord = [];
      items.forEach(function (b) { var k = b.nhom || 'Khác'; if (!g[k]) { g[k] = []; ord.push(k); } g[k].push(b); });
      html = ord.map(function (k) {
        return '<div class="cd-h">' + esc(k) + '</div><div class="cd-grid">' + g[k].map(function (b) { return '<button type="button" class="cd-card" data-i="' + all.indexOf(b) + '">' + esc(b.ten) + '</button>'; }).join('') + '</div>';
      }).join('');
    }
    body.innerHTML = html;
    body.onclick = function (e) {
      var b = e.target.closest('[data-i]'); if (!b) return;
      body.querySelectorAll('.cd-sel').forEach(function (x) { x.classList.remove('cd-sel'); }); b.classList.add('cd-sel');
      var x = all[+b.dataset.i]; var ten = x.ten;
      nap(function () { return deTheoLink(x.link); }, ten, { ten: ten, link: x.link });
    };
  }

  function veNH() {
    var ma = lay('dt_ma_gv') || lay('ql_ma_gv') || '';
    try { ma = ma || sessionStorage.getItem('dt_ma_gv') || sessionStorage.getItem('ql_ma_gv') || ''; } catch (e) {}
    $('cd-bar').innerHTML = '<input id="cd-ma" class="cd-inp" type="password" placeholder="Mã giáo viên" value="' + esc(ma) + '" style="width:200px">' +
      '<button id="cd-tai" type="button" class="cd-btn">Xem đề đã lưu</button><span class="cd-muted">Đề thầy cô đã lưu trên Trình soạn đề.</span>';
    $('cd-body').innerHTML = st.nh.length ? '' : '<div class="cd-muted">Nhập mã giáo viên rồi bấm “Xem đề đã lưu”.</div>';
    function hien() {
      $('cd-body').innerHTML = '<div class="cd-grid">' + st.nh.map(function (x, i) {
        return '<button type="button" class="cd-card" data-n="' + i + '">' + esc(x.tieuDe || x.id) + '<div style="font-size:11px;color:#64748b;font-weight:600">' +
          (x.t ? new Date(x.t).toLocaleDateString('vi-VN') : '') + (x.gv ? ' · ' + esc(x.gv) : '') + '</div></button>';
      }).join('') + '</div>';
    }
    if (st.nh.length) hien();
    $('cd-tai').onclick = function () {
      var m = $('cd-ma').value.trim(); if (!m) return trangThai('⚠️ Nhập mã giáo viên.', 'err');
      trangThai('⏳ Đang tải ngân hàng đề…');
      jsonp({ action: 'dsDe', key: m }).then(function (d) {
        st.nh = d.ds || []; ghi('dt_ma_gv', m); try { sessionStorage.setItem('dt_ma_gv', m); } catch (e) {}
        trangThai(st.nh.length ? 'Có ' + st.nh.length + ' đề. Bấm vào đề để nạp.' : 'Thầy cô chưa lưu đề nào trên Trình soạn đề.', st.nh.length ? '' : 'err'); hien();
      }).catch(function (e) { trangThai('⚠️ ' + (e.message || e), 'err'); });
    };
    $('cd-body').onclick = function (e) {
      var b = e.target.closest('[data-n]'); if (!b) return; var x = st.nh[+b.dataset.n]; var ten = x.tieuDe || x.id;
      nap(function () { return deTheoId(x.id); }, ten, { ten: ten, id: x.id });
    };
  }

  function veLink() {
    $('cd-bar').innerHTML = '<input id="cd-link" class="cd-inp" type="url" placeholder="Dán link trang làm bài (cc_….html, game_….html), link có #e=… hoặc ?de=…" style="flex:1;min-width:260px">' +
      '<button id="cd-naplink" type="button" class="cd-btn">Nạp link</button>';
    $('cd-body').innerHTML = '<div class="cd-muted">Link lấy từ trang Quản lý, Trình soạn đề hoặc trang làm bài của học sinh.</div>';
    $('cd-naplink').onclick = function () {
      var v = $('cd-link').value.trim(); if (!v) return trangThai('⚠️ Dán link đề vào ô trên.', 'err');
      nap(function () { return deTheoLink(v); }, 'Đề từ link', { ten: 'Đề từ link', link: v });
    };
  }

  // ---------------------------------------------------------------- nạp đề
  function nap(layDe, ten, nho) {
    trangThai('⏳ Đang tải “' + ten + '”…');
    return Promise.resolve().then(layDe).then(function (de) {
      if (!de || !Array.isArray(de.parts)) throw new Error('Không đọc được nội dung đề.');
      if (!(de.meta && de.meta.title)) { de.meta = Object.assign({}, de.meta, { title: ten }); }
      st.onPick(de, ten);
      nho.ten = (de.meta && de.meta.title) || ten; ghi(KEY_DE, JSON.stringify(nho));
      var n = 0; (de.parts || []).forEach(function (p) { n += (p.questions || []).length; });
      trangThai('✅ Đã nạp “' + nho.ten + '” (' + n + ' câu).', 'ok');
      setTimeout(dong, 700);
    }).catch(function (e) { trangThai('⚠️ ' + (e && e.message || e), 'err'); });
  }

  function ganNhat() { try { var g = JSON.parse(lay(KEY_DE) || 'null'); return g && g.ten && (g.link || g.id) ? g : null; } catch (e) { return null; } }
  function napGanNhat(onPick) {
    var g = ganNhat(); if (!g) return Promise.resolve(false);
    dung(); st.onPick = onPick;
    return nap(function () { return g.id ? deTheoId(g.id) : deTheoLink(g.link); }, g.ten, g).then(function () { return true; });
  }
  function mo(onPick, opt) {
    opt = opt || {}; dung(); st.onPick = onPick;
    st.tabs = (opt.tabs || TAT_CA).filter(function (t) { return TAT_CA.indexOf(t) >= 0; }); if (!st.tabs.length) st.tabs = TAT_CA;
    $('cd-tt').textContent = opt.tieuDe || TIEU_DE; $('cd-mota').textContent = opt.moTa || MO_TA;
    $('cd-modal').classList.add('on'); trangThai('Chọn một đề trong danh sách.'); ve(); }
  function dong() { var m = $('cd-modal'); if (m) m.classList.remove('on'); }

  window.ChonDe = { mo: mo, dong: dong, ganNhat: ganNhat, napGanNhat: napGanNhat, deTheoLink: deTheoLink };
})();
