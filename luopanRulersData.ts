import { CompassRulerOption, CompassType, ElementType, LuBanResult } from '../types/fengshui';

// 12 COMPASS & RULER TYPES AS REQUESTED BY USER (with "Bản Pro" badges)
export const COMPASS_RULERS_LIST: CompassRulerOption[] = [
  {
    id: 'battrach',
    title: 'Bát Trạch Minh Cảnh',
    badge: 'Bản Pro',
    subtitle: 'Bát Trạch & 8 Cung Du Niên Gia Chủ',
    description: 'Chiếu 8 cung Du Niên (Sinh Khí, Diên Niên, Thiên Y, Phục Vị, Họa Hại, Lục Sát, Ngũ Quỷ, Tuyệt Mệnh) theo quái mệnh nhà và tuổi chủ nhà.',
    category: 'battrach',
    iconName: 'ShieldCheck',
    accentColor: '#10b981',
  },
  {
    id: 'diaban24',
    title: '24 Sơn Địa Bàn',
    badge: 'Chính Châm',
    subtitle: 'Địa Bàn Chính Châm 24 Sơn Căn Bản',
    description: '24 Sơn Hướng tiêu chuẩn (12 Địa Chi, 8 Thiên Can, 4 Quái), Bát Quái Tiên Thiên & Hậu Thiên, Tứ Chính Tứ Duy chuẩn 360°.',
    category: 'tamhop',
    iconName: 'Compass',
    accentColor: '#3b82f6',
  },
  {
    id: 'phucduc24',
    title: '24 Vị Phúc Đức',
    badge: 'Bản Pro',
    subtitle: 'Khai Môn Phóng Thủy & An Cửa Cát Hung',
    description: '24 vị thần Phúc Đức (Phúc Đức, Tấn Tài, Quan Tước, Vinh Phú, Vượng Trang, Tấn Điền... kỵ Ôn Hoàng, Tuyệt Tự, Pháp Trường).',
    category: 'battrach',
    iconName: 'Sparkles',
    accentColor: '#8b5cf6',
  },
  {
    id: 'tieusa',
    title: 'Tiêu Sa (Nhân Bàn)',
    badge: 'Bản Pro',
    subtitle: 'Tam Hợp Phái · Nhân Bàn Trung Châm (-7.5°)',
    description: 'Vòng 24 Sơn Trung Châm lệch -7.5°, phân định Ngũ Hành Tiêu Sa (Sinh Sa, Vượng Sa, Nô Sa, Sát Sa, Tiết Sa) để thẩm định hình thế xung quanh.',
    category: 'tamhop',
    iconName: 'Mountain',
    accentColor: '#f59e0b',
  },
  {
    id: 'napthuy',
    title: 'Nạp Thủy (Thiên Bàn)',
    badge: 'Bản Pro',
    subtitle: 'Tam Hợp Phái · Thiên Bàn Phùng Châm (+7.5°)',
    description: 'Vòng 24 Sơn Phùng Châm lệch +7.5°, Song Sơn Nạp Thủy (Hỏa, Kim, Thủy, Mộc cục), Bát Cán Hoàng Tuyền & 12 Cung Trường Sinh Thủy Pháp.',
    category: 'tamhop',
    iconName: 'Droplets',
    accentColor: '#06b6d4',
  },
  {
    id: 'xuyenson',
    title: '72 Xuyên Sơn Long',
    badge: 'Bản Pro',
    subtitle: 'Thất Thập Nhị Long · Định Khí Mạch Huyệt Đạo',
    description: 'Mỗi sơn chia 3 long (5°/long). Định khí lai long vào mạch nhà đất, phân định Chính Khí (Chu Bảo cát tường) hay Sai Thố, Cô Hư, Không Vong hung sát.',
    category: 'tamhop',
    iconName: 'Compass',
    accentColor: '#6366f1',
  },
  {
    id: 'thaudia',
    title: '60 Thấu Địa Long',
    badge: 'Bản Pro',
    subtitle: 'Lục Thập Long · Dẫn Khí Nhập Trạch Nền Móng',
    description: '60 long Giáp Tý (6°/long). Dùng định mạch dẫn khí từ long nhập huyệt hoặc đặt móng trục nhà, xét vượng tướng suy thoái.',
    category: 'tamhop',
    iconName: 'Compass',
    accentColor: '#14b8a6',
  },
  {
    id: 'phankim120',
    title: '120 Phân Kim',
    badge: 'Bản Pro',
    subtitle: 'Bách Nhị Thập Phân Kim · Điểm Huyệt Đặt Hướng',
    description: 'Mỗi sơn chia 5 phân kim (3°/phân kim). Dùng tuyến Bính - Canh vượng khí chính tài, tránh hung tuyến Mậu - Kỷ (Sát Cô Hư Không Vong).',
    category: 'tamhop',
    iconName: 'Compass',
    accentColor: '#d97706',
  },
  {
    id: 'huyenkhong',
    title: 'Huyền Không Phi Tinh',
    badge: 'Bản Pro',
    subtitle: 'Tinh Bàn Cửu Cung Vận 9 (2024 - 2043)',
    description: 'Tinh bàn 9 cung: Vận Tinh, Sơn Tinh (Tọa), Hướng Tinh, tổ hợp 81 tinh bàn và phân loại cách cục (Vượng Sơn Vượng Hướng, Song Tinh...).',
    category: 'tamnguyen',
    iconName: 'Grid',
    accentColor: '#a855f7',
  },
  {
    id: 'daiquai',
    title: 'Đại Quái 64 Quẻ',
    badge: 'Bản Pro',
    subtitle: 'Huyền Không Đại Quái Tiên Thiên Kinh Dịch',
    description: 'Vòng 64 Quẻ Tiên Thiên xếp tròn 360°, Quái Vận (1-9), Quái Số (Ngũ Hành), phân kim hào cát hung, hợp thập sinh thành diệu dụng.',
    category: 'tamnguyen',
    iconName: 'Sparkles',
    accentColor: '#ec4899',
  },
  {
    id: 'tonghop',
    title: 'La Kinh Tổng Hợp',
    badge: 'Toàn Năng',
    subtitle: 'Đĩa La Kinh Đa Tầng Tam Hợp - Tam Nguyên',
    description: 'Tích hợp đầy đủ tất cả các tầng: 360°, 24 Sơn Địa Bàn, Nhân Bàn, Thiên Bàn, 72 Long, 120 Phân Kim, Bát Trạch & 64 Quẻ Đại Quái.',
    category: 'toannang',
    iconName: 'Compass',
    accentColor: '#ea580c',
  },
  {
    id: 'loban',
    title: 'Thước Lỗ Ban 3 Trong 1',
    badge: 'Chuẩn mm',
    subtitle: 'Bộ 3 Thước Phong Thủy Chuẩn mm',
    description: 'Đo kích thước Thông Thủy (522mm cửa nẻo), Dương Trạch (429mm nội thất bếp bậc) và Âm Phần (388mm bàn thờ gia tiên) chuẩn xác từng milimet (mm).',
    category: 'thuoc',
    iconName: 'Ruler',
    accentColor: '#e11d48',
  },
];

// ==========================================
// 1. TIÊU SA (TAM HỢP - NHÂN BÀN TRUNG CHÂM)
// ==========================================
// Nhân Bàn Trung Châm quay lùi 7.5° so với Chính Châm (Địa bàn).
// Ngũ Hành Tiêu Sa của 24 Sơn:
// - Hỏa: Tý, Ngọ, Mão, Dậu, Giáp, Canh, Nhâm, Bính
// - Mộc: Càn, Khôn, Cấn, Tốn
// - Thủy: Dần, Thân, Tỵ, Hợi
// - Kim: Thìn, Tuất, Sửu, Mùi
// - Thổ: Ất, Tân, Đinh, Quý
export interface TieuSaMountain {
  name: string;
  centerDeg: number; // Trong Nhân bàn (centerDeg chính châm - 7.5)
  element: ElementType;
  hanzi: string;
}

export const TIEU_SA_ELEMENTS: Record<string, ElementType> = {
  // Hỏa: Tứ chính + Tứ can dương
  Tý: 'Hỏa', Ngọ: 'Hỏa', Mão: 'Hỏa', Dậu: 'Hỏa',
  Giáp: 'Hỏa', Canh: 'Hỏa', Nhâm: 'Hỏa', Bính: 'Hỏa',
  // Mộc: Tứ duy
  Càn: 'Mộc', Khôn: 'Mộc', Cấn: 'Mộc', Tốn: 'Mộc',
  // Thủy: Tứ sinh
  Dần: 'Thủy', Thân: 'Thủy', Tỵ: 'Thủy', Hợi: 'Thủy',
  // Kim: Tứ mộ
  Thìn: 'Kim', Tuất: 'Kim', Sửu: 'Kim', Mùi: 'Kim',
  // Thổ: Tứ can âm
  Ất: 'Thổ', Tân: 'Thổ', Đinh: 'Thổ', Quý: 'Thổ',
};

export interface SaRelationResult {
  relationName: 'Sinh Sa' | 'Vượng Sa' | 'Nô Sa' | 'Sát Sa' | 'Tiết Sa';
  nature: 'Đại Cát' | 'Cát' | 'Đại Hung' | 'Hung';
  isGood: boolean;
  color: string;
  meaning: string;
}

