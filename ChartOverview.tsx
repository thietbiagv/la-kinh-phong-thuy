import React from 'react';
import { ChartAnalysis } from '../types/fengshui';
import { getAuspiciousStarsForPeriod } from '../utils/fengshuiConstants';
import { ShieldCheck, ShieldAlert, AlertTriangle, Compass, CheckCircle2, Award, Flame } from 'lucide-react';

interface ChartOverviewProps {
  analysis: ChartAnalysis;
}

export const ChartOverview: React.FC<ChartOverviewProps> = ({ analysis }) => {
  const { formation, isKiemHuong, deviationFromCenter, isKhongVong, khongVongType } = analysis;
  const { chinhKhi, sinhKhi, tienKhi } = getAuspiciousStarsForPeriod(analysis.period);

  return (
    <div className="w-full bg-stone-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4">
      {/* Header & Formation Rating */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-zinc-100">
              Tổng Quan Cách Cục Tinh Bàn
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Phân tích theo trường phái Huyền Không Phi Tinh (Thẩm Thị) · Vận {analysis.period}
          </p>
        </div>

        {/* Formation Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow ${formation.badgeColor}`}>
            {formation.title}
          </span>
        </div>
      </div>

      {/* Formation Rating & Narrative */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Đánh Giá: {formation.rating}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-stone-900/50 p-3.5 rounded-xl border border-zinc-800/80">
          {formation.description}
        </p>
      </div>

      {/* Card Nguyên Lý Tam Cát Tinh Cửu Vận (Chính - Sinh - Tiến) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 via-emerald-950/20 to-cyan-950/20 border border-amber-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            Nguyên Lý Tam Cát Tinh Cửu Vận (Chính Khí · Sinh Khí · Tiến Khí)
          </h4>
          <span className="text-[10px] font-mono text-zinc-400">Vận {analysis.period}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-stone-900/80 p-2 rounded-lg border border-amber-500/30">
            <div className="text-[10px] text-zinc-400 font-medium">CHÍNH KHÍ (ĐƯƠNG VƯỢNG)</div>
            <div className="text-base font-black text-amber-400 mt-0.5">Sao {chinhKhi}</div>
            <div className="text-[10px] text-amber-300/80">Khí tối vượng hiện tại</div>
          </div>
          <div className="bg-stone-900/80 p-2 rounded-lg border border-emerald-500/30">
            <div className="text-[10px] text-zinc-400 font-medium">SINH KHÍ (TƯƠNG LAI GẦN)</div>
            <div className="text-base font-black text-emerald-400 mt-0.5">Sao {sinhKhi}</div>
            <div className="text-[10px] text-emerald-300/80">Sinh sôi, đại cát</div>
          </div>
          <div className="bg-stone-900/80 p-2 rounded-lg border border-cyan-500/30">
            <div className="text-[10px] text-zinc-400 font-medium">TIẾN KHÍ (TƯƠNG LAI XA)</div>
            <div className="text-base font-black text-cyan-300 mt-0.5">Sao {tienKhi}</div>
            <div className="text-[10px] text-cyan-200/80">{analysis.period === 9 ? 'Nhị Hắc hóa Cát Tinh' : 'Năng lượng đang tiến'}</div>
          </div>
        </div>
        <p className="text-[11.5px] text-zinc-300 leading-relaxed pt-1">
          {analysis.period === 9 ? (
            <span>
              ⭐ <strong>Vận 9 (2024 – 2043):</strong> Bộ ba sao tốt là <strong className="text-amber-300">9 - 1 - 2</strong>. Đặc biệt sao <strong>2 (Nhị Hắc Cự Môn)</strong> bước sang Vận 9 đã trở thành <em>Tiến Khí cát tinh</em> chuẩn bị cho Vận 2, không còn là Bệnh Phù hung tinh như thời Vận 8 trở về trước. Bất kể cung vị nào có sao 9, 1 hoặc 2 đáo đến đều mang lại cát lành!
            </span>
          ) : (
            <span>
              ⭐ <strong>Quy luật tuần hoàn:</strong> Vận {analysis.period} có bộ 3 sao tốt là <strong className="text-amber-300">{chinhKhi} - {sinhKhi} - {tienKhi}</strong> (Tương tự: Vận 1 là 1,2,3; Vận 2 là 2,3,4; Vận 8 là 8,9,1...).
            </span>
          )}
        </p>
      </div>

      {/* Landscape & Environment Recommendations (Loan Đầu) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Yêu Cầu Địa Hình & Môi Trường Ngoại Cảnh (Loan Đầu)
        </h4>
        <ul className="space-y-1.5">
          {formation.recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2 bg-stone-900/30 p-2.5 rounded-lg border border-zinc-800/60"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Direction Quality: Chính Hướng vs Kiêm Hướng & Không Vong Warning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Chính Hướng / Kiêm Hướng & Chế độ Tinh Bàn */}
        <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
          analysis.chartType === 'THE_QUAI' ? 'bg-amber-950/30 border-amber-500/50' : 'bg-stone-900/60 border-zinc-800'
        }`}>
          {isKiemHuong || analysis.chartType === 'THE_QUAI' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="w-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-zinc-100">
                {analysis.chartType === 'THE_QUAI' ? '🔄 Tinh Bàn THẾ QUÁI (Kiêm Hướng)' : '✨ Tinh Bàn HẠ QUÁI (Chính Hướng)'}
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                analysis.chartType === 'THE_QUAI' ? 'bg-amber-500 text-stone-950' : 'bg-blue-600 text-white'
              }`}>
                {analysis.chartType === 'THE_QUAI' ? 'Thế Quái' : 'Hạ Quái'}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Lệch tâm sơn: <span className="font-mono text-amber-300 font-bold">{deviationFromCenter}°</span> (Sơn {analysis.facingMountain.name} rộng 15°).
              {analysis.chartType === 'THE_QUAI'
                ? ' Áp dụng Khởi Tinh Quyết mượn sao thay thế để hóa giải tạp khí âm dương do kiêm hướng.'
                : ' Độ số đắc chính khí sơn hướng, áp dụng đồ bàn Hạ Quái truyền thống.'}
            </div>

            {/* Chi tiết Thế Quái nếu đang áp dụng */}
            {analysis.theQuaiDetails && (
              <div className="mt-2.5 pt-2 border-t border-amber-500/30 text-[11px] space-y-1">
                <div className="text-amber-300 font-semibold flex items-center gap-1">
                  <span>📜 Chi tiết Khởi Tinh Quyết:</span>
                </div>
                <div className="text-zinc-300 bg-stone-950/80 p-2 rounded-lg border border-zinc-800 space-y-1 font-mono text-[10.5px]">
                  <div>• <strong>Sơn Tinh:</strong> Vận tinh {analysis.theQuaiDetails.mountainStarBase} ➔ Thế bằng sao <span className="text-rose-400 font-bold font-sans text-xs">【{analysis.theQuaiDetails.mountainStarSubstitute}】</span> ({analysis.theQuaiDetails.mountainPolarity === '+' ? 'Bay Thuận +' : 'Bay Nghịch -'})</div>
                  <div className="text-zinc-400 text-[10px] font-sans pl-2.5">↳ {analysis.theQuaiDetails.mountainFlightReason}</div>
                  <div>• <strong>Hướng Tinh:</strong> Vận tinh {analysis.theQuaiDetails.facingStarBase} ➔ Thế bằng sao <span className="text-cyan-300 font-bold font-sans text-xs">【{analysis.theQuaiDetails.facingStarSubstitute}】</span> ({analysis.theQuaiDetails.facingPolarity === '+' ? 'Bay Thuận +' : 'Bay Nghịch -'})</div>
                  <div className="text-zinc-400 text-[10px] font-sans pl-2.5">↳ {analysis.theQuaiDetails.facingFlightReason}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tuyến Không Vong Warning */}
        <div className="p-3 rounded-xl bg-stone-900/60 border border-zinc-800 flex items-start gap-2.5">
          {isKhongVong ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="text-xs font-bold text-zinc-200">
              {isKhongVong ? `Cảnh Báo: ${khongVongType}` : 'An Toàn Tuyến Vị (Không Phạm Không Vong)'}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              {isKhongVong
                ? 'Độ số nằm sát ranh giới giữa 2 sơn/quái (Không Vong). Khí trường hỗn loạn, phong thủy cổ kỵ xây nhà tại góc này.'
                : 'Độ số cách xa các vạch ranh giới phân kim, dòng khí ổn định không bị nhiễu động.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
