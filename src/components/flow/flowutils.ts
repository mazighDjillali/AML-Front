import { Node } from "@xyflow/react";

/**
 * Simple horizontal layout
 */
export function layoutHorizontally(nodes: Node[]): Node[] {
  return nodes.map((node, i) => ({
    ...node,
    position: { x: i * 250, y: 100 },
  }));
}
