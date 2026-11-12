import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Mountain24, ChartAnalysis, BatTrachAnalysis, CompassType } from '../types/fengshui';
import { MOUNTAINS_24 } from '../utils/fengshuiConstants';
import { normalizeDegree } from '../utils/xuanKongCalculator';
import {
  COMPASS_RULERS_LIST,
  TIEU_SA_ELEMENTS,
  getSaRelation,
  SONG_SON_MAP,
  HOANG_TUYEN_RULES,
  getPhucDucStarForMountain,
  DAI_QUAI_64,
  DAI_QUAI_VIETNAMESE_NAMES,
  getDaiQuaiByDegree,
  isDaiQuaiGood,
  evaluateDaiQuaiHKDQ,
  XUYEN_SON_72,
  THAU_DIA_60,
  PHAN_KIM_120,
} from '../utils/luopanRulersData';
import { CompassSelectorModal } from './CompassSelectorModal';
import { LuBanRulerModal } from './LuBanRulerModal';
import { CompassInfoPanel } from './CompassInfoPanel';
import {
  Upload,
  RotateCw,
  RotateCcw,
  Lock,
  Unlock,
  Crosshair,
  Compass,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  Grid,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Trash2,
  Sliders,
  Type,
  Link,
  Unlink,
  Sparkles,
  Ruler,
  Move,
  Hand,
  Target,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface FloorPlanOverlayCanvasProps {
  facingDegree: number;
  onDegreeChange: (deg: number) => void;
  analysis: ChartAnalysis;
  batTrachAnalysis?: BatTrachAnalysis;
  compassType?: CompassType;
  onSelectCompassType?: (type: CompassType) => void;
}

type InteractionMode = 'drag_luopan' | 'pan_canvas' | 'set_center' | 'align_direction';
type ViewOverlayMode = 'both' | 'luopan' | 'nine_palace';

// Helper to compute 3x3 grid layout with Facing Palace at Top Center
const getFacingUpGrid = (facingPalaceNum: number) => {
  const ring = [1, 8, 3, 4, 9, 2, 7, 6];
  const idx = ring.indexOf(facingPalaceNum);
  const getP = (offset: number) => ring[(idx + offset + 8) % 8];

  return [
    [getP(7), getP(0), getP(1)],
    [getP(6), 5, getP(2)],
    [getP(5), getP(4), getP(3)],
  ];
};

export const FloorPlanOverlayCanvas: React.FC<FloorPlanOverlayCanvasProps> = ({
  facingDegree,
  onDegreeChange,
  analysis,
  batTrachAnalysis,
  compassType,
  onSelectCompassType,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compass Ruler state & modals
  const [internalCompass, setInternalCompass] = useState<CompassType>(compassType || 'tonghop');
  const activeCompass = compassType || internalCompass;
  const setActiveCompass = (t: CompassType) => {
    setInternalCompass(t);
    onSelectCompassType?.(t);
    if (t === 'loban') {
      setIsLuBanModalOpen(true);
    }
  };
  const [isCompassModalOpen, setIsCompassModalOpen] = useState<boolean>(false);
  const [isLuBanModalOpen, setIsLuBanModalOpen] = useState<boolean>(false);

  // Loaded floor plan image object
  const [floorPlanImg, setFloorPlanImg] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string>('');

  // Transformations for image & canvas
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [centerPoint, setCenterPoint] = useState<{ x: number; y: number }>({ x: 450, y: 350 });

  // Luopan visual settings & ROTATION
  const [luopanRadius, setLuopanRadius] = useState<number>(320);
  const [luopanRotateWithFacing, setLuopanRotateWithFacing] = useState<boolean>(true);
  const [luopanRotationOffset, setLuopanRotationOffset] = useState<number>(0);
  const [showBatTrachOnLuopan, setShowBatTrachOnLuopan] = useState<boolean>(true);

  // Common overlay settings
  const [opacity, setOpacity] = useState<number>(0.65);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewOverlay, setViewOverlay] = useState<ViewOverlayMode>('both');
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('drag_luopan');
  const [dragTarget, setDragTarget] = useState<'luopan' | 'canvas' | null>(null);
  const [nudgeStep, setNudgeStep] = useState<number>(2);

  // Cửu Cung Rotation & Sizing settings
  const [gridWidth, setGridWidth] = useState<number>(460);
  const [gridHeight, setGridHeight] = useState<number>(460);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [autoRotateWithFacing, setAutoRotateWithFacing] = useState<boolean>(true);
  const [gridRotationOffset, setGridRotationOffset] = useState<number>(0);
  const [keepTextUpright, setKeepTextUpright] = useState<boolean>(true);
  const [showBatTrachOnGrid, setShowBatTrachOnGrid] = useState<boolean>(true);

  // 2-Point auto alignment states
  const [alignPoint1, setAlignPoint1] = useState<{ x: number; y: number } | null>(null);
  const [alignHelperMsg, setAlignHelperMsg] = useState<string>('Bạn có thể kéo trực tiếp đĩa La Kinh để đặt vào tâm nhà, hoặc dùng phím mũi tên [↑][↓][←][→] để dịch từng pixel!');

  // Dragging states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keyboard navigation for pixel-perfect nudging of Luopan center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (isLocked) return;

      const step = e.shiftKey ? 10 : nudgeStep;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCenterPoint((prev) => ({ ...prev, y: Math.round(prev.y - step) }));
        setAlignHelperMsg(`Đã dịch tâm La Kinh lên ${step}px: (${Math.round(centerPoint.x)}, ${Math.round(centerPoint.y - step)})`);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCenterPoint((prev) => ({ ...prev, y: Math.round(prev.y + step) }));
        setAlignHelperMsg(`Đã dịch tâm La Kinh xuống ${step}px: (${Math.round(centerPoint.x)}, ${Math.round(centerPoint.y + step)})`);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCenterPoint((prev) => ({ ...prev, x: Math.round(prev.x - step) }));
        setAlignHelperMsg(`Đã dịch tâm La Kinh sang trái ${step}px: (${Math.round(centerPoint.x - step)}, ${Math.round(centerPoint.y)})`);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCenterPoint((prev) => ({ ...prev, x: Math.round(prev.x + step) }));
        setAlignHelperMsg(`Đã dịch tâm La Kinh sang phải ${step}px: (${Math.round(centerPoint.x + step)}, ${Math.round(centerPoint.y)})`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, nudgeStep, centerPoint]);

  // Canvas size
  const [canvasDim, setCanvasDim] = useState<{ width: number; height: number }>({
    width: 900,
    height: 700,
  });

  // Update canvas container dimensions on resize (Hỗ trợ toàn màn hình rộng rãi)
  useEffect(() => {
    const updateDimensions = () => {
      if (isFullscreen) {
        setCanvasDim({
          width: window.innerWidth,
          height: Math.max(window.innerHeight - 80, 520),
        });
      } else if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const isMobile = window.innerWidth < 640;
        const h = isMobile
          ? Math.max(Math.min(w * 0.95, 620), 450)
          : Math.max(Math.min(w * 0.78, 800), 520);
        setCanvasDim({ width: w, height: h });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  // Handle User File Upload
  const processImageFile = (file: File) => {
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        setFloorPlanImg(img);
        setPanOffset({ x: 0, y: 0 });
        setZoomScale(1);
        setCenterPoint({ x: canvasDim.width / 2, y: canvasDim.height / 2 });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const removeImage = () => {
    setFloorPlanImg(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Main Drawing Engine
  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const { width, height } = canvasDim;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. DRAW FLOOR PLAN IMAGE (BACKGROUND LAYER)
    ctx.save();
    if (floorPlanImg) {
      const imgW = floorPlanImg.width;
      const imgH = floorPlanImg.height;

      const scaleFit = Math.min((width * 0.95) / imgW, (height * 0.95) / imgH);
      const drawW = imgW * scaleFit * zoomScale;
      const drawH = imgH * scaleFit * zoomScale;

      const drawX = (width - drawW) / 2 + panOffset.x;
      const drawY = (height - drawH) / 2 + panOffset.y;

      ctx.drawImage(floorPlanImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
    }
    ctx.restore();

    // The center point of the house / Luopan
    const cx = centerPoint.x;
    const cy = centerPoint.y;

    // 2. DRAW TRANSPARENT OVERLAYS
    // A. LA KINH 24 SƠN HƯỚNG TRONG SUỐT (TỰ ĐỘNG XOAY THEO HƯỚNG NHÀ)
    if (viewOverlay === 'both' || viewOverlay === 'luopan') {
      ctx.save();
      // Giữ chữ và số luôn sắc nét rõ ràng 100%, không làm mờ chữ và số
      ctx.translate(cx, cy);

      // Rotate Luopan dial according to House Facing Direction
      // When luopanRotateWithFacing is true: dial rotates by (-facingDegree) so that the Facing Mountain
      // is oriented towards the TOP (Mặt tiền / 12 o'clock)!
      const effectiveLuopanRotDeg = luopanRotateWithFacing
        ? normalizeDegree(-facingDegree + luopanRotationOffset)
        : normalizeDegree(luopanRotationOffset);
      const luopanRotRad = (effectiveLuopanRotDeg * Math.PI) / 180;
      ctx.rotate(luopanRotRad);

      const rOuter = Math.max(70, luopanRadius);
      const rScale = rOuter / 180;
      const rDegreeRing = rOuter * 0.94;
      const rRing1 = rOuter * 0.81;
      const rRing2 = rOuter * 0.64;
      const rRing3 = rOuter * 0.47;
      const rInnerCenter = Math.max(20, rOuter * 0.22);

      // Outer rim circle
      ctx.beginPath();
      ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(opacity * 0.25, 0.4)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.25, 0.9)})`;
      ctx.lineWidth = Math.max(1.5, 2.5 * rScale);
      ctx.stroke();

      // Degree Tick Marks (360 degrees)
      for (let deg = 0; deg < 360; deg++) {
        const rad = ((deg - 90) * Math.PI) / 180;
        const isMajor = deg % 10 === 0;
        const isMedium = deg % 5 === 0 && !isMajor;
        const tickLen = (isMajor ? 10 : isMedium ? 6 : 3) * rScale;

        const x1 = Math.cos(rad) * rDegreeRing;
        const y1 = Math.sin(rad) * rDegreeRing;
        const x2 = Math.cos(rad) * (rDegreeRing - tickLen);
        const y2 = Math.sin(rad) * (rDegreeRing - tickLen);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isMajor ? 'rgba(0,0,0,0.85)' : 'rgba(71,85,105,0.7)';
        ctx.lineWidth = isMajor ? Math.max(1, 1.5 * rScale) : Math.max(0.6, 0.8 * rScale);
        ctx.stroke();

        // Degree numbers every 10° - Chữ số nhỏ gọn thanh thoát, rõ nét
        if (deg % 10 === 0) {
          ctx.save();
          const tr = rDegreeRing - 14 * rScale;
          const tx = Math.cos(rad) * tr;
          const ty = Math.sin(rad) * tr;
          ctx.translate(tx, ty);
          ctx.rotate(rad + Math.PI / 2);
          ctx.font = `bold ${Math.max(5.5, 6.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = deg === 0 ? '#dc2626' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${deg}`, 0, 0);
          ctx.restore();
        }
      }

      const tuChanhNames = ['MÃO', 'NGỌ', 'DẬU', 'TÝ', 'Mão', 'Ngọ', 'Dậu', 'Tý'];
      const sittingM = analysis.sittingMountain;
      const facingM = analysis.facingMountain;

      // ========================================================
      // HELPER: VẼ VÒNG BÁT TRẠCH 8 CUNG DU NIÊN (Theo Quái Mệnh Gia Chủ)
      // ========================================================
      const drawBatTrach8Ring = (rOut: number, rIn: number) => {
        if (!batTrachAnalysis) return;
        const trigrams8 = [
          { name: 'Khảm', pNum: 1, centerDeg: 0 },
          { name: 'Cấn', pNum: 8, centerDeg: 45 },
          { name: 'Chấn', pNum: 3, centerDeg: 90 },
          { name: 'Tốn', pNum: 4, centerDeg: 135 },
          { name: 'Ly', pNum: 9, centerDeg: 180 },
          { name: 'Khôn', pNum: 2, centerDeg: 225 },
          { name: 'Đoài', pNum: 7, centerDeg: 270 },
          { name: 'Càn', pNum: 6, centerDeg: 315 },
        ];

        trigrams8.forEach((t) => {
          const sRad = ((t.centerDeg - 22.5 - 90) * Math.PI) / 180;
          const eRad = ((t.centerDeg + 22.5 - 90) * Math.PI) / 180;
          const mRad = ((t.centerDeg - 90) * Math.PI) / 180;
          const pData = batTrachAnalysis.palaces[t.pNum];
          const star = pData?.ownerStar || pData?.houseStar;

          ctx.beginPath();
          ctx.arc(0, 0, rOut, sRad, eRad);
          ctx.arc(0, 0, rIn, eRad, sRad, true);
          ctx.closePath();
          ctx.fillStyle = star?.isGood
            ? `rgba(16, 185, 129, ${opacity * 0.42})`
            : `rgba(239, 68, 68, ${opacity * 0.42})`;
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.save();
          const btTr = (rOut + rIn) / 2;
          ctx.translate(Math.cos(mRad) * btTr, Math.sin(mRad) * btTr);
          ctx.rotate(mRad + Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Dòng 1: Tên Quái (Khảm, Cấn, Ly...), Dòng 2: Sao Bát Trạch (Sinh Khí, Tuyệt Mệnh...)
          const fQuai = Math.max(5.0, 5.6 * rScale);
          const fStar = Math.max(5.2, 6.0 * rScale);
          ctx.font = `bold ${fQuai}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.fillText(t.name, 0, -3.0 * rScale);

          if (star) {
            ctx.font = `bold ${fStar}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillStyle = star.isGood ? '#064e3b' : '#7f1d1d';
            ctx.fillText(star.name, 0, 3.5 * rScale);
          }
          ctx.restore();
        });
      };

      // ========================================================
      // MODE 1: BÁT TRẠCH (Bát Trạch 8 Cung & 24 Sơn Phúc Đức)
      // ========================================================
      if (activeCompass === 'battrach') {
        // Ring 1: 24 Sơn Địa Bàn
        MOUNTAINS_24.forEach((m, idx) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = tuChanhNames.includes(m.name)
            ? `rgba(244, 63, 94, ${opacity * 0.28})`
            : idx % 2 === 0
            ? `rgba(224, 231, 255, ${opacity * 0.22})`
            : `rgba(248, 250, 252, ${opacity * 0.12})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.15, 0.85)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // 24 Mountain Label - Chữ nhỏ gọn, sắc nét
          ctx.save();
          const tr = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr, Math.sin(midRad) * tr);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = tuChanhNames.includes(m.name) ? '#be123c' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();

          // Ring 2: 24 Sơn Phúc Đức (Khởi từ Tọa Trạch)
          const pStar = getPhucDucStarForMountain(sittingM.trigram, m.name);
          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = pStar.isGood
            ? `rgba(16, 185, 129, ${opacity * 0.35})`
            : `rgba(239, 68, 68, ${opacity * 0.35})`;
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.save();
          const pTr = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * pTr, Math.sin(midRad) * pTr);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = pStar.isGood ? '#064e3b' : '#991b1b';

          // Tách tên 2 chữ thành 2 dòng chữ nhỏ gọn gàng để tuyệt đối không tràn sang sơn bên cạnh
          const pParts = pStar.name.split(' ');
          if (pParts.length > 1) {
            const fSize = Math.max(4.8, 5.5 * rScale);
            ctx.font = `bold ${fSize}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(pParts[0], 0, -fSize * 0.55);
            ctx.fillText(pParts[1], 0, fSize * 0.55);
          } else {
            const fSize = Math.max(5.2, 6.0 * rScale);
            ctx.font = `bold ${fSize}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(pStar.name, 0, 0);
          }
          ctx.restore();
        });

        // Ring 3: 8 Cung Du Niên Bát Trạch (Chỉ hiển thị khi nút Vòng Bát Trạch BẬT)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 2: TIÊU SA 24 SƠN (ĐỒNG BỘ 100% CÙNG CUNG 24 SƠN ĐỊA BÀN - KHÔNG BỊ LỆCH)
      // ========================================================
      else if (activeCompass === 'tieusa') {
        const sittingSaEl = TIEU_SA_ELEMENTS[sittingM.name] || 'Hỏa';

        // Ring 1: 24 Sơn Địa Bàn Chính Châm
        MOUNTAINS_24.forEach((m, idx) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = tuChanhNames.includes(m.name)
            ? `rgba(244, 63, 94, ${opacity * 0.28})`
            : idx % 2 === 0
            ? `rgba(224, 231, 255, ${opacity * 0.22})`
            : `rgba(248, 250, 252, ${opacity * 0.12})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.15, 0.85)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = tuChanhNames.includes(m.name) ? '#be123c' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();
        });

        // Ring 2: Tiêu Sa 24 Sơn (Gọn gàng trong tầng rRing2 -> rRing3, đồng bộ 100% 24 Sơn)
        MOUNTAINS_24.forEach((m) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          const saEl = TIEU_SA_ELEMENTS[m.name] || 'Hỏa';
          const rel = getSaRelation(sittingSaEl, saEl);

          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();
          if (rel.relationName === 'Sinh Sa') {
            ctx.fillStyle = `rgba(5, 150, 105, ${opacity * 0.55})`;
          } else if (rel.relationName === 'Vượng Sa') {
            ctx.fillStyle = `rgba(16, 185, 129, ${opacity * 0.5})`;
          } else if (rel.relationName === 'Nô Sa') {
            ctx.fillStyle = `rgba(37, 99, 235, ${opacity * 0.45})`;
          } else if (rel.relationName === 'Sát Sa') {
            ctx.fillStyle = `rgba(220, 38, 38, ${opacity * 0.55})`;
          } else {
            ctx.fillStyle = `rgba(234, 88, 12, ${opacity * 0.45})`;
          }
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.save();
          const tr2 = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * tr2, Math.sin(midRad) * tr2);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Dòng 1: Sơn Tiêu Sa + Ngũ Hành; Dòng 2: Loại Sa (VỪA VẶN, NHỎ GỌN)
          const fS1 = Math.max(4.2, 4.8 * rScale);
          ctx.font = `bold ${fS1}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.fillText(`${m.name}(${saEl[0]})`, 0, -2.4 * rScale);

          const fS2 = Math.max(4.0, 4.6 * rScale);
          ctx.font = `bold ${fS2}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = rel.isGood ? '#064e3b' : '#7f1d1d';
          ctx.fillText(rel.relationName.split(' ')[0], 0, 2.4 * rScale);
          ctx.restore();
        });

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 3: NẠP THỦY (Song Sơn Cục & Hoàng Tuyền - ĐỒNG BỘ 100% CÙNG CUNG 24 SƠN ĐỊA BÀN)
      // ========================================================
      else if (activeCompass === 'napthuy') {
        const hoangTuyenRule = HOANG_TUYEN_RULES[facingM.name];

        // Ring 1: 24 Sơn Địa Bàn Chính Châm
        MOUNTAINS_24.forEach((m, idx) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = tuChanhNames.includes(m.name)
            ? `rgba(244, 63, 94, ${opacity * 0.28})`
            : idx % 2 === 0
            ? `rgba(224, 231, 255, ${opacity * 0.22})`
            : `rgba(248, 250, 252, ${opacity * 0.12})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.15, 0.85)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = tuChanhNames.includes(m.name) ? '#be123c' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();
        });

        // Ring 2: Nạp Thủy Song Sơn Cục & Hoàng Tuyền (rRing2 -> rRing3, Khớp chuẩn 1:1 với 24 Sơn)
        MOUNTAINS_24.forEach((m) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          const songSon = SONG_SON_MAP[m.name];
          const isHoangTuyen = hoangTuyenRule?.hoangTuyenSons.includes(m.name);

          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = isHoangTuyen
            ? `rgba(220, 38, 38, ${opacity * 0.55})`
            : `rgba(6, 182, 212, ${opacity * 0.35})`;
          ctx.fill();
          ctx.strokeStyle = isHoangTuyen ? '#991b1b' : '#0f172a';
          ctx.lineWidth = isHoangTuyen ? 1.5 : 0.8;
          ctx.stroke();

          ctx.save();
          const tr2 = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * tr2, Math.sin(midRad) * tr2);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Dòng 1: Tên Sơn Nạp Thủy; Dòng 2: Song Sơn Cục hoặc Hoàng Tuyền (VỪA VẶN, GỌN GÀNG)
          const fS1 = Math.max(4.2, 4.8 * rScale);
          ctx.font = `bold ${fS1}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = isHoangTuyen ? '#7f1d1d' : '#0f172a';
          ctx.fillText(m.name.toUpperCase(), 0, -2.4 * rScale);

          ctx.fillText(isHoangTuyen ? 'H.Tuyền' : (songSon ? songSon.cuc : 'Cục'), 0, 2.4 * rScale);
          ctx.restore();
        });

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 4: HUYỀN KHÔNG ĐẠI QUÁI (64 Quẻ Tiên Thiên - VỪA VẶN, GỌN GÀNG)
      // ========================================================
      else if (activeCompass === 'daiquai') {
        // Ring 1: 24 Sơn Địa Bàn Chính Châm
        MOUNTAINS_24.forEach((m, idx) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = tuChanhNames.includes(m.name)
            ? `rgba(244, 63, 94, ${opacity * 0.28})`
            : idx % 2 === 0
            ? `rgba(224, 231, 255, ${opacity * 0.22})`
            : `rgba(248, 250, 252, ${opacity * 0.12})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.15, 0.85)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = tuChanhNames.includes(m.name) ? '#be123c' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();
        });

        // Ring 2: 64 Quẻ Tiên Thiên & Bộ Số Huyền Không Đại Quái (Quái Vận · Quái Khí)
        // Vành khăn rRing2 -> rRing3 được phân định làm 2 tầng con chuẩn La Kinh thực tế:
        // - Tầng ngoài (rRing2 -> rMidHex): Tên 64 Quẻ Tiên Thiên (Cát chữ Đỏ, Hung chữ Đen)
        // - Tầng trong (rMidHex -> rRing3): Bộ Số Quái Vận & Quái Khí (ví dụ: 8·1, 9·9, 1·1) - Không ẩn đi, thuận tiện tra cứu
        const hexSpanDeg = 360 / 64; // 5.625°
        const sittingDegree = (facingDegree + 180) % 360;
        const currentPeriod = analysis.period || 9;
        const sittingHex = getDaiQuaiByDegree(sittingDegree, null, currentPeriod, 'hkdq');
        const rMidHex = (rRing2 + rRing3) / 2; // Đường tròn phân cách Tên Quẻ và Bộ Số

        DAI_QUAI_64.forEach((hex) => {
          const startRad = ((hex.centerDeg - hexSpanDeg / 2 - 90) * Math.PI) / 180;
          const endRad = ((hex.centerDeg + hexSpanDeg / 2 - 90) * Math.PI) / 180;
          const midRad = ((hex.centerDeg - 90) * Math.PI) / 180;

          const diffF = Math.abs((((facingDegree - hex.centerDeg) % 360) + 540) % 360 - 180);
          const diffS = Math.abs((((sittingDegree - hex.centerDeg) % 360) + 540) % 360 - 180);
          const isFacingHex = diffF < hexSpanDeg / 2;
          const isSittingHex = diffS < hexSpanDeg / 2;

          const evalResult = evaluateDaiQuaiHKDQ(hex, sittingHex, currentPeriod);
          const isGood = evalResult.isGood;

          // 1. Ô Tầng Ngoài: Chứa Tên Quẻ
          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rMidHex, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = isFacingHex
            ? `rgba(239, 68, 68, ${opacity * 0.45})`
            : isSittingHex
            ? `rgba(59, 130, 246, ${opacity * 0.45})`
            : isGood
            ? `rgba(254, 242, 242, ${opacity * 0.55})`
            : `rgba(244, 244, 245, ${opacity * 0.35})`;
          ctx.fill();
          ctx.strokeStyle = isFacingHex ? '#dc2626' : isSittingHex ? '#2563eb' : isGood ? '#fca5a5' : '#94a3b8';
          ctx.lineWidth = (isFacingHex || isSittingHex) ? 1.2 : 0.6;
          ctx.stroke();

          // 2. Ô Tầng Trong: Chứa Bộ Số Quái Vận & Quái Khí (Hiển thị thường trực, không ẩn)
          ctx.beginPath();
          ctx.arc(0, 0, rMidHex, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = isFacingHex
            ? `rgba(239, 68, 68, ${opacity * 0.35})`
            : isSittingHex
            ? `rgba(59, 130, 246, ${opacity * 0.35})`
            : isGood
            ? `rgba(254, 226, 226, ${opacity * 0.65})` // Nền hồng ấm nổi bật cho quẻ Cát
            : `rgba(228, 228, 231, ${opacity * 0.45})`; // Nền xám cho quẻ Hung
          ctx.fill();
          ctx.strokeStyle = isFacingHex ? '#dc2626' : isSittingHex ? '#2563eb' : isGood ? '#fca5a5' : '#94a3b8';
          ctx.lineWidth = (isFacingHex || isSittingHex) ? 1.2 : 0.6;
          ctx.stroke();

          const vnName = DAI_QUAI_VIETNAMESE_NAMES[hex.id] || hex.name;

          // VẼ TÊN QUẺ Ở TẦNG NGOÀI (Chữ Đỏ cho quẻ Cát, Chữ Đen cho quẻ Hung)
          ctx.save();
          const trOuter = (rRing2 + rMidHex) / 2;
          ctx.translate(Math.cos(midRad) * trOuter, Math.sin(midRad) * trOuter);
          ctx.rotate(midRad); // Xoay dọc nan hoa (radial)
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isGood ? '#dc2626' : '#0f172a';

          if (vnName.includes(' ')) {
            const parts = vnName.split(' ');
            ctx.font = `bold ${Math.max(3.6, 4.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(parts[0], 0, -2.0 * rScale);
            ctx.fillText(parts[1], 0, 2.0 * rScale);
          } else {
            ctx.font = `bold ${Math.max(4.0, 4.6 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(vnName, 0, 0);
          }
          ctx.restore();

          // VẼ BỘ SỐ Ở TẦNG TRONG (Quái Vận · Quái Khí)
          // Yêu cầu: Quái Vận màu XANH ĐẬM DA TRỜI (#0284c7), Quái Khí giữ nguyên màu gốc (Cát: Đỏ #dc2626, Hung/Thường: #0f172a)
          ctx.save();
          const trInner = (rMidHex + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * trInner, Math.sin(midRad) * trInner);
          ctx.rotate(midRad); // Xoay dọc nan hoa (radial) thẳng hàng tuyệt đối với tên quẻ
          ctx.textBaseline = 'middle';

          const fontSize = Math.max(4.0, 4.8 * rScale);
          ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", sans-serif`;

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

          // Dấu chấm phân cách
          ctx.fillStyle = isGood ? '#dc2626' : '#64748b';
          ctx.fillText(dotStr, startX + wVan, 0);

          // 2. Quái Khí: Giữ nguyên màu gốc (Cát: Đỏ #dc2626, Hung/Thường: #0f172a)
          ctx.fillStyle = isGood ? '#dc2626' : '#0f172a';
          ctx.fillText(khiStr, startX + wVan + wDot, 0);
          ctx.restore();
        });

        // Vòng tròn phân cách sắc sảo giữa Tên Quẻ và Bộ Số
        ctx.beginPath();
        ctx.arc(0, 0, rMidHex, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.15, 0.75)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 5: 72 XUYÊN SƠN LONG (Thất Thập Nhị Long - VỪA VẶN, GỌN GÀNG)
      // ========================================================
      else if (activeCompass === 'xuyenson') {
        // Ring 1: 24 Sơn Địa Bàn
        MOUNTAINS_24.forEach((m) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = `rgba(241, 245, 249, ${opacity * 0.25})`;
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();
        });

        // Ring 2: 72 Xuyên Sơn Long (rRing2 -> rRing3, mỗi long 5° - VỪA VẶN KHÔNG TRÀN Ô)
        XUYEN_SON_72.forEach((long) => {
          const startRad = ((long.centerDeg - 2.5 - 90) * Math.PI) / 180;
          const endRad = ((long.centerDeg + 2.5 - 90) * Math.PI) / 180;
          const midRad = ((long.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();

          ctx.fillStyle = long.isGood
            ? `rgba(16, 185, 129, ${opacity * 0.5})`
            : long.type.includes('Không Vong')
            ? `rgba(239, 68, 68, ${opacity * 0.5})`
            : `rgba(245, 158, 11, ${opacity * 0.4})`;
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.6;
          ctx.stroke();

          ctx.save();
          const tr2 = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * tr2, Math.sin(midRad) * tr2);
          ctx.rotate(midRad); // Xoay dọc nan hoa (hướng tâm), chữ chạy dọc thanh thoát không bao giờ tràn ô 5°
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (long.isGood) {
            const parts = long.name.split(' ');
            const shortName = parts.length > 1 ? `${parts[0][0]}.${parts[1]}` : long.name;
            ctx.font = `bold ${Math.max(4.0, 4.6 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillStyle = '#022c22';
            ctx.fillText(shortName, 0, 0);
          } else {
            ctx.font = `bold ${Math.max(3.8, 4.2 * rScale)}px sans-serif`;
            ctx.fillStyle = long.type.includes('Không Vong') ? '#b91c1c' : '#475569';
            ctx.fillText(long.type.includes('Không Vong') ? 'KV' : '·', 0, 0);
          }
          ctx.restore();
        });

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 6: 60 THẤU ĐỊA LONG (Lục Thập Long - VỪA VẶN, GỌN GÀNG)
      // ========================================================
      else if (activeCompass === 'thaudia') {
        // Ring 1: 24 Sơn Địa Bàn
        MOUNTAINS_24.forEach((m) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = `rgba(241, 245, 249, ${opacity * 0.25})`;
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();
        });

        // Ring 2: 60 Thấu Địa Long (rRing2 -> rRing3, mỗi long 6° - VỪA VẶN)
        THAU_DIA_60.forEach((long) => {
          const startRad = ((long.centerDeg - 3 - 90) * Math.PI) / 180;
          const endRad = ((long.centerDeg + 3 - 90) * Math.PI) / 180;
          const midRad = ((long.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = long.isGood
            ? `rgba(20, 184, 166, ${opacity * 0.5})`
            : `rgba(239, 68, 68, ${opacity * 0.45})`;
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.6;
          ctx.stroke();

          ctx.save();
          const tr2 = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * tr2, Math.sin(midRad) * tr2);
          ctx.rotate(midRad); // Xoay dọc nan hoa, chữ chạy dọc thanh thoát không bao giờ tràn ô 6°
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (long.isGood) {
            const parts = long.name.split(' ');
            const shortName = parts.length > 1 ? `${parts[0][0]}.${parts[1]}` : long.name;
            ctx.font = `bold ${Math.max(4.0, 4.6 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillStyle = '#042f2e';
            ctx.fillText(shortName, 0, 0);
          } else {
            ctx.font = `bold ${Math.max(3.8, 4.2 * rScale)}px sans-serif`;
            ctx.fillStyle = long.rating.includes('Đại Hung') ? '#b91c1c' : '#475569';
            ctx.fillText(long.rating.includes('Đại Hung') ? 'H' : '·', 0, 0);
          }
          ctx.restore();
        });

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 7: 120 PHÂN KIM (VỪA VẶN, GỌN GÀNG)
      // ========================================================
      else if (activeCompass === 'phankim120') {
        // Ring 1: 24 Sơn Địa Bàn
        MOUNTAINS_24.forEach((m) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = `rgba(241, 245, 249, ${opacity * 0.25})`;
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();
        });

        // Ring 2: 120 Phân Kim (rRing2 -> rRing3, 3° mỗi phân kim - GỌN GÀNG LỌT Ô)
        PHAN_KIM_120.forEach((pk) => {
          const startRad = ((pk.centerDeg - 1.5 - 90) * Math.PI) / 180;
          const endRad = ((pk.centerDeg + 1.5 - 90) * Math.PI) / 180;
          const midRad = ((pk.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();

          ctx.fillStyle = pk.isChauBao
            ? `rgba(245, 158, 11, ${opacity * 0.65})`
            : `rgba(241, 245, 249, ${opacity * 0.2})`;
          ctx.fill();
          ctx.strokeStyle = pk.isChauBao ? '#b45309' : '#475569';
          ctx.lineWidth = pk.isChauBao ? 1 : 0.4;
          ctx.stroke();

          ctx.save();
          const tr2 = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * tr2, Math.sin(midRad) * tr2);
          ctx.rotate(midRad); // Xoay dọc nan hoa (radial)
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (pk.isChauBao) {
            const letter = pk.phanKimName.includes('Bính') ? 'B' : 'C';
            ctx.font = `bold ${Math.max(4.2, 4.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillStyle = '#451a03';
            ctx.fillText(letter, 0, 0);
          } else {
            ctx.font = `bold ${Math.max(3.5, 4.0 * rScale)}px sans-serif`;
            ctx.fillStyle = '#64748b';
            ctx.fillText('·', 0, 0);
          }
          ctx.restore();
        });

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 8: 24 VỊ PHÚC ĐỨC
      // ========================================================
      else if (activeCompass === 'phucduc24') {
        MOUNTAINS_24.forEach((m) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          const pStar = getPhucDucStarForMountain(sittingM.trigram, m.name);

          // Ring 1: Sơn 24
          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = `rgba(241, 245, 249, ${opacity * 0.25})`;
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.5 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();

          // Ring 2: Tên Phúc Đức Cát / Hung (rRing2 -> rRing3)
          ctx.beginPath();
          ctx.arc(0, 0, rRing2, startRad, endRad);
          ctx.arc(0, 0, rRing3, endRad, startRad, true);
          ctx.closePath();
          ctx.fillStyle = pStar.isGood
            ? `rgba(16, 185, 129, ${opacity * 0.45})`
            : `rgba(239, 68, 68, ${opacity * 0.45})`;
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.save();
          const tr2 = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(midRad) * tr2, Math.sin(midRad) * tr2);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = pStar.isGood ? '#064e3b' : '#7f1d1d';

          const pParts = pStar.name.split(' ');
          if (pParts.length > 1) {
            const fSize = Math.max(4.6, 5.2 * rScale);
            ctx.font = `bold ${fSize}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(pParts[0], 0, -fSize * 0.55);
            ctx.fillText(pParts[1], 0, fSize * 0.55);
          } else {
            ctx.font = `bold ${Math.max(4.8, 5.6 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillText(pStar.name, 0, 0);
          }
          ctx.restore();
        });

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 10: HUYỀN KHÔNG PHI TINH & ĐỊNH VỊ THÀNH MÔN
      // ========================================================
      else if (activeCompass === 'huyenkhong') {
        const tm = analysis.thanhMon;
        const chinhMountainName = tm?.chinhThanhMon.mountain.name;
        const phuMountainName = tm?.phuThanhMon.mountain.name;

        // Ring 1: 24 Sơn Địa Bàn với điểm sáng vị trí Thành Môn
        MOUNTAINS_24.forEach((m) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          const isFacing = m.name === facingM.name;
          const isSitting = m.name === sittingM.name;
          const isChinhTM = m.name === chinhMountainName;
          const isPhuTM = m.name === phuMountainName;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();

          if (isChinhTM) {
            ctx.fillStyle = tm?.chinhThanhMon.isUsable
              ? `rgba(16, 185, 129, ${opacity * 0.65})` // Green for Usable Chân Thành Môn
              : `rgba(245, 158, 11, ${opacity * 0.45})`;
          } else if (isPhuTM) {
            ctx.fillStyle = tm?.phuThanhMon.isUsable
              ? `rgba(5, 150, 105, ${opacity * 0.55})`
              : `rgba(217, 119, 6, ${opacity * 0.4})`;
          } else if (isFacing) {
            ctx.fillStyle = `rgba(239, 68, 68, ${opacity * 0.55})`;
          } else if (isSitting) {
            ctx.fillStyle = `rgba(37, 99, 235, ${opacity * 0.55})`;
          } else {
            ctx.fillStyle = `rgba(241, 245, 249, ${opacity * 0.18})`;
          }
          ctx.fill();

          ctx.strokeStyle = (isChinhTM || isPhuTM) ? '#059669' : '#334155';
          ctx.lineWidth = (isChinhTM || isPhuTM) ? 1.5 : 0.8;
          ctx.stroke();

          ctx.save();
          const tr1 = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * tr1, Math.sin(midRad) * tr1);
          ctx.rotate(midRad + Math.PI / 2);
          ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = (isFacing || isSitting || isChinhTM || isPhuTM) ? '#ffffff' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.name.toUpperCase(), 0, 0);
          ctx.restore();
        });

        // Ring 2: Cung & Nhãn Thành Môn chi tiết (rRing2 -> rRing3, Nhỏ gọn tinh tế)
        const trigrams8 = [
          { name: 'Khảm', pNum: 1, centerDeg: 0 },
          { name: 'Cấn', pNum: 8, centerDeg: 45 },
          { name: 'Chấn', pNum: 3, centerDeg: 90 },
          { name: 'Tốn', pNum: 4, centerDeg: 135 },
          { name: 'Ly', pNum: 9, centerDeg: 180 },
          { name: 'Khôn', pNum: 2, centerDeg: 225 },
          { name: 'Đoài', pNum: 7, centerDeg: 270 },
          { name: 'Càn', pNum: 6, centerDeg: 315 },
        ];

        trigrams8.forEach((t) => {
          const sRad = ((t.centerDeg - 22.5 - 90) * Math.PI) / 180;
          const eRad = ((t.centerDeg + 22.5 - 90) * Math.PI) / 180;
          const mRad = ((t.centerDeg - 90) * Math.PI) / 180;

          const p = analysis.palaces[t.pNum];
          const isChinhTM = tm?.chinhThanhMon.palaceNum === t.pNum;
          const isPhuTM = tm?.phuThanhMon.palaceNum === t.pNum;

          ctx.beginPath();
          ctx.arc(0, 0, rRing2, sRad, eRad);
          ctx.arc(0, 0, rRing3, eRad, sRad, true);
          ctx.closePath();

          if (isChinhTM) {
            ctx.fillStyle = tm?.chinhThanhMon.isUsable
              ? `rgba(16, 185, 129, ${opacity * 0.5})`
              : `rgba(245, 158, 11, ${opacity * 0.35})`;
          } else if (isPhuTM) {
            ctx.fillStyle = tm?.phuThanhMon.isUsable
              ? `rgba(5, 150, 105, ${opacity * 0.45})`
              : `rgba(217, 119, 6, ${opacity * 0.3})`;
          } else if (p.isFacing) {
            ctx.fillStyle = `rgba(239, 68, 68, ${opacity * 0.4})`;
          } else if (p.isSitting) {
            ctx.fillStyle = `rgba(37, 99, 235, ${opacity * 0.4})`;
          } else {
            ctx.fillStyle = `rgba(248, 250, 252, ${opacity * 0.15})`;
          }
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.save();
          const tr2 = (rRing2 + rRing3) / 2;
          ctx.translate(Math.cos(mRad) * tr2, Math.sin(mRad) * tr2);
          ctx.rotate(mRad + Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Tên Cung Bát Quái
          ctx.font = `bold ${Math.max(5.5, 6.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.fillText(t.name, 0, -3.2 * rScale);

          // Nhãn Phi Tinh & Thành Môn gọn gàng
          let tagText = `S${p.mountainStar}·H${p.facingStar}`;
          let tagColor = '#1e293b';

          if (isChinhTM) {
            tagText = tm?.chinhThanhMon.isUsable ? '⭐ Đắc Chính TM' : 'Chính TM (Hư)';
            tagColor = tm?.chinhThanhMon.isUsable ? '#065f46' : '#92400e';
          } else if (isPhuTM) {
            tagText = tm?.phuThanhMon.isUsable ? '⭐ Đắc Phụ TM' : 'Phụ TM (Hư)';
            tagColor = tm?.phuThanhMon.isUsable ? '#065f46' : '#92400e';
          } else if (p.isFacing) {
            tagText = `HƯỚNG (V${p.periodStar})`;
            tagColor = '#991b1b';
          } else if (p.isSitting) {
            tagText = `TỌA (V${p.periodStar})`;
            tagColor = '#1e3a8a';
          }

          ctx.font = `bold ${Math.max(4.6, 5.2 * rScale)}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = tagColor;
          ctx.fillText(tagText, 0, 3.5 * rScale);
          ctx.restore();
        });

        // Ring 3: Vòng Bát Trạch Du Niên (BẬT / TẮT theo nút bấm)
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing3, rInnerCenter);
        }
      }

      // ========================================================
      // MODE 9 / DEFAULT: TỔNG HỢP & 24 SƠN ĐỊA BÀN
      // ========================================================
      else {
        // Standard 24 Sơn Địa Bàn
        MOUNTAINS_24.forEach((m, idx) => {
          const startRad = ((m.startDeg - 90) * Math.PI) / 180;
          const endRad = ((m.endDeg - 90) * Math.PI) / 180;
          const midRad = ((m.centerDeg - 90) * Math.PI) / 180;

          ctx.beginPath();
          ctx.arc(0, 0, rRing1, startRad, endRad);
          ctx.arc(0, 0, rRing2, endRad, startRad, true);
          ctx.closePath();

          const isTuChanh = tuChanhNames.includes(m.name);
          ctx.fillStyle = isTuChanh
            ? `rgba(244, 63, 94, ${opacity * 0.28})`
            : idx % 2 === 0
            ? `rgba(224, 231, 255, ${opacity * 0.22})`
            : `rgba(248, 250, 252, ${opacity * 0.12})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.15, 0.85)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.save();
          const textR = (rRing1 + rRing2) / 2;
          ctx.translate(Math.cos(midRad) * textR, Math.sin(midRad) * textR);
          ctx.rotate(midRad + Math.PI / 2);

          if (isTuChanh) {
            ctx.fillStyle = '#e11d48';
            ctx.beginPath();
            ctx.roundRect(-14, -8, 28, 16, 3);
            ctx.fill();
            ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(m.name.toUpperCase(), 0, 0);
          } else {
            ctx.font = `bold ${Math.max(6.5, 7.8 * rScale)}px "Plus Jakarta Sans", sans-serif`;
            ctx.fillStyle = '#0f172a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(m.name.toUpperCase(), 0, 0);
          }
          ctx.restore();
        });

        // 8 Cung Bát Trạch (BẬT / TẮT theo nút bấm [Vòng Bát Trạch La Kinh])
        if (showBatTrachOnLuopan) {
          drawBatTrach8Ring(rRing2, rInnerCenter);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, rRing2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(15, 23, 42, ${Math.min(opacity + 0.15, 0.85)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Central concentric circle (Thiên Trì / Heaven Pool - HOÀN TOÀN TRONG SUỐT ĐỂ NHÌN TÂM NHÀ)
      ctx.beginPath();
      ctx.arc(0, 0, rInnerCenter, 0, Math.PI * 2);
      // Lòng ao trong suốt, không dùng màu trắng đục '#fafaf9' để nhìn thấy tâm nhà và các vách tường
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Đáy Thiên Trì: Vạch đỏ chuẩn Nam - Bắc mảnh tinh tế & 2 chấm son phong thủy
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -rInnerCenter + 4);
      ctx.lineTo(0, rInnerCenter - 4);
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -rInnerCenter * 0.55, 1.5, 0, Math.PI * 2);
      ctx.arc(0, rInnerCenter * 0.55, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Vành chia độ nhỏ ở mép ao Thiên Trì
      for (let d = 0; d < 360; d += 15) {
        const dRad = ((d - 90) * Math.PI) / 180;
        const isMajor = d % 90 === 0;
        const tickL = isMajor ? 2.5 : 1.2;
        const x1 = Math.cos(dRad) * (rInnerCenter - 1);
        const y1 = Math.sin(dRad) * (rInnerCenter - 1);
        const x2 = Math.cos(dRad) * (rInnerCenter - 1 - tickL);
        const y2 = Math.sin(dRad) * (rInnerCenter - 1 - tickL);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isMajor ? '#dc2626' : '#d97706';
        ctx.lineWidth = isMajor ? 0.8 : 0.4;
        ctx.stroke();

        // 4 hướng chính ở mép ao
        if (d % 90 === 0) {
          ctx.save();
          const tr = rInnerCenter - 5.5;
          ctx.translate(Math.cos(dRad) * tr, Math.sin(dRad) * tr);
          let rot = dRad + Math.PI / 2;
          if (d > 90 && d < 270) rot += Math.PI;
          ctx.rotate(rot);
          ctx.font = 'bold 5px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = d === 0 ? '#dc2626' : '#64748b';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${d}°`, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();

      // TỪ CHÂM TRUYỀN THỐNG TRONG THIÊN TRÌ (Kim thanh mảnh nằm trọn vẹn trong Thiên Trì)
      const needleAngleDeg = luopanRotateWithFacing
        ? -90 + luopanRotationOffset
        : facingDegree - 90 + luopanRotationOffset;
      const needleAngleRad = (needleAngleDeg * Math.PI) / 180;

      ctx.save();
      ctx.rotate(needleAngleRad + Math.PI / 2);

      const needleLen = rInnerCenter * 0.82;
      const needleHalfW = 2.2;

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

      // Đầu kim son
      ctx.beginPath();
      ctx.arc(0, -needleLen * 0.58, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Đuôi kim Xanh (Tọa Bắc - Đuôi én)
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

      // Trục xoay kim bằng đồng tại tâm Thiên Trì
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      ctx.restore();
      ctx.restore();

      ctx.restore(); // Restore dial translation/rotation

      // =====================================================================
      // CHỈ HỒNG THẬP ĐẠO TRUYỀN THỐNG (DÂY CHỈ ĐỎ CĂNG XUYÊN SUỐT BẢN VẼ)
      // Dây chỉ đỏ sợi mảnh, sắc nét, không bị kim che khuất
      // =====================================================================
      ctx.save();
      ctx.translate(cx, cy);

      const crosshairLen = rOuter + 65;

      // 1. Trục Dọc Chỉ Hồng (Nam - Bắc / Hướng - Tọa xuyên suốt căn nhà)
      ctx.save();
      ctx.rotate(needleAngleRad + Math.PI / 2);

      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.4;
      ctx.shadowColor = 'rgba(220, 38, 38, 0.45)';
      ctx.shadowBlur = 4;

      ctx.beginPath();
      ctx.moveTo(0, -crosshairLen);
      ctx.lineTo(0, crosshairLen);
      ctx.stroke();

      // 2. Trục Ngang Chỉ Hồng (Đông - Tây vuông góc thập đạo)
      ctx.beginPath();
      ctx.moveTo(-crosshairLen, 0);
      ctx.lineTo(crosshairLen, 0);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2b. TRỤC TÂM LẬP CỰC (ĐIỂM TRUNG CUNG NGÔI NHÀ)
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      // 3. TIÊU ĐIỂM CHỈ ĐỘ NGOẠI VIÊN (Con trỏ mảnh ở vành ngoài, không che mặt đĩa)
      // Con trỏ Hướng đỏ tinh tế
      ctx.beginPath();
      ctx.moveTo(0, -rOuter);
      ctx.lineTo(-6, -rOuter - 9);
      ctx.lineTo(6, -rOuter - 9);
      ctx.closePath();
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Badge nhãn HƯỚNG ngoài viền đĩa
      const facingText = `HƯỚNG: ${facingDegree}° (${analysis.facingMountain.name})`;
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      const textMetrics = ctx.measureText(facingText);
      const badgeW = textMetrics.width + 16;
      const badgeH = 22;
      const badgeY = -rOuter - 35;

      ctx.fillStyle = 'rgba(220, 38, 38, 0.95)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, badgeY, badgeW, badgeH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(facingText, 0, badgeY + badgeH / 2);

      // Con trỏ Tọa xanh tinh tế
      ctx.beginPath();
      ctx.moveTo(0, rOuter);
      ctx.lineTo(-5.5, rOuter + 8);
      ctx.lineTo(5.5, rOuter + 8);
      ctx.closePath();
      ctx.fillStyle = '#2563eb';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Badge nhãn TỌA ngoài viền đĩa
      const sitDeg = normalizeDegree(facingDegree + 180);
      const sittingText = `TỌA: ${sitDeg}° (${analysis.sittingMountain.name})`;
      const sitTextMetrics = ctx.measureText(sittingText);
      const sitBadgeW = sitTextMetrics.width + 16;
      const sitBadgeY = rOuter + 14;

      ctx.fillStyle = 'rgba(30, 64, 175, 0.95)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-sitBadgeW / 2, sitBadgeY, sitBadgeW, badgeH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(sittingText, 0, sitBadgeY + badgeH / 2);

      ctx.restore();
      ctx.restore();
    }

    // B. NINE PALACES GRID (LƯỚI CỬU CUNG PHI TINH - TỰ ĐỘNG XOAY THEO HƯỚNG NHÀ)
    if (viewOverlay === 'both' || viewOverlay === 'nine_palace') {
      ctx.save();
      // Không làm mờ chữ và số - số và ký hiệu luôn sắc nét 100%
      ctx.translate(cx, cy);

      const effectiveRotDeg = autoRotateWithFacing
        ? normalizeDegree(facingDegree + gridRotationOffset)
        : normalizeDegree(gridRotationOffset);
      const rotRad = (effectiveRotDeg * Math.PI) / 180;
      ctx.rotate(rotRad);

      const gWidth = gridWidth;
      const gHeight = gridHeight;
      const cellW = gWidth / 3;
      const cellH = gHeight / 3;
      const startX = -gWidth / 2;
      const startY = -gHeight / 2;

      // Outer Grid boundary (Thick royal blue lines)
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(startX, startY, gWidth, gHeight);

      // Internal dividing lines
      ctx.lineWidth = 2.5;
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(startX + cellW, startY);
      ctx.lineTo(startX + cellW, startY + gHeight);
      ctx.moveTo(startX + cellW * 2, startY);
      ctx.lineTo(startX + cellW * 2, startY + gHeight);
      // Horizontal lines
      ctx.moveTo(startX, startY + cellH);
      ctx.lineTo(startX + gWidth, startY + cellH);
      ctx.moveTo(startX, startY + cellH * 2);
      ctx.lineTo(startX + gWidth, startY + cellH * 2);
      ctx.stroke();

      // 3x3 layout with Facing Palace at Top Center (Mặt tiền ở trên)
      const grid3x3 = getFacingUpGrid(analysis.facingMountain.palaceNumber);

      grid3x3.forEach((row, rIdx) => {
        row.forEach((pNum, cIdx) => {
          const p = analysis.palaces[pNum];
          const cellX = startX + cIdx * cellW;
          const cellY = startY + rIdx * cellH;
          const cellCenterX = cellX + cellW / 2;
          const cellCenterY = cellY + cellH / 2;

          // Subtle tinted background for each palace cell
          ctx.fillStyle = p.isFacing
            ? `rgba(239, 68, 68, ${opacity * 0.22})`
            : p.isSitting
            ? `rgba(37, 99, 235, ${opacity * 0.22})`
            : `rgba(255, 255, 255, ${opacity * 0.1})`;
          ctx.fillRect(cellX, cellY, cellW, cellH);

          ctx.save();
          ctx.translate(cellCenterX, cellCenterY);
          if (keepTextUpright) {
            ctx.rotate(-rotRad); // Keep numbers and text upright and readable!
          }

          // Cỡ chữ nhỏ gọn thanh thoát, rõ nét không che khuất
          const gridScale = Math.min(Math.max(cellW / 90, 0.55), 1.6);
          const fMountain = Math.max(7.5, Math.round(14 * gridScale));
          const fFacing = Math.max(7.5, Math.round(13 * gridScale));
          const fPeriod = Math.max(8.5, Math.round(14 * gridScale));
          const fTag = Math.max(6.5, Math.round(8.5 * gridScale));
          const fBadge = Math.max(6.5, Math.round(7.5 * gridScale));

          // 1. Mountain Star (Top Left - Red)
          ctx.fillStyle = '#dc2626';
          ctx.font = `bold ${fMountain}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${p.mountainStar}${p.mountainPolarity}`, -cellW * 0.28, -cellH * 0.28);

          // 2. Facing Star (Top Right - Blue with circle)
          ctx.save();
          const fX = cellW * 0.28;
          const fY = -cellH * 0.28;
          const facingCircleR = Math.max(8, Math.round(12 * gridScale));
          ctx.beginPath();
          ctx.arc(fX, fY, facingCircleR, 0, Math.PI * 2);
          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = Math.max(1, 1.5 * gridScale);
          ctx.stroke();
          ctx.fillStyle = '#1d4ed8';
          ctx.font = `bold ${fFacing}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${p.facingStar}${p.facingPolarity}`, fX, fY);
          ctx.restore();

          // 3. Period Star (Center Box)
          const pBoxW = Math.min(cellW * 0.38, Math.max(22, 38 * gridScale));
          const pBoxH = Math.min(cellH * 0.32, Math.max(18, 28 * gridScale));
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.roundRect(-pBoxW / 2, -pBoxH / 2 - 2, pBoxW, pBoxH, Math.max(2, 4 * gridScale));
          ctx.fill();
          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = Math.max(1, 1.5 * gridScale);
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = `900 ${fPeriod}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${p.periodStar}`, 0, -2);

          // 4. Direction name & Trigram (Chỉ hiện khi xem riêng Cửu Cung để không đè lên 24 Sơn của La Kinh)
          if (viewOverlay !== 'both') {
            ctx.fillStyle = p.isFacing ? '#ef4444' : p.isSitting ? '#3b82f6' : '#1e293b';
            ctx.font = `bold ${fTag}px "Plus Jakarta Sans", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const tag = p.isFacing ? ' [HƯỚNG]' : p.isSitting ? ' [TỌA]' : '';
            ctx.fillText(`${p.shortName}${tag}`, 0, cellH * 0.20);
          }

          // 5. BÁT TRẠCH STAR BADGE (Chỉ hiển thị khi xem riêng Cửu Cung để tránh trùng lặp 2 lần chữ Bát Trạch đè nhau)
          if (showBatTrachOnGrid && batTrachAnalysis && viewOverlay !== 'both') {
            const btPalace = batTrachAnalysis.palaces[pNum];
            const star = btPalace?.ownerStar || btPalace?.houseStar;
            if (star) {
              const badgeY = cellH * 0.35;
              const badgeW = Math.min(cellW * 0.85, Math.max(45, 75 * gridScale));
              const badgeH = Math.max(13, Math.round(16 * gridScale));

              ctx.fillStyle = star.isGood ? '#10b981' : '#ef4444';
              ctx.beginPath();
              ctx.roundRect(-badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, Math.max(2, 4 * gridScale));
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.font = `bold ${fBadge}px "Plus Jakarta Sans", sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(star.name, 0, badgeY);
            }
          }

          // 6. THÀNH MÔN QUYẾT BADGE (Chính Thành Môn / Phụ Thành Môn) - Thu nhỏ gọn gàng, không che khuất tên sơn
          const tm = analysis.thanhMon;
          const isChinhTM = tm?.chinhThanhMon.palaceNum === pNum;
          const isPhuTM = tm?.phuThanhMon.palaceNum === pNum;
          if (tm && (isChinhTM || isPhuTM)) {
            const gate = isChinhTM ? tm.chinhThanhMon : tm.phuThanhMon;
            // Đặt vị trí badge né tên 24 sơn, kích thước nhỏ gọn tinh tế không đè lấn
            const tmBadgeY = (showBatTrachOnGrid && batTrachAnalysis && viewOverlay !== 'both')
              ? cellH * 0.43
              : cellH * 0.36;
            const tmBadgeW = Math.min(cellW * 0.60, Math.max(34, 48 * gridScale));
            const tmBadgeH = Math.max(8.5, Math.round(10.5 * gridScale));

            ctx.fillStyle = gate.isUsable ? 'rgba(5, 150, 105, 0.85)' : 'rgba(217, 119, 6, 0.82)';
            ctx.beginPath();
            ctx.roundRect(-tmBadgeW / 2, tmBadgeY - tmBadgeH / 2, tmBadgeW, tmBadgeH, 3);
            ctx.fill();
            ctx.strokeStyle = gate.isUsable ? '#34d399' : '#fde047';
            ctx.lineWidth = 0.6;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(4.0, Math.round(4.8 * gridScale))}px "Plus Jakarta Sans", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const label = isChinhTM
              ? (gate.isUsable ? '⭐ Chính TM' : 'Chính TM (Hư)')
              : (gate.isUsable ? '⭐ Phụ TM' : 'Phụ TM (Hư)');
            ctx.fillText(label, 0, tmBadgeY);
          }

          ctx.restore();
        });
      });

      // Direction Arrow pointing to Facing Direction (Top of grid)
      ctx.save();
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, startY - 24);
      ctx.lineTo(-14, startY - 2);
      ctx.lineTo(14, startY - 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Label at arrow: HƯỚNG
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const chartTypeTag = analysis.chartType === 'THE_QUAI' ? ' · THẾ QUÁI' : '';
      ctx.fillText(`HƯỚNG NHÀ (${facingDegree}°)${chartTypeTag}`, 0, startY - 26);

      // Label at bottom: TỌA
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`TỌA SƠN (${normalizeDegree(facingDegree + 180)}°)`, 0, startY + gHeight + 8);

      ctx.restore();

      ctx.restore();
    }

    // C. 2-POINT ALIGNMENT VISUAL INDICATORS
    if (interactionMode === 'align_direction' && alignPoint1) {
      ctx.save();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(alignPoint1.x, alignPoint1.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Điểm 1 (Tâm nhà/Cửa)', alignPoint1.x + 12, alignPoint1.y + 4);
      ctx.restore();
    }
  }, [
    canvasDim,
    floorPlanImg,
    panOffset,
    zoomScale,
    centerPoint,
    luopanRadius,
    luopanRotateWithFacing,
    luopanRotationOffset,
    showBatTrachOnLuopan,
    gridWidth,
    gridHeight,
    opacity,
    viewOverlay,
    interactionMode,
    alignPoint1,
    facingDegree,
    analysis,
    batTrachAnalysis,
    autoRotateWithFacing,
    gridRotationOffset,
    keepTextUpright,
    showBatTrachOnGrid,
    activeCompass,
  ]);

  // Re-draw when dependencies change
  useEffect(() => {
    drawOverlay();
  }, [drawOverlay]);

  // Handle Canvas Mouse & Touch Events
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleAutoCenterOnHouse = () => {
    if (floorPlanImg) {
      const imgW = floorPlanImg.width;
      const imgH = floorPlanImg.height;
      const scaleFit = Math.min((canvasDim.width * 0.95) / imgW, (canvasDim.height * 0.95) / imgH);
      const drawW = imgW * scaleFit * zoomScale;
      const drawH = imgH * scaleFit * zoomScale;
      const drawX = (canvasDim.width - drawW) / 2 + panOffset.x;
      const drawY = (canvasDim.height - drawH) / 2 + panOffset.y;
      const newX = Math.round(drawX + drawW / 2);
      const newY = Math.round(drawY + drawH / 2);
      setCenterPoint({ x: newX, y: newY });
      setAlignHelperMsg(`Đã tự động căn tâm La Kinh vào chính giữa bản vẽ ngôi nhà: (${newX}, ${newY})`);
    } else {
      const newX = Math.round(canvasDim.width / 2);
      const newY = Math.round(canvasDim.height / 2);
      setCenterPoint({ x: newX, y: newY });
      setAlignHelperMsg(`Đã căn tâm La Kinh về chính giữa màn hình: (${newX}, ${newY})`);
    }
  };

  const nudgeCenter = (dx: number, dy: number) => {
    if (isLocked) {
      setAlignHelperMsg('🔒 La Kinh đang khóa. Vui lòng bấm [MỞ KHÓA] ở thanh công cụ để chỉnh vị trí!');
      return;
    }
    const margin = 50;
    setCenterPoint((prev) => {
      const nextX = Math.max(margin, Math.min(canvasDim.width - margin, Math.round(prev.x + dx)));
      const nextY = Math.max(margin, Math.min(canvasDim.height - margin, Math.round(prev.y + dy)));
      setAlignHelperMsg(`Đã dịch tâm La Kinh: (${nextX}, ${nextY})`);
      return { x: nextX, y: nextY };
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isLocked) {
      setAlignHelperMsg('🔒 La Kinh đang ĐƯỢC KHÓA CỐ ĐỊNH. Chạm nút [MỞ KHÓA] ở góc trên nếu anh muốn di chuyển hoặc xoay!');
      return;
    }

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const { x, y } = getCanvasCoords(e);

    if (interactionMode === 'set_center') {
      const margin = 50;
      const clX = Math.max(margin, Math.min(canvasDim.width - margin, Math.round(x)));
      const clY = Math.max(margin, Math.min(canvasDim.height - margin, Math.round(y)));
      setCenterPoint({ x: clX, y: clY });
      setInteractionMode('drag_luopan');
      setAlignHelperMsg(`Đã đặt Tâm Nhà (Lập Cực) tại tọa độ (${clX}, ${clY}).`);
      return;
    }

    if (interactionMode === 'align_direction') {
      if (!alignPoint1) {
        setAlignPoint1({ x, y });
        setCenterPoint({ x: Math.round(x), y: Math.round(y) });
        setAlignHelperMsg('Đã chọn Điểm 1 (Tâm nhà). Bây giờ hãy click Điểm 2 (hướng nhìn ra mặt tiền/cửa chính)!');
      } else {
        const dx = x - alignPoint1.x;
        const dy = y - alignPoint1.y;

        let rad = Math.atan2(dy, dx);
        let deg = (rad * 180) / Math.PI + 90;
        deg = normalizeDegree(deg);
        deg = Math.round(deg * 10) / 10;

        onDegreeChange(deg);
        setAlignPoint1(null);
        setInteractionMode('drag_luopan');
        setAlignHelperMsg(`Đã tự động định vị hướng nhà: ${deg}°!`);
      }
      return;
    }

    // Dragging logic with HIT-TESTING & BOUNDARY PROTECTION
    const dist = Math.hypot(x - centerPoint.x, y - centerPoint.y);
    const insideLuopan = dist <= luopanRadius + 20;
    const insideGrid =
      Math.abs(x - centerPoint.x) <= gridWidth / 2 + 15 &&
      Math.abs(y - centerPoint.y) <= gridHeight / 2 + 15;

    setIsDragging(true);
    setDragStart({ x, y });

    if (interactionMode === 'drag_luopan') {
      // Chỉ kéo La Kinh nếu người dùng chạm VÀO PHẠM VI đĩa La Kinh hoặc lưới Cửu Cung
      // Nếu vuốt ở ngoài mép hoặc khoảng trống, tự động chuyển sang cuộn canvas để không làm bay La Kinh!
      if (insideLuopan || insideGrid) {
        setDragTarget('luopan');
      } else {
        setDragTarget('canvas');
      }
    } else if (interactionMode === 'pan_canvas') {
      setDragTarget('canvas');
    } else {
      if (insideLuopan || insideGrid) {
        setDragTarget('luopan');
      } else {
        setDragTarget('canvas');
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || isLocked || !dragTarget) return;
    const { x, y } = getCanvasCoords(e);
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    setDragStart({ x, y });

    const margin = 50;
    if (dragTarget === 'luopan') {
      // ONLY MOVE THE LUOPAN & NINE PALACES GRID RELATIVE TO THE HOUSE!
      // Chặn biên tuyệt đối: La Kinh không bao giờ bị văng ra khỏi màn hình
      setCenterPoint((prev) => {
        const nextX = Math.max(margin, Math.min(canvasDim.width - margin, Math.round(prev.x + dx)));
        const nextY = Math.max(margin, Math.min(canvasDim.height - margin, Math.round(prev.y + dy)));
        return { x: nextX, y: nextY };
      });
    } else {
      // PAN THE ENTIRE CANVAS (Floor plan moves, Luopan stays pinned to the house)
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setCenterPoint((prev) => {
        const nextX = Math.max(margin, Math.min(canvasDim.width - margin, Math.round(prev.x + dx)));
        const nextY = Math.max(margin, Math.min(canvasDim.height - margin, Math.round(prev.y + dy)));
        return { x: nextX, y: nextY };
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }
    setIsDragging(false);
    setDragTarget(null);
  };

  // Export Combined Image
  const exportCompositeImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `MatBang_PhongThuy_${analysis.facingMountain.name}_${facingDegree}do.png`;
    a.click();
  };

  const currentRulerInfo = COMPASS_RULERS_LIST.find((r) => r.id === activeCompass) || COMPASS_RULERS_LIST[0];

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-stone-950 flex flex-col p-2 sm:p-4 overflow-y-auto" : "w-full flex flex-col gap-3"} ref={containerRef}>
      {/* Top Controls Toolbar - Hàng 1 & Hàng 2 hợp nhất, rõ ràng, không che lấp bản vẽ */}
      <div className="bg-stone-900/95 border border-zinc-800 rounded-2xl p-2.5 sm:p-3.5 shadow-xl flex flex-col gap-2.5">
        {/* HÀNG 1: Chọn loại La Kinh, Số Độ Hướng, Khóa, Căn giữa, Toàn màn hình & Lưu ảnh */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Nhóm trái: Loại La Kinh & Thước */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* TÍCH CHỌN LOẠI LA KINH TRỰC TIẾP */}
            <div className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded-xl border border-amber-500/50 shadow-inner">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <label htmlFor="select-compass-quick" className="text-[11px] font-bold text-amber-300 shrink-0 hidden sm:inline">
                Loại La Kinh:
              </label>
              <select
                id="select-compass-quick"
                value={activeCompass}
                onChange={(e) => setActiveCompass(e.target.value as CompassType)}
                className="bg-stone-900 border border-amber-500/40 text-amber-200 font-extrabold text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                title="Tích chọn loại đĩa La Kinh để lồng vào mặt bằng nhà"
              >
                <option value="tonghop">🌟 Tổng Hợp Tam Hợp (Chuẩn)</option>
                <option value="huyenkhong">🔯 Huyền Không Phi Tinh & Thành Môn</option>
                <option value="battrach">🏠 Bát Trạch Minh Cảnh</option>
                <option value="diaban24">🧭 Địa Bàn 24 Sơn Chính Châm</option>
                <option value="phucduc24">✨ Phúc Đức 24 Sơn (An Môn)</option>
                <option value="tieusa">⛰️ Tiêu Sa 24 Sơn (Trung Châm)</option>
                <option value="napthuy">💧 Nạp Thủy 24 Sơn (Phùng Châm)</option>
                <option value="xuyenson">🏔️ Xuyên Sơn 72 Long</option>
                <option value="thaudia">🌍 Thấu Địa 60 Long</option>
                <option value="phankim120">📐 Phân Kim 120 (Chuỗi ngọc)</option>
                <option value="daiquai">☯️ Đại Quái 64 Quẻ Kinh Dịch</option>
                <option value="loban">📏 Thước Lỗ Ban (mm)</option>
              </select>
            </div>

            {/* Nút Xem Chi Tiết 12 Đĩa Thước */}
            <button
              onClick={() => setIsCompassModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-colors cursor-pointer"
              title="Xem danh mục chi tiết 12 tầng đĩa La Kinh & công năng"
            >
              <span>12 Đĩa</span>
            </button>

            {/* Nút Thước Lỗ Ban mm */}
            <button
              onClick={() => setIsLuBanModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs border border-rose-500/40 transition-colors cursor-pointer"
              title="Tra cứu Thước Lỗ Ban 522mm, 429mm, 388mm (chuẩn mm kiến trúc & mộc)"
            >
              <Ruler className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Thước Lỗ Ban</span>
              <span className="sm:hidden">Lỗ Ban</span>
            </button>

            {/* Designer Credit */}
            <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 bg-stone-950 px-2 py-1 rounded-lg border border-zinc-800">
              Thiết kế: <strong className="text-amber-300">Nguyễn Viết Đạt</strong>
            </span>
          </div>

          {/* Nhóm giữa/phải: Hướng độ, Steppers, Khóa, Căn giữa, Toàn màn hình & Lưu */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Input Hướng & Sơn */}
            <div className="flex items-center gap-1 bg-stone-950 border border-rose-500/50 px-2 py-0.5 rounded-lg">
              <span className="text-rose-400 font-bold text-xs">Hướng:</span>
              <input
                type="number"
                min={0}
                max={359}
                step={1}
                value={facingDegree}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) onDegreeChange(normalizeDegree(val));
                }}
                disabled={isLocked}
                className="w-14 bg-stone-900 text-rose-300 font-mono font-black text-xs px-1 py-0.5 rounded border border-rose-500/40 text-center focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-50"
                title="Nhập số độ hướng nhà (0° - 359°)"
              />
              <span className="text-rose-400 font-bold text-xs">°</span>
              <select
                value={analysis.facingMountain.name}
                disabled={isLocked}
                onChange={(e) => {
                  const m = MOUNTAINS_24.find((x) => x.name === e.target.value);
                  if (m) onDegreeChange(m.centerDeg);
                }}
                className="bg-stone-900 border border-amber-500/40 text-amber-300 font-bold text-xs rounded px-1.5 py-0.5 focus:outline-none disabled:opacity-50 cursor-pointer"
                title="Chọn nhanh theo 24 Sơn"
              >
                {MOUNTAINS_24.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.centerDeg}°)
                  </option>
                ))}
              </select>
            </div>

            {/* Steppers -5, -1, +1, +5 */}
            <div className="hidden md:flex items-center bg-stone-950 rounded-lg p-0.5 border border-zinc-700">
              <button
                onClick={() => onDegreeChange(normalizeDegree(facingDegree - 5))}
                disabled={isLocked}
                className="px-1.5 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] font-bold cursor-pointer disabled:opacity-30"
              >
                -5°
              </button>
              <button
                onClick={() => onDegreeChange(normalizeDegree(facingDegree - 1))}
                disabled={isLocked}
                className="px-1.5 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] font-bold cursor-pointer disabled:opacity-30"
              >
                -1°
              </button>
              <button
                onClick={() => onDegreeChange(normalizeDegree(facingDegree + 1))}
                disabled={isLocked}
                className="px-1.5 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] font-bold cursor-pointer disabled:opacity-30"
              >
                +1°
              </button>
              <button
                onClick={() => onDegreeChange(normalizeDegree(facingDegree + 5))}
                disabled={isLocked}
                className="px-1.5 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] font-bold cursor-pointer disabled:opacity-30"
              >
                +5°
              </button>
            </div>

            {/* CĂN GIỮA NHÀ */}
            <button
              onClick={handleAutoCenterOnHouse}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs border border-zinc-700 transition-colors cursor-pointer"
              title="Đưa tâm La Kinh về đúng chính giữa bản vẽ ngôi nhà"
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Căn Giữa</span>
            </button>

            {/* KHÓA / MỞ KHÓA LA KINH & SỐ ĐỘ */}
            <button
              onClick={() => {
                const nextLock = !isLocked;
                setIsLocked(nextLock);
                setAlignHelperMsg(
                  nextLock
                    ? `🔒 ĐÃ KHÓA LA KINH & SỐ ĐỘ: Vị trí và góc quay tại ${facingDegree}° đã được cố định hoàn toàn, chống trôi khi vuốt!`
                    : `🔓 ĐÃ MỞ KHÓA: Bạn có thể kéo di chuyển tâm La Kinh hoặc chỉnh số độ!`
                );
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                isLocked
                  ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-600/25'
              }`}
              title={isLocked ? 'Bấm để mở khóa di chuyển & xoay La Kinh' : 'Bấm để khóa cố định La Kinh và số độ'}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5 text-white" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'ĐÃ KHÓA' : 'MỞ KHÓA'}</span>
            </button>

            {/* NÚT TOÀN MÀN HÌNH (RỘNG RÃI, DỄ NHÌN) */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs border border-indigo-400 transition-all cursor-pointer shadow-md shadow-indigo-600/25"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình xem rộng rãi'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Thu Nhỏ' : 'Toàn Màn Hình'}</span>
            </button>

            {/* Nút Lưu ảnh */}
            <button
              onClick={exportCompositeImage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow cursor-pointer"
              title="Xuất ảnh bản vẽ kèm La bàn trong suốt độ phân giải cao"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lưu ảnh</span>
            </button>
          </div>
        </div>

        {/* HÀNG 2: Chế độ thao tác, Lớp hiển thị, Chèn ảnh & Độ mờ */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800 text-xs">
          {/* Trái: Chế độ thao tác */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center bg-stone-950 p-0.5 rounded-xl border border-zinc-700">
              <button
                onClick={() => {
                  setInteractionMode('drag_luopan');
                  setAlignHelperMsg('ĐANG CHỌN KÉO LA KINH: Kéo thả đĩa La Kinh hoặc dùng phím mũi tên [↑][↓][←][→] để đặt vào đúng tâm ngôi nhà!');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  interactionMode === 'drag_luopan'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                    : 'text-zinc-300 hover:text-white'
                }`}
                title="Kéo trực tiếp đĩa La Kinh đến vị trí trung tâm ngôi nhà"
              >
                <Move className="w-3 h-3" />
                <span>Kéo La Kinh</span>
              </button>

              <button
                onClick={() => {
                  setInteractionMode('pan_canvas');
                  setAlignHelperMsg('ĐANG CHỌN KÉO BẢN VẼ: Nhấp và kéo chuột để cuộn và xem các góc khác của bản vẽ!');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  interactionMode === 'pan_canvas'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                    : 'text-zinc-300 hover:text-white'
                }`}
                title="Kéo di chuyển toàn bộ bản vẽ"
              >
                <Hand className="w-3 h-3" />
                <span>Kéo Bản Vẽ</span>
              </button>

              <button
                onClick={() => {
                  setInteractionMode('set_center');
                  setAlignHelperMsg('Nhấp chuột vào điểm Tâm Nhà (Trung Cung) trên bản vẽ để đặt tâm La Kinh!');
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  interactionMode === 'set_center'
                    ? 'bg-rose-600 text-white ring-1 ring-rose-400'
                    : 'text-zinc-300 hover:text-white'
                }`}
                title="Nhấp 1 chạm vào bản vẽ để chọn điểm tâm nhà"
              >
                <Crosshair className="w-3 h-3 text-rose-400" />
                <span>Lập Cực (1 chạm)</span>
              </button>
            </div>

            {/* Định vị Hướng 2 điểm */}
            <button
              onClick={() => {
                setInteractionMode('align_direction');
                setAlignPoint1(null);
                setAlignHelperMsg('ĐỊNH VỊ TỰ ĐỘNG: Nhấp Điểm 1 (Tâm nhà hoặc Cửa chính), sau đó nhấp Điểm 2 (hướng nhìn ra mặt tiền)!');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                interactionMode === 'align_direction'
                  ? 'bg-sky-600 text-white border-sky-400 animate-pulse'
                  : 'bg-stone-950 text-sky-300 border-zinc-700 hover:border-sky-500'
              }`}
              title="Căn hướng tự động chính xác qua 2 điểm trên bản vẽ"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Định vị Hướng 2 điểm</span>
              <span className="sm:hidden">2 điểm</span>
            </button>
          </div>

          {/* Phải: Lớp hiển thị, Slider độ mờ (mờ cả chữ) & Chèn ảnh */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Chế độ xem: La Kinh / Cửu Cung / Cả hai */}
            <div className="flex items-center bg-stone-950 p-0.5 rounded-lg border border-zinc-700 text-xs">
              <button
                onClick={() => setViewOverlay('luopan')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewOverlay === 'luopan' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                La Kinh
              </button>
              <button
                onClick={() => setViewOverlay('nine_palace')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewOverlay === 'nine_palace' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Cửu Cung
              </button>
              <button
                onClick={() => setViewOverlay('both')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewOverlay === 'both' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Cả hai
              </button>
            </div>

            {/* THANH TRƯỢT ĐỘ MỜ LA KINH & CHỮ (MỜ CẢ CHỮ VÀ HÌNH ĐỂ THẤY BẢN VẼ) */}
            <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1 rounded-lg border border-amber-500/50 shadow-inner">
              <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-zinc-300 font-bold text-[11px] shrink-0">Độ mờ:</span>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-16 sm:w-24 h-1.5 bg-zinc-700 rounded cursor-pointer accent-amber-500"
                title="Kéo thanh trượt để làm mờ cả chữ và đĩa La Kinh giúp nhìn rõ bản vẽ mặt bằng ngôi nhà"
              />
              <span className="text-amber-300 font-mono font-bold text-[11px] w-8 text-right shrink-0">
                {Math.round(opacity * 100)}%
              </span>
            </div>

            {/* Chèn / Xóa ảnh bản vẽ */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-colors cursor-pointer"
              title="Tải ảnh mặt bằng kiến trúc từ máy tính hoặc điện thoại"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>{floorPlanImg ? 'Đổi ảnh' : 'Chèn ảnh'}</span>
            </button>

            {floorPlanImg && (
              <div className="flex items-center gap-1.5 bg-stone-950 px-2 py-0.5 rounded-lg border border-zinc-800 text-[11px] text-zinc-300">
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{imageName || 'Bản vẽ'}</span>
                <button
                  onClick={removeImage}
                  className="text-zinc-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                  title="Xóa ảnh hiện tại"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helper Notification Banner */}
      {alignHelperMsg && (
        <div className="bg-sky-950/80 border border-sky-500/50 text-sky-200 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{alignHelperMsg}</span>
          </div>
          <button
            onClick={() => setAlignHelperMsg('')}
            className="text-xs text-sky-400 hover:text-sky-200 underline font-semibold ml-3"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Interactive Canvas Viewport */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) processImageFile(file);
        }}
        className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-stone-950 shadow-2xl flex flex-col items-center"
      >
        {/* Empty state overlay when no image is loaded yet */}
        {!floorPlanImg && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-stone-950/80 backdrop-blur-sm cursor-pointer hover:bg-stone-900/85 transition-colors border-2 border-dashed border-amber-500/30 m-3 rounded-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-xl">
              <Upload className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 text-center">
              Chèn ảnh bản vẽ mặt bằng nhà
            </h3>
            <p className="text-xs text-zinc-400 text-center max-w-md mb-4 leading-relaxed">
              Nhấp vào đây hoặc kéo thả file ảnh bản vẽ kiến trúc (JPG, PNG) của anh để hệ thống tự động lồng La Kinh trong suốt và Cửu Cung Phi Tinh
            </p>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all pointer-events-none"
            >
              <Upload className="w-4 h-4 text-stone-950" />
              <span>Chọn ảnh từ thiết bị</span>
            </button>
          </div>
        )}

        {/* Nhãn nhỏ thông báo trạng thái khóa ở góc phải trên, hoàn toàn không che mặt bằng */}
        {isLocked && (
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-rose-950/85 border border-rose-500/50 text-rose-200 px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm pointer-events-none text-[11px] font-bold">
            <Lock className="w-3 h-3 text-rose-400 shrink-0" />
            <span>Đã khóa ({facingDegree}°)</span>
          </div>
        )}

        {/* The HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`block w-full touch-none select-none ${
            isLocked
              ? 'cursor-not-allowed'
              : interactionMode === 'set_center' || interactionMode === 'align_direction'
              ? 'cursor-crosshair'
              : interactionMode === 'drag_luopan'
              ? 'cursor-move'
              : 'cursor-grab active:cursor-grabbing'
          }`}
        />

        {/* Dedicated Control Bar: Center Positioning, Rotation & Dimensions */}
        <div className="w-full bg-stone-900 border-t border-zinc-800/90 p-3 sm:px-5 flex flex-col gap-2.5 text-xs">
          {/* Row 0: VỊ TRÍ TÂM LA KINH & LẬP CỰC TRUNG CUNG */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-zinc-800/80 bg-stone-950/60 p-2.5 rounded-xl border border-amber-500/30">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-amber-300 font-bold flex items-center gap-1.5 shrink-0">
                <Target className="w-4 h-4 text-amber-400" />
                Tâm La Kinh (Lập Cực):
              </span>

              {/* Coordinates display */}
              <div className="flex items-center gap-1.5 bg-stone-900 border border-zinc-700 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                <span className="text-zinc-400">X:</span>
                <span className="text-amber-400 font-bold">{Math.round(centerPoint.x)}</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">Y:</span>
                <span className="text-amber-400 font-bold">{Math.round(centerPoint.y)}</span>
              </div>

              {/* Directional Nudge Buttons: Left, Up, Down, Right */}
              <div className="flex items-center gap-0.5 bg-stone-900 p-0.5 rounded-lg border border-zinc-700">
                <button
                  onClick={() => nudgeCenter(-nudgeStep, 0)}
                  disabled={isLocked}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                  title={`Dịch tâm La Kinh sang trái ${nudgeStep}px`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => nudgeCenter(0, -nudgeStep)}
                  disabled={isLocked}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                  title={`Dịch tâm La Kinh lên trên ${nudgeStep}px`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => nudgeCenter(0, nudgeStep)}
                  disabled={isLocked}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                  title={`Dịch tâm La Kinh xuống dưới ${nudgeStep}px`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => nudgeCenter(nudgeStep, 0)}
                  disabled={isLocked}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                  title={`Dịch tâm La Kinh sang phải ${nudgeStep}px`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step selector */}
              <div className="flex items-center bg-stone-900 rounded-lg p-0.5 border border-zinc-800 text-[10px]">
                <button
                  onClick={() => setNudgeStep(2)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    nudgeStep === 2 ? 'bg-amber-500 text-stone-950 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Dịch từng 2px (tinh chỉnh rất mịn)"
                >
                  2px
                </button>
                <button
                  onClick={() => setNudgeStep(10)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    nudgeStep === 10 ? 'bg-amber-500 text-stone-950 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Dịch 10px (nhanh hơn)"
                >
                  10px
                </button>
              </div>

              {/* Auto Center on Floor Plan */}
              <button
                onClick={handleAutoCenterOnHouse}
                disabled={isLocked}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors disabled:opacity-30 cursor-pointer"
                title="Tự động đặt tâm La Kinh vào chính giữa ngôi nhà trên bản vẽ"
              >
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Căn giữa nhà</span>
              </button>
            </div>

            <span className="text-[11px] text-zinc-400 hidden lg:inline">
              💡 <strong className="text-zinc-300">Kéo chuột</strong> trực tiếp hoặc dùng phím mũi tên <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono text-[10px]">↓</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono text-[10px]">←</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono text-[10px]">→</kbd> để căn tâm nhà.
            </span>
          </div>

          {/* Row 1: La Kinh Rotation & Bát Trạch Ring */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-zinc-300 font-bold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                La Kinh & Kim chỉ:
              </span>

              {/* Slider for Live Needle Rotation */}
              <div className="flex items-center gap-2 bg-stone-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                <span className="text-[11px] text-zinc-400 font-semibold shrink-0">Kim quay:</span>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={facingDegree}
                  onChange={(e) => onDegreeChange(parseInt(e.target.value) || 0)}
                  className="w-24 sm:w-32 accent-rose-500 cursor-pointer"
                  title="Kéo trượt để kim la bàn tự động quay theo số độ"
                />
                <span className="font-mono text-rose-400 font-black text-xs min-w-[34px] text-right">
                  {facingDegree}°
                </span>
              </div>

              <button
                onClick={() => {
                  setLuopanRotateWithFacing(!luopanRotateWithFacing);
                  if (!luopanRotateWithFacing) setLuopanRotationOffset(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  luopanRotateWithFacing
                    ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                    : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                }`}
                title="Chuyển chế độ xoay: Đĩa cố định Bắc (chuẩn bản vẽ) & Kim quay theo Hướng hoặc Toàn đĩa xoay theo Hướng"
              >
                {luopanRotateWithFacing ? 'Đĩa xoay theo Hướng' : '★ Chuẩn Bắc (Kim tự quay theo Hướng)'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLuopanRotationOffset((prev) => normalizeDegree(prev - 1))}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] cursor-pointer"
                  title="Tinh chỉnh góc đĩa -1°"
                >
                  -1°
                </button>
                <button
                  onClick={() => setLuopanRotationOffset((prev) => normalizeDegree(prev + 1))}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] cursor-pointer"
                  title="Tinh chỉnh góc đĩa +1°"
                >
                  +1°
                </button>
                {luopanRotationOffset !== 0 && (
                  <button
                    onClick={() => setLuopanRotationOffset(0)}
                    className="text-[10px] text-amber-400 hover:underline px-1 cursor-pointer"
                  >
                    Về gốc
                  </button>
                )}
              </div>
            </div>

            {/* Bát Trạch toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBatTrachOnLuopan(!showBatTrachOnLuopan)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  showBatTrachOnLuopan
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
                title="Bật/Tắt hiển thị vòng Bát Trạch Du Niên (Sinh Khí, Thiên Y, Diên Niên...) trên đĩa La Kinh"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vòng Bát Trạch La Kinh: {showBatTrachOnLuopan ? 'BẬT' : 'TẮT'}</span>
              </button>

              <button
                onClick={() => setShowBatTrachOnGrid(!showBatTrachOnGrid)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  showBatTrachOnGrid
                    ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
                title="Bật/Tắt hiển thị sao Bát Trạch trong 9 ô Cửu Cung"
              >
                <span>Bát Trạch Cửu Cung: {showBatTrachOnGrid ? 'BẬT' : 'TẮT'}</span>
              </button>
            </div>
          </div>

          {/* Row 2: Cửu Cung Rotation & Dimensions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-300 font-bold flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                  Xoay Cửu Cung:
                </span>
                <button
                  onClick={() => {
                    setAutoRotateWithFacing(!autoRotateWithFacing);
                    if (!autoRotateWithFacing) setGridRotationOffset(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    autoRotateWithFacing
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                  title="Tự động xoay Cửu Cung theo số độ hướng nhà"
                >
                  {autoRotateWithFacing ? '★ Theo Hướng nhà' : 'Tự do'}
                </button>
              </div>

              {/* Rotation Fine Tune Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setGridRotationOffset((prev) => normalizeDegree(prev - 5))}
                  className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px]"
                  title="Xoay -5°"
                >
                  -5°
                </button>
                <button
                  onClick={() => setGridRotationOffset((prev) => normalizeDegree(prev - 1))}
                  className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px]"
                  title="Xoay -1°"
                >
                  -1°
                </button>
                <span className="font-mono text-blue-400 font-bold px-1.5 min-w-[42px] text-center">
                  {autoRotateWithFacing
                    ? `${normalizeDegree(facingDegree + gridRotationOffset)}°`
                    : `${gridRotationOffset}°`}
                </span>
                <button
                  onClick={() => setGridRotationOffset((prev) => normalizeDegree(prev + 1))}
                  className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px]"
                  title="Xoay +1°"
                >
                  +1°
                </button>
                <button
                  onClick={() => setGridRotationOffset((prev) => normalizeDegree(prev + 5))}
                  className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px]"
                  title="Xoay +5°"
                >
                  +5°
                </button>
                <button
                  onClick={() => setGridRotationOffset(0)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] font-semibold ml-1"
                  title="Đặt lại góc khớp chính diện hướng nhà"
                >
                  Khớp chuẩn
                </button>
              </div>

              {/* Keep text upright toggle */}
              <button
                onClick={() => setKeepTextUpright(!keepTextUpright)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  keepTextUpright
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
                title="Giữ các con số và tên cung luôn thẳng đứng dễ đọc khi lưới xoay"
              >
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>{keepTextUpright ? 'Chữ thẳng đứng' : 'Chữ xoay theo lưới'}</span>
              </button>
            </div>

            {/* Grid Dimensions (Width x Height) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-zinc-400 font-medium">Khung nhà:</span>
                <span className="text-zinc-300 font-mono text-[11px]">
                  {gridWidth} × {gridHeight}px
                </span>
              </div>

              <button
                onClick={() => {
                  const nextLock = !lockAspect;
                  setLockAspect(nextLock);
                  if (nextLock) setGridHeight(gridWidth);
                }}
                className={`p-1 rounded transition-colors ${
                  lockAspect ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={lockAspect ? 'Đang khóa tỷ lệ vuông (1:1)' : 'Cho phép chỉnh dài x rộng độc lập cho nhà ống'}
              >
                {lockAspect ? <Link className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Floating Slider Controls (Opacity, Radius, Scale) */}
        <div className="w-full bg-stone-900/95 border-t border-zinc-800 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Opacity slider */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400 font-medium">Độ mờ:</span>
            <input
              type="range"
              min={0.15}
              max={0.95}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-20 sm:w-24 h-1.5 bg-zinc-700 rounded cursor-pointer accent-amber-500"
            />
            <span className="text-amber-300 font-mono text-[11px] w-8">
              {Math.round(opacity * 100)}%
            </span>
          </div>

          {/* Luopan Radius slider */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-zinc-400 font-medium">Kính La Bàn:</span>
            <input
              type="range"
              min={180}
              max={560}
              step={10}
              value={luopanRadius}
              onChange={(e) => setLuopanRadius(parseInt(e.target.value))}
              className="w-20 sm:w-24 h-1.5 bg-zinc-700 rounded cursor-pointer accent-rose-500"
            />
            <span className="text-rose-300 font-mono text-[11px] w-8">
              {luopanRadius}px
            </span>
          </div>

          {/* Nine Palace Grid Size slider (Width & Height) */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-zinc-400 font-medium">Cỡ Lưới:</span>
            <input
              type="range"
              min={200}
              max={720}
              step={10}
              value={gridWidth}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setGridWidth(val);
                if (lockAspect) setGridHeight(val);
              }}
              className="w-20 sm:w-24 h-1.5 bg-zinc-700 rounded cursor-pointer accent-blue-500"
            />
            <span className="text-blue-300 font-mono text-[11px] w-8">
              {gridWidth}px
            </span>
          </div>

          {/* Zoom In / Out Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoomScale((prev) => Math.max(prev - 0.1, 0.4))}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              title="Thu nhỏ bản vẽ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-zinc-300 font-mono px-1">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((prev) => Math.min(prev + 0.1, 2.5))}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              title="Phóng to bản vẽ"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Information Panel for Active Compass / Ruler */}
      <CompassInfoPanel
        compassType={activeCompass}
        facingDegree={facingDegree}
        analysis={analysis}
        batTrachAnalysis={batTrachAnalysis}
        onOpenLuBanModal={() => setIsLuBanModalOpen(true)}
        onOpenCompassModal={() => setIsCompassModalOpen(true)}
      />

      {/* Compass Selector Modal */}
      <CompassSelectorModal
        isOpen={isCompassModalOpen}
        onClose={() => setIsCompassModalOpen(false)}
        selectedCompass={activeCompass}
        onSelectCompass={setActiveCompass}
      />

      {/* Lu Ban Ruler Modal (3-in-1: 52.2cm, 42.9cm, 38.8cm) */}
      <LuBanRulerModal
        isOpen={isLuBanModalOpen}
        onClose={() => setIsLuBanModalOpen(false)}
      />
    </div>
  );
};
