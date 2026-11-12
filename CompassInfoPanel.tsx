import React from 'react';
import { CompassType, ChartAnalysis, BatTrachAnalysis, Mountain24 } from '../types/fengshui';
import {
  COMPASS_RULERS_LIST,
  TIEU_SA_ELEMENTS,
  getSaRelation,
  SONG_SON_MAP,
  HOANG_TUYEN_RULES,
  getPhucDucStarForMountain,
  getDaiQuaiByDegree,
  isHaDoPair,
  getXuyenSonByDegree,
  getThauDiaByDegree,
  getPhanKimByDegree,
} from '../utils/luopanRulersData';
import {
  ShieldCheck,
  Mountain,
  Droplets,
  Grid,
  Sparkles,
  Compass,
  Ruler,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sliders,
} from 'lucide-react';

interface CompassInfoPanelProps {
  compassType: CompassType;
  facingDegree: number;
  analysis: ChartAnalysis;
  batTrachAnalysis?: BatTrachAnalysis;
  onOpenLuBanModal: () => void;
  onOpenCompassModal: () => void;
}

export const CompassInfoPanel: React.FC<CompassInfoPanelProps> = ({
  compassType,
  facingDegree,
  analysis,
  batTrachAnalysis,
  onOpenLuBanModal,
  onOpenCompassModal,
}) => {
  const currentRuler = COMPASS_RULERS_LIST.find((r) => r.id === compassType) || COMPASS_RULERS_LIST[0];
  const sittingM = analysis.sittingMountain;
  const facingM = analysis.facingMountain;

  // Tiêu Sa data
  const sittingTieuSaElement = TIEU_SA_ELEMENTS[sittingM.name] || 'Hỏa';

  // Nạp Thủy data
  const facingSongSon = SONG_SON_MAP[facingM.name];
  const hoangTuyen = HOANG_TUYEN_RULES[facingM.name];

  // Đại Quái data
  const currentPeriod = analysis.period || 9;
  const sittingDegree = (facingDegree + 180) % 360;
  const baseSittingDaiQuai = getDaiQuaiByDegree(sittingDegree, null, currentPeriod, 'hkdq');
  const baseFacingDaiQuai = getDaiQuaiByDegree(facingDegree, null, currentPeriod, 'hkdq');
  const sittingDaiQuai = getDaiQuaiByDegree(sittingDegree, baseFacingDaiQuai, currentPeriod, 'hkdq');
  const facingDaiQuai = getDaiQuaiByDegree(facingDegree, baseSittingDaiQuai, currentPeriod, 'hkdq');

  // Check Hợp Thập / Hà Đồ / Đồng Khí trong Huyền Không Đại Quái
  const isHopThapVan = facingDaiQuai.quaiVan + sittingDaiQuai.quaiVan === 10;
  const isHopThapSo = facingDaiQuai.quaiSo + sittingDaiQuai.quaiSo === 10;
  const isHaDoVan = isHaDoPair(facingDaiQuai.quaiVan, sittingDaiQuai.quaiVan);
  const isHaDoSo = isHaDoPair(facingDaiQuai.quaiSo, sittingDaiQuai.quaiSo);
  const isDongVan = facingDaiQuai.quaiVan === sittingDaiQuai.quaiVan;
  const isDongSo = facingDaiQuai.quaiSo === sittingDaiQuai.quaiSo;

  return (
    <div className="bg-stone-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header with Switcher Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow"
            style={{ backgroundColor: currentRuler.accentColor }}
          >
            {compassType === 'battrach' && <ShieldCheck className="w-5 h-5 text-stone-950" />}
            {compassType === 'tieusa' && <Mountain className="w-5 h-5 text-stone-950" />}
            {compassType === 'napthuy' && <Droplets className="w-5 h-5 text-stone-950" />}
            {compassType === 'huyenkhong' && <Grid className="w-5 h-5 text-stone-950" />}
            {compassType === 'daiquai' && <Sparkles className="w-5 h-5 text-stone-950" />}
            {compassType === 'tonghop' && <Compass className="w-5 h-5 text-stone-950" />}
            {compassType === 'loban' && <Ruler className="w-5 h-5 text-stone-950" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Thước: {currentRuler.title}
              </h3>
              {currentRuler.badge && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentRuler.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">{currentRuler.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {compassType === 'loban' ? (
            <button
              onClick={onOpenLuBanModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow"
            >
              <Ruler className="w-4 h-4" />
              <span>Mở Bảng Đo Lỗ Ban</span>
            </button>
          ) : (
            <button
              onClick={onOpenLuBanModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors border border-zinc-700"
            >
              <Ruler className="w-3.5 h-3.5 text-rose-400" />
              <span>Tra Thước Lỗ Ban</span>
            </button>
          )}

          <button
            onClick={onOpenCompassModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
          >
            <Sliders className="w-3.5 h-3.5 text-stone-950" />
            <span>Chọn Thước Khác</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Per Ruler */}
      {compassType === 'tieusa' && (
        <div className="space-y-3 text-xs">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-zinc-400">Bản Tọa: </span>
              <span className="font-bold text-amber-300 text-sm">Sơn {sittingM.name}</span>
              <span className="text-zinc-500 ml-1">({sittingM.centerDeg}°)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Ngũ Hành Sa Tọa: </span>
              <span className="font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/50 border border-rose-800/40">
                Hành {sittingTieuSaElement}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Sa Cát Lành (Nên Có Gò Đồi / Nhà Cao / Cây Lớn)</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                <strong className="text-emerald-300">Sinh Sa & Vượng Sa:</strong> Các phương vị có sa mang hành sinh cho tọa ({sittingTieuSaElement}) hoặc đồng hành với {sittingTieuSaElement}. Giúp nhân đinh vượng phát, quan lộc hanh thông, danh tiếng lẫy lừng.
              </p>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Sa Hung Sát (Kỵ Vật Cao / Tháp Nhọn / Ụ Đất Lớn)</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                <strong className="text-rose-300">Sát Sa & Tiết Sa:</strong> Các phương vị có sa khắc bản tọa hoặc tọa sinh xuất. Dễ sinh bệnh tật, thương tật tay chân, hao tán tiền của, tiểu nhân quấy phá.
              </p>
            </div>
          </div>
        </div>
      )}

      {compassType === 'napthuy' && (
        <div className="space-y-3 text-xs">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-zinc-400">Hướng Nhà: </span>
              <span className="font-bold text-cyan-300 text-sm">Hướng {facingM.name}</span>
              <span className="text-zinc-500 ml-1">({facingDegree}°)</span>
            </div>
            {facingSongSon && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Song Sơn Nạp Thủy: </span>
                <span className="font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40">
                  {facingSongSon.group} ({facingSongSon.cuc} - Hành {facingSongSon.element})
                </span>
              </div>
            )}
          </div>

          {/* Hoàng Tuyền Warning */}
          {hoangTuyen ? (
            <div className="bg-rose-950/30 border border-rose-500/50 p-3 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>CẢNH BÁO BÁT CÁN HOÀNG TUYỀN: "{hoangTuyen.verse}"</span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-[11px] pl-6">
                {hoangTuyen.warning} (Kỵ tuyệt đối đặt cống thoát nước, bể phốt, khai môn hoặc tụ nước tại phương vị {hoangTuyen.hoangTuyenSons.join('/')}).
              </p>
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hướng {facingM.name} không thuộc vị trí chính can Hoàng Tuyền trực xung. Phối hợp Trường Sinh Thủy Pháp để dẫn nước vào cung Sinh/Vượng và tiêu nước ở cung Tuyệt/Mộ.</span>
            </div>
          )}
        </div>
      )}

      {compassType === 'diaban24' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-950/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">Sơn Hướng (Địa Bàn):</span>
              <div className="text-sm font-bold text-blue-400">
                Sơn {facingM.name} ({facingM.hanzi}) · {facingM.centerDeg}°
              </div>
              <div className="mt-1 text-[11px] text-zinc-400">
                Cung {facingM.trigram} · {facingM.yuan} Nguyên ({facingM.polarity}) · Hành {facingM.element}
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">
                Phạm vi: {facingM.startDeg}° - {facingM.endDeg}°
              </div>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">Sơn Tọa (Địa Bàn):</span>
              <div className="text-sm font-bold text-blue-400">
                Sơn {sittingM.name} ({sittingM.hanzi}) · {sittingM.centerDeg}°
              </div>
              <div className="mt-1 text-[11px] text-zinc-400">
                Cung {sittingM.trigram} · {sittingM.yuan} Nguyên ({sittingM.polarity}) · Hành {sittingM.element}
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">
                Phạm vi: {sittingM.startDeg}° - {sittingM.endDeg}°
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-xl text-[11px] text-zinc-300 border ${
            analysis.chartType === 'THE_QUAI' ? 'bg-amber-950/25 border-amber-500/40' : 'bg-blue-950/20 border-blue-500/30'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`font-bold ${analysis.chartType === 'THE_QUAI' ? 'text-amber-300' : 'text-blue-300'}`}>
                {analysis.chartType === 'THE_QUAI' ? '🔄 Tinh Bàn THẾ QUÁI (Đang Áp Dụng)' : '✨ Tinh Bàn HẠ QUÁI (Chính Hướng)'}
              </span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                analysis.chartType === 'THE_QUAI' ? 'bg-amber-500 text-stone-950' : 'bg-blue-600 text-white'
              }`}>
                {analysis.chartType === 'THE_QUAI' ? 'Kiêm Hướng' : 'Chính Hướng'}
              </span>
            </div>
            <p className="text-zinc-300">
              Độ lệch tâm hiện tại: <strong className="font-mono text-amber-300">{analysis.deviationFromCenter.toFixed(1)}°</strong>.
              {analysis.chartType === 'THE_QUAI'
                ? ' Hướng nhà lệch trên 4.5° bị lai tạp khí trường. Hệ thống tự động kích hoạt Khởi Tinh Quyết mượn sao thay thế để hóa giải tạp khí.'
                : ' Nằm trong phạm vi 9° chính tâm thuần khiết, đắc vượng khí sơn hướng theo Tinh bàn Hạ Quái.'}
            </p>

            {analysis.theQuaiDetails && (
              <div className="mt-2 pt-2 border-t border-amber-500/30 space-y-1 font-mono text-[10.5px]">
                <div className="text-amber-300 font-sans font-bold text-[11px]">📜 Khởi Tinh Quyết (Thế Tinh):</div>
                <div>• Sơn Tinh: Vận tinh {analysis.theQuaiDetails.mountainStarBase} ➔ Thế sao <span className="text-rose-400 font-bold font-sans">【{analysis.theQuaiDetails.mountainStarSubstitute}】</span> ({analysis.theQuaiDetails.mountainPolarity === '+' ? 'Bay Thuận +' : 'Bay Nghịch -'})</div>
                <div className="text-zinc-400 font-sans text-[10px] pl-2.5">↳ {analysis.theQuaiDetails.mountainFlightReason}</div>
                <div>• Hướng Tinh: Vận tinh {analysis.theQuaiDetails.facingStarBase} ➔ Thế sao <span className="text-cyan-300 font-bold font-sans">【{analysis.theQuaiDetails.facingStarSubstitute}】</span> ({analysis.theQuaiDetails.facingPolarity === '+' ? 'Bay Thuận +' : 'Bay Nghịch -'})</div>
                <div className="text-zinc-400 font-sans text-[10px] pl-2.5">↳ {analysis.theQuaiDetails.facingFlightReason}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {compassType === 'phucduc24' && (
        <div className="space-y-3 text-xs">
          {(() => {
            const facingStar = getPhucDucStarForMountain(sittingM.trigram, facingM.name);
            const sittingStar = getPhucDucStarForMountain(sittingM.trigram, sittingM.name);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${
                    facingStar.isGood ? 'bg-emerald-950/25 border-emerald-500/40' : 'bg-rose-950/25 border-rose-500/40'
                  }`}>
                    <span className="text-[11px] text-zinc-400 block mb-1">Vị Thần Phúc Đức Hướng Nhà:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${facingStar.isGood ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {facingStar.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        facingStar.isGood ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {facingStar.nature}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                      {facingStar.meaning}
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    sittingStar.isGood ? 'bg-emerald-950/25 border-emerald-500/40' : 'bg-rose-950/25 border-rose-500/40'
                  }`}>
                    <span className="text-[11px] text-zinc-400 block mb-1">Vị Thần Phúc Đức Tọa Nhà:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${sittingStar.isGood ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {sittingStar.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sittingStar.isGood ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {sittingStar.nature}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                      {sittingStar.meaning}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/60 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed">
                  <span className="font-bold text-amber-400 block mb-1">
                    📖 Nguyên Tắc Mở Cửa / Cổng Theo 24 Phúc Đức:
                  </span>
                  <span>
                    Nên chọn các cung cát: <strong className="text-emerald-300">Phúc Đức, Tấn Tài, Quan Tước, Quan Quý, Vượng Trang, Hưng Phước, Vinh Phú, Hoan Hỷ</strong>.
                    Kỵ tuyệt đối các cung hung: <strong className="text-rose-400">Ôn Hoàng, Pháp Trường, Điên Cuồng, Tự Ải, Tuyệt Tự</strong>.
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {compassType === 'xuyenson' && (
        <div className="space-y-3 text-xs">
          {(() => {
            const xsFacing = getXuyenSonByDegree(facingDegree);
            const xsSitting = getXuyenSonByDegree((facingDegree + 180) % 360);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${
                    xsFacing.isGood ? 'bg-indigo-950/25 border-indigo-500/40' : 'bg-rose-950/25 border-rose-500/40'
                  }`}>
                    <span className="text-[11px] text-zinc-400 block mb-1">Xuyên Sơn Hướng ({facingDegree}°):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-indigo-300">
                        {xsFacing.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        xsFacing.isGood ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {xsFacing.type}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-400">
                      Ngũ Hành: Hành {xsFacing.element}
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                      {xsFacing.meaning}
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    xsSitting.isGood ? 'bg-indigo-950/25 border-indigo-500/40' : 'bg-rose-950/25 border-rose-500/40'
                  }`}>
                    <span className="text-[11px] text-zinc-400 block mb-1">Xuyên Sơn Tọa ({((facingDegree + 180) % 360).toFixed(0)}°):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-indigo-300">
                        {xsSitting.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        xsSitting.isGood ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {xsSitting.type}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-400">
                      Ngũ Hành: Hành {xsSitting.element}
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                      {xsSitting.meaning}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/60 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed">
                  <span className="font-bold text-indigo-300 block mb-1">
                    ⛰️ Ý Nghĩa 72 Xuyên Sơn Long (Định Long Khí Nhập Trạch):
                  </span>
                  <span>
                    Xuyên Sơn 72 Long chia 24 sơn mỗi sơn thành 3 phân long (5°/long). Dùng kiểm tra lai long khí mạch nhập huyệt hay vào trục chính ngôi nhà. Cần chọn trục khí <strong className="text-emerald-300">Chu Bảo</strong> hoặc <strong className="text-emerald-300">Chính Khí</strong>, tránh các độ rơi vào <strong className="text-rose-400">Không Vong</strong> và <strong className="text-amber-400">Sai Thố</strong>.
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {compassType === 'thaudia' && (
        <div className="space-y-3 text-xs">
          {(() => {
            const tdFacing = getThauDiaByDegree(facingDegree);
            return (
              <>
                <div className="bg-teal-950/20 border border-teal-500/30 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-0.5">Thấu Địa Long Hướng Nhà ({facingDegree}°):</span>
                      <div className="text-base font-bold text-teal-300">
                        {tdFacing.name}
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                      tdFacing.isGood ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {tdFacing.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-300 leading-relaxed">
                    {tdFacing.meaning}
                  </p>
                </div>

                <div className="p-3 bg-stone-950/60 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed">
                  <span className="font-bold text-teal-300 block mb-1">
                    🌿 60 Thấu Địa Long (Dẫn Khí Móng & Nền Nhà):
                  </span>
                  <span>
                    Thấu Địa 60 Long dùng khi đào móng, đặt đá trấn trạch hoặc căn chỉnh trục móng để dẫn khí mạch âm dương thông suốt. Cần phối hợp với phương vị cửa chính nạp tài.
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {compassType === 'phankim120' && (
        <div className="space-y-3 text-xs">
          {(() => {
            const pkFacing = getPhanKimByDegree(facingDegree);
            const pkSitting = getPhanKimByDegree((facingDegree + 180) % 360);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${
                    pkFacing.isChauBao ? 'bg-amber-950/25 border-amber-500/50 shadow-md shadow-amber-500/10' : 'bg-stone-950/60 border-zinc-800'
                  }`}>
                    <span className="text-[11px] text-zinc-400 block mb-1">Phân Kim Hướng ({facingDegree}°):</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${pkFacing.isChauBao ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {pkFacing.phanKimName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        pkFacing.isChauBao ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {pkFacing.rating}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                      {pkFacing.meaning}
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    pkSitting.isChauBao ? 'bg-amber-950/25 border-amber-500/50 shadow-md shadow-amber-500/10' : 'bg-stone-950/60 border-zinc-800'
                  }`}>
                    <span className="text-[11px] text-zinc-400 block mb-1">Phân Kim Tọa ({((facingDegree + 180) % 360).toFixed(0)}°):</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${pkSitting.isChauBao ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {pkSitting.phanKimName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        pkSitting.isChauBao ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {pkSitting.rating}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                      {pkSitting.meaning}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[11px] text-zinc-300 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-1">
                    👑 Tuyến Châu Bảo Bính - Canh (120 Phân Kim Cốt Lõi):
                  </span>
                  <span>
                    Trong 120 phân kim, cổ nhân chỉ chọn tuyến <strong className="text-amber-300">Bính</strong> và <strong className="text-amber-300">Canh</strong> (Châu Bảo tuyến - chiêu tài tiến bảo, đinh tài lưỡng vượng). Tuyệt đối kỵ tuyến <strong className="text-rose-400">Mậu - Kỷ</strong> vì phạm Cô Hư Không Vong Sát, chủ bại nghiệp.
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {compassType === 'battrach' && (
        <div className="space-y-3 text-xs">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-zinc-400">Trạch Khí Nhà: </span>
              <span className="font-bold text-emerald-400 text-sm">
                {batTrachAnalysis?.houseTrach.name || `${sittingM.trigram} Trạch`}
              </span>
              <span className="text-zinc-500 ml-1">({batTrachAnalysis?.houseTrach.group})</span>
            </div>
            {batTrachAnalysis?.owner && (
              <div>
                <span className="text-zinc-400">Gia Chủ: </span>
                <span className="font-bold text-amber-300">
                  {batTrachAnalysis.owner.canChi} · Cung {batTrachAnalysis.owner.cungPhi}
                </span>
                <span className="text-zinc-500 ml-1">({batTrachAnalysis.owner.nhomMenh})</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-stone-950/40 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed">
            <span className="font-bold text-amber-400 block mb-1">
              ✨ 24 Vị Thần Phúc Đức Khởi An Theo Tọa Trạch:
            </span>
            <span>
              Vòng Phúc Đức giúp định hướng vị trí mở cổng ngõ, cửa chính và bàn thờ. Các cung Đại Cát như <strong className="text-emerald-400">Phúc Đức, Tấn Tài, Quan Quý, Hưng Phước, Vinh Phú</strong> mang lại giàu sang bền vững. Cần tránh mở cửa ở <strong className="text-rose-400">Ôn Hoàng, Pháp Trường, Điên Cuồng, Tuyệt Tự</strong>.
            </span>
          </div>
        </div>
      )}

      {compassType === 'daiquai' && (
        <div className="space-y-3 text-xs">
          {/* Banner Quy Ước Chuẩn Thống Nhất */}
          <div className="px-3.5 py-2 rounded-xl bg-stone-950/90 border border-sky-500/30 text-[11px] text-zinc-300 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="text-sky-400">📌</span>
              <strong className="text-zinc-100">Quy ước chuẩn bộ số HKĐQ:</strong>{' '}
              <span className="font-mono bg-stone-900 px-2 py-0.5 rounded border border-zinc-700">
                <span className="text-sky-400 font-black">[Quái Vận: Xanh Đậm Da Trời]</span> · <span className="text-zinc-200 font-bold">[Quái Khí]</span>
              </span>
            </span>
            <span className="text-[10.5px] text-zinc-400">
              Số đầu (Xanh da trời) = <strong>Quái Vận</strong> (1–9) · Số sau = <strong>Quái Khí</strong> (1–9)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quẻ Hướng */}
            <div className={`p-3 rounded-xl border ${
              facingDaiQuai.isGood ? 'bg-red-950/20 border-red-500/40 shadow-sm shadow-red-500/10' : 'bg-stone-950/60 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] text-zinc-400 font-bold">Quẻ Hướng ({facingDegree}°):</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded truncate ${
                  facingDaiQuai.isGood ? 'bg-red-950 text-rose-300 border border-red-500/50' : 'bg-zinc-800 text-zinc-300 border border-zinc-600'
                }`}>
                  {facingDaiQuai.evaluation?.badgeText || (facingDaiQuai.isGood ? '⭐ Cát (Chữ Đỏ)' : 'Hung (Chữ Đen)')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className={`text-base font-bold ${facingDaiQuai.isGood ? 'text-rose-400' : 'text-zinc-200'}`}>
                  {facingDaiQuai.name} ({facingDaiQuai.hanzi})
                </div>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-stone-900/90 border border-sky-500/30 whitespace-nowrap shadow-sm">
                  Vận·Khí: <strong className="text-sky-400 font-black text-sm">{facingDaiQuai.quaiVan}</strong>·<strong className="text-zinc-200">{facingDaiQuai.quaiSo}</strong>
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-300">
                <span>Quái Vận (số đầu): <strong className="text-sky-400 font-mono font-bold text-xs">{facingDaiQuai.quaiVan}</strong> {facingDaiQuai.quaiVan === currentPeriod ? '(Đương Vận)' : ''}</span>
                <span>·</span>
                <span>Quái Khí (số sau): <strong className="text-zinc-200 font-mono">{facingDaiQuai.quaiSo}</strong></span>
              </div>
              {facingDaiQuai.evaluation?.reasons && facingDaiQuai.evaluation.reasons.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-0.5">
                  {facingDaiQuai.evaluation.reasons.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className={facingDaiQuai.isGood ? 'text-rose-400' : 'text-zinc-500'}>•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quẻ Tọa */}
            <div className={`p-3 rounded-xl border ${
              sittingDaiQuai.isGood ? 'bg-red-950/20 border-red-500/40 shadow-sm shadow-red-500/10' : 'bg-stone-950/60 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] text-zinc-400 font-bold">Quẻ Tọa ({sittingDegree}°):</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded truncate ${
                  sittingDaiQuai.isGood ? 'bg-red-950 text-rose-300 border border-red-500/50' : 'bg-zinc-800 text-zinc-300 border border-zinc-600'
                }`}>
                  {sittingDaiQuai.evaluation?.badgeText || (sittingDaiQuai.isGood ? '⭐ Cát (Chữ Đỏ)' : 'Hung (Chữ Đen)')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className={`text-base font-bold ${sittingDaiQuai.isGood ? 'text-rose-400' : 'text-zinc-200'}`}>
                  {sittingDaiQuai.name} ({sittingDaiQuai.hanzi})
                </div>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-stone-900/90 border border-sky-500/30 whitespace-nowrap shadow-sm">
                  Vận·Khí: <strong className="text-sky-400 font-black text-sm">{sittingDaiQuai.quaiVan}</strong>·<strong className="text-zinc-200">{sittingDaiQuai.quaiSo}</strong>
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-300">
                <span>Quái Vận (số đầu): <strong className="text-sky-400 font-mono font-bold text-xs">{sittingDaiQuai.quaiVan}</strong> {sittingDaiQuai.quaiVan === currentPeriod ? '(Đương Vận)' : ''}</span>
                <span>·</span>
                <span>Quái Khí (số sau): <strong className="text-zinc-200 font-mono">{sittingDaiQuai.quaiSo}</strong></span>
              </div>
              {sittingDaiQuai.evaluation?.reasons && sittingDaiQuai.evaluation.reasons.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-0.5">
                  {sittingDaiQuai.evaluation.reasons.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className={sittingDaiQuai.isGood ? 'text-rose-400' : 'text-zinc-500'}>•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Phối Hợp Cách Cục Tọa - Hướng theo Huyền Không Đại Quái */}
          <div className="p-3 bg-gradient-to-r from-amber-950/25 via-stone-900 to-amber-950/25 border border-amber-500/30 rounded-xl text-[11px] text-zinc-300 space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>⚡</span> Phối Hợp Cách Cục Tọa - Hướng (Huyền Không Đại Quái Vận {currentPeriod}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <div className="p-2 rounded-lg bg-stone-950/60 border border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-300 block text-[10px] uppercase">1. Yếu tố Thời Gian (Tam Cát Vận: {currentPeriod}, {(currentPeriod % 9) + 1}, {((currentPeriod + 1) % 9) + 1})</span>
                {facingDaiQuai.quaiVan === currentPeriod ? (
                  <div className="text-emerald-400 font-semibold">✓ Hướng đắc Chính Khí Đương Vượng Vận {currentPeriod} (Đại Cát)</div>
                ) : facingDaiQuai.quaiVan === (currentPeriod % 9) + 1 ? (
                  <div className="text-emerald-400 font-semibold">✓ Hướng đắc Sinh Khí Vận {currentPeriod} (Quái Vận {(currentPeriod % 9) + 1} - Đại Cát)</div>
                ) : facingDaiQuai.quaiVan === ((currentPeriod + 1) % 9) + 1 ? (
                  <div className="text-cyan-300 font-semibold">✓ Hướng đắc Tiến Khí Vận {currentPeriod} (Quái Vận {((currentPeriod + 1) % 9) + 1} - Cát)</div>
                ) : (
                  <div className="text-zinc-400">Hướng mang Quái Vận <strong className="text-sky-400 font-mono font-bold">{facingDaiQuai.quaiVan}</strong> ({facingDaiQuai.quaiVan === ((currentPeriod - 2 + 9) % 9) + 1 ? 'Thoái khí' : 'Suy/Tử khí'})</div>
                )}
                {sittingDaiQuai.quaiVan === currentPeriod ? (
                  <div className="text-emerald-400 font-semibold">✓ Tọa đắc Chính Khí Đương Vượng Vận {currentPeriod} (Đại Cát)</div>
                ) : sittingDaiQuai.quaiVan === (currentPeriod % 9) + 1 ? (
                  <div className="text-emerald-400 font-semibold">✓ Tọa đắc Sinh Khí Vận {currentPeriod} (Quái Vận {(currentPeriod % 9) + 1} - Đại Cát)</div>
                ) : sittingDaiQuai.quaiVan === ((currentPeriod + 1) % 9) + 1 ? (
                  <div className="text-cyan-300 font-semibold">✓ Tọa đắc Tiến Khí Vận {currentPeriod} (Quái Vận {((currentPeriod + 1) % 9) + 1} - Cát)</div>
                ) : (
                  <div className="text-zinc-400">Tọa mang Quái Vận <strong className="text-sky-400 font-mono font-bold">{sittingDaiQuai.quaiVan}</strong> ({sittingDaiQuai.quaiVan === ((currentPeriod - 2 + 9) % 9) + 1 ? 'Thoái khí' : 'Suy/Tử khí'})</div>
                )}
              </div>

              <div className="p-2 rounded-lg bg-stone-950/60 border border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-300 block text-[10px] uppercase">2. Yếu tố Không Gian (Cách Cục)</span>
                {isHopThapVan && <div className="text-amber-300 font-semibold">✓ Quái Vận HỢP THẬP ({facingDaiQuai.quaiVan} + {sittingDaiQuai.quaiVan} = 10)</div>}
                {isHopThapSo && <div className="text-amber-300 font-semibold">✓ Quái Khí HỢP THẬP ({facingDaiQuai.quaiSo} + {sittingDaiQuai.quaiSo} = 10)</div>}
                {isHaDoVan && <div className="text-cyan-300 font-semibold">✓ Quái Vận HỢP HÀ ĐỒ (Cặp {facingDaiQuai.quaiVan}-{sittingDaiQuai.quaiVan})</div>}
                {isHaDoSo && <div className="text-cyan-300 font-semibold">✓ Quái Khí HỢP HÀ ĐỒ (Cặp {facingDaiQuai.quaiSo}-{sittingDaiQuai.quaiSo})</div>}
                {isDongVan && <div className="text-indigo-300 font-semibold">✓ Đồng Vận Thuần Thanh (Cùng Vận {facingDaiQuai.quaiVan})</div>}
                {isDongSo && <div className="text-indigo-300 font-semibold">✓ Đồng Khí Thuần Thanh (Cùng Khí {facingDaiQuai.quaiSo})</div>}
                {!isHopThapVan && !isHopThapSo && !isHaDoVan && !isHaDoSo && !isDongVan && !isDongSo && (
                  <div className="text-zinc-400">Tọa - Hướng chưa kết thành đại cách cục (có thể phối hợp với vị trí Cửa, Cổng, Bếp hoặc Trạch Nhật).</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {compassType === 'huyenkhong' && (
        <div className="space-y-3.5 text-xs">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-zinc-400">Cục Diện Vận {analysis.period} (2024 - 2043): </span>
              <span className="font-bold text-purple-400 text-sm">{analysis.formation.title}</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 font-bold">
              {analysis.formation.rating}
            </span>
          </div>
          <p className="text-zinc-300 text-[11px] leading-relaxed">
            {analysis.formation.description}
          </p>

          {/* KHỐI CHUYÊN SÂU: ĐỊNH VỊ THÀNH MÔN QUYẾT (VẬN 9) */}
          {analysis.thanhMon && (
            <div className="bg-gradient-to-br from-stone-950 via-purple-950/30 to-stone-950 border border-purple-500/40 rounded-xl p-3 sm:p-4 space-y-3 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚪</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-300 tracking-tight">
                      VỊ TRÍ XÁC ĐỊNH THÀNH MÔN (THÀNH MÔN THỦY PHÁP)
                    </h4>
                    <span className="text-[10px] text-zinc-400">
                      Bí quyết nạp vượng khí tài lộc tối thượng · "Thành Môn nhất quyết vạn kim phú"
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Vận {analysis.period} (2024 - 2043)
                </span>
              </div>

              {/* 2 Cửa Thành Môn: Chính & Phụ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* CHÍNH THÀNH MÔN */}
                <div className={`p-3 rounded-xl border ${
                  analysis.thanhMon.chinhThanhMon.isUsable
                    ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-xs text-zinc-200 flex items-center gap-1">
                      <span>👑</span> CHÍNH THÀNH MÔN
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      analysis.thanhMon.chinhThanhMon.isUsable
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 animate-pulse'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {analysis.thanhMon.chinhThanhMon.isUsable ? 'ĐẮC KHÍ (VƯỢNG TÀI)' : 'BẤT KHẢ DỤNG (HƯ)'}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-zinc-300 font-semibold">
                      Phương vị: <strong className="text-amber-300">Cung {analysis.thanhMon.chinhThanhMon.palaceName}</strong> · Sơn <strong className="text-white text-xs">{analysis.thanhMon.chinhThanhMon.mountain.name} ({analysis.thanhMon.chinhThanhMon.mountain.centerDeg}°)</strong>
                    </div>
                    <div className="text-zinc-400 text-[10px]">
                      Vận tinh: Sao {analysis.thanhMon.chinhThanhMon.periodStar} · Phi tinh: <strong>{analysis.thanhMon.chinhThanhMon.flightType} ({analysis.thanhMon.chinhThanhMon.polarity})</strong>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed pt-1">
                      {analysis.thanhMon.chinhThanhMon.description}
                    </p>
                  </div>
                </div>

                {/* PHỤ (BÀNG) THÀNH MÔN */}
                <div className={`p-3 rounded-xl border ${
                  analysis.thanhMon.phuThanhMon.isUsable
                    ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-xs text-zinc-200 flex items-center gap-1">
                      <span>🛡️</span> PHỤ (BÀNG) THÀNH MÔN
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      analysis.thanhMon.phuThanhMon.isUsable
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 animate-pulse'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {analysis.thanhMon.phuThanhMon.isUsable ? 'ĐẮC KHÍ (VƯỢNG TÀI)' : 'BẤT KHẢ DỤNG (HƯ)'}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-zinc-300 font-semibold">
                      Phương vị: <strong className="text-amber-300">Cung {analysis.thanhMon.phuThanhMon.palaceName}</strong> · Sơn <strong className="text-white text-xs">{analysis.thanhMon.phuThanhMon.mountain.name} ({analysis.thanhMon.phuThanhMon.mountain.centerDeg}°)</strong>
                    </div>
                    <div className="text-zinc-400 text-[10px]">
                      Vận tinh: Sao {analysis.thanhMon.phuThanhMon.periodStar} · Phi tinh: <strong>{analysis.thanhMon.phuThanhMon.flightType} ({analysis.thanhMon.phuThanhMon.polarity})</strong>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed pt-1">
                      {analysis.thanhMon.phuThanhMon.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lời khuyên thực chiến ứng dụng Thành Môn */}
              <div className="p-2.5 rounded-lg bg-stone-900/90 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
                <span className="font-bold text-amber-300 block">💡 Hướng Dẫn Ứng Dụng Thực Chiến:</span>
                <p className="leading-relaxed">
                  {analysis.thanhMon.summary}
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-zinc-400 text-[10px] pt-1">
                  {analysis.thanhMon.recommendations.map((rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {compassType === 'tonghop' && (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-300 text-[11px] leading-relaxed">
            Đang kích hoạt chế độ <strong className="text-amber-400">La Kinh Tổng Hợp Đa Tầng</strong>: Tích hợp đồng thời 24 Sơn Chính Châm, Nhân Bàn Trung Châm (Tiêu Sa), Thiên Bàn Phùng Châm (Nạp Thủy), Bát Trạch 8 Cung và 64 Quẻ Đại Quái. Bạn có thể phóng to, xoay và căn chỉnh trên bản vẽ nhà.
          </p>
        </div>
      )}

      {compassType === 'loban' && (
        <div className="space-y-2 text-xs">
          <p className="text-zinc-300 text-[11px] leading-relaxed">
            Thước Lỗ Ban chuẩn mm bao gồm 3 cây thước: <strong className="text-emerald-400">522mm (Thông Thủy cửa đi, cửa sổ)</strong>, <strong className="text-cyan-400">429mm (Dương Trạch nội thất, giường tủ, bậc thang)</strong> và <strong className="text-amber-400">388mm (Âm Phần bàn thờ gia tiên)</strong>. Nhấp nút "Mở Bảng Đo Lỗ Ban" ở trên để nhập số đo milimet (mm) và kiểm tra cung cát hung chuẩn xác.
          </p>
        </div>
      )}

      {/* Designer Credit Bar */}
      <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-500">
        <span>Hệ thống La Kinh 24 Sơn Hướng & Huyền Không Phi Tinh Toàn Năng</span>
        <span className="font-semibold text-amber-400/90">
          Chủ nhiệm đồ án & Thiết kế: Nguyễn Viết Đạt
        </span>
      </div>
    </div>
  );
};
