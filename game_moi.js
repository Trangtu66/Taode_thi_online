// game_moi.js – 4 trò chơi ôn tập mới (GV yêu cầu 24/11/2026): 💣 Gỡ bom · 🌾 Nông trại · ⚔️ Đấu trường nhập vai · 🚪 Đồng đội thoát hiểm.
// Vẽ sân 2D bằng SVG, DÙNG CHUNG cho trang HS tự chơi (tu_choi.html) và trang GV trình chiếu cả lớp (tro_choi_lop.html).
// GameMoi.html(game, st, nhan) trả về thẻ <svg> hoàn chỉnh. st: {n, k, doi:[{ten, mau, …}], nho, t: Date.now(), fx:{loai, at, …}, xong, …}
//   – solo (HS tự chơi): doi có 1 phần tử; trình chiếu: 1–4 đội. Hoạt cảnh tính theo thời gian st.t nên vẽ lại liên tục là chạy mượt.
// Hình học sinh: áo cổ trắng, không khăn quàng.
(function () {
'use strict';
var W = 1000;
var TEN = { bom: '💣 Gỡ bom', farm: '🌾 Nông trại', rpg: '⚔️ Đấu trường nhập vai', thoat: '🚪 Đồng đội thoát hiểm' };
var DOI = [{ ten: 'Đội Đỏ', mau: '#DC2626' }, { ten: 'Đội Xanh', mau: '#2563EB' }, { ten: 'Đội Lá', mau: '#16A34A' }, { ten: 'Đội Vàng', mau: '#D97706' }];
var CAY = ['🌽', '🥕', '🍅', '🍉', '🎃', '🥦', '🍓', '🍆'];
var QUAI = [{ ten: 'Slime xanh', ic: '👾' }, { ten: 'Dơi đêm', ic: '🦇' }, { ten: 'Sói xám', ic: '🐺' }, { ten: 'Quỷ đỏ', ic: '👹' }, { ten: 'Nhện độc', ic: '🕷️' }];
var TRUM = { ten: 'Rồng lửa', ic: '🐉' };

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function cl(x, a, b) { return Math.max(a, Math.min(b, x)); }
function ease(x) { x = cl(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function r1(x) { return Math.round(x * 10) / 10; }
function txt(x, y, s, chu, mau, them) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + r1(s) + '" fill="' + (mau || '#fff') + '" font-weight="900" ' + (them || '') + '>' + chu + '</text>'; }
function emo(x, y, s, ch, them) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + r1(s) + '" text-anchor="middle" dominant-baseline="central" ' + (them || '') + '>' + ch + '</text>'; }
function tuoi(st, loai) { return st.fx && (!loai || st.fx.loai === loai) ? st.t - st.fx.at : 1e9; }
function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

// Học sinh (nhìn sang phải). vk: cầm kiếm + khiên màu áo (Đấu trường)
function hs(x, y, ao, s, lat, vk) {
  s = s || 1;
  return '<g transform="translate(' + r1(x) + ' ' + r1(y) + ') scale(' + (lat ? -s : s) + ' ' + s + ')">' +
    '<ellipse cx="0" cy="2" rx="16" ry="4" fill="#000" opacity=".2"/>' +
    '<rect x="-9" y="-30" width="7" height="30" rx="3" fill="#1E293B"/><rect x="2" y="-30" width="7" height="30" rx="3" fill="#1E293B"/>' +
    '<rect x="-13" y="-62" width="26" height="34" rx="8" fill="' + ao + '"/><path d="M -7 -62 L 0 -52 L 7 -62 Z" fill="#fff"/>' +
    '<circle cx="0" cy="-74" r="12" fill="#F5D0A9"/><path d="M -12 -77 Q 0 -92 12 -77 Q 6 -84 -12 -77 Z" fill="#1F2937"/>' +
    '<circle cx="4" cy="-74" r="1.6" fill="#1F2937"/>' +
    (vk ? '<g transform="rotate(-35 14 -48)"><rect x="12" y="-98" width="5" height="48" rx="1" fill="#E5E7EB" stroke="#94A3B8"/><rect x="7" y="-52" width="15" height="4" rx="1" fill="#92400E"/><rect x="12.5" y="-49" width="4" height="9" fill="#78350F"/></g>' +
      '<ellipse cx="-15" cy="-45" rx="10" ry="14" fill="' + ao + '" stroke="#FDE68A" stroke-width="2.5"/><path d="M -15 -55 V -35 M -23 -45 H -7" stroke="#FDE68A" stroke-width="2"/>' : '') +
    '</g>';
}
var DEFS = '<defs>' +
  '<radialGradient id="gm-bom" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#64748B"/><stop offset=".55" stop-color="#1E293B"/><stop offset="1" stop-color="#020617"/></radialGradient>' +
  '<radialGradient id="gm-bomx" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#86EFAC"/><stop offset=".55" stop-color="#15803D"/><stop offset="1" stop-color="#052E16"/></radialGradient>' +
  '<radialGradient id="gm-no" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FEF9C3"/><stop offset=".35" stop-color="#FDE047"/><stop offset=".7" stop-color="#F97316"/><stop offset="1" stop-color="#DC2626" stop-opacity="0"/></radialGradient>' +
  '<linearGradient id="gm-ham" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F172A"/><stop offset="1" stop-color="#1E293B"/></linearGradient>' +
  '<pattern id="gm-luoi" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 H 0 V 40" fill="none" stroke="#334155" stroke-width="1" opacity=".5"/></pattern>' +
  '<pattern id="gm-soc" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="28" fill="#FACC15"/><rect x="14" width="14" height="28" fill="#111827"/></pattern>' +
  '<linearGradient id="gm-troi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#E0F2FE"/></linearGradient>' +
  '<linearGradient id="gm-co" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4ADE80"/><stop offset="1" stop-color="#15803D"/></linearGradient>' +
  '<linearGradient id="gm-dem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1B4B"/><stop offset="1" stop-color="#4C1D95"/></linearGradient>' +
  '<pattern id="gm-da" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill="#44403C"/><path d="M 0 0 H 80 M 0 20 H 80 M 20 0 V 20 M 60 0 V 20 M 40 20 V 40 M 0 20 V 40" stroke="#292524" stroke-width="3"/></pattern>' +
  '<pattern id="gm-gach" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="#475569"/><path d="M 0 0 H 60 M 0 15 H 60 M 30 0 V 15 M 0 15 V 30 M 60 15 V 30" stroke="#334155" stroke-width="2"/></pattern>' +
  '<linearGradient id="gm-sang" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FEF9C3"/><stop offset="1" stop-color="#FDE047"/></linearGradient>' +
  '</defs>';

// ============================================================ 💣 GỠ BOM
// st: {n, k, doi:[{ten, mau, kq:['go'|'no'|undefined]}], con (giây còn của ngòi), tong, daNo (bom câu hiện tại đã nổ), xong, fx:{loai:'go'|'no'|'sai'}}
function veQuaBom(st, cx, cy, S) {
  var t = st.t, tl = st.xong ? 0 : cl(st.con / Math.max(1, st.tong), 0, 1), aNo = tuoi(st, 'no'), aGo = tuoi(st, 'go'), aSai = tuoi(st, 'sai');
  var go = aGo < 1100 || st.daGo || (st.xong && !st.daNo), o = [];
  if (st.daNo && aNo < 900) {   // vụ nổ
    var r = 40 + ease(aNo / 450) * 190, tia = [];
    for (var i = 0; i < 16; i++) { var g = i * Math.PI / 8, rr = r * (i % 2 ? .55 : 1); tia.push(r1(cx + Math.cos(g) * rr * S) + ',' + r1(cy + Math.sin(g) * rr * S)); }
    o.push('<polygon points="' + tia.join(' ') + '" fill="#F97316" opacity="' + r1(1 - aNo / 900) + '"/>');
    o.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r1(r * .7 * S) + '" fill="url(#gm-no)" opacity="' + r1(1 - aNo / 1000) + '"/>');
    o.push(txt(cx, cy + 22 * S, 64 * S, 'BÙM!', '#FEF08A', 'text-anchor="middle" stroke="#7C2D12" stroke-width="3" paint-order="stroke"'));
    return o.join('');
  }
  if (st.daNo) {   // bom đã nổ: hố cháy + khói
    o.push('<ellipse cx="' + cx + '" cy="' + r1(cy + 95 * S) + '" rx="' + r1(120 * S) + '" ry="' + r1(22 * S) + '" fill="#020617" opacity=".8"/>');
    for (var j = 0; j < 5; j++) { var p = ((t / 1800) + j / 5) % 1; o.push('<circle cx="' + r1(cx + (j - 2) * 30 * S + Math.sin(t / 500 + j) * 10) + '" cy="' + r1(cy + 80 * S - p * 200 * S) + '" r="' + r1((24 + p * 30) * S) + '" fill="#64748B" opacity="' + r1(.55 * (1 - p)) + '"/>'); }
    o.push(txt(cx, cy + 10 * S, 30 * S, '💥 Bom đã nổ!', '#FCA5A5', 'text-anchor="middle"'));
    o.push(txt(cx, cy + 46 * S, 17 * S, 'Vẫn phải trả lời đúng để qua câu', '#E2E8F0', 'text-anchor="middle" font-weight="700"'));
    return o.join('');
  }
  var rung = !go && tl < .25 ? Math.sin(t / 25) * 3 : 0, lac = aSai < 450 ? Math.sin(aSai / 30) * 8 : 0;
  o.push('<g transform="translate(' + r1(cx + rung + lac) + ' ' + cy + ') scale(' + S + ')">');
  if (!go && tl < .25) o.push('<circle r="128" fill="none" stroke="#EF4444" stroke-width="6" opacity="' + r1(.35 + .35 * Math.sin(t / 110)) + '"/>');
  o.push('<ellipse cx="0" cy="108" rx="92" ry="12" fill="#000" opacity=".35"/>');
  o.push('<circle r="100" fill="url(#' + (go ? 'gm-bomx' : 'gm-bom') + ')" stroke="#0B1220" stroke-width="3"/><ellipse cx="-38" cy="-42" rx="26" ry="15" fill="#fff" opacity=".22" transform="rotate(-30 -38 -42)"/>');
  o.push('<rect x="38" y="-104" width="42" height="30" rx="5" fill="#64748B" stroke="#1E293B" stroke-width="3" transform="rotate(35 59 -89)"/>');
  // ngòi nổ: đường cong từ nắp (u = 0) tới đầu ngòi (u = 1); cháy dần từ đầu ngòi về nắp
  var P0 = [72, -108], P1 = [140, -170], P2 = [58, -196], u = go ? 1 : tl;
  function B(v) { var a = 1 - v; return [a * a * P0[0] + 2 * a * v * P1[0] + v * v * P2[0], a * a * P0[1] + 2 * a * v * P1[1] + v * v * P2[1]]; }
  var d = [], m = 24;
  for (var q = 0; q <= m; q++) { var b = B(u * q / m); d.push((q ? 'L ' : 'M ') + r1(b[0]) + ' ' + r1(b[1])); }
  if (u > 0) o.push('<path d="' + d.join(' ') + '" fill="none" stroke="#A16207" stroke-width="7" stroke-linecap="round"/><path d="' + d.join(' ') + '" fill="none" stroke="#FDE68A" stroke-width="2" stroke-dasharray="4 5"/>');
  if (!go && u > 0) {
    var e = B(u), nh = 1 + .35 * Math.sin(t / 40);
    o.push('<circle cx="' + r1(e[0]) + '" cy="' + r1(e[1]) + '" r="' + r1(14 * nh) + '" fill="#FDE047" opacity=".55"/><circle cx="' + r1(e[0]) + '" cy="' + r1(e[1]) + '" r="7" fill="#FFF7ED"/>');
    for (var z = 0; z < 6; z++) { var gz = z * 1.05 + t / 90; o.push('<line x1="' + r1(e[0]) + '" y1="' + r1(e[1]) + '" x2="' + r1(e[0] + Math.cos(gz) * 20 * nh) + '" y2="' + r1(e[1] + Math.sin(gz) * 20 * nh) + '" stroke="#F97316" stroke-width="3" stroke-linecap="round"/>'); }
  }
  // màn hình đếm giờ + 3 dây
  o.push('<rect x="-62" y="-24" width="124" height="52" rx="9" fill="#020617" stroke="#475569" stroke-width="3"/>');
  o.push(txt(0, 14, go ? 24 : 36, go ? 'GỠ XONG' : mmss(st.con), go ? '#4ADE80' : (tl < .25 ? '#F87171' : '#FB923C'), 'text-anchor="middle" font-family="Consolas,monospace"'));
  [['#EF4444', 58], ['#3B82F6', 72], ['#FACC15', 86]].forEach(function (w, i) {
    if (go) o.push('<path d="M -70 40 Q -40 ' + w[1] + ' -10 ' + (w[1] - 4) + '" fill="none" stroke="' + w[0] + '" stroke-width="5" stroke-linecap="round"/><path d="M 12 ' + (w[1] - 2) + ' Q 40 ' + w[1] + ' 70 40" fill="none" stroke="' + w[0] + '" stroke-width="5" stroke-linecap="round"/>');
    else o.push('<path d="M -70 40 Q 0 ' + (w[1] + 14) + ' 70 40" fill="none" stroke="' + w[0] + '" stroke-width="5" stroke-linecap="round"/>');
  });
  o.push('</g>');
  if (go && aGo < 1100) {
    o.push(txt(cx, cy - 130 * S, 40 * S * (1 + .15 * (1 - ease(aGo / 300))), '✔ ĐÃ GỠ!', '#4ADE80', 'text-anchor="middle" stroke="#052E16" stroke-width="3" paint-order="stroke"'));
    for (var s2 = 0; s2 < 8; s2++) { var gg = s2 * Math.PI / 4, rr2 = (60 + ease(aGo / 700) * 90) * S; o.push(emo(cx + Math.cos(gg) * rr2, cy + Math.sin(gg) * rr2, 22 * S, '✨', 'opacity="' + r1(1 - aGo / 1100) + '"')); }
  }
  return o.join('');
}
function bom(st) {
  var nho = st.nho, F = nho ? 1.6 : 1, n = st.n, k = st.k, doi = st.doi;
  var x0 = nho ? 50 : 500, rong = nho ? 900 : 460;
  var cot = n > (nho ? 10 : 15) ? Math.ceil(n / 2) : n, dong = Math.ceil(n / cot), dk = Math.min(nho ? 52 : 32, (rong - (cot - 1) * 6) / cot);
  var hang = 34 * F + dong * (dk + 6) + 10, y0 = nho ? 470 : 96;
  var H = Math.max(nho ? 560 : 440, y0 + doi.length * hang + 30);
  var o = [DEFS, '<rect width="1000" height="' + H + '" fill="url(#gm-ham)"/><rect width="1000" height="' + H + '" fill="url(#gm-luoi)"/>',
    '<rect y="' + (H - 18) + '" width="1000" height="18" fill="url(#gm-soc)"/>'];
  var cx = nho ? 500 : 250, cy = nho ? 250 : Math.min(H / 2 + 10, 250), S = nho ? 1.45 : 1;
  o.push(txt(nho ? 30 : 24, 40 * F, 22 * F, '💣 QUẢ BOM ' + Math.min(k + 1, n) + '/' + n, '#FDE68A'));
  if (st.xong) o.push(txt(cx, cy + 10, 34 * F, '🏁 Hết bom!', '#4ADE80', 'text-anchor="middle"'));
  else o.push(veQuaBom(st, cx, cy, S));
  if (!nho) o.push(txt(x0, 62, 17, 'TIẾN ĐỘ GỠ BOM', '#94A3B8', 'letter-spacing="1"'));
  doi.forEach(function (d, j) {
    var y = y0 + j * hang, go = 0, no = 0;
    (d.kq || []).forEach(function (x) { if (x === 'go') go++; else if (x === 'no') no++; });
    o.push('<circle cx="' + (x0 + 9 * F) + '" cy="' + r1(y + 12 * F) + '" r="' + r1(9 * F) + '" fill="' + d.mau + '"/>');
    o.push(txt(x0 + 24 * F, y + 19 * F, 18 * F, esc(d.ten) + '  <tspan fill="#4ADE80">✔ ' + go + '</tspan>  <tspan fill="#FB923C">💥 ' + no + '</tspan>', '#F8FAFC'));
    for (var i = 0; i < n; i++) {
      var x = x0 + (i % cot) * (dk + 6) + dk / 2, yy = y + 34 * F + Math.floor(i / cot) * (dk + 6) + dk / 2, r = dk / 2, kq = (d.kq || [])[i];
      if (kq === 'go') o.push('<circle cx="' + r1(x) + '" cy="' + r1(yy) + '" r="' + r1(r) + '" fill="#16A34A"/>' + txt(x, yy + r * .45, r * 1.2, '✓', '#fff', 'text-anchor="middle"'));
      else if (kq === 'no') o.push('<circle cx="' + r1(x) + '" cy="' + r1(yy) + '" r="' + r1(r) + '" fill="#EA580C"/>' + emo(x, yy, r * 1.15, '💥'));
      else {
        var hien = i === k && !st.xong;
        o.push('<circle cx="' + r1(x) + '" cy="' + r1(yy) + '" r="' + r1(r * .82) + '" fill="#0B1220" stroke="' + (hien ? '#FACC15' : '#475569') + '" stroke-width="' + (hien ? 3 : 1.5) + '" opacity="' + (hien ? 1 : .7) + '"/>');
        o.push('<path d="M ' + r1(x + r * .5) + ' ' + r1(yy - r * .6) + ' q ' + r1(r * .4) + ' ' + r1(-r * .5) + ' ' + r1(r * .1) + ' ' + r1(-r * .7) + '" stroke="#A16207" stroke-width="2" fill="none"/>');
      }
    }
  });
  return { svg: o.join(''), H: H };
}

// ============================================================ 🌾 NÔNG TRẠI
// st: {n, k, doi:[{ten, mau, cay:[0..3 | undefined]}], sau (câu hiện tại đang có sâu), xong, fx:{loai:'dung'|'sai', doi:[j…]}}
function veCay(x, y, s, muc, i, t) {   // (x, y): gốc cây ở mặt luống
  var o = [];
  if (muc === 0) return '<path d="M ' + r1(x) + ' ' + r1(y) + ' q ' + r1(4 * s) + ' ' + r1(-18 * s) + ' ' + r1(14 * s) + ' ' + r1(-16 * s) + '" stroke="#78716C" stroke-width="' + r1(3 * s) + '" fill="none"/>' + emo(x + 14 * s, y - 18 * s, 16 * s, '🍂');
  var lac = Math.sin(t / 600 + i) * 3, cao = [0, 18, 38, 46][muc] * s;
  o.push('<path d="M ' + r1(x) + ' ' + r1(y) + ' Q ' + r1(x + lac) + ' ' + r1(y - cao / 2) + ' ' + r1(x + lac) + ' ' + r1(y - cao) + '" stroke="#15803D" stroke-width="' + r1(3.5 * s) + '" fill="none" stroke-linecap="round"/>');
  var la = muc === 1 ? [[.9, 1]] : [[.45, 1], [.45, -1], [.8, 1], [.8, -1]];
  la.forEach(function (l) { var ly = y - cao * l[0], lx = x + lac * l[0]; o.push('<ellipse cx="' + r1(lx + l[1] * 7 * s) + '" cy="' + r1(ly) + '" rx="' + r1(8 * s) + '" ry="' + r1(4 * s) + '" fill="#22C55E" transform="rotate(' + (l[1] * -25) + ' ' + r1(lx + l[1] * 7 * s) + ' ' + r1(ly) + ')"/>'); });
  if (muc === 1) o.push('<ellipse cx="' + r1(x + lac - 6 * s) + '" cy="' + r1(y - cao) + '" rx="' + r1(7 * s) + '" ry="' + r1(3.5 * s) + '" fill="#4ADE80" transform="rotate(25 ' + r1(x + lac - 6 * s) + ' ' + r1(y - cao) + ')"/>');
  if (muc === 3) o.push(emo(x + lac, y - cao - 10 * s, 30 * s, CAY[i % CAY.length]));
  return o.join('');
}
function farm(st) {
  var nho = st.nho, F = nho ? 1.6 : 1, n = st.n, k = st.k, doi = st.doi, t = st.t, solo = doi.length === 1;
  var toiDa = solo ? (nho ? 6 : 10) : doi.length === 2 ? 8 : 15, cot = n <= toiDa ? n : Math.ceil(n / Math.ceil(n / toiDa));
  var dong = Math.ceil(n / cot), kc = 8, pw = Math.min(solo ? 92 : 70, (920 - (cot - 1) * kc) / cot), ph = pw * .62, s = pw / 80;
  var hd = ph + 48 * s + 6, dai = 30 * F + dong * hd + 8, top = nho ? 190 : 150;
  var H = Math.max(nho ? 560 : 440, top + doi.length * dai + 20);
  var o = [DEFS, '<rect width="1000" height="' + H + '" fill="url(#gm-troi)"/>'];
  // mặt trời, mây, đồi, nhà kho, hàng rào
  o.push('<g transform="translate(90 ' + r1(56 * F) + ') rotate(' + r1(t / 60 % 360) + ')">');
  for (var r = 0; r < 12; r++) o.push('<rect x="-3" y="' + r1(-58 * F) + '" width="6" height="' + r1(16 * F) + '" rx="3" fill="#FBBF24" transform="rotate(' + r * 30 + ')"/>');
  o.push('<circle r="' + r1(34 * F) + '" fill="#FDE047" stroke="#F59E0B" stroke-width="3"/></g>');
  [[0, 50], [.45, 90]].forEach(function (m, i) { var x = ((t / 90 + m[0] * 1000) % 1200) - 100; o.push('<g transform="translate(' + r1(x) + ' ' + r1(m[1] * F) + ') scale(' + F + ')" opacity=".9"><ellipse rx="44" ry="16" fill="#fff"/><ellipse cx="-22" cy="-8" rx="22" ry="14" fill="#fff"/><ellipse cx="18" cy="-12" rx="26" ry="18" fill="#fff"/></g>'); });
  o.push('<path d="M 0 ' + (top - 30) + ' Q 220 ' + (top - 85) + ' 460 ' + (top - 34) + ' T 1000 ' + (top - 40) + ' V ' + H + ' H 0 Z" fill="#86EFAC"/>');
  o.push('<rect y="' + (top - 22) + '" width="1000" height="' + (H - top + 22) + '" fill="url(#gm-co)"/>');
  var bx = nho ? 830 : 870, by = top - 22;
  o.push('<g transform="translate(' + bx + ' ' + by + ') scale(' + (nho ? 1.25 : 1) + ')"><path d="M -60 0 V -62 L 0 -100 L 60 -62 V 0 Z" fill="#B91C1C" stroke="#7F1D1D" stroke-width="3"/><path d="M -70 -60 L 0 -106 L 70 -60" stroke="#F8FAFC" stroke-width="7" fill="none"/><rect x="-24" y="-44" width="48" height="44" fill="#FEF2F2"/><path d="M -24 -44 L 24 0 M 24 -44 L -24 0" stroke="#B91C1C" stroke-width="5"/></g>');
  for (var f = 0; f < 1000; f += 34) o.push('<rect x="' + f + '" y="' + (top - 40) + '" width="7" height="24" fill="#FEF3C7" stroke="#A16207"/>');
  o.push('<rect y="' + (top - 34) + '" width="1000" height="5" fill="#FEF3C7"/><rect y="' + (top - 24) + '" width="1000" height="5" fill="#FEF3C7"/>');
  var tongSan = 0;
  doi.forEach(function (d) { (d.cay || []).forEach(function (m) { tongSan += m || 0; }); });
  if (solo) o.push(txt(bx - 80 * (nho ? 1.25 : 1), by - 50, 20 * F, '🧺 ' + tongSan + ' nông sản', '#14532D', 'text-anchor="end" stroke="#F0FDF4" stroke-width="4" paint-order="stroke"'));
  var aD = tuoi(st, 'dung'), aS = tuoi(st, 'sai');
  doi.forEach(function (d, j) {
    var y0 = top + j * dai, san = 0, x0 = (1000 - (cot * pw + (cot - 1) * kc)) / 2;
    (d.cay || []).forEach(function (m) { san += m || 0; });
    o.push('<rect x="' + r1(x0 - 10) + '" y="' + r1(y0) + '" width="' + r1(cot * pw + (cot - 1) * kc + 20) + '" height="' + r1(dai - 6) + '" rx="14" fill="#166534" opacity=".28"/>');
    o.push('<circle cx="' + r1(x0 + 6 * F) + '" cy="' + r1(y0 + 15 * F) + '" r="' + r1(8 * F) + '" fill="' + d.mau + '" stroke="#fff" stroke-width="2"/>');
    o.push(txt(x0 + 20 * F, y0 + 21 * F, 17 * F, esc(d.ten) + ' · 🧺 ' + san + ' nông sản', '#F0FDF4', 'stroke="#14532D" stroke-width="3" paint-order="stroke"'));
    for (var i = 0; i < n; i++) {
      var x = x0 + (i % cot) * (pw + kc), y = y0 + 30 * F + Math.floor(i / cot) * hd + 48 * s, m = (d.cay || [])[i], hien = i === k && !st.xong;
      o.push('<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(pw) + '" height="' + r1(ph) + '" rx="' + r1(8 * s) + '" fill="#92400E" stroke="' + (hien ? '#FACC15' : '#78350F') + '" stroke-width="' + (hien ? 4 : 2) + '"' + (hien ? ' stroke-dasharray="8 5"' : '') + '/>');
      for (var l = 1; l < 3; l++) o.push('<path d="M ' + r1(x + 6) + ' ' + r1(y + ph * l / 3) + ' H ' + r1(x + pw - 6) + '" stroke="#78350F" stroke-width="2"/>');
      if (m !== undefined && m !== null) {
        var moc = st.fx && st.fx.cau === i && aD < 900 && (!st.fx.doi || st.fx.doi.indexOf(j) >= 0);
        var mm = moc ? Math.max(1, Math.round(m * ease(aD / 700))) : m;
        o.push(veCay(x + pw / 2, y + ph * .5, s, m === 0 ? 0 : mm, i, t));
        if (moc) for (var g = 0; g < 4; g++) o.push(emo(x + pw * (.2 + g * .2), y - 20 * s - (aD / 900) * 30 * s, 14 * s, '💧', 'opacity="' + r1(1 - aD / 900) + '"'));
      } else if (hien) {
        o.push(emo(x + pw / 2, y + ph * .45, 22 * s * (1 + .12 * Math.sin(t / 200)), '❓'));
        if (st.sau) o.push(emo(x + pw / 2 + Math.sin(t / 300) * pw * .3, y + ph * .2, 26 * s, '🐛', aS < 500 ? 'transform="translate(0 ' + r1(-Math.abs(Math.sin(aS / 60)) * 8) + ')"' : ''));
      } else o.push('<circle cx="' + r1(x + pw / 2) + '" cy="' + r1(y + ph * .45) + '" r="' + r1(3 * s) + '" fill="#451A03"/>');
    }
    if (solo && !st.xong) {   // bác nông dân (em) đứng cạnh luống đang trồng
      var xc = x0 + (k % cot) * (pw + kc) + pw / 2, yc = y0 + 30 * F + Math.floor(k / cot) * hd + 48 * s;
      o.push(hs(cl(xc - pw * .62, 30, 970), yc + ph, d.mau, .62 * s * (nho ? 1.1 : 1)));
      o.push(emo(cl(xc - pw * .62, 30, 970) + 14 * s, yc + ph - 40 * s, 20 * s, '🪣'));
    }
  });
  if (st.xong) o.push(txt(500, top - 52, 30 * F, '🌾 Vụ mùa kết thúc – ' + tongSan + ' nông sản!', '#14532D', 'text-anchor="middle" stroke="#F0FDF4" stroke-width="5" paint-order="stroke"'));
  return { svg: o.join(''), H: H };
}

// ============================================================ ⚔️ ĐẤU TRƯỜNG NHẬP VAI
// Chia đề thành các ải; mỗi ải một quái, ải cuối là trùm. Solo: máu quái = số câu của ải.
function chiaAi(n) {
  var m = n <= 6 ? 2 : n <= 12 ? 3 : n <= 20 ? 4 : 5, co = Math.floor(n / m), du = n % m, ds = [], tu = 0;
  for (var i = 0; i < m; i++) { var so = co + (i >= m - du ? 1 : 0), q = i === m - 1 ? TRUM : QUAI[i % QUAI.length]; ds.push({ ten: q.ten, ic: q.ic, trum: i === m - 1, tu: tu, den: tu + so, so: so }); tu += so; }
  return ds;
}
// st: {n, k, ai:[…chiaAi, mau:{con,max}, ha:bool, tron:bool], iAi, hp, hpMax, doi:[{ten, mau, sat}], xong, fx:{loai:'danh'|'chimang'|'trung'|'ha'|'guc'|'tron', doi:[j…], sat}}
function rpg(st) {
  var nho = st.nho, F = nho ? 1.5 : 1, t = st.t, H = nho ? 600 : 440, san = H * .7, o = [DEFS];
  o.push('<rect width="1000" height="' + H + '" fill="url(#gm-dem)"/>');
  for (var s = 0; s < 26; s++) o.push('<circle cx="' + ((s * 151) % 1000) + '" cy="' + r1((s * 67) % (san * .6)) + '" r="' + (s % 4 ? 1.4 : 2.4) + '" fill="#E9D5FF" opacity="' + r1(.4 + .4 * Math.sin(t / 700 + s)) + '"/>');
  o.push('<path d="M 0 ' + r1(san - 120) + ' L 120 ' + r1(san - 150) + ' L 120 ' + r1(san - 190) + ' L 150 ' + r1(san - 190) + ' L 150 ' + r1(san - 160) + ' L 850 ' + r1(san - 160) + ' L 850 ' + r1(san - 190) + ' L 880 ' + r1(san - 190) + ' L 880 ' + r1(san - 150) + ' L 1000 ' + r1(san - 120) + ' V ' + r1(san) + ' H 0 Z" fill="#312E81" opacity=".85"/>');
  o.push('<rect y="' + r1(san) + '" width="1000" height="' + r1(H - san) + '" fill="url(#gm-da)"/><rect y="' + r1(san) + '" width="1000" height="6" fill="#1C1917"/>');
  [60, 940].forEach(function (x, i) { var ch = 1 + .12 * Math.sin(t / 90 + i * 2); o.push('<rect x="' + (x - 5) + '" y="' + r1(san - 120) + '" width="10" height="120" fill="#78350F"/><ellipse cx="' + x + '" cy="' + r1(san - 130) + '" rx="' + r1(26 * ch) + '" ry="' + r1(30 * ch) + '" fill="#F97316" opacity=".25"/>' + emo(x, san - 140, 40 * ch, '🔥')); });
  var A = st.ai, ai = A[Math.min(st.iAi, A.length - 1)];
  // hàng ải trên cùng
  var bw = Math.min(nho ? 120 : 88, 600 / A.length), bx = 500 - (A.length * bw) / 2;
  A.forEach(function (a, i) {
    var x = bx + i * bw + bw / 2, cur = i === st.iAi && !st.xong;
    o.push('<circle cx="' + r1(x) + '" cy="' + r1(34 * F) + '" r="' + r1(22 * F) + '" fill="' + (a.ha ? '#166534' : a.tron ? '#7C2D12' : cur ? '#7C3AED' : '#1E1B4B') + '" stroke="' + (cur ? '#FACC15' : '#A5B4FC') + '" stroke-width="' + (cur ? 4 : 2) + '"/>');
    o.push(emo(x, 34 * F, 24 * F, a.ic, a.ha || a.tron ? 'opacity=".45"' : ''));
    if (a.ha) o.push(txt(x + 12 * F, 52 * F, 18 * F, '✓', '#4ADE80'));
    if (i < A.length - 1) o.push('<line x1="' + r1(x + 23 * F) + '" y1="' + r1(34 * F) + '" x2="' + r1(x + bw - 23 * F) + '" y2="' + r1(34 * F) + '" stroke="#A5B4FC" stroke-width="3" stroke-dasharray="5 5"/>');
  });
  o.push(txt(30, 36 * F, 20 * F, st.xong ? '🏆 Hoàn thành' : 'ẢI ' + (st.iAi + 1) + '/' + A.length, '#FDE68A'));
  var aDanh = Math.min(tuoi(st, 'danh'), tuoi(st, 'chimang')), aTrung = tuoi(st, 'trung'), aHa = tuoi(st, 'ha'), aGuc = tuoi(st, 'guc'), aTron = tuoi(st, 'tron');
  // quái vật
  var mx = nho ? 700 : 730, cz = (ai.trum ? 200 : 150) * (nho ? 1.25 : 1), my = san - cz * .45 + Math.sin(t / 320) * 6;
  var lunge = aTrung < 520 ? -150 * Math.sin(Math.PI * aTrung / 520) : 0, rung = aDanh < 420 ? Math.sin(aDanh / 18) * 12 : 0;
  var conQuai = !st.xong && !(ai.ha && aHa > 900) && !(ai.tron && aTron > 900);
  if (conQuai) {
    var mo = ai.ha ? 1 - ease(aHa / 900) : ai.tron ? 1 - ease(aTron / 900) : 1, sc = ai.ha ? 1 - .5 * ease(aHa / 900) : 1, dx = ai.tron ? ease(aTron / 900) * 300 : 0;
    o.push('<ellipse cx="' + r1(mx + lunge) + '" cy="' + r1(san + 8) + '" rx="' + r1(cz * .42) + '" ry="' + r1(cz * .08) + '" fill="#000" opacity=".35"/>');
    o.push('<g opacity="' + r1(mo) + '" transform="translate(' + r1(mx + lunge + rung + dx) + ' ' + r1(my) + ') scale(' + r1(sc) + ')">' + emo(0, 0, cz, ai.ic, 'transform="scale(-1 1)"') + (ai.trum ? emo(0, -cz * .55, cz * .3, '👑') : '') + '</g>');
    var hb = 240 * (nho ? 1.2 : 1), hx = mx - hb / 2, hy = Math.max(my - cz * .62 - 30 * F, 86 * F), mau = ai.mau || { con: 1, max: 1 }, tl = cl(mau.con / Math.max(1, mau.max), 0, 1);
    o.push(txt(mx, hy - 10, 18 * F, (ai.trum ? '👑 TRÙM · ' : '') + esc(ai.ten), ai.trum ? '#FCA5A5' : '#E9D5FF', 'text-anchor="middle" stroke="#1E1B4B" stroke-width="4" paint-order="stroke"'));
    o.push('<rect x="' + r1(hx) + '" y="' + r1(hy) + '" width="' + r1(hb) + '" height="' + r1(16 * F) + '" rx="8" fill="#1E1B4B" stroke="#C4B5FD" stroke-width="2"/><rect x="' + r1(hx + 2) + '" y="' + r1(hy + 2) + '" width="' + r1(Math.max(0, (hb - 4) * tl)) + '" height="' + r1(16 * F - 4) + '" rx="6" fill="' + (tl > .5 ? '#EF4444' : tl > .2 ? '#F97316' : '#FACC15') + '"/>');
    o.push(txt(mx, hy + 13 * F, 12 * F, Math.max(0, Math.ceil(mau.con)) + ' / ' + mau.max + ' máu', '#fff', 'text-anchor="middle"'));
  }
  // anh hùng (solo: em; trình chiếu: mỗi đội một anh hùng)
  var doi = st.doi, nd = doi.length, hx0 = nho ? 250 : 270;
  doi.forEach(function (d, j) {
    var danhDoi = aDanh < 460 && (!st.fx.doi || st.fx.doi.indexOf(j) >= 0), x = hx0 - (nd - 1) * 34 + j * 68 + (danhDoi ? 200 * Math.sin(Math.PI * aDanh / 460) : 0);
    var y = san + (nd > 1 ? (j % 2) * 18 : 0), sc = (nd > 1 ? 1.25 : 1.7) * (nho ? 1.3 : 1);
    o.push(hs(x, y, d.mau, sc, false, true));
    if (nd > 1) o.push(txt(x, y + 24, 14 * F, esc(d.ten) + ' · ⚔️' + (d.sat || 0), '#F5F3FF', 'text-anchor="middle" stroke="#1E1B4B" stroke-width="3" paint-order="stroke"'));
  });
  // máu của em / cả đội
  var tim = [];
  for (var h = 0; h < st.hpMax; h++) tim.push(h < st.hp ? '❤️' : '🤍');
  o.push(emo(hx0, san - (nd > 1 ? 150 : 175) * (nho ? 1.3 : 1), 22 * F, tim.join('')));
  if (aTrung < 700) o.push('<rect width="500" height="' + H + '" fill="#DC2626" opacity="' + r1(.32 * (1 - aTrung / 700)) + '"/>' + txt(hx0, san - 200 * (nho ? 1.3 : 1) - aTrung / 15, 30 * F, '-1 ❤️', '#FECACA', 'text-anchor="middle" stroke="#7F1D1D" stroke-width="3" paint-order="stroke"'));
  if (aDanh < 420 && conQuai) o.push('<path d="M ' + r1(mx - 90) + ' ' + r1(my - 90) + ' Q ' + r1(mx + 40) + ' ' + r1(my - 20) + ' ' + r1(mx + 60) + ' ' + r1(my + 90) + '" stroke="#fff" stroke-width="' + r1(14 * (1 - aDanh / 420)) + '" fill="none" stroke-linecap="round" opacity="' + r1(1 - aDanh / 420) + '"/>');
  if (aDanh < 1000 && st.fx) {
    var chi = st.fx.loai === 'chimang';
    o.push(txt(mx + cz * .55, my - cz * .2 - aDanh / 12, (chi ? 40 : 34) * F, '-' + (st.fx.sat || 1), chi ? '#FDE047' : '#FCA5A5', 'text-anchor="middle" opacity="' + r1(1 - aDanh / 1000) + '" stroke="#450A0A" stroke-width="3" paint-order="stroke"'));
    if (chi) o.push(txt(500, san * .42, 38 * F, '⚡ CHÍ MẠNG!', '#FDE047', 'text-anchor="middle" opacity="' + r1(1 - aDanh / 1000) + '" stroke="#713F12" stroke-width="4" paint-order="stroke"'));
  }
  if (aHa < 1500 && ai.ha) o.push(txt(500, san * .45, 46 * F, ai.trum ? '🐉 HẠ GỤC TRÙM!' : '💥 HẠ GỤC!', '#4ADE80', 'text-anchor="middle" stroke="#052E16" stroke-width="5" paint-order="stroke"'));
  if (aTron < 1500 && ai.tron) o.push(txt(500, san * .45, 38 * F, '💨 Quái vật bỏ chạy!', '#FDBA74', 'text-anchor="middle" stroke="#431407" stroke-width="5" paint-order="stroke"'));
  if (aGuc < 1800) o.push('<rect width="1000" height="' + H + '" fill="#000" opacity="' + r1(.5 * (1 - aGuc / 1800)) + '"/>' + txt(500, H * .45, 40 * F, '😵 GỤC NGÃ – HỒI SINH!', '#FECACA', 'text-anchor="middle" stroke="#450A0A" stroke-width="5" paint-order="stroke"'));
  if (st.xong) o.push(txt(500, H * .42, 48 * F, st.thang === false ? '⚔️ Hết trận!' : '🏆 CHIẾN THẮNG!', '#FDE047', 'text-anchor="middle" stroke="#713F12" stroke-width="5" paint-order="stroke"'));
  return { svg: o.join(''), H: H };
}

// ============================================================ 🚪 ĐỒNG ĐỘI THOÁT HIỂM
// Mỗi phòng 3 ổ khoá (mỗi ổ một câu); mở hết ổ khoá thì cửa mở, cả đội sang phòng sau; qua phòng cuối là ra Lối thoát.
function chiaPhong(n) { var ds = []; for (var tu = 0; tu < n; tu += 3) ds.push({ tu: tu, den: Math.min(n, tu + 3) }); return ds; }
function oKhoa(x, y, s, mo) {
  return '<g transform="translate(' + r1(x) + ' ' + r1(y) + ') scale(' + r1(s) + ')">' +
    '<path d="' + (mo ? 'M -10 -4 V -22 A 10 10 0 0 1 10 -22 V -16' : 'M -10 0 V -12 A 10 10 0 0 1 10 -12 V 0') + '" fill="none" stroke="#CBD5E1" stroke-width="5"/>' +
    '<rect x="-16" y="-4" width="32" height="26" rx="5" fill="' + (mo ? '#22C55E' : '#F59E0B') + '" stroke="' + (mo ? '#14532D' : '#78350F') + '" stroke-width="2.5"/>' +
    (mo ? '<path d="M -7 9 L -2 14 L 8 3" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : '<circle cx="0" cy="6" r="4" fill="#451A03"/><rect x="-1.5" y="8" width="3" height="8" fill="#451A03"/>') + '</g>';
}
// st: {n, k, doi:[{ten, mau}], con (giây còn), tong, quaGio, xong, fx:{loai:'mo'|'khoa'|'bao'}}
function thoat(st) {
  var nho = st.nho, F = nho ? 1.5 : 1, t = st.t, n = st.n, k = st.k, H = nho ? 600 : 440, P = chiaPhong(n), o = [DEFS];
  var ip = Math.min(P.length - 1, Math.floor(Math.min(k, n - 1) / 3)), aMo = tuoi(st, 'mo'), aBao = tuoi(st, 'bao'), aKhoa = tuoi(st, 'khoa');
  // phòng đang hiện: lúc cửa đang mở vẫn là phòng vừa xong
  if (st.fx && st.fx.loai === 'mo' && aMo < 1700 && st.fx.phong !== undefined) ip = st.fx.phong;
  var ph = P[ip], tl = cl(st.con / Math.max(1, st.tong), 0, 1), nguy = !st.xong && (st.quaGio || tl < .2);
  if (st.xong) {   // đã thoát ra ngoài
    o.push('<rect width="1000" height="' + H + '" fill="url(#gm-troi)"/><circle cx="820" cy="' + r1(90 * F) + '" r="' + r1(50 * F) + '" fill="#FDE047"/>');
    o.push('<rect y="' + r1(H * .66) + '" width="1000" height="' + r1(H * .34) + '" fill="url(#gm-co)"/>');
    o.push('<rect x="60" y="' + r1(H * .66 - 210) + '" width="170" height="210" fill="#475569"/><rect x="100" y="' + r1(H * .66 - 150) + '" width="90" height="150" fill="#1E293B"/>' + txt(145, H * .66 - 170, 22, '🚪 LỐI THOÁT', '#4ADE80', 'text-anchor="middle"'));
    st.doi.concat(st.doi.length === 1 ? [{ mau: '#DB2777' }, { mau: '#059669' }] : []).forEach(function (d, j) { o.push(hs(360 + j * 110, H * .66 + 10 - Math.abs(Math.sin(t / 180 + j)) * 22, d.mau, 1.4 * (nho ? 1.2 : 1))); });
    o.push(txt(560, H * .3, 40 * F, st.quaGio ? '🚪 Đã thoát ra ngoài!' : '🎉 THOÁT HIỂM THÀNH CÔNG!', '#14532D', 'text-anchor="middle" stroke="#F0FDF4" stroke-width="6" paint-order="stroke"'));
    return { svg: o.join(''), H: H };
  }
  // tường, sàn
  var tran = 108 * F, san = H * .8;
  o.push('<rect width="1000" height="' + H + '" fill="#0F172A"/><rect y="' + r1(tran) + '" width="1000" height="' + r1(san - tran) + '" fill="url(#gm-gach)"/>');
  o.push('<path d="M 0 ' + r1(san) + ' H 1000 V ' + H + ' H 0 Z" fill="#1F2937"/><path d="M 0 ' + r1(san) + ' H 1000" stroke="#0F172A" stroke-width="6"/>');
  // bản đồ các phòng
  var bw = Math.min(nho ? 130 : 110, (940 - 8 * P.length) / (P.length + 1)), bx = 500 - ((P.length + 1) * (bw + 8)) / 2;
  P.concat([{ thoat: true }]).forEach(function (p, i) {
    var x = bx + i * (bw + 8), xong = !p.thoat && k >= p.den, cur = i === ip;
    o.push('<rect x="' + r1(x) + '" y="' + r1(10) + '" width="' + r1(bw) + '" height="' + r1(36 * F) + '" rx="8" fill="' + (p.thoat ? '#166534' : xong ? '#15803D' : cur ? '#1D4ED8' : '#334155') + '" stroke="' + (cur ? '#FACC15' : '#64748B') + '" stroke-width="' + (cur ? 3 : 1.5) + '"/>');
    var nh = p.thoat ? '🚪 THOÁT' : 'P' + (i + 1) + ' ' + (xong ? '🔓' : (k - p.tu > 0 && k < p.den ? (k - p.tu) + '/' + (p.den - p.tu) : '🔒'));
    o.push(txt(x + bw / 2, 10 + 24 * F, 15 * F, nh, '#F8FAFC', 'text-anchor="middle"'));
  });
  // đồng hồ thoát hiểm
  var y2 = 18 + 40 * F, mau = st.quaGio ? '#DC2626' : tl > .5 ? '#22C55E' : tl > .2 ? '#F59E0B' : '#EF4444';
  o.push('<rect x="30" y="' + r1(y2) + '" width="940" height="' + r1(18 * F) + '" rx="9" fill="#1E293B" stroke="#475569"/><rect x="32" y="' + r1(y2 + 2) + '" width="' + r1(936 * (st.quaGio ? 1 : tl)) + '" height="' + r1(18 * F - 4) + '" rx="7" fill="' + mau + '"' + (st.quaGio ? ' opacity="' + r1(.5 + .5 * Math.sin(t / 150)) + '"' : '') + '/>');
  o.push(txt(500, y2 + 14 * F, 14 * F, st.quaGio ? '⏰ QUÁ GIỜ – còi báo động đang hú!' : '⏳ Thời gian thoát hiểm còn ' + mmss(st.con), '#fff', 'text-anchor="middle"'));
  // cửa phòng + ổ khoá
  var cw = nho ? 220 : 190, cx = nho ? 640 : 680, ch = san - tran - 50, cy = san - ch, mo = st.fx && st.fx.loai === 'mo' && aMo < 1700 ? ease(aMo / 900) : 0;
  o.push('<rect x="' + r1(cx - 14) + '" y="' + r1(cy - 14) + '" width="' + r1(cw + 28) + '" height="' + r1(ch + 14) + '" fill="#451A03"/><rect x="' + r1(cx) + '" y="' + r1(cy) + '" width="' + r1(cw) + '" height="' + r1(ch) + '" fill="url(#gm-sang)"/>');
  o.push('<rect x="' + r1(cx) + '" y="' + r1(cy) + '" width="' + r1(cw * (1 - mo * .85)) + '" height="' + r1(ch) + '" fill="#A16207" stroke="#78350F" stroke-width="4"/>');
  if (mo < .3) {
    var so = ph.den - ph.tu;
    for (var q = 0; q < so; q++) { var lk = oKhoa(cx + cw / 2, cy + ch * (q + .7) / (so + .4), (nho ? 1.5 : 1.3), ph.tu + q < k); if (ph.tu + q === k - 1 && aKhoa < 600) lk = '<g transform="translate(0 ' + r1(-Math.sin(aKhoa / 600 * Math.PI) * 10) + ')">' + lk + '</g>'; o.push(lk); }
  }
  o.push(txt(cx + cw / 2, cy - 22, 18 * F, 'PHÒNG ' + (ip + 1) + '/' + P.length, '#FDE68A', 'text-anchor="middle"'));
  // bảng mật mã bên tường
  o.push('<rect x="40" y="' + r1(tran + 24) + '" width="' + r1(nho ? 330 : 250) + '" height="' + r1(64 * F) + '" rx="10" fill="#020617" stroke="#38BDF8" stroke-width="2"/>');
  o.push(txt(56, tran + 52 * F, 16 * F, '🔐 Ổ khoá ' + Math.min(k - ph.tu + 1, ph.den - ph.tu) + '/' + (ph.den - ph.tu), '#7DD3FC'));
  o.push(txt(56, tran + 76 * F, 13 * F, 'Trả lời đúng để mở khoá', '#94A3B8', 'font-weight="700"'));
  // cả đội (solo: em + 2 bạn đồng hành)
  var ds = st.doi.length === 1 ? [{ ten: 'Em', mau: st.doi[0].mau }, { ten: 'Bạn Lan', mau: '#DB2777' }, { ten: 'Bạn Minh', mau: '#059669' }] : st.doi, kc = nho ? 120 : 105;
  ds.forEach(function (d, j) {
    var di = mo ? ease((aMo - 300) / 1300) : 0, x = 150 + j * kc + di * (cx + cw / 2 - 150 - j * kc), lac = Math.sin(t / 130 + j) * (di > 0 && di < 1 ? 4 : 0);
    o.push('<g opacity="' + r1(1 - Math.max(0, di - .7) / .3) + '">' + hs(x, san + 8 + lac, d.mau, 1.35 * (nho ? 1.2 : 1)) + txt(x, san + 34 * F, 13 * F, esc(d.ten), '#E2E8F0', 'text-anchor="middle"') + '</g>');
  });
  // còi báo động
  var hu = nguy || aBao < 900;
  o.push('<circle cx="950" cy="' + r1(tran + 30) + '" r="16" fill="' + (hu ? '#EF4444' : '#7F1D1D') + '" stroke="#1E293B" stroke-width="3"/>');
  if (hu) o.push('<rect width="1000" height="' + H + '" fill="#DC2626" opacity="' + r1((aBao < 900 ? .3 * (1 - aBao / 900) : 0) + (nguy ? .12 * (.5 + .5 * Math.sin(t / 160)) : 0)) + '"/>');
  if (aBao < 1200) o.push(txt(500, san * .55, 34 * F, '🚨 Sai mật mã!', '#FECACA', 'text-anchor="middle" stroke="#450A0A" stroke-width="5" paint-order="stroke"'));
  if (mo > 0) o.push(txt(cx + cw / 2 - 160, san * .5, 34 * F, ip === P.length - 1 ? '🚪 Ra lối thoát!' : '🔓 Cửa mở!', '#4ADE80', 'text-anchor="middle" stroke="#052E16" stroke-width="5" paint-order="stroke"'));
  return { svg: o.join(''), H: H };
}

// ============================================================ ÂM THANH RIÊNG (nổ, chém, mở cửa, còi)
var AC = null, NOISE = null;
function ac() { try { if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); var b = AC.createBuffer(1, AC.sampleRate, AC.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; NOISE = b; } if (AC.state === 'suspended') AC.resume(); } catch (e) { return null; } return AC; }
function on(t0, len, f, f2, vol, kieu) { var c = ac(); if (!c) return; var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0; o.type = kieu || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + len); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + len + .02); }
function ou(t0, len, f, f2, vol, loai) { var c = ac(); if (!c) return; var n = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + t0; n.buffer = NOISE; fl.type = loai || 'lowpass'; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + len); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + len); n.connect(fl); fl.connect(g); g.connect(c.destination); n.start(t); n.stop(t + len + .05); }
var AM = {
  mo: function () { ac(); },
  bum: function () { ou(0, 1.2, 1800, 60, .9); on(0, .8, 120, 30, .7); },
  goBom: function () { on(0, .06, 2400, null, .25, 'square'); on(.12, .06, 2400, null, .25, 'square'); on(.3, .4, 660, 1320, .25, 'triangle'); },
  tichTac: function () { on(0, .05, 1500, null, .12, 'square'); },
  chem: function () { ou(0, .25, 600, 5000, .5, 'bandpass'); on(.05, .15, 300, 90, .4, 'sawtooth'); },
  trung: function () { on(0, .3, 160, 60, .5, 'square'); ou(0, .2, 800, 200, .3); },
  ha: function () { [392, 523, 659, 784].forEach(function (f, i) { on(i * .1, .3, f, null, .25, 'triangle'); }); },
  cua: function () { ou(0, .9, 300, 1200, .25, 'bandpass'); on(.5, .5, 523, null, .2, 'triangle'); on(.65, .6, 784, null, .2, 'triangle'); },
  khoa: function () { on(0, .05, 1800, null, .3, 'square'); on(.08, .12, 900, null, .25, 'square'); },
  coi: function () { on(0, .45, 700, 1100, .2, 'sawtooth'); on(.45, .45, 1100, 700, .2, 'sawtooth'); },
  mam: function () { on(0, .12, 523, 784, .25, 'triangle'); on(.12, .2, 784, 1047, .25, 'triangle'); },
  sau: function () { on(0, .25, 300, 200, .2, 'sawtooth'); }
};

var VE = { bom: bom, farm: farm, rpg: rpg, thoat: thoat };
window.GameMoi = {
  DS: ['bom', 'farm', 'rpg', 'thoat'], TEN: TEN, DOI: DOI, am: AM, chiaAi: chiaAi, chiaPhong: chiaPhong,
  co: function (g) { return !!VE[g]; },
  html: function (g, st, nhan) {
    st.t = st.t || Date.now();
    var r = VE[g](st);
    return '<svg viewBox="0 0 ' + W + ' ' + r1(r.H) + '" role="img" aria-label="' + esc(nhan || TEN[g]) + '" style="font-family:\'Be Vietnam Pro\',Arial,sans-serif">' + r.svg + '</svg>';
  }
};
})();
