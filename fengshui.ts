export type YuanType = 'Địa' | 'Thiên' | 'Nhân';
export type ElementType = 'Thủy' | 'Hỏa' | 'Mộc' | 'Kim' | 'Thổ';
export type PolarityType = '+' | '-';

export interface Mountain24 {
  id: number; // 0 to 23
  name: string; // e.g. "Tý", "Ngọ"
  hanzi: string; // e.g. "子", "午"
  trigram: string; // e.g. "Khảm", "Ly"
  trigramHanzi: string; // "坎", "离"
  palaceNumber: number; // 1 to 9 (Luo Shu original number)
  directionName: string; // "Bắc", "Nam", "Đông", "Tây", "Tây Bắc", ...
  yuan: YuanType; // Địa, Thiên, Nhân
  polarity: PolarityType; // + (Dương) or - (Âm)
  element: ElementType;
  centerDeg: number; // e.g. 0 for Tý, 180 for Ngọ
  startDeg: number; // e.g. 352.5 for Tý
  endDeg: number; // e.g. 7.5 for Tý
}

export interface PalaceData {
  palaceNumber: number; // 1 to 9 (Luo Shu)
  name: string; // e.g. "Khảm (Chính Bắc)"
  shortName: string; // e.g. "Bắc"
  directionCode: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW' | 'C';
  trigram: string;
  trigramSymbol: string; // e.g. "☵"
  element: ElementType;
  originalStar: number; // Base Luo Shu star
  periodStar: number; // Vận tinh
  mountainStar: number; // Sơn tinh (Sao Tọa)
  mountainPolarity: PolarityType; // + or -
  facingStar: number; // Hướng tinh (Sao Hướng)
  facingPolarity: PolarityType; // + or -
  isSitting: boolean; // Tọa cung
  isFacing: boolean; // Hướng cung
  isCenter: boolean;
  combinationKey: string; // e.g. "9-9", "8-1"
  auspiciousness: 'Đại Cát' | 'Cát' | 'Bình' | 'Hung' | 'Đại Hung';
  summary: string;
}

export interface ChartFormation {
  type: 'VUONG_SON_VUONG_HUONG' | 'SONG_TINH_DAO_HUONG' | 'SONG_TINH_DAO_TOA' | 'THUONG_SON_HA_THUY' | 'BINH_THUONG';
  title: string;
  badgeColor: string;
  description: string;
  rating: string;
  recommendations: string[];
}

export interface ThanhMonGate {
  palaceNum: number;
  palaceName: string;
  mountain: Mountain24;
  isChinhThanhMon: boolean; // true: Chính Thành Môn, false: Phụ (Bàng) Thành Môn
  periodStar: number; // Vận tinh tại cung này
  originalMountainOfPeriodStar: Mountain24 | null; // Sơn tương ứng cùng Nguyên Long trong bản cung gốc
  polarity: PolarityType;
  flightType: 'Thuận' | 'Nghịch';
  isUsable: boolean; // true nếu bay Nghịch (sao 9 đáo khẩu tại Vận 9) -> Đắc Thành Môn
  rating: string;
  description: string;
}

export interface ThanhMonAnalysis {
  facingMountain: Mountain24;
  period: number;
  yuan: YuanType;
  chinhThanhMon: ThanhMonGate;
  phuThanhMon: ThanhMonGate;
  usableGates: ThanhMonGate[];
  summary: string;
  recommendations: string[];
}

export type FlyingStarChartMode = 'auto' | 'ha_quai' | 'the_quai';

export interface TheQuaiDetails {
  mountainStarBase: number; // Sao Vận tinh tại Tọa
  mountainStarSubstitute: number; // Sao Thế Tinh tại Tọa
  mountainSubstitutedMountain: string; // Tên sơn tra Thế Tinh
  mountainPolarity: PolarityType;
  mountainFlightReason: string;

  facingStarBase: number; // Sao Vận tinh tại Hướng
  facingStarSubstitute: number; // Sao Thế Tinh tại Hướng
  facingSubstitutedMountain: string; // Tên sơn tra Thế Tinh
  facingPolarity: PolarityType;
  facingFlightReason: string;
}

