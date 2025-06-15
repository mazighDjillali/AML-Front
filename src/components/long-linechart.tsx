"use client";

import * as React from "react";
import { AreaChart, Area } from "recharts";
import { CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 🔧 Définition d'un type avec color optionnel
type ChartConfigItem = {
  label: string;
  color?: string;
};

// 🔧 Typage explicite du chartConfig
const chartConfig: Record<string, ChartConfigItem> = {
  views: { label: "Transactions" },
  Baridimob: { label: "Baridimob", color: "hsl(var(--apcolor1))" },
  Poste: { label: "Poste", color: "hsl(var(--apyellow))" },
  Gab: { label: "Gab", color: "hsl(var(--apgray))" },
};

export   function LongLineChart() {
  const transactionTypes = ["Baridimob", "Poste", "Gab"] as const;
  const [activeChart, setActiveChart] =
    React.useState<(typeof transactionTypes)[number]>("Baridimob");

  const [data, setData] = React.useState<
    { date: string; Baridimob: number; Poste: number; Gab: number }[]
  >([]);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/api/transactions/operation_code_count/")
      .then((res) => res.json())
      .then((apiData) => {
        const transformed = Object.entries(apiData).map(
          ([date, values]: [string, any]) => ({
            date,
            Baridimob: values.MOB ?? 0,
            Poste: values.VIR ?? 0, // <-- VIR devient la source pour Poste
            Gab: 0, // <-- Gab reste vide
          }),
        );
        setData(transformed);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des données", err);
      });
  }, []);

  const total = React.useMemo(() => {
    return {
      Baridimob: data.reduce((acc, curr) => acc + curr.Baridimob, 0),
      Poste: data.reduce((acc, curr) => acc + curr.Poste, 0),
      Gab: data.reduce((acc, curr) => acc + curr.Gab, 0),
    };
  }, [data]);

  return (
    <Card className=" shadow-md border border-yellow-300">
      <CardHeader className="flex flex-col items-stretch space-y-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-2 py-5 sm:py-1 w-fit">
          <CardTitle className="text-base sm:text-sm">
            Transactions (données dynamiques)
          </CardTitle>
          <CardDescription className="text-base sm:text-xs">
            Affiche les transactions quotidiennes selon le canal
          </CardDescription>
        </div>
        <div className="flex items-center px-4 sm:px-6 h-10">
          <select
            className="text-sm border border-yellow-300 rounded-md p-1 h-9"
            value={activeChart}
            onChange={(e) =>
              setActiveChart(e.target.value as typeof activeChart)
            }
          >
            {transactionTypes.map((key) => (
              <option key={key} value={key}>
                {chartConfig[key].label} – {total[key].toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="px-1 py-1 sm:p-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[258px] w-full"
        >
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient
                id="gradientBaridimob"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="var(--apcolor1)" stopOpacity={1} />
                <stop
                  offset="95%"
                  stopColor="var(--apcolor1)"
                  stopOpacity={0.5}
                />
              </linearGradient>
              <linearGradient id="gradientPoste" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--apyellow)" stopOpacity={1} />
                <stop
                  offset="95%"
                  stopColor="var(--apyellow)"
                  stopOpacity={0.5}
                />
              </linearGradient>
              <linearGradient id="gradientGab" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--apcolor2)" stopOpacity={1} />
                <stop
                  offset="95%"
                  stopColor="var(--apcolor2)"
                  stopOpacity={0.5}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[250px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey={activeChart}
              stroke={chartConfig[activeChart].color!}
              fill={`url(#gradient${activeChart})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
