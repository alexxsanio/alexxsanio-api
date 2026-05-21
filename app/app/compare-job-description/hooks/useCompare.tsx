import { useState } from "react";

export function useCompare() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const compare = async (payload: any) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://stingray-app-dne39.ondigitalocean.app/api/compare-job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return { compare, loading, result };
}