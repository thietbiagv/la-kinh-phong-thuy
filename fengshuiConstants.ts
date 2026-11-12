import { Mountain24, ElementType, YuanType } from '../types/fengshui';

// 24 Sơn Hướng (24 Mountains) in counter-clockwise or standard compass order from North (0°/360°)
// Khảm (Bắc): Nhâm (337.5-352.5), Tý (352.5-7.5), Quý (7.5-22.5)
// Cấn (Đông Bắc): Sửu (22.5-37.5), Cấn (37.5-52.5), Dần (52.5-67.5)
// Chấn (Đông): Giáp (67.5-82.5), Mão (82.5-97.5), Ất (97.5-112.5)
// Tốn (Đông Nam): Thìn (112.5-127.5), Tốn (127.5-142.5), Tỵ (142.5-157.5)
// Ly (Nam): Bính (157.5-172.5), Ngọ (172.5-187.5), Đinh (187.5-202.5)
// Khôn (Tây Nam): Mùi (202.5-217.5), Khôn (217.5-232.5), Thân (232.5-247.5)
// Đoài (Tây): Canh (247.5-262.5), Dậu (262.5-277.5), Tân (277.5-292.5)
// Càn (Tây Bắc): Tuất (292.5-307.5), Càn (307.5-322.5), Hợi (322.5-337.5)

