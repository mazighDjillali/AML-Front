"use client";

import * as React from "react";
import { Pie, PieChart, Sector, Label } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 👇 Type pour chaque slice
type FraudDataItem = {
  type: string;
  count: number;
  fill: string;
};

const chartConfig: ChartConfig = {
  Smurfing: { label: "Smurfing", color: "var(--apcolor1)" },
  "Anomaly Detection": {
    label: "Anomaly Detection",
    color: "var(--apyelloww)",
  },
  "Geo Zone": { label: "Geo Zone", color: "var(--apcolor2)" },
  "Complicite interne": {
    label: "Complicite interne",
    color: "var(--apyelloww)",
  },
};

const gradients = {
  Smurfing: "url(#gradSmurfing)",
  "Anomaly Detection": "url(#gradAnomaly)",
  "Geo Zone": "url(#gradGeoZone)",
  "Complicite interne": "url(#Complicite)",
};

export function FraudPieChart() {
  const id = "fraud-pie";
  const [selectedChannel, setSelectedChannel] = React.useState("Baridimob");
  const [data, setData] = React.useState<FraudDataItem[]>([]);
  const [activeType, setActiveType] = React.useState("");

  // 👉 Fetch les données depuis l'API
  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/api/scenario-stats/") // 🔁 adapte l’URL selon ton backend
      .then((res) => res.json())
      .then((apiData) => {
        const transformed: Record<string, FraudDataItem[]> = {
          Baridimob: [
            {
              type: "Smurfing",
              count: apiData.advanced_fraud?.total_anomalies || 0,
              fill: gradients["Smurfing"],
            },
            {
              type: "Anomaly Detection",
              count: apiData.rule_based_anomaly?.total_anomalies || 0,
              fill: gradients["Anomaly Detection"],
            },
            {
              type: "Geo Zone",
              count: 0, // Pas de data geo pour Baridimob
              fill: gradients["Geo Zone"],
            },
            {
              type: "Complicite interne",
              count: 0, // Pas de data geo pour Baridimob
              fill: gradients["Complicite interne"],
            },
          ],
          Poste: [
            {
              type: "Geo Zone",
              count: apiData.geozone_risk?.total_anomalies || 0,
              fill: gradients["Geo Zone"],
            },
            {
              type: "Complicite interne",
              count: apiData.whackamole?.total_anomalies || 0, // Pas de data geo pour Baridimob
              fill: gradients["Complicite interne"],
            },
          ],
          Gab: [
            {
              type: "Smurfing",
              count: 0,
              fill: gradients["Smurfing"],
            },
            {
              type: "Anomaly Detection",
              count: 0,
              fill: gradients["Anomaly Detection"],
            },
            {
              type: "Geo Zone",
              count: 0,
              fill: gradients["Geo Zone"],
            },
          ],
        };

        setData(transformed[selectedChannel]);
        setActiveType(transformed[selectedChannel][0]?.type || "");
      })
      .catch((err) => console.error("API error:", err));
  }, [selectedChannel]);

  const activeIndex = data.findIndex((item) => item.type === activeType);

  return (
    <Card
      data-chart={id}
      className="bg-gradient-to-br from-blue-200 to-white shadow-md border border-yellow-300"
    >
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <div className="space-y-0">
          <CardTitle className="text-blue-700">Frauds per Type</CardTitle>
          <CardDescription className="text-yellow-600">
            Filter by channel
          </CardDescription>
        </div>

        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="h-7 w-[130px] rounded-lg pl-2.5 text-sm border border-yellow-300">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {["Baridimob", "Poste", "Gab"].map((key) => (
              <SelectItem
                key={key}
                value={key}
                className="rounded-lg [&_span]:flex"
              >
                <span className="text-xs">{key}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[294px]"
        >
          <PieChart>
            <defs>
              <radialGradient id="gradSmurfing" cx="50%" cy="50%" r="75%">
                <stop offset="0%" stopColor="var(--apcolor1)" stopOpacity="1" />
                <stop
                  offset="100%"
                  stopColor="var(--apcolor1)"
                  stopOpacity="0.4"
                />
              </radialGradient>
              <radialGradient id="gradAnomaly" cx="50%" cy="50%" r="75%">
                <stop
                  offset="0%"
                  stopColor="var(--apyelloww)"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="var(--apyelloww)"
                  stopOpacity="0.4"
                />
              </radialGradient>
              <radialGradient id="gradGeoZone" cx="50%" cy="50%" r="75%">
                <stop offset="0%" stopColor="var(--apcolor2)" stopOpacity="1" />
                <stop
                  offset="100%"
                  stopColor="var(--apcolor2)"
                  stopOpacity="0.4"
                />
              </radialGradient>
              <radialGradient id="Complicite" cx="50%" cy="50%" r="75%">
                <stop
                  offset="0%"
                  stopColor="var(--apyelloww)"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="var(--apyelloww)"
                  stopOpacity="0.4"
                />
              </radialGradient>
            </defs>

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onMouseEnter={(_, index) => setActiveType(data[index].type)}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }: any) => {
                  const cx = viewBox?.cx;
                  const cy = viewBox?.cy;
                  const entry = data[activeIndex >= 0 ? activeIndex : 0];
                  return cx && cy ? (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan className="fill-foreground text-3xl font-bold">
                        {entry.count}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        {entry.type}
                      </tspan>
                    </text>
                  ) : null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
