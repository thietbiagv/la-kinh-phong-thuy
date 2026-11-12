import React, { useState, useMemo } from 'react';
import { LuopanCanvas } from './components/LuopanCanvas';
import { NinePalaceGrid } from './components/NinePalaceGrid';
import { PalaceInspector } from './components/PalaceInspector';
import { ChartOverview } from './components/ChartOverview';
import { FloorPlanOverlayCanvas } from './components/FloorPlanOverlayCanvas';
import { BatTrachInspector } from './components/BatTrachInspector';
import { LuBanRulerModal, LuBanRulerView } from './components/LuBanRulerModal';
import { CompassSelectorModal, CompassGalleryContent } from './components/CompassSelectorModal';
import { CompassInfoPanel } from './components/CompassInfoPanel';
import { ActivationModal, checkActivationKey } from './components/ActivationModal';
import { calculateXuanKong, normalizeDegree } from './utils/xuanKongCalculator';
import { calculateOwnerProfile, calculateBatTrach } from './utils/batTrachCalculator';
import { MOUNTAINS_24, PERIODS } from './utils/fengshuiConstants';
import { COMPASS_RULERS_LIST } from './utils/luopanRulersData';
import { CompassType, FlyingStarChartMode } from './types/fengshui';
import {
  Compass,
  RotateCw,
  Sparkles,
  Info,
  Sliders,
  Layers,
  MapPin,
  Grid,
  ShieldCheck,
  User,
  Ruler,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useDeviceCompass } from './hooks/useDeviceCompass';

