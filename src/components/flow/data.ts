import type { Edge, Node } from "@xyflow/react";

// export const fanInNodes: Node[] = [
//   {
//     id: "A",
//     type: "custom",
//     position: { x: 0, y: 0 },
//     data: { label: "Source A" },
//   },
//   {
//     id: "B",
//     type: "custom",
//     position: { x: 0, y: 150 },
//     data: { label: "Source B" },
//   },
//   {
//     id: "C",
//     type: "custom",
//     position: { x: 0, y: 300 },
//     data: { label: "Source C" },
//   },
//   {
//     id: "X",
//     type: "custom",
//     position: { x: 300, y: 150 },
//     data: { label: "Aggregator X" },
//   },
// ];

// export const fanInEdges: Edge[] = [
//   { id: "eA-X", source: "A", target: "X", type: "custom", amount: 100000 },
//   { id: "eB-X", source: "B", target: "X", type: "custom", amount: 50000 },
//   { id: "eC-X", source: "C", target: "X", type: "custom", amount: 75000 },
// ];

export const fanInNodes: Node[] = [
  {
    id: "central",
    type: "custom",
    position: { x: 500, y: 300 },
    data: {
      label: "Central",
      NodeBackendtype: "central",
      metadata: {
        balance: 1500000,
        total_received: 1000000,
        total_sent: 500000,
        last_operation_date: "2025-05-31T12:00:00+01:00",
      },
    },
  },
  // Fan-in nodes (pointing TO central)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `fanIn${i + 1}`,
    type: "custom",
    position: { x: 200, y: 100 + i * 100 },
    data: {
      label: `Sender ${i + 1}`,
      NodeBackendtype: "inbound",
      metadata: {
        balance: 100000,
        total_sent: 50000 + i * 10000,
        last_operation_date: "2025-05-30T10:00:00+01:00",
      },
    },
  })),
  // Fan-out nodes (receiving FROM central)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `fanOut${i + 1}`,
    type: "custom",
    position: { x: 800, y: 100 + i * 100 },
    data: {
      label: `Receiver ${i + 1}`,
      NodeBackendtype: "outbound",
      metadata: {
        balance: 50000 + i * 5000,
        total_received: 20000 + i * 8000,
        last_operation_date: "2025-05-30T14:00:00+01:00",
      },
    },
  })),
];

export const fanInEdges: Edge[] = [
  // Fan-in: edges from outer nodes to central
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `edge-in-${i + 1}`,
    source: `fanIn${i + 1}`,
    target: "central",
    type: "custom",
    data: {
      amount: 30000 + i * 10000,
      fan_direction: "fan-in",
    },
  })),
  // Fan-out: edges from central to outer nodes
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `edge-out-${i + 1}`,
    source: "central",
    target: `fanOut${i + 1}`,
    type: "custom",
    data: {
      amount: 25000 + i * 8000,
      fan_direction: "fan-out",
    },
  })),
];
