import { useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type ReactFlowInstance,
  Handle,
  Position,
} from "@xyflow/react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ScenarioStore } from "@/stores/scenario-store";

type CustomNodeProps = {
  data: {
    label: string;
    type: "custom";
    NodeBackendtype: "central" | "child";
    metadata?: Record<string, any>;
  };
};

const CustomNode = ({ data }: CustomNodeProps) => {
  //console.log("ID: ", data.label, ". Type: ", data.type);
  const bgColor = data.NodeBackendtype === "central" ? "goldenrod" : "teal";

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #777",
        borderRadius: 5,
        backgroundColor: "red",
        position: "relative",
        maxWidth: 200,
      }}
      title={
        data.metadata
          ? Object.entries(data.metadata)
              .map(([key, val]) => `${key}: ${val}`)
              .join("\n")
          : ""
      }
    >
      <Handle type="target" position={Position.Top} />
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Optional: Hover card for edges
const edgeLabelStyle = {
  pointerEvents: "all",
  padding: "4px 8px",
  background: "white",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 12,
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export function NodeGraph() {
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    ScenarioStore();

  //console.log("Nodes after processing: ", nodes);
  //console.log("Edges after processing: ", edges);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
