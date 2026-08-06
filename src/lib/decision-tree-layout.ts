import type { DecisionBranch, DecisionNode, DecisionQuestion } from '@/content/decision-trees';

export const NODE_W = 208;
export const NODE_H = 76;
export const H_GAP = 36;
export const V_GAP = 96;
export const CANVAS_PAD = 48;

export type LaidOutNode = {
  node: DecisionNode;
  parentId: string | null;
  edgeLabel: string | null;
  edgeTone: DecisionBranch['tone'] | null;
  depth: number;
  x: number;
  y: number;
};

export type TreeLayout = {
  nodes: LaidOutNode[];
  byId: Map<string, LaidOutNode>;
  childrenOf: Map<string, string[]>;
  width: number;
  height: number;
};

/**
 * Tidy top-down layout: mỗi lá nhận một cột x kế tiếp, node cha đặt ở
 * trung điểm x của các con — đủ cho cây nhị phân nông (độ sâu 3) mà
 * không cần thuật toán Reingold-Tilford đầy đủ.
 */
export function layoutDecisionTree(root: DecisionQuestion): TreeLayout {
  const nodes: LaidOutNode[] = [];
  const byId = new Map<string, LaidOutNode>();
  const childrenOf = new Map<string, string[]>();
  let nextLeafSlot = 0;

  function visit(
    node: DecisionNode,
    depth: number,
    parentId: string | null,
    edgeLabel: string | null,
    edgeTone: DecisionBranch['tone'] | null,
  ): number {
    const entry: LaidOutNode = { node, parentId, edgeLabel, edgeTone, depth, x: 0, y: depth * (NODE_H + V_GAP) };

    if (node.kind === 'action' || node.branches.length === 0) {
      entry.x = nextLeafSlot * (NODE_W + H_GAP);
      nextLeafSlot += 1;
      nodes.push(entry);
      byId.set(node.id, entry);
      if (parentId) childrenOf.set(parentId, [...(childrenOf.get(parentId) ?? []), node.id]);
      return entry.x;
    }

    const childXs = node.branches.map((branch) => visit(branch.node, depth + 1, node.id, branch.edgeLabel, branch.tone));
    entry.x = childXs.length > 0 ? (Math.min(...childXs) + Math.max(...childXs)) / 2 : nextLeafSlot * (NODE_W + H_GAP);
    nodes.push(entry);
    byId.set(node.id, entry);
    if (parentId) childrenOf.set(parentId, [...(childrenOf.get(parentId) ?? []), node.id]);
    return entry.x;
  }

  visit(root, 0, null, null, null);

  const maxX = Math.max(...nodes.map((n) => n.x)) + NODE_W;
  const maxY = Math.max(...nodes.map((n) => n.y)) + NODE_H;

  return { nodes, byId, childrenOf, width: maxX, height: maxY };
}

export type BoundingBox = { minX: number; minY: number; maxX: number; maxY: number };

/** Bounding box của một node và toàn bộ hậu duệ, dùng để zoom-to-branch. */
export function subtreeBoundingBox(layout: TreeLayout, nodeId: string): BoundingBox {
  const stack = [nodeId];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  while (stack.length > 0) {
    const id = stack.pop()!;
    const entry = layout.byId.get(id);
    if (!entry) continue;
    minX = Math.min(minX, entry.x);
    minY = Math.min(minY, entry.y);
    maxX = Math.max(maxX, entry.x + NODE_W);
    maxY = Math.max(maxY, entry.y + NODE_H);
    for (const childId of layout.childrenOf.get(id) ?? []) stack.push(childId);
  }

  return { minX, minY, maxX, maxY };
}

/** Đường đi từ root đến node (bao gồm cả hai đầu), dùng để tô đậm nhánh đang chọn. */
export function pathToNode(layout: TreeLayout, nodeId: string): string[] {
  const path: string[] = [];
  let current: string | null = nodeId;
  while (current) {
    path.unshift(current);
    current = layout.byId.get(current)?.parentId ?? null;
  }
  return path;
}

export type Viewport = { tx: number; ty: number; scale: number };

const MAX_SCALE = 1.4;
const MIN_SCALE = 0.5;

/** Transform (translate + scale) để bbox vừa khít khung nhìn viewW×viewH, có padding. */
export function fitViewport(bbox: BoundingBox, viewW: number, viewH: number, padding = CANVAS_PAD): Viewport {
  const bboxW = Math.max(bbox.maxX - bbox.minX, 1);
  const bboxH = Math.max(bbox.maxY - bbox.minY, 1);
  const scaleX = (viewW - padding * 2) / bboxW;
  const scaleY = (viewH - padding * 2) / bboxH;
  const scale = Math.min(scaleX, scaleY, MAX_SCALE);
  const clampedScale = Math.max(scale, MIN_SCALE);
  const cx = (bbox.minX + bbox.maxX) / 2;
  const cy = (bbox.minY + bbox.maxY) / 2;
  const tx = viewW / 2 - cx * clampedScale;
  const ty = viewH / 2 - cy * clampedScale;
  return { tx, ty, scale: clampedScale };
}

/**
 * Giới hạn tx/ty của viewport để nội dung cây (contentW × contentH ở scale
 * hiện tại) luôn còn ít nhất `margin` px nằm trong khung nhìn viewW × viewH —
 * ngăn người dùng kéo/zoom trôi mất hẳn cây ra khỏi canvas. Khi cây đã nhỏ
 * hơn khung nhìn (zoom ra xa), không còn khoảng để "trôi" nên chỉ căn giữa.
 */
export function clampViewportToContent(
  viewport: Viewport,
  contentW: number,
  contentH: number,
  viewW: number,
  viewH: number,
  margin = 120,
): Viewport {
  const scaledW = contentW * viewport.scale;
  const scaledH = contentH * viewport.scale;

  function clampAxis(translate: number, scaledSize: number, viewSize: number): number {
    const minTranslate = viewSize - scaledSize - margin;
    const maxTranslate = margin;
    if (minTranslate > maxTranslate) return (viewSize - scaledSize) / 2;
    return Math.min(maxTranslate, Math.max(minTranslate, translate));
  }

  return {
    scale: viewport.scale,
    tx: clampAxis(viewport.tx, scaledW, viewW),
    ty: clampAxis(viewport.ty, scaledH, viewH),
  };
}
