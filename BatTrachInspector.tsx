import React from 'react';
import { BatTrachAnalysis, OwnerProfile } from '../types/fengshui';
import {
  Compass,
  User,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Home,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

interface BatTrachInspectorProps {
  analysis: BatTrachAnalysis;
  ownerProfile: OwnerProfile;
  onChangeBirthYear: (year: number) => void;
  onChangeGender: (gender: 'nam' | 'nu') => void;
}

export const BatTrachInspector: React.FC<BatTrachInspectorProps> = ({
  analysis,
  ownerProfile,
  onChangeBirthYear,
  onChangeGender,
}) => {
  // Years from 1940 to 2025
  const birthYears = Array.from({ length: 86 }, (_, i) => 2025 - i);

  // Group palaces into Auspicious and Inauspicious based on Owner (or House)
  const palacesList = [1, 2, 3, 4, 6, 7, 8, 9].map((pNum) => analysis.palaces[pNum]);
  const goodPalaces = palacesList.filter((p) => (p.ownerStar ? p.ownerStar.isGood : p.houseStar.isGood));
  const badPalaces = palacesList.filter((p) => (p.ownerStar ? !p.ownerStar.isGood : !p.houseStar.isGood));

  return (
    <div className="w-full bg-stone-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-6">
      {/* Header & Owner Profile Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              八
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Bát Trạch Phong Thủy (Trạch Mệnh & Cung Phi)
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Phối hợp Trạch Nhà ({analysis.houseTrach.name} - {analysis.houseTrach.group}) với Cung Phi Bản Mệnh gia chủ
          </p>
        </div>

        {/* Owner Inputs: Year & Gender */}
        <div className="flex items-center gap-2">
          {/* Year selector */}
          <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-zinc-700">
            <span className="text-xs text-zinc-400 font-medium">Năm sinh:</span>
            <select
              value={ownerProfile.birthYear}
              onChange={(e) => onChangeBirthYear(parseInt(e.target.value))}
              className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
            >
              {birthYears.map((y) => (
                <option key={y} value={y} className="bg-stone-900 text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Gender toggle */}
          <div className="flex items-center bg-zinc-800/90 p-1 rounded-xl border border-zinc-700 text-xs">
            <button
              onClick={() => onChangeGender('nam')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                ownerProfile.gender === 'nam'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nam
            </button>
            <button
              onClick={() => onChangeGender('nu')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                ownerProfile.gender === 'nu'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nữ
            </button>
          </div>
        </div>
      </div>

      {/* Owner & House Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Owner Card */}
        <div className="bg-stone-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Mệnh Quái Gia Chủ
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {ownerProfile.nhomMenh}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-white">
              Cung {ownerProfile.cungPhi}{' '}
              <span className="text-amber-400 font-bold text-sm">
                ({ownerProfile.cungPhiNguHanh || '+ Thổ'})
              </span>
            </span>
            <span className="text-xs font-semibold text-zinc-400">
              · Tuổi {ownerProfile.canChi} ({ownerProfile.birthYear})
            </span>
          </div>

          <p className="text-xs text-zinc-300">
            Ngũ hành Nạp Âm: <span className="font-semibold text-amber-300">{ownerProfile.menhNguHanh}</span>
          </p>
        </div>

        {/* Compatibility Card */}
        {analysis.compatibility && (
          <div
            className={`border rounded-xl p-4 flex flex-col gap-2.5 ${
              analysis.compatibility.isCompatible
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                {analysis.compatibility.isCompatible ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                )}
                Độ Tương Hợp Hướng Nhà
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  analysis.compatibility.isCompatible
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {analysis.compatibility.rating}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-zinc-300">
              {analysis.compatibility.description}
            </p>
          </div>
        )}
      </div>

      {/* 8 Directions Du Niên Table */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          Phân bổ 8 Cung Du Niên Bát Trạch (Theo Cung {ownerProfile.cungPhi} của Gia Chủ)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 4 Cát Tinh */}
          <div className="bg-stone-950/70 border border-emerald-900/40 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 pb-2 border-b border-zinc-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>4 Cung Cát Lợi (Nên đặt Cửa chính, Phòng ngủ, Ban thờ)</span>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {goodPalaces.map((p) => {
                const star = p.ownerStar || p.houseStar;
                return (
                  <div
                    key={p.palaceNumber}
                    className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg border border-zinc-800"
                  >
                    <div>
                      <span className="font-bold text-white mr-2">{p.directionName}</span>
                      <span className="text-[11px] text-zinc-400">({p.trigram})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${star.badgeClass}`}>
                        {star.name}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                        {star.alias}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Hung Tinh */}
          <div className="bg-stone-950/70 border border-rose-900/40 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 pb-2 border-b border-zinc-800">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>4 Cung Hung Hiểm (Nên đặt Bếp, Nhà vệ sinh để trấn sát)</span>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {badPalaces.map((p) => {
                const star = p.ownerStar || p.houseStar;
                return (
                  <div
                    key={p.palaceNumber}
                    className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg border border-zinc-800"
                  >
                    <div>
                      <span className="font-bold text-white mr-2">{p.directionName}</span>
                      <span className="text-[11px] text-zinc-400">({p.trigram})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${star.badgeClass}`}>
                        {star.name}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                        {star.alias}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Practical Room Layout Principles */}
      <div className="bg-stone-950/90 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 text-xs">
        <h4 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          Nguyên Tắc Bố Trí Không Gian Chuẩn Bát Trạch
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-zinc-300">
          <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800">
            <div className="font-bold text-white mb-1 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              Cửa Chính & Phòng Ngủ
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Mở cửa và kê đầu giường tại các cung cát: <strong className="text-emerald-300">Sinh Khí, Diên Niên, Thiên Y</strong> để nạp trường khí hưng vượng.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800">
            <div className="font-bold text-white mb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              Phòng Thờ & Bàn Làm Việc
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Tọa cát hướng cát, ưu tiên cung <strong className="text-blue-300">Phục Vị, Sinh Khí</strong> để tâm trí hanh thông, công danh hiển đạt.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800">
            <div className="font-bold text-white mb-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Phòng Bếp (Tọa Hung Hướng Cát)
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Đặt bếp tại cung <strong className="text-rose-400">Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại</strong> để thiêu rụi hung sát; núm vặn/mặt bếp nhìn về cung cát.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800">
            <div className="font-bold text-white mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Khu Vệ Sinh & Hố Ga
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Bắt buộc đặt tại các cung hung hại <strong className="text-rose-400">Tuyệt Mệnh, Ngũ Quỷ</strong> để dòng nước xả cuốn trôi toàn bộ xui xẻo, tà khí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
