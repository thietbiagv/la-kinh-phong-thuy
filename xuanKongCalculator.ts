import {
  Mountain24,
  PalaceData,
  ChartFormation,
  ChartAnalysis,
  PolarityType,
  YuanType,
  ThanhMonGate,
  ThanhMonAnalysis,
  FlyingStarChartMode,
  TheQuaiDetails,
} from '../types/fengshui';
import {
  MOUNTAINS_24,
  PALACE_METAS,
  LUO_SHU_FLIGHT_PATH,
  getCombinationAnalysis,
} from './fengshuiConstants';

// Helper to normalize degrees to [0, 360)
export function normalizeDegree(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Find mountain from a given degree (0° - 360°)
export function getMountainFromDegree(degree: number): {
  mountain: Mountain24;
  deviation: number;
  isKiemHuong: boolean;
  isKhongVong: boolean;
  khongVongType: 'Đại Không Vong' | 'Tiểu Không Vong' | 'Không';
} {
  const normDeg = normalizeDegree(degree);

  // Find mountain whose range contains normDeg
  let found = MOUNTAINS_24.find((m) => {
    if (m.name === 'Tý') {
      // Tý wraps around 0: 352.5° to 360° and 0° to 7.5°
      return normDeg >= 352.5 || normDeg < 7.5;
    }
    return normDeg >= m.startDeg && normDeg < m.endDeg;
  });

  if (!found) {
    found = MOUNTAINS_24[1]; // default Tý
  }

  // Calculate deviation from mountain center
  let diff = Math.abs(normDeg - found.centerDeg);
  if (diff > 180) {
    diff = 360 - diff;
  }

  const deviation = Number(diff.toFixed(2));
  // A mountain is 15° wide (+/- 7.5° from center).
  // Central 9° (-4.5° to +4.5°) is Chính Hướng (pure).
  // From 4.5° to 7.5° is Kiêm Hướng (borderline/substitute star).
  const isKiemHuong = deviation >= 4.5;

  // Không Vong: within 1.0° of the outer boundary (deviation between 6.5° and 7.5°)
  const isKhongVong = deviation >= 6.75;
  let khongVongType: 'Đại Không Vong' | 'Tiểu Không Vong' | 'Không' = 'Không';

  if (isKhongVong) {
    // Check if adjacent mountain across border belongs to a different Trigram
    // If adjacent across boundary is in different palace -> Đại Không Vong
    // If adjacent is in same palace -> Tiểu Không Vong
    if (found.name === 'Nhâm' || found.name === 'Quý' ||
        found.name === 'Sửu' || found.name === 'Dần' ||
        found.name === 'Giáp' || found.name === 'Ất' ||
        found.name === 'Thìn' || found.name === 'Tỵ' ||
        found.name === 'Bính' || found.name === 'Đinh' ||
        found.name === 'Mùi' || found.name === 'Thân' ||
        found.name === 'Canh' || found.name === 'Tân' ||
        found.name === 'Tuất' || found.name === 'Hợi') {
      khongVongType = 'Đại Không Vong';
    } else {
      khongVongType = 'Tiểu Không Vong';
    }
  }

  return {
    mountain: found,
    deviation,
    isKiemHuong,
    isKhongVong,
    khongVongType,
  };
}

// Get Sitting Degree (Tọa độ) from Facing Degree (Hướng độ)
export function getSittingDegree(facingDeg: number): number {
  return normalizeDegree(facingDeg + 180);
}

// Get the Mountain of a specific palace that has the same Yuan
export function getMountainInPalaceByYuan(palaceNumber: number, yuan: YuanType): Mountain24 | null {
  // If palace is 5 (Center), it doesn't have an original mountain
  if (palaceNumber === 5) return null;
  const mountainsInPalace = MOUNTAINS_24.filter((m) => m.palaceNumber === palaceNumber);
  return mountainsInPalace.find((m) => m.yuan === yuan) || null;
}

// Polarity calculation helper for flying stars
export function getStarPolarity(
  starNumber: number,
  yuan: YuanType,
  currentMountain: Mountain24
): { polarity: PolarityType; basisMountain: string } {
  // If star number is 1..9 (excluding 5)
  if (starNumber !== 5) {
    const mountain = getMountainInPalaceByYuan(starNumber, yuan);
    if (mountain) {
      return {
        polarity: mountain.polarity,
        basisMountain: `${mountain.name} (${mountain.yuan} Nguyên Long, ${mountain.polarity === '+' ? 'Dương' : 'Âm'})`,
      };
    }
  }

  // If star number is 5 (Ngũ Hoàng Trung Cung):
  // According to standard Xuan Kong Flying Star (Thẩm Thị Huyền Không):
  // "Ngũ Hoàng đáo tọa dĩ Tọa sơn định âm dương; Ngũ Hoàng đáo hướng dĩ Hướng sơn định âm dương"
  // The polarity of star 5 is directly determined by the polarity of the current mountain (currentMountain.polarity)!
  const pol = currentMountain.polarity;
  return {
    polarity: pol,
    basisMountain: `Ngũ Hoàng: Lấy tính Âm Dương của sơn ${currentMountain.name} (${currentMountain.yuan} Nguyên Long, ${pol === '+' ? 'Dương (+)' : 'Âm (-)'})`,
  };
}

// Luo Shu flight generator
// Flight path index 0 to 8: [5, 6, 7, 8, 9, 1, 2, 3, 4]
export function flyStars(centerStar: number, polarity: PolarityType): Record<number, number> {
  const result: Record<number, number> = {};

  LUO_SHU_FLIGHT_PATH.forEach((palaceNum, step) => {
    let star: number;
    if (step === 0) {
      star = centerStar;
    } else {
      if (polarity === '+') {
        // Forward flight (Thuận)
        star = ((centerStar - 1 + step) % 9) + 1;
      } else {
        // Reverse flight (Nghịch)
        star = (((centerStar - 1 - step) % 9) + 9) % 9 + 1;
      }
    }
    result[palaceNum] = star;
  });

  return result;
}

// =========================================================================
// BẢNG 24 SƠN KHỞI TINH THẾ QUÁI (THẨM THỊ HUYỀN KHÔNG HỌC)
// Khẩu quyết:
// "Tý Quý Giáp Thân Tham Lang nhất (1),
//  Khôn Nhâm Ất Mão Mùi Cự Môn (2),
//  Cấn Dần Càn Hợi Lộc Tồn vị (3),
//  Thìn Tốn Tỵ Dậu Văn Khúc tầm (4),
//  Bính Tân Đinh Canh Liêm Trinh vị (5),
//  Tuất phương Vũ Khúc lục lâm (6),
//  Ngọ Phá Quân thất (7),
//  Sửu Bát Bạch đồng khởi định (8)"
// =========================================================================
export const THE_QUAI_24_MAP: Record<string, number> = {
  // Cung Khảm (1)
  Nhâm: 2,
  Tý: 1,
  Quý: 1,
  // Cung Cấn (8)
  Sửu: 8,
  Cấn: 3,
  Dần: 3,
  // Cung Chấn (3)
  Giáp: 1,
  Mão: 2,
  Ất: 2,
  // Cung Tốn (4)
  Thìn: 6,
  Tốn: 4,
  Tỵ: 4,
  // Cung Ly (9)
  Bính: 5,
  Ngọ: 7,
  Đinh: 7,
  // Cung Khôn (2)
  Mùi: 2,
  Khôn: 2,
  Thân: 1,
  // Cung Đoài (7)
  Canh: 5,
  Dậu: 4,
  Tân: 4,
  // Cung Càn (6)
  Tuất: 6,
  Càn: 3,
  Hợi: 3,
};

// Hàm tính Sao Thay Thế (Thế Tinh) & Chiều Bay (Âm/Dương) theo Khởi Tinh Quyết
export function getTheQuaiStar(
  baseStar: number, // Số Vận Tinh tại cung đang xét (1..9)
  targetMountain: Mountain24 // Sơn Tọa hoặc Sơn Hướng của ngôi nhà
): {
  star: number;
  polarity: PolarityType;
  subMountainName: string;
  reason: string;
} {
  const yuan = targetMountain.yuan; // Địa, Thiên, hay Nhân Nguyên Long

  // 1. Nếu Vận Tinh là 5 (Ngũ Hoàng Trung Cung):
  // Theo Thẩm Thị: Ngũ Hoàng không có cung gốc riêng, mượn tính Âm Dương của chính sơn đang xét (targetMountain)
  if (baseStar === 5) {
    const subStar = THE_QUAI_24_MAP[targetMountain.name] ?? 5;
    const pol = targetMountain.polarity;
    const flight = pol === '+' ? 'bay Thuận (+)' : 'bay Nghịch (-)';
    return {
      star: subStar,
      polarity: pol,
      subMountainName: `${targetMountain.name} (Ngũ Hoàng mượn sơn bản vị)`,
      reason: `Vận tinh 5 (Ngũ Hoàng) đáo cung: Khởi tinh theo sơn bản vị ${targetMountain.name} (${yuan} Nguyên Long, ${pol === '+' ? 'Dương' : 'Âm'}) -> Thế tinh ${subStar} (${flight}).`,
    };
  }

  // 2. Nếu Vận Tinh là 1..9 (khác 5):
  // Bước a: Tìm sơn trong Cung Lạc Thư của baseStar có CÙNG NGUYÊN LONG với targetMountain
  const subMountain = getMountainInPalaceByYuan(baseStar, yuan);
  if (!subMountain) {
    return {
      star: baseStar,
      polarity: targetMountain.polarity,
      subMountainName: targetMountain.name,
      reason: `Không tìm thấy sơn đối ứng, giữ nguyên sao ${baseStar}.`,
    };
  }

  // Bước b: Tra Bảng Khởi Tinh Thế Quái của subMountain
  const subStar = THE_QUAI_24_MAP[subMountain.name] ?? baseStar;

  // Bước c: Định tính Âm/Dương của Thế Tinh
  let polarity: PolarityType;
  let polDesc = '';

  if (subStar === 5) {
    polarity = subMountain.polarity;
    polDesc = `Sao thế là số 5: Mượn tính Âm Dương của sơn gốc ${subMountain.name} (${polarity === '+' ? 'Dương +' : 'Âm -'})`;
  } else {
    const finalMountain = getMountainInPalaceByYuan(subStar, yuan);
    if (finalMountain) {
      polarity = finalMountain.polarity;
      polDesc = `Sao thế ${subStar} tại cung ${finalMountain.palaceNumber}: Sơn ${finalMountain.name} (${yuan} Nguyên Long, ${polarity === '+' ? 'Dương +' : 'Âm -'})`;
    } else {
      polarity = subMountain.polarity;
      polDesc = `Lấy theo sơn ${subMountain.name} (${polarity === '+' ? 'Dương +' : 'Âm -'})`;
    }
  }

  const flightStr = polarity === '+' ? 'bay Thuận (+)' : 'bay Nghịch (-)';
  const reason = `Vận tinh ${baseStar} gặp ${yuan} Nguyên Long ứng sơn ${subMountain.name} -> Khởi tinh thế thành sao ${subStar} (${polDesc} -> ${flightStr}).`;

  return {
    star: subStar,
    polarity,
    subMountainName: subMountain.name,
    reason,
  };
}

// Main Calculation Function (Hỗ trợ cả Hạ Quái - Chính Hướng & Thế Quái - Kiêm Hướng)
export function calculateXuanKong(
  facingDegree: number,
  period: number = 9,
  chartMode: FlyingStarChartMode = 'auto'
): ChartAnalysis {
  const normFacingDeg = normalizeDegree(facingDegree);
  const facingAnalysis = getMountainFromDegree(normFacingDeg);
  const facingMountain = facingAnalysis.mountain;

  const sittingDeg = getSittingDegree(normFacingDeg);
  const sittingAnalysis = getMountainFromDegree(sittingDeg);
  const sittingMountain = sittingAnalysis.mountain;

  const isKiem = facingAnalysis.isKiemHuong;
  let chartType: 'HA_QUAI' | 'THE_QUAI' = 'HA_QUAI';
  if (chartMode === 'the_quai') {
    chartType = 'THE_QUAI';
  } else if (chartMode === 'auto') {
    chartType = isKiem ? 'THE_QUAI' : 'HA_QUAI';
  } else {
    chartType = 'HA_QUAI';
  }

  // Step 1: Vận Tinh (Period Stars) always fly forward from Center
  const periodStars = flyStars(period, '+');

  // Step 2: Sơn Tinh (Sitting Star) & Step 3: Hướng Tinh (Facing Star)
  const sittingPalaceNum = sittingMountain.palaceNumber;
  const baseMountainStar = periodStars[sittingPalaceNum];

  const facingPalaceNum = facingMountain.palaceNumber;
  const baseFacingStar = periodStars[facingPalaceNum];

  let mountainStarNumber = baseMountainStar;
  let mountainPolarity: PolarityType;
  let theQuaiDetails: TheQuaiDetails | undefined;

  let facingStarNumber = baseFacingStar;
  let facingPolarity: PolarityType;

  if (chartType === 'THE_QUAI') {
    const mThe = getTheQuaiStar(baseMountainStar, sittingMountain);
    mountainStarNumber = mThe.star;
    mountainPolarity = mThe.polarity;

    const fThe = getTheQuaiStar(baseFacingStar, facingMountain);
    facingStarNumber = fThe.star;
    facingPolarity = fThe.polarity;

    theQuaiDetails = {
      mountainStarBase: baseMountainStar,
      mountainStarSubstitute: mThe.star,
      mountainSubstitutedMountain: mThe.subMountainName,
      mountainPolarity: mThe.polarity,
      mountainFlightReason: mThe.reason,

      facingStarBase: baseFacingStar,
      facingStarSubstitute: fThe.star,
      facingSubstitutedMountain: fThe.subMountainName,
      facingPolarity: fThe.polarity,
      facingFlightReason: fThe.reason,
    };
  } else {
    const mountainPolarityInfo = getStarPolarity(baseMountainStar, sittingMountain.yuan, sittingMountain);
    mountainPolarity = mountainPolarityInfo.polarity;

    const facingPolarityInfo = getStarPolarity(baseFacingStar, facingMountain.yuan, facingMountain);
    facingPolarity = facingPolarityInfo.polarity;
  }

  const mountainStars = flyStars(mountainStarNumber, mountainPolarity);
  const facingStars = flyStars(facingStarNumber, facingPolarity);

  // Step 4: Populate all 9 Palaces
  const palaces: Record<number, PalaceData> = {};

  for (let pNum = 1; pNum <= 9; pNum++) {
    const meta = PALACE_METAS[pNum];
    const mStar = mountainStars[pNum];
    const fStar = facingStars[pNum];
    const pStar = periodStars[pNum];

    const isSitting = pNum === sittingPalaceNum;
    const isFacing = pNum === facingPalaceNum;
    const isCenter = pNum === 5;

    const comboMeaning = getCombinationAnalysis(mStar, fStar, pStar, period);

    palaces[pNum] = {
      palaceNumber: pNum,
      name: meta.name,
      shortName: meta.shortName,
      directionCode: meta.directionCode,
      trigram: meta.trigram,
      trigramSymbol: meta.trigramSymbol,
      element: meta.element,
      originalStar: pNum,
      periodStar: pStar,
      mountainStar: mStar,
      mountainPolarity,
      facingStar: fStar,
      facingPolarity,
      isSitting,
      isFacing,
      isCenter,
      combinationKey: `${mStar}-${fStar}`,
      auspiciousness: comboMeaning.auspiciousness,
      summary: comboMeaning.title,
    };
  }

  // Step 5: Classify Chart Formation (Tứ đại cách cục)
  let formation: ChartFormation;

  const sittingPalaceData = palaces[sittingPalaceNum];
  const facingPalaceData = palaces[facingPalaceNum];

  const isSittingStarAtSitting = sittingPalaceData.mountainStar === period;
  const isFacingStarAtFacing = facingPalaceData.facingStar === period;
  const isFacingStarAtSitting = sittingPalaceData.facingStar === period;
  const isSittingStarAtFacing = facingPalaceData.mountainStar === period;

  if (isSittingStarAtSitting && isFacingStarAtFacing) {
    formation = {
      type: 'VUONG_SON_VUONG_HUONG',
      title: 'Vượng Sơn Vượng Hướng (Đáo Sơn Đáo Hướng)',
      badgeColor: 'bg-emerald-600 text-white',
      rating: 'Thượng Cát (Đinh Tài Lưỡng Đắc)',
      description:
        `Sao chủ vận ${period} ngự cả hai vị trí tối thượng: Sơn tinh ${period} đáo tọa (tọa nhà) và Hướng tinh ${period} đáo hướng (trước mặt). Đây là cách cục đắc địa nhất trong Huyền Không Phi Tinh, chủ về nhân đinh thịnh vượng, gia quyến khỏe mạnh hòa hợp đồng thời tài lộc phát đạt, sự nghiệp hanh thông.`,
      recommendations: [
        'Phía sau nhà cần tọa thực (núi đồi cao ráo, nhà lầu vững chãi, tường rào che chắn) để trợ vượng nhân đinh.',
        'Phía trước nhà cần hướng không (minh đường rộng mở, hồ nước, ngã ba ngã tư thoáng đãng) để nạp vượng tài khí.',
        'Mở cửa chính tại hướng nhà sẽ đón trọn dòng tài lộc dồi dào của Vận.',
      ],
    };
  } else if (isSittingStarAtFacing && isFacingStarAtFacing) {
    formation = {
      type: 'SONG_TINH_DAO_HUONG',
      title: 'Song Tinh Đáo Hướng',
      badgeColor: 'bg-blue-600 text-white',
      rating: 'Vượng Tài Thoái Đinh',
      description:
        `Cả hai sao đương vận ${period} (cả Sơn tinh lẫn Hướng tinh) đều tụ hội tại cung Hướng phía trước nhà. Cách cục này phát tài cực nhanh, kinh doanh buôn bán đại lợi, nhưng nhân đinh (sức khỏe, con cái) cần được gia cố vì thiếu thế tựa sơn phía sau.`,
      recommendations: [
        'Địa hình lý tưởng nhất: Trước mặt có Thủy tụ (ao hồ, ngã ba ngã tư tụ khí), xa hơn phía sau mặt nước lại có Sơn hoặc tòa nhà cao (Thủy hậu hữu Sơn).',
        'Có thể bố trí hòn non bộ hoặc tiểu cảnh đá phía sau bể cá ngoài sân trước để lưỡng toàn kỳ mỹ.',
        'Mở cửa lớn, sảnh đón tiếp khách tại hướng nhà để thúc đẩy kinh doanh tối đa.',
      ],
    };
  } else if (isSittingStarAtSitting && isFacingStarAtSitting) {
    formation = {
      type: 'SONG_TINH_DAO_TOA',
      title: 'Song Tinh Đáo Tọa',
      badgeColor: 'bg-indigo-600 text-white',
      rating: 'Vượng Đinh Thoái Tài',
      description:
        `Cả hai sao đương vận ${period} (cả Sơn tinh và Hướng tinh) cùng kéo về ngự tại cung Tọa phía sau nhà. Cách cục này gia đạo rất êm ấm, sức khỏe dồi dào, sinh quý tử thông minh, quý nhân trợ lực, nhưng việc kiếm tiền cần thận trọng, tránh đầu tư mạo hiểm vì tài tinh bị giam phía sau.`,
      recommendations: [
        'Địa hình phía sau nhà lý tưởng nhất: Có đồi gò vững chãi, bên cạnh hoặc sau đồi có suối nước an tĩnh hoặc hồ nhỏ.',
        'Phòng ngủ gia chủ hoặc phòng thờ đặt tại tọa sơn rất tốt, con cái phát triển toàn diện.',
        'Kích hoạt tài vận bằng cách đặt tiểu cảnh nước phong thủy hoặc quả cầu pha lê phong thủy tại cung Tọa nhưng giữ thật thanh tịnh.',
      ],
    };
  } else if (isSittingStarAtFacing && isFacingStarAtSitting) {
    formation = {
      type: 'THUONG_SON_HA_THUY',
      title: 'Thượng Sơn Hạ Thủy',
      badgeColor: 'bg-amber-600 text-white',
      rating: 'Tổn Đinh Phá Tài (Cần Nghịch Bố Trí)',
      description:
        `Sơn tinh ${period} (cần ở núi) lại rơi xuống nước ở Hướng; Hướng tinh ${period} (cần ở nước) lại bị leo lên núi ở Tọa. Đây là thế cờ nghịch cục truyền thống, nếu xây dựng theo lối thông thường (trước thấp sau cao) thì dễ hao tài tốn của và tổn hại sức khỏe.`,
      recommendations: [
        'Địa hình thích hợp nhất để hóa giải: Nhà "nghịch thế" — Phía trước mặt là núi đồi cao, phía sau nhà lại có sông hồ nước trũng (Tọa không Hướng thực).',
        'Nếu ở đô thị phẳng: Đặt vật phẩm phong thủy hành Sơn (thạch anh, đá núi cảnh) ở cung Hướng; đặt phong thủy luân hoặc bể cá cảnh ở cung Tọa để cải biến.',
        'Giữ cho tâm nhà và các cửa thông thoáng, cân bằng ngũ hành bằng cây xanh và ánh sáng.',
      ],
    };
  } else {
    formation = {
      type: 'BINH_THUONG',
      title: 'Cách Cục Phối Hợp Đa Cung',
      badgeColor: 'bg-slate-600 text-white',
      rating: 'Trung Hòa Cát Hung',
      description:
        `Tinh bàn có sự phân bổ sao phân tán, các sao vượng khí phân bổ ở các cung vị khác nhau. Cần chú trọng kích hoạt từng cung vị cụ thể dựa vào cặp sao Sơn - Hướng của từng phương vị.`,
      recommendations: [
        'Tìm cung có Hướng tinh 9 hoặc 1 để mở cửa sổ, ban công hoặc đặt bể nước kích hoạt tài lộc.',
        'Tìm cung có Sơn tinh 9 hoặc 8 để bố trí giường ngủ, phòng làm việc nhằm gia tăng sức khỏe và nhân đinh.',
        'Cung có tổ hợp 2-5, 5-2 hoặc 7-9 tuyệt đối tránh khuấy động hay đặt bếp lửa.',
      ],
    };
  }

  // Nếu là Thế Quái: Đánh dấu tiêu đề cách cục rõ ràng
  if (chartType === 'THE_QUAI') {
    formation = {
      ...formation,
      title: `${formation.title} (Thế Quái)`,
      description: `[Tinh Bàn Thế Quái - Kiêm Hướng]: Hướng nhà lệch ${facingAnalysis.deviation}° so với chính tâm sơn (Kiêm hướng). Hệ thống áp dụng Khởi Tinh Quyết thay thế sao Sơn - Hướng theo Tam Nguyên Long để định cát hung. ${formation.description}`,
    };
  }

  const thanhMon = calculateThanhMon(facingMountain, period);

  return {
    facingDegree: normFacingDeg,
    period,
    sittingDegree: sittingDeg,
    facingMountain,
    sittingMountain,
    isKiemHuong: facingAnalysis.isKiemHuong,
    deviationFromCenter: facingAnalysis.deviation,
    isKhongVong: facingAnalysis.isKhongVong,
    khongVongType: facingAnalysis.khongVongType,
    chartType,
    chartMode,
    theQuaiDetails,
    formation,
    palaces,
    thanhMon,
  };
}

// =========================================================================
// THÀNH MÔN QUYẾT (HUYỀN KHÔNG PHI TINH)
// Xác định Chính Thành Môn & Phụ (Bàng) Thành Môn chuẩn Hà Đồ - Lạc Thư
// =========================================================================
export function calculateThanhMon(facingMountain: Mountain24, period: number = 9): ThanhMonAnalysis {
  const facingPalace = facingMountain.palaceNumber;
  const yuan = facingMountain.yuan; // 'Địa' | 'Thiên' | 'Nhân'

  // Quy tắc Hà Đồ Lạc Thư phân định Chính Thành Môn & Phụ Thành Môn kẹp 2 bên Hướng Cung:
  // 1-6 Thủy (Khảm - Càn), 2-7 Hỏa (Khôn - Đoài), 3-8 Mộc (Chấn - Cấn), 4-9 Kim (Tốn - Ly)
  const chinhThanhMonMap: Record<number, { chinh: number; phu: number }> = {
    1: { chinh: 6, phu: 8 }, // Hướng Khảm (1): Chính = Càn (6), Phụ = Cấn (8)
    8: { chinh: 3, phu: 1 }, // Hướng Cấn (8): Chính = Chấn (3), Phụ = Khảm (1)
    3: { chinh: 8, phu: 4 }, // Hướng Chấn (3): Chính = Cấn (8), Phụ = Tốn (4)
    4: { chinh: 9, phu: 3 }, // Hướng Tốn (4): Chính = Ly (9), Phụ = Chấn (3)
    9: { chinh: 4, phu: 2 }, // Hướng Ly (9): Chính = Tốn (4), Phụ = Khôn (2)
    2: { chinh: 7, phu: 9 }, // Hướng Khôn (2): Chính = Đoài (7), Phụ = Ly (9)
    7: { chinh: 2, phu: 6 }, // Hướng Đoài (7): Chính = Khôn (2), Phụ = Càn (6)
    6: { chinh: 1, phu: 7 }, // Hướng Càn (6): Chính = Khảm (1), Phụ = Đoài (7)
  };

  const gateConfig = chinhThanhMonMap[facingPalace] || { chinh: 4, phu: 2 };

  const buildGate = (palaceNum: number, isChinh: boolean): ThanhMonGate => {
    const palaceMeta = PALACE_METAS[palaceNum];
    // Sơn trong cung thành môn chia sẻ cùng Nguyên Long với hướng nhà
    const gateMountain =
      MOUNTAINS_24.find((m) => m.palaceNumber === palaceNum && m.yuan === yuan) ||
      MOUNTAINS_24.find((m) => m.palaceNumber === palaceNum)!;

    // Vận tinh bay vào cung này trong Tinh bàn Vận:
    const centerIndex = LUO_SHU_FLIGHT_PATH.indexOf(5);
    const palaceIndex = LUO_SHU_FLIGHT_PATH.indexOf(palaceNum);
    const steps = (palaceIndex - centerIndex + 9) % 9;
    let periodStar = (period + steps) % 9;
    if (periodStar === 0) periodStar = 9;

    // Bản cung gốc của sao periodStar:
    // Nếu là sao 5 (Ngũ Hoàng): Lấy theo cung của Vận hiện tại (Vận 9 -> Cung Ly 9, Vận 8 -> Cung Cấn 8)
    let homePalaceOfStar = periodStar === 5 ? (period === 9 ? 9 : 8) : periodStar;

    // Sơn tương ứng cùng Nguyên Long trong bản cung gốc của periodStar:
    const origMountain =
      MOUNTAINS_24.find((m) => m.palaceNumber === homePalaceOfStar && m.yuan === yuan) || null;

    // Xét Âm (-) hay Dương (+):
    // Âm (-) -> Phi tinh bay NGHỊCH -> Sao đương vận 9 đáo tụ tại Thành Môn -> ĐẮC THÀNH MÔN (Đại Cát Vượng Tài)!
    // Dương (+) -> Phi tinh bay THUẬN -> Sao đương vận 9 không tới -> BẤT KHẢ DỤNG (Hư Thành Môn)!
    const polarity: PolarityType = origMountain ? origMountain.polarity : '+';
    const flightType: 'Thuận' | 'Nghịch' = polarity === '-' ? 'Nghịch' : 'Thuận';
    const isUsable = flightType === 'Nghịch';

    const gateTypeName = isChinh ? 'Chính Thành Môn' : 'Phụ (Bàng) Thành Môn';
    const rating = isUsable
      ? `Đắc ${gateTypeName} (Đại Cát · Vượng Tài Tụ Khí)`
      : `Hư ${gateTypeName} (Bất Khả Dụng · Thoái Khí)`;

    const description = isUsable
      ? `Vận tinh số ${periodStar} tại ${palaceMeta.name} ứng với sơn ${origMountain?.name || 'cung gốc'} mang âm tính (-), phi tinh bay NGHỊCH. Đắc sao Đương Vận ${period} đáo khẩu, đây là phương vị Chân Thành Môn đại vượng tài lộc. Thích hợp mở cổng ngõ, cửa phụ, ngã ba hoặc đặt phong thủy luân / hồ nước kích hoạt tài lộc.`
      : `Vận tinh số ${periodStar} tại ${palaceMeta.name} ứng với sơn ${origMountain?.name || 'cung gốc'} mang dương tính (+), phi tinh bay THUẬN. Sao đương vận ${period} không tới cung này, là Hư Thành Môn (không đắc khí). Tránh mở cửa lớn hay đào hồ nước lớn tại đây.`;

    return {
      palaceNum,
      palaceName: palaceMeta.name,
      mountain: gateMountain,
      isChinhThanhMon: isChinh,
      periodStar,
      originalMountainOfPeriodStar: origMountain,
      polarity,
      flightType,
      isUsable,
      rating,
      description,
    };
  };

  const chinhGate = buildGate(gateConfig.chinh, true);
  const phuGate = buildGate(gateConfig.phu, false);

  const usableGates = [chinhGate, phuGate].filter((g) => g.isUsable);

  let summary = '';
  if (usableGates.length === 2) {
    summary = `Nhà hướng ${facingMountain.name} đắc cả 2 cửa Chính & Phụ Thành Môn (Song Thành Môn Đắc Dụng). Phương vị sơn ${usableGates.map((g) => g.mountain.name).join(' và ')} là đại thủy khẩu vượng tài bậc nhất!`;
  } else if (usableGates.length === 1) {
    summary = `Nhà hướng ${facingMountain.name} đắc ${usableGates[0].isChinhThanhMon ? 'Chính' : 'Phụ'} Thành Môn tại phương vị ${usableGates[0].palaceName} (Sơn ${usableGates[0].mountain.name} ${usableGates[0].mountain.centerDeg}°). Mở cửa phụ, cổng hoặc tụ thủy tại đây sẽ nghênh tài nạp phúc.`;
  } else {
    summary = `Nhà hướng ${facingMountain.name} trong Vận ${period} cả 2 cửa Thành Môn (${chinhGate.mountain.name} và ${phuGate.mountain.name}) phi tinh đều bay Thuận nên Bất Khả Dụng (Hư Thành Môn). Cần tập trung nạp vượng khí tại chính diện Hướng cung.`;
  }

  const recommendations = [
    `Hướng nhà: Sơn ${facingMountain.name} (${facingMountain.centerDeg}°), thuộc ${yuan} Nguyên Long.`,
    `Chính Thành Môn: Phương vị ${chinhGate.palaceName} (Sơn ${chinhGate.mountain.name} ${chinhGate.mountain.centerDeg}°) — ${chinhGate.rating}.`,
    `Phụ Thành Môn: Phương vị ${phuGate.palaceName} (Sơn ${phuGate.mountain.name} ${phuGate.mountain.centerDeg}°) — ${phuGate.rating}.`,
    usableGates.length > 0
      ? `Lời khuyên ứng dụng: Mở cổng chính/phụ, lối đi, cửa sổ đón gió hoặc đặt tiểu cảnh nước phong thủy tại sơn ${usableGates.map((g) => g.mountain.name).join(', ')} để kích tài vận tối đa.`
      : `Lưu ý: Hai bên kẹp hướng không đắc Thành Môn, không nên mở cửa phụ đón gió hay đặt hồ nước lớn tại các vị trí này để tránh thoái tài.`,
  ];

  return {
    facingMountain,
    period,
    yuan,
    chinhThanhMon: chinhGate,
    phuThanhMon: phuGate,
    usableGates,
    summary,
    recommendations,
  };
}
