import React, { useState, useMemo } from 'react';
import { CompassType, CompassRulerOption } from '../types/fengshui';
import { COMPASS_RULERS_LIST } from '../utils/luopanRulersData';
import {
  ShieldCheck,
  Mountain,
  Droplets,
  Grid,
  Sparkles,
  Compass,
  Ruler,
  X,
  Check,
  ChevronRight,
  Info,
  Search,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface CompassSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompass: CompassType;
  onSelectCompass: (id: CompassType) => void;
}

export const renderCompassIcon = (iconName: string, color: string, className = 'w-5 h-5') => {
  const iconProps = { className, style: { color } };
  switch (iconName) {
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'Mountain':
      return <Mountain {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Grid':
      return <Grid {...iconProps} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Ruler':
      return <Ruler {...iconProps} />;
    default:
      return <Compass {...iconProps} />;
  }
};

type CategoryFilter = 'all' | 'tamhop' | 'tamnguyen' | 'battrach' | 'toannang' | 'thuoc';

interface CompassListContentProps {
  selectedCompass: CompassType;
  onSelectCompass: (id: CompassType) => void;
  onAfterSelect?: () => void;
  isStandalone?: boolean;
}

export const CompassGalleryContent: React.FC<CompassListContentProps> = ({
  selectedCompass,
  onSelectCompass,
  onAfterSelect,
  isStandalone = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRulers = useMemo(() => {
    return COMPASS_RULERS_LIST.filter((ruler) => {
      const matchCat = activeCategory === 'all' || ruler.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        ruler.title.toLowerCase().includes(q) ||
        ruler.subtitle.toLowerCase().includes(q) ||
        ruler.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const categories: { id: CategoryFilter; label: string; count: number }[] = [
    { id: 'all', label: 'Tất Cả', count: COMPASS_RULERS_LIST.length },
    {
      id: 'tamhop',
      label: 'Tam Hợp Phái',
      count: COMPASS_RULERS_LIST.filter((r) => r.category === 'tamhop').length,
    },
    {
      id: 'tamnguyen',
      label: 'Huyền Không - Tam Nguyên',
      count: COMPASS_RULERS_LIST.filter((r) => r.category === 'tamnguyen').length,
    },
    {
      id: 'battrach',
      label: 'Bát Trạch & Phúc Đức',
      count: COMPASS_RULERS_LIST.filter((r) => r.category === 'battrach').length,
    },
    {
      id: 'toannang',
      label: 'La Kinh Toàn Năng',
      count: COMPASS_RULERS_LIST.filter((r) => r.category === 'toannang').length,
    },
    {
      id: 'thuoc',
      label: 'Thước Lỗ Ban',
      count: COMPASS_RULERS_LIST.filter((r) => r.category === 'thuoc').length,
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-3 sm:space-y-4">
      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm thước hoặc đĩa la bàn (ví dụ: Xuyên Sơn, Phân Kim, Nạp Thủy, Lỗ Ban...)"
            className="w-full pl-9 pr-4 py-2 bg-stone-950/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-zinc-800/80'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategory === cat.id ? 'bg-stone-950/30 text-stone-950' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Rulers Grid/List */}
      <div
        className={`overflow-y-auto space-y-2.5 pr-1 ${
          isStandalone ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 space-y-0' : 'max-h-[60vh]'
        }`}
      >
        {filteredRulers.map((ruler) => {
          const isSelected = selectedCompass === ruler.id;

          return (
            <div
              key={ruler.id}
              onClick={() => {
                onSelectCompass(ruler.id);
                if (onAfterSelect) onAfterSelect();
              }}
              className={`group relative p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500/40'
                  : 'bg-stone-950/50 border-zinc-800 hover:bg-zinc-800/40 hover:border-zinc-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/40 shadow-inner'
                      : 'bg-stone-900 border-zinc-800 group-hover:border-zinc-700'
                  }`}
                >
                  {renderCompassIcon(ruler.iconName, ruler.accentColor)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {ruler.title}
                    </span>
                    {ruler.badge && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ruler.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-400/90 font-medium mt-0.5 truncate">
                    {ruler.subtitle}
                  </p>
                </div>

                <div className="shrink-0 pt-0.5">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-800/80 text-zinc-500 group-hover:text-amber-400 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {ruler.description}
              </p>

              {/* Card Footer Status */}
              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-medium">
                  {ruler.category === 'tamhop'
                    ? 'Tam Hợp Phái'
                    : ruler.category === 'tamnguyen'
                    ? 'Tam Nguyên Huyền Không'
                    : ruler.category === 'battrach'
                    ? 'Bát Trạch Minh Cảnh'
                    : ruler.category === 'toannang'
                    ? 'Toàn Năng Đa Tầng'
                    : 'Thước Phong Thủy'}
                </span>
                <span
                  className={`font-bold transition-colors ${
                    isSelected ? 'text-amber-400 flex items-center gap-1' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Đang chọn</span>
                    </>
                  ) : (
                    'Chạm để chọn →'
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRulers.length === 0 && (
        <div className="p-8 text-center text-zinc-500 space-y-2">
          <p className="text-sm">Không tìm thấy loại thước nào khớp với từ khóa "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="text-xs text-amber-400 hover:underline"
          >
            Hiển thị tất cả 12 loại thước & đĩa la kinh
          </button>
        </div>
      )}
    </div>
  );
};

export const CompassSelectorModal: React.FC<CompassSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCompass,
  onSelectCompass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-stone-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20">
              <Compass className="w-5 h-5 text-stone-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Chọn Loại Thước & La Bàn (Bản Pro)
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  12 Thước Chuẩn
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Bát Trạch · Tiêu Sa · Nạp Thủy · 72 Xuyên Sơn · 60 Thấu Địa · 120 Phân Kim · Đại Quái · Tổng Hợp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5 overflow-y-auto">
          <CompassGalleryContent
            selectedCompass={selectedCompass}
            onSelectCompass={onSelectCompass}
            onAfterSelect={onClose}
          />
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-stone-950/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              Đĩa la kinh đã chọn sẽ tự động đồng bộ trên toàn bộ bản vẽ và các tab phân tích.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
