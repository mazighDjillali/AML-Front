import React, { useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedCircle from "./AnimatedCircle";

function parseBezierPath(path: string) {
  // Example path: "M10,20 C30,40 50,60 70,80"
  const match = path.match(
    /M\s*([\d.-]+),([\d.-]+)\s*C\s*([\d.-]+),([\d.-]+)\s*([\d.-]+),([\d.-]+)\s*([\d.-]+),([\d.-]+)/,
  );
  if (!match) {
    return null;
  }
  const [, x1, y1, cX1, cY1, cX2, cY2, x4, y4] = match.map(Number);
  return { x1, y1, cX1, cY1, cX2, cY2, x4, y4 };
}

function getRedToWhiteGradient(amount: number): string {
  const percent = Math.min(1, amount / 50000);
  const red = Math.round(255 * percent);
  const white = 255 - red;
  return `rgb(${red}, ${white}, ${white})`;
}

// Function to interpolate point along a cubic Bezier curve

function getPointAtT(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
) {
  const x =
    Math.pow(1 - t, 3) * x1 +
    3 * Math.pow(1 - t, 2) * t * x2 +
    3 * (1 - t) * Math.pow(t, 2) * x3 +
    Math.pow(t, 3) * x4;
  const y =
    Math.pow(1 - t, 3) * y1 +
    3 * Math.pow(1 - t, 2) * t * y2 +
    3 * (1 - t) * Math.pow(t, 2) * y3 +
    Math.pow(t, 3) * y4;
  return { x, y };
}

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const controlPoints = useMemo(() => parseBezierPath(edgePath), [edgePath]);
  const { x1, y1, cX1, cY1, cX2, cY2, x4, y4 } = controlPoints;

  const amount = data?.amount ?? 0;
  const strokeWidth = Math.max(1, Math.min(8, amount / 100_000));
  const strokeColor = getRedToWhiteGradient(amount);
  const fanDirection =
    (data?.fan_direction as "fan-out" | "fan-in" | undefined) ?? "fan-out";
  //console.log("Edge data: ", data);

  // // Control Point Calculation for Bezier
  // const curvature = 0.2;
  // const centerX = (sourceX + targetX) / 2;
  // const centerY = (sourceY + targetY) / 2;
  // const cX1 = sourceX + curvature * (targetX - sourceX);
  // const cY1 = sourceY;
  // const cX2 = targetX - curvature * (targetX - sourceX);
  // const cY2 = targetY;

  // Animation state
  const t = useMotionValue(0);

  const posX = useTransform(
    t,
    (v) => getPointAtT(v, x1, y1, cX1, cY1, cX2, cY2, x4, y4).x,
  );
  const posY = useTransform(
    t,
    (v) => getPointAtT(v, x1, y1, cX1, cY1, cX2, cY2, x4, y4).y,
  );

  useEffect(() => {
    const from = fanDirection === "fan-in" ? 1 : 0;
    const to = fanDirection === "fan-in" ? 0 : 1;
    //console.log("For: ", fanDirection, ": from, to: ", from, to);
    t.set(from);

    const controls = animate(t, to, {
      duration: Math.max(1.5, 8 - amount / 10000),
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
      repeatDelay: 0.2,
    });

    return () => controls.stop();
  }, [sourceX, sourceY, targetX, targetY, amount, fanDirection]);

  return (
    <>
      {/* The edge line itself */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          ...style,
        }}
        markerEnd={markerEnd}
      />

      {/* Moving animated circle */}
      {controlPoints && (
        <g key={`${id}-${fanDirection}-${amount}`}>
          <AnimatedCircle
            id={id}
            fanDirection={fanDirection}
            amount={amount}
            bezierPoints={controlPoints}
            strokeColor={strokeColor}
          />
        </g>
      )}

      {/* DZD label in the middle */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%)`,
            fontSize: "10px",
            padding: "2px 4px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            pointerEvents: "none",
            left: labelX,
            top: labelY,
          }}
        >
          {amount?.toLocaleString("en-US")} DZD
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
