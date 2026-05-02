"use client";

import { useState } from "react";

export default function ComparePage() {
  const [jobResponsibility, setJobResponsibility] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [resumeExperience, setResumeExperience] = useState("");
  const [resumeSkills, setResumeSkills] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCompare = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/compare-job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobResponsibility,
          jobSkills,
          resumeExperience,
          resumeSkills,
        }),
      });

      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PAGE (INPUTS) */}
        <div className="p-8 border-r bg-gray-50 flex flex-col">
          
          <h1 className="text-2xl font-bold mb-6 text-gray-700">
            👍 Compare Software Engineer Job Description with Resume
          </h1>

          {/* Scrollable block container */}
          <div className="space-y-6 overflow-y-auto flex-1 pr-2">

            {/* 1 */}
            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                📌 Job Responsibility
              </h2>
              <textarea
                value={jobResponsibility}
                onChange={(e) => setJobResponsibility(e.target.value)}
                className="w-full h-28 p-3 border rounded-lg"
              />
            </div>

            {/* 2 */}
            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                🧠 Technical Skills
              </h2>
              <textarea
                value={jobSkills}
                onChange={(e) => setJobSkills(e.target.value)}
                className="w-full h-28 p-3 border rounded-lg"
              />
            </div>

            {/* 3 */}
            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                🧾 Resume: Experience
              </h2>
              <textarea
                value={resumeExperience}
                onChange={(e) => setResumeExperience(e.target.value)}
                className="w-full h-32 p-3 border rounded-lg"
              />
            </div>

            {/* 4 */}
            <div>
              <h2 className="font-semibold mb-1 text-gray-700">
                ⚖️ Resume: Technical Skills
              </h2>
              <textarea
                value={resumeSkills}
                onChange={(e) => setResumeSkills(e.target.value)}
                className="w-full h-32 p-3 border rounded-lg"
              />
            </div>

          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "⭐ Comparing..." : "⭐ Compare"}
          </button>
        </div>

        {/* RIGHT PAGE (RESULTS) */}
        <div className="p-8">
          <h2 className="text-xl text-gray-700 font-semibold mb-4">🔟 Results</h2>

          {!result && (
            <p className="text-gray-500">
              Results will appear here after comparison.
            </p>
          )}

          {result && (
            <div className="space-y-6">

              <div className="p-4 bg-green-50 border rounded-lg">
                <h3 className="font-semibold mb-2">
                  📊 Responsibility Match Score
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {result.responsibilityScore}%
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  🟢 Technical Skills Match
                </h3>
                <div
                  className="p-4 border rounded-lg prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: result.highlightedJobSkills,
                  }}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Resume Keyword Highlights
                </h3>
                <div
                  className="p-4 border rounded-lg prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: result.highlightedResume,
                  }}
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}