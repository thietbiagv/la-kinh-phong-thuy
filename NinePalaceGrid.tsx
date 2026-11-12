import React, { useState, useRef } from 'react';
import { PalaceData, ChartAnalysis, BatTrachAnalysis } from '../types/fengshui';
import { PALACE_METAS, getAuspiciousStarsForPeriod } from '../utils/fengshuiConstants';
import { Compass, Sparkles, ArrowUpDown, Info, Download, ShieldCheck, Flame } from 'lucide-react';

interface NinePalaceGridProps {
  analysis: ChartAnalysis;
  batTrachAnalysis?: BatTrachAnalysis;
  selectedPalaceNum: number;
  onSelectPalace: (palaceNum: number) => void;
}

export const NinePalaceGrid: React.FC<NinePalaceGridProps> = ({
  analysis,
  batTrachAnalysis,
  selectedPalaceNum,
  onSelectPalace,
}) => {
  const { chinhKhi, sinhKhi, tienKhi } = getAuspiciousStarsForPeriod(analysis.period);
  // 'facingUp' (Xoay theo Hướng nhà: Hướng ở trên, Tọa ở dưới)
  // 'southUp' (Cổ truyền: Nam ở trên, Bắc ở dưới)
  // 'northUp' (Bản đồ hiện đại: Bắc ở trên)
  const [orientation, setOrientation] = useState<'facingUp' | 'southUp' | 'northUp'>('facingUp');
  const [showBatTrach, setShowBatTrach] = useState<boolean>(true);

  // Clockwise circular order of 8 directional palaces:
  // Khảm(1) -> Cấn(8) -> Chấn(3) -> Tốn(4) -> Ly(9) -> Khôn(2) -> Đoài(7) -> Càn(6)
  const getFacingUpGrid = (facingPalaceNum: number) => {
    const ring = [1, 8, 3, 4, 9, 2, 7, 6];
    const idx = ring.indexOf(facingPalaceNum);
    const getP = (offset: number) => ring[(idx + offset + 8) % 8];

    // Top row: [Top-Left (-45°), Top-Center (Hướng 0°), Top-Right (+45°)]
    // Mid row: [Left (-90°), Center (5), Right (+90°)]
    // Bot row: [Bot-Left (-135°), Bot-Center (Tọa 180°), Bot-Right (+135°)]
    return [
      [getP(7), getP(0), getP(1)],
      [getP(6), 5, getP(2)],
      [getP(5), getP(4), getP(3)],
    ];
  };

  // Export 9-Palace Grid directly as high-resolution PNG for CAD/Photoshop
  const exportGridAsImage = () => {
    const canvas = document.createElement('canvas');
    const dpr = 2;
    const size = 900;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, size, size);

    // Header info
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `TINH BÀN HUYỀN KHÔNG - VẬN ${analysis.period}`,
      size / 2,
      45
    );

    ctx.fillStyle = '#a8a29e';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Tọa ${analysis.sittingMountain.name} (${analysis.sittingDegree}°) - Hướng ${analysis.facingMountain.name} (${analysis.facingDegree}°) · ${analysis.formation.title}`,
      size / 2,
      75
    );

    // Grid coordinates
    const startX = 60;
    const startY = 100;
    const cellSize = (size - 120) / 3;

    const gridLayout =
      orientation === 'facingUp'
        ? getFacingUpGrid(analysis.facingMountain.palaceNumber)
        : orientation === 'southUp'
        ? [
            [4, 9, 2],
            [3, 5, 7],
            [8, 1, 6],
          ]
        : [
            [6, 1, 8],
            [7, 5, 3],
            [2, 9, 4],
          ];

    gridLayout.forEach((row, rIdx) => {
      row.forEach((pNum, cIdx) => {
        const p = analysis.palaces[pNum];
        const x = startX + cIdx * cellSize;
        const y = startY + rIdx * cellSize;

        // Cell background
        ctx.fillStyle = p.isFacing ? '#261214' : p.isSitting ? '#101e30' : '#1c1917';
        ctx.fillRect(x, y, cellSize, cellSize);

        // Cell border
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);

        // Mountain star (Top Left - Red)
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${p.mountainStar}${p.mountainPolarity}`, x + 20, y + 50);

        // Facing star (Top Right - Blue)
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${p.facingStar}${p.facingPolarity}`, x + cellSize - 20, y + 50);

        // Tag (Tọa / Hướng)
        if (p.isFacing) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('HƯỚNG (MẶT TIỀN)', x + cellSize / 2, y + 35);
        } else if (p.isSitting) {
          ctx.fillStyle = '#3b82f6';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('TỌA (HẬU CUNG)', x + cellSize / 2, y + 35);
        }

        // Center: Direction Name & Trigram
        ctx.fillStyle = '#fafaf9';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.shortName, x + cellSize / 2, y + cellSize / 2 + 5);

        ctx.fillStyle = '#a8a29e';
        ctx.font = '14px sans-serif';
        ctx.fillText(`${p.trigram} (${p.element})`, x + cellSize / 2, y + cellSize / 2 + 30);

        // Bottom Center: Period star
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Vận ${p.periodStar}`, x + cellSize / 2, y + cellSize - 20);
      });
    });

    // Watermark
    ctx.fillStyle = '#78716c';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Huyền Không Phi Tinh · Thẩm Thị Học Tinh Bàn', size / 2, size - 20);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `TinhBan_CuuCung_Van${analysis.period}_${analysis.facingMountain.name}_${analysis.facingDegree}do.png`;
    a.click();
  };

  // 3x3 Grid Palace layout according to orientation:
  const gridSouthUp = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];

  const gridNorthUp = [
    [6, 1, 8],
    [7, 5, 3],
    [2, 9, 4],
  ];

  const currentGrid =
    orientation === 'facingUp'
      ? getFacingUpGrid(analysis.facingMountain.palaceNumber)
      : orientation === 'southUp'
      ? gridSouthUp
      : gridNorthUp;

  // Auspiciousness visual helper
  const getBadgeStyle = (auspiciousness: string) => {
    switch (auspiciousness) {
      case 'Đại Cát':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'Cát':
        return 'text-teal-300 bg-teal-950/50 border-teal-500/30';
      case 'Hung':
        return 'text-amber-400 bg-amber-950/50 border-amber-500/30';
      case 'Đại Hung':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
      default:
        return 'text-zinc-300 bg-zinc-800/50 border-zinc-700/30';
    }
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Hỏa':
        return 'text-red-400 border-red-500/40 bg-red-950/20';
      case 'Thủy':
        return 'text-blue-400 border-blue-500/40 bg-blue-950/20';
      case 'Mộc':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
      case 'Kim':
        return 'text-amber-300 border-amber-500/40 bg-amber-950/20';
      case 'Thổ':
        return 'text-yellow-600 border-yellow-700/40 bg-yellow-950/20';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-900';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Grid Controls Header */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            Tinh Bàn Cửu Cung
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
            analysis.chartType === 'THE_QUAI'
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
              : 'bg-blue-950/80 text-blue-300 border-blue-500/50'
          }`}>
            {analysis.chartType === 'THE_QUAI' ? '🔄 Thế Quái (Kiêm Hướng)' : '✨ Hạ Quái (Chính Hướng)'}
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Vận {analysis.period} · Tọa {analysis.sittingMountain.name} ({analysis.sittingDegree}°) - Hướng {analysis.facingMountain.name} ({analysis.facingDegree}°)
          </span>
        </div>

        {/* Orientation 3-way Toggle & Export Button */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-zinc-800/90 p-0.5 rounded-lg border border-zinc-700/70 text-xs">
            <button
              onClick={() => setOrientation('facingUp')}
              className={`px-2 py-1 rounded transition-colors ${
                orientation === 'facingUp'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Xoay theo Hướng nhà: Cung Hướng ở trên (Mặt tiền), Cung Tọa ở dưới"
            >
              Hướng nhà trên
            </button>
            <button
              onClick={() => setOrientation('southUp')}
              className={`px-2 py-1 rounded transition-colors ${
                orientation === 'southUp'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Cổ truyền Lạc Thư: Nam ở trên, Bắc ở dưới"
            >
              Nam trên
            </button>
            <button
              onClick={() => setOrientation('northUp')}
              className={`px-2 py-1 rounded transition-colors ${
                orientation === 'northUp'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Bản đồ hiện đại: Bắc ở trên, Nam ở dưới"
            >
              Bắc trên
            </button>
          </div>

          {batTrachAnalysis && (
            <button
              onClick={() => setShowBatTrach(!showBatTrach)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                showBatTrach
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
              title="Hiện sao Bát Trạch (Sinh Khí, Diên Niên, Tuyệt Mệnh...)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bát Trạch: {showBatTrach ? 'BẬT' : 'TẮT'}</span>
            </button>
          )}

          <button
            onClick={exportGridAsImage}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/30 transition-colors"
            title="Xuất tinh bàn Cửu Cung thành ảnh PNG chèn CAD/Photoshop"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Lưu Tinh Bàn</span>
          </button>
        </div>
      </div>

      {/* Banner Nguyên Lý Tam Cát Tinh Vận */}
      <div className="w-full mb-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-stone-900 via-amber-950/25 to-stone-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-zinc-200">
            <strong className="text-amber-300">Tam Cát Tinh Vận {analysis.period}:</strong>{' '}
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">Sao {chinhKhi} (Chính Khí)</span>{' '}
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">Sao {sinhKhi} (Sinh Khí)</span>{' '}
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">Sao {tienKhi} (Tiến Khí)</span>
          </span>
        </div>
        <span className="text-[11px] text-zinc-400">
          {analysis.period === 9 ? 'Vận 9: Cát tinh gồm 9, 1, 2 (Sao 2 Nhị Hắc là Tiến Khí Cát)' : 'Ba sao đắc khí tối thượng'}
        </span>
      </div>

      {/* 3x3 Flying Star Matrix */}
      <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 bg-stone-950 p-3 sm:p-4 rounded-2xl border border-zinc-800 shadow-xl">
        {currentGrid.flat().map((pNum) => {
          const palace = analysis.palaces[pNum];
          const isSelected = selectedPalaceNum === pNum;
          const isSitting = palace.isSitting;
          const isFacing = palace.isFacing;
          const isCenter = palace.isCenter;

          const mTag = palace.mountainStar === chinhKhi
            ? { text: 'Chính', color: 'bg-amber-500 text-stone-950 font-black' }
            : palace.mountainStar === sinhKhi
            ? { text: 'Sinh', color: 'bg-emerald-500 text-white font-bold' }
            : palace.mountainStar === tienKhi
            ? { text: 'Tiến', color: 'bg-cyan-500 text-stone-950 font-bold' }
            : null;

          const fTag = palace.facingStar === chinhKhi
            ? { text: 'Chính', color: 'bg-amber-500 text-stone-950 font-black' }
            : palace.facingStar === sinhKhi
            ? { text: 'Sinh', color: 'bg-emerald-500 text-white font-bold' }
            : palace.facingStar === tienKhi
            ? { text: 'Tiến', color: 'bg-cyan-500 text-stone-950 font-bold' }
            : null;

          const btPalace = batTrachAnalysis?.palaces[pNum];
          const btStar = btPalace?.ownerStar || btPalace?.houseStar;

          return (
            <div
              key={pNum}
              onClick={() => onSelectPalace(pNum)}
              className={`relative flex flex-col justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all duration-200 select-none min-h-[120px] sm:min-h-[135px] border ${
                isSelected
                  ? 'border-amber-400/90 ring-2 ring-amber-400/30 bg-stone-900/95 shadow-lg'
                  : 'border-zinc-800/90 bg-stone-900/60 hover:bg-stone-900 hover:border-zinc-700'
              } ${isSitting ? 'bg-gradient-to-br from-blue-950/25 to-stone-900/60' : ''} ${
                isFacing ? 'bg-gradient-to-br from-rose-950/25 to-stone-900/60' : ''
              }`}
            >
              {/* Top Row: Mountain Star (Left) & Facing Star (Right) */}
              <div className="flex items-start justify-between w-full">
                {/* Mountain Star (Sao Tọa) */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-tighter">Sơn</span>
                    {mTag && (
                      <span className={`text-[8px] px-1 py-0 rounded ${mTag.color}`}>
                        {mTag.text}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-xl sm:text-2xl font-black text-rose-400 drop-shadow">
                      {palace.mountainStar}
                    </span>
                    <span className="text-[10px] font-bold text-rose-500/80 -mt-2">
                      {palace.mountainPolarity}
                    </span>
                  </div>
                </div>

                {/* Palace Tag (Tọa / Hướng / Trung) */}
                <div className="flex flex-col items-center">
                  {isFacing && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      HƯỚNG
                    </span>
                  )}
                  {isSitting && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      TỌA
                    </span>
                  )}
                  {isCenter && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      TRUNG
                    </span>
                  )}
                  <span className="text-sm font-semibold text-zinc-400 mt-0.5">
                    {palace.trigramSymbol}
                  </span>
                </div>

                {/* Facing Star (Sao Hướng) */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    {fTag && (
                      <span className={`text-[8px] px-1 py-0 rounded ${fTag.color}`}>
                        {fTag.text}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-tighter">Hướng</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-xl sm:text-2xl font-black text-sky-400 drop-shadow">
                      {palace.facingStar}
                    </span>
                    <span className="text-[10px] font-bold text-sky-500/80 -mt-2">
                      {palace.facingPolarity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Details: Palace Name & Trigram */}
              <div className="flex flex-col items-center my-0.5">
                <span className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-1">
                  {palace.shortName}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {palace.trigram} · {palace.element}
                </span>

                {/* Bát Trạch Badge */}
                {showBatTrach && btStar && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 shadow-sm ${
                      btStar.isGood
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {btStar.name}
                  </span>
                )}
              </div>

              {/* Bottom Row: Period Star (Vận Tinh) & Rating Pill */}
              <div className="flex items-center justify-between w-full pt-1 border-t border-zinc-800/60 mt-0.5">
                {/* Rating Badge */}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${getBadgeStyle(
                    palace.auspiciousness
                  )}`}
                >
                  {palace.auspiciousness}
                </span>

                {/* Period Star (Center Bottom) */}
                <div className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700/50">
                  <span className="text-[9px] text-zinc-400">Vận</span>
                  <span className="text-xs font-bold text-amber-300">{palace.periodStar}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Legend & Instructions */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-3 px-2 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <strong className="text-rose-400">Sơn tinh:</strong> Nhân đinh, sức khỏe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <strong className="text-sky-400">Hướng tinh:</strong> Tài lộc, sự nghiệp
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <strong className="text-amber-400">Vận tinh:</strong> Thời vận chủ quản
          </span>
        </div>

        <div className="text-[11px] text-zinc-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-zinc-400" />
          Nhấp vào ô bất kỳ để xem luận giải chi tiết & kích hoạt hóa giải
        </div>
      </div>
    </div>
  );
};
