"use client";

import { useState } from "react";
import { useCompare } from "./hooks/useCompare";

import ResultsPanel from "./components/ResultsPanel";

export default function ComparePage() {
  const [state, setState] = useState({
    jobResponsibility: "",
    jobSkills: "",
    resumeExperience: "",
    resumeSkills: "",
  });

  const { compare, loading, result } = useCompare();

  const updateField = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT INPUT PANEL (inline, no extra component required) */}
        <div className="p-8 border-r bg-gray-50 flex flex-col">
          <h1 className="text-2xl font-bold mb-6 text-gray-700">
            👍 Compare Job Description with Resume
          </h1>

          <div className="space-y-6 overflow-y-auto flex-1 pr-2">

            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                📌 Job Responsibility
              </h2>
              <textarea
                value={state.jobResponsibility}
                onChange={(e) =>
                  updateField("jobResponsibility", e.target.value)
                }
                className="w-full h-28 p-3 border rounded-lg text-gray-700"
              />
            </div>

            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                🧠 Technical Skills
              </h2>
              <textarea
                value={state.jobSkills}
                onChange={(e) =>
                  updateField("jobSkills", e.target.value)
                }
                className="w-full h-28 p-3 border rounded-lg text-gray-700"
              />
            </div>

            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                🧾 Resume: Experience
              </h2>
              <textarea
                value={state.resumeExperience}
                onChange={(e) =>
                  updateField("resumeExperience", e.target.value)
                }
                className="w-full h-32 p-3 border rounded-lg text-gray-700"
              />
            </div>

            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                ⚖️ Resume: Technical Skills
              </h2>
              <textarea
                value={state.resumeSkills}
                onChange={(e) =>
                  updateField("resumeSkills", e.target.value)
                }
                className="w-full h-32 p-3 border rounded-lg text-gray-700"
              />
            </div>

          </div>

          <button
            onClick={() => compare(state)}
            disabled={loading}
            className="mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "⭐ Comparing..." : "⭐ Compare"}
          </button>
        </div>

        {/* RIGHT SIDE → ONLY RESULT PANEL */}
        <div className="p-8">
          <h2 className="text-xl text-gray-700 font-semibold mb-4">
            🔟 Results
          </h2>

          <ResultsPanel result={result} />
        </div>

      </div>
    </div>
  );
}