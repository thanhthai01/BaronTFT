'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Button } from '@/components/design-system/Button/Button';
import { decisionTrees, type DecisionNode } from '@/content/decision-trees';
import {
  CANVAS_PAD,
  NODE_H,
  NODE_W,
  clampViewportToContent,
  fitViewport,
  layoutDecisionTree,
  pathToNode,
  subtreeBoundingBox,
  type LaidOutNode,
  type Viewport,
} from '@/lib/decision-tree-layout';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './DecisionMindmap.module.css';

const VIEW_W = 960;
const VIEW_H = 620;
const MIN_MANUAL_SCALE = 0.35;
const MAX_MANUAL_SCALE = 2.8;
const WHEEL_ZOOM_STEP = 1.12;
const BUTTON_ZOOM_STEP = 1.25;
const DRAG_THRESHOLD = 4;

function clampManualScale(scale: number) {
  return Math.min(MAX_MANUAL_SCALE, Math.max(MIN_MANUAL_SCALE, scale));
}

/** Điểm client (chuột/chạm) quy đổi sang toạ độ trong viewBox — dùng getScreenCTM
 * thay vì tự tính tỉ lệ từ getBoundingClientRect, vì nó tự xử lý đúng cả khi
 * viewBox bị letterbox (tỉ lệ khung khác tỉ lệ viewBox) trên màn hình hẹp. */
function clientToViewBoxPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const transformed = point.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
}

function zoomViewportAt(viewport: Viewport, anchor: { x: number; y: number }, factor: number): Viewport {
  const newScale = clampManualScale(viewport.scale * factor);
  const contentX = (anchor.x - viewport.tx) / viewport.scale;
  const contentY = (anchor.y - viewport.ty) / viewport.scale;
  return {
    scale: newScale,
    tx: anchor.x - contentX * newScale,
    ty: anchor.y - contentY * newScale,
  };
}

