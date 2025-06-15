"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  high: {
    label: "Haut Risque",
    color: "var(--apred)",
  },
  medium: {
    label: "Risque Moyen",
    color: "var(--apyellow)",
  },
  low: {
    label: "Faible Risque",
    color: "var(--apgreen)",
  },
} satisfies ChartConfig;

type RiskItem = {
  risk: string;
  value: number;
  key: "low" | "medium" | "high";
};

export function FraudByRiskChart() {
  const [fraudData, setFraudData] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFraudData() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/anomaly-detection/",
        ); // 🔁 adapter l’URL si besoin
        const data = await response.json();

        const formatted: RiskItem[] = [
          { risk: "Faible", value: data.Low || 0, key: "low" },
          { risk: "Moyen", value: data.Moderate || 0, key: "medium" },
          { risk: "Haut", value: data.High || 0, key: "high" },
        ];

        setFraudData(formatted);
      } catch (error) {
        console.error("Erreur de chargement des données", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFraudData();
  }, []);

  return (
    <Card className="h-[405px] overflow-hidden  shadow-md border border-yellow-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Fraud per risk types</CardTitle>
            <CardDescription>Global Data</CardDescription>
          </div>
          <div className="flex gap-3 items-center text-xs mt-1">
            <div className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "var(--apred)" }}
              ></span>
              <span style={{ color: "var(--apred)" }}>Haut</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "var(--apyellow)" }}
              ></span>
              <span style={{ color: "var(--apyellow)" }}>Moyen</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "var(--apcolor1)" }}
              ></span>
              <span style={{ color: "var(--apcolor1)" }}>Faible</span>
            </div>
            <ShieldAlert
              style={{ color: "var(--apred)" }}
              className="h-5 w-5 ml-2"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground pt-10">
            Chargement...
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={fraudData} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="gradientHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--apred)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--apred)"
                    stopOpacity={0.4}
                  />
                </linearGradient>
                <linearGradient id="gradientMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--apyellow)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--apyellow)"
                    stopOpacity={0.4}
                  />
                </linearGradient>
                <linearGradient id="gradientLow" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--apcolor1)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--apcolor1)"
                    stopOpacity={0.4}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="risk"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) => `Risque ${value}`}
                  />
                }
              />

              <Bar
                dataKey={(entry: RiskItem) =>
                  entry.key === "high" ? entry.value : 0
                }
                fill="url(#gradientHigh)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey={(entry: RiskItem) =>
                  entry.key === "medium" ? entry.value : 0
                }
                fill="url(#gradientMedium)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey={(entry: RiskItem) =>
                  entry.key === "low" ? entry.value : 0
                }
                fill="url(#gradientLow)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div
          style={{ color: "var(--apred)" }}
          className="font-medium flex gap-1"
        >
          +13% de fraudes à haut risque détectées
        </div>
        <div className="text-muted-foreground">
          Statistiques consolidées par niveau de risque
        </div>
      </CardFooter>
    </Card>
  );
}
