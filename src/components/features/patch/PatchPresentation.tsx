'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/design-system/Button/Button';
import { patchImpactMeta, patchKindMeta, patchOriginMeta, type PatchEntry, type PatchReport } from '@/content/patch-notes';
import { initialsOf, resolveDisplayName, resolveIcon } from './patch-entity-resolvers';
import { buildPatchSlides, type PatchSlide, type PatchStatCounts } from './patch-presentation-slides';
import styles from './PatchPresentation.module.css';

// Khung logic cố định — mọi slide dựng ở đúng kích thước này rồi cả khối được
// scale() theo viewport thật. Đây là điểm mấu chốt để dùng quay video: quay ở
// cửa sổ nào cũng ra bố cục y hệt, chữ không bao giờ nhảy dòng khác giữa các lần.
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

const HASH_RE = /^#slide-(\d+)$/;

function readSlideIndexFromHash(max: number): number {
  const match = window.location.hash.match(HASH_RE);
  if (!match) return 0;
  return Math.min(Math.max(Number(match[1]), 0), max);
}

/** Mỗi loại icon cần khung khác nhau (xem patch-entity-resolvers.ts::IconVariant) —
 * tướng viền màu giá, tộc hệ/nâng cấp/cơ chế là silhouette cần plate màu mới
 * nhìn ra trên nền ivory, giống hệt cách PatchBoard.tsx (trang /patch) đang làm,
 * chỉ đổi kích thước cho khung slide 1920×1080. */
function EntryIcon({ entry, entitySet, size = 'md' }: { entry: PatchEntry; entitySet: number; size?: 'md' | 'sm' | 'lg' }) {
  const icon = resolveIcon(entry, entitySet);
  const sizeClass = size === 'sm' ? styles.iconSm : size === 'lg' ? styles.iconLg : null;
  const className = [styles.iconWrap, styles[`variant-${icon.variant}`], icon.src ? null : styles.iconPlaceholder, sizeClass]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={className} style={icon.accent ? ({ '--icon-accent': icon.accent } as CSSProperties) : undefined}>
      {icon.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- render trong stage được scale(); next/image tính layout theo viewport thật nên sẽ sai tỉ lệ ở đây.
        <img alt="" src={icon.src} />
      ) : (
        <span aria-hidden="true" className={styles.iconPlaceholderText}>{initialsOf(entry.name)}</span>
      )}
    </span>
  );
}