function GuidedDecisionTree({
  tree,
  currentEntry,
  breadcrumb,
  onBack,
  onReset,
  onSelect,
  onSelectTree,
}: {
  tree: (typeof decisionTrees)[number];
  currentEntry: LaidOutNode;
  breadcrumb: LaidOutNode[];
  onBack: () => void;
  onReset: () => void;
  onSelect: (id: string) => void;
  onSelectTree: (treeId: string) => void;
}) {
  const node = currentEntry.node;
  const hasPrevious = breadcrumb.length > 1;

  return (
    <section className={styles.guided} aria-labelledby="guided-decision-title">
      <div className={styles.guidedHead}>
        <span className="kicker">Guided flow</span>
        <h2 id="guided-decision-title">{tree.title}</h2>
        <p>{tree.summary}</p>
      </div>

      <div className={styles.guidedPath} aria-label="Đường đi hiện tại">
        {breadcrumb.map((entry, index) => (
          <span key={entry.node.id}>
            {index > 0 ? <span aria-hidden="true">→</span> : null}
            {entry.node.label}
          </span>
        ))}
      </div>

      {node.kind === 'question' ? (
        <div className={styles.guidedCard}>
          <span className={styles.guidedType}>Câu hỏi</span>
          <h3>{node.question}</h3>
          <p>{node.detail}</p>
          <div className={styles.guidedAnswers}>
            {node.branches.map((branch) => (
              <button className={styles.guidedAnswer} key={branch.node.id} type="button" onClick={() => onSelect(branch.node.id)}>
                <span className={[styles.branchTag, styles[`tone-${branch.tone}`]].join(' ')}>{branch.edgeLabel}</span>
                <strong>{branch.node.label}</strong>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.guidedCard}>
          <span className={styles.guidedType}>Hành động</span>
          <h3>{node.action}</h3>
          <p>{node.detail}</p>
          {node.watchFor ? (
            <div className={styles.watchFor}>
              <strong>Lưu ý</strong>
              <p>{node.watchFor}</p>
            </div>
          ) : null}
          <div className={styles.actionLinks}>
            {node.relatedTree ? (
              <Button variant="primary" onClick={() => onSelectTree(node.relatedTree!.treeId)}>
                {node.relatedTree.label}
              </Button>
            ) : null}
            {node.related ? (
              <Button href={node.related.href} variant="secondary">
                {node.related.label}
              </Button>
            ) : null}
          </div>
        </div>
      )}

      <div className={styles.guidedControls}>
        <button className={styles.guidedControl} disabled={!hasPrevious} type="button" onClick={onBack}>
          Câu trước
        </button>
        <button className={styles.guidedControl} type="button" onClick={onReset}>
          Bắt đầu lại
        </button>
      </div>
    </section>
  );
}

function ContentPanel({
  tree,
  focusEntry,
  onSelect,
  onSelectTree,
}: {
  tree: (typeof decisionTrees)[number];
  focusEntry: LaidOutNode | null;
  onSelect: (id: string) => void;
  onSelectTree: (treeId: string) => void;
}) {
  if (!focusEntry) {
    return (
      <div className={styles.contentInner}>
        <span className="kicker">{tree.kicker}</span>
        <h2>{tree.title}</h2>
        <p className={styles.summary}>{tree.summary}</p>
        <p className={styles.hint}>Chọn một nhánh bên phải để xem chi tiết — cây sẽ zoom đến nhánh đó.</p>
      </div>
    );
  }

  const node = focusEntry.node;

  if (node.kind === 'question') {
    return (
      <div className={styles.contentInner} key={node.id}>
        <span className="kicker">Câu hỏi</span>
        <h2>{node.question}</h2>
        <p className={styles.summary}>{node.detail}</p>
        <div className={styles.branchList}>
          {node.branches.map((branch) => (
            <button className={styles.branchOption} key={branch.node.id} type="button" onClick={() => onSelect(branch.node.id)}>
              <span className={[styles.branchTag, styles[`tone-${branch.tone}`]].join(' ')}>{branch.edgeLabel}</span>
              <span className={styles.branchPreview}>{branch.node.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentInner} key={node.id}>
      <span className="kicker">Hành động</span>
      <h2>{node.action}</h2>
      <p className={styles.summary}>{node.detail}</p>
      {node.watchFor && (
        <div className={styles.watchFor}>
          <strong>Lưu ý</strong>
          <p>{node.watchFor}</p>
        </div>
      )}
      <div className={styles.actionLinks}>
        {node.relatedTree && (
          <Button variant="primary" onClick={() => onSelectTree(node.relatedTree!.treeId)}>
            {node.relatedTree.label}
          </Button>
        )}
        {node.related && (
          <Button href={node.related.href} variant="secondary">
            {node.related.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export function DecisionMindmap() {
  const [treeId, setTreeId] = useState(decisionTrees[0].id);
  const tree = decisionTrees.find((entry) => entry.id === treeId) ?? decisionTrees[0];
  const layout = useMemo(() => layoutDecisionTree(tree.root), [tree]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manualViewport, setManualViewport] = useState<Viewport | null>(null);
  const reduceMotionRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const effectiveViewportRef = useRef<Viewport>({ tx: 0, ty: 0, scale: 1 });
  const layoutRef = useRef(layout);
  const dragRef = useRef<{ pointerId: number; start: { x: number; y: number }; startViewport: Viewport; dragged: boolean } | null>(null);
  const suppressNextClickRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = prefersReducedMotion();
  }, []);

  // Đổi cây hoặc chọn node mới luôn quay lại chế độ auto-fit (zoom đến nhánh
  // được chọn) — bỏ mọi pan/zoom tay người dùng đã làm trước đó, vì lúc này
  // ý định rõ ràng là xem một nhánh/cây khác chứ không phải giữ khung nhìn cũ.
  useEffect(() => {
    setManualViewport(null);
  }, [treeId, selectedId]);

  useEffect(() => {
    setSelectedId(null);
  }, [treeId]);

  // selectedId có thể trỏ tới node của cây vừa rời đi trong khoảnh khắc giữa
  // đổi treeId và effect reset chạy — luôn xác thực lại với layout hiện tại
  // trước khi dùng, thay vì tin state thô.
  const validSelectedId = selectedId && layout.byId.has(selectedId) ? selectedId : null;
  const bbox = validSelectedId
    ? subtreeBoundingBox(layout, validSelectedId)
    : { minX: 0, minY: 0, maxX: layout.width, maxY: layout.height };
  const computedViewport = fitViewport(bbox, VIEW_W, VIEW_H, validSelectedId ? CANVAS_PAD * 1.4 : CANVAS_PAD);
  const viewport = manualViewport ?? computedViewport;
  effectiveViewportRef.current = viewport;
  const activePath = useMemo(
    () => new Set(validSelectedId ? pathToNode(layout, validSelectedId) : [tree.root.id]),
    [layout, validSelectedId, tree.root.id],
  );
  const focusEntry = validSelectedId ? (layout.byId.get(validSelectedId) ?? null) : null;
  const currentEntry = focusEntry ?? layout.byId.get(tree.root.id)!;
  const breadcrumb = pathToNode(layout, currentEntry.node.id).map((id) => layout.byId.get(id)!);

  layoutRef.current = layout;

  // Chốt luôn ít nhất `margin` px của cây trong khung nhìn — không cho kéo/zoom
  // trôi mất hẳn cây ra khỏi canvas như pan/zoom tự do thông thường.
  function applyManualViewport(next: Viewport) {
    const l = layoutRef.current;
    setManualViewport(clampViewportToContent(next, l.width, l.height, VIEW_W, VIEW_H));
  }

  // Cuộn chuột để zoom quanh đúng điểm con trỏ đang trỏ tới — cần listener
  // native (không phải prop onWheel của React) với passive:false, vì React
  // gắn onWheel ở chế độ passive nên preventDefault bên trong nó bị bỏ qua.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      if (!svg) return;
      const anchor = clientToViewBoxPoint(svg, event.clientX, event.clientY);
      const factor = event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
      applyManualViewport(zoomViewportAt(effectiveViewportRef.current, anchor, factor));
    }

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  function selectNode(id: string) {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    setSelectedId(id);
  }

  function selectTree(id: string) {
    setTreeId(id);
  }

  function goBack() {
    if (breadcrumb.length <= 1) return;
    const previous = breadcrumb[breadcrumb.length - 2];
    setSelectedId(previous.node.id === tree.root.id ? null : previous.node.id);
  }

  function handlePointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    const svg = svgRef.current;
    if (!svg) return;
    const start = clientToViewBoxPoint(svg, event.clientX, event.clientY);
    dragRef.current = { pointerId: event.pointerId, start, startViewport: effectiveViewportRef.current, dragged: false };
    // Không setPointerCapture ở đây: làm vậy ngay từ pointerdown khiến Chromium
    // định tuyến lại "click" tổng hợp sau đó về thẳng <svg> thay vì <button> bên
    // trong node (target bị đổi vì pointer đã bị capture) — click trên node vì
    // vậy không bao giờ tới tay React nữa. Chỉ capture khi đã xác nhận là kéo
    // thật (xem handlePointerMove), lúc đó việc click bị "cướp" không còn quan trọng.
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    const svg = svgRef.current;
    if (!drag || !svg || drag.pointerId !== event.pointerId) return;
    const current = clientToViewBoxPoint(svg, event.clientX, event.clientY);
    const dx = current.x - drag.start.x;
    const dy = current.y - drag.start.y;
    if (!drag.dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.dragged) svg.setPointerCapture(event.pointerId);
    drag.dragged = true;
    applyManualViewport({ tx: drag.startViewport.tx + dx, ty: drag.startViewport.ty + dy, scale: drag.startViewport.scale });
  }

  function handlePointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.dragged) {
      // Chỉ nuốt đúng cú click được trình duyệt sinh ra ngay sau pointerup
      // này (nó luôn bắn đồng bộ trước khi setTimeout chạy) — không được để
      // cờ treo lại và nuốt nhầm một click độc lập ở lượt tương tác sau.
      suppressNextClickRef.current = true;
      window.setTimeout(() => {
        suppressNextClickRef.current = false;
      }, 0);
      const svg = svgRef.current;
      if (svg?.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  }

  function zoomByButton(factor: number) {
    const anchor = { x: VIEW_W / 2, y: VIEW_H / 2 };
    applyManualViewport(zoomViewportAt(effectiveViewportRef.current, anchor, factor));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.treeSwitcher} role="tablist" aria-label="Chọn cây quyết định">
        {decisionTrees.map((entry) => (
          <button
            aria-selected={entry.id === treeId}
            className={styles.treeTab}
            key={entry.id}
            role="tab"
            type="button"
            onClick={() => setTreeId(entry.id)}
          >
            {entry.title}
          </button>
        ))}
      </div>

      <GuidedDecisionTree
        breadcrumb={breadcrumb}
        currentEntry={currentEntry}
        tree={tree}
        onBack={goBack}
        onReset={() => setSelectedId(null)}
        onSelect={selectNode}
        onSelectTree={selectTree}
      />

      <div className={styles.layout}>
        <aside aria-live="polite" className={styles.contentPanel}>
          <ContentPanel focusEntry={focusEntry} tree={tree} onSelect={selectNode} onSelectTree={selectTree} />
        </aside>

        <div className={styles.mapPanel}>
          <div className={styles.mapToolbar}>
            <div aria-label="Đường đi trong cây" className={styles.breadcrumb}>
              <button className={styles.crumb} type="button" onClick={() => setSelectedId(null)}>
                Toàn bộ cây
              </button>
              {breadcrumb.map((entry) => (
                <span className={styles.crumbGroup} key={entry.node.id}>
                  <span className={styles.crumbSep} aria-hidden="true">→</span>
                  <button
                    aria-current={entry.node.id === validSelectedId ? 'true' : undefined}
                    className={styles.crumb}
                    type="button"
                    onClick={() => setSelectedId(entry.node.id)}
                  >
                    {entry.node.label}
                  </button>
                </span>
              ))}
            </div>
            <div className={styles.zoomControls}>
              <button aria-label="Thu nhỏ" className={styles.zoomButton} type="button" onClick={() => zoomByButton(1 / BUTTON_ZOOM_STEP)}>
                −
              </button>
              <button aria-label="Phóng to" className={styles.zoomButton} type="button" onClick={() => zoomByButton(BUTTON_ZOOM_STEP)}>
                +
              </button>
              {(validSelectedId || manualViewport) && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedId(null);
                    setManualViewport(null);
                  }}
                >
                  Xem toàn bộ cây
                </Button>
              )}
            </div>
          </div>

          <svg
            aria-label={`Mindmap cây quyết định: ${tree.title}. Cuộn chuột để zoom, kéo để di chuyển.`}
            className={styles.svg}
            ref={svgRef}
            role="group"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            onPointerDown={handlePointerDown}
            onPointerLeave={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <g
              className={styles.canvasGroup}
              style={{
                transform: `translate(${viewport.tx}px, ${viewport.ty}px) scale(${viewport.scale})`,
                transition: reduceMotionRef.current || manualViewport ? 'none' : undefined,
              }}
            >
              {layout.nodes.map((entry) => {
                if (!entry.parentId) return null;
                const parent = layout.byId.get(entry.parentId);
                if (!parent) return null;
                const startX = parent.x + NODE_W / 2;
                const startY = parent.y + NODE_H;
                const endX = entry.x + NODE_W / 2;
                const endY = entry.y;
                const midY = (startY + endY) / 2;
                const isActive = activePath.has(parent.node.id) && activePath.has(entry.node.id);
                return (
                  <g key={`edge-${entry.node.id}`}>
                    <path
                      className={[styles.edgePath, isActive ? styles.edgeActive : '', styles[`edge-${entry.edgeTone}`]].join(' ')}
                      d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                    />
                    <text
                      className={[styles.edgeLabel, isActive ? styles.edgeLabelActive : ''].join(' ')}
                      textAnchor="middle"
                      x={(startX + endX) / 2}
                      y={midY - 6}
                    >
                      {entry.edgeLabel}
                    </text>
                  </g>
                );
              })}

              {layout.nodes.map((entry) => {
                const isSelected = entry.node.id === validSelectedId;
                const isActive = activePath.has(entry.node.id);
                return (
                  <foreignObject height={NODE_H} key={entry.node.id} width={NODE_W} x={entry.x} y={entry.y}>
                    <button
                      aria-pressed={isSelected}
                      className={[
                        styles.node,
                        entry.node.kind === 'action' ? styles.nodeAction : styles.nodeQuestion,
                        isActive ? styles.nodeActive : '',
                        isSelected ? styles.nodeSelected : '',
                      ].join(' ')}
                      type="button"
                      onClick={() => selectNode(entry.node.id)}
                    >
                      <span className={styles.nodeKind}>{entry.node.kind === 'action' ? 'Hành động' : 'Hỏi'}</span>
                      <span className={styles.nodeLabel}>{entry.node.label}</span>
                    </button>
                  </foreignObject>
                );
              })}
            </g>
          </svg>
          <p className={styles.mapHint}>Cuộn để zoom · kéo để di chuyển · bấm node để mở nhánh</p>
        </div>
      </div>
    </div>
  );
}

export type { DecisionNode };
