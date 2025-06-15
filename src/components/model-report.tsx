import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PredictionRow {
  index: number;
  true: number;
  predicted: number;
}

interface Metrics {
  accuracy: number;
  auc: number;
  average_precision: number;
}

export const ModelResults: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [data, setData] = useState<PredictionRow[]>([]);

  useEffect(() => {
    fetch("/results/metrics.json")
      .then((res) => res.json())
      .then(setMetrics)
      .catch(console.error);

    fetch("/results/predictions.csv")
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse(text, { header: true });
        const parsedData = result.data as any[];

        const cleaned: PredictionRow[] = parsedData
          .map((row, i) => ({
            index: i,
            true: Number(row.true_label),
            predicted: Number(row.prediction),
          }))
          .filter((row) => !isNaN(row.predicted))
          .slice(0, 1000);

        setData(cleaned);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Résultats du Modèle</h2>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Test Accuracy", value: metrics.accuracy },
            { label: "Test AUC", value: metrics.auc },
            { label: "Average Precision", value: metrics.average_precision },
          ].map((metric) => (
            <div
              key={metric.label}
              className="bg-white rounded-xl shadow-sm p-4 border text-center"
            >
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-2xl font-bold text-indigo-600">
                {metric.value.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Prédictions Réelles vs Prédites
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="index" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="true"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              name="Réel"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Prédit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { src: "/results/confusion_matrix.png", alt: "Matrice de confusion" },
          { src: "/results/ROC_AUC_Curve.png", alt: "Courbe ROC" },
          { src: "/results/Precision_Recall_Curve.png", alt: "Courbe Precision" },
          { src: "/results/FP_VN.png", alt: "Répartition des prédictions" },
        ].map((img) => (
          <div
            key={img.alt}
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
          >
            <img src={img.src} alt={img.alt} className="w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};
