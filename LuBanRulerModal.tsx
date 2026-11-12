import React, { useState } from 'react';
import { calculateLuBan } from '../utils/luopanRulersData';
import { Ruler, X, CheckCircle, AlertTriangle, Sliders, Plus, Minus, Info, ChevronDown, ChevronUp } from 'lucide-react';

export interface LuBanRulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Danh mục kích thước phong thủy thông dụng tính bằng milimet (mm)
export const LUBAN_PRESETS = [
  { label: '810 mm', title: 'Cửa 1 cánh chuẩn', val: 810, desc: 'Cửa chính, thông phòng lọt lòng' },
  { label: '880 mm', title: 'Cửa phòng rộng', val: 880, desc: 'Tiến Bảo · Hưng Vượng' },
  { label: '1070 mm', title: 'Cửa phòng lớn', val: 1070, desc: 'Đại Cát · Thêm Đinh' },
  { label: '1250 mm', title: 'Cửa 2 cánh', val: 1250, desc: 'Thiên Tài · Hưng Vượng' },
  { label: '1530 mm', title: 'Cửa 2 cánh lớn', val: 1530, desc: 'Lục Hợp · Nghinh Phúc' },
  { label: '2140 mm', title: 'Chiều cao cửa', val: 2140, desc: 'Tể Tướng · Tiến Bảo' },
  { label: '2350 mm', title: 'Cửa chính cao', val: 2350, desc: 'Đại Cát · Nghênh Phúc' },
  { label: '2750 mm', title: 'Cửa 4 cánh lớn', val: 2750, desc: 'Tấn Ích · Tài Đức' },
  { label: '680 mm', title: 'Bàn thờ nhỏ', val: 680, desc: 'Thêm Đinh · Hưng Thịnh' },
  { label: '1070 mm', title: 'Bàn thờ trung', val: 1070, desc: 'Thêm Đinh · Đại Cát' },
  { label: '1270 mm', title: 'Bàn thờ chuẩn', val: 1270, desc: 'Tiến Bảo · Đăng Khoa' },
  { label: '1750 mm', title: 'Bàn thờ lớn', val: 1750, desc: 'Thiên Đức · Phúc Tinh' },
];

interface LuBanRulerViewProps {
  onClose?: () => void;
  isStandalone?: boolean;
}

