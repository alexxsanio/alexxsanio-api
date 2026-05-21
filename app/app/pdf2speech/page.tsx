"use client";

import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState(0);
  const [endPage, setEndPage] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!file) {
    alert("Please upload a PDF");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("start_page", String(startPage));

  if (endPage !== "") {
    formData.append("end_page", String(endPage));
  }

  try {
    const res = await fetch("https://alexxsanio-api-h7abb.ondigitalocean.app/api/compare-job-description", {
      method: "POST",
      body: formData,
    });

    // Handle backend errors
    if (!res.ok) {
      const text = await res.text();

      console.error(text);
      alert(text || "Failed to generate speech");

      return;
    }

    // Download audio
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "speech.wav";

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("Error generating audio");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        <h1 className="text-2xl font-semibold text-center text-gray-600 mb-6">
          PDF ➜ Speech
        </h1>

        {/* File upload */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload PDF
        </label>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm border border-gray-300 text-gray-600 rounded-lg p-2 cursor-pointer"
        />

        {/* Start page */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Start Page
          </label>

          <input
            type="number"
            value={startPage}
            onChange={(e) => setStartPage(Number(e.target.value))}
            className="mt-1 w-full border border-gray-300 text-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* End page */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            End Page (optional)
          </label>

          <input
            type="number"
            value={endPage}
            onChange={(e) =>
              setEndPage(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 w-full border border-gray-300 text-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full py-2 rounded-lg font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loading ? "Generating..." : "Convert to Speech"}
        </button>
      </div>
    </div>
  );
}