import {
  BatTrachStarType,
  BatTrachStarInfo,
  OwnerProfile,
  BatTrachAnalysis,
  BatTrachPalaceInfo,
  ElementType,
} from '../types/fengshui';
import { PALACE_METAS } from './fengshuiConstants';

// 8 Du Niên Stars Definition
export const BAT_TRACH_STARS: Record<BatTrachStarType, BatTrachStarInfo> = {
  'Sinh Khí': {
    name: 'Sinh Khí',
    alias: 'Tham Lang Mộc',
    nature: 'Đại Cát',
    isGood: true,
    element: 'Mộc',
    meaning: 'Cát tinh số 1: Vượng tài lộc, kinh doanh phát đạt, sự nghiệp thăng tiến, sinh lực dồi dào.',
    badgeClass: 'bg-emerald-600 text-white border-emerald-500',
  },
  'Thiên Y': {
    name: 'Thiên Y',
    alias: 'Cự Môn Thổ',
    nature: 'Cát',
    isGood: true,
    element: 'Thổ',
    meaning: 'Cát tinh số 2: Chủ về sức khỏe, trường thọ, gia tăng tài sản, có quý nhân phù trợ.',
    badgeClass: 'bg-teal-600 text-white border-teal-500',
  },
  'Diên Niên': {
    name: 'Diên Niên',
    alias: 'Vũ Khúc Kim (Phúc Đức)',
    nature: 'Đại Cát',
    isGood: true,
    element: 'Kim',
    meaning: 'Cát tinh số 3: Vượng tình duyên, gia đạo hòa hợp hạnh phúc, nhân đinh an lành, gắn kết quan hệ.',
    badgeClass: 'bg-cyan-600 text-white border-cyan-500',
  },
  'Phục Vị': {
    name: 'Phục Vị',
    alias: 'Tả Phụ Mộc',
    nature: 'Tiểu Cát',
    isGood: true,
    element: 'Mộc',
    meaning: 'Cát tinh số 4: An định, vững chãi, thi cử tiến bộ, tâm thần thanh thản, tốt cho bàn thờ.',
    badgeClass: 'bg-blue-600 text-white border-blue-500',
  },
  'Tuyệt Mệnh': {
    name: 'Tuyệt Mệnh',
    alias: 'Phá Quân Kim',
    nature: 'Đại Hung',
    isGood: false,
    element: 'Kim',
    meaning: 'Hung tinh số 1: Tổn hại sức khỏe, tai ách bất ngờ, phá tán tài sản, dễ mắc bệnh hiểm.',
    badgeClass: 'bg-rose-700 text-white border-rose-600',
  },
  'Ngũ Quỷ': {
    name: 'Ngũ Quỷ',
    alias: 'Liêm Trinh Hỏa',
    nature: 'Đại Hung',
    isGood: false,
    element: 'Hỏa',
    meaning: 'Hung tinh số 2: Gây hỏa hoạn, thị phi, tranh chấp kiện tụng, trộm cắp, mất việc làm.',
    badgeClass: 'bg-red-600 text-white border-red-500',
  },
  'Lục Sát': {
    name: 'Lục Sát',
    alias: 'Văn Khúc Thủy',
    nature: 'Thứ Hung',
    isGood: false,
    element: 'Thủy',
    meaning: 'Hung tinh số 3: Gia đình xào xáo, kiện tụng thị phi, đào hoa sát xấu, trắc trở làm ăn.',
    badgeClass: 'bg-amber-600 text-white border-amber-500',
  },
  'Họa Hại': {
    name: 'Họa Hại',
    alias: 'Lộc Tồn Thổ',
    nature: 'Tiểu Hung',
    isGood: false,
    element: 'Thổ',
    meaning: 'Hung tinh số 4: Bất hòa khẩu thiệt, hao tài tốn của nhỏ, thị phi vặt vãnh, thiếu kiên định.',
    badgeClass: 'bg-orange-600 text-white border-orange-500',
  },
};

// 8 Trigrams Palace Number mapping
// 1: Khảm, 2: Khôn, 3: Chấn, 4: Tốn, 6: Càn, 7: Đoài, 8: Cấn, 9: Ly
export const TRIGRAM_TO_PALACE: Record<string, number> = {
  Khảm: 1,
  Khôn: 2,
  Chấn: 3,
  Tốn: 4,
  Càn: 6,
  Đoài: 7,
  Cấn: 8,
  Ly: 9,
};

