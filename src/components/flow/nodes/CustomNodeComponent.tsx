import React from "react";
import { Handle, Position, type Edge, type NodeProps } from "@xyflow/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CustomEdge = {
  id: string;
  source: string;
  target: string;
  type: "custom";
  data: {
    amount: number;
  };
};

export function formatEdges(rawEdges: Edge[]): CustomEdge[] {
  return rawEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "custom",
    data: {
      ...edge.data,
      amount: edge.amount,
    },
  }));
}

const MyCustomNode: React.FC<NodeProps> = ({ data }) => {
  const { label, metadata, NodeBackendtype } = data;

  const cent_2 = "/images/criminal_2.png";
  const centralImage = "/images/criminal_3.png";
  const otherImage = "/images/associate_3.png";
  const imageSrc = NodeBackendtype === "central" ? centralImage : otherImage;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="relative cursor-pointer group">
          {/* Handles for connections */}
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />

          {/* Avatar */}
          <Avatar className="h-10 w-10 border border-gray-300 shadow-sm group-hover:shadow-md transition-shadow">
            <AvatarImage src={imageSrc} alt={label} />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {label?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="text-xs max-w-xs bg-gray-50 border border-gray-200 shadow-md p-4 rounded-lg">
        <div className="font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">
          Metadata
        </div>
        {metadata && Object.keys(metadata).length > 0 ? (
          <ul className="space-y-1 text-gray-700">
            {Object.entries(metadata).map(([key, value]) => {
              let label = null;
              let unit = null;
              let val = null;
              switch (key) {
                case "balance": {
                  label = "Balance";
                  unit = "DZD";
                  val = String(value).split(".")[0];
                  break;
                }
                case "total_received": {
                  label = "Total received";
                  unit = "DZD";
                  val = String(value).split(".")[0];

                  break;
                }
                case "total_sent": {
                  label = "Total sent";
                  unit = "DZD";
                  val = String(value).split(".")[0];

                  break;
                }
                case "last_operation_date": {
                  label = "Last active";
                  const temp = String(value).split("T");
                  val = temp[0] + " - " + temp[1].split("+")[0];

                  //console.log("date val: ", temp, val, value);
                  break;
                }
              }

              return (
                <li key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium">
                    {String(val)} {unit}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No metadata available</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default MyCustomNode;