export const MOUNTAINS_24: Mountain24[] = [
  // Khảm - 1
  {
    id: 0,
    name: 'Nhâm',
    hanzi: '壬',
    trigram: 'Khảm',
    trigramHanzi: '坎',
    palaceNumber: 1,
    directionName: 'Chính Bắc',
    yuan: 'Địa',
    polarity: '+',
    element: 'Thủy',
    centerDeg: 345,
    startDeg: 337.5,
    endDeg: 352.5,
  },
  {
    id: 1,
    name: 'Tý',
    hanzi: '子',
    trigram: 'Khảm',
    trigramHanzi: '坎',
    palaceNumber: 1,
    directionName: 'Chính Bắc',
    yuan: 'Thiên',
    polarity: '-',
    element: 'Thủy',
    centerDeg: 0,
    startDeg: 352.5,
    endDeg: 7.5,
  },
  {
    id: 2,
    name: 'Quý',
    hanzi: '癸',
    trigram: 'Khảm',
    trigramHanzi: '坎',
    palaceNumber: 1,
    directionName: 'Chính Bắc',
    yuan: 'Nhân',
    polarity: '-',
    element: 'Thủy',
    centerDeg: 15,
    startDeg: 7.5,
    endDeg: 22.5,
  },

  // Cấn - 8
  {
    id: 3,
    name: 'Sửu',
    hanzi: '丑',
    trigram: 'Cấn',
    trigramHanzi: '艮',
    palaceNumber: 8,
    directionName: 'Đông Bắc',
    yuan: 'Địa',
    polarity: '-',
    element: 'Thổ',
    centerDeg: 30,
    startDeg: 22.5,
    endDeg: 37.5,
  },
  {
    id: 4,
    name: 'Cấn',
    hanzi: '艮',
    trigram: 'Cấn',
    trigramHanzi: '艮',
    palaceNumber: 8,
    directionName: 'Đông Bắc',
    yuan: 'Thiên',
    polarity: '+',
    element: 'Thổ',
    centerDeg: 45,
    startDeg: 37.5,
    endDeg: 52.5,
  },
  {
    id: 5,
    name: 'Dần',
    hanzi: '寅',
    trigram: 'Cấn',
    trigramHanzi: '艮',
    palaceNumber: 8,
    directionName: 'Đông Bắc',
    yuan: 'Nhân',
    polarity: '+',
    element: 'Mộc', // chi Dần hành Mộc, nằm trong quái Cấn Thổ
    centerDeg: 60,
    startDeg: 52.5,
    endDeg: 67.5,
  },

  // Chấn - 3
  {
    id: 6,
    name: 'Giáp',
    hanzi: '甲',
    trigram: 'Chấn',
    trigramHanzi: '震',
    palaceNumber: 3,
    directionName: 'Chính Đông',
    yuan: 'Địa',
    polarity: '+',
    element: 'Mộc',
    centerDeg: 75,
    startDeg: 67.5,
    endDeg: 82.5,
  },
  {
    id: 7,
    name: 'Mão',
    hanzi: '卯',
    trigram: 'Chấn',
    trigramHanzi: '震',
    palaceNumber: 3,
    directionName: 'Chính Đông',
    yuan: 'Thiên',
    polarity: '-',
    element: 'Mộc',
    centerDeg: 90,
    startDeg: 82.5,
    endDeg: 97.5,
  },
  {
    id: 8,
    name: 'Ất',
    hanzi: '乙',
    trigram: 'Chấn',
    trigramHanzi: '震',
    palaceNumber: 3,
    directionName: 'Chính Đông',
    yuan: 'Nhân',
    polarity: '-',
    element: 'Mộc',
    centerDeg: 105,
    startDeg: 97.5,
    endDeg: 112.5,
  },

  // Tốn - 4
  {
    id: 9,
    name: 'Thìn',
    hanzi: '辰',
    trigram: 'Tốn',
    trigramHanzi: '巽',
    palaceNumber: 4,
    directionName: 'Đông Nam',
    yuan: 'Địa',
    polarity: '-',
    element: 'Thổ',
    centerDeg: 120,
    startDeg: 112.5,
    endDeg: 127.5,
  },
  {
    id: 10,
    name: 'Tốn',
    hanzi: '巽',
    trigram: 'Tốn',
    trigramHanzi: '巽',
    palaceNumber: 4,
    directionName: 'Đông Nam',
    yuan: 'Thiên',
    polarity: '+',
    element: 'Mộc',
    centerDeg: 135,
    startDeg: 127.5,
    endDeg: 142.5,
  },
  {
    id: 11,
    name: 'Tỵ',
    hanzi: '巳',
    trigram: 'Tốn',
    trigramHanzi: '巽',
    palaceNumber: 4,
    directionName: 'Đông Nam',
    yuan: 'Nhân',
    polarity: '+',
    element: 'Hỏa',
    centerDeg: 150,
    startDeg: 142.5,
    endDeg: 157.5,
  },

  // Ly - 9
  {
    id: 12,
    name: 'Bính',
    hanzi: '丙',
    trigram: 'Ly',
    trigramHanzi: '离',
    palaceNumber: 9,
    directionName: 'Chính Nam',
    yuan: 'Địa',
    polarity: '+',
    element: 'Hỏa',
    centerDeg: 165,
    startDeg: 157.5,
    endDeg: 172.5,
  },
  {
    id: 13,
    name: 'Ngọ',
    hanzi: '午',
    trigram: 'Ly',
    trigramHanzi: '离',
    palaceNumber: 9,
    directionName: 'Chính Nam',
    yuan: 'Thiên',
    polarity: '-',
    element: 'Hỏa',
    centerDeg: 180,
    startDeg: 172.5,
    endDeg: 187.5,
  },
  {
    id: 14,
    name: 'Đinh',
    hanzi: '丁',
    trigram: 'Ly',
    trigramHanzi: '离',
    palaceNumber: 9,
    directionName: 'Chính Nam',
    yuan: 'Nhân',
    polarity: '-',
    element: 'Hỏa',
    centerDeg: 195,
    startDeg: 187.5,
    endDeg: 202.5,
  },

  // Khôn - 2
  {
    id: 15,
    name: 'Mùi',
    hanzi: '未',
    trigram: 'Khôn',
    trigramHanzi: '坤',
    palaceNumber: 2,
    directionName: 'Tây Nam',
    yuan: 'Địa',
    polarity: '-',
    element: 'Thổ',
    centerDeg: 210,
    startDeg: 202.5,
    endDeg: 217.5,
  },
  {
    id: 16,
    name: 'Khôn',
    hanzi: '坤',
    trigram: 'Khôn',
    trigramHanzi: '坤',
    palaceNumber: 2,
    directionName: 'Tây Nam',
    yuan: 'Thiên',
    polarity: '+',
    element: 'Thổ',
    centerDeg: 225,
    startDeg: 217.5,
    endDeg: 232.5,
  },
  {
    id: 17,
    name: 'Thân',
    hanzi: '申',
    trigram: 'Khôn',
    trigramHanzi: '坤',
    palaceNumber: 2,
    directionName: 'Tây Nam',
    yuan: 'Nhân',
    polarity: '+',
    element: 'Kim',
    centerDeg: 240,
    startDeg: 232.5,
    endDeg: 247.5,
  },

  // Đoài - 7
  {
    id: 18,
    name: 'Canh',
    hanzi: '庚',
    trigram: 'Đoài',
    trigramHanzi: '兑',
    palaceNumber: 7,
    directionName: 'Chính Tây',
    yuan: 'Địa',
    polarity: '+',
    element: 'Kim',
    centerDeg: 255,
    startDeg: 247.5,
    endDeg: 262.5,
  },
  {
    id: 19,
    name: 'Dậu',
    hanzi: '酉',
    trigram: 'Đoài',
    trigramHanzi: '兑',
    palaceNumber: 7,
    directionName: 'Chính Tây',
    yuan: 'Thiên',
    polarity: '-',
    element: 'Kim',
    centerDeg: 270,
    startDeg: 262.5,
    endDeg: 277.5,
  },
  {
    id: 20,
    name: 'Tân',
    hanzi: '辛',
    trigram: 'Đoài',
    trigramHanzi: '兑',
    palaceNumber: 7,
    directionName: 'Chính Tây',
    yuan: 'Nhân',
    polarity: '-',
    element: 'Kim',
    centerDeg: 285,
    startDeg: 277.5,
    endDeg: 292.5,
  },

  // Càn - 6
  {
    id: 21,
    name: 'Tuất',
    hanzi: '戌',
    trigram: 'Càn',
    trigramHanzi: '乾',
    palaceNumber: 6,
    directionName: 'Tây Bắc',
    yuan: 'Địa',
    polarity: '-',
    element: 'Thổ',
    centerDeg: 300,
    startDeg: 292.5,
    endDeg: 307.5,
  },
  {
    id: 22,
    name: 'Càn',
    hanzi: '乾',
    trigram: 'Càn',
    trigramHanzi: '乾',
    palaceNumber: 6,
    directionName: 'Tây Bắc',
    yuan: 'Thiên',
    polarity: '+',
    element: 'Kim',
    centerDeg: 315,
    startDeg: 307.5,
    endDeg: 322.5,
  },
  {
    id: 23,
    name: 'Hợi',
    hanzi: '亥',
    trigram: 'Càn',
    trigramHanzi: '乾',
    palaceNumber: 6,
    directionName: 'Tây Bắc',
    yuan: 'Nhân',
    polarity: '+',
    element: 'Thủy',
    centerDeg: 330,
    startDeg: 322.5,
    endDeg: 337.5,
  },
];

// Mapping of original Luo Shu palace numbers (1-9) to palace definitions
export interface PalaceMeta {
  number: number;
  name: string;
  shortName: string;
  trigram: string;
  trigramSymbol: string;
  element: ElementType;
  directionCode: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW' | 'C';
  directionAngle: number; // angle for compass placement (North=0, East=90, South=180, West=270)
  gridRow: number; // 0 to 2 in traditional (South UP) or standard
  gridCol: number;
}

