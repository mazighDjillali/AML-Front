import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  useEdgesState,
  useNodesState,
  addEdge,
  type Connection,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MyCustomNode, { formatEdges } from "./nodes/CustomNodeComponent";
import { fanInNodes, fanInEdges } from "./data";
import { ScenarioStore } from "@/stores/scenario-store";
import CustomEdge from ".flow/nodes/CustomEdge";

const FlowCanvas: React.FC = () => {
  const { getEdges, getNodes, nodes: storeNodes } = ScenarioStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const loadedNodes = getNodes();
    const loadedEdges = getEdges();

    //console.log("Loaded nodes:", loadedNodes, ", Loaded edges", loadedEdges);

    if (loadedNodes.length === 0) {
      setNodes(fanInNodes);
      setEdges(fanInEdges);
    } else {
      setNodes(loadedNodes);
      setEdges(formatEdges(loadedEdges));
    }
  }, [getEdges, getNodes, setEdges, setNodes, storeNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ width: "100%", height: "50vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{ custom: MyCustomNode }}
        edgeTypes={{ custom: CustomEdge }}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>

      <div className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded">
        Total nodes: {nodes.length}
      </div>
    </div>
  );
};

export default FlowCanvas;