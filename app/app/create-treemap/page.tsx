"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

type CsvRow = Record<string, string>;

export default function TreemapPage() {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState("");
  const [treemapHtml, setTreemapHtml] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;

        if (!rows.length) return;

        const detectedHeaders = Object.keys(rows[0] || {});

        setHeaders(detectedHeaders);

        if (detectedHeaders.length > 0) {
          setGroupBy(detectedHeaders[0]);
        }
      },
    });
  }, [file]);

  async function generateTreemap() {
    if (!file || !groupBy) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("group_by", groupBy);

      const res = await fetch(
        `http://127.0.0.1:8000/api/create-treemap`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed request");
      }

      const data = await res.json();
      setTreemapHtml(data.html);
    } catch (err) {
      console.error(err);
      alert("Failed to generate treemap");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-600">
          🛰️ Try out Treemap
        </h1>

        <p className="mb-8 text-gray-600">
          Pie chart is conventionally not well-regarded for visually displaying ratios. 
          <a href="https://www.tableau.com/chart/what-is-treemap" className="text-blue-400">Tree map</a> is a great
          alternative to it. Upload a CSV, select a column, and generate a treemap via Flask + Plotly.
        </p>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            
            {/* File Upload */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Upload CSV
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="block w-full rounded-lg border p-2 text-gray-600"
              />
            </div>

            {/* Group By */}
            <div className="w-full md:w-64">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Group By
              </label>

              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full rounded-lg border p-2 text-gray-600"
              >
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Button */}
            <button
              onClick={generateTreemap}
              disabled={loading || !file || !groupBy}
              className="rounded-xl bg-black px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-50 text-gray-600"
            >
              {loading ? "Generating..." : "Generate Treemap"}
            </button>
          </div>
        </div>

        {/* Output */}
        {treemapHtml && (
          <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
            <iframe
              srcDoc={treemapHtml}
              className="h-[700px] w-full rounded-xl border"
            />
          </div>
        )}
      </div>
    </main>
  );
}