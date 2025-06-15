import React, { useState } from "react";
export function Reportform() {
     const [reportType, setReportType] = useState("Suspicious Activity Report (SAR)");
      const [timePeriod, setTimePeriod] = useState("Last 7 days");
      const [riskLevel, setRiskLevel] = useState("All Risk Levels");
      const [sections, setSections] = useState<string[]>([
        "Executive Summary",
        "Geographic Analysis",
        "Entity Profiles",
        "Risk Metrics",
        "Transaction Details",
      ]);
      const [notes, setNotes] = useState("");
    
      const toggleSection = (section: string) => {
        setSections((prev) =>
          prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]
        );
      };
return (
<div className="p-6 w-full mx-auto bg-white shadow rounded-lg space-y-6">
          <h1 className="text-2xl font-semibold">Generate PDF Report</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report Type */}
            <div>
              <label className="block font-medium">Report Type</label>
              <select
                className="w-full mt-1 border rounded p-2"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>Suspicious Activity Report (SAR)</option>
              </select>
            </div>

            {/* Time Period */}
            <div>
              <label className="block font-medium">Time Period</label>
              <select
                className="w-full mt-1 border rounded p-2"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Custom</option>
              </select>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block font-medium">Risk Level</label>
              <select
                className="w-full mt-1 border rounded p-2"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <option>All Risk Levels</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div>
            <label className="block font-medium mb-2">Include Sections</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Executive Summary",
                "Geographic Analysis",
                "Entity Profiles",
                "Risk Metrics",
                "Transaction Details",
                "Recommendations",
              ].map((section) => (
                <label key={section} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sections.includes(section)}
                    onChange={() => toggleSection(section)}
                  />
                  <span>{section}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium">Additional Notes</label>
            <textarea
              className="w-full border rounded p-2 mt-1"
              rows={3}
              placeholder="Add any additional notes or context for this report..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Preview + Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="h-48 border rounded flex items-center justify-center text-gray-500">
              Configure report options to generate a preview
            </div>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">
                Generate PDF Report
              </button>
              <button className="w-full border border-gray-300 rounded py-2 hover:bg-gray-100">
                Preview Report
              </button>
            </div>
          </div>
        </div>
)}