export const PALACE_METAS: Record<number, PalaceMeta> = {
  1: {
    number: 1,
    name: 'Khảm (Chính Bắc)',
    shortName: 'Bắc',
    trigram: 'Khảm',
    trigramSymbol: '☵',
    element: 'Thủy',
    directionCode: 'N',
    directionAngle: 0,
    gridRow: 2,
    gridCol: 1,
  },
  2: {
    number: 2,
    name: 'Khôn (Tây Nam)',
    shortName: 'Tây Nam',
    trigram: 'Khôn',
    trigramSymbol: '☷',
    element: 'Thổ',
    directionCode: 'SW',
    directionAngle: 225,
    gridRow: 0,
    gridCol: 2,
  },
  3: {
    number: 3,
    name: 'Chấn (Chính Đông)',
    shortName: 'Đông',
    trigram: 'Chấn',
    trigramSymbol: '☳',
    element: 'Mộc',
    directionCode: 'E',
    directionAngle: 90,
    gridRow: 1,
    gridCol: 0,
  },
  4: {
    number: 4,
    name: 'Tốn (Đông Nam)',
    shortName: 'Đông Nam',
    trigram: 'Tốn',
    trigramSymbol: '☴',
    element: 'Mộc',
    directionCode: 'SE',
    directionAngle: 135,
    gridRow: 0,
    gridCol: 0,
  },
  5: {
    number: 5,
    name: 'Trung Cung (Thiên Tâm)',
    shortName: 'Trung Cung',
    trigram: 'Thái Cực',
    trigramSymbol: '☯',
    element: 'Thổ',
    directionCode: 'C',
    directionAngle: -1,
    gridRow: 1,
    gridCol: 1,
  },
  6: {
    number: 6,
    name: 'Càn (Tây Bắc)',
    shortName: 'Tây Bắc',
    trigram: 'Càn',
    trigramSymbol: '☰',
    element: 'Kim',
    directionCode: 'NW',
    directionAngle: 315,
    gridRow: 2,
    gridCol: 2,
  },
  7: {
    number: 7,
    name: 'Đoài (Chính Tây)',
    shortName: 'Tây',
    trigram: 'Đoài',
    trigramSymbol: '☱',
    element: 'Kim',
    directionCode: 'W',
    directionAngle: 270,
    gridRow: 1,
    gridCol: 2,
  },
  8: {
    number: 8,
    name: 'Cấn (Đông Bắc)',
    shortName: 'Đông Bắc',
    trigram: 'Cấn',
    trigramSymbol: '☶',
    element: 'Thổ',
    directionCode: 'NE',
    directionAngle: 45,
    gridRow: 2,
    gridCol: 0,
  },
  9: {
    number: 9,
    name: 'Ly (Chính Nam)',
    shortName: 'Nam',
    trigram: 'Ly',
    trigramSymbol: '☲',
    element: 'Hỏa',
    directionCode: 'S',
    directionAngle: 180,
    gridRow: 0,
    gridCol: 1,
  },
};

// Luo Shu flight sequence:
// Trung Cung (5) -> Càn (6) -> Đoài (7) -> Cấn (8) -> Ly (9) -> Khảm (1) -> Khôn (2) -> Chấn (3) -> Tốn (4)
export const LUO_SHU_FLIGHT_PATH = [5, 6, 7, 8, 9, 1, 2, 3, 4];

// Periods (Tam Nguyên Cửu Vận)
export interface PeriodInfo {
  period: number;
  name: string;
  starName: string;
  element: ElementType;
  years: string;
  isCurrent: boolean;
}

export const PERIODS: PeriodInfo[] = [
  { period: 1, name: 'Vận 1', starName: 'Nhất Bạch Tham Lang', element: 'Thủy', years: '1864 - 1883', isCurrent: false },
  { period: 2, name: 'Vận 2', starName: 'Nhị Hắc Cự Môn', element: 'Thổ', years: '1884 - 1903', isCurrent: false },
  { period: 3, name: 'Vận 3', starName: 'Tam Bích Lộc Tồn', element: 'Mộc', years: '1904 - 1923', isCurrent: false },
  { period: 4, name: 'Vận 4', starName: 'Tứ Lục Văn Khúc', element: 'Mộc', years: '1924 - 1943', isCurrent: false },
  { period: 5, name: 'Vận 5', starName: 'Ngũ Hoàng Liêm Trinh', element: 'Thổ', years: '1944 - 1963', isCurrent: false },
  { period: 6, name: 'Vận 6', starName: 'Lục Bạch Vũ Khúc', element: 'Kim', years: '1964 - 1983', isCurrent: false },
  { period: 7, name: 'Vận 7', starName: 'Thất Xích Phá Quân', element: 'Kim', years: '1984 - 2003', isCurrent: false },
  { period: 8, name: 'Vận 8', starName: 'Bát Bạch Tả Phụ', element: 'Thổ', years: '2004 - 2023', isCurrent: false },
  { period: 9, name: 'Vận 9', starName: 'Cửu Tử Hữu Bật', element: 'Hỏa', years: '2024 - 2043', isCurrent: true },
];

export const STAR_NAMES: Record<number, { name: string; hanzi: string; element: ElementType; nature: string }> = {
  1: { name: 'Nhất Bạch', hanzi: '一白', element: 'Thủy', nature: 'Tham Lang Tinh - Tài vận, văn chương, quan lộc, sinh khí cát tinh' },
  2: { name: 'Nhị Hắc', hanzi: '二黑', element: 'Thổ', nature: 'Cự Môn Tinh - Trong Vận 9 là Tiến Khí cát tinh (năng lượng tương lai đang tới); ở các vận suy là Bệnh Phù tinh' },
  3: { name: 'Tam Bích', hanzi: '三碧', element: 'Mộc', nature: 'Lộc Tồn Tinh - Thị phi, quan tụng, tranh chấp' },
  4: { name: 'Tứ Lục', hanzi: '四绿', element: 'Mộc', nature: 'Văn Khúc Tinh - Học hành, thi cử, văn tinh, đào hoa' },
  5: { name: 'Ngũ Hoàng', hanzi: '五黄', element: 'Thổ', nature: 'Liêm Trinh Tinh - Đại sát tinh, tai họa, hung hiểm bậc nhất' },
  6: { name: 'Lục Bạch', hanzi: '六白', element: 'Kim', nature: 'Vũ Khúc Tinh - Quyền lực, quan lộc, quý nhân phù trợ' },
  7: { name: 'Thất Xích', hanzi: '七赤', element: 'Kim', nature: 'Phá Quân Tinh - Đạo tặc, trộm cắp, khẩu thiệt, hỏa tai' },
  8: { name: 'Bát Bạch', hanzi: '八白', element: 'Thổ', nature: 'Tả Phụ Tinh - Điền trạch, tài phú cát tinh, nhân đinh' },
  9: { name: 'Cửu Tử', hanzi: '九紫', element: 'Hỏa', nature: 'Hữu Bật Tinh - Đương vận vượng tinh tối cao Vận 9, hỷ khánh, danh tiếng' },
};

