import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Mountain24, BatTrachAnalysis, OwnerProfile, CompassType } from '../types/fengshui';
import { MOUNTAINS_24 } from '../utils/fengshuiConstants';
import { normalizeDegree, calculateThanhMon } from '../utils/xuanKongCalculator';
import {
  COMPASS_RULERS_LIST,
  TIEU_SA_ELEMENTS,
  SONG_SON_MAP,
  HOANG_TUYEN_RULES,
  getPhucDucStarForMountain,
  DAI_QUAI_64,
  DAI_QUAI_VIETNAMESE_NAMES,
  getDaiQuaiByDegree,
  isDaiQuaiGood,
  evaluateDaiQuaiHKDQ,
  DaiQuaiEvaluationMode,
  HUNG_HEXAGRAM_IDS,
  XUYEN_SON_72,
  getXuyenSonByDegree,
  THAU_DIA_60,
  getThauDiaByDegree,
  PHAN_KIM_120,
  getPhanKimByDegree,
  NHI_THAP_BAT_TU_28,
  getTinhTucByDegree,
} from '../utils/luopanRulersData';
import {
  RotateCw,
  Compass,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Info,
  Sparkles,
  ShieldCheck,
  Mountain,
  Droplets,
  Grid,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Type,
  Lock,
  Unlock,
} from 'lucide-react';

export type LuopanLayerMode = 'compact' | 'all15' | 'tamhop' | 'tamnguyen' | 'battrach';

interface LuopanCanvasProps {
  facingDegree: number;
  onDegreeChange: (deg: number) => void;
  currentMountain: Mountain24;
  sittingMountain: Mountain24;
  activeCompass?: CompassType;
  onSelectCompass?: (c: CompassType) => void;
  onOpenCompassModal?: () => void;
  activeCompassTitle?: string;
  batTrachAnalysis?: BatTrachAnalysis;
  ownerProfile?: OwnerProfile;
  isDeviceTracking?: boolean;
  onToggleDeviceCompass?: () => void;
  period?: number;
}

// 8 Tiên Thiên Bát Quái
const TIEN_THIEN_BAT_QUAI = [
  { name: 'Càn', symbol: '☰', angleDeg: 180, element: 'Kim', pattern: [0, 0, 0] },
  { name: 'Đoài', symbol: '☱', angleDeg: 135, element: 'Kim', pattern: [0, 0, 1] },
  { name: 'Ly', symbol: '☲', angleDeg: 90, element: 'Hỏa', pattern: [0, 1, 0] },
  { name: 'Chấn', symbol: '☳', angleDeg: 45, element: 'Mộc', pattern: [0, 1, 1] },
  { name: 'Tốn', symbol: '☴', angleDeg: 225, element: 'Mộc', pattern: [1, 0, 0] },
  { name: 'Khảm', symbol: '☵', angleDeg: 270, element: 'Thủy', pattern: [1, 0, 1] },
  { name: 'Cấn', symbol: '☶', angleDeg: 315, element: 'Thổ', pattern: [1, 1, 0] },
  { name: 'Khôn', symbol: '☷', angleDeg: 0, element: 'Thổ', pattern: [1, 1, 1] },
];

// 8 Hậu Thiên Bát Quái
const HAU_THIEN_BAT_QUAI = [
  { name: 'Khảm', symbol: '☵', direction: 'BẮC', angleDeg: 0, palaceNum: 1, element: 'Thủy', pattern: [1, 0, 1] },
  { name: 'Cấn', symbol: '☶', direction: 'ĐÔNG BẮC', angleDeg: 45, palaceNum: 8, element: 'Thổ', pattern: [1, 1, 0] },
  { name: 'Chấn', symbol: '☳', direction: 'ĐÔNG', angleDeg: 90, palaceNum: 3, element: 'Mộc', pattern: [0, 1, 1] },
  { name: 'Tốn', symbol: '☴', direction: 'ĐÔNG NAM', angleDeg: 135, palaceNum: 4, element: 'Mộc', pattern: [1, 0, 0] },
  { name: 'Ly', symbol: '☲', direction: 'NAM', angleDeg: 180, palaceNum: 9, element: 'Hỏa', pattern: [0, 1, 0] },
  { name: 'Khôn', symbol: '☷', direction: 'TÂY NAM', angleDeg: 225, palaceNum: 2, element: 'Thổ', pattern: [1, 1, 1] },
  { name: 'Đoài', symbol: '☱', direction: 'TÂY', angleDeg: 270, palaceNum: 7, element: 'Kim', pattern: [0, 0, 1] },
  { name: 'Càn', symbol: '☰', direction: 'TÂY BẮC', angleDeg: 315, palaceNum: 6, element: 'Kim', pattern: [0, 0, 0] },
];

// Cửu Cung Lạc Thư / Huyền Không Vận 9
const CUU_CUNG_LAC_THU = [
  { num: 1, name: 'Nhất Bạch', element: 'Thủy', deg: 0 },
  { num: 8, name: 'Bát Bạch', element: 'Thổ', deg: 45 },
  { num: 3, name: 'Tam Bích', element: 'Mộc', deg: 90 },
  { num: 4, name: 'Tứ Lục', element: 'Mộc', deg: 135 },
  { num: 9, name: 'Cửu Tử', element: 'Hỏa', deg: 180 },
  { num: 2, name: 'Nhị Hắc', element: 'Thổ', deg: 225 },
  { num: 7, name: 'Thất Xích', element: 'Kim', deg: 270 },
  { num: 6, name: 'Lục Bạch', element: 'Kim', deg: 315 },
];