export interface ChartAnalysis {
  facingDegree: number;
  period: number;
  sittingDegree: number;
  facingMountain: Mountain24;
  sittingMountain: Mountain24;
  isKiemHuong: boolean; // true if within 4.5° - 7.5° from center
  deviationFromCenter: number; // degrees deviation
  isKhongVong: boolean; // true if near boundary (within 1.5° of edge)
  khongVongType?: 'Đại Không Vong' | 'Tiểu Không Vong' | 'Không';
  chartType: 'HA_QUAI' | 'THE_QUAI'; // Tinh Bàn Hạ Quái (Chính Hướng) hay Thế Quái (Kiêm Hướng)
  chartMode: FlyingStarChartMode; // Chế độ tính toán (auto, ha_quai, the_quai)
  theQuaiDetails?: TheQuaiDetails; // Chi tiết thay sao Thế Quái
  formation: ChartFormation;
  palaces: Record<number, PalaceData>;
  thanhMon?: ThanhMonAnalysis;
}

export type BatTrachStarType =
  | 'Sinh Khí'
  | 'Thiên Y'
  | 'Diên Niên'
  | 'Phục Vị'
  | 'Tuyệt Mệnh'
  | 'Ngũ Quỷ'
  | 'Lục Sát'
  | 'Họa Hại';

export interface BatTrachStarInfo {
  name: BatTrachStarType;
  alias: string; // e.g. "Tham Lang Mộc", "Cự Môn Thổ"
  nature: 'Cát' | 'Đại Cát' | 'Thứ Cát' | 'Tiểu Cát' | 'Hung' | 'Đại Hung' | 'Thứ Hung' | 'Tiểu Hung';
  isGood: boolean;
  element: ElementType;
  meaning: string;
  badgeClass: string;
}

export interface OwnerProfile {
  birthYear: number;
  gender: 'nam' | 'nu';
  canChi: string; // e.g. "Ất Sửu"
  menhNguHanh: string; // e.g. "Hải Trung Kim"
  cungPhi: string; // e.g. "Càn", "Khôn"
  cungPhiNguHanh: string; // e.g. "+ Thổ", "- Thổ", "+ Kim", etc.
  cungPhiNumber: number; // 1-9
  nhomMenh: 'Đông Tứ Mệnh' | 'Tây Tứ Mệnh';
}

export interface BatTrachPalaceInfo {
  palaceNumber: number;
  directionName: string;
  trigram: string;
  houseStar: BatTrachStarInfo; // Star according to house sitting (Trạch mệnh nhà)
  ownerStar?: BatTrachStarInfo; // Star according to owner profile (Mệnh quái gia chủ)
}

export interface BatTrachAnalysis {
  houseTrach: {
    name: string; // e.g. "Khảm Trạch"
    group: 'Đông Tứ Trạch' | 'Tây Tứ Trạch';
    sittingTrigram: string;
    facingTrigram: string;
  };
  owner?: OwnerProfile;
  compatibility?: {
    isCompatible: boolean;
    rating: string;
    description: string;
  };
  palaces: Record<number, BatTrachPalaceInfo>;
}

export type CompassType =
  | 'battrach'
  | 'diaban24'
  | 'tieusa'
  | 'napthuy'
  | 'xuyenson'
  | 'thaudia'
  | 'phankim120'
  | 'phucduc24'
  | 'huyenkhong'
  | 'daiquai'
  | 'tonghop'
  | 'loban';

export interface CompassRulerOption {
  id: CompassType;
  title: string;
  badge?: string; // e.g. "Bản Pro"
  subtitle: string;
  description: string;
  category: 'tamhop' | 'tamnguyen' | 'battrach' | 'toannang' | 'thuoc';
  iconName: string;
  accentColor: string;
}

export interface LuBanResult {
  mm: number;
  cm: number;
  ruler522: {
    palace: string;
    subPalace: string;
    isGood: boolean;
    meaning: string;
  };
  ruler429: {
    palace: string;
    subPalace: string;
    isGood: boolean;
    meaning: string;
  };
  ruler388: {
    palace: string;
    subPalace: string;
    isGood: boolean;
    meaning: string;
  };
}