// ==========================================
// QUY TẮC TAM CÁT TINH (CHÍNH KHÍ - SINH KHÍ - TIẾN KHÍ)
// ==========================================
export interface StarPeriodStatus {
  star: number;
  period: number;
  type: 'CHINH_KHI' | 'SINH_KHI' | 'TIEN_KHI' | 'THOAI_KHI' | 'SAT_KHI';
  typeName: string;
  isGood: boolean;
  colorClass: string;
  badgeClass: string;
  description: string;
}

export function getAuspiciousStarsForPeriod(period: number): {
  chinhKhi: number;
  sinhKhi: number;
  tienKhi: number;
  thoaiKhi: number;
  goodStars: number[];
} {
  const chinhKhi = period;
  const sinhKhi = (period % 9) + 1;
  const tienKhi = ((period + 1) % 9) + 1;
  const thoaiKhi = ((period - 2 + 9) % 9) + 1;
  return {
    chinhKhi,
    sinhKhi,
    tienKhi,
    thoaiKhi,
    goodStars: [chinhKhi, sinhKhi, tienKhi],
  };
}

export function getStarPeriodStatus(star: number, period: number): StarPeriodStatus {
  const { chinhKhi, sinhKhi, tienKhi, thoaiKhi } = getAuspiciousStarsForPeriod(period);

  if (star === chinhKhi) {
    return {
      star,
      period,
      type: 'CHINH_KHI',
      typeName: 'Chính Khí (Đương Vượng)',
      isGood: true,
      colorClass: 'text-amber-400 font-bold',
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      description: `Sao ${star} là Đương Vận Vượng Tinh tối cao của Vận ${period}, chủ về nhân đinh thịnh vượng, tài lộc dồi dào, sự nghiệp thăng hoa.`,
    };
  }
  if (star === sinhKhi) {
    return {
      star,
      period,
      type: 'SINH_KHI',
      typeName: 'Sinh Khí (Đại Cát)',
      isGood: true,
      colorClass: 'text-emerald-400 font-bold',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      description: `Sao ${star} là Sinh Khí cát tinh của Vận ${period}, chủ về tương lai phát triển hanh thông, sinh sôi nảy nở, tài phúc dồi dào.`,
    };
  }
  if (star === tienKhi) {
    const specialNote = (period === 9 && star === 2)
      ? ' (Đặc biệt: Ở Vận 9, sao 2 Nhị Hắc là Tiến Khí cát tinh, năng lượng tương lai đang tới, không còn là Bệnh Phù hung tinh!)'
      : '';
    return {
      star,
      period,
      type: 'TIEN_KHI',
      typeName: 'Tiến Khí (Cát)',
      isGood: true,
      colorClass: 'text-cyan-300 font-bold',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
      description: `Sao ${star} là Tiến Khí cát tinh của Vận ${period}, đại diện cho vận hội và tiềm năng tương lai đang tiến vào.${specialNote}`,
    };
  }
  if (star === thoaiKhi) {
    return {
      star,
      period,
      type: 'THOAI_KHI',
      typeName: 'Thoái Khí (Suy)',
      isGood: false,
      colorClass: 'text-zinc-400',
      badgeClass: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
      description: `Sao ${star} là Thoái Khí (vừa hết vận), khí lực bắt đầu suy thoái, không nên kích hoạt mạnh.`,
    };
  }
  return {
    star,
    period,
    type: 'SAT_KHI',
    typeName: 'Sát Khí / Tử Khí',
    isGood: false,
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    description: `Sao ${star} là Sát Khí / Tử Khí trong Vận ${period}, chưa hợp thời, cần an tĩnh hoặc dùng biện pháp hóa giải nếu đóng tại các vị trí động.`,
  };
}

export interface CombinationMeaning {
  title: string;
  auspiciousness: 'Đại Cát' | 'Cát' | 'Bình' | 'Hung' | 'Đại Hung';
  textClassic: string; // Classical poem quote
  modernAnalysis: string; // Plain Vietnamese explanation
  suggestedUsage: string; // Best room (phòng khách, phòng ngủ...)
  remedy: string; // How to activate or cure
}