// 8 Trigram Du Niên Matrix: [Base Trigram][Target Palace Number] => Star Type
export const BAT_TRACH_MATRIX: Record<string, Record<number, BatTrachStarType>> = {
  Khảm: {
    1: 'Phục Vị',
    4: 'Sinh Khí',
    3: 'Thiên Y',
    9: 'Diên Niên',
    2: 'Tuyệt Mệnh',
    8: 'Ngũ Quỷ',
    6: 'Lục Sát',
    7: 'Họa Hại',
  },
  Ly: {
    9: 'Phục Vị',
    3: 'Sinh Khí',
    4: 'Thiên Y',
    1: 'Diên Niên',
    6: 'Tuyệt Mệnh',
    7: 'Ngũ Quỷ',
    2: 'Lục Sát',
    8: 'Họa Hại',
  },
  Chấn: {
    3: 'Phục Vị',
    9: 'Sinh Khí',
    1: 'Thiên Y',
    4: 'Diên Niên',
    7: 'Tuyệt Mệnh',
    6: 'Ngũ Quỷ',
    8: 'Lục Sát',
    2: 'Họa Hại',
  },
  Tốn: {
    4: 'Phục Vị',
    1: 'Sinh Khí',
    9: 'Thiên Y',
    3: 'Diên Niên',
    8: 'Tuyệt Mệnh',
    2: 'Ngũ Quỷ',
    7: 'Lục Sát',
    6: 'Họa Hại',
  },
  Càn: {
    6: 'Phục Vị',
    7: 'Sinh Khí',
    8: 'Thiên Y',
    2: 'Diên Niên',
    9: 'Tuyệt Mệnh',
    3: 'Ngũ Quỷ',
    1: 'Lục Sát',
    4: 'Họa Hại',
  },
  Khôn: {
    2: 'Phục Vị',
    8: 'Sinh Khí',
    7: 'Thiên Y',
    6: 'Diên Niên',
    1: 'Tuyệt Mệnh',
    4: 'Ngũ Quỷ',
    9: 'Lục Sát',
    3: 'Họa Hại',
  },
  Cấn: {
    8: 'Phục Vị',
    2: 'Sinh Khí',
    6: 'Thiên Y',
    7: 'Diên Niên',
    4: 'Tuyệt Mệnh',
    1: 'Ngũ Quỷ',
    3: 'Lục Sát',
    9: 'Họa Hại',
  },
  Đoài: {
    7: 'Phục Vị',
    6: 'Sinh Khí',
    2: 'Thiên Y',
    8: 'Diên Niên',
    3: 'Tuyệt Mệnh',
    9: 'Ngũ Quỷ',
    4: 'Lục Sát',
    1: 'Họa Hại',
  },
};

// Can Chi Calculation Helpers
const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// 60 Hoa Giáp Nạp Âm Table
const NAP_AM_MAP: Record<string, string> = {
  'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
  'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
  'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
  'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
  'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
  'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
  'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
  'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
  'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
  'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
  'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
  'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
  'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
  'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
  'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
  'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
  'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
  'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
  'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
  'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
  'Giáp Thìn': 'Phúc Đăng Hỏa', 'Ất Tỵ': 'Phúc Đăng Hỏa',
  'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
  'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy',
};

// Ngũ Hành Bát Quái Cung Phi (Kèm dấu Âm/Dương)
export const CUNG_PHI_NGU_HANH: Record<string, string> = {
  'Khảm': '+ Thủy',
  'Khôn': '- Thổ',
  'Chấn': '+ Mộc',
  'Tốn': '- Mộc',
  'Càn': '+ Kim',
  'Đoài': '- Kim',
  'Cấn': '+ Thổ',
  'Ly': '- Hỏa',
};

// Calculate Owner Profile (Cung Phi & Mệnh Quái)
export function calculateOwnerProfile(birthYear: number, gender: 'nam' | 'nu'): OwnerProfile {
  // Can Chi
  const canIndex = (birthYear - 4) % 10;
  const chiIndex = (birthYear - 4) % 12;
  const can = THIEN_CAN[canIndex >= 0 ? canIndex : canIndex + 10];
  const chi = DIA_CHI[chiIndex >= 0 ? chiIndex : chiIndex + 12];
  const canChi = `${can} ${chi}`;
  const menhNguHanh = NAP_AM_MAP[canChi] || 'Bình Địa Mộc';

  // Cung Phi calculation based on Year (Last 2 digits sum) & Gender:
  // Chuẩn phong thủy Bát Trạch: Lấy 2 số cuối của năm sinh cộng lại rút gọn về 1 chữ số (k)
  const last2 = birthYear % 100;
  let sum = Math.floor(last2 / 10) + (last2 % 10);
  while (sum >= 10) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }

  let cungNum: number;
  if (birthYear < 2000) {
    // 1900 - 1999: Nam = 10 - k; Nữ = 5 + k
    if (gender === 'nam') {
      cungNum = (10 - sum) % 9;
      if (cungNum === 0) cungNum = 9;
    } else {
      cungNum = (sum + 5) % 9;
      if (cungNum === 0) cungNum = 9;
    }
  } else {
    // 2000+: Nam = 9 - k; Nữ = 6 + k
    if (gender === 'nam') {
      cungNum = (9 - sum) % 9;
      if (cungNum <= 0) cungNum += 9;
    } else {
      cungNum = (sum + 6) % 9;
      if (cungNum === 0) cungNum = 9;
    }
  }

  // Quy ước phong thủy Lạc Thư: Số 5 -> Nam quy về Khôn (2), Nữ quy về Cấn (8)
  if (cungNum === 5) {
    cungNum = gender === 'nam' ? 2 : 8;
  }

  const cungNames: Record<number, string> = {
    1: 'Khảm',
    2: 'Khôn',
    3: 'Chấn',
    4: 'Tốn',
    6: 'Càn',
    7: 'Đoài',
    8: 'Cấn',
    9: 'Ly',
  };

  const cungPhi = cungNames[cungNum] || 'Khảm';
  const dongTuCung = ['Khảm', 'Chấn', 'Tốn', 'Ly'];
  const nhomMenh = dongTuCung.includes(cungPhi) ? 'Đông Tứ Mệnh' : 'Tây Tứ Mệnh';

  return {
    birthYear,
    gender,
    canChi,
    menhNguHanh,
    cungPhi,
    cungPhiNguHanh: CUNG_PHI_NGU_HANH[cungPhi] || '+ Thổ',
    cungPhiNumber: cungNum,
    nhomMenh,
  };
}

