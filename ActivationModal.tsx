import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  BookOpen,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Key,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Mail,
  Phone,
  MessageCircle,
  LogOut,
} from 'lucide-react';

interface ActivationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isActivated: boolean;
  onActivate: (key: string) => boolean;
  onDeactivate?: () => void;
  authorEmail?: string;
  authorPhone?: string;
}

// Danh sách các mã kích hoạt hợp lệ (Mã chính: namodiatangvuong)
export const VALID_ACTIVATION_KEYS = [
  'NAMODIATANGVUONG',
  'NAMMODIATANGVUONG',
  'NAMODIATANGVUONGBOTAT',
  'NAMMODIATANGVUONGBOTAT',
  'DIATANG',
  'KINHDIATANG',
  'DIATANGKINH',
  'NGUYENVIETDAT',
  'VIETDAT',
  'DAT1974',
  'CAIVAN',
  'PHATPHAP',
  'TAMDUC',
  'HOANGPHAP',
  'PHONGTHUY888',
  'VIETDAT999',
];

export const checkActivationKey = (inputKey: string): boolean => {
  if (!inputKey) return false;
  // Chuẩn hóa: bỏ dấu, khoảng trắng, chuyển hoa
  const clean = inputKey
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '')
    .toUpperCase();
  return VALID_ACTIVATION_KEYS.includes(clean);
};