// 81 Combination Database (Sơn - Hướng)
export const STAR_COMBINATIONS: Record<string, CombinationMeaning> = {
  '1-1': {
    title: 'Song Thủy Tương Phùng - Tham Lang Trùng Phùng',
    auspiciousness: 'Cát',
    textClassic: 'Bạch Thủy trùng điệp, thiếu niên thành danh, văn chương hiển đạt.',
    modernAnalysis: 'Thủy khí dồi dào, thuận lợi học vấn, công danh, tư duy sáng tạo. Tuy nhiên nếu phi tinh suy thoái dễ phát sinh đào hoa phiền toái hoặc bệnh thận khí.',
    suggestedUsage: 'Phòng đọc sách, phòng làm việc, phòng trẻ em học tập.',
    remedy: 'Bố trí tháp Văn Xương, nghiên mực bút lông để thúc đẩy đỗ đạt. Nếu cảm thấy đào hoa sát, dùng quả cầu thạch anh màu vàng.',
  },
  '1-4': {
    title: 'Thủy Mộc Tương Sinh - Tứ Lục Nhất Bạch (Văn Xương Tinh)',
    auspiciousness: 'Đại Cát',
    textClassic: 'Nhất Tứ đồng cung, chuẩn định bảng thượng đề danh, danh cao bảng hổ.',
    modernAnalysis: 'Tổ hợp Văn Xương cát lành bậc nhất Huyền Không. Thủy sinh Mộc giúp trí tuệ khai sáng, học hành tấn tới, thi cử đỗ đạt cao, thăng quan tiến chức mau lẹ.',
    suggestedUsage: 'Vị trí đắc địa nhất đặt bàn học, bàn làm việc, thư phòng.',
    remedy: 'Kê bàn học ngồi hướng vào cung này, đặt 4 cành trúc Phú Quý ngâm trong bình thủy tinh sạch, tháp Văn Xương đá ngọc.',
  },
  '1-6': {
    title: 'Kim Thủy Đa Tình - Hư Khống Đào Hoa hoặc Hóa Quyền',
    auspiciousness: 'Cát',
    textClassic: 'Lục Nhất quán thông, thiên tài dũng tiến, xuất võ tướng văn quan.',
    modernAnalysis: 'Kim sinh Thủy, số Hà Đồ (1-6 đồng đạo sinh Thủy). Chủ về thông tuệ tài trí, có quý nhân phù trợ, kinh doanh phát đạt, nhân đinh hiển vinh.',
    suggestedUsage: 'Phòng khách, phòng giám đốc, quầy thu ngân, cửa chính.',
    remedy: 'Đặt tượng Tỳ Hưu đồng hoặc quả cầu đá thạch anh trắng tăng cường Kim khí trợ vượng tài nguyên.',
  },
  '2-5': {
    title: 'Nhị Hắc Ngũ Hoàng Độc Dược - Bệnh Phù Tai Ương',
    auspiciousness: 'Đại Hung',
    textClassic: 'Nhị Ngũ giao gia tất tổn chủ, tật ách liên miên, quả phụ khấp khốc.',
    modernAnalysis: 'Tổ hợp hung hiểm nhất trong Huyền Không Phi Tinh. Cả hai đều là Thổ sát (Bệnh phù và Liêm trinh ngũ hoàng), chủ về bệnh nặng, tai nạn bất ngờ, tán gia bại sản, phụ nữ trong nhà gặp nạn.',
    suggestedUsage: 'Kỵ tuyệt đối làm phòng ngủ gia chủ, bếp nấu hoặc mở cửa chính. Thích hợp làm kho đồ, nhà vệ sinh tĩnh.',
    remedy: 'Treo chuông gió đồng 6 ống rỗng kim loại hoặc đặt hồ lô đồng nguyên chất để tiết khí Thổ hung hiểm. Tuyệt đối không bật đèn đỏ, không để vật màu cam/đỏ/vàng.',
  },
  '5-2': {
    title: 'Ngũ Hoàng Nhị Hắc - Khí Thổ Trùng Phùng Sát Khí',
    auspiciousness: 'Đại Hung',
    textClassic: 'Hoàng Cự giao xung, hung sát trùng điệp, chủ thương tàn tật hoạn.',
    modernAnalysis: 'Tương tự tổ hợp 2-5, sát khí tích tụ cực lớn. Nếu là cửa ra vào hoặc bếp nấu sẽ kích động hung tinh sinh bệnh về đường ruột, ung thư, thương tật.',
    suggestedUsage: 'Nên giữ tĩnh lặng, tránh gõ đập sửa chữa hay bố trí vật động tại cung này.',
    remedy: 'Đặt hũ An Nhẫn Thủy (muối biển + 6 đồng tiền đồng + 1 đồng tiền bạc) hoặc kỳ lân đồng để hóa sát Thổ.',
  },
  '3-7': {
    title: 'Xuyên Tâm Sát - Kiếp Đạo Khẩu Thiệt (Mộc Kim Tương Tàn)',
    auspiciousness: 'Hung',
    textClassic: 'Tam Thất giao tao, tất phùng đạo tặc, hình thương khẩu thiệt liên miên.',
    modernAnalysis: 'Thất Xích Kim khắc Tam Bích Mộc, còn gọi là Kiếp đạo sát. Dễ gặp trộm cắp, lừa đảo, tranh chấp pháp luật kiện tụng, khẩu thiệt thị phi, tổn thương chân tay gan mật.',
    suggestedUsage: 'Không nên đặt cửa chính hoặc ban công mở rộng ở đây.',
    remedy: 'Dùng Thủy (bình nước phong thủy an tĩnh, màu xanh dương đậm) để thông quan: Kim sinh Thủy -> Thủy sinh Mộc, hóa giải xung sát.',
  },
  '7-9': {
    title: 'Cửu Thất Hợp Sát - Hồi Lộc Chi Tai (Hỏa Kim Xung Đốt)',
    auspiciousness: 'Hung',
    textClassic: 'Thất Cửu hợp sát, xích chúc đan đan, phòng hỏa tai dữ thổ huyết đồ hình.',
    modernAnalysis: 'Cửu Tử Hỏa khắc Thất Xích Kim. Dễ sinh hỏa hoạn, tai nạn cháy nổ, bệnh tim mạch mắt huyết áp, tranh cãi gay gắt, đào hoa sa đọa.',
    suggestedUsage: 'Tránh đặt bếp nấu hoặc các thiết bị sinh nhiệt cao tại cung này.',
    remedy: 'Dùng Thổ (đá thạch anh vàng, gốm sứ hoàng thổ) để thông quan: Hỏa sinh Thổ -> Thổ sinh Kim, hòa giải xung đột.',
  },
  '9-9': {
    title: 'Song Tinh Đáo Cung Vận 9 - Tử Khí Đương Vượng Hỷ Khánh',
    auspiciousness: 'Đại Cát',
    textClassic: 'Cửu Tử đương thời, lộc vượng vô song, hỷ sự trùng trùng liên tiếp.',
    modernAnalysis: 'Trong Vận 9 (2024 - 2043), Cửu Tử là đương lệnh Đế Vương Tinh. Cung có sao 9 vượng khí chủ về đại cát, sự nghiệp rực rỡ, danh vọng vang xa, tài lộc dồi dào, gia đạo nhiều hỷ tín.',
    suggestedUsage: 'Cực tốt mở cửa chính, phòng khách, phòng làm việc lãnh đạo, quầy thu ngân.',
    remedy: 'Kích hoạt bằng ánh sáng rực rỡ, đèn chùm ấm áp, hoặc bố trí thác nước phong thủy (nếu sao 9 là Hướng tinh) để kích tài.',
  },
  '8-8': {
    title: 'Song Thổ Bát Bạch - Phú Quý Cự Vạn (Sinh Nhân Đinh)',
    auspiciousness: 'Cát',
    textClassic: 'Bát Bạch quy nguyên, điền sản dồi dào, nhân đinh hưng thịnh.',
    modernAnalysis: 'Sao số 8 là vượng tinh của Vận 8, sang Vận 9 trở thành thoái khí nhẹ nhưng bản chất vẫn là cát tinh thiện lành của Bát Vận. Vẫn trợ tốt cho tích lũy đất đai, bền vững gia đạo.',
    suggestedUsage: 'Phòng ngủ vợ chồng, phòng khách, phòng kho tích trữ.',
    remedy: 'Đặt quả cầu thạch anh mắt hổ, tụ bảo bồn phong thủy để lưu giữ của cải.',
  },
  '8-9': {
    title: 'Thổ Hỏa Tương Sinh - Hỷ Khánh Đương Niên Đắc Tài',
    auspiciousness: 'Đại Cát',
    textClassic: 'Bát Cửu đồng đồ, hỷ sự lâm môn, phú quý song toàn.',
    modernAnalysis: 'Hỏa sinh Thổ, kết hợp giữa sao vượng khí đương thời (9) và cát tinh phúc đức (8). Chủ về hôn nhân hỷ khánh, thăng tiến thuận buồm xuôi gió, sinh con quý tử.',
    suggestedUsage: 'Phòng khách, phòng ngủ vợ chồng, cửa chính nhà.',
    remedy: 'Bố trí ánh sáng hài hòa, cây cảnh tươi tốt hoặc tranh phong cảnh đón bình minh.',
  },
  '9-8': {
    title: 'Hỏa Thổ Tương Sinh - Tiến Khí Đăng Khoa Đắc Lộc',
    auspiciousness: 'Đại Cát',
    textClassic: 'Cửu Bát hợp hoan, tiền tài thịnh vượng, gia đình ấm êm.',
    modernAnalysis: 'Sơn tinh 9 vượng nhân đinh kết hợp Hướng tinh 8 điền sản cát khí. Mang lại tài lộc vững chắc, công việc hanh thông, con cái thảo hiền.',
    suggestedUsage: 'Phòng khách, phòng ngủ, phòng giám đốc.',
    remedy: 'Bố trí bình hoa màu đỏ hoặc cam phối với bình gốm sứ phong thủy.',
  },
  '9-2': {
    title: 'Hỏa Thổ Tương Sinh - Đương Vận Phối Tiến Khí (Đại Cát Vận 9)',
    auspiciousness: 'Đại Cát',
    textClassic: 'Cửu Nhị hợp phối, Hỏa sinh vượng Thổ, điền sản bội tăng, sinh con quý tử.',
    modernAnalysis: 'Trong Vận 9 (2024 - 2043), Cửu Tử (9) là Đương Vận Chính Khí, còn Nhị Hắc (2) đã chuyển hóa thành TIẾN KHÍ cát tinh (năng lượng tương lai đang tiến vào). Hỏa sinh Thổ tương sinh hữu tình, chủ về gia đạo êm ấm, tích lũy đất đai nhà cửa cực vượng, phúc lộc dồi dào.',
    suggestedUsage: 'Rất tốt cho phòng ngủ gia chủ, phòng khách, phòng làm việc bất động sản / tài chính.',
    remedy: 'Bố trí đèn ấm áp, tranh phong cảnh đồi núi hoặc bình gốm sứ hoàng gia trợ khí.',
  },
  '2-9': {
    title: 'Tiến Khí Đắc Vượng - Hỏa Thổ Giao Hòa (Vận 9 Cát Khánh)',
    auspiciousness: 'Đại Cát',
    textClassic: 'Nhị Cửu giao cảm, điền trạch hiển vinh, phú gia hưng khởi.',
    modernAnalysis: 'Sơn tinh 2 là Tiến Khí tương lai, Hướng tinh 9 là Đương Vận Vượng Tinh tối cao. Đây là tổ hợp đón đầu tương lai đại cát của Vận 9, giúp tài sản phát triển theo cấp số nhân và hậu vận vững chắc.',
    suggestedUsage: 'Phòng khách, sảnh chính, cửa ra vào, phòng làm việc.',
    remedy: 'Kích hoạt bằng ánh sáng rực rỡ hoặc quả cầu phong thủy bằng đá tự nhiên.',
  },
  '1-2': {
    title: 'Sinh Khí Phối Tiến Khí - Song Tinh Vận Hội Mới (Vận 9 Cát Tường)',
    auspiciousness: 'Cát',
    textClassic: 'Bạch Thủy ngộ Cự Môn, tân khí giao tế, văn võ song toàn.',
    modernAnalysis: 'Trong Vận 9, sao 1 là Sinh Khí (cát tinh tương lai gần) và sao 2 là Tiến Khí (cát tinh tương lai xa). Bộ đôi mang năng lượng hồi sinh mạnh mẽ, thúc đẩy học hành, danh tiếng và sự tích lũy lâu bền.',
    suggestedUsage: 'Phòng học tập, phòng nghiên cứu, phòng ngủ.',
    remedy: 'Dùng một chậu cây xanh phong thủy nhỏ (Mộc) làm cầu nối thông quan tương sinh hài hòa.',
  },
  '2-1': {
    title: 'Tiến Khí Ngộ Sinh Khí - Tích Tài Phát Trí (Vận 9 Hanh Thông)',
    auspiciousness: 'Cát',
    textClassic: 'Cự Môn phùng Nhất Bạch, nhân đinh phát đạt, gia tài tăng tiến.',
    modernAnalysis: 'Tổ hợp quy tụ hai sao cát khí kế tiếp của Tam Nguyên Cửu Vận (Sinh khí 1 và Tiến khí 2). Trong Vận 9, khí trường cung này mang lại sự ổn định và phát triển dần qua từng năm.',
    suggestedUsage: 'Phòng đọc sách, phòng sinh hoạt, phòng ngủ.',
    remedy: 'Bố trí không gian sạch sẽ, thoáng mát, đón ánh sáng tự nhiên.',
  },
  '2-2': {
    title: 'Song Tinh Nhị Hắc - Tiến Khí Điền Trạch (Vận 9 Khởi Sắc)',
    auspiciousness: 'Cát',
    textClassic: 'Nhị Hắc trùng phùng, tại đương suy là bệnh phù, tại đương tiến là điền trạch.',
    modernAnalysis: 'Trong Vận 8 trở về trước, sao 2 là Bệnh Phù hung tinh. Nhưng bước vào Vận 9, sao 2 là Tiến Khí của vận tiếp theo, bắt đầu khởi sắc về đất đai điền trạch. Tuy nhiên bản chất Thổ dày vẫn cần giữ không gian sạch thoáng, tránh ẩm thấp.',
    suggestedUsage: 'Phòng kho, phòng lưu trữ tài liệu, phòng ngủ (cần thoáng khí).',
    remedy: 'Giữ phòng ốc khô ráo, dùng đèn ánh sáng dịu, có thể đặt hồ lô ngọc.',
  },
  '9-1': {
    title: 'Thủy Hỏa Ký Tế - Âm Dương Tương Cầu Diệu Dụng',
    auspiciousness: 'Đại Cát',
    textClassic: 'Nhất Cửu giao cảm, Thủy Hỏa tương tể, quân tử thành tựu đại nghiệp.',
    modernAnalysis: 'Số 1 và số 9 là trục Nam Bắc kết nối Khảm Ly. Trong Vận 9, sao 9 là Đương Vận Chính Khí và sao 1 là Sinh Khí tối cát. Cung vị hội tụ cả hai sao hàng đầu của Vận 9, chủ về đại phú đại quý, danh tiếng lẫy lừng.',
    suggestedUsage: 'Phòng làm việc sáng tạo, phòng học, phòng khách, cửa chính.',
    remedy: 'Dùng một chậu cây xanh phong thủy nhỏ để làm cầu nối Thủy -> Mộc -> Hỏa.',
  },
  '1-9': {
    title: 'Thủy Hỏa Hoán Vị - Đương Vượng Hướng Tinh (Đại Cát Vận 9)',
    auspiciousness: 'Đại Cát',
    textClassic: 'Khảm Ly giao tế, danh hiển bốn phương, phúc lộc song toàn.',
    modernAnalysis: 'Sơn tinh 1 là Sinh Khí chủ sức khỏe tài trí, Hướng tinh 9 là Đương Vận Vượng Tinh chủ tài lộc rực rỡ. Cực kỳ thuận lợi cho mở cửa chính hoặc phòng khách lớn đón tài khí.',
    suggestedUsage: 'Cửa chính, phòng khách, khu vực kinh doanh, tiếp khách.',
    remedy: 'Bố trí tiểu cảnh nước hoặc ánh sáng ấm áp để kích tài.',
  },
  '6-8': {
    title: 'Phú Tỷ Đào Chu - Kim Thổ Tương Sinh Kiên Cố',
    auspiciousness: 'Đại Cát',
    textClassic: 'Lục Bát vũ khúc tả phụ, phú khả địch quốc, danh truyền thiên hạ.',
    modernAnalysis: 'Bát Bạch Thổ sinh Lục Bạch Kim, là hai đại cát tinh trong Bát Bạch Tam Cát. Chủ về tài lộc dồi dào, thăng quan tiến chức, có uy quyền và bất động sản lớn.',
    suggestedUsage: 'Phòng chủ nhà, phòng giám đốc, quầy thu ngân, két sắt.',
    remedy: 'Đặt quả cầu thạch anh vàng hoặc tỳ hưu đồng mạ vàng.',
  },
  '8-6': {
    title: 'Thổ Kim Tương Sinh - Uy Quyền Phú Túc',
    auspiciousness: 'Đại Cát',
    textClassic: 'Thổ sinh Lục Bạch, võ quan hiển đạt, nhân tài bội xuất.',
    modernAnalysis: 'Cung này cực tốt cho lãnh đạo, chính khách, quân nhân, người quản lý cấp cao. Tài lộc và chức quyền cùng tiến.',
    suggestedUsage: 'Phòng làm việc lãnh đạo, phòng khách chính.',
    remedy: 'Bày ấn rồng bằng ngọc hoặc thạch anh trắng.',
  },
  '2-3': {
    title: 'Đấu Ngưu Sát - Mộc Thổ Tương Tranh Thị Phi Khẩu Thiệt',
    auspiciousness: 'Hung',
    textClassic: 'Nhị Tam đấu ngưu, nam nữ tranh đấu, mẫu tử bất hòa, quan tai thị phi.',
    modernAnalysis: 'Tam Bích Mộc khắc Nhị Hắc Thổ. Gia đình dễ bất hòa cãi cọ, con cái ngỗ ngược, tranh chấp kiện tụng tài sản. Tuy nhiên ở Vận 9 sát tính giảm bớt do sao 2 là Tiến Khí.',
    suggestedUsage: 'Tránh đặt phòng ngủ hoặc phòng ăn tại đây.',
    remedy: 'Dùng Hỏa để thông quan: Đặt đèn ngủ màu đỏ hoặc thảm màu đỏ, Mộc sinh Hỏa -> Hỏa sinh Thổ hóa giải xung đột.',
  },
  '3-2': {
    title: 'Đấu Ngưu Khí Sát - Tranh Tranh Khẩu Khí',
    auspiciousness: 'Hung',
    textClassic: 'Mộc khắc hung Thổ, kiện tụng liên miên, dạ dày tiêu hóa suy tổn.',
    modernAnalysis: 'Xung khắc Mộc Thổ gây hại cho sức khỏe đường tiêu hóa và gan mật, gây cãi vã triền miên.',
    suggestedUsage: 'Khu vực tĩnh, tránh sinh hoạt tập trung đông người.',
    remedy: 'Treo đèn lồng đỏ hoặc dùng tranh có sắc thái ấm nóng.',
  },
  '4-8': {
    title: 'Mộc Khắc Cấn Thổ - Tổn Khuyết Tiểu Nhi',
    auspiciousness: 'Hung',
    textClassic: 'Tứ Lục khắc Cấn, phong tật hung tinh, tiểu nhi bị thương hoặc bất an.',
    modernAnalysis: 'Tứ Lục Mộc khắc Bát Bạch Thổ (Cấn chủ thiếu nam). Cẩn trọng sức khỏe của trẻ nhỏ trong nhà, tỳ vị yếu, dễ trúng gió cảm mạo.',
    suggestedUsage: 'Không nên làm phòng trẻ em hoặc người già.',
    remedy: 'Dùng ánh sáng ấm áp hoặc vật phẩm màu đỏ, tím (Hỏa) để hòa giải Mộc khắc Thổ.',
  },
  '7-7': {
    title: 'Song Kim Phá Quân - Thoái Khí Đạo Tặc Hỏa Tai',
    auspiciousness: 'Hung',
    textClassic: 'Trùng trùng Thất Xích, đao kiếm sát thương, nữ nhân dâm loạn hoặc trộm cắp.',
    modernAnalysis: 'Thất Xích đã thoái vận từ lâu. Hai sao 7 tụ hội dễ gặp chuyện thị phi, kiện cáo, mất cắp, thương tích do kim loại.',
    suggestedUsage: 'Tránh đặt cửa chính hoặc ban công.',
    remedy: 'Đặt bình nước tĩnh (Thủy an tĩnh) để tiết giảm bớt Kim khí sát.',
  },
};