// Ngũ hành tương sinh tương khắc
export function getSaRelation(sittingElement: ElementType, saElement: ElementType): SaRelationResult {
  if (saElement === sittingElement) {
    return {
      relationName: 'Vượng Sa',
      nature: 'Cát',
      isGood: true,
      color: '#10b981',
      meaning: 'Đồng hành trợ lực: Vượng khí dồi dào, điền sản hưng vượng, anh em hòa thuận.',
    };
  }

  // Sinh sa: Sa sinh Tọa (Sa hành -> Tọa hành)
  const isSaSinhToa =
    (saElement === 'Mộc' && sittingElement === 'Hỏa') ||
    (saElement === 'Hỏa' && sittingElement === 'Thổ') ||
    (saElement === 'Thổ' && sittingElement === 'Kim') ||
    (saElement === 'Kim' && sittingElement === 'Thủy') ||
    (saElement === 'Thủy' && sittingElement === 'Mộc');

  if (isSaSinhToa) {
    return {
      relationName: 'Sinh Sa',
      nature: 'Đại Cát',
      isGood: true,
      color: '#059669',
      meaning: 'Sa sinh bản tọa: Chủ về đại quý, đỗ đạt công danh, nhân đinh phát triển hưng thịnh.',
    };
  }

  // Nô sa (Tài sa): Tọa khắc Sa
  const isToaKhacSa =
    (sittingElement === 'Kim' && saElement === 'Mộc') ||
    (sittingElement === 'Mộc' && saElement === 'Thổ') ||
    (sittingElement === 'Thổ' && saElement === 'Thủy') ||
    (sittingElement === 'Thủy' && saElement === 'Hỏa') ||
    (sittingElement === 'Hỏa' && saElement === 'Kim');

  if (isToaKhacSa) {
    return {
      relationName: 'Nô Sa',
      nature: 'Cát',
      isGood: true,
      color: '#2563eb',
      meaning: 'Tọa khắc sa là Nô Sa (Tài Sa): Chủ về tài lộc hanh thông, tôi tớ trung thành, tiền tài dồi dào.',
    };
  }

  // Sát sa: Sa khắc Tọa
  const isSaKhacToa =
    (saElement === 'Kim' && sittingElement === 'Mộc') ||
    (saElement === 'Mộc' && sittingElement === 'Thổ') ||
    (saElement === 'Thổ' && sittingElement === 'Thủy') ||
    (saElement === 'Thủy' && sittingElement === 'Hỏa') ||
    (saElement === 'Hỏa' && sittingElement === 'Kim');

  if (isSaKhacToa) {
    return {
      relationName: 'Sát Sa',
      nature: 'Đại Hung',
      isGood: false,
      color: '#dc2626',
      meaning: 'Sa khắc bản tọa: Cực hung sát, chủ tai họa bất ngờ, thương tật, tổn hại nhân đinh, quan tụng.',
    };
  }

  // Tiết sa: Tọa sinh Sa
  return {
    relationName: 'Tiết Sa',
    nature: 'Hung',
    isGood: false,
    color: '#ea580c',
    meaning: 'Tọa sinh xuất cho Sa: Tiết hao nguyên khí, người suy nhược, hao tán gia sản, thoái tài.',
  };
}

// ==========================================
// 2. NẠP THỦY (TAM HỢP - THIÊN BÀN PHÙNG CHÂM)
// ==========================================
// Thiên Bàn Phùng Châm quay tiến 7.5° so với Chính Châm (Địa bàn).
// Song Sơn Ngũ Hành (Tam Hợp Cục):
// - Hỏa cục: Cấn Dần, Bính Ngọ, Tân Tuất
// - Kim cục: Tốn Tỵ, Canh Dậu, Quý Sửu
// - Thủy cục: Khôn Thân, Nhâm Tý, Ất Thìn
// - Mộc cục: Càn Hợi, Giáp Mão, Đinh Mùi
export const SONG_SON_MAP: Record<string, { group: string; cuc: 'Hỏa Cục' | 'Kim Cục' | 'Thủy Cục' | 'Mộc Cục'; element: ElementType }> = {
  'Cấn': { group: 'Cấn Dần', cuc: 'Hỏa Cục', element: 'Hỏa' },
  'Dần': { group: 'Cấn Dần', cuc: 'Hỏa Cục', element: 'Hỏa' },
  'Bính': { group: 'Bính Ngọ', cuc: 'Hỏa Cục', element: 'Hỏa' },
  'Ngọ': { group: 'Bính Ngọ', cuc: 'Hỏa Cục', element: 'Hỏa' },
  'Tân': { group: 'Tân Tuất', cuc: 'Hỏa Cục', element: 'Hỏa' },
  'Tuất': { group: 'Tân Tuất', cuc: 'Hỏa Cục', element: 'Hỏa' },

  'Tốn': { group: 'Tốn Tỵ', cuc: 'Kim Cục', element: 'Kim' },
  'Tỵ': { group: 'Tốn Tỵ', cuc: 'Kim Cục', element: 'Kim' },
  'Canh': { group: 'Canh Dậu', cuc: 'Kim Cục', element: 'Kim' },
  'Dậu': { group: 'Canh Dậu', cuc: 'Kim Cục', element: 'Kim' },
  'Quý': { group: 'Quý Sửu', cuc: 'Kim Cục', element: 'Kim' },
  'Sửu': { group: 'Quý Sửu', cuc: 'Kim Cục', element: 'Kim' },

  'Khôn': { group: 'Khôn Thân', cuc: 'Thủy Cục', element: 'Thủy' },
  'Thân': { group: 'Khôn Thân', cuc: 'Thủy Cục', element: 'Thủy' },
  'Nhâm': { group: 'Nhâm Tý', cuc: 'Thủy Cục', element: 'Thủy' },
  'Tý': { group: 'Nhâm Tý', cuc: 'Thủy Cục', element: 'Thủy' },
  'Ất': { group: 'Ất Thìn', cuc: 'Thủy Cục', element: 'Thủy' },
  'Thìn': { group: 'Ất Thìn', cuc: 'Thủy Cục', element: 'Thủy' },

  'Càn': { group: 'Càn Hợi', cuc: 'Mộc Cục', element: 'Mộc' },
  'Hợi': { group: 'Càn Hợi', cuc: 'Mộc Cục', element: 'Mộc' },
  'Giáp': { group: 'Giáp Mão', cuc: 'Mộc Cục', element: 'Mộc' },
  'Mão': { group: 'Giáp Mão', cuc: 'Mộc Cục', element: 'Mộc' },
  'Đinh': { group: 'Đinh Mùi', cuc: 'Mộc Cục', element: 'Mộc' },
  'Mùi': { group: 'Đinh Mùi', cuc: 'Mộc Cục', element: 'Mộc' },
};

// Bát Cán Hoàng Tuyền Thủy Pháp (Cực kỳ quan trọng trong phong thủy nạp thủy)
export interface HoangTuyenRule {
  facingMountain: string;
  hoangTuyenSons: string[];
  verse: string;
  warning: string;
}

export const HOANG_TUYEN_RULES: Record<string, HoangTuyenRule> = {
  'Canh': {
    facingMountain: 'Canh',
    hoangTuyenSons: ['Khôn', 'Thân'],
    verse: 'Canh Đinh khôn thượng thị hoàng tuyền',
    warning: 'Hướng Canh kỵ thủy tại phương Khôn/Thân đến hoặc đi, phạm Hoàng Tuyền sát chủ bại vong.',
  },
  'Đinh': {
    facingMountain: 'Đinh',
    hoangTuyenSons: ['Khôn', 'Thân'],
    verse: 'Canh Đinh khôn thượng thị hoàng tuyền',
    warning: 'Hướng Đinh kỵ thủy tại phương Khôn/Thân đến hoặc đi, phạm Hoàng Tuyền sát.',
  },
  'Khôn': {
    facingMountain: 'Khôn',
    hoangTuyenSons: ['Canh', 'Đinh'],
    verse: 'Khôn hướng Canh Đinh bất khả ngôn',
    warning: 'Hướng Khôn kỵ xuất thủy ở Canh và Đinh, chủ tổn nhân đinh phá tài.',
  },
  'Ất': {
    facingMountain: 'Ất',
    hoangTuyenSons: ['Tốn', 'Tỵ'],
    verse: 'Ất Bính phòng tốn thủy',
    warning: 'Hướng Ất kỵ nước phương Tốn/Tỵ chảy đến hoặc phóng xuất.',
  },
  'Bính': {
    facingMountain: 'Bính',
    hoangTuyenSons: ['Tốn', 'Tỵ'],
    verse: 'Ất Bính phòng tốn thủy',
    warning: 'Hướng Bính kỵ nước phương Tốn/Tỵ, phạm Hoàng Tuyền sát.',
  },
  'Tốn': {
    facingMountain: 'Tốn',
    hoangTuyenSons: ['Ất', 'Bính'],
    verse: 'Tốn hướng Ất Bính họa diên miên',
    warning: 'Hướng Tốn kỵ phóng thủy ở Ất và Bính, họa hại triền miên.',
  },
  'Giáp': {
    facingMountain: 'Giáp',
    hoangTuyenSons: ['Cấn', 'Dần'],
    verse: 'Giáp Quý hướng trung ưu kiến cấn',
    warning: 'Hướng Giáp kỵ thủy tại Cấn/Dần, chủ tổn thương trưởng nam.',
  },
  'Quý': {
    facingMountain: 'Quý',
    hoangTuyenSons: ['Cấn', 'Dần'],
    verse: 'Giáp Quý hướng trung ưu kiến cấn',
    warning: 'Hướng Quý kỵ thấy thủy phương Cấn/Dần, tai họa liên tiếp.',
  },
  'Cấn': {
    facingMountain: 'Cấn',
    hoangTuyenSons: ['Giáp', 'Quý'],
    verse: 'Cấn phùng Giáp Quý tất hung tàn',
    warning: 'Hướng Cấn kỵ phóng thủy ở Giáp và Quý, cực kỳ hung hại.',
  },
  'Tân': {
    facingMountain: 'Tân',
    hoangTuyenSons: ['Càn', 'Hợi'],
    verse: 'Tân Nhâm càn lộ tối vi sầu',
    warning: 'Hướng Tân kỵ thủy phương Càn/Hợi, chủ chia ly phiền muộn.',
  },
  'Nhâm': {
    facingMountain: 'Nhâm',
    hoangTuyenSons: ['Càn', 'Hợi'],
    verse: 'Tân Nhâm càn lộ tối vi sầu',
    warning: 'Hướng Nhâm kỵ thủy phương Càn/Hợi, phạm Hoàng Tuyền sát.',
  },
  'Càn': {
    facingMountain: 'Càn',
    hoangTuyenSons: ['Tân', 'Nhâm'],
    verse: 'Càn kiến Tân Nhâm đoạt ái nan',
    warning: 'Hướng Càn kỵ xuất thủy phương Tân và Nhâm, chủ tổn thọ và hao tài.',
  },
};

// ==========================================
// 3. BÁT TRẠCH 24 SƠN PHÚC ĐỨC
// ==========================================
export interface PhucDucStar {
  id: number;
  name: string;
  nature: 'Cát' | 'Đại Cát' | 'Hung' | 'Đại Hung';
  isGood: boolean;
  meaning: string;
}