// Calculate Full Bát Trạch Analysis for House and Owner
export function calculateBatTrach(
  sittingTrigram: string,
  facingTrigram: string,
  owner?: OwnerProfile
): BatTrachAnalysis {
  const houseGroup = ['Khảm', 'Chấn', 'Tốn', 'Ly'].includes(sittingTrigram)
    ? 'Đông Tứ Trạch'
    : 'Tây Tứ Trạch';

  const houseMatrix = BAT_TRACH_MATRIX[sittingTrigram] || BAT_TRACH_MATRIX['Khảm'];
  const ownerMatrix = owner ? BAT_TRACH_MATRIX[owner.cungPhi] || null : null;

  const palaces: Record<number, BatTrachPalaceInfo> = {};

  [1, 2, 3, 4, 6, 7, 8, 9].forEach((pNum) => {
    const meta = PALACE_METAS[pNum];
    const houseStarType = houseMatrix[pNum] || 'Phục Vị';
    const houseStar = BAT_TRACH_STARS[houseStarType];

    let ownerStar: BatTrachStarInfo | undefined;
    if (ownerMatrix) {
      const ownerStarType = ownerMatrix[pNum] || 'Phục Vị';
      ownerStar = BAT_TRACH_STARS[ownerStarType];
    }

    palaces[pNum] = {
      palaceNumber: pNum,
      directionName: meta.name,
      trigram: meta.trigram,
      houseStar,
      ownerStar,
    };
  });

  // Center palace
  palaces[5] = {
    palaceNumber: 5,
    directionName: 'Trung Cung (Thiên Tâm)',
    trigram: 'Thái Cực',
    houseStar: {
      name: 'Phục Vị',
      alias: 'Trung Tâm Lập Cực',
      nature: 'Cát',
      isGood: true,
      element: 'Thổ',
      meaning: 'Tâm nhà: Nơi hội tụ sinh khí, cần giữ gìn thanh tịnh, thông thoáng, không đặt vệ sinh hay vật nặng chèn ép.',
      badgeClass: 'bg-amber-600 text-white border-amber-500',
    },
  };

  // Compatibility evaluation between Owner and House Facing
  let compatibility: { isCompatible: boolean; rating: string; description: string } | undefined;
  if (owner) {
    const facingPalaceNum = TRIGRAM_TO_PALACE[facingTrigram] || 9;
    const facingStarForOwner = ownerMatrix ? ownerMatrix[facingPalaceNum] : null;

    const isGroupMatch =
      (owner.nhomMenh === 'Đông Tứ Mệnh' && houseGroup === 'Đông Tứ Trạch') ||
      (owner.nhomMenh === 'Tây Tứ Mệnh' && houseGroup === 'Tây Tứ Trạch');

    if (facingStarForOwner && BAT_TRACH_STARS[facingStarForOwner].isGood) {
      compatibility = {
        isCompatible: true,
        rating: `Đại Cát · Đón Sao ${facingStarForOwner}`,
        description: `Gia chủ tuổi ${owner.canChi} (${owner.cungPhi} ${owner.cungPhiNguHanh} - ${owner.nhomMenh}) ở nhà ${houseGroup} đón đúng cung ${facingStarForOwner} (${BAT_TRACH_STARS[facingStarForOwner].alias}). Rất vượng khí, tài lộc dồi dào, gia quyến an khang.`,
      };
    } else if (facingStarForOwner) {
      compatibility = {
        isCompatible: false,
        rating: `Nghịch Hướng · Phạm Sao ${facingStarForOwner}`,
        description: `Gia chủ tuổi ${owner.canChi} (${owner.cungPhi} ${owner.cungPhiNguHanh} - ${owner.nhomMenh}) ở nhà hướng ${facingTrigram} bị phạm cung ${facingStarForOwner} (${BAT_TRACH_STARS[facingStarForOwner].alias}). Cần dùng phương pháp "Bếp tọa hung hướng cát" và vật phẩm phong thủy ngũ hành để hóa giải.`,
      };
    }
  }

  return {
    houseTrach: {
      name: `${sittingTrigram} Trạch`,
      group: houseGroup,
      sittingTrigram,
      facingTrigram,
    },
    owner,
    compatibility,
    palaces,
  };
}
