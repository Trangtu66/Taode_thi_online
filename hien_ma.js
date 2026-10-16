/* Nút "con mắt" hiện / ẩn kí tự cho ô nhập mã giáo viên (giống cửa sổ đăng nhập ở trang chủ).
   Dùng: <input type="password" data-hien-ma> rồi nạp file này. Biểu tượng trích từ Lucide 0.468.0 (giấy phép ISC). */
(function(){
  var SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var MAT = SVG + '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
  var NHAM = SVG + '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';
  function gan(inp){
    if(inp.dataset.hienMaXong) return;
    inp.dataset.hienMaXong = "1";
    // Ô chiếm hết dòng (vd. .field input{width:100%}) thì lớp bọc cũng rộng hết dòng; ô trong hàng flex giữ cỡ riêng
    var cha = inp.parentNode, rongHet = cha.clientWidth > 0 && inp.offsetWidth >= cha.clientWidth - 4;
    var boc = document.createElement("span");
    boc.style.cssText = "position:relative;display:inline-block;max-width:100%;vertical-align:middle;" + (rongHet ? "width:100%;" : "");
    cha.insertBefore(boc, inp);
    boc.appendChild(inp);
    inp.style.paddingRight = "40px";
    if(rongHet) inp.style.width = "100%";
    var b = document.createElement("button");
    b.type = "button";
    b.style.cssText = "position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none;cursor:pointer;color:#64748B;padding:4px;line-height:0;box-shadow:none;";
    function ve(){
      var dangAn = inp.type === "password";
      b.innerHTML = dangAn ? MAT : NHAM;
      b.setAttribute("aria-label", dangAn ? "Hiện mã đã nhập" : "Ẩn mã đã nhập");
      b.title = b.getAttribute("aria-label");
    }
    b.addEventListener("click", function(){ inp.type = inp.type === "password" ? "text" : "password"; ve(); inp.focus(); });
    ve();
    boc.appendChild(b);
  }
  function chay(){ Array.prototype.forEach.call(document.querySelectorAll("input[data-hien-ma]"), gan); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", chay); else chay();
})();