export default function App() {
  // Main states
  const [facingDegree, setFacingDegree] = useState<number>(180); // Default 180° (Ngọ - Chính Nam)

  // Real Hardware Magnetic Compass on Mobile Phones (iOS / Android)
  const deviceCompass = useDeviceCompass((headingDeg) => {
    setFacingDegree(headingDeg);
  });
  const [period, setPeriod] = useState<number>(9); // Default Vận 9 (2024-2043)
  const [selectedPalaceNum, setSelectedPalaceNum] = useState<number>(9); // Default focus on South (Palace 9)

  // Bát Trạch Owner states
  const [birthYear, setBirthYear] = useState<number>(1986); // Default 1986 (Bính Dần)
  const [gender, setGender] = useState<'nam' | 'nu'>('nam');

  // Active compass ruler state (12 types)
  const [activeCompass, setActiveCompass] = useState<CompassType>('battrach');
  const [chartMode, setChartMode] = useState<FlyingStarChartMode>('auto'); // 'auto' (Tự động chuyển Thế Quái khi kiêm hướng) | 'ha_quai' | 'the_quai'
  const [isCompassModalOpen, setIsCompassModalOpen] = useState<boolean>(false);
  const [isLuBanModalOpen, setIsLuBanModalOpen] = useState<boolean>(false);

  // Activation & License state (Quy tắc phát nguyện đọc Kinh Địa Tạng - Tác giả Nguyễn Viết Đạt)
  // Tính năng: Tự động yêu cầu nhập lại mã khi thoát ứng dụng / đóng tab (dùng sessionStorage)
  const [isActivated, setIsActivated] = useState<boolean>(() => {
    try {
      // Xóa khóa lưu vĩnh viễn cũ trong localStorage nếu có để đảm bảo quy tắc thoát app phải nhập lại
      localStorage.removeItem('phongthuy_luopan_license');
      const saved = sessionStorage.getItem('phongthuy_session_license');
      if (saved && checkActivationKey(saved)) {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  });
  const [isActivationModalOpen, setIsActivationModalOpen] = useState<boolean>(false);

  const handleActivate = (key: string): boolean => {
    if (checkActivationKey(key)) {
      try {
        sessionStorage.setItem('phongthuy_session_license', key.trim().toUpperCase());
      } catch {
        // ignore
      }
      setIsActivated(true);
      return true;
    }
    return false;
  };

  const handleDeactivate = () => {
    try {
      sessionStorage.removeItem('phongthuy_session_license');
      localStorage.removeItem('phongthuy_luopan_license');
    } catch {
      // ignore
    }
    setIsActivated(false);
    setIsActivationModalOpen(true);
  };
  
  // Active main tab view (Default 'luopan' for instant mobile & desktop compass access):
  // 'luopan' (Đĩa tròn La Kinh), 'overlay' (Chèn ảnh bản vẽ & Lồng mặt bằng), 'luban' (Thước Lỗ Ban), 'battrach' (Bát Trạch), 'compasses' (Kho 12 Thước La Bàn), 'cuucung' (Tinh bàn 9 cung)
  const [activeTab, setActiveTab] = useState<'luopan' | 'overlay' | 'compasses' | 'battrach' | 'cuucung' | 'luban'>('luopan');

  const currentRulerInfo = useMemo(() => {
    return COMPASS_RULERS_LIST.find((r) => r.id === activeCompass) || COMPASS_RULERS_LIST[0];
  }, [activeCompass]);

  // Calculate full Xuan Kong Flying Star analysis (Hạ Quái / Thế Quái)
  const analysis = useMemo(() => {
    return calculateXuanKong(facingDegree, period, chartMode);
  }, [facingDegree, period, chartMode]);

  // Calculate Bát Trạch Owner Profile & Analysis
  const ownerProfile = useMemo(() => {
    return calculateOwnerProfile(birthYear, gender);
  }, [birthYear, gender]);

  const batTrachAnalysis = useMemo(() => {
    return calculateBatTrach(
      analysis.sittingMountain.trigram,
      analysis.facingMountain.trigram,
      ownerProfile
    );
  }, [analysis.sittingMountain.trigram, analysis.facingMountain.trigram, ownerProfile]);

  // Handle degree changes safely
  const handleDegreeChange = (deg: number) => {
    const normalized = normalizeDegree(deg);
    setFacingDegree(normalized);
  };

  // Quick preset house orientations
  const presets = [
    { name: 'Tý Sơn Ngọ Hướng (180°)', deg: 180 },
    { name: 'Ngọ Sơn Tý Hướng (0°)', deg: 0 },
    { name: 'Càn Sơn Tốn Hướng (135°)', deg: 135 },
    { name: 'Tốn Sơn Càn Hướng (315°)', deg: 315 },
    { name: 'Cấn Sơn Khôn Hướng (225°)', deg: 225 },
    { name: 'Khôn Sơn Cấn Hướng (45°)', deg: 45 },
    { name: 'Mão Sơn Dậu Hướng (270°)', deg: 270 },
    { name: 'Dậu Sơn Mão Hướng (90°)', deg: 90 },
  ];

  // Selected Palace data
  const selectedPalace = analysis.palaces[selectedPalaceNum] || analysis.palaces[9];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-stone-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black text-xl shadow-lg ring-1 ring-amber-400/50">
              ☯
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  La Kinh 24 Sơn Hướng & Huyền Không Phi Tinh
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  + Bát Trạch Minh Cảnh
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  ✨ Thiết kế: Nguyễn Viết Đạt
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                La kinh & Cửu cung xoay theo hướng nhà · Chèn ảnh bản vẽ · Định vị 2 điểm · Bát Trạch & Thành Môn Vận 9
              </p>
            </div>
          </div>

          {/* Quick Actions & Owner Badge */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-stone-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-300">Gia chủ:</span>
              <span className="font-bold text-amber-300">
                {ownerProfile.canChi} ({ownerProfile.birthYear})
              </span>
              <span className="text-zinc-500">|</span>
              <span className="font-bold text-emerald-400">
                Cung {ownerProfile.cungPhi} ({ownerProfile.cungPhiNguHanh || '+ Thổ'})
              </span>
            </div>

            {/* NÚT BẬT LA BÀN CẢM BIẾN TỪ TRƯỜNG THỰC TẾ (REAL PHONE COMPASS) */}
            <button
              onClick={deviceCompass.toggleTracking}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                deviceCompass.isTracking
                  ? 'bg-emerald-500 text-stone-950 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/20 animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-700 hover:text-emerald-300'
              }`}
              title={
                deviceCompass.isTracking
                  ? `Đang kết nối cảm biến la bàn thật trên điện thoại: ${Math.round(deviceCompass.heading || facingDegree)}° (Nhấn để tắt)`
                  : 'Bật La Bàn Cảm Biến Từ Trường thực tế trên điện thoại (xoay người đĩa tự quay theo Trái Đất)'
              }
            >
              <Compass className={`w-4 h-4 ${deviceCompass.isTracking ? 'text-stone-950 animate-spin' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">
                {deviceCompass.isTracking ? `Cảm Biến: ${Math.round(deviceCompass.heading || facingDegree)}°` : 'La Bàn Cảm Biến'}
              </span>
              <span className="sm:hidden font-extrabold">
                {deviceCompass.isTracking ? `${Math.round(deviceCompass.heading || facingDegree)}°` : 'Cảm Biến'}
              </span>
            </button>

            {/* NÚT / HUY HIỆU BẢN QUYỀN KÍCH HOẠT (TÂM NGUYỆN KINH ĐỊA TẠNG - NGUYỄN VIẾT ĐẠT) */}
            <button
              onClick={() => setIsActivationModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                isActivated
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-sm'
                  : 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30 shadow-md shadow-rose-950/40 animate-pulse'
              }`}
              title={
                isActivated
                  ? 'Bản quyền phần mềm đã được kích hoạt trọn đời · Tác giả: Nguyễn Viết Đạt (Nhấn để xem lại lời ngỏ)'
                  : 'Chưa kích hoạt bản quyền · Nhấn để đọc tâm thư tác giả Nguyễn Viết Đạt và nhập mã kích hoạt'
              }
            >
              {isActivated ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Bản Quyền: Đã Kích Hoạt</span>
                  <span className="sm:hidden">Đã Kích Hoạt</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Kích Hoạt Bản Quyền</span>
                  <span className="sm:hidden">Kích Hoạt</span>
                </>
              )}
            </button>

            {/* NÚT CHỌN ĐĨA LA BÀN & THƯỚC PHONG THỦY */}
            <button
              onClick={() => setIsCompassModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-stone-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50 cursor-pointer"
              title="Chọn loại Thước & Đĩa La Bàn phong thủy (12 loại chuyên sâu)"
            >
              <Compass className="w-4 h-4 text-stone-950 stroke-[2.5]" />
              <span className="hidden sm:inline">Đĩa: {currentRulerInfo.title}</span>
              <span className="sm:hidden">12 Đĩa</span>
              <span className="hidden md:inline-block text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-stone-950 text-amber-300">
                {currentRulerInfo.badge || 'PRO'}
              </span>
            </button>

            {/* Thước Lỗ Ban Quick Button (Desktop only, mobile has tab) */}
            <button
              onClick={() => setIsLuBanModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/25 cursor-pointer"
              title="Tra cứu Thước Lỗ Ban 3 trong 1 chuẩn mm"
            >
              <Ruler className="w-4 h-4" />
              <span>Thước Lỗ Ban (mm)</span>
            </button>
          </div>
        </div>

        {/* Real-time Compass Sensor Status Banner (chỉ hiển thị ở các tab khác để tránh lặp) */}
        {deviceCompass.isTracking && activeTab !== 'luopan' && (
          <div className="bg-emerald-950/90 border-t border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white">Đang dùng cảm biến la bàn từ trường của điện thoại:</span>
              <span className="font-mono text-emerald-300 font-extrabold text-sm">{Math.round(deviceCompass.heading || facingDegree)}°</span>
              <span className="text-zinc-300">· Sơn {analysis.facingMountain.name} ({analysis.facingMountain.directionName})</span>
              {deviceCompass.accuracy !== null && (
                <span className="text-[10px] text-zinc-400 bg-stone-900 px-1.5 py-0.5 rounded border border-zinc-700">
                  Độ chính xác: ±{Math.round(deviceCompass.accuracy)}°
                </span>
              )}
            </div>
            <button
              onClick={deviceCompass.stopTracking}
              className="text-[11px] text-emerald-300 hover:text-white underline font-semibold cursor-pointer"
            >
              Chuyển về chỉnh tay (mô phỏng)
            </button>
          </div>
        )}

        {deviceCompass.error && (
          <div className="bg-amber-950/90 border-t border-b border-amber-500/40 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
            <span>⚠️ {deviceCompass.error}</span>
            <button onClick={() => deviceCompass.stopTracking()} className="text-amber-400 font-bold underline ml-2">Đóng</button>
          </div>
        )}

        {/* View Mode Tabs (Đĩa La Kinh Truyền Thống ở vị trí số 1 mặc định) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 border-t border-zinc-800/60 pt-1 pb-1 overflow-x-auto">
          {/* TAB 1: ĐĨA LA KINH TRUYỀN THỐNG (MẶC ĐỊNH) */}
          <button
            onClick={() => setActiveTab('luopan')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'luopan'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>☯ Đĩa La Kinh Truyền Thống</span>
          </button>

          {/* TAB 2: CHÈN BẢN VẼ & LẬP CỰC */}
          <button
            onClick={() => setActiveTab('overlay')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'overlay'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>🏠 Lồng Mặt Bằng</span>
          </button>

          {/* TAB 3: THƯỚC LỖ BAN CHUẨN MM */}
          <button
            onClick={() => setActiveTab('luban')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'luban'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400/40 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-rose-400" />
            <span>📐 Thước Lỗ Ban</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-stone-950/40 text-rose-200 font-bold border border-rose-500/30">
              mm
            </span>
          </button>

          {/* TAB 4: BÁT TRẠCH & CUNG PHI */}
          <button
            onClick={() => setActiveTab('battrach')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'battrach'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>🛡 Bát Trạch Gia Chủ</span>
          </button>

          {/* TAB 5: KHO 12 ĐĨA LA KINH & THƯỚC ĐO */}
          <button
            onClick={() => setActiveTab('compasses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'compasses'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>🗂 Kho 12 Đĩa Thước</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Pro
            </span>
          </button>

          {/* TAB 6: LƯỚI CỬU CUNG PHI TINH */}
          <button
            onClick={() => setActiveTab('cuucung')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'cuucung'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>📊 Cửu Cung Phi Tinh</span>
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-1.5 sm:px-6 py-3 sm:py-6 flex-1 w-full flex flex-col gap-4 sm:gap-6">
        {/* Quick Orientation & Period Controller Bar */}
        <section className="bg-stone-900/80 border border-zinc-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Degree Control */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Hướng Nhà:
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDegreeChange(facingDegree - 1)}
                className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center border border-zinc-700"
                title="Giảm 1 độ"
              >
                -1°
              </button>
              <input
                type="number"
                min={0}
                max={360}
                value={facingDegree}
                onChange={(e) => handleDegreeChange(parseFloat(e.target.value) || 0)}
                className="w-16 bg-stone-950 border border-zinc-700 rounded px-2 py-1 text-center font-mono text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleDegreeChange(facingDegree + 1)}
                className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center border border-zinc-700"
                title="Tăng 1 độ"
              >
                +1°
              </button>
            </div>

            <input
              type="range"
              min={0}
              max={360}
              step={0.5}
              value={facingDegree}
              onChange={(e) => handleDegreeChange(parseFloat(e.target.value))}
              className="w-36 sm:w-48 h-2 bg-zinc-800 rounded-lg cursor-pointer accent-amber-500"
            />
          </div>

          {/* 24 Mountain & Period Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Sơn Hướng:</span>
              <select
                value={analysis.facingMountain.name}
                onChange={(e) => {
                  const m = MOUNTAINS_24.find((x) => x.name === e.target.value);
                  if (m) handleDegreeChange(m.centerDeg);
                }}
                className="bg-stone-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500"
              >
                {MOUNTAINS_24.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} · {m.centerDeg}° [{m.trigram} - {m.element}]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Thời Vận:</span>
              <select
                value={period}
                onChange={(e) => setPeriod(parseInt(e.target.value) || 9)}
                className="bg-stone-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                {PERIODS.map((p) => (
                  <option key={p.period} value={p.period}>
                    {p.name} ({p.years}) {p.isCurrent ? '★ Đương vận' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Chế độ Tinh Bàn: Tự Động / Hạ Quái / Thế Quái */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-zinc-700">
              <span className="text-[11px] text-zinc-400 pl-1.5 pr-0.5 font-semibold hidden sm:inline">Tinh Bàn:</span>
              <button
                onClick={() => setChartMode('auto')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  chartMode === 'auto'
                    ? (analysis.chartType === 'THE_QUAI' ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold ring-1 ring-amber-400' : 'bg-blue-600 text-white shadow-sm font-extrabold')
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
                title="Tự động: Lệch < 4.5° dùng Hạ Quái (Chính Hướng), lệch >= 4.5° tự động áp dụng Khởi Tinh Thế Quái (Kiêm Hướng)"
              >
                ⚡ Tự Động {analysis.chartType === 'THE_QUAI' ? '(Thế Quái)' : '(Hạ Quái)'}
              </button>
              <button
                onClick={() => setChartMode('ha_quai')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  chartMode === 'ha_quai'
                    ? 'bg-blue-600 text-white shadow-sm font-extrabold ring-1 ring-blue-400'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
                title="Hạ Quái: Tinh bàn Chính Hướng truyền thống"
              >
                Hạ Quái
              </button>
              <button
                onClick={() => setChartMode('the_quai')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  chartMode === 'the_quai'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-extrabold ring-1 ring-amber-400'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
                title="Thế Quái: Khởi Tinh Bàn thay thế sao theo Khởi Tinh Quyết cho nhà Kiêm Hướng"
              >
                Thế Quái (Kiêm)
              </button>
            </div>
          </div>
        </section>

        {/* TAB 1: FLOOR PLAN OVERLAY (LA KINH & CỬU CUNG XOAY THEO HƯỚNG NHÀ) */}
        {activeTab === 'overlay' && (
          <div className="space-y-6">
            <FloorPlanOverlayCanvas
              facingDegree={facingDegree}
              onDegreeChange={handleDegreeChange}
              analysis={analysis}
              batTrachAnalysis={batTrachAnalysis}
              compassType={activeCompass}
              onSelectCompassType={setActiveCompass}
            />

            {/* BẢNG GIÁM ĐỊNH & PHỐI HỢP CÁCH CỤC LA KINH (ĐẠI QUÁI 64 QUẺ, BÁT TRẠCH, PHÂN KIM...) */}
            <CompassInfoPanel
              compassType={activeCompass}
              facingDegree={facingDegree}
              analysis={analysis}
              batTrachAnalysis={batTrachAnalysis}
              onOpenLuBanModal={() => setActiveTab('luban')}
              onOpenCompassModal={() => setIsCompassModalOpen(true)}
            />

            {/* Bát Trạch Quick Inspector Card */}
            <BatTrachInspector
              analysis={batTrachAnalysis}
              ownerProfile={ownerProfile}
              onChangeBirthYear={setBirthYear}
              onChangeGender={setGender}
            />

            {/* Bottom 2-col info: Formation summary & Palace Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <ChartOverview analysis={analysis} />
              </div>
              <div className="lg:col-span-6">
                <PalaceInspector palace={selectedPalace} analysis={analysis} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KHO 12 ĐĨA LA KINH & THƯỚC ĐO PHONG THỦY CHUYÊN SÂU */}
        {activeTab === 'compasses' && (
          <div className="space-y-6">
            <div className="bg-stone-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                    <span>Kho 12 Thước & Đĩa La Bàn Phong Thủy Chuyên Sâu</span>
                  </h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Bản Pro
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  Đang kích hoạt: <strong className="text-amber-300">{currentRulerInfo.title}</strong> · {currentRulerInfo.subtitle}. Bạn có thể chọn bất kỳ đĩa la kinh hoặc thước nào dưới đây để xem phân tích chi tiết và lập cực trực tiếp trên bản vẽ.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('overlay')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-stone-950" />
                  <span>Chiếu Lên Bản Vẽ Ngay →</span>
                </button>
              </div>
            </div>

            <div className="bg-stone-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <CompassGalleryContent
                selectedCompass={activeCompass}
                onSelectCompass={(id) => {
                  setActiveCompass(id);
                  if (id === 'loban') {
                    setActiveTab('luban');
                  }
                }}
                isStandalone={true}
              />

              <div className="pt-4 border-t border-zinc-800">
                <CompassInfoPanel
                  compassType={activeCompass}
                  facingDegree={facingDegree}
                  analysis={analysis}
                  batTrachAnalysis={batTrachAnalysis}
                  onOpenLuBanModal={() => setActiveTab('luban')}
                  onOpenCompassModal={() => setIsCompassModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEDICATED BÁT TRẠCH PHONG THỦY TAB */}
        {activeTab === 'battrach' && (
          <div className="space-y-6">
            <BatTrachInspector
              analysis={batTrachAnalysis}
              ownerProfile={ownerProfile}
              onChangeBirthYear={setBirthYear}
              onChangeGender={setGender}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <NinePalaceGrid
                  analysis={analysis}
                  batTrachAnalysis={batTrachAnalysis}
                  selectedPalaceNum={selectedPalaceNum}
                  onSelectPalace={setSelectedPalaceNum}
                />
              </div>
              <div className="lg:col-span-6">
                <PalaceInspector palace={selectedPalace} analysis={analysis} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DETAILED TRADITIONAL LUOPAN (LA KINH ĐA TẦNG 15 VÒNG) */}
        {activeTab === 'luopan' && (
          <div className="space-y-4">
            <div className="bg-stone-900/70 border border-zinc-800 rounded-2xl p-1 sm:p-5 shadow-xl overflow-hidden">
              <LuopanCanvas
                facingDegree={facingDegree}
                onDegreeChange={handleDegreeChange}
                currentMountain={analysis.facingMountain}
                sittingMountain={analysis.sittingMountain}
                activeCompass={activeCompass}
                onSelectCompass={setActiveCompass}
                onOpenCompassModal={() => setIsCompassModalOpen(true)}
                activeCompassTitle={currentRulerInfo.title}
                batTrachAnalysis={batTrachAnalysis}
                ownerProfile={ownerProfile}
                isDeviceTracking={deviceCompass.isTracking}
                onToggleDeviceCompass={deviceCompass.toggleTracking}
                period={period}
              />
            </div>

            {/* BẢNG GIÁM ĐỊNH & PHỐI HỢP CÁCH CỤC CHO LA KINH ĐANG CHỌN (ĐẶC BIỆT LÀ ĐẠI QUÁI 64 QUẺ) */}
            <CompassInfoPanel
              compassType={activeCompass}
              facingDegree={facingDegree}
              analysis={analysis}
              batTrachAnalysis={batTrachAnalysis}
              onOpenLuBanModal={() => setActiveTab('luban')}
              onOpenCompassModal={() => setIsCompassModalOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <ChartOverview analysis={analysis} />
              </div>
              <div className="lg:col-span-6">
                <PalaceInspector palace={selectedPalace} analysis={analysis} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 9-PALACE MATRIX & IN-DEPTH ROOM INSPECTION */}
        {activeTab === 'cuucung' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <NinePalaceGrid
                analysis={analysis}
                batTrachAnalysis={batTrachAnalysis}
                selectedPalaceNum={selectedPalaceNum}
                onSelectPalace={setSelectedPalaceNum}
              />
              <ChartOverview analysis={analysis} />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5">
              <PalaceInspector palace={selectedPalace} analysis={analysis} />
            </div>
          </div>
        )}

        {/* TAB 6: DEDICATED THƯỚC LỖ BAN TAB (CHUẨN MM KIẾN TRÚC & MỘC) */}
        {activeTab === 'luban' && (
          <div className="w-full flex justify-center py-2">
            <LuBanRulerView isStandalone={true} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-stone-950 py-4 px-4 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="space-y-1">
            <p>
              Phần mềm La Kinh 24 Sơn Hướng & Huyền Không Phi Tinh · Tích hợp Bát Trạch, 12 Đĩa & Định vị Thành Môn
            </p>
            <p className="text-zinc-400">
              Thiết kế: <strong className="text-amber-300">Nguyễn Viết Đạt</strong> · Hotline/Zalo:{' '}
              <a href="tel:0969719828" className="text-emerald-400 hover:underline font-mono font-bold">
                0969719828
              </a>{' '}
              · Email:{' '}
              <a href="mailto:dat.nguyen.ckxd@gmail.com" className="text-amber-300 hover:underline font-mono">
                dat.nguyen.ckxd@gmail.com
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActivationModalOpen(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 transition-colors cursor-pointer"
            >
              🔑 Bản quyền & Kích hoạt
            </button>
          </div>
        </div>
      </footer>

      {/* Lu Ban Ruler Modal */}
      <LuBanRulerModal
        isOpen={isLuBanModalOpen}
        onClose={() => setIsLuBanModalOpen(false)}
      />

      {/* Compass Selector Modal (Accessible from Header or Canvas) */}
      <CompassSelectorModal
        isOpen={isCompassModalOpen}
        onClose={() => setIsCompassModalOpen(false)}
        selectedCompass={activeCompass}
        onSelectCompass={(id) => {
          setActiveCompass(id);
          setIsCompassModalOpen(false);
          if (id === 'loban') {
            setActiveTab('luban');
          }
        }}
      />

      {/* Activation / License Modal (Quy tắc phát nguyện đọc Kinh Địa Tạng - Tác giả: Nguyễn Viết Đạt) */}
      <ActivationModal
        isOpen={!isActivated || isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        isActivated={isActivated}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        authorPhone="0969719828"
        authorEmail="dat.nguyen.ckxd@gmail.com"
      />
    </div>
  );
}