export const PHUC_DUC_24_STARS: PhucDucStar[] = [
  { id: 1, name: 'Phúc Đức', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, gia đạo bình an, phúc lộc trường cửu, con cháu hiếu thảo.' },
  { id: 2, name: 'Ôn Hoàng', nature: 'Đại Hung', isGood: false, meaning: 'Đại hung, dịch bệnh truyền nhiễm, gia súc tổn hại, hao tài tốn của.' },
  { id: 3, name: 'Tấn Tài', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, tiền bạc sinh sôi, kinh doanh phát đạt, đất đai gia tăng.' },
  { id: 4, name: 'Trường Bệnh', nature: 'Hung', isGood: false, meaning: 'Hung, ốm đau quặt quẹo kéo dài, thuốc men tốn kém, người gầy mòn.' },
  { id: 5, name: 'Tố Tụng', nature: 'Hung', isGood: false, meaning: 'Hung, tranh chấp khẩu thiệt, kiện tụng quan tòa, tiểu nhân hãm hại.' },
  { id: 6, name: 'Quan Tước', nature: 'Cát', isGood: true, meaning: 'Cát, thăng quan tiến chức, nắm quyền chức cao, thi cử đỗ bảng vàng.' },
  { id: 7, name: 'Quan Quý', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, quý nhân phù trợ, địa vị hiển hách, sinh con quý tử thông minh.' },
  { id: 8, name: 'Tự Ải', nature: 'Đại Hung', isGood: false, meaning: 'Đại hung, tinh thần u uất, dễ sinh quẫn trí tự hại, tuyệt vọng buồn rầu.' },
  { id: 9, name: 'Vượng Trang', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, mua thêm ruộng vườn nhà cửa, sản nghiệp gia tăng bề thế.' },
  { id: 10, name: 'Hưng Phước', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, phước đức thăng hoa, trường thọ an khang, gia đình hạnh phúc.' },
  { id: 11, name: 'Pháp Trường', nature: 'Đại Hung', isGood: false, meaning: 'Đại hung, vướng vào vòng lao lý, tù tội, hình phạt nghiêm trọng.' },
  { id: 12, name: 'Điên Cuồng', nature: 'Đại Hung', isGood: false, meaning: 'Đại hung, tâm thần hoảng loạn, hành vi mất kiểm soát, gia đạo bất an.' },
  { id: 13, name: 'Khẩu Thiệt', nature: 'Hung', isGood: false, meaning: 'Hung, thị phi đàm tiếu, vu oan giá họa, bất hòa lục đục triền miên.' },
  { id: 14, name: 'Vượng Tằm', nature: 'Cát', isGood: true, meaning: 'Cát, chăn nuôi phát triển, công việc thủ công, kinh doanh đều vượng.' },
  { id: 15, name: 'Tấn Điền', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, điền sản đất đai bội thu, của cải sung túc nhiều đời.' },
  { id: 16, name: 'Khốc Khấp', nature: 'Đại Hung', isGood: false, meaning: 'Đại hung, tang tóc bi thương, nước mắt tuôn rơi, chia ly đau buồn.' },
  { id: 17, name: 'Cô Quả', nature: 'Hung', isGood: false, meaning: 'Hung, cô đơn côi cút, góa bụa, tha hương cầu thực, thiếu người chia sẻ.' },
  { id: 18, name: 'Vinh Phú', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, phú quý vinh hoa, giàu sang tột bực, tiếng thơm muôn đời.' },
  { id: 19, name: 'Thiếu Vong', nature: 'Đại Hung', isGood: false, meaning: 'Đại hung, tổn hại người trẻ tuổi, sinh nở khó khăn, yểu chiết thương tâm.' },
  { id: 20, name: 'Xương Dâm', nature: 'Hung', isGood: false, meaning: 'Hung, dâm loạn bại hoại, gia phong thất lễ, tổn hại thanh danh gia đình.' },
  { id: 21, name: 'Thân Hôn', nature: 'Cát', isGood: true, meaning: 'Cát, hôn nhân viên mãn, vợ chồng hòa thuận, kết thân với danh gia vọng tộc.' },
  { id: 22, name: 'Hoan Hỷ', nature: 'Đại Cát', isGood: true, meaning: 'Đại cát, niềm vui ngập tràn, tin vui liên tiếp, gia đạo luôn rộn tiếng cười.' },
  { id: 23, name: 'Bộ Hãm', nature: 'Hung', isGood: false, meaning: 'Hung, trượt ngã sập bẫy, rủi ro tai nạn đi lại, gặp kẻ lừa gạt tiền bạc.' },
  { id: 24, name: 'Tuyệt Tự', nature: 'Đại Hung', isGood: false, meaning: 'Đại hung, hiếm muộn vô tự, đứt đoạn hương hỏa, không người nối dõi.' },
];

// Khởi an 24 Phúc Đức theo quái mệnh/quái trạch:
// Thứ tự 24 Sơn từ Tý theo chiều kim đồng hồ:
export const MOUNTAINS_ORDER_CLOCKWISE = [
  'Tý', 'Quý', 'Sửu', 'Cấn', 'Dần', 'Giáp', 'Mão', 'Ất',
  'Thìn', 'Tốn', 'Tỵ', 'Bính', 'Ngọ', 'Đinh', 'Mùi', 'Khôn',
  'Thân', 'Canh', 'Dậu', 'Tân', 'Tuất', 'Càn', 'Hợi', 'Nhâm'
];

export const PHUC_DUC_START_MOUNTAIN: Record<string, string> = {
  'Càn': 'Hợi',
  'Khảm': 'Dần',
  'Cấn': 'Thân',
  'Chấn': 'Tỵ',
  'Tốn': 'Dậu',
  'Ly': 'Thân',
  'Khôn': 'Mão',
  'Đoài': 'Tỵ',
};

export function getPhucDucStarForMountain(sittingTrigram: string, mountainName: string): PhucDucStar {
  const startM = PHUC_DUC_START_MOUNTAIN[sittingTrigram] || 'Hợi';
  const startIdx = MOUNTAINS_ORDER_CLOCKWISE.indexOf(startM);
  const targetIdx = MOUNTAINS_ORDER_CLOCKWISE.indexOf(mountainName);
  const offset = (targetIdx - startIdx + 24) % 24;
  return PHUC_DUC_24_STARS[offset];
}

// ==========================================
// 4. 72 XUYÊN SƠN LONG (THẤT THẬP NHỊ LONG)
// ==========================================
// 72 Long: Mỗi sơn 3 phân long (5° mỗi long)
// Khởi từ Nhâm Tý đến Quý Hợi (kèm các hào chính khí/không vong).
export interface XuyenSonLongItem {
  id: number;
  centerDeg: number;
  name: string; // Tên Can Chi (Giáp Tý, Bính Tý, Canh Tý...)
  type: 'Chu Bảo (Cát)' | 'Chính Khí (Đại Cát)' | 'Sai Thố (Hung)' | 'Không Vong (Đại Hung)' | 'Cô Hư (Hung)';
  isGood: boolean;
  element: ElementType;
  meaning: string;
}

const CAN_CHI_60 = [
  'Giáp Tý', 'Ất Sửu', 'Bính Dần', 'Đinh Mão', 'Mậu Thìn', 'Kỷ Tỵ', 'Canh Ngọ', 'Tân Mùi', 'Nhâm Thân', 'Quý Dậu',
  'Giáp Tuất', 'Ất Hợi', 'Bính Tý', 'Đinh Sửu', 'Mậu Dần', 'Kỷ Mão', 'Canh Thìn', 'Tân Tỵ', 'Nhâm Ngọ', 'Quý Mùi',
  'Giáp Thân', 'Ất Dậu', 'Bính Tuất', 'Đinh Hợi', 'Mậu Tý', 'Kỷ Sửu', 'Canh Dần', 'Tân Mão', 'Nhâm Thìn', 'Quý Tỵ',
  'Giáp Ngọ', 'Ất Mùi', 'Bính Thân', 'Đinh Dậu', 'Mậu Tuất', 'Kỷ Hợi', 'Canh Tý', 'Tân Sửu', 'Nhâm Dần', 'Quý Mão',
  'Giáp Thìn', 'Ất Tỵ', 'Bính Ngọ', 'Đinh Mùi', 'Mậu Thân', 'Kỷ Dậu', 'Canh Tuất', 'Tân Hợi', 'Nhâm Tý', 'Quý Sửu',
  'Giáp Dần', 'Ất Mão', 'Bính Thìn', 'Đinh Tỵ', 'Mậu Ngọ', 'Kỷ Mùi', 'Canh Thân', 'Tân Dậu', 'Nhâm Tuất', 'Quý Hợi',
];

export const XUYEN_SON_72: XuyenSonLongItem[] = Array.from({ length: 72 }, (_, i) => {
  const centerDeg = i * 5 + 2.5;
  const canChi = CAN_CHI_60[i % 60];
  const can = canChi.slice(0, 4).trim();

  let type: XuyenSonLongItem['type'] = 'Sai Thố (Hung)';
  let isGood = false;
  let meaning = 'Sai Thố: Mạch khí lẫn lộn, chủ về quan phi hoặc phát chậm.';

  if (can.includes('Bính') || can.includes('Đinh')) {
    type = 'Chu Bảo (Cát)';
    isGood = true;
    meaning = 'Chu Bảo Long: Phú quý song toàn, nhân đinh hưng thịnh, đỗ đạt vinh hiển.';
  } else if (can.includes('Canh') || can.includes('Tân')) {
    type = 'Chính Khí (Đại Cát)';
    isGood = true;
    meaning = 'Chính Khí Long: Long khí thuần khiết, gia đạo cát tường, phát phúc bền lâu.';
  } else if (can.includes('Mậu') || can.includes('Kỷ')) {
    type = 'Không Vong (Đại Hung)';
    isGood = false;
    meaning = 'Đại Không Vong: Tử khí sát nhân đinh, thoái tài bại nghiệp, tuyệt tự.';
  } else if (can.includes('Nhâm') || can.includes('Quý')) {
    type = 'Cô Hư (Hung)';
    isGood = false;
    meaning = 'Cô Hư: Khí mạch hàn lãnh, cô đơn góa bụa, tha hương cầu thực.';
  }

  const elements: ElementType[] = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'];
  const element = elements[i % 5];

  return {
    id: i + 1,
    centerDeg,
    name: canChi,
    type,
    isGood,
    element,
    meaning,
  };
});

export function getXuyenSonByDegree(deg: number): XuyenSonLongItem {
  const norm = ((deg % 360) + 360) % 360;
  const idx = Math.floor(norm / 5) % 72;
  return XUYEN_SON_72[idx] || XUYEN_SON_72[0];
}

// ==========================================
// 5. 60 THẤU ĐỊA LONG (LỤC THẬP LONG)
// ==========================================
// 60 Long chia đều 360° (mỗi long 6°)
export interface ThauDiaLongItem {
  id: number;
  centerDeg: number;
  name: string; // Giáp Tý, Ất Sửu...
  rating: 'Đại Cát' | 'Cát' | 'Bình' | 'Hung' | 'Đại Hung';
  isGood: boolean;
  meaning: string;
}

export const THAU_DIA_60: ThauDiaLongItem[] = Array.from({ length: 60 }, (_, i) => {
  const centerDeg = i * 6 + 3;
  const name = CAN_CHI_60[i];
  const can = name.slice(0, 4);

  let rating: ThauDiaLongItem['rating'] = 'Bình';
  let isGood = false;
  let meaning = 'Khí bình thường, cần phối hợp với loan đầu xung quanh.';

  if (can.includes('Bính') || can.includes('Canh')) {
    rating = 'Đại Cát';
    isGood = true;
    meaning = 'Vượng tướng chân long: Địa khí phát tài cực nhanh, con cháu hiển đạt.';
  } else if (can.includes('Đinh') || can.includes('Tân')) {
    rating = 'Cát';
    isGood = true;
    meaning = 'Âm dương hòa hợp: Phúc thọ tăng trưởng, gia sự thuận hòa.';
  } else if (can.includes('Mậu') || can.includes('Kỷ')) {
    rating = 'Đại Hung';
    isGood = false;
    meaning = 'Thất bại không vong: Khí đất tán loạn, kỵ khởi công hay đặt móng.';
  } else {
    rating = 'Hung';
    isGood = false;
    meaning = 'Khí mạch tạp loạn, phát tài không bền.';
  }

  return {
    id: i + 1,
    centerDeg,
    name,
    rating,
    isGood,
    meaning,
  };
});

export function getThauDiaByDegree(deg: number): ThauDiaLongItem {
  const norm = ((deg % 360) + 360) % 360;
  const idx = Math.floor(norm / 6) % 60;
  return THAU_DIA_60[idx] || THAU_DIA_60[0];
}

// ==========================================
// 6. 120 PHÂN KIM (BÁCH NHỊ THẬP PHÂN KIM)
// ==========================================
// 24 Sơn x 5 = 120 Phân kim (mỗi phân kim 3°)
export interface PhanKim120Item {
  id: number;
  centerDeg: number;
  mountainName: string;
  phanKimName: string; // vd: "Bính Tý", "Canh Tý"
  isChauBao: boolean; // Chỉ phân kim Bính & Canh là Châu Bảo Cát
  rating: 'Châu Bảo (Đại Cát)' | 'Thoái Khí (Thứ Cát)' | 'Cô Hư (Đại Hung)';
  meaning: string;
}

const FIVE_CANS = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'];

export const PHAN_KIM_120: PhanKim120Item[] = Array.from({ length: 120 }, (_, i) => {
  const centerDeg = i * 3 + 1.5;
  const mountainIdx = Math.floor(i / 5);
  const mountain = MOUNTAINS_ORDER_CLOCKWISE[mountainIdx % 24] || 'Tý';
  const canIndex = i % 5;
  const canName = FIVE_CANS[canIndex];
  const phanKimName = `${canName} ${mountain}`;

  let isChauBao = false;
  let rating: PhanKim120Item['rating'] = 'Cô Hư (Đại Hung)';
  let meaning = 'Tuyến Cô Hư Mậu Kỷ: Tuyệt đối tránh đặt hướng vì chủ bại vong thoái tài.';

  if (canName === 'Bính' || canName === 'Canh') {
    isChauBao = true;
    rating = 'Châu Bảo (Đại Cát)';
    meaning = 'Tuyến Châu Bảo: Đại phú đại quý, chiêu tài đón lộc, nhân đinh hiển vinh.';
  } else if (canName === 'Giáp' || canName === 'Nhâm') {
    rating = 'Thoái Khí (Thứ Cát)';
    meaning = 'Tuyến thứ: Khí bình hòa nhưng dễ bị tiết khí nếu loan đầu suy.';
  }

  return {
    id: i + 1,
    centerDeg,
    mountainName: mountain,
    phanKimName,
    isChauBao,
    rating,
    meaning,
  };
});

export function getPhanKimByDegree(deg: number): PhanKim120Item {
  const norm = ((deg % 360) + 360) % 360;
  const idx = Math.floor(norm / 3) % 120;
  return PHAN_KIM_120[idx] || PHAN_KIM_120[0];
}

// ==========================================
// 7. HUYỀN KHÔNG ĐẠI QUÁI 64 QUẺ
// ==========================================
export interface DaiQuaiHexagram {
  id: number;
  name: string;
  hanzi: string;
  quaiVan: number; // 1 to 9 (Vận quái)
  quaiSo: number; // 1 to 9 (Ngũ hành quái số)
  centerDeg: number;
  isGood?: boolean; // true: Cát (Tốt - Chữ đỏ), false: Hung (Xấu - Chữ đen)
}

// 64 Quẻ Tiên Thiên Viên Đồ chuẩn Phục Hy - Thiệu Ung (Viên Bàn Huyền Không Đại Quái)
// Trục chuẩn: Thuần Khôn ở Chính Bắc (0° / Sơn Tý), Thuần Càn ở Chính Nam (180° / Sơn Ngọ)
// 32 Quẻ Dương (Dương Nghi): Đi từ Bắc (Khôn/Phục) theo chiều kim đồng hồ qua Đông (Mão - 90°) đến Nam (Càn - 180°)
// 32 Quẻ Âm (Âm Nghi): Đi từ Nam (Cấu) theo chiều kim đồng hồ qua Tây (Dậu - 270°) về lại Bắc (Bác/Khôn - 360°)
export const DAI_QUAI_64: DaiQuaiHexagram[] = [
  // Cực Bắc: Thuần Khôn (0° / 360° - Sơn Tý)
  { id: 1, name: 'Khôn Vi Địa', hanzi: '坤', quaiVan: 1, quaiSo: 1, centerDeg: 0 },

  // Nhóm Hạ Chấn (Nhất Dương Sinh - Khởi đầu 32 quẻ Dương từ Bắc sang Đông)
  { id: 2, name: 'Địa Lôi Phục', hanzi: '复', quaiVan: 8, quaiSo: 1, centerDeg: 5.625 },
  { id: 3, name: 'Sơn Lôi Di', hanzi: '颐', quaiVan: 3, quaiSo: 6, centerDeg: 11.25 },
  { id: 4, name: 'Thủy Lôi Truân', hanzi: '屯', quaiVan: 4, quaiSo: 7, centerDeg: 16.875 },
  { id: 5, name: 'Phong Lôi Ích', hanzi: '益', quaiVan: 9, quaiSo: 2, centerDeg: 22.5 },
  { id: 6, name: 'Thuần Chấn', hanzi: '震', quaiVan: 1, quaiSo: 8, centerDeg: 28.125 },
  { id: 7, name: 'Hỏa Lôi Phệ Hạp', hanzi: '噬嗑', quaiVan: 6, quaiSo: 3, centerDeg: 33.75 },
  { id: 8, name: 'Trạch Lôi Tùy', hanzi: '随', quaiVan: 7, quaiSo: 4, centerDeg: 39.375 },
  { id: 9, name: 'Thiên Lôi Vô Vọng', hanzi: '无妄', quaiVan: 2, quaiSo: 9, centerDeg: 45 },

  // Nhóm Hạ Ly
  { id: 10, name: 'Địa Hỏa Minh Di', hanzi: '明夷', quaiVan: 3, quaiSo: 1, centerDeg: 50.625 },
  { id: 11, name: 'Sơn Hỏa Bí', hanzi: '贲', quaiVan: 8, quaiSo: 6, centerDeg: 56.25 },
  { id: 12, name: 'Thủy Hỏa Ký Tế', hanzi: '既济', quaiVan: 9, quaiSo: 7, centerDeg: 61.875 },
  { id: 13, name: 'Phong Hỏa Gia Nhân', hanzi: '家人', quaiVan: 4, quaiSo: 2, centerDeg: 67.5 },
  { id: 14, name: 'Lôi Hỏa Phong', hanzi: '丰', quaiVan: 6, quaiSo: 8, centerDeg: 73.125 },
  { id: 15, name: 'Thuần Ly', hanzi: '离', quaiVan: 1, quaiSo: 3, centerDeg: 78.75 },
  { id: 16, name: 'Trạch Hỏa Cách', hanzi: '革', quaiVan: 2, quaiSo: 4, centerDeg: 84.375 },
  { id: 17, name: 'Thiên Hỏa Đồng Nhân', hanzi: '同人', quaiVan: 7, quaiSo: 9, centerDeg: 90 }, // Chính Đông - Sơn Mão

  // Nhóm Hạ Đoài
  { id: 18, name: 'Địa Trạch Lâm', hanzi: '临', quaiVan: 4, quaiSo: 1, centerDeg: 95.625 },
  { id: 19, name: 'Sơn Trạch Tổn', hanzi: '损', quaiVan: 9, quaiSo: 6, centerDeg: 101.25 },
  { id: 20, name: 'Thủy Trạch Tiết', hanzi: '节', quaiVan: 8, quaiSo: 7, centerDeg: 106.875 },
  { id: 21, name: 'Phong Trạch Trung Phu', hanzi: '中孚', quaiVan: 3, quaiSo: 2, centerDeg: 112.5 },
  { id: 22, name: 'Lôi Trạch Quy Muội', hanzi: '归妹', quaiVan: 7, quaiSo: 8, centerDeg: 118.125 },
  { id: 23, name: 'Hỏa Trạch Khuê', hanzi: '睽', quaiVan: 2, quaiSo: 3, centerDeg: 123.75 },
  { id: 24, name: 'Thuần Đoài', hanzi: '兑', quaiVan: 1, quaiSo: 4, centerDeg: 129.375 },
  { id: 25, name: 'Thiên Trạch Lý', hanzi: '履', quaiVan: 6, quaiSo: 9, centerDeg: 135 },

  // Nhóm Hạ Càn
  { id: 26, name: 'Địa Thiên Thái', hanzi: '泰', quaiVan: 9, quaiSo: 1, centerDeg: 140.625 },
  { id: 27, name: 'Sơn Thiên Đại Súc', hanzi: '大畜', quaiVan: 4, quaiSo: 6, centerDeg: 146.25 },
  { id: 28, name: 'Thủy Thiên Nhu', hanzi: '需', quaiVan: 3, quaiSo: 7, centerDeg: 151.875 },
  { id: 29, name: 'Phong Thiên Tiểu Súc', hanzi: '小畜', quaiVan: 8, quaiSo: 2, centerDeg: 157.5 },
  { id: 30, name: 'Lôi Thiên Đại Tráng', hanzi: '大壮', quaiVan: 2, quaiSo: 8, centerDeg: 163.125 },
  { id: 31, name: 'Hỏa Thiên Đại Hữu', hanzi: '大有', quaiVan: 7, quaiSo: 3, centerDeg: 168.75 },
  { id: 32, name: 'Trạch Thiên Quải', hanzi: '夬', quaiVan: 6, quaiSo: 4, centerDeg: 174.375 },

  // Cực Nam: Thuần Càn (180° - Sơn Ngọ)
  { id: 33, name: 'Thuần Càn', hanzi: '乾', quaiVan: 1, quaiSo: 9, centerDeg: 180 },

  // Nhóm Hạ Tốn (Nhất Âm Sinh - Khởi đầu 32 quẻ Âm từ Nam sang Tây)
  { id: 34, name: 'Thiên Phong Cấu', hanzi: '姤', quaiVan: 8, quaiSo: 9, centerDeg: 185.625 },
  { id: 35, name: 'Trạch Phong Đại Quá', hanzi: '大过', quaiVan: 3, quaiSo: 4, centerDeg: 191.25 },
  { id: 36, name: 'Hỏa Phong Đỉnh', hanzi: '鼎', quaiVan: 4, quaiSo: 3, centerDeg: 196.875 },
  { id: 37, name: 'Lôi Phong Hằng', hanzi: '恒', quaiVan: 9, quaiSo: 8, centerDeg: 202.5 },
  { id: 38, name: 'Thuần Tốn', hanzi: '巽', quaiVan: 1, quaiSo: 2, centerDeg: 208.125 },
  { id: 39, name: 'Thủy Phong Tỉnh', hanzi: '井', quaiVan: 6, quaiSo: 7, centerDeg: 213.75 },
  { id: 40, name: 'Sơn Phong Cổ', hanzi: '蛊', quaiVan: 7, quaiSo: 6, centerDeg: 219.375 },
  { id: 41, name: 'Địa Phong Thăng', hanzi: '升', quaiVan: 2, quaiSo: 1, centerDeg: 225 },

  // Nhóm Hạ Khảm
  { id: 42, name: 'Thiên Thủy Tụng', hanzi: '讼', quaiVan: 3, quaiSo: 9, centerDeg: 230.625 },
  { id: 43, name: 'Trạch Thủy Khốn', hanzi: '困', quaiVan: 8, quaiSo: 4, centerDeg: 236.25 },
  { id: 44, name: 'Hỏa Thủy Vị Tế', hanzi: '未济', quaiVan: 9, quaiSo: 3, centerDeg: 241.875 },
  { id: 45, name: 'Lôi Thủy Giải', hanzi: '解', quaiVan: 4, quaiSo: 8, centerDeg: 247.5 },
  { id: 46, name: 'Phong Thủy Hoán', hanzi: '涣', quaiVan: 6, quaiSo: 2, centerDeg: 253.125 },
  { id: 47, name: 'Thuần Khảm', hanzi: '坎', quaiVan: 1, quaiSo: 7, centerDeg: 258.75 },
  { id: 48, name: 'Sơn Thủy Mông', hanzi: '蒙', quaiVan: 2, quaiSo: 6, centerDeg: 264.375 },
  { id: 49, name: 'Địa Thủy Sư', hanzi: '师', quaiVan: 7, quaiSo: 1, centerDeg: 270 }, // Chính Tây - Sơn Dậu

  // Nhóm Hạ Cấn
  { id: 50, name: 'Thiên Sơn Độn', hanzi: '遁', quaiVan: 4, quaiSo: 9, centerDeg: 275.625 },
  { id: 51, name: 'Trạch Sơn Hàm', hanzi: '咸', quaiVan: 9, quaiSo: 4, centerDeg: 281.25 },
  { id: 52, name: 'Hỏa Sơn Lữ', hanzi: '旅', quaiVan: 8, quaiSo: 3, centerDeg: 286.875 },
  { id: 53, name: 'Lôi Sơn Tiểu Quá', hanzi: '小过', quaiVan: 3, quaiSo: 8, centerDeg: 292.5 },
  { id: 54, name: 'Phong Sơn Tiệm', hanzi: '渐', quaiVan: 7, quaiSo: 2, centerDeg: 298.125 },
  { id: 55, name: 'Thủy Sơn Kiển', hanzi: '蹇', quaiVan: 2, quaiSo: 7, centerDeg: 303.75 },
  { id: 56, name: 'Thuần Cấn', hanzi: '艮', quaiVan: 1, quaiSo: 6, centerDeg: 309.375 },
  { id: 57, name: 'Địa Sơn Khiêm', hanzi: '谦', quaiVan: 6, quaiSo: 1, centerDeg: 315 },

  // Nhóm Hạ Khôn
  { id: 58, name: 'Thiên Địa Bĩ', hanzi: '否', quaiVan: 9, quaiSo: 9, centerDeg: 320.625 },
  { id: 59, name: 'Trạch Địa Tụy', hanzi: '萃', quaiVan: 4, quaiSo: 4, centerDeg: 326.25 },
  { id: 60, name: 'Hỏa Địa Tấn', hanzi: '晋', quaiVan: 3, quaiSo: 3, centerDeg: 331.875 },
  { id: 61, name: 'Lôi Địa Dự', hanzi: '豫', quaiVan: 8, quaiSo: 8, centerDeg: 337.5 },
  { id: 62, name: 'Phong Địa Quan', hanzi: '观', quaiVan: 2, quaiSo: 2, centerDeg: 343.125 },
  { id: 63, name: 'Thủy Địa Tỷ', hanzi: '比', quaiVan: 7, quaiSo: 7, centerDeg: 348.75 },
  { id: 64, name: 'Sơn Địa Bác', hanzi: '剥', quaiVan: 6, quaiSo: 6, centerDeg: 354.375 },
];

export const DAI_QUAI_VIETNAMESE_NAMES: Record<number, string> = {
  1: 'Khôn',
  2: 'Phục',
  3: 'Di',
  4: 'Truân',
  5: 'Ích',
  6: 'Chấn',
  7: 'Phệ Hạp',
  8: 'Tùy',
  9: 'Vô Vọng',
  10: 'Minh Di',
  11: 'Bí',
  12: 'Ký Tế',
  13: 'Gia Nhân',
  14: 'Phong',
  15: 'Ly',
  16: 'Cách',
  17: 'Đồng Nhân',
  18: 'Lâm',
  19: 'Tổn',
  20: 'Tiết',
  21: 'Trung Phu',
  22: 'Quy Muội',
  23: 'Khuê',
  24: 'Đoài',
  25: 'Lý',
  26: 'Thái',
  27: 'Đại Súc',
  28: 'Nhu',
  29: 'Tiểu Súc',
  30: 'Đại Tráng',
  31: 'Đại Hữu',
  32: 'Quải',
  33: 'Càn',
  34: 'Cấu',
  35: 'Đại Quá',
  36: 'Đỉnh',
  37: 'Hằng',
  38: 'Tốn',
  39: 'Tỉnh',
  40: 'Cổ',
  41: 'Thăng',
  42: 'Tụng',
  43: 'Khốn',
  44: 'Vị Tế',
  45: 'Giải',
  46: 'Hoán',
  47: 'Khảm',
  48: 'Mông',
  49: 'Sư',
  50: 'Độn',
  51: 'Hàm',
  52: 'Lữ',
  53: 'Tiểu Quá',
  54: 'Tiệm',
  55: 'Kiển',
  56: 'Cấn',
  57: 'Khiêm',
  58: 'Bĩ',
  59: 'Tụy',
  60: 'Tấn',
  61: 'Dự',
  62: 'Quan',
  63: 'Tỷ',
  64: 'Bác',
};

// ==========================================
// QUY CHUẨN ĐÁNH GIÁ 64 QUẺ:
// 1. CHẾ ĐỘ HUYỀN KHÔNG ĐẠI QUÁI (ĐỘNG THEO THỜI GIAN & KHÔNG GIAN)
//    - Đương Vận (Vận 9: 2024-2043): Quẻ có Quái Vận 9 là Đương Vượng Đại Cát (Chữ Đỏ).
//    - Phối Hợp Cách Cục Tọa - Hướng:
//      + Hợp Thập Quái Khí / Quái Vận (Cộng lại = 10) -> Cát (Chữ Đỏ)
//      + Hợp Hà Đồ Quái Khí / Quái Vận (1-6, 2-7, 3-8, 4-9) -> Cát (Chữ Đỏ)
//      + Đồng Khí / Đồng Vận (Thuần Thanh) -> Cát (Chữ Đỏ)
//      + Không hợp cách, lỗi vận suy tử -> Hung (Chữ Đen)
// 2. CHẾ ĐỘ KINH DỊCH CHU DỊCH TRUYỀN THỐNG (CỐ ĐỊNH 22 QUẺ HUNG)
// ==========================================

export type DaiQuaiEvaluationMode = 'hkdq' | 'kinhdich';

export interface DaiQuaiEvaluation {
  isGood: boolean; // true: Chữ Đỏ, false: Chữ Đen
  rating: 'Đại Cát' | 'Cát' | 'Thứ Cát' | 'Suy Tử (Hung)' | 'Sai Thác (Hung)' | 'Hung';
  badgeText: string;
  reasons: string[];
  duongVan: boolean; // Chính khí đương vận
  sinhKhiVan?: boolean; // Sinh khí cát vận
  tienKhiVan?: boolean; // Tiến khí cát vận
  hopThapKhi: boolean;
  hopThapVan: boolean;
  haDoKhi: boolean;
  haDoVan: boolean;
  dongKhi: boolean;
  dongVan: boolean;
}

// Bảng 22 quẻ Hung theo Chu Dịch / Kinh Dịch truyền thống (chỉ dùng cho chế độ Kinh Dịch cố định)
export const HUNG_HEXAGRAM_IDS = new Set<number>([
  4,  // Thủy Lôi Truân
  7,  // Hỏa Lôi Phệ Hạp
  9,  // Thiên Lôi Vô Vọng
  10, // Địa Hỏa Minh Di
  19, // Sơn Trạch Tổn
  22, // Lôi Trạch Quy Muội
  23, // Hỏa Trạch Khuê
  34, // Thiên Phong Cấu
  35, // Trạch Phong Đại Quá
  40, // Sơn Phong Cổ
  42, // Thiên Thủy Tụng
  43, // Trạch Thủy Khốn
  44, // Hỏa Thủy Vị Tế
  47, // Thuần Khảm
  48, // Sơn Thủy Mông
  49, // Địa Thủy Sư
  50, // Thiên Sơn Độn
  52, // Hỏa Sơn Lữ
  53, // Lôi Sơn Tiểu Quá
  55, // Thủy Sơn Kiển
  58, // Thiên Địa Bĩ
  64, // Sơn Địa Bác
]);

// Kiểm tra cặp Hà Đồ (Sinh thành 1-6, 2-7, 3-8, 4-9)
export function isHaDoPair(a: number, b: number): boolean {
  return (
    (a === 1 && b === 6) || (a === 6 && b === 1) ||
    (a === 2 && b === 7) || (a === 7 && b === 2) ||
    (a === 3 && b === 8) || (a === 8 && b === 3) ||
    (a === 4 && b === 9) || (a === 9 && b === 4)
  );
}

// THUẬT TOÁN ĐÁNH GIÁ CHUẨN HUYỀN KHÔNG ĐẠI QUÁI
// Nguyên tắc: Vận 9 thì sao/quẻ tốt là 9, 1, 2 (Chính khí, Sinh khí, Tiến khí).
// Tương tự Vận 1 là 1, 2, 3; Vận 2 là 2, 3, 4; Vận 8 là 8, 9, 1;...
export function evaluateDaiQuaiHKDQ(
  hex: DaiQuaiHexagram,
  refHex?: DaiQuaiHexagram | null,
  period: number = 9
): DaiQuaiEvaluation {
  const reasons: string[] = [];

  // 1. Nguyên lý Tam Cát Khí Thời Gian: Chính Khí (Đương Vận), Sinh Khí, Tiến Khí
  const chinhVan = period;
  const sinhVan = (period % 9) + 1;
  const tienVan = ((period + 1) % 9) + 1;

  const isChinhVan = hex.quaiVan === chinhVan;
  const isSinhVan = hex.quaiVan === sinhVan;
  const isTienVan = hex.quaiVan === tienVan;
  const isTamCatVan = isChinhVan || isSinhVan || isTienVan;

  if (isChinhVan) {
    reasons.push(`Đương Vượng Chính Khí Vận ${period} (Thiên khí đắc thời tối thượng, Đại Cát)`);
  } else if (isSinhVan) {
    reasons.push(`Sinh Khí Vận ${period} (Quái Vận ${sinhVan} - Sinh sôi nảy nở, tài phúc hanh thông, Đại Cát)`);
  } else if (isTienVan) {
    reasons.push(`Tiến Khí Vận ${period} (Quái Vận ${tienVan} - Năng lượng cát khí tương lai đang tiến tới, Cát)`);
  }

  // 2. Nguyên lý Phối Hợp Cách Cục (Yếu tố Không gian với Tọa/Hướng nhà)
  let isHopThapKhi = false;
  let isHopThapVan = false;
  let isHaDoKhi = false;
  let isHaDoVan = false;
  let isDongKhi = false;
  let isDongVan = false;

  if (refHex) {
    // Hợp Thập (Cộng lại = 10)
    if (hex.quaiSo + refHex.quaiSo === 10) {
      isHopThapKhi = true;
      reasons.push(`Hợp Thập Quái Khí (${hex.quaiSo} + ${refHex.quaiSo} = 10)`);
    }
    if (hex.quaiVan + refHex.quaiVan === 10) {
      isHopThapVan = true;
      reasons.push(`Hợp Thập Quái Vận (Vận ${hex.quaiVan} + Vận ${refHex.quaiVan} = 10)`);
    }

    // Hợp Hà Đồ (Sinh thành 1-6, 2-7, 3-8, 4-9)
    if (isHaDoPair(hex.quaiSo, refHex.quaiSo)) {
      isHaDoKhi = true;
      reasons.push(`Hợp Hà Đồ Quái Khí (Cặp ${hex.quaiSo}-${refHex.quaiSo})`);
    }
    if (isHaDoPair(hex.quaiVan, refHex.quaiVan)) {
      isHaDoVan = true;
      reasons.push(`Hợp Hà Đồ Quái Vận (Vận ${hex.quaiVan}-${refHex.quaiVan})`);
    }

    // Đồng Khí & Đồng Vận (Thuần thanh)
    if (hex.quaiSo === refHex.quaiSo) {
      isDongKhi = true;
      reasons.push(`Thuần Thanh Đồng Khí (Cùng Khí số ${hex.quaiSo})`);
    }
    if (hex.quaiVan === refHex.quaiVan) {
      isDongVan = true;
      reasons.push(`Thuần Thanh Đồng Vận (Cùng Vận ${hex.quaiVan})`);
    }
  }

  // Quyết định Cát (Chữ Đỏ) hay Hung (Chữ Đen) theo Huyền Không Đại Quái
  const isGood = isTamCatVan || isHopThapKhi || isHopThapVan || isHaDoKhi || isHaDoVan || isDongKhi || isDongVan;

  let rating: DaiQuaiEvaluation['rating'] = 'Suy Tử (Hung)';
  let badgeText = 'Suy Khí (Chữ Đen)';

  if (isChinhVan && (isHopThapKhi || isHaDoKhi || isHopThapVan || isHaDoVan)) {
    rating = 'Đại Cát';
    badgeText = `⭐ Đương Vận ${period} & Hợp Cách Cục (Chữ Đỏ)`;
  } else if (isChinhVan) {
    rating = 'Đại Cát';
    badgeText = `⭐ Đương Vượng Vận ${period} (Chữ Đỏ)`;
  } else if (isSinhVan) {
    rating = 'Đại Cát';
    badgeText = `🌿 Sinh Khí Vận ${period} (Chữ Đỏ)`;
  } else if (isTienVan) {
    rating = 'Cát';
    badgeText = `🚀 Tiến Khí Vận ${period} (Chữ Đỏ)`;
  } else if (isHopThapKhi || isHopThapVan) {
    rating = 'Đại Cát';
    badgeText = '⭐ Hợp Thập Cát (Chữ Đỏ)';
  } else if (isHaDoKhi || isHaDoVan) {
    rating = 'Cát';
    badgeText = '⭐ Hợp Hà Đồ Cát (Chữ Đỏ)';
  } else if (isDongKhi || isDongVan) {
    rating = 'Cát';
    badgeText = '⭐ Đồng Khí Thuần Thanh (Chữ Đỏ)';
  } else {
    rating = 'Suy Tử (Hung)';
    badgeText = 'Suy Khí / Sai Thác (Chữ Đen)';
    reasons.push(`Lỗi thời thoái vận, không thuộc Tam Cát Vận (${chinhVan}, ${sinhVan}, ${tienVan}), không Hợp Thập, không Hợp Hà Đồ`);
  }

  return {
    isGood,
    rating,
    reasons,
    badgeText,
    duongVan: isChinhVan,
    sinhKhiVan: isSinhVan,
    tienKhiVan: isTienVan,
    hopThapKhi: isHopThapKhi,
    hopThapVan: isHopThapVan,
    haDoKhi: isHaDoKhi,
    haDoVan: isHaDoVan,
    dongKhi: isDongKhi,
    dongVan: isDongVan,
  };
}

// Hàm kiểm tra Cát / Hung (tương thích cả 2 chế độ HKĐQ và Chu Dịch)
export function isDaiQuaiGood(
  hexOrId: number | DaiQuaiHexagram,
  refHex?: DaiQuaiHexagram | null,
  period: number = 9,
  mode: DaiQuaiEvaluationMode = 'hkdq'
): boolean {
  if (typeof hexOrId === 'number') {
    if (mode === 'kinhdich') {
      return !HUNG_HEXAGRAM_IDS.has(hexOrId);
    }
    const hex = DAI_QUAI_64.find((h) => h.id === hexOrId) || DAI_QUAI_64[0];
    return evaluateDaiQuaiHKDQ(hex, refHex, period).isGood;
  }
  if (mode === 'kinhdich') {
    return !HUNG_HEXAGRAM_IDS.has(hexOrId.id);
  }
  return evaluateDaiQuaiHKDQ(hexOrId, refHex, period).isGood;
}

export function getDaiQuaiByDegree(
  deg: number,
  refHex?: DaiQuaiHexagram | null,
  period: number = 9,
  mode: DaiQuaiEvaluationMode = 'hkdq'
): DaiQuaiHexagram & { evaluation: DaiQuaiEvaluation } {
  const normalized = ((deg % 360) + 360) % 360;
  // Mỗi quẻ chiếm 5.625° (360 / 64). Thuần Khôn ở index 0 có tâm tại 0° (chiếm từ 357.1875° đến 2.8125°).
  // Cộng 2.8125° để căn chỉnh tâm quẻ khớp hoàn hảo với 0° (Bắc), 90° (Đông), 180° (Nam), 270° (Tây).
  const shifted = (normalized + 2.8125) % 360;
  const index = Math.floor(shifted / 5.625) % 64;
  const hex = DAI_QUAI_64[index] || DAI_QUAI_64[0];

  let effectiveRef = refHex;
  if (effectiveRef === undefined) {
    const oppDeg = (deg + 180) % 360;
    const oppShifted = (oppDeg + 2.8125) % 360;
    const oppIdx = Math.floor(oppShifted / 5.625) % 64;
    effectiveRef = DAI_QUAI_64[oppIdx] || null;
  }

  let evaluation: DaiQuaiEvaluation;
  if (mode === 'kinhdich') {
    const isGood = !HUNG_HEXAGRAM_IDS.has(hex.id);
    evaluation = {
      isGood,
      rating: isGood ? 'Cát' : 'Hung',
      badgeText: isGood ? '⭐ Cát (Chữ Đỏ)' : 'Hung (Chữ Đen)',
      reasons: isGood ? ['Quẻ Cát Chu Dịch'] : ['Quẻ Hung Chu Dịch'],
      duongVan: false,
      hopThapKhi: false,
      hopThapVan: false,
      haDoKhi: false,
      haDoVan: false,
      dongKhi: false,
      dongVan: false,
    };
  } else {
    evaluation = evaluateDaiQuaiHKDQ(hex, effectiveRef, period);
  }

  return {
    ...hex,
    isGood: evaluation.isGood,
    evaluation,
  };
}

// ==========================================
// 8. 28 TINH TÚC (NHỊ THẬP BÁT TÚ TRÊN LA KINH)
// ==========================================
export interface TinhTucItem {
  id: number;
  name: string;
  hanzi: string;
  animal: string; // vd: Mộc Giải, Kim Long...
  tuTuong: 'Đông (Thanh Long)' | 'Bắc (Huyền Vũ)' | 'Tây (Bạch Hổ)' | 'Nam (Chu Tước)';
  centerDeg: number;
  spanDeg: number;
  isGood: boolean;
  rating: 'Đại Cát' | 'Cát' | 'Bình' | 'Hung';
  meaning: string;
}

export const NHI_THAP_BAT_TU_28: TinhTucItem[] = [
  // Đông Phương Thanh Long (Mộc) - Khoảng 45° đến 135°
  { id: 1, name: 'Giác', hanzi: '角', animal: 'Mộc Giải', tuTuong: 'Đông (Thanh Long)', centerDeg: 51.4, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Chủ thi cử đỗ đạt, công danh hiển hách, hôn nhân đại cát.' },
  { id: 2, name: 'Cang', hanzi: '亢', animal: 'Kim Long', tuTuong: 'Đông (Thanh Long)', centerDeg: 64.2, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ quan phi kiện tụng, đề phòng té ngã, bất hòa gia đạo.' },
  { id: 3, name: 'Đê', hanzi: '氐', animal: 'Thổ Hạc', tuTuong: 'Đông (Thanh Long)', centerDeg: 77.1, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ hao tài tốn của, dễ gặp trộm cướp, người thân xa cách.' },
  { id: 4, name: 'Phòng', hanzi: '房', animal: 'Nhật Thố', tuTuong: 'Đông (Thanh Long)', centerDeg: 90.0, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Đại cát lợi cho khởi công, nhập trạch, sinh quý tử, tiền tài dồi dào.' },
  { id: 5, name: 'Tâm', hanzi: '心', animal: 'Nguyệt Hồ', tuTuong: 'Đông (Thanh Long)', centerDeg: 102.8, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Kỵ cưới hỏi, cất nhà, đề phòng hình thương, tranh chấp đất đai.' },
  { id: 6, name: 'Vĩ', hanzi: '尾', animal: 'Hỏa Hổ', tuTuong: 'Đông (Thanh Long)', centerDeg: 115.7, spanDeg: 12.8, isGood: true, rating: 'Cát', meaning: 'Chủ phát đạt kinh doanh, điền trang hưng vượng, con cháu vinh hiển.' },
  { id: 7, name: 'Cơ', hanzi: '箕', animal: 'Thủy Báo', tuTuong: 'Đông (Thanh Long)', centerDeg: 128.5, spanDeg: 12.8, isGood: true, rating: 'Cát', meaning: 'Gặp quý nhân phù trợ, kinh doanh buôn bán thuận buồm xuôi gió.' },

  // Nam Phương Chu Tước (Hỏa) - Khoảng 135° đến 225°
  { id: 8, name: 'Tỉnh', hanzi: '井', animal: 'Mộc Hãn', tuTuong: 'Nam (Chu Tước)', centerDeg: 141.4, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Đại cát đào giếng mở móng, cất nhà, nhân đinh phát triển hưng thịnh.' },
  { id: 9, name: 'Quỷ', hanzi: '鬼', animal: 'Kim Dương', tuTuong: 'Nam (Chu Tước)', centerDeg: 154.2, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ tai họa bất ngờ, kỵ khởi công đào móng, gia đạo bất an.' },
  { id: 10, name: 'Liễu', hanzi: '柳', animal: 'Thổ Chương', tuTuong: 'Nam (Chu Tước)', centerDeg: 167.1, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ khẩu thiệt thị phi, hao tốn tiền của, người nhà đau yếu.' },
  { id: 11, name: 'Tinh', hanzi: '星', animal: 'Nhật Mã', tuTuong: 'Nam (Chu Tước)', centerDeg: 180.0, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Kỵ kết hôn, an táng; nên an cư tĩnh dưỡng, tránh đầu tư mạo hiểm.' },
  { id: 12, name: 'Trương', hanzi: '张', animal: 'Nguyệt Lộc', tuTuong: 'Nam (Chu Tước)', centerDeg: 192.8, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Chủ phát tài khai trương, tiệc mừng hỷ sự, thăng quan tiến chức.' },
  { id: 13, name: 'Dực', hanzi: '翼', animal: 'Hỏa Xà', tuTuong: 'Nam (Chu Tước)', centerDeg: 205.7, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ ly hương tha phương, đề phòng tiểu nhân dèm pha sau lưng.' },
  { id: 14, name: 'Chẩn', hanzi: '轸', animal: 'Thủy Dẫn', tuTuong: 'Nam (Chu Tước)', centerDeg: 218.5, spanDeg: 12.8, isGood: true, rating: 'Cát', meaning: 'Gia đạo bình an, xuất hành gặp may, của cải tích tụ sung túc.' },

  // Tây Phương Bạch Hổ (Kim) - Khoảng 225° đến 315°
  { id: 15, name: 'Khuê', hanzi: '奎', animal: 'Mộc Lang', tuTuong: 'Tây (Bạch Hổ)', centerDeg: 231.4, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Kỵ xuất hành đường thủy, đề phòng bất cẩn trong hợp đồng văn bản.' },
  { id: 16, name: 'Lâu', hanzi: '娄', animal: 'Kim Cẩu', tuTuong: 'Tây (Bạch Hổ)', centerDeg: 244.2, spanDeg: 12.8, isGood: true, rating: 'Cát', meaning: 'Chủ phát đạt chăn nuôi, nông nghiệp điền sản, gia quyến hòa hợp.' },
  { id: 17, name: 'Vị', hanzi: '胃', animal: 'Thổ Trĩ', tuTuong: 'Tây (Bạch Hổ)', centerDeg: 257.1, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Kho tàng đầy ắp, tài lộc hanh thông, danh tiếng vang dội bốn phương.' },
  { id: 18, name: 'Mão', hanzi: '昴', animal: 'Nhật Kê', tuTuong: 'Tây (Bạch Hổ)', centerDeg: 270.0, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ tranh chấp thị phi, cẩn trọng tiền bạc, tránh cho vay mượn lớn.' },
  { id: 19, name: 'Tất', hanzi: '毕', animal: 'Nguyệt Ô', tuTuong: 'Tây (Bạch Hổ)', centerDeg: 282.8, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Chủ an cư lạc nghiệp, điền sản bội thu, sinh con thông minh tuấn tú.' },
  { id: 20, name: 'Chủy', hanzi: '觜', animal: 'Hỏa Hầu', tuTuong: 'Tây (Bạch Hổ)', centerDeg: 295.7, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ hình thương tai vạ, kỵ xây cất bếp lò, cẩn trọng hỏa hoạn.' },
  { id: 21, name: 'Sâm', hanzi: '参', animal: 'Thủy Viên', tuTuong: 'Tây (Bạch Hổ)', centerDeg: 308.5, spanDeg: 12.8, isGood: true, rating: 'Cát', meaning: 'Chủ về sự nghiệp hưng thịnh, văn chương xuất chúng, buôn bán phát tài.' },

  // Bắc Phương Huyền Vũ (Thủy) - Khoảng 315° đến 45°
  { id: 22, name: 'Đẩu', hanzi: '斗', animal: 'Mộc Giải', tuTuong: 'Bắc (Huyền Vũ)', centerDeg: 321.4, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Bắc Đẩu tinh quân giáng phúc, thăng quan tiến chức, trường thọ khang ninh.' },
  { id: 23, name: 'Ngưu', hanzi: '牛', animal: 'Kim Ngưu', tuTuong: 'Bắc (Huyền Vũ)', centerDeg: 334.2, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Chủ vất vả cực nhọc, gánh nặng gia đình, đề phòng rủi ro đầu tư.' },
  { id: 24, name: 'Nữ', hanzi: '女', animal: 'Thổ Bức', tuTuong: 'Bắc (Huyền Vũ)', centerDeg: 347.1, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Kỵ nữ nhân quản sự thái quá, đề phòng tranh cãi mẹ chồng nàng dâu.' },
  { id: 25, name: 'Hư', hanzi: '虚', animal: 'Nhật Thử', tuTuong: 'Bắc (Huyền Vũ)', centerDeg: 0.0, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Hư linh không vong, hao tán tiền bạc, người già dễ mỏi mệt ốm đau.' },
  { id: 26, name: 'Nguy', hanzi: '危', animal: 'Nguyệt Yến', tuTuong: 'Bắc (Huyền Vũ)', centerDeg: 12.8, spanDeg: 12.8, isGood: false, rating: 'Hung', meaning: 'Nguy hiểm rình rập, kỵ đi xa ban đêm, tránh làm việc mạo hiểm.' },
  { id: 27, name: 'Thất', hanzi: '室', animal: 'Hỏa Trư', tuTuong: 'Bắc (Huyền Vũ)', centerDeg: 25.7, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Đại cát hưng gia khởi tạo, vượng đinh vượng tài, gia môn hòa thuận ấm êm.' },
  { id: 28, name: 'Bích', hanzi: '壁', animal: 'Thủy Du', tuTuong: 'Bắc (Huyền Vũ)', centerDeg: 38.5, spanDeg: 12.8, isGood: true, rating: 'Đại Cát', meaning: 'Vững chãi như tường đồng, tích lũy điền sản lâu bền, con cháu hiếu thảo.' },
];

export function getTinhTucByDegree(deg: number): TinhTucItem {
  const norm = ((deg % 360) + 360) % 360;
  // Step is roughly 360 / 28 = 12.857°
  // Offset by starting constellation
  const idx = Math.floor(((norm + 6.4) % 360) / (360 / 28)) % 28;
  return NHI_THAP_BAT_TU_28[idx] || NHI_THAP_BAT_TU_28[0];
}

// ==========================================
// 5. THƯỚC LỖ BAN (BỘ 3 THƯỚC PHONG THỦY CHUẨN MM)
// ==========================================
// Thước 1: 522 mm (Thông Thủy - Cửa, Lọt Lòng) - Chu kỳ 522 mm, 8 cung
// Thước 2: 429 mm (Dương Trạch - Nội Thất, Bậc Thang, Giường Bếp) - Chu kỳ 429 mm, 8 cung
// Thước 3: 388 mm (Âm Phần - Bàn Thờ, Tủ Thờ, Mộ Phần) - Chu kỳ 388 mm, 10 cung

export interface RulerSectorDef {
  name: string;
  isGood: boolean;
  subSectors: string[];
  meaning: string;
}

// Thước 522 mm (8 cung, mỗi cung 65.25 mm)
export const RULER_522_SECTORS: RulerSectorDef[] = [
  { name: 'Quý Nhân', isGood: true, subSectors: ['Quyền Lộc', 'Trung Tín', 'Tác Quan', 'Phát Đạt', 'Thông Minh'], meaning: 'Cực tốt cho cửa chính: Gia cảnh hưng vượng, con cái thành đạt, gặp quý nhân phù trợ.' },
  { name: 'Hiểm Họa', isGood: false, subSectors: ['Tán Tài', 'Quan Quỷ', 'Tù Ngục', 'Cô Quả'], meaning: 'Hung: Dễ mất của, bị tiểu nhân lừa dối, gia đạo ly tán phiền muộn.' },
  { name: 'Thiên Tai', isGood: false, subSectors: ['Hoàn Bệnh', 'Tổn Tài', 'Tự Ải', 'Ly Hương'], meaning: 'Hung: Dễ gặp ốm đau bệnh tật, tổn thất tài lộc, đi xa bất lợi.' },
  { name: 'Thiên Tài', isGood: true, subSectors: ['Thi Thơ', 'Văn Học', 'Hoa Đăng', 'Lục Hợp'], meaning: 'Cát: May mắn tài lộc, con cái thi cử đỗ đạt, gia đình hòa thuận gắn kết.' },
  { name: 'Nhân Lộc', isGood: true, subSectors: ['Tử Tôn', 'Phú Quý', 'Tấn Bảo', 'Hưng Vượng'], meaning: 'Đại Cát: Con cháu thảo hiền sung túc, phúc lộc dồi dào, kinh doanh phát đạt.' },
  { name: 'Cô Độc', isGood: false, subSectors: ['Bạc Nhược', 'Cô Quả', 'Tán Khí', 'Ly Tán'], meaning: 'Hung: Chủ về cô đơn hiu quạnh, hao tán tiền bạc, người nhà xích mích.' },
  { name: 'Thiên Tặc', isGood: false, subSectors: ['Phòng Đạo', 'Chiêu Đạo', 'Thất Thoát', 'Hình Thương'], meaning: 'Đại Hung: Phòng trộm cướp, mất mát tài sản bất ngờ, tai bay vạ gió.' },
  { name: 'Tể Tướng', isGood: true, subSectors: ['Đại Phú', 'Đại Quý', 'Tiến Bảo', 'Bá Quan'], meaning: 'Đại Cát: Công danh rạng rỡ, nắm chức quyền cao quý, tài lộc dồi dào vững bền.' },
];

// Thước 429 mm (8 cung, mỗi cung 53.625 mm)
export const RULER_429_SECTORS: RulerSectorDef[] = [
  { name: 'Tài (Cát)', isGood: true, subSectors: ['Tài Đức', 'Bảo Kho', 'Lục Hợp', 'Nghênh Phúc'], meaning: 'Cát: Chủ về tài lộc, có phúc lành, của cải vào nhà dồi dào.' },
  { name: 'Bệnh (Hung)', isGood: false, subSectors: ['Thoát Đinh', 'Ôn Tật', 'Chiêu Lao', 'Quan Phi'], meaning: 'Hung: Dễ sinh bệnh tật, tiêu hao tiền của vì ốm đau, vướng thị phi.' },
  { name: 'Ly (Hung)', isGood: false, subSectors: ['Trưởng Khố', 'Kiếp Tài', 'Quan Quỷ', 'Thất Thoát'], meaning: 'Hung: Chia ly xa cách, tiêu tán tài sản, dễ gặp chuyện bất trắc.' },
  { name: 'Nghĩa (Cát)', isGood: true, subSectors: ['Thêm Đinh', 'Ích Lợi', 'Quý Tử', 'Đại Cát'], meaning: 'Cát: Thêm người thêm của, sinh quý tử, mọi việc đều thuận lợi.' },
  { name: 'Quan (Cát)', isGood: true, subSectors: ['Thuận Khoa', 'Hoành Tài', 'Tấn Ích', 'Phú Quý'], meaning: 'Cát: Thuận lợi thi cử học vấn, tài lộc bất ngờ, chức quyền vững tiến.' },
  { name: 'Kiếp (Hung)', isGood: false, subSectors: ['Tử Biệt', 'Thối Khẩu', 'Ly Hương', 'Tài Thất'], meaning: 'Đại Hung: Tiêu tán tiền của, người thân ly tán, gặp hoạn nạn rủi ro.' },
  { name: 'Hại (Hung)', isGood: false, subSectors: ['Tai Bệnh', 'Tử Tuyệt', 'Khẩu Thiệt', 'Thương Tật'], meaning: 'Đại Hung: Dễ mắc tai nạn thương tích, khẩu thiệt thị phi, gia đạo bất hòa.' },
  { name: 'Bản (Cát)', isGood: true, subSectors: ['Tài Chí', 'Đăng Khoa', 'Tiến Bảo', 'Hưng Vượng'], meaning: 'Cát: Gốc rễ bền chặt, đỗ đạt công danh, tiền bạc châu báu tích tụ.' },
];

// Thước 388 mm (10 cung, mỗi cung 38.8 mm)
export const RULER_388_SECTORS: RulerSectorDef[] = [
  { name: 'Đinh (Cát)', isGood: true, subSectors: ['Phúc Tinh', 'Cập Đệ', 'Đăng Khoa', 'Thiêm Đinh'], meaning: 'Cát: Thêm con cháu, đỗ đạt vinh hiển, gia đình hưng vượng.' },
  { name: 'Hại (Hung)', isGood: false, subSectors: ['Khẩu Thiệt', 'Bệnh Lâm', 'Tử Tuyệt', 'Họa Chí'], meaning: 'Hung: Thị phi tai ách, bệnh tật khó chữa, gia cảnh bất an.' },
  { name: 'Vượng (Cát)', isGood: true, subSectors: ['Thiên Đức', 'Hỷ Sự', 'Tiến Bảo', 'Nạp Phúc'], meaning: 'Cát: Phúc đức trời ban, gia đình nhiều chuyện hỷ, tiền tài dồi dào.' },
  { name: 'Khổ (Hung)', isGood: false, subSectors: ['Thất Thoát', 'Quan Phi', 'Kiếp Tài', 'Vô Tự'], meaning: 'Hung: Vất vả gian truân, tiêu tán tiền của, hiếm muộn con cái.' },
  { name: 'Nghĩa (Cát)', isGood: true, subSectors: ['Đại Cát', 'Tài Vượng', 'Ích Lợi', 'Thiên Ân'], meaning: 'Cát: Việc nghĩa được báo đáp, tiền tài hưng vượng, gặp nhiều may mắn.' },
  { name: 'Quan (Cát)', isGood: true, subSectors: ['Phú Quý', 'Tấn Bảo', 'Hoành Tài', 'Thuận Khoa'], meaning: 'Cát: Giàu sang vinh hiển, tài lộc dồi dào, thăng quan tiến chức.' },
  { name: 'Tử (Hung)', isGood: false, subSectors: ['Ly Hương', 'Tử Biệt', 'Thoái Đinh', 'Thất Tài'], meaning: 'Đại Hung: Điềm dữ phân ly, mất người mất của, ly tán tha hương.' },
  { name: 'Hưng (Cát)', isGood: true, subSectors: ['Đăng Khoa', 'Quý Tử', 'Thêm Đinh', 'Hưng Thịnh'], meaning: 'Cát: Con cái đỗ đạt cao, thêm người nối dõi, cơ nghiệp khởi sắc.' },
  { name: 'Thất (Hung)', isGood: false, subSectors: ['Cô Quả', 'Lao Ngục', 'Quan Phi', 'Thoát Tài'], meaning: 'Hung: Dễ vướng vòng lao lý, đơn độc góa bụa, mất mát của cải.' },
  { name: 'Cát (Đại Cát)', isGood: true, subSectors: ['Hưng Vượng', 'Tiến Bảo', 'Thiên Lộc', 'Phú Quý'], meaning: 'Đại Cát: Cực tốt cho bàn thờ gia tiên, phúc lộc sung mãn, vạn sự như ý.' },
];

/**
 * Tính toán cung Thước Lỗ Ban cho giá trị đo.
 * Mặc định nhận vào đơn vị milimet (mm) chuẩn thợ mộc & kiến trúc sư Việt Nam.
 * Nếu truyền unit === 'cm', hàm tự động quy đổi mm = cm * 10.
 */
export function calculateLuBan(value: number, unit: 'mm' | 'cm' = 'mm'): LuBanResult {
  const mm = unit === 'cm' ? value * 10 : value;
  const safeMm = Math.max(1, mm);
  const cm = safeMm / 10;

  // Ruler 522 mm (8 cung, mỗi cung 65.25 mm, mỗi cung phụ 16.3125 mm)
  const cycle522 = safeMm % 522;
  const sectorIdx522 = Math.min(7, Math.floor(cycle522 / 65.25));
  const subIdx522 = Math.min(3, Math.floor((cycle522 % 65.25) / (65.25 / 4)));
  const sec522 = RULER_522_SECTORS[sectorIdx522];

  // Ruler 429 mm (8 cung, mỗi cung 53.625 mm, mỗi cung phụ 13.40625 mm)
  const cycle429 = safeMm % 429;
  const sectorIdx429 = Math.min(7, Math.floor(cycle429 / 53.625));
  const subIdx429 = Math.min(3, Math.floor((cycle429 % 53.625) / (53.625 / 4)));
  const sec429 = RULER_429_SECTORS[sectorIdx429];

  // Ruler 388 mm (10 cung, mỗi cung 38.8 mm, mỗi cung phụ 9.7 mm)
  const cycle388 = safeMm % 388;
  const sectorIdx388 = Math.min(9, Math.floor(cycle388 / 38.8));
  const subIdx388 = Math.min(3, Math.floor((cycle388 % 38.8) / (38.8 / 4)));
  const sec388 = RULER_388_SECTORS[sectorIdx388];

  return {
    mm: safeMm,
    cm: cm,
    ruler522: {
      palace: sec522.name,
      subPalace: sec522.subSectors[subIdx522] || sec522.name,
      isGood: sec522.isGood,
      meaning: sec522.meaning,
    },
    ruler429: {
      palace: sec429.name,
      subPalace: sec429.subSectors[subIdx429] || sec429.name,
      isGood: sec429.isGood,
      meaning: sec429.meaning,
    },
    ruler388: {
      palace: sec388.name,
      subPalace: sec388.subSectors[subIdx388] || sec388.name,
      isGood: sec388.isGood,
      meaning: sec388.meaning,
    },
  };
}
