import { useState } from "react";
import HighlightBlock from "./HighlightBlock";

type Props = {
  result: any;
};

function InfoTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-block ml-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Icon */}
      <button
        type="button"
        className="text-gray-500 hover:text-gray-700"
      >
        ⓘ
      </button>

      {/* Tooltip */}
      {open && (
        <div className="absolute z-10 w-80 p-3 text-xs text-gray-600 bg-white border rounded-lg shadow-lg top-6 left-0">
          The matching score is computed by converting each sentence into a numerical representation
          using the{" "}
          <a
            href="https://github.com/epfml/sent2vec"
            target="_blank"
            className="text-blue-400 underline"
          >
            sent2vec
          </a>{" "}
          model, which uses{" "}
          <a
            href="https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1174/reports/2761021.pdf"
            target="_blank"
            className="text-blue-400 underline"
          >
            n-grams
          </a>{" "}
          to embed sentences into the representation. We then compute cosine distance between centroid
          vectors of job responsibilities and resume experience, which eseentially measures how similar 
          the two "point clouds" of sentence representations are.
        </div>
      )}
    </div>
  );
}

export default function ResultsPanel({ result }: Props) {
  if (!result) {
    return (
      <p className="text-gray-500">
        Results will appear here after comparison.
      </p>
    );
  }

  return (
    <div className="space-y-6">

      {/* SCORE */}
      <div className="p-4 bg-green-50 border rounded-lg">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-600">
            📊 Responsibility Match Score
          </h3>

          <InfoTooltip />
        </div>

        <p className="text-3xl font-bold text-green-600 mt-2">
          {result.responsibilityScore}%
        </p>
      </div>

      {/* STACKED HIGHLIGHTS */}
      <div className="space-y-4">
        <HighlightBlock
          title="📄 Job Description (highlighted)"
          html={result.highlightedJob}
        />

        <HighlightBlock
          title="🧾 Resume (highlighted)"
          html={result.highlightedResume}
        />
      </div>

      {/* MISSING KEYWORDS */}
      <div className="p-4 border rounded-lg bg-red-50">
        <h3 className="font-semibold mb-2 text-red-600">
          ❗ Missing Keywords (in JD but not Resume)
        </h3>

        {result.missingKeywords.length === 0 ? (
          <p className="text-green-600">✅ None — good match!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map((kw: string, i: number) => (
              <span
                key={i}
                className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}