export const LuopanCanvas: React.FC<LuopanCanvasProps> = ({
  facingDegree,
  onDegreeChange,
  currentMountain,
  sittingMountain,
  activeCompass = 'tonghop',
  onSelectCompass,
  onOpenCompassModal,
  activeCompassTitle,
  batTrachAnalysis,
  ownerProfile,
  isDeviceTracking,
  onToggleDeviceCompass,
  period = 9,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active compass ruler details
  const currentCompassInfo = useMemo(() => {
    return COMPASS_RULERS_LIST.find((c) => c.id === activeCompass) || COMPASS_RULERS_LIST[0];
  }, [activeCompass]);

  // Thanh Môn Thủy Pháp Vận 9
  const thanhMonData = useMemo(() => {
    return calculateThanhMon(currentMountain, period);
  }, [currentMountain, period]);

  // View mode: 'rotateCompass' (Facing is UP) vs 'fixedNorth' (North is UP, needle rotates)
  const [viewMode, setViewMode] = useState<'rotateCompass' | 'fixedNorth'>('rotateCompass');
  const [showCrosshair, setShowCrosshair] = useState<boolean>(true);
  const [showHanzi, setShowHanzi] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [layerMode, setLayerMode] = useState<LuopanLayerMode>('compact');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayerGuide, setShowLayerGuide] = useState<boolean>(false);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [isDegreeLocked, setIsDegreeLocked] = useState<boolean>(false);
  // Quy chuẩn đánh giá 64 Quẻ: 'hkdq' (Huyền Không Đại Quái động) vs 'kinhdich' (Chu Dịch cố định)
  const [daiQuaiMode, setDaiQuaiMode] = useState<DaiQuaiEvaluationMode>('hkdq');

  // Canvas size state (high resolution base)
  const [canvasDim, setCanvasDim] = useState<number>(760);

  // Resize listener with ResizeObserver to ensure canvas fits 100% inside mobile screens
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 640;
      let target: number;

      if (isFullscreen) {
        target = Math.min(window.innerWidth - 12, window.innerHeight - 150);
      } else {
        // Measure accurate available container width
        const containerW = containerRef.current?.clientWidth || (window.innerWidth - (isMobile ? 16 : 48));
        // Subtract internal padding and borders (p-1 on each side + border = ~12px on mobile)
        const availableW = containerW - (isMobile ? 12 : 24);
        target = Math.min(availableW, 840);

        // Mobile safety constraint: never exceed screen width minus margins
        if (isMobile) {
          target = Math.min(target, window.innerWidth - 24);
        }
      }

      setCanvasDim(Math.max(260, Math.floor(target)));
    };

    updateSize();

    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateSize();
      });
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (ro) ro.disconnect();
    };
  }, [isFullscreen]);

  // Element color palettes for authentic Luopan feel
  const getElementColor = (el: string, alpha: number = 1) => {
    switch (el) {
      case 'Thủy':
        return `rgba(15, 76, 129, ${alpha})`; // Deep Navy Lacquer
      case 'Hỏa':
        return `rgba(185, 28, 28, ${alpha})`; // Crimson Lacquer
      case 'Mộc':
        return `rgba(20, 83, 45, ${alpha})`; // Imperial Jade Green
      case 'Kim':
        return `rgba(161, 98, 7, ${alpha})`; // Antique Bronze / Gold
      case 'Thổ':
        return `rgba(113, 63, 18, ${alpha})`; // Earth Ochre
      default:
        return `rgba(39, 39, 42, ${alpha})`;
    }
  };

  // Draw Trigram Symbol
  const drawTrigramLines = (
    ctx: CanvasRenderingContext2D,
    pattern: number[],
    x: number,
    y: number,
    size: number,
    angleRad: number,
    color: string = '#fef08a'
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angleRad);

    const lineWidth = size * 0.9;
    const lineThickness = Math.max(1.5, size * 0.12);
    const gap = size * 0.22;
    const splitGap = size * 0.2;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineThickness;

    pattern.forEach((isBroken, idx) => {
      const lineY = (idx - 1) * gap;
      if (!isBroken) {
        ctx.beginPath();
        ctx.moveTo(-lineWidth / 2, lineY);
        ctx.lineTo(lineWidth / 2, lineY);
        ctx.stroke();
      } else {
        const halfSeg = (lineWidth - splitGap) / 2;
        ctx.beginPath();
        ctx.moveTo(-lineWidth / 2, lineY);
        ctx.lineTo(-lineWidth / 2 + halfSeg, lineY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(lineWidth / 2 - halfSeg, lineY);
        ctx.lineTo(lineWidth / 2, lineY);
        ctx.stroke();
      }
    });

    ctx.restore();
  };

  // Live Inspector Data at Current Facing Degree
  const liveData = useMemo(() => {
    const deg = facingDegree;
    const sitDeg = normalizeDegree(facingDegree + 180);
    const pk = getPhanKimByDegree(deg);
    const xs = getXuyenSonByDegree(deg);
    const td = getThauDiaByDegree(deg);
    const dq = getDaiQuaiByDegree(deg);
    const tt = getTinhTucByDegree(deg);
    const pd = getPhucDucStarForMountain(sittingMountain.trigram, currentMountain.name);
    const songSon = SONG_SON_MAP[currentMountain.name];
    const ht = HOANG_TUYEN_RULES[currentMountain.name];
    const tieuSaEl = TIEU_SA_ELEMENTS[currentMountain.name] || 'Hỏa';

    return {
      deg,
      sitDeg,
      pk,
      xs,
      td,
      dq,
      tt,
      pd,
      songSon,
      ht,
      tieuSaEl,
    };
  }, [facingDegree, sittingMountain, currentMountain]);

  // Main Canvas Render Logic with 15 Concentric Rings
  const drawLuopan = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const baseDim = canvasDim * zoomScale;
    const width = baseDim;
    const height = baseDim;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.maxWidth = '100%';
    canvas.style.aspectRatio = '1 / 1';

    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const isMobile = width < 540;
    const maxR = width / 2 - (isMobile ? 3 : 10);

    ctx.clearRect(0, 0, width, height);

    const rotationOffset = viewMode === 'rotateCompass' ? -facingDegree : 0;
    const rotationRad = (rotationOffset * Math.PI) / 180;

    // 1. Luopan Base Plate (Vuông Ngoài Tròn Trong - Thiên Viên Địa Phương)
    ctx.save();
    const plateInset = isMobile ? 2 : 6;
    const cornerR = isMobile ? 14 : 24;
    ctx.fillStyle = '#1c1917'; // Rich dark ebony wood lacquer
    ctx.strokeStyle = '#92400e'; // Antique bronze rim
    ctx.lineWidth = isMobile ? 3 : 5;
    ctx.beginPath();
    ctx.roundRect(plateInset, plateInset, width - plateInset * 2, height - plateInset * 2, cornerR);
    ctx.fill();
    ctx.stroke();

    // Corner decorative metal brackets with rivets
    const bracketSize = isMobile ? 18 : 28;
    [[plateInset, plateInset], [width - plateInset, plateInset], [plateInset, height - plateInset], [width - plateInset, height - plateInset]].forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.arc(bx, by, bracketSize, 0, Math.PI * 2);
      ctx.fillStyle = '#b45309';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Biển tên loại đĩa La Kinh phong thủy đang kích hoạt trên mặt đế
    ctx.save();
    const plaqueW = Math.min(width - (isMobile ? 24 : 60), 380);
    const plaqueH = isMobile ? 18 : 22;
    const plaqueY = isMobile ? 4 : 8;
    ctx.fillStyle = 'rgba(24, 24, 27, 0.95)';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect((width - plaqueW) / 2, plaqueY, plaqueW, plaqueH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = `bold ${isMobile ? 9 : 10.5}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `🧭 ĐĨA: ${currentCompassInfo.title.toUpperCase()} [${currentCompassInfo.badge || 'BẢN PRO'}]`,
      width / 2,
      plaqueY + plaqueH / 2
    );
    ctx.restore();

    // 2. Brass Circular Dial Ring Outer Shadow & Bezel
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.fillStyle = '#292524';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Metallic Brass Rim
    const rimGrad = ctx.createRadialGradient(cx, cy, maxR - 10, cx, cy, maxR);
    rimGrad.addColorStop(0, '#d97706');
    rimGrad.addColorStop(0.5, '#fef08a');
    rimGrad.addColorStop(1, '#78350f');
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 7;
    ctx.stroke();

    // Rotate the inner dial according to rotationOffset
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationRad);

    // =========================================================================
    // CONCENTRIC RADIUS DEFINITIONS (15 AUTHENTIC FENG SHUI LAYERS)
    // =========================================================================
    const rScale = maxR / 360; // Scaling factor relative to 360px radius

    const isCompact = layerMode === 'compact';
    const active = activeCompass || 'tonghop';

    const shouldDrawLayer2 = !isCompact;
    const shouldDrawLayer3 = !isCompact || active === 'daiquai';
    const shouldDrawLayer4 = shouldDrawLayer3; // Bộ số Quái Vận & Quái Khí luôn hiển thị song hành cùng 64 Quẻ, không bị ẩn
    const shouldDrawLayer5 = !isCompact || active === 'phankim120';
    const shouldDrawLayer6 = !isCompact || active === 'xuyenson';
    const shouldDrawLayer7 = !isCompact || active === 'thaudia';
    const shouldDrawLayer8 = !isCompact || active === 'napthuy';
    const shouldDrawLayer9 = !isCompact || active === 'tieusa';
    const shouldDrawLayer10 = true;
    const shouldDrawLayer11 = !isCompact || active === 'phucduc24';
    const shouldDrawLayer12 = true;
    const shouldDrawLayer13 = true;
    const shouldDrawLayer14 = !isCompact || active === 'huyenkhong';

    // Highlight helper for active layer
    const drawHighlightRing = (rOut: number, rIn: number, color: string = '#f59e0b') => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 9;
      ctx.beginPath();
      ctx.arc(0, 0, rOut, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, rIn, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    // Layer radii dynamic allocation based on active compass & mode
    const r1_out = maxR - 6;
    const r1_in = isCompact ? r1_out - 30 * rScale : r1_out - 22 * rScale; // Tầng 1: 360° Châu Thiên

    let curR = r1_in;

    let r2_out = curR, r2_in = curR;
    if (shouldDrawLayer2) {
      r2_out = curR;
      r2_in = curR - 18 * rScale;
      curR = r2_in;
    }

    let r3_out = curR, r3_in = curR;
    if (shouldDrawLayer3) {
      r3_out = curR;
      r3_in = curR - (isCompact ? (active === 'daiquai' ? 34 : 26) : 26) * rScale;
      curR = r3_in;
    }

    let r4_out = curR, r4_in = curR;
    if (shouldDrawLayer4) {
      r4_out = curR;
      r4_in = curR - (isCompact ? 18 : 16) * rScale;
      curR = r4_in;
    }

    let r5_out = curR, r5_in = curR;
    if (shouldDrawLayer5) {
      r5_out = curR;
      r5_in = curR - (isCompact ? (active === 'phankim120' ? 32 : 26) : 22) * rScale;
      curR = r5_in;
    }

    let r6_out = curR, r6_in = curR;
    if (shouldDrawLayer6) {
      r6_out = curR;
      r6_in = curR - (isCompact ? (active === 'xuyenson' ? 34 : 26) : 24) * rScale;
      curR = r6_in;
    }

    let r7_out = curR, r7_in = curR;
    if (shouldDrawLayer7) {
      r7_out = curR;
      r7_in = curR - (isCompact ? (active === 'thaudia' ? 34 : 26) : 24) * rScale;
      curR = r7_in;
    }

    let r8_out = curR, r8_in = curR;
    if (shouldDrawLayer8) {
      r8_out = curR;
      r8_in = curR - (isCompact ? (active === 'napthuy' ? 32 : 26) : 22) * rScale;
      curR = r8_in;
    }

    let r9_out = curR, r9_in = curR;
    if (shouldDrawLayer9) {
      r9_out = curR;
      r9_in = curR - (isCompact ? (active === 'tieusa' ? 32 : 26) : 22) * rScale;
      curR = r9_in;
    }

    // Tầng 10: 24 Sơn Địa Bàn Chính Châm
    const r10_out = curR;
    const r10_in = isCompact
      ? (active === 'diaban24' ? curR - 68 * rScale : curR - 50 * rScale)
      : curR - 38 * rScale;
    curR = r10_in;

    let r11_out = curR, r11_in = curR;
    if (shouldDrawLayer11) {
      r11_out = curR;
      r11_in = curR - (isCompact ? 24 : 18) * rScale;
      curR = r11_in;
    }

    // Tầng 12: Hậu Thiên Bát Quái & Du Niên Bát Trạch
    const r12_out = curR;
    const r12_in = isCompact
      ? (active === 'battrach' ? curR - 52 * rScale : curR - 44 * rScale)
      : curR - 22 * rScale;
    curR = r12_in;

    // Tầng 13: Tiên Thiên Bát Quái
    const r13_out = curR;
    const r13_in = isCompact ? curR - 30 * rScale : curR - 18 * rScale;
    curR = r13_in;

    let r14_out = curR, r14_in = curR;
    if (shouldDrawLayer14) {
      r14_out = curR;
      r14_in = curR - (isCompact ? 22 : 16) * rScale;
      curR = r14_in;
    }

    // Tầng 15: Thiên Trì
    const rPool = curR;

    // =========================================================================
    // TẦNG 1: 360 ĐỘ CHÂU THIÊN (360° ASTRONOMICAL DIAL)
    // =========================================================================
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, 0, r1_out, 0, Math.PI * 2);
    ctx.arc(0, 0, r1_in, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let deg = 0; deg < 360; deg++) {
      const rad = ((deg - 90) * Math.PI) / 180;
      const isMajor = deg % 10 === 0;
      const isMedium = deg % 5 === 0 && !isMajor;

      const tickLen = (isMajor ? 11 : isMedium ? 6 : 3) * rScale;
      const x1 = Math.cos(rad) * r1_out;
      const y1 = Math.sin(rad) * r1_out;
      const x2 = Math.cos(rad) * (r1_out - tickLen);
      const y2 = Math.sin(rad) * (r1_out - tickLen);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor ? '#fbbf24' : isMedium ? '#d4d4d8' : '#71717a';
      ctx.lineWidth = isMajor ? 1.2 : 0.6;
      ctx.stroke();

      if (deg % 30 === 0) {
        ctx.save();
        const textR = r1_in + 7 * rScale;
        ctx.translate(Math.cos(rad) * textR, Math.sin(rad) * textR);
        ctx.rotate(rad + Math.PI / 2);
        ctx.font = `bold ${Math.max(5.5, 6.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = deg === 0 ? '#ef4444' : '#fef3c7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${deg}°`, 0, 0);
        ctx.restore();
      }
    }

    // =========================================================================
    // TẦNG 2: 28 TINH TÚC (NHỊ THẬP BÁT TÚ)
    // =========================================================================
    if (shouldDrawLayer2) {
      NHI_THAP_BAT_TU_28.forEach((tt) => {
        const sRad = ((tt.centerDeg - tt.spanDeg / 2 - 90) * Math.PI) / 180;
        const eRad = ((tt.centerDeg + tt.spanDeg / 2 - 90) * Math.PI) / 180;
        const mRad = ((tt.centerDeg - 90) * Math.PI) / 180;

        ctx.beginPath();
        ctx.arc(0, 0, r2_out, sRad, eRad);
        ctx.arc(0, 0, r2_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = tt.isGood ? 'rgba(5, 150, 105, 0.35)' : 'rgba(220, 38, 38, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#3f3f46';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.save();
        const midR = (r2_out + r2_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (showHanzi) {
          ctx.font = `bold ${Math.max(6.5, 7.2 * rScale)}px serif`;
          ctx.fillStyle = tt.isGood ? '#6ee7b7' : '#fca5a5';
          ctx.fillText(tt.hanzi, 0, -3 * rScale);
          ctx.font = `bold ${Math.max(5.5, 6 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText(tt.name, 0, 4 * rScale);
        } else {
          // Pure Vietnamese: Constellation Name + Cát/Hung
          ctx.font = `bold ${Math.max(5.5, 6.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = tt.isGood ? '#6ee7b7' : '#fca5a5';
          ctx.fillText(tt.name, 0, -2.5 * rScale);

          ctx.font = `bold ${Math.max(4.5, 5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = tt.isGood ? '#34d399' : '#f87171';
          ctx.fillText(tt.isGood ? 'Cát' : 'Hung', 0, 4 * rScale);
        }
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 3: 64 QUẺ TIÊN THIÊN HUYỀN KHÔNG ĐẠI QUÁI
    // =========================================================================
    if (shouldDrawLayer3) {
      const hexSpan = 360 / 64;
      DAI_QUAI_64.forEach((hex) => {
        const sRad = ((hex.centerDeg - hexSpan / 2 - 90) * Math.PI) / 180;
        const eRad = ((hex.centerDeg + hexSpan / 2 - 90) * Math.PI) / 180;
        const mRad = ((hex.centerDeg - 90) * Math.PI) / 180;

        const sittingDegree = normalizeDegree(facingDegree + 180);
        const diffF = Math.abs((((facingDegree - hex.centerDeg) % 360) + 540) % 360 - 180);
        const diffS = Math.abs((((sittingDegree - hex.centerDeg) % 360) + 540) % 360 - 180);
        const isFacingHex = diffF < hexSpan / 2;
        const isSittingHex = diffS < hexSpan / 2;

        const sittingHex = getDaiQuaiByDegree(sittingDegree, null, period, daiQuaiMode);
        const evalResult = evaluateDaiQuaiHKDQ(hex, sittingHex, period);
        const isGood = daiQuaiMode === 'kinhdich' ? !HUNG_HEXAGRAM_IDS.has(hex.id) : evalResult.isGood;

        ctx.beginPath();
        ctx.arc(0, 0, r3_out, sRad, eRad);
        ctx.arc(0, 0, r3_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = isFacingHex
          ? 'rgba(239, 68, 68, 0.45)'
          : isSittingHex
          ? 'rgba(59, 130, 246, 0.45)'
          : isGood
          ? 'rgba(254, 242, 242, 0.92)' // Nền sáng ngà cho quẻ Cát
          : 'rgba(244, 244, 245, 0.90)'; // Nền sáng xám cho quẻ Hung
        ctx.fill();
        ctx.strokeStyle = isFacingHex ? '#dc2626' : isSittingHex ? '#2563eb' : isGood ? '#fca5a5' : '#71717a';
        ctx.lineWidth = (isFacingHex || isSittingHex) ? 1.2 : 0.5;
        ctx.stroke();

        ctx.save();
        const midR = (r3_out + r3_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // QUẺ TỐT THÌ CHỮ ĐỎ, QUẺ XẤU THÌ CHỮ ĐEN (Chuẩn yêu cầu phong thủy)
        ctx.fillStyle = isGood ? '#dc2626' : '#09090b';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 1;

        if (showHanzi) {
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px serif`;
          ctx.fillText(hex.hanzi, 0, 0);
        } else {
          // Pure Vietnamese: Clean standard Quẻ name from DAI_QUAI_VIETNAMESE_NAMES
          const vnName = DAI_QUAI_VIETNAMESE_NAMES[hex.id] || hex.name;
          if (vnName.includes(' ')) {
            const parts = vnName.split(' ');
            ctx.font = `bold ${Math.max(4.6, 5.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(parts[0], 0, -2.8 * rScale);
            ctx.fillText(parts[1], 0, 2.8 * rScale);
          } else {
            ctx.font = `bold ${Math.max(5.2, 6.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(vnName, 0, 0);
          }
        }
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 4: BỘ SỐ HUYỀN KHÔNG ĐẠI QUÁI (QUÁI VẬN · QUÁI KHÍ / QUÁI SỐ)
    // =========================================================================
    if (shouldDrawLayer4) {
      const hexSpan = 360 / 64;
      const sittingDegree = normalizeDegree(facingDegree + 180);
      const sittingHex = getDaiQuaiByDegree(sittingDegree, null, period, daiQuaiMode);

      DAI_QUAI_64.forEach((hex) => {
        const sRad = ((hex.centerDeg - hexSpan / 2 - 90) * Math.PI) / 180;
        const eRad = ((hex.centerDeg + hexSpan / 2 - 90) * Math.PI) / 180;
        const mRad = ((hex.centerDeg - 90) * Math.PI) / 180;

        const diffF = Math.abs((((facingDegree - hex.centerDeg) % 360) + 540) % 360 - 180);
        const diffS = Math.abs((((sittingDegree - hex.centerDeg) % 360) + 540) % 360 - 180);
        const isFacingHex = diffF < hexSpan / 2;
        const isSittingHex = diffS < hexSpan / 2;

        const evalResult = daiQuaiMode === 'kinhdich'
          ? { isGood: !HUNG_HEXAGRAM_IDS.has(hex.id) }
          : evaluateDaiQuaiHKDQ(hex, sittingHex, period);
        const isGood = evalResult.isGood;

        ctx.beginPath();
        ctx.arc(0, 0, r4_out, sRad, eRad);
        ctx.arc(0, 0, r4_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = isFacingHex
          ? 'rgba(239, 68, 68, 0.45)'
          : isSittingHex
          ? 'rgba(59, 130, 246, 0.45)'
          : isGood
          ? 'rgba(254, 226, 226, 0.95)' // Nền hồng ấm nổi bật cho quẻ Cát
          : 'rgba(228, 228, 231, 0.92)'; // Nền sáng xám cho quẻ Hung
        ctx.fill();
        ctx.strokeStyle = isFacingHex ? '#dc2626' : isSittingHex ? '#2563eb' : isGood ? '#fca5a5' : '#71717a';
        ctx.lineWidth = (isFacingHex || isSittingHex) ? 1.2 : 0.5;
        ctx.stroke();

        ctx.save();
        const midR = (r4_out + r4_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad + Math.PI / 2);
        ctx.font = `900 ${Math.max(6.2, 7.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 1;
        ctx.textBaseline = 'middle';

        const vanStr = `${hex.quaiVan}`;
        const dotStr = '·';
        const khiStr = `${hex.quaiSo}`;

        const wVan = ctx.measureText(vanStr).width;
        const wDot = ctx.measureText(dotStr).width;
        const wKhi = ctx.measureText(khiStr).width;
        const totalW = wVan + wDot + wKhi;
        const startX = -totalW / 2;

        ctx.textAlign = 'left';
        // 1. Quái Vận: Xanh Đậm Da Trời (#0284c7)
        ctx.fillStyle = '#0284c7';
        ctx.fillText(vanStr, startX, 0);

        // 2. Dấu chấm phân cách
        ctx.fillStyle = isGood ? '#dc2626' : '#71717a';
        ctx.fillText(dotStr, startX + wVan, 0);

        // 3. Quái Khí: Giữ nguyên màu ban đầu (Đỏ nếu Cát, Đen nếu Hung)
        ctx.fillStyle = isGood ? '#dc2626' : '#09090b';
        ctx.fillText(khiStr, startX + wVan + wDot, 0);

        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 5: 120 PHÂN KIM (3° MỖI Ô - NỔI BẬT CHÂU BẢO BÍNH CANH - ĐẬM RÕ)
    // =========================================================================
    if (shouldDrawLayer5) {
      PHAN_KIM_120.forEach((pk) => {
        const sRad = ((pk.centerDeg - 1.5 - 90) * Math.PI) / 180;
        const eRad = ((pk.centerDeg + 1.5 - 90) * Math.PI) / 180;
        const mRad = ((pk.centerDeg - 90) * Math.PI) / 180;

        ctx.beginPath();
        ctx.arc(0, 0, r5_out, sRad, eRad);
        ctx.arc(0, 0, r5_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = pk.isChauBao
          ? 'rgba(245, 158, 11, 0.85)' // Rich Gold for Chau Bao
          : 'rgba(24, 24, 27, 0.4)';
        ctx.fill();
        ctx.strokeStyle = pk.isChauBao ? '#b45309' : '#3f3f46';
        ctx.lineWidth = pk.isChauBao ? 1 : 0.4;
        ctx.stroke();

        ctx.save();
        const midR = (r5_out + r5_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad); // Xoay dọc nan hoa (radial)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (pk.isChauBao) {
          const pkLabel = pk.phanKimName.includes('Bính') ? 'B' : 'C';
          ctx.font = `bold ${Math.max(5.0, 6.0 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#451a03';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
          ctx.shadowBlur = 1;
          ctx.fillText(pkLabel, 0, 0);
        } else {
          ctx.font = `bold ${Math.max(3.8, 4.4 * rScale)}px sans-serif`;
          ctx.fillStyle = '#71717a';
          ctx.fillText('·', 0, 0);
        }
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 6: 72 XUYÊN SƠN LONG (5° MỖI LONG - GỌN GÀNG, SẮC NÉT)
    // =========================================================================
    if (shouldDrawLayer6) {
      XUYEN_SON_72.forEach((long) => {
        const sRad = ((long.centerDeg - 2.5 - 90) * Math.PI) / 180;
        const eRad = ((long.centerDeg + 2.5 - 90) * Math.PI) / 180;
        const mRad = ((long.centerDeg - 90) * Math.PI) / 180;

        ctx.beginPath();
        ctx.arc(0, 0, r6_out, sRad, eRad);
        ctx.arc(0, 0, r6_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = long.isGood
          ? 'rgba(16, 185, 129, 0.45)'
          : long.type.includes('Không Vong')
          ? 'rgba(239, 68, 68, 0.45)'
          : 'rgba(245, 158, 11, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.save();
        const midR = (r6_out + r6_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad); // Xoay dọc nan hoa (radial)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (long.isGood) {
          // Chu Bảo / Chính Khí Long: Viết tắt chuẩn ĐẬM RÕ (B.Dần, C.Ngọ, Đ.Mão, T.Dậu...)
          const parts = long.name.split(' ');
          const label = parts.length > 1 ? `${parts[0][0]}.${parts[1]}` : long.name;
          ctx.font = `bold ${Math.max(4.6, 5.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#6ee7b7';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 3;
          ctx.fillText(label, 0, 0);
        } else {
          ctx.font = `bold ${Math.max(3.8, 4.4 * rScale)}px sans-serif`;
          ctx.fillStyle = long.type.includes('Không Vong') ? '#f87171' : '#71717a';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 2;
          ctx.fillText(long.type.includes('Không Vong') ? 'KV' : '·', 0, 0);
        }
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 7: 60 THẤU ĐỊA LONG (6° MỖI LONG - GỌN GÀNG, SẮC NÉT)
    // =========================================================================
    if (shouldDrawLayer7) {
      THAU_DIA_60.forEach((td) => {
        const sRad = ((td.centerDeg - 3 - 90) * Math.PI) / 180;
        const eRad = ((td.centerDeg + 3 - 90) * Math.PI) / 180;
        const mRad = ((td.centerDeg - 90) * Math.PI) / 180;

        ctx.beginPath();
        ctx.arc(0, 0, r7_out, sRad, eRad);
        ctx.arc(0, 0, r7_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = td.isGood ? 'rgba(20, 184, 166, 0.45)' : 'rgba(24, 24, 27, 0.4)';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.save();
        const midR = (r7_out + r7_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad); // Xoay dọc nan hoa (radial)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (td.isGood) {
          // Vượng tướng / Chân Long (Bính, Canh, Đinh, Tân): Viết tắt chuẩn La Kinh ĐẬM RÕ (B.Tý, C.Ngọ, Đ.Mão, T.Dậu)
          const parts = td.name.split(' ');
          const label = parts.length > 1 ? `${parts[0][0]}.${parts[1]}` : td.name;
          ctx.font = `bold ${Math.max(4.6, 5.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#5eead4';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 3;
          ctx.fillText(label, 0, 0);
        } else {
          ctx.font = `bold ${Math.max(3.8, 4.4 * rScale)}px sans-serif`;
          ctx.fillStyle = td.rating.includes('Đại Hung') ? '#f87171' : '#71717a';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 2;
          ctx.fillText(td.rating.includes('Đại Hung') ? 'H' : '·', 0, 0);
        }
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 8: NẠP THỦY 24 SƠN (ĐỒNG BỘ 100% 24 SƠN ĐỊA BÀN LÀM MỐC - GỌN GÀNG)
    // =========================================================================
    if (shouldDrawLayer8) {
      const hoangTuyenRule = HOANG_TUYEN_RULES[currentMountain.name];
      MOUNTAINS_24.forEach((m) => {
        const sRad = ((m.startDeg - 90) * Math.PI) / 180;
        const eRad = ((m.endDeg - 90) * Math.PI) / 180;
        const mRad = ((m.centerDeg - 90) * Math.PI) / 180;

        const isHT = hoangTuyenRule?.hoangTuyenSons.includes(m.name);

        ctx.beginPath();
        ctx.arc(0, 0, r8_out, sRad, eRad);
        ctx.arc(0, 0, r8_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = isHT ? 'rgba(220, 38, 38, 0.65)' : 'rgba(6, 182, 212, 0.35)';
        ctx.fill();
        ctx.strokeStyle = isHT ? '#ef4444' : '#0891b2';
        ctx.lineWidth = isHT ? 1.2 : 0.6;
        ctx.stroke();

        ctx.save();
        const midR = (r8_out + r8_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad + Math.PI / 2);
        ctx.font = `bold ${Math.max(5.2, 6.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = isHT ? '#ffffff' : '#a5f3fc';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 2.5;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isHT ? 'H.Tuyền' : m.name, 0, 0);
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 9: TIÊU SA 24 SƠN (ĐỒNG BỘ 100% 24 SƠN ĐỊA BÀN LÀM MỐC - GỌN GÀNG)
    // =========================================================================
    if (shouldDrawLayer9) {
      MOUNTAINS_24.forEach((m) => {
        const sRad = ((m.startDeg - 90) * Math.PI) / 180;
        const eRad = ((m.endDeg - 90) * Math.PI) / 180;
        const mRad = ((m.centerDeg - 90) * Math.PI) / 180;

        const saEl = TIEU_SA_ELEMENTS[m.name] || 'Hỏa';

        ctx.beginPath();
        ctx.arc(0, 0, r9_out, sRad, eRad);
        ctx.arc(0, 0, r9_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = getElementColor(saEl, 0.35);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.save();
        const midR = (r9_out + r9_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad + Math.PI / 2);
        ctx.font = `bold ${Math.max(5.2, 6.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 2.5;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${m.name}(${saEl[0]})`, 0, 0);
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 10: ĐỊA BÀN CHÍNH CHÂM 24 SƠN HƯỚNG (TẦNG CỐT LÕI)
    // =========================================================================
    MOUNTAINS_24.forEach((mountain) => {
      const sRad = ((mountain.startDeg - 90) * Math.PI) / 180;
      const eRad = ((mountain.endDeg - 90) * Math.PI) / 180;
      const mRad = ((mountain.centerDeg - 90) * Math.PI) / 180;

      const isFacingM = mountain.name === currentMountain.name;
      const isSittingM = mountain.name === sittingMountain.name;

      ctx.beginPath();
      ctx.arc(0, 0, r10_out, sRad, eRad);
      ctx.arc(0, 0, r10_in, eRad, sRad, true);
      ctx.closePath();

      if (isFacingM) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)'; // Red
      } else if (isSittingM) {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.7)'; // Blue
      } else {
        ctx.fillStyle = getElementColor(mountain.element, 0.4);
      }
      ctx.fill();

      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      const midR = (r10_out + r10_in) / 2;
      ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
      ctx.rotate(mRad + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const polColor = mountain.polarity === '+' ? '#f87171' : '#60a5fa';

      const isChinhTM = active === 'huyenkhong' && thanhMonData && mountain.name === thanhMonData.chinhThanhMon.mountain.name;
      const isPhuTM = active === 'huyenkhong' && thanhMonData && mountain.name === thanhMonData.phuThanhMon.mountain.name;
      const hasTM = isChinhTM || isPhuTM;

      if (showHanzi) {
        ctx.font = `bold ${Math.max(isCompact ? 9.5 : 7.5, (isCompact ? 11.5 : 9.0) * rScale)}px serif`;
        ctx.fillStyle = isFacingM || isSittingM ? '#ffffff' : '#ffffff';
        ctx.fillText(mountain.hanzi, 0, (isCompact ? -10.5 : -8.0) * rScale);

        ctx.font = `bold ${Math.max(isCompact ? 7.8 : 6.2, (isCompact ? 9.2 : 7.5) * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = isFacingM ? '#fecaca' : isSittingM ? '#bfdbfe' : '#fef08a';
        ctx.fillText(mountain.name, 0, 0);

        ctx.font = `600 ${Math.max(isCompact ? 5.5 : 4.2, (isCompact ? 6.8 : 5.0) * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = polColor;
        ctx.fillText(`${mountain.yuan[0]}${mountain.polarity}`, 0, (isCompact ? 9.5 : 7.2) * rScale);
      } else {
        // Pure Vietnamese: Tên Sơn (BÍNH, NGỌ, TỴ...) vừa vặn, gọn gàng và nổi bật
        const mFontSize = hasTM
          ? Math.max(isCompact ? 8.8 : 7.0, (isCompact ? 10.8 : 8.2) * rScale)
          : Math.max(isCompact ? 9.8 : 7.6, (isCompact ? 11.8 : 9.0) * rScale);
        ctx.font = `bold ${mFontSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = isFacingM || isSittingM ? '#ffffff' : '#fef08a';
        const mOffsetY = hasTM ? (isCompact ? -10.5 : -8.2) * rScale : (isCompact ? -7.5 : -5.8) * rScale;
        ctx.fillText(mountain.name.toUpperCase(), 0, mOffsetY);

        // Dòng 2: Ký hiệu Thiên/Địa/Nhân Nguyên Long (Đ+ · Hỏa, T- · Hỏa...) thu nhỏ gọn gàng, sắc nét cho điện thoại
        const yFontSize = hasTM
          ? Math.max(isCompact ? 5.2 : 4.0, (isCompact ? 6.2 : 4.6) * rScale)
          : Math.max(isCompact ? 5.6 : 4.3, (isCompact ? 7.0 : 5.0) * rScale);
        ctx.font = `600 ${yFontSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = polColor;
        const compactYuan = `${mountain.yuan[0]}${mountain.polarity}`;
        const yOffsetY = hasTM ? 0 : (isCompact ? 7.2 : 5.4) * rScale;
        ctx.fillText(`${compactYuan} · ${mountain.element}`, 0, yOffsetY);

        // Dòng 3: Hiển thị Thành Môn Thủy Pháp Vận 9 khi chọn la bàn Huyền Không
        if (hasTM) {
          ctx.font = `bold ${Math.max(4.6, (isCompact ? 5.8 : 4.8) * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = isChinhTM ? '#fde047' : '#93c5fd';
          ctx.fillText(isChinhTM ? '⭐Chính TM' : '⭐Phụ TM', 0, (isCompact ? 11.5 : 8.8) * rScale);
        }
      }
      ctx.restore();
    });

    // =========================================================================
    // TẦNG 11: 24 VỊ THẦN PHÚC ĐỨC (KHAI MÔN BÁT TRẠCH)
    // =========================================================================
    if (shouldDrawLayer11) {
      MOUNTAINS_24.forEach((m) => {
        const sRad = ((m.startDeg - 90) * Math.PI) / 180;
        const eRad = ((m.endDeg - 90) * Math.PI) / 180;
        const mRad = ((m.centerDeg - 90) * Math.PI) / 180;

        const pStar = getPhucDucStarForMountain(sittingMountain.trigram, m.name);

        ctx.beginPath();
        ctx.arc(0, 0, r11_out, sRad, eRad);
        ctx.arc(0, 0, r11_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = pStar.isGood ? 'rgba(16, 185, 129, 0.45)' : 'rgba(220, 38, 38, 0.4)';
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.save();
        const midR = (r11_out + r11_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = pStar.isGood ? '#d1fae5' : '#fee2e2';

        // Tách chữ thành 2 dòng (ví dụ "Ôn Hoàng", "Trường Bệnh") và giảm kích thước font để không bị tràn ô hay đè lên nhau
        const pParts = pStar.name.split(' ');
        if (pParts.length > 1) {
          const fSize = Math.max(4.6, 5.2 * rScale);
          ctx.font = `bold ${fSize}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText(pParts[0], 0, -fSize * 0.55);
          ctx.fillText(pParts.slice(1).join(' '), 0, fSize * 0.55);
        } else {
          ctx.font = `bold ${Math.max(4.8, 5.6 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText(pStar.name, 0, 0);
        }
        ctx.restore();
      });
    }

    // =========================================================================
    // TẦNG 12: HẬU THIÊN BÁT QUÁI & DU NIÊN BÁT TRẠCH (8 CUNG)
    // =========================================================================
    HAU_THIEN_BAT_QUAI.forEach((tg) => {
      const sRad = ((tg.angleDeg - 22.5 - 90) * Math.PI) / 180;
      const eRad = ((tg.angleDeg + 22.5 - 90) * Math.PI) / 180;
      const mRad = ((tg.angleDeg - 90) * Math.PI) / 180;

      const pData = batTrachAnalysis?.palaces[tg.palaceNum];
      const star = pData?.ownerStar || pData?.houseStar;

      ctx.beginPath();
      ctx.arc(0, 0, r12_out, sRad, eRad);
      ctx.arc(0, 0, r12_in, eRad, sRad, true);
      ctx.closePath();
      ctx.fillStyle = star?.isGood ? 'rgba(5, 150, 105, 0.5)' : 'rgba(185, 28, 28, 0.5)';
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      const midR = (r12_out + r12_in) / 2;
      ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
      ctx.rotate(mRad + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (star) {
        ctx.font = `bold ${isCompact ? Math.max(8.5, 10 * rScale) : Math.max(6, 6.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(tg.name, 0, isCompact ? -6.5 * rScale : -3.2 * rScale);
        ctx.font = `bold ${isCompact ? Math.max(8, 9.2 * rScale) : Math.max(5.5, 6.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = star.isGood ? '#a7f3d0' : '#fecaca';
        ctx.fillText(star.name, 0, isCompact ? 6.5 * rScale : 3.5 * rScale);
      } else {
        ctx.font = `bold ${isCompact ? Math.max(9, 10.5 * rScale) : Math.max(6.5, 7.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${tg.name} (${tg.direction})`, 0, 0);
      }
      ctx.restore();
    });

    // =========================================================================
    // TẦNG 13: TIÊN THIÊN BÁT QUÁI (HÀO VẠCH QUẺ TƯỢNG)
    // =========================================================================
    TIEN_THIEN_BAT_QUAI.forEach((tg) => {
      const sRad = ((tg.angleDeg - 22.5 - 90) * Math.PI) / 180;
      const eRad = ((tg.angleDeg + 22.5 - 90) * Math.PI) / 180;
      const mRad = ((tg.angleDeg - 90) * Math.PI) / 180;

      ctx.beginPath();
      ctx.arc(0, 0, r13_out, sRad, eRad);
      ctx.arc(0, 0, r13_in, eRad, sRad, true);
      ctx.closePath();
      ctx.fillStyle = 'rgba(67, 56, 202, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const midR = (r13_out + r13_in) / 2;
      const tx = Math.cos(mRad) * midR;
      const ty = Math.sin(mRad) * midR;
      drawTrigramLines(ctx, tg.pattern, tx, ty, (isCompact ? 13 : 10) * rScale, mRad + Math.PI / 2);
    });

    // =========================================================================
    // TẦNG 14: CỬU CUNG LẠC THƯ / VẬN 9 (1-9)
    // =========================================================================
    if (shouldDrawLayer14) {
      CUU_CUNG_LAC_THU.forEach((cc) => {
        const sRad = ((cc.deg - 22.5 - 90) * Math.PI) / 180;
        const eRad = ((cc.deg + 22.5 - 90) * Math.PI) / 180;
        const mRad = ((cc.deg - 90) * Math.PI) / 180;

        ctx.beginPath();
        ctx.arc(0, 0, r14_out, sRad, eRad);
        ctx.arc(0, 0, r14_in, eRad, sRad, true);
        ctx.closePath();
        ctx.fillStyle = cc.num === 9 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(39, 39, 42, 0.5)';
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.save();
        const midR = (r14_out + r14_in) / 2;
        ctx.translate(Math.cos(mRad) * midR, Math.sin(mRad) * midR);
        ctx.rotate(mRad + Math.PI / 2);
        ctx.font = `900 ${Math.max(7.5, 9.0 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = cc.num === 9 ? '#ffffff' : '#fef08a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${cc.num}`, 0, 0);
        ctx.restore();
      });
    }

    // Viền vàng hoàng kim nổi bật tầng đĩa la kinh đang kích hoạt
    if (active === 'daiquai' && shouldDrawLayer3) {
      drawHighlightRing(r3_out, r4_in, '#ec4899');
    } else if (active === 'phankim120' && shouldDrawLayer5) {
      drawHighlightRing(r5_out, r5_in, '#f59e0b');
    } else if (active === 'xuyenson' && shouldDrawLayer6) {
      drawHighlightRing(r6_out, r6_in, '#10b981');
    } else if (active === 'thaudia' && shouldDrawLayer7) {
      drawHighlightRing(r7_out, r7_in, '#14b8a6');
    } else if (active === 'napthuy' && shouldDrawLayer8) {
      drawHighlightRing(r8_out, r8_in, '#06b6d4');
    } else if (active === 'tieusa' && shouldDrawLayer9) {
      drawHighlightRing(r9_out, r9_in, '#f59e0b');
    } else if (active === 'diaban24') {
      drawHighlightRing(r10_out, r10_in, '#3b82f6');
    } else if (active === 'phucduc24' && shouldDrawLayer11) {
      drawHighlightRing(r11_out, r11_in, '#8b5cf6');
    } else if (active === 'battrach') {
      drawHighlightRing(r12_out, r12_in, '#10b981');
    } else if (active === 'huyenkhong') {
      drawHighlightRing(r10_out, r10_in, '#eab308');
      if (shouldDrawLayer14) drawHighlightRing(r14_out, r14_in, '#eab308');
    }

    // =========================================================================
    // TẦNG 15: THIÊN TRÌ (HEAVEN POOL / CENTRAL COMPASS BASIN)
    // =========================================================================
    const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, rPool);
    centerGrad.addColorStop(0, '#fef9c3');
    centerGrad.addColorStop(0.65, '#fef08a');
    centerGrad.addColorStop(0.85, '#ca8a04');
    centerGrad.addColorStop(1, '#854d0e');

    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rPool, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Central Pool Inner Basin (Pearl White/Ivory Bed)
    const rIvory = rPool - 5 * rScale;
    ctx.fillStyle = '#fafaf9';
    ctx.beginPath();
    ctx.arc(0, 0, rIvory, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Đáy Thiên Trì: Chỉ Đỏ Định Hướng Nam - Bắc & Hai Chấm Son Cổ Truyền
    ctx.save();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -rIvory + 4 * rScale);
    ctx.lineTo(0, rIvory - 4 * rScale);
    ctx.stroke();

    // 2 Chấm Son đáy Thiên Trì (Hai điểm chuẩn phong thủy cổ truyền)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -rIvory * 0.55, 1.8 * rScale, 0, Math.PI * 2);
    ctx.arc(0, rIvory * 0.55, 1.8 * rScale, 0, Math.PI * 2);
    ctx.fill();

    // VÀNH KHẮC ĐỘ VIỀN MÃ THIÊN TRÌ (0° - 360° theo yêu cầu số độ trong ao)
    const rTicksOut = rIvory - 1;
    for (let d = 0; d < 360; d += 5) {
      const dRad = ((d - 90) * Math.PI) / 180;
      const isMajor = d % 30 === 0;
      const isMedium = d % 10 === 0 && !isMajor;
      const tickL = (isMajor ? 5 : isMedium ? 3.5 : 2) * rScale;

      const x1 = Math.cos(dRad) * rTicksOut;
      const y1 = Math.sin(dRad) * rTicksOut;
      const x2 = Math.cos(dRad) * (rTicksOut - tickL);
      const y2 = Math.sin(dRad) * (rTicksOut - tickL);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor ? '#b45309' : isMedium ? '#d97706' : '#d4d4d8';
      ctx.lineWidth = isMajor ? 1 : 0.6;
      ctx.stroke();

      // In số độ trên mép trong ao (mỗi 30°)
      if (d % 30 === 0) {
        ctx.save();
        const numR = rTicksOut - 8.5 * rScale;
        ctx.translate(Math.cos(dRad) * numR, Math.sin(dRad) * numR);
        let rot = dRad + Math.PI / 2;
        if (d > 90 && d < 270) {
          rot += Math.PI; // Flip upright so numbers are easily legible
        }
        ctx.rotate(rot);
        ctx.font = `bold ${Math.max(6.5, 7.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = d === 0 ? '#dc2626' : (d === 90 || d === 270) ? '#0284c7' : d === 180 ? '#b45309' : '#1e293b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${d}°`, 0, 0);
        ctx.restore();
      }
    }



    // TỪ CHÂM TRUYỀN THỐNG TRONG THIÊN TRÌ (Slender Needle inside Heaven Pool)
    let needleAngleRad: number;
    if (viewMode === 'rotateCompass') {
      needleAngleRad = -Math.PI / 2;
    } else {
      needleAngleRad = ((facingDegree - 90) * Math.PI) / 180;
    }

    ctx.save();
    ctx.rotate(needleAngleRad + Math.PI / 2);

    const needleLen = rIvory * 0.82; // Strictly inside Thiên Trì
    const needleHalfW = Math.max(1.8, 2.4 * rScale);

    // Mũi kim Đỏ (Hướng Nam / Hướng nhà)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-needleHalfW, -needleLen * 0.35);
    ctx.lineTo(0, -needleLen);
    ctx.lineTo(needleHalfW, -needleLen * 0.35);
    ctx.closePath();
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Đầu mũi kim khuyên son nhỏ
    ctx.beginPath();
    ctx.arc(0, -needleLen * 0.6, 1.5 * rScale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Đuôi kim Xanh (Tọa Bắc - Đuôi én/Đuôi cá phong thủy)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-needleHalfW, needleLen * 0.35);
    ctx.lineTo(0, needleLen * 0.7);
    ctx.lineTo(-needleHalfW * 1.5, needleLen);
    ctx.lineTo(0, needleLen * 0.85);
    ctx.lineTo(needleHalfW * 1.5, needleLen);
    ctx.lineTo(0, needleLen * 0.7);
    ctx.lineTo(needleHalfW, needleLen * 0.35);
    ctx.closePath();
    ctx.fillStyle = '#2563eb';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Trục xoay kim bằng đồng vàng tại tâm
    ctx.beginPath();
    ctx.arc(0, 0, 3.8 * rScale, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 1.5 * rScale, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626';
    ctx.fill();

    ctx.restore();
    ctx.restore(); // Restore Thiên Trì

    ctx.restore(); // Restore dial translation/rotation

    // =========================================================================
    // OVERLAY: THẬP ĐẠO HỒNG TUYẾN (DÂY CHỈ HỒNG LA KINH TRUYỀN THỐNG)
    // Dây chỉ đỏ căng thẳng vuông góc xuyên suốt toàn bộ mặt đĩa La Kinh
    // =========================================================================
    if (showCrosshair) {
      ctx.save();
      // Chỉ Hồng Thập Đạo sợi chỉ đỏ mảnh, sắc nét, căng thẳng truyền thống
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.4;
      ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
      ctx.shadowBlur = 4;

      // Trục dọc (Chỉ hồng Nam - Bắc / Hướng - Tọa)
      ctx.beginPath();
      ctx.moveTo(cx, 10);
      ctx.lineTo(cx, height - 10);
      ctx.stroke();

      // Trục ngang (Chỉ hồng Đông - Tây)
      ctx.beginPath();
      ctx.moveTo(10, cy);
      ctx.lineTo(width - 10, cy);
      ctx.stroke();

      ctx.shadowBlur = 0;

      // 4 Chốt giữ dây chỉ hồng kim loại ở 4 cạnh khay vuông
      const pinR = 3;
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      [[cx, 10], [cx, height - 10], [10, cy], [width - 10, cy]].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, pinR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      ctx.restore();
    }

    // =========================================================================
    // TIÊU ĐIỂM CHỈ ĐỘ NGOẠI VIÊN (TINH TẾ Ở VÀNH ĐỘ, KHÔNG CHE KHUẤT CÁC TẦNG)
    // =========================================================================
    ctx.save();
    ctx.translate(cx, cy);

    let rimFacingRad: number;
    let rimSittingRad: number;

    if (viewMode === 'rotateCompass') {
      rimFacingRad = -Math.PI / 2;
      rimSittingRad = Math.PI / 2;
    } else {
      rimFacingRad = ((facingDegree - 90) * Math.PI) / 180;
      rimSittingRad = ((facingDegree + 180 - 90) * Math.PI) / 180;
    }

    // Con trỏ Hướng đỏ tinh tế tại vành độ ngoài cùng
    ctx.save();
    ctx.rotate(rimFacingRad + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -maxR);
    ctx.lineTo(-5 * rScale, -maxR - 7 * rScale);
    ctx.lineTo(5 * rScale, -maxR - 7 * rScale);
    ctx.closePath();
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = `bold ${Math.max(7.5, 8.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('HƯỚNG', 0, -maxR + 14 * rScale);
    ctx.restore();

    // Con trỏ Tọa xanh tinh tế tại vành độ ngoài cùng
    ctx.save();
    ctx.rotate(rimSittingRad + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -maxR);
    ctx.lineTo(-4.5 * rScale, -maxR - 6 * rScale);
    ctx.lineTo(4.5 * rScale, -maxR - 6 * rScale);
    ctx.closePath();
    ctx.fillStyle = '#2563eb';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = `bold ${Math.max(7.5, 8.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('TỌA', 0, -maxR + 14 * rScale);
    ctx.restore();

    ctx.restore();
  }, [
    canvasDim,
    facingDegree,
    viewMode,
    showCrosshair,
    showHanzi,
    zoomScale,
    layerMode,
    currentMountain,
    sittingMountain,
    batTrachAnalysis,
  ]);

  useEffect(() => {
    drawLuopan();
  }, [drawLuopan]);

  // Pointer drag to rotate compass
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDegreeLocked) return;
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDegreeLocked) return;
    if (!isDragging && e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    let angleRad = Math.atan2(y, x);
    let deg = (angleRad * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    onDegreeChange(Math.round(deg));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Export Canvas as High Resolution PNG
  const exportImage = (isHD: boolean = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `LaKinh_DaTang_${currentMountain.name}_${facingDegree}do_${isHD ? 'HD' : 'chuan'}.png`;
    a.click();
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-stone-950/98 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4 overflow-y-auto select-none"
          : "flex flex-col items-center w-full space-y-3"
      }
      ref={containerRef}
    >
      {/* Top Header / Status bar */}
      <div className="w-full bg-stone-900/90 border border-zinc-800 rounded-2xl p-2.5 sm:p-4 shadow-xl space-y-2">
        {/* Row 1: Primary Controls (Direction HUD + View Switcher + Sensor + Fullscreen + Settings) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Direction HUD badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950 border border-zinc-800 text-xs shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse" />
            <span className="text-amber-300 font-mono font-extrabold text-sm">{facingDegree}°</span>
            <span className="text-white font-extrabold">Sơn {currentMountain.name}</span>
            <span className="text-zinc-400 hidden sm:inline">({currentMountain.directionName})</span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-400 hidden sm:inline">Tọa {normalizeDegree(facingDegree + 180)}° ({sittingMountain.name})</span>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Bộ Chọn 12 Loại Đĩa La Kinh & Thước Phong Thủy */}
            <div className="flex items-center gap-1.5 bg-stone-950 rounded-lg px-2.5 py-1 border border-amber-500/50 shadow-md">
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-amber-300 hidden md:inline">Loại Đĩa:</span>
              <select
                value={activeCompass || 'tonghop'}
                onChange={(e) => onSelectCompass?.(e.target.value as CompassType)}
                className="bg-transparent text-xs font-black text-amber-200 focus:outline-none cursor-pointer pr-1"
                title="Chọn 1 trong 12 đĩa la kinh & thước phong thủy chuyên sâu"
              >
                {COMPASS_RULERS_LIST.map((c) => (
                  <option key={c.id} value={c.id} className="bg-stone-900 text-zinc-100 font-semibold py-1">
                    {c.title} ({c.badge || 'Pro'})
                  </option>
                ))}
              </select>
              {onOpenCompassModal && (
                <button
                  onClick={onOpenCompassModal}
                  className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-sm cursor-pointer ml-0.5"
                  title="Mở thư viện xem chi tiết 12 đĩa thước phong thủy"
                >
                  12 Đĩa
                </button>
              )}
            </div>

            {/* Chế độ Tinh Gọn vs 15 Tầng */}
            <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-amber-500/30">
              <button
                onClick={() => setLayerMode('compact')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  layerMode === 'compact'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Chế độ Tinh Gọn (Dễ Nhìn, chữ to rõ nét)"
              >
                🎯 Tinh Gọn
              </button>
              <button
                onClick={() => setLayerMode('all15')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  layerMode === 'all15'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Chế độ 15 Tầng Đầy Đủ"
              >
                📜 15 Tầng
              </button>
            </div>

            {/* Nút Khóa / Mở Khóa Số Độ */}
            <button
              onClick={() => setIsDegreeLocked(!isDegreeLocked)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                isDegreeLocked
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
              title={isDegreeLocked ? 'Số độ đang bị khóa cố định. Bấm để mở xoay.' : 'Bấm để khóa cố định số độ hiện tại, tránh chạm tay làm xoay lệch.'}
            >
              {isDegreeLocked ? <Lock className="w-3.5 h-3.5 text-white" /> : <Unlock className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{isDegreeLocked ? 'Đã khóa độ' : 'Khóa độ'}</span>
            </button>

            {/* Cảm Biến La Bàn */}
            {onToggleDeviceCompass && (
              <button
                onClick={onToggleDeviceCompass}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isDeviceTracking
                    ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300 shadow-md shadow-emerald-500/30 animate-pulse'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/40'
                }`}
                title="Định vị la bàn cảm biến từ trường thực tế trên điện thoại"
              >
                <Compass className={`w-3.5 h-3.5 ${isDeviceTracking ? 'animate-spin' : ''}`} style={isDeviceTracking ? { animationDuration: '6s' } : undefined} />
                <span>{isDeviceTracking ? 'Đang Dò' : 'Cảm Biến'}</span>
              </button>
            )}

            {/* Nút Toàn Màn Hình */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                isFullscreen
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-zinc-700'
              }`}
              title="Bật/Tắt chế độ toàn màn hình cho La Kinh"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn Màn Hình'}</span>
            </button>

            {/* Nút Mở Rộng Cài Đặt */}
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                showMoreOptions ? 'bg-amber-500 text-stone-950 border-amber-400' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
              title="Tùy chọn bổ sung (Chỉ hồng, Chữ Hán, Xoay hướng, Tải ảnh HD...)"
            >
              {showMoreOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Options (Tự động ẩn/hiện) */}
        {showMoreOptions && (
          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-1.5 animate-fadeIn text-xs">
            {onOpenCompassModal && (
              <button
                onClick={onOpenCompassModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{activeCompassTitle || '12 Thước'}</span>
              </button>
            )}

            <button
              onClick={() => setViewMode(viewMode === 'rotateCompass' ? 'fixedNorth' : 'rotateCompass')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold border border-zinc-700 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>{viewMode === 'rotateCompass' ? 'Xoay Hướng' : 'Cố định Bắc'}</span>
            </button>

            <button
              onClick={() => setShowCrosshair(!showCrosshair)}
              className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                showCrosshair ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              Chỉ Hồng
            </button>

            <button
              onClick={() => setShowHanzi(!showHanzi)}
              className={`px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1 cursor-pointer ${
                !showHanzi ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span>{!showHanzi ? 'Thuần Việt' : 'Chữ Hán'}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
              <button
                onClick={() => setZoomScale(Math.max(0.85, zoomScale - 0.15))}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold px-1 text-zinc-300">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale(Math.min(1.75, zoomScale + 0.15))}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quy chuẩn đánh giá 64 Quẻ */}
            <div className="flex items-center gap-1 bg-stone-950 px-2 py-0.5 rounded-lg border border-zinc-800 text-[11px]">
              <span className="text-zinc-400 font-bold hidden md:inline">64 Quẻ:</span>
              <button
                onClick={() => setDaiQuaiMode('hkdq')}
                className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer transition-all ${
                  daiQuaiMode === 'hkdq'
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Huyền Không Đại Quái: Tự động đổi màu Đỏ/Đen theo Đương Vận 9, Hợp Thập, Hợp Hà Đồ, Đồng Khí"
              >
                ⚡ Đại Quái (Động)
              </button>
              <button
                onClick={() => setDaiQuaiMode('kinhdich')}
                className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer transition-all ${
                  daiQuaiMode === 'kinhdich'
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Chu Dịch 64 Quẻ: 22 quẻ Hung cố định chữ đen, 42 quẻ Cát chữ đỏ"
              >
                📖 Chu Dịch (Cố định)
              </button>
            </div>

            <button
              onClick={() => exportImage(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Lưu Ảnh HD</span>
            </button>
          </div>
        )}
      </div>

      {/* Canvas Interactive Container */}
      <div className="w-full flex justify-center p-0 sm:p-2 overflow-hidden">
        <div className="relative touch-none cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-stone-950 p-0.5 sm:p-2 max-w-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="block mx-auto rounded-xl select-none max-w-full h-auto"
            style={{
              touchAction: 'none',
              maxWidth: '100%',
              height: 'auto',
              aspectRatio: '1 / 1',
            }}
          />
        </div>
      </div>

      {/* LIVE DEGREE INSPECTOR CARD (TRA CỨU NHANH 15 TẦNG TẠI ĐỘ SỐ HIỆN TẠI) */}
      <div className="w-full bg-stone-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 text-xs text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Thông Số Đa Tầng Tại Hướng {facingDegree}° (Sơn {currentMountain.name})
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">
            Tọa {liveData.sitDeg}° (Sơn {sittingMountain.name})
          </span>
        </div>

        {/* Active Compass Highlight Banner Card */}
        <div className="bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 p-3 rounded-xl border border-amber-500/50 shadow-md flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-400 shrink-0 stroke-[2.2]" />
            <div>
              <div className="font-extrabold text-amber-300 text-xs sm:text-sm">
                Đang Kích Hoạt: {currentCompassInfo.title} · {currentCompassInfo.subtitle}
              </div>
              <div className="text-[11px] text-zinc-300 mt-0.5">
                {currentCompassInfo.description}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-stone-950 shrink-0">
            {currentCompassInfo.badge || 'PRO'}
          </span>
        </div>

        {/* Nếu chọn Huyền Không: Hiển thị phân tích Thành Môn Thủy Pháp Vận 9 */}
        {activeCompass === 'huyenkhong' && thanhMonData && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl text-xs space-y-1.5 shadow-md">
            <div className="font-bold text-emerald-300 flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-extrabold">⭐ Vị Trí Xác Định Thành Môn (Vận 9):</span>
              <span className="text-white bg-stone-900 px-2 py-0.5 rounded border border-emerald-500/30">
                Chính Thành Môn: Sơn <strong>{thanhMonData.chinhThanhMon.mountain.name}</strong> ({thanhMonData.chinhThanhMon.palaceName})
              </span>
              <span className="text-zinc-300 bg-stone-900 px-2 py-0.5 rounded border border-zinc-700">
                Phụ Thành Môn: Sơn <strong>{thanhMonData.phuThanhMon.mountain.name}</strong> ({thanhMonData.phuThanhMon.palaceName})
              </span>
            </div>
            <div className="text-emerald-200/90 text-[11px] leading-relaxed">
              {thanhMonData.summary}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Card 1: Địa Bàn */}
          <div className="bg-stone-950/60 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">1. Địa Bàn</span>
            <div className="font-bold text-amber-300 text-sm mt-0.5">
              Sơn {currentMountain.name} ({currentMountain.hanzi})
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {currentMountain.yuan} Nguyên ({currentMountain.polarity}) · Hành {currentMountain.element}
            </div>
          </div>

          {/* Card 2: 64 Quẻ Đại Quái */}
          <div className="bg-stone-950/60 p-2.5 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">2. 64 Quẻ Đại Quái</span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded truncate ${
                liveData.dq.isGood ? 'bg-red-950/80 text-rose-300 border border-red-500/40' : 'bg-zinc-800 text-zinc-300 border border-zinc-600'
              }`} title={liveData.dq.evaluation?.reasons?.join(' · ')}>
                {liveData.dq.isGood ? '⭐ Cát (Chữ Đỏ)' : 'Hung (Chữ Đen)'}
              </span>
            </div>
            <div className={`font-bold text-sm mt-0.5 ${liveData.dq.isGood ? 'text-rose-400' : 'text-zinc-200'}`}>
              {liveData.dq.name} ({liveData.dq.hanzi})
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center justify-between">
              <span>Bộ số [Vận·Khí]: <strong className="text-sky-400 font-black font-mono text-xs" title="Quái Vận (Xanh Đậm Da Trời)">{liveData.dq.quaiVan}</strong>·<strong className="text-zinc-200 font-mono text-xs">{liveData.dq.quaiSo}</strong></span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${liveData.dq.isGood ? 'bg-red-950/60 text-rose-300 border border-red-500/30' : 'bg-zinc-800 text-zinc-400'}`}>
                {liveData.dq.quaiVan === period ? `★ Đương Vận ${period}` : liveData.dq.evaluation?.rating}
              </span>
            </div>
            {liveData.dq.evaluation?.reasons && liveData.dq.evaluation.reasons.length > 0 && (
              <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1 border-t border-zinc-800/80 pt-1" title={liveData.dq.evaluation.reasons.join(' · ')}>
                {liveData.dq.evaluation.reasons[0]}
              </div>
            )}
          </div>

          {/* Card 3: 120 Phân Kim */}
          <div className={`p-2.5 rounded-xl border ${
            liveData.pk.isChauBao ? 'bg-amber-950/30 border-amber-500/50' : 'bg-stone-950/60 border-zinc-800'
          }`}>
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">3. 120 Phân Kim</span>
            <div className={`font-bold text-sm mt-0.5 ${liveData.pk.isChauBao ? 'text-amber-300' : 'text-zinc-200'}`}>
              {liveData.pk.phanKimName}
            </div>
            <div className="text-[11px] text-amber-400 font-semibold mt-0.5 truncate">
              {liveData.pk.rating}
            </div>
          </div>

          {/* Card 4: 72 Xuyên Sơn */}
          <div className="bg-stone-950/60 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">4. 72 Xuyên Sơn</span>
            <div className="font-bold text-indigo-300 text-sm mt-0.5">
              {liveData.xs.name}
            </div>
            <div className={`text-[11px] font-semibold mt-0.5 ${liveData.xs.isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
              {liveData.xs.type.split(' ')[0]}
            </div>
          </div>

          {/* Card 5: 60 Thấu Địa */}
          <div className="bg-stone-950/60 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">5. 60 Thấu Địa</span>
            <div className="font-bold text-teal-300 text-sm mt-0.5">
              {liveData.td.name}
            </div>
            <div className={`text-[11px] font-semibold mt-0.5 ${liveData.td.isGood ? 'text-teal-400' : 'text-zinc-400'}`}>
              Khí {liveData.td.rating}
            </div>
          </div>

          {/* Card 6: 28 Tinh Túc */}
          <div className="bg-stone-950/60 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">6. 28 Tinh Túc</span>
            <div className="font-bold text-cyan-300 text-sm mt-0.5">
              Sao {liveData.tt.name} ({liveData.tt.hanzi})
            </div>
            <div className={`text-[11px] font-semibold mt-0.5 ${liveData.tt.isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
              {liveData.tt.animal} · {liveData.tt.rating}
            </div>
          </div>
        </div>

        {/* Nạp Thủy & Tiêu Sa & Phúc Đức details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          <div className="bg-stone-950/40 p-2.5 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-400 font-bold">Nạp Thủy (Thiên Bàn +7.5°): </span>
            <span className="text-cyan-300 font-semibold">{liveData.songSon?.cuc || 'Chính Sơn'}</span>
            {liveData.ht?.hoangTuyenSons.includes(currentMountain.name) ? (
              <span className="text-rose-400 font-bold ml-1.5">⚠️ Phạm Bát Cán Hoàng Tuyền</span>
            ) : (
              <span className="text-emerald-400 font-semibold ml-1.5">✓ Thanh Thủy Cát</span>
            )}
          </div>

          <div className="bg-stone-950/40 p-2.5 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-400 font-bold">Tiêu Sa (Nhân Bàn -7.5°): </span>
            <span className="text-amber-300 font-semibold">Hành {liveData.tieuSaEl}</span>
            <span className="text-zinc-500 ml-1">· So Tọa {sittingMountain.name}</span>
          </div>

          <div className="bg-stone-950/40 p-2.5 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-400 font-bold">24 Phúc Đức: </span>
            <span className={`font-bold ${liveData.pd.isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
              {liveData.pd.name} ({liveData.pd.nature})
            </span>
          </div>
        </div>
      </div>

      {/* ACCORDION: BÁCH KHOA CẨM NANG 15 TẦNG LA KINH */}
      <div className="w-full bg-stone-900/80 border border-zinc-800 rounded-2xl p-4 shadow-xl text-left">
        <button
          onClick={() => setShowLayerGuide(!showLayerGuide)}
          className="w-full flex items-center justify-between text-zinc-200 font-bold text-xs sm:text-sm hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Xem Cẩm Nang Cấu Trúc & Ý Nghĩa 15 Tầng La Kinh Phong Thủy Bậc Thầy</span>
          </div>
          {showLayerGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showLayerGuide && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300 border-t border-zinc-800/80 pt-3">
            <div className="space-y-2">
              <p><strong>Tầng 1 (360° Châu Thiên):</strong> Vạch chia từng độ số thiên văn chuẩn xác 0° - 360°.</p>
              <p><strong>Tầng 2 (28 Tinh Túc):</strong> Nhị Thập Bát Tú phân theo Tứ Tượng (Thanh Long, Huyền Vũ, Bạch Hổ, Chu Tước).</p>
              <p><strong>Tầng 3 & 4 (64 Quẻ Đại Quái):</strong> 64 Quẻ Tiên Thiên Kinh Dịch, Quái Vận (1-9) và Quái Số Ngũ Hành (1-9).</p>
              <p><strong>Tầng 5 (120 Phân Kim):</strong> Mỗi sơn chia 5 phân kim. Nổi bật tuyến Bính & Canh Châu Bảo Cát, tránh tuyến Mậu Kỷ Cô Hư.</p>
              <p><strong>Tầng 6 (72 Xuyên Sơn Long):</strong> Mỗi sơn 3 long (5°/long). Định khí mạch lai long nhập trạch.</p>
              <p><strong>Tầng 7 (60 Thấu Địa Long):</strong> 60 Long Giáp Tý (6°/long) dẫn long mạch móng nền.</p>
              <p><strong>Tầng 8 (Thiên Bàn Phùng Châm):</strong> Lệch tiến +7.5° nạp thủy, phân Tam Hợp Cục & cảnh báo Hoàng Tuyền sát.</p>
            </div>
            <div className="space-y-2">
              <p><strong>Tầng 9 (Nhân Bàn Trung Châm):</strong> Lệch lùi -7.5° tiêu sa, định ngũ hành sa gò đồi nhà cao xung quanh.</p>
              <p><strong>Tầng 10 (Địa Bàn Chính Châm 24 Sơn):</strong> Tầng cốt lõi la kinh chuẩn 360°, 12 Chi, 8 Can, 4 Quái.</p>
              <p><strong>Tầng 11 (24 Vị Thần Phúc Đức):</strong> Định cát hung vị trí mở cổng ngõ, cửa chính và bàn thờ.</p>
              <p><strong>Tầng 12 (Hậu Thiên Bát Quái & Du Niên):</strong> 8 cung Sinh Khí, Diên Niên, Thiên Y, Phục Vị... theo tuổi gia chủ.</p>
              <p><strong>Tầng 13 (Tiên Thiên Bát Quái):</strong> Vạch quẻ Tiên Thiên Càn Khôn Ly Khảm Đoài Chấn Tốn Cấn.</p>
              <p><strong>Tầng 14 (Cửu Cung Lạc Thư):</strong> Tinh bàn sao 1 đến 9 Vận 9 Đương Thời.</p>
              <p><strong>Tầng 15 (Thiên Trì Trung Tâm):</strong> Hồ trời với Thái Cực Âm Dương và Kim Từ Tính Phong Thủy cực nhạy.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