function EntryChanges({ entry }: { entry: PatchEntry }) {
  if (!entry.changes?.length) return null;
  return (
    <ul className={styles.changes}>
      {entry.changes.map((change, index) => (
        <li key={`${change.label}-${index}`}>
          <span className={styles.changeLabel}>{change.label}</span>
          <span className={styles.changeValues}>
            <span className={styles.changeFrom}>{change.from}</span>
            <span aria-hidden="true" className={styles.arrow}>→</span>
            <span className={[styles.changeTo, styles[`to-${entry.kind}`]].join(' ')}>{change.to}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Huy hiệu tô nền đặc + chữ trắng — dùng nhãn rút gọn ("giảm"/"tăng") vì giờ
 * đứng gọn trong một pill nhỏ ở góc thẻ, không cần câu đầy đủ như trước. */
function KindPill({ entry }: { entry: PatchEntry }) {
  return <span className={[styles.kindTag, styles[`kind-${entry.kind}`]].join(' ')}>{patchKindMeta[entry.kind].short}</span>;
}

/** `version` luôn có dạng "<NHÃN> DD/MM/YYYY (<id>)" (vd "PBE 06/08/2026
 * (18.1z)") — tách lấy nhãn nguồn (PBE/Live...) làm tiền tố tiêu đề, còn ngày
 * tháng rút gọn DD/MM làm phần số lớn tô màu, đúng bố cục "PATCH PBE 03/08"
 * của bản tham khảo — không hard-code "PBE" vì bản vá Live sẽ có nhãn khác. */
function SlideCover({ slide }: { slide: Extract<PatchSlide, { kind: 'cover' }> }) {
  const label = slide.version.split(' ')[0] || 'Patch';
  const shortDate = slide.dateVi.slice(0, 5);
  // `source.label` thường đã tự có tiền tố "<NHÃN> — ..." (vd "PBE — TheTruexy
  // ..."), trùng với `label` vừa tách — bỏ phần trùng để khỏi lặp "PBE" 2 lần.
  const rawSource = slide.source?.label;
  const sourceSuffix = rawSource?.startsWith(`${label} — `) ? rawSource.slice(label.length + 3) : rawSource;
  const sourceLine = sourceSuffix ? `${label} · Nguồn: ${sourceSuffix}` : `${label} · Biên soạn: ${slide.author}`;
  return (
    <div className={styles.coverPage}>
      <div className={styles.coverTopRow}>
        <span className={styles.coverBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element -- render trong stage được scale(); next/image tính layout theo viewport thật nên sẽ sai tỉ lệ ở đây. */}
          <img alt="" className={styles.coverBrandLogo} src="/logo/logo-main.png" />
          <span className={styles.coverBrandText}>
            BARON<span className={styles.wordmarkAccent}>TFT</span>
          </span>
        </span>
        <span className={styles.eyebrow}>Bản vá Set 18</span>
      </div>
      <div className={styles.coverHeadline}>
        <span className={styles.coverSource}>{sourceLine}</span>
        <h1>
          PATCH {label} <span className={styles.coverDate}>{shortDate}</span>
        </h1>
        <div aria-hidden="true" className={styles.coverRule} />
      </div>
      <StatRow stats={slide.stats} />
    </div>
  );
}

function StatRow({ stats }: { stats: PatchStatCounts }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.stat}><strong>{stats.total}</strong> thay đổi</span>
      <span className={[styles.stat, styles.statBuff].join(' ')}><strong>{stats.buff}</strong> tăng</span>
      <span className={[styles.stat, styles.statNerf].join(' ')}><strong>{stats.nerf}</strong> giảm</span>
      <span className={styles.stat}><strong>{stats.rework}</strong> chỉnh</span>
      <span className={styles.stat}><strong>{stats.mechanic}</strong> cơ chế</span>
    </div>
  );
}

/** Danh sách một cột, mỗi dòng cắt còn một dòng — dùng cho nội dung không có
 * icon thật (chỉ có placeholder) hoặc tên/mô tả quá dài để làm chip gọn. */
function TextRowList({ entries, entitySet, max }: { entries: PatchEntry[]; entitySet: number; max: number }) {
  if (!entries.length) return null;
  const visible = entries.slice(0, max);
  const hidden = entries.length - visible.length;
  return (
    <div className={styles.overviewListRows}>
      {visible.map((entry) => {
        const name = resolveDisplayName(entry, entitySet);
        return (
          <span className={styles.overviewRow} key={entry.id}>
            <EntryIcon entitySet={entitySet} entry={entry} size="sm" />
            <span className={styles.overviewRowText}>{name.vi}</span>
          </span>
        );
      })}
      {hidden > 0 ? <span className={styles.overviewMore}>+{hidden} khác</span> : null}
    </div>
  );
}

// Khung slide LUÔN đúng 1920×1080 logic px (xem STAGE_WIDTH/HEIGHT) — không
// phải trang web responsive — nên số ô icon vừa một hàng tính được chính xác
// một lần, không cần đoán hay đo DOM: content width của khối "other"/buff/nerf
// = 1560 (slideBody max-width) − 240 (padding) − 140 (overviewRowLabel) − 40
// (overviewRowContent padding) = 1140px; mỗi ô rộng 96px + gap 18px = 114px/ô
// → floor(1140 / 114) = 10 ô/hàng đúng khít. Giới hạn cứng bằng số lượng thay
// vì chỉ dựa CSS overflow:hidden — overflow từng cắt lỡ ngang icon dòng cuối
// vì chiều cao ước tính lệch vài pixel so với chiều cao chữ trình duyệt dựng
// thật; giới hạn theo số lượng (biết chắc đúng 10 ô/hàng) mới cắt sạch ở ranh
// giới hàng trong mọi trường hợp.
const ICON_GRID_COLS = 10;

/** Icon lớn + tên bên dưới, xếp lưới cuộn dòng — kiểu "infographic tóm tắt"
 * (tham khảo coachingtft.vn): ưu tiên nhận diện nhanh qua ảnh tướng/tộc hệ
 * hơn là đọc chữ, khác với ChipList (icon nhỏ + tên cạnh, dùng ở các slide
 * cần liệt kê nhiều mục hơn là "nhìn phát biết ngay"). */
function IconGrid({ entries, entitySet, rows }: { entries: PatchEntry[]; entitySet: number; rows: number }) {
  if (!entries.length) return null;
  const visible = entries.slice(0, ICON_GRID_COLS * rows);
  return (
    <div className={styles.iconGrid}>
      {visible.map((entry) => {
        const name = resolveDisplayName(entry, entitySet);
        return (
          <div className={styles.iconGridItem} key={entry.id}>
            <EntryIcon entitySet={entitySet} entry={entry} size="lg" />
            <span>{name.vi}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Một hàng của slide Tổng quan — dải nhãn màu chạy hết chiều cao hàng ở bên
 * trái (Buff/Nerf/Cơ chế & Chỉnh), lưới icon lớn bên phải. Mục không có icon
 * thật (chủ yếu cơ chế/sửa lỗi) rơi xuống danh sách cắt dòng ngay dưới lưới,
 * không trộn lẫn vào lưới làm ô trống xen kẽ ô có ảnh. */
function OverviewRow({
  tone,
  label,
  entries,
  entitySet,
}: {
  tone: 'buff' | 'nerf' | 'other';
  label: string;
  entries: PatchEntry[];
  entitySet: number;
}) {
  if (!entries.length) return null;
  const withIcon = entries.filter((entry) => resolveIcon(entry, entitySet).src);
  const withoutIcon = entries.filter((entry) => !resolveIcon(entry, entitySet).src);
  return (
    <div className={styles.overviewRowBlock}>
      <div className={[styles.overviewRowLabel, styles[`overviewRowLabel-${tone}`]].join(' ')}>
        <span>{label}</span>
        <span className={styles.overviewRowCount}>{entries.length}</span>
      </div>
      <div className={[styles.overviewRowContent, tone === 'other' ? styles.overviewRowContentOther : null].filter(Boolean).join(' ')}>
        <IconGrid entitySet={entitySet} entries={withIcon} rows={tone === 'other' ? 1 : 2} />
        {withoutIcon.length > 0 ? <TextRowList entitySet={entitySet} entries={withoutIcon} max={4} /> : null}
      </div>
    </div>
  );
}

function SlideOverview({ slide, entitySet }: { slide: Extract<PatchSlide, { kind: 'overview' }>; entitySet: number }) {
  return (
    <div className={styles.slideBody}>
      <span className={styles.eyebrow}>Tổng quan · {slide.stats.total} thay đổi</span>
      <div className={styles.overviewStack}>
        <OverviewRow entitySet={entitySet} entries={slide.buffs} label="Buff" tone="buff" />
        <OverviewRow entitySet={entitySet} entries={slide.nerfs} label="Nerf" tone="nerf" />
        <OverviewRow entitySet={entitySet} entries={slide.others} label="Cơ chế & Chỉnh" tone="other" />
      </div>
    </div>
  );
}

function SlideRhythm({ slide }: { slide: Extract<PatchSlide, { kind: 'rhythm' }> }) {
  return (
    <div className={styles.slideBody}>
      <span className={styles.eyebrow}>Phân tích cá nhân</span>
      <h2>Nhịp chỉnh sửa</h2>
      <ul className={styles.bulletList}>
        {slide.lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}

/** Một thẻ thay đổi đầy đủ — icon, tên (+ tên gốc), huy hiệu, nhãn tăng/giảm,
 * số liệu trước/sau. Dùng chung cho lưới tướng/tộc hệ/trang bị (SlideGrid) VÀ
 * cột nâng cấp/Tinh Linh (SlideColumns) — cùng một ngôn ngữ hình ảnh xuyên
 * suốt bộ slide thay vì đổi kiểu nửa chừng. */
function EntryCard({
  entry,
  entitySet,
  size = 'md',
}: {
  entry: PatchEntry;
  entitySet: number;
  size?: 'md' | 'sm';
}) {
  const name = resolveDisplayName(entry, entitySet);
  const icon = resolveIcon(entry, entitySet);
  return (
    <article className={[styles.card, size === 'sm' ? styles.cardSm : null].filter(Boolean).join(' ')} style={{ borderColor: icon.accent }}>
      <div className={styles.cardHead}>
        <EntryIcon entitySet={entitySet} entry={entry} size={size === 'sm' ? 'sm' : 'md'} />
        <div className={styles.cardHeadText}>
          <h3>
            {name.vi}
            {name.en ? <span className={styles.nameEn}> {name.en}</span> : null}
          </h3>
          <div className={styles.cardTags}>
            {entry.cost ? (
              // Chỉ tô màu giá cho tướng — icon.accent của Tinh Linh là màu
              // loại (Giao Tranh/Cửa Hàng...), không phải màu giá, tô nhầm sẽ
              // sai nghĩa hoàn toàn.
              <span
                className={styles.costBadge}
                style={entry.category === 'champion' ? { color: icon.accent, borderColor: icon.accent } : undefined}
              >
                {entry.cost} vàng
              </span>
            ) : null}
            {entry.breakpoint ? <span className={styles.costBadge}>Mốc {entry.breakpoint}</span> : null}
            {entry.note ? <span className={styles.noteBadge}>{entry.note}</span> : null}
          </div>
        </div>
        {/* Huy hiệu tăng/giảm neo góc phải thẻ — tách khỏi cardTags (tên/giá/mốc)
            để luôn dễ thấy dù thẻ dài ngắn khác nhau, đúng bố cục bản tham khảo. */}
        <KindPill entry={entry} />
      </div>
      <EntryChanges entry={entry} />
    </article>
  );
}

function SlideGrid({ slide, entitySet }: { slide: Extract<PatchSlide, { kind: 'grid' }>; entitySet: number }) {
  return (
    <div className={styles.slideBody}>
      <span className={styles.eyebrow}>{slide.eyebrow}</span>
      <h2>
        {slide.heading}
        {slide.badge ? <span className={styles.headingBadge}> · {slide.badge}</span> : null}
      </h2>
      <div className={styles.cardGrid}>
        {slide.entries.map((entry) => <EntryCard entitySet={entitySet} entry={entry} key={entry.id} size={slide.cardSize} />)}
      </div>
    </div>
  );
}

const BULLET_CLASS_BY_KIND: Record<PatchEntry['kind'], string> = {
  buff: 'bulletBuff',
  nerf: 'bulletNerf',
  rework: 'bulletRework',
  mechanic: 'bulletMechanic',
};

function SlideMechanic({ slide }: { slide: Extract<PatchSlide, { kind: 'mechanic' }> }) {
  return (
    <div className={styles.slideBody}>
      <span className={styles.eyebrow}>{slide.eyebrow}</span>
      <h2>Cơ chế</h2>
      <ul className={styles.mechanicList}>
        {slide.entries.map((entry) => (
          <li className={styles.mechanicRow} key={entry.id}>
            <span aria-hidden="true" className={[styles.mechanicBullet, styles[BULLET_CLASS_BY_KIND[entry.kind]]].join(' ')} />
            <div className={styles.mechanicBody}>
              <p>{entry.name}</p>
              <EntryChanges entry={entry} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SlideImpact({ slide }: { slide: Extract<PatchSlide, { kind: 'impact' }> }) {
  const { impact } = slide;
  return (
    <div className={styles.slideBody}>
      <span className={[styles.eyebrow, styles[`dir-${impact.direction}`]].join(' ')}>
        {patchImpactMeta[impact.direction].arrow} {patchImpactMeta[impact.direction].label}
      </span>
      <h2>{impact.title}</h2>
      <p className={styles.leadText}>{impact.verdict}</p>
      {impact.context?.length ? (
        <ul className={styles.bulletList}>
          {impact.context.map((line) => <li key={line}>{line}</li>)}
        </ul>
      ) : null}
      <p className={styles.bodyText}>{impact.body}</p>
    </div>
  );
}

/** Trước đây dồn cả `summaryVi` vào một câu trích dẫn khổng lồ căn giữa —
 * đẹp nhưng phải đọc hết câu mới nắm được ý, không quét nhanh được. Slide
 * builder đã tách sẵn thành `summaryLines` theo dấu phẩy cấp ngoài cùng: dòng
 * đầu làm tiêu đề chốt ý, các dòng còn lại xuống danh sách gạch đầu dòng căn
 * trái — vẫn giữ nền full-bleed màu accent (đẹp), chỉ đổi cách chia chữ để
 * đọc lướt được (hiệu quả). */
function SlideQuote({ slide }: { slide: Extract<PatchSlide, { kind: 'quote' }> }) {
  const [lead, ...rest] = slide.summaryLines.length ? slide.summaryLines : [slide.summaryVi];
  return (
    <div className={styles.slideQuote}>
      <span className={styles.quoteEyebrow}>{patchOriginMeta[slide.summaryOrigin].label}</span>
      <p className={styles.quoteLead}>{lead}</p>
      {rest.length ? (
        <ul className={styles.quoteList}>
          {rest.map((line) => <li key={line}>{line}</li>)}
        </ul>
      ) : null}
      <div className={styles.quoteFooter}>
        <span>{slide.dateVi}</span>
        <span aria-hidden="true">·</span>
        <span>{slide.stats.total} thay đổi</span>
      </div>
    </div>
  );
}

function SlideOutro({ slide }: { slide: Extract<PatchSlide, { kind: 'outro' }> }) {
  return (
    <div className={styles.slideCover}>
      <span className={styles.wordmark}>
        {/* eslint-disable-next-line @next/next/no-img-element -- render trong stage được scale(); next/image tính layout theo viewport thật nên sẽ sai tỉ lệ ở đây. */}
        <img alt="" className={styles.wordmarkLogo} src="/logo/logo-main.png" />
        BARON<span className={styles.wordmarkAccent}>TFT</span>
      </span>
      <p className={styles.coverTitle}>Đọc đầy đủ bản và phần diễn giải tại</p>
      <p className={styles.outroUrl}>barontft.vercel.app{slide.url}</p>
      <span className={styles.outroFooter}>Fan project độc lập · không liên kết với Riot Games</span>
    </div>
  );
}

function SlideRenderer({ slide, entitySet }: { slide: PatchSlide; entitySet: number }) {
  switch (slide.kind) {
    case 'cover':
      return <SlideCover slide={slide} />;
    case 'overview':
      return <SlideOverview entitySet={entitySet} slide={slide} />;
    case 'rhythm':
      return <SlideRhythm slide={slide} />;
    case 'grid':
      return <SlideGrid entitySet={entitySet} slide={slide} />;
    case 'mechanic':
      return <SlideMechanic slide={slide} />;
    case 'impact':
      return <SlideImpact slide={slide} />;
    case 'quote':
      return <SlideQuote slide={slide} />;
    case 'outro':
      return <SlideOutro slide={slide} />;
  }
}

export function PatchPresentation({ report, url }: { report: PatchReport; url: string }) {
  const entitySet = report.entitySet ?? 18;
  const slides = useMemo(() => buildPatchSlides(report, url), [report, url]);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  // Portal chỉ được tạo phía client (document.body không tồn tại lúc SSR). Nếu
  // render createPortal ngay từ lần render đầu, client render đầu tiên (trước
  // effect) đã khác với HTML server trả về → React báo hydration mismatch. Trì
  // hoãn tới sau khi mount (effect luôn chạy sau hydrate) để lần render đầu ở
  // cả hai phía đều giống nhau (không có portal).
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const goTo = (next: number) => setIndex(Math.min(Math.max(next, 0), slides.length - 1));

  function openPresentation() {
    setIndex(readSlideIndexFromHash(slides.length - 1));
    setIsOpen(true);
    const el = stageRef.current?.parentElement;
    // requestFullscreen phải gọi trong cùng lượt click (user gesture) mới được
    // trình duyệt cho phép — el đã tồn tại sẵn trong DOM (portal mount không
    // điều kiện, chỉ ẩn/hiện bằng CSS) nên gọi được ngay ở đây.
    el?.requestFullscreen?.().catch(() => {
      // Từ chối (không hỗ trợ / bị chặn) → vẫn dùng được, rơi về overlay
      // position: fixed; inset: 0 đã có sẵn qua className .fallback.
    });
  }

  function closePresentation() {
    setIsOpen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  // Đồng bộ #slide-<n> lên URL bằng replaceState — không đụng canonical, không
  // rác lịch sử back — để quay hỏng một slide thì mở lại đúng chỗ đó.
  useEffect(() => {
    if (!isOpen) return;
    history.replaceState(null, '', `#slide-${index}`);
  }, [isOpen, index]);

  // Command palette (Ctrl/Cmd+K) và trình chiếu cùng nghe keydown trên window,
  // độc lập với nhau — không có cách nào chặn trực tiếp từ đây. Đánh dấu bằng
  // thuộc tính trên <html> để CommandPaletteProvider tự bỏ qua phím tắt của nó
  // trong lúc đang trình chiếu (bấm Ctrl+K khi đang quay/chiếu mà bật popup tìm
  // kiếm đè lên khung 1920×1080 thì hỏng cả video).
  useEffect(() => {
    document.documentElement.toggleAttribute('data-presenting', isOpen);
    return () => document.documentElement.removeAttribute('data-presenting');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePresentation();
      } else if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(slides.length - 1);
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else stageRef.current?.parentElement?.requestFullscreen?.().catch(() => {});
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo đóng trên `index`/`slides.length` qua closure ổn định theo từng lượt render, không cần liệt kê riêng.
  }, [isOpen, index, slides.length]);

  // Khung 16:9 cố định (1920×1080) rồi scale theo kích thước thật của khung
  // chứa — bố cục không đổi giữa các lần quay dù cửa sổ to nhỏ khác nhau.
  useEffect(() => {
    if (!isOpen) return;
    const container = stageRef.current?.parentElement;
    if (!container) return;

    function updateScale() {
      if (!container) return;
      const next = Math.min(container.clientWidth / STAGE_WIDTH, container.clientHeight / STAGE_HEIGHT);
      setScale(next > 0 ? next : 1);
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    document.addEventListener('fullscreenchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      document.removeEventListener('fullscreenchange', updateScale);
    };
  }, [isOpen]);

  const portalNode =
    !mounted
      ? null
      : createPortal(
          <div
            aria-hidden={!isOpen}
            aria-label="Trình chiếu bản vá"
            aria-modal="true"
            className={[styles.overlay, isOpen ? styles.overlayOpen : null].filter(Boolean).join(' ')}
            role="dialog"
          >
            <div className={styles.stageViewport}>
              <div
                className={styles.stage}
                ref={stageRef}
                style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}
              >
                {slides[index] ? <SlideRenderer entitySet={entitySet} slide={slides[index]} /> : null}
                {slides[index] && slides[index].kind !== 'cover' && slides[index].kind !== 'outro' ? (
                  <span aria-hidden="true" className={styles.stageWordmark}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- render trong stage được scale(); next/image tính layout theo viewport thật nên sẽ sai tỉ lệ ở đây. */}
                    <img alt="" className={styles.stageWordmarkLogo} src="/logo/logo-main.png" />
                    BARON<span className={styles.wordmarkAccent}>TFT</span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className={styles.controls}>
              <span className={styles.progress}>{index + 1} / {slides.length}</span>
              <div className={styles.controlButtons}>
                <button aria-label="Slide trước" className={styles.controlButton} type="button" onClick={() => goTo(index - 1)}>
                  ‹
                </button>
                <button aria-label="Slide sau" className={styles.controlButton} type="button" onClick={() => goTo(index + 1)}>
                  ›
                </button>
                <button className={styles.exitButton} type="button" onClick={closePresentation}>
                  Thoát (Esc)
                </button>
              </div>
            </div>
          </div>,
          document.body,
        );

  return (
    <>
      <Button size="sm" type="button" variant="secondary" onClick={openPresentation}>
        Trình chiếu
      </Button>
      {portalNode}
    </>
  );
}
