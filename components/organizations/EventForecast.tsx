"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Loader2 } from "lucide-react";

export default function EventForecast({ category }: { category: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) return;
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/organization/forecast?category=${encodeURIComponent(category)}`);
        setData(await res.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchForecast();
  }, [category]);

  if (!category || loading) return loading ? <p className="text-xs text-gray-500 flex items-center gap-2 mt-2"><Loader2 size={12} className="animate-spin text-[#8b5cf6]"/> Analyzing QR data...</p> : null;
  if (!data?.hasData) return <p className="text-xs mt-2 text-gray-500 italic">No past data for this category yet.</p>;

  return (
    <div className="mt-3 p-4 rounded-xl bg-purple-50 border border-purple-100 dark:bg-[#8b5cf6]/10 dark:border-[#8b5cf6]/20">
      <div className="flex items-start gap-3">
        <TrendingUp size={18} className="mt-0.5 shrink-0 text-[#8b5cf6]" />
        <div className="w-full">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Forecast: {category}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center bg-black/5 dark:bg-black/20 p-2 rounded-lg">
              <span className="block text-[9px] uppercase font-bold text-gray-500">Avg Reg</span>
              <span className="text-lg font-black text-white">{Math.round(data.totalRegistrations / data.historicalEventsCount)}</span>
            </div>
            <div className="text-center bg-black/5 dark:bg-black/20 p-2 rounded-lg">
              <span className="block text-[9px] uppercase font-bold text-gray-500">Avg QR</span>
              <span className="text-lg font-black text-emerald-400">{Math.round(data.actualAttendance / data.historicalEventsCount)}</span>
            </div>
            <div className="text-center bg-[#8b5cf6]/20 p-2 rounded-lg">
              <span className="block text-[9px] uppercase font-bold text-purple-400">Rate</span>
              <span className="text-lg font-black text-purple-400">{data.showUpRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}