# -*- coding: utf-8 -*-
"""Tạo các câu giọng nói tiếng Việt cho trò chơi (giong_noi.js) – giọng vi-VN-HoaiMyNeural (edge-tts).
Chạy lại khi thêm/sửa câu: python am_thanh/giong/tao_giong.py   (cần mạng; chỉ tạo file còn thiếu, thêm --lai để tạo lại hết)
Mỗi câu một file <mã>.mp3 trong thư mục này; mã câu dùng trong GiongNoi.noi('<mã>')."""
import asyncio, os, sys
import edge_tts

GIONG = 'vi-VN-HoaiMyNeural'
CAU = {
    # ---- chung (HS tự chơi)
    'dung1': 'Chính xác! Giỏi lắm!',
    'dung': 'Đúng rồi!',
    'sai': 'Chưa đúng rồi. Em suy nghĩ lại nhé!',
    'sai_tln': 'Sai ba lần rồi. Em chọn một trong bốn đáp số nhé.',
    'thang': 'Chúc mừng em! Em đã chiến thắng!',
    'xong': 'Em đã hoàn thành. Cố gắng hơn ở lần sau nhé!',
    # ---- từng trò
    'bell_dung': 'Chính xác! Em leo thêm một bậc.',
    'tug_dung1': 'Kéo mạnh lên!',
    'tug_sai': 'Ôi, máy kéo lại rồi!',
    'race_dung1': 'Chính xác! Tăng tốc nào!',
    'race_sai': 'Ối, xe trượt bánh rồi!',
    'nhip_het': 'Hết giờ nhịp rồi! Em vẫn phải trả lời đúng câu này.',
    'bom_go': 'Gỡ bom thành công!',
    'bom_no': 'Bùm! Bom đã nổ rồi. Em vẫn phải trả lời đúng câu này nhé.',
    'bom_tre': 'Đúng rồi, nhưng quả bom này đã nổ.',
    'farm_dung1': 'Tuyệt vời! Cây đã ra trái.',
    'farm_sai': 'Ôi! Sâu bò vào luống rồi. Em trả lời lại nhé!',
    'rpg_chimang': 'Đòn chí mạng!',
    'rpg_danh': 'Trúng đòn!',
    'rpg_ha': 'Hạ gục quái vật!',
    'rpg_trum': 'Hạ gục trùm Rồng lửa! Chiến thắng!',
    'rpg_trung': 'Quái vật đánh trả! Mất một trái tim.',
    'rpg_guc': 'Gục ngã rồi! Hồi sinh và chiến đấu tiếp nào!',
    'rpg_tron': 'Quái vật đã bỏ chạy!',
    'thoat_khoa': 'Mở được một ổ khoá!',
    'thoat_mo': 'Cửa đã mở! Cả đội sang phòng tiếp theo.',
    'thoat_ra': 'Cửa cuối đã mở! Ra lối thoát thôi!',
    'thoat_sai': 'Sai mật mã! Còi báo động!',
    'thoat_quagio': 'Hết thời gian thoát hiểm rồi! Nhanh lên nào!',
    # ---- trang cả lớp (GV trình chiếu)
    'da_A': 'Đáp án đúng là a.',
    'da_B': 'Đáp án đúng là bê.',
    'da_C': 'Đáp án đúng là xê.',
    'da_D': 'Đáp án đúng là đê.',
    'da_xem': 'Mời cả lớp xem đáp án đúng.',
    'lop_dung_het': 'Tất cả các đội đều trả lời đúng! Tuyệt vời!',
    'lop_sai_het': 'Chưa đội nào trả lời đúng câu này.',
    'lop_bom_go': 'Các đội trả lời đúng đã gỡ được bom!',
    'lop_farm_dung': 'Các đội trả lời đúng, cây đã ra trái!',
    'lop_ket': 'Trò chơi kết thúc! Chúc mừng đội chiến thắng!',
    'lop_thang': 'Cả lớp đã chiến thắng! Chúc mừng!',
}

async def tao(ma, chu, lai):
    tep = os.path.join(os.path.dirname(os.path.abspath(__file__)), ma + '.mp3')
    if os.path.exists(tep) and os.path.getsize(tep) > 1000 and not lai:
        return False
    for k in range(12):   # dịch vụ đôi khi trả rỗng/treo (như skill video-bai-giang): giới hạn 40 giây/lần, thử lại, chờ tăng dần
        try:
            await asyncio.wait_for(edge_tts.Communicate(chu, GIONG, rate='+5%').save(tep), 40)
            if os.path.getsize(tep) > 1000:
                return True
        except Exception:
            pass
        await asyncio.sleep(3 + 2 * k)
    if os.path.exists(tep):
        os.remove(tep)
    raise RuntimeError('Không tạo được giọng đọc: ' + chu)

async def main():
    lai = '--lai' in sys.argv
    moi = 0
    for ma, chu in CAU.items():
        if await tao(ma, chu, lai):
            moi += 1
            print('tạo', ma, '–', chu)
    print('Xong:', moi, 'file mới /', len(CAU), 'câu')

asyncio.run(main())