export const LuBanRulerView: React.FC<LuBanRulerViewProps> = ({ onClose, isStandalone = false }) => {
  // Chuẩn thợ mộc & kiến trúc sư: Đơn vị mặc định là mm (milimet)
  const [mmValue, setMmValue] = useState<number>(810); // 810 mm: Cửa chính thông thủy chuẩn đại cát
  const [unitMode, setUnitMode] = useState<'mm' | 'cm'>('mm');
  const [inputStr, setInputStr] = useState<string>('810');
  const [isPresetsExpanded, setIsPresetsExpanded] = useState<boolean>(false);

  const result = calculateLuBan(mmValue, 'mm');

  // Cập nhật giá trị mm và đồng bộ chuỗi inputStr
  const updateMm = (newMm: number) => {
    const safeMm = Math.max(1, Math.min(10000, Math.round(newMm)));
    setMmValue(safeMm);
    setInputStr(unitMode === 'cm' ? (safeMm / 10).toString() : safeMm.toString());
  };

  const handleAdjust = (delta: number) => {
    updateMm(mmValue + delta);
  };

  const handleToggleUnit = (newUnit: 'mm' | 'cm') => {
    setUnitMode(newUnit);
    if (newUnit === 'cm') {
      setInputStr((mmValue / 10).toString());
    } else {
      setInputStr(mmValue.toString());
    }
  };

  const handleInputChange = (rawVal: string) => {
    // Cho phép người dùng xóa trống hoàn toàn để nhập số mới mà không bị ép về số 10
    setInputStr(rawVal);
    if (rawVal.trim() === '') {
      return;
    }
    const val = parseFloat(rawVal);
    if (!isNaN(val) && val > 0) {
      const calculatedMm = unitMode === 'cm' ? Math.round(val * 10) : Math.round(val);
      setMmValue(Math.max(1, Math.min(10000, calculatedMm)));
    }
  };

  const handleInputBlur = () => {
    // Khi rời ô nhập, nếu để trống hoặc không hợp lệ thì khôi phục số hợp lệ hiện tại
    if (inputStr.trim() === '' || isNaN(parseFloat(inputStr)) || parseFloat(inputStr) <= 0) {
      const fallback = mmValue > 0 ? mmValue : 810;
      setMmValue(fallback);
      setInputStr(unitMode === 'cm' ? (fallback / 10).toString() : fallback.toString());
    } else {
      setInputStr(unitMode === 'cm' ? (mmValue / 10).toString() : mmValue.toString());
    }
  };

  // Helper calculating position percentage within current cycle for tape rendering
  const getCycleProgress = (valueMm: number, cycleMm: number) => {
    const progress = (valueMm % cycleMm) / cycleMm;
    return Math.max(0, Math.min(100, progress * 100));
  };

  return (
    <div className={`w-full bg-stone-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isStandalone ? 'max-w-4xl mx-auto' : 'max-w-2xl max-h-[94vh]'}`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-stone-950/75 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-rose-500/20 shrink-0">
            <Ruler className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Thước Lỗ Ban Phong Thủy 3 Trong 1
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Chuẩn mm
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Bộ 3 thước Lỗ Ban: Thông Thủy 522mm · Dương Trạch 429mm · Âm Phần 388mm
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Measurement Input Section in mm */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-stone-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Kích thước cần đo:</span>
            </label>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Quy đổi: <span className="font-mono text-amber-300 font-semibold">{mmValue} mm</span> = <span className="font-mono text-zinc-300 font-semibold">{(mmValue / 10).toFixed(1)} cm</span> = <span className="font-mono text-zinc-400">{(mmValue / 1000).toFixed(3)} m</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit Toggle */}
            <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => handleToggleUnit('mm')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  unitMode === 'mm'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                mm
              </button>
              <button
                type="button"
                onClick={() => handleToggleUnit('cm')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  unitMode === 'cm'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                cm
              </button>
            </div>

            {/* Number Input with clean attached badge */}
            <div className="flex items-stretch rounded-lg border border-amber-500/60 bg-stone-950 shadow-inner focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/30 overflow-hidden">
              <input
                type="text"
                inputMode="decimal"
                value={inputStr}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputBlur}
                placeholder={unitMode === 'mm' ? '810' : '81.0'}
                className="w-24 sm:w-28 bg-transparent px-3 py-1.5 text-right font-mono text-xl font-black text-amber-300 focus:outline-none placeholder:text-zinc-600"
              />
              <div className="flex items-center justify-center px-2.5 bg-stone-800 border-l border-zinc-700/80 text-amber-400 font-bold text-xs select-none">
                {unitMode}
              </div>
            </div>
          </div>
        </div>

        {/* Fine Tuning Buttons in mm */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap bg-stone-950/60 p-2 rounded-xl border border-zinc-800/80">
          <span className="text-[11px] text-zinc-400 font-medium">Vi chỉnh số đo:</span>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => handleAdjust(-50)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-medium"
              title="Giảm 50mm"
            >
              -50mm
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(-10)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-medium"
              title="Giảm 10mm"
            >
              -10mm
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(-1)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold flex items-center gap-0.5"
              title="Giảm 1mm"
            >
              <Minus className="w-3 h-3" /> 1mm
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(1)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold flex items-center gap-0.5"
              title="Tăng 1mm"
            >
              <Plus className="w-3 h-3" /> 1mm
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(10)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-medium"
              title="Tăng 10mm"
            >
              +10mm
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(50)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-medium"
              title="Tăng 50mm"
            >
              +50mm
            </button>
          </div>
        </div>

        {/* Slider in mm */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="100"
            max="3500"
            step="5"
            value={mmValue}
            onChange={(e) => updateMm(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>100 mm</span>
            <span className={mmValue >= 780 && mmValue <= 840 ? 'text-amber-400 font-bold' : ''}>810 mm (Cửa 1 cánh)</span>
            <span className={mmValue >= 1500 && mmValue <= 1560 ? 'text-amber-400 font-bold' : ''}>1530 mm (Cửa đôi)</span>
            <span className={mmValue >= 2100 && mmValue <= 2180 ? 'text-amber-400 font-bold' : ''}>2140 mm (Cao cửa)</span>
            <span>3500 mm</span>
          </div>
        </div>

        {/* Quick Presets in mm (Thu gọn bằng mũi tên theo yêu cầu) */}
        <div className="rounded-xl border border-zinc-800/80 bg-stone-950/60 overflow-hidden shadow-inner">
          <button
            type="button"
            onClick={() => setIsPresetsExpanded(!isPresetsExpanded)}
            className="w-full flex items-center justify-between p-2.5 sm:px-3 text-left transition-colors hover:bg-zinc-800/40 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xs">📐</span>
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                Kích thước phong thủy đại cát thông dụng (mm)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                12 mẫu
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="text-[11px] hidden sm:inline text-zinc-400">
                {isPresetsExpanded ? 'Thu gọn' : 'Bấm để mở danh sách'}
              </span>
              {isPresetsExpanded ? (
                <ChevronUp className="w-4 h-4 text-amber-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </button>

          {isPresetsExpanded && (
            <div className="p-2.5 pt-0 border-t border-zinc-800/60">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2.5">
                {LUBAN_PRESETS.map((p) => (
                  <button
                    key={p.val + p.label}
                    type="button"
                    onClick={() => updateMm(p.val)}
                    className={`text-left p-1.5 rounded-lg border transition-all cursor-pointer ${
                      mmValue === p.val
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-stone-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">{p.label}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded ${mmValue === p.val ? 'bg-stone-950/30 text-stone-950 font-bold' : 'text-zinc-500'}`}>
                        {p.val / 10}cm
                      </span>
                    </div>
                    <div className={`text-[10px] truncate ${mmValue === p.val ? 'text-stone-900' : 'text-zinc-400'}`}>
                      {p.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Rulers Result Cards with Visual Tape Bar in mm */}
      <div className={`p-4 sm:p-5 space-y-4 ${isStandalone ? '' : 'overflow-y-auto'}`}>
        {/* Ruler 1: 522 mm */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            result.ruler522.isGood
              ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
              : 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                1. Thước 522 mm (52.2 cm) · Thông Thủy Khối Rỗng
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">Cửa đi, cửa sổ, ô thoáng, lọt lòng</span>
          </div>

          {/* Visual Tape Indicator */}
          <div className="relative my-2.5 bg-stone-950 rounded-lg p-2 border border-zinc-800">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
              <span>0 mm</span>
              <span className="text-amber-400 font-bold">Chu kỳ: {(mmValue % 522).toFixed(0)} / 522 mm</span>
              <span>522 mm</span>
            </div>
            <div className="relative h-4 bg-zinc-800 rounded overflow-hidden flex">
              {['Quý Nhân', 'Hiểm Họa', 'Thiên Tai', 'Thiên Tài', 'Nhân Lộc', 'Cô Độc', 'Thiên Tặc', 'Tể Tướng'].map((sec, i) => {
                const isGood = [0, 3, 4, 7].includes(i);
                return (
                  <div
                    key={sec}
                    className={`h-full flex-1 border-r border-stone-950/40 flex items-center justify-center text-[8px] font-black tracking-tighter ${
                      isGood ? 'bg-emerald-700/80 text-emerald-100' : 'bg-rose-900/80 text-rose-200'
                    }`}
                    title={`${sec} (${isGood ? 'Cát' : 'Hung'})`}
                  >
                    {sec.substring(0, 4)}
                  </div>
                );
              })}
            </div>
            {/* Needle pointer */}
            <div
              className="absolute top-6 w-1.5 h-6 bg-amber-400 rounded-sm shadow-md -translate-x-1/2 pointer-events-none z-10 border border-white"
              style={{ left: `calc(${getCycleProgress(mmValue, 522)}% * 0.96 + 2%)` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-2.5">
              <div
                className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${
                  result.ruler522.isGood
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                }`}
              >
                {result.ruler522.isGood ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>
                  Cung {result.ruler522.palace} · ({result.ruler522.subPalace})
                </span>
              </div>
              <span
                className={`text-xs font-bold ${
                  result.ruler522.isGood ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.ruler522.isGood ? 'Cát (Nên dùng)' : 'Hung (Nên tránh)'}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed bg-stone-950/40 p-2.5 rounded-lg border border-zinc-800/60">
            {result.ruler522.meaning}
          </p>
        </div>

        {/* Ruler 2: 429 mm */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            result.ruler429.isGood
              ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
              : 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                2. Thước 429 mm (42.9 cm) · Dương Trạch Khối Đặc
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">Bàn ghế, giường ngủ, tủ bếp, bậc cầu thang</span>
          </div>

          {/* Visual Tape Indicator */}
          <div className="relative my-2.5 bg-stone-950 rounded-lg p-2 border border-zinc-800">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
              <span>0 mm</span>
              <span className="text-cyan-400 font-bold">Chu kỳ: {(mmValue % 429).toFixed(0)} / 429 mm</span>
              <span>429 mm</span>
            </div>
            <div className="relative h-4 bg-zinc-800 rounded overflow-hidden flex">
              {['Tài', 'Bệnh', 'Ly', 'Nghĩa', 'Quan', 'Kiếp', 'Hại', 'Bản'].map((sec, i) => {
                const isGood = [0, 3, 4, 7].includes(i);
                return (
                  <div
                    key={sec}
                    className={`h-full flex-1 border-r border-stone-950/40 flex items-center justify-center text-[8px] font-black tracking-tighter ${
                      isGood ? 'bg-cyan-700/80 text-cyan-100' : 'bg-rose-900/80 text-rose-200'
                    }`}
                    title={`${sec} (${isGood ? 'Cát' : 'Hung'})`}
                  >
                    {sec}
                  </div>
                );
              })}
            </div>
            {/* Needle pointer */}
            <div
              className="absolute top-6 w-1.5 h-6 bg-cyan-400 rounded-sm shadow-md -translate-x-1/2 pointer-events-none z-10 border border-white"
              style={{ left: `calc(${getCycleProgress(mmValue, 429)}% * 0.96 + 2%)` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-2.5">
              <div
                className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${
                  result.ruler429.isGood
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                }`}
              >
                {result.ruler429.isGood ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>
                  Cung {result.ruler429.palace} · ({result.ruler429.subPalace})
                </span>
              </div>
              <span
                className={`text-xs font-bold ${
                  result.ruler429.isGood ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.ruler429.isGood ? 'Cát (Nên dùng)' : 'Hung (Nên tránh)'}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed bg-stone-950/40 p-2.5 rounded-lg border border-zinc-800/60">
            {result.ruler429.meaning}
          </p>
        </div>

        {/* Ruler 3: 388 mm */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            result.ruler388.isGood
              ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
              : 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                3. Thước 388 mm (38.8 cm) · Âm Phần & Bàn Thờ
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">Bàn thờ gia tiên, sập thờ, tủ thờ, mộ phần</span>
          </div>

          {/* Visual Tape Indicator */}
          <div className="relative my-2.5 bg-stone-950 rounded-lg p-2 border border-zinc-800">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
              <span>0 mm</span>
              <span className="text-amber-400 font-bold">Chu kỳ: {(mmValue % 388).toFixed(0)} / 388 mm</span>
              <span>388 mm</span>
            </div>
            <div className="relative h-4 bg-zinc-800 rounded overflow-hidden flex">
              {['Đinh', 'Hại', 'Vượng', 'Khổ', 'Nghĩa', 'Quan', 'Tử', 'Hưng', 'Thất', 'Cát'].map((sec, i) => {
                const isGood = [0, 2, 4, 5, 7, 9].includes(i);
                return (
                  <div
                    key={sec + i}
                    className={`h-full flex-1 border-r border-stone-950/40 flex items-center justify-center text-[8px] font-black tracking-tighter ${
                      isGood ? 'bg-amber-600/80 text-amber-100' : 'bg-rose-900/80 text-rose-200'
                    }`}
                    title={`${sec} (${isGood ? 'Cát' : 'Hung'})`}
                  >
                    {sec}
                  </div>
                );
              })}
            </div>
            {/* Needle pointer */}
            <div
              className="absolute top-6 w-1.5 h-6 bg-amber-400 rounded-sm shadow-md -translate-x-1/2 pointer-events-none z-10 border border-white"
              style={{ left: `calc(${getCycleProgress(mmValue, 388)}% * 0.96 + 2%)` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-2.5">
              <div
                className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${
                  result.ruler388.isGood
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                }`}
              >
                {result.ruler388.isGood ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>
                  Cung {result.ruler388.palace} · ({result.ruler388.subPalace})
                </span>
              </div>
              <span
                className={`text-xs font-bold ${
                  result.ruler388.isGood ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.ruler388.isGood ? 'Cát (Nên dùng)' : 'Hung (Nên tránh)'}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed bg-stone-950/40 p-2.5 rounded-lg border border-zinc-800/60">
            {result.ruler388.meaning}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3.5 sm:p-4 border-t border-zinc-800 bg-stone-950/80 flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          Quy tắc: Cung Đỏ thì dùng (Cát), Cung Đen/Trắng thì tránh (Hung). Đạt đại cát khi các thước cùng rơi vào cung đỏ.
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors shadow-md"
          >
            Đã Hiểu
          </button>
        )}
      </div>
    </div>
  );
};

export const LuBanRulerModal: React.FC<LuBanRulerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LuBanRulerView onClose={onClose} />
      </div>
    </div>
  );
};
