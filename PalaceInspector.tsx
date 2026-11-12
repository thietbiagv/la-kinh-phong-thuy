import React from 'react';
import { PalaceData, ChartAnalysis } from '../types/fengshui';
import {
  STAR_NAMES,
  getCombinationAnalysis,
  getStarPeriodStatus,
  getAuspiciousStarsForPeriod,
} from '../utils/fengshuiConstants';
import {
  Sparkles,
  ShieldAlert,
  Home,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface PalaceInspectorProps {
  palace: PalaceData;
  analysis: ChartAnalysis;
}

export const PalaceInspector: React.FC<PalaceInspectorProps> = ({ palace, analysis }) => {
  const mStarMeta = STAR_NAMES[palace.mountainStar];
  const fStarMeta = STAR_NAMES[palace.facingStar];
  const pStarMeta = STAR_NAMES[palace.periodStar];

  const mStarStatus = getStarPeriodStatus(palace.mountainStar, analysis.period);
  const fStarStatus = getStarPeriodStatus(palace.facingStar, analysis.period);
  const pStarStatus = getStarPeriodStatus(palace.periodStar, analysis.period);
  const { chinhKhi, sinhKhi, tienKhi } = getAuspiciousStarsForPeriod(analysis.period);

  const combination = getCombinationAnalysis(
    palace.mountainStar,
    palace.facingStar,
    palace.periodStar,
    analysis.period
  );

  const isAuspicious =
    combination.auspiciousness === 'Đại Cát' || combination.auspiciousness === 'Cát';
  const isHung =
    combination.auspiciousness === 'Hung' || combination.auspiciousness === 'Đại Hung';

  return (
    <div className="w-full bg-stone-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-5">
      {/* Header with Title and Rating */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-300">
              {palace.name}
            </span>
            <span className="text-sm font-semibold text-zinc-400">
              ({palace.trigram} {palace.trigramSymbol} · Hành {palace.element})
            </span>
            {palace.isFacing && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                CUNG HƯỚNG
              </span>
            )}
            {palace.isSitting && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                CUNG TỌA
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Bản cung Lạc Thư: Sao số {palace.originalStar} · Vận tinh đương thời: {palace.periodStar} ({pStarMeta.name})
          </p>
        </div>

        {/* Auspiciousness Stamp */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg text-sm font-bold border flex items-center gap-1.5 ${
              isAuspicious
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : isHung
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
          >
            {isAuspicious ? (
              <Sparkles className="w-4 h-4 text-emerald-400" />
            ) : isHung ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : null}
            {combination.auspiciousness}
          </span>
        </div>
      </div>

      {/* Star Pair Quick Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Mountain Star */}
        <div className="p-3 rounded-xl bg-stone-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] text-zinc-400 font-medium">SƠN TINH (SAO TỌA)</span>
              <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold ${mStarStatus.badgeClass}`}>
                {mStarStatus.typeName}
              </span>
            </div>
            <div className="text-base font-bold text-rose-400">
              {palace.mountainStar} · {mStarMeta.name}
            </div>
            <div className="text-[11px] text-zinc-400">
              Hành {mStarMeta.element} ({palace.mountainPolarity === '+' ? 'Phi Thuận +' : 'Phi Nghịch -'})
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-xl font-black text-rose-400">
            {palace.mountainStar}
          </div>
        </div>

        {/* Facing Star */}
        <div className="p-3 rounded-xl bg-stone-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] text-zinc-400 font-medium">HƯỚNG TINH (SAO HƯỚNG)</span>
              <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold ${fStarStatus.badgeClass}`}>
                {fStarStatus.typeName}
              </span>
            </div>
            <div className="text-base font-bold text-sky-400">
              {palace.facingStar} · {fStarMeta.name}
            </div>
            <div className="text-[11px] text-zinc-400">
              Hành {fStarMeta.element} ({palace.facingPolarity === '+' ? 'Phi Thuận +' : 'Phi Nghịch -'})
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-xl font-black text-sky-400">
            {palace.facingStar}
          </div>
        </div>

        {/* Period Star */}
        <div className="p-3 rounded-xl bg-stone-900/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] text-zinc-400 font-medium">VẬN TINH (SAO VẬN)</span>
              <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold ${pStarStatus.badgeClass}`}>
                {pStarStatus.typeName}
              </span>
            </div>
            <div className="text-base font-bold text-amber-300">
              {palace.periodStar} · {pStarMeta.name}
            </div>
            <div className="text-[11px] text-zinc-400">Hành {pStarMeta.element} (Vận {analysis.period})</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-xl font-black text-amber-300">
            {palace.periodStar}
          </div>
        </div>
      </div>

      {/* Banner Nguyên Lý Tam Cát Tinh Vận */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-emerald-950/20 to-cyan-950/30 border border-amber-500/30 flex items-start gap-2.5">
        <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-amber-300">Bộ Tam Cát Tinh Vận {analysis.period}:</strong>{' '}
          <span className="text-amber-200 font-bold">Sao {chinhKhi}</span> (Chính Khí / Đương Vượng) ·{' '}
          <span className="text-emerald-300 font-bold">Sao {sinhKhi}</span> (Sinh Khí) ·{' '}
          <span className="text-cyan-300 font-bold">Sao {tienKhi}</span> (Tiến Khí).{' '}
          {analysis.period === 9 ? (
            <span className="text-zinc-300">
              Trong Vận 9, ba sao tốt là <strong className="text-amber-300">9 - 1 - 2</strong>. Đặc biệt sao <strong>2 (Nhị Hắc)</strong> đã chuyển thành Tiến Khí cát tinh (năng lượng tương lai), không còn là Bệnh Phù hung tinh như Vận 8 trở về trước!
            </span>
          ) : (
            <span className="text-zinc-400">
              Tương tự: Vận 1 là 1,2,3; Vận 2 là 2,3,4; Vận 8 là 8,9,1... Cung nào đón nhận 3 sao này đều cát lợi.
            </span>
          )}
        </div>
      </div>

      {/* Classical Quote / Ancient Xuan Kong Secret */}
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5">
        <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 block mb-0.5 font-semibold">
            Trích phú cổ truyền ({combination.title}):
          </strong>
          <span className="italic font-sans font-medium text-amber-200/95">"{combination.textClassic}"</span>
        </div>
      </div>

      {/* Detailed Modern Analysis */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Luận Giải Chi Tiết Cung Vị Trong Vận {analysis.period}
        </h4>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-stone-900/50 p-3.5 rounded-xl border border-zinc-800/80">
          {combination.modernAnalysis}
        </p>
      </div>

      {/* Room Suitability & Spatial Recommendations */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Home className="w-4 h-4 text-teal-400" />
          Bố Trí Không Gian Khuyên Dùng
        </h4>
        <div className="p-3.5 rounded-xl bg-stone-900/50 border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>{combination.suggestedUsage}</span>
        </div>
      </div>

      {/* Remedy and Activation */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Phương Pháp Kích Hoạt Cát Khí & Hóa Giải Sát Khí
        </h4>
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-amber-100/90 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{combination.remedy}</span>
        </div>
      </div>
    </div>
  );
};
