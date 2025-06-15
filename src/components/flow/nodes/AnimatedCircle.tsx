import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedCircleProps {
  id: string;
  fanDirection: "fan-in" | "fan-out";
  amount: number;
  bezierPoints: {
    x1: number;
    y1: number;
    cX1: number;
    cY1: number;
    cX2: number;
    cY2: number;
    x4: number;
    y4: number;
  };
  strokeColor: string;
}

const AnimatedCircle: React.FC<AnimatedCircleProps> = ({
  id,
  fanDirection,
  amount,
  bezierPoints,
  strokeColor,
}) => {
  const { x1, y1, cX1, cY1, cX2, cY2, x4, y4 } = bezierPoints;
  const t = useMotionValue(0);

  const getPointAtT = (t: number) => {
    const x =
      Math.pow(1 - t, 3) * x1 +
      3 * Math.pow(1 - t, 2) * t * cX1 +
      3 * (1 - t) * Math.pow(t, 2) * cX2 +
      Math.pow(t, 3) * x4;
    const y =
      Math.pow(1 - t, 3) * y1 +
      3 * Math.pow(1 - t, 2) * t * cY1 +
      3 * (1 - t) * Math.pow(t, 2) * cY2 +
      Math.pow(t, 3) * y4;
    return { x, y };
  };

  const posX = useTransform(t, (v) => getPointAtT(v).x);
  const posY = useTransform(t, (v) => getPointAtT(v).y);

  useEffect(() => {
    // The key insight: we need to determine the correct animation direction
    // based on which node is the "central" node in the fan pattern

    // For fan-out: central -> children (animate from central to child)
    // For fan-in: children -> central (animate from child to central)

    // Since Bezier coordinates are always source->target,
    // we need to check if source or target is the central node

    let from: number, to: number;

    if (fanDirection === "fan-out") {
      // Fan-out: central node distributes to children
      // Animation should go from source (central) to target (child)
      from = 0;
      to = 1;
    } else {
      // Fan-in: children nodes send to central
      // Animation should go from source (child) to target (central)
      from = 0;
      to = 1;
    }

    t.set(from);

    const controls = animate(t, to, {
      duration: Math.max(1.5, 8 - amount / 10000),
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
      repeatDelay: 0.2,
    });

    return () => controls.stop();
  }, [fanDirection, amount, t]);

  return (
    <motion.circle
      cx={posX}
      cy={posY}
      r={4}
      fill={strokeColor}
      stroke="black"
      strokeWidth={0.5}
      style={{
        pointerEvents: "none",
      }}
    />
  );
};

export default AnimatedCircle;
