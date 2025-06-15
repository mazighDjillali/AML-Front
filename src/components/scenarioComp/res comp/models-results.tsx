import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

        // ✅ Log the full parsing result
        //console.log("Parsed CSV result:", result);

        const parsedData = result.data as any[];

        const cleaned: PredictionRow[] = parsedData
          .map((row, i) => ({
            index: i,
            true: Number(row.true_label),
            predicted: Number(row.prediction),
          }))
          .filter((row) => row.true === 1 && !isNaN(row.predicted)) // 👈 Only frauds
          .slice(0, 1000); // 👈 Limit to 500 for performance

        setData(cleaned);
      });
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-semibold">📊 Résultats du Modèle</h2>

      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 text-center">
            <p className="text-sm text-blue-700">Test Accuracy</p>
            <p className="text-xl font-semibold text-yellow-400">
              {metrics.accuracy.toFixed(4)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 text-center">
            <p className="text-sm text-blue-700">Test AUC</p>
            <p className="text-xl font-semibold text-yellow-400">
              {metrics.auc.toFixed(4)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 text-center">
            <p className="text-sm text-blue-700">Average Precision</p>
            <p className="text-xl font-semibold text-yellow-400">
              {metrics.average_precision.toFixed(4)}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-lg font-medium mb-2">
          🎯 Prédictions Réelles vs Prédites
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="true" stroke="#e0a800" name="Réel" />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#005fad"
              name="Prédit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <img src="/results/confusion_matrix.png" alt="Matrice de confusion" />
        <img src="/results/ROC_AUC_Curve.png" alt="Courbe ROC" />
        <img src="/results/Precision_Recall_Curve.png" alt="Courbe Precision" />
        <img src="/results/FP_VN.png" alt="FP VN" />
      </div>
    </div>
  );
};
