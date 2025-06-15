import dagre from "dagre";
import type { Node, Edge } from "reactflow";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 60;

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction = "LR",
) {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x, y },
      // You might want to set this if you're using drag-and-drop:
      positionAbsolute: { x, y },
      sourcePosition: "right",
      targetPosition: "left",
    };
  });

  return { nodes: layoutedNodes, edges };
}