// Fallback generator for combinations not explicitly covered above
export function getCombinationAnalysis(
  mountainStar: number,
  facingStar: number,
  periodStar: number,
  currentPeriod: number = 9
): CombinationMeaning {
  const key = `${mountainStar}-${facingStar}`;
  if (STAR_COMBINATIONS[key]) {
    return STAR_COMBINATIONS[key];
  }

  const sM = STAR_NAMES[mountainStar];
  const sF = STAR_NAMES[facingStar];

  // Tam Cát Tinh của Vận hiện tại: Chính Khí (Đương Vận), Sinh Khí, Tiến Khí
  const { chinhKhi, sinhKhi, tienKhi, goodStars } = getAuspiciousStarsForPeriod(currentPeriod);

  const isMountainGood = goodStars.includes(mountainStar);
  const isFacingGood = goodStars.includes(facingStar);
  const isBothGood = isMountainGood && isFacingGood;

  // Xử lý Ngũ Hoàng và Nhị Hắc:
  // Riêng Vận 9: Nhị Hắc (2) là Tiến Khí cát tinh, không phải hung tinh!
  // Chỉ Ngũ Hoàng (5) là đại sát bất kể vận nào.
  let isTerrible = false;
  if (currentPeriod === 9) {
    if (mountainStar === 5 && facingStar === 5) {
      isTerrible = true;
    }
  } else {
    if ((mountainStar === 5 && facingStar === 2) || (mountainStar === 2 && facingStar === 5)) {
      isTerrible = true;
    }
  }

  // Element interaction
  let interaction = '';
  if (sM.element === sF.element) {
    interaction = `Lưỡng tinh tỷ hòa (${sM.element})`;
  } else {
    interaction = `Sơn tinh ${sM.name} (${sM.element}) phối Hướng tinh ${sF.name} (${sF.element})`;
  }

  // Phân loại cát hung chuẩn xác theo nguyên lý Vượng - Sinh - Tiến
  let rating: 'Đại Cát' | 'Cát' | 'Bình' | 'Hung' | 'Đại Hung' = 'Bình';
  if (isTerrible) {
    rating = 'Đại Hung';
  } else if (isBothGood) {
    rating = 'Đại Cát';
  } else if (isMountainGood || isFacingGood) {
    if (mountainStar === 5 || facingStar === 5) {
      rating = 'Bình'; // Bị Ngũ Hoàng hãm bớt
    } else {
      rating = 'Cát';
    }
  } else if (mountainStar === 5 || facingStar === 5) {
    rating = 'Hung';
  } else {
    rating = 'Bình';
  }

  const goodNote = isBothGood
    ? `Cung hội tụ cả 2 cát tinh trong bộ Tam Cát Tinh Vận ${currentPeriod} (sao ${mountainStar} & ${facingStar}), phúc khí trùng điệp.`
    : isFacingGood
    ? `Hướng tinh ${facingStar} đắc cát khí Vận ${currentPeriod} (thuộc bộ Tam Cát: Chính ${chinhKhi}, Sinh ${sinhKhi}, Tiến ${tienKhi}), vượng cho tài lộc kinh doanh.`
    : isMountainGood
    ? `Sơn tinh ${mountainStar} đắc cát khí Vận ${currentPeriod} (thuộc bộ Tam Cát: Chính ${chinhKhi}, Sinh ${sinhKhi}, Tiến ${tienKhi}), trợ vượng nhân đinh và gia đạo.`
    : `Trong Vận ${currentPeriod}, Sơn tinh đại diện cho sức khỏe, nhân đinh; Hướng tinh đại diện cho tiền tài, công danh.`;

  return {
    title: `Tổ hợp Sơn ${mountainStar} - Hướng ${facingStar} (${sM.name} & ${sF.name})`,
    auspiciousness: rating,
    textClassic: `Cung vị tụ hội ${sM.name} tọa chủ và ${sF.name} hướng chủ, phối Vận tinh ${periodStar}.`,
    modernAnalysis: `${interaction}. ${goodNote}`,
    suggestedUsage: rating === 'Hung' || rating === 'Đại Hung' ? 'Nên bố trí khu vực tĩnh hoặc nhà vệ sinh, kho chứa đồ.' : 'Phù hợp bố trí phòng sinh hoạt, phòng khách, phòng ngủ.',
    remedy: rating === 'Hung' || rating === 'Đại Hung' 
      ? 'Dùng vật phẩm phong thuộc hành Kim (chuông gió đồng, hồ lô) hoặc Thủy an tĩnh để hóa giải sát khí.' 
      : 'Giữ không gian thông thoáng, sạch sẽ, đón ánh sáng tự nhiên.',
  };
}