export const ActivationModal: React.FC<ActivationModalProps> = ({
  isOpen,
  onClose,
  isActivated,
  onActivate,
  onDeactivate,
  authorEmail = 'dat.nguyen.ckxd@gmail.com',
  authorPhone = '0969719828',
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showPledge, setShowPledge] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!inputCode.trim()) {
      setErrorMsg('Vui lòng nhập mã kích hoạt để tiếp tục sử dụng phần mềm.');
      return;
    }

    const isValid = onActivate(inputCode);
    if (isValid) {
      setSuccessMsg('Kích hoạt thành công! Chúc bạn và gia đạo vạn sự cát tường, phúc lộc an khang.');
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);
    } else {
      setErrorMsg('Mã kích hoạt chưa chính xác. Vui lòng liên hệ tác giả Nguyễn Viết Đạt qua Hotline/Zalo bên dưới để nhận mã.');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(authorEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(authorPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-950 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/30 overflow-hidden my-auto">
        {/* Header viền vàng hoàng kim */}
        <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 p-5 border-b border-amber-500/30 text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 mb-2 shadow-inner">
            {isActivated ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-300 tracking-wide uppercase">
            {isActivated ? 'Bản Quyền Đã Được Kích Hoạt' : 'Xác Thực Quyền Sử Dụng Phần Mềm'}
          </h2>
          <p className="text-xs text-zinc-300 mt-1">
            Phần mềm La Kinh & Phong Thủy Chuyên Sâu · <strong className="text-amber-400">Tác giả: Nguyễn Viết Đạt</strong>
          </p>
          <div className="mt-1.5 inline-block text-[10.5px] px-2.5 py-0.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-300/90 font-medium">
            🔒 Yêu cầu nhập lại mã kích hoạt mỗi khi mở lại ứng dụng
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Tâm thư của tác giả */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-zinc-300 space-y-3 leading-relaxed shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-amber-500/20 pb-2">
              <HeartHandshake className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Tâm Nguyện Phi Lợi Nhuận & Lời Ngỏ Từ Tác Giả</span>
            </div>

            <p>
              <strong className="text-amber-200">Kính gửi quý đồng đạo và quý gia chủ hữu duyên!</strong>
            </p>
            <p>
              Phần mềm này được tôi — <strong className="text-white font-semibold">Nguyễn Viết Đạt</strong> — dày công nghiên cứu, biên soạn và lập trình với tâm nguyện duy nhất: <strong>Hỗ trợ mọi người trong việc xem phong thủy, quy hoạch nhà cửa và cải tạo vận mệnh gia đạo bình an</strong>, thuận theo quy luật dịch lý và đất trời.
            </p>
            <p className="p-3 rounded-lg bg-stone-900/90 border border-zinc-800 text-amber-200/95 italic leading-relaxed">
              « Phần mềm được phụng sự hoàn toàn <strong>PHI LỢI NHUẬN, không vì mục đích kiếm trác hay thương mại hóa</strong>. Tuy nhiên, cổ nhân dạy rằng phong thủy phải gắn liền với đạo đức và phúc đức. Để tôn trọng công sức lao động trí tuệ của tác giả và tạo nhân duyên phước báu lành, tôi kính mong quý vị hãy phát tâm <strong>trì tụng một bộ Kinh Địa Tạng Bồ Tát Bổn Nguyện</strong> (hoặc chí tâm niệm 108 biến danh hiệu <em>Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát</em>) hồi hướng cho cửu huyền thất tổ để được cấp mã mở khóa sử dụng. »
            </p>
          </div>

          {/* Form nhập mã khi chưa kích hoạt */}
          {!isActivated ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nhập Mã Kích Hoạt Bản Quyền:</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Nhập mã kích hoạt bản quyền..."
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-zinc-700 text-amber-300 font-mono font-bold text-sm tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-inner"
                  />
                  {inputCode && (
                    <button
                      type="button"
                      onClick={() => setInputCode('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 italic">
                  * Vui lòng liên hệ tác giả Nguyễn Viết Đạt để nhận mã kích hoạt sau khi đã phát tâm trì tụng Kinh Địa Tạng.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-[0.99] text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Xác Nhận & Mở Khóa Phần Mềm</span>
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-300">
                Phần mềm đang hoạt động ở trạng thái ĐÃ KÍCH HOẠT
              </h3>
              <p className="text-xs text-zinc-300">
                Bạn đang sử dụng phiên bản có bản quyền tác giả <strong>Nguyễn Viết Đạt</strong>. Khi đóng tab hoặc thoát ứng dụng, hệ thống sẽ tự động khóa lại để đảm bảo quy tắc bản quyền.
              </p>
              
              <div className="flex items-center justify-center gap-3 pt-2">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Đóng Bảng Thông Tin
                  </button>
                )}
                {onDeactivate && (
                  <button
                    type="button"
                    onClick={onDeactivate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                    title="Khóa lại phần mềm ngay bây giờ để thử nghiệm nhập lại mã"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Khóa Phần Mềm / Thoát Phiên</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Hướng dẫn phát nguyện Kinh Địa Tạng */}
          <div className="border-t border-zinc-800 pt-4 space-y-3">
            <button
              type="button"
              onClick={() => setShowPledge(!showPledge)}
              className="w-full flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 font-semibold p-2.5 rounded-lg bg-stone-900/60 border border-zinc-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Hướng dẫn phát nguyện & Ý nghĩa Kinh Địa Tạng Bồ Tát</span>
              </span>
              <span className="text-zinc-500">{showPledge ? '▲ Thu gọn' : '▼ Xem chi tiết'}</span>
            </button>

            {showPledge && (
              <div className="p-3.5 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-zinc-300 space-y-2.5 animate-in fade-in">
                <p>
                  <strong>Kinh Địa Tạng Bồ Tát Bổn Nguyện</strong> là bộ kinh đại hiếu, chỉ dạy tường tận về nhân quả, công đức tụng kinh cứu vớt cửu huyền thất tổ và gia đạo an lành.
                </p>
                <div className="p-3 rounded-lg bg-stone-950 border border-amber-500/30 text-xs text-amber-200/95 font-medium leading-relaxed tracking-normal shadow-inner">
                  « Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát Ma Ha Tát »<br />
                  « Nguyện đem công đức này, hồi hướng khắp tất cả, đệ tử và chúng sinh, đều trọn thành Phật đạo. »
                </div>
              </div>
            )}
          </div>

          {/* Kênh hỗ trợ trực tiếp từ tác giả Nguyễn Viết Đạt */}
          <div className="p-4 rounded-xl bg-stone-900/90 border border-amber-500/30 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400 font-medium">Kênh hỗ trợ trực tiếp từ Tác giả:</span>
              <strong className="text-amber-300 font-bold text-sm">Nguyễn Viết Đạt</strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Số điện thoại / Zalo */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-950 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Hotline / Zalo hỗ trợ:</span>
                    <a
                      href={`tel:${authorPhone}`}
                      className="font-mono font-bold text-emerald-400 hover:underline text-xs"
                    >
                      {authorPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`https://zalo.me/${authorPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[10.5px] font-semibold"
                    title="Nhắn tin qua Zalo"
                  >
                    Zalo
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                    title="Sao chép số điện thoại"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-950 border border-zinc-800">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-zinc-500 block">Email tác giả:</span>
                    <a
                      href={`mailto:${authorEmail}`}
                      className="font-mono font-semibold text-amber-300 hover:underline text-xs truncate block"
                    >
                      {authorEmail}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs shrink-0"
                  title="Sao chép email"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
