"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Loader2, Users, QrCode, BarChart3 } from "lucide-react";

interface ForecastData {
  hasData: boolean;
  historicalEventsCount: number;
  totalRegistrations: number;
  actualAttendance: number;
  showUpRate: number;
}

export default function EventForecast({ category }: { category: string }) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) {
      setData(null);
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/organization/forecast?category=${encodeURIComponent(category)}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Forecast fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [category]);

  if (!category) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-purple-400 text-xs p-3 animate-pulse">
        <Loader2 className="w-3 h-3 animate-spin" />
        Analyzing historical QR scan data for {category}...
      </div>
    );
  }

  if (data && !data.hasData) {
    return (
      <div className="mt-2 text-[11px] text-gray-500 italic px-1">
        No past events found for <b>{category}</b>. Your event will set the baseline for future forecasts!
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-[#8b5cf6]" />
        <span className="text-sm font-bold text-white tracking-tight">Intelligence Forecast</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-black/20 rounded-xl p-2.5 border border-white/5 text-center">
          <Users className="w-3 h-3 text-blue-400 mx-auto mb-1" />
          <p className="text-[9px] uppercase font-bold text-gray-500">Avg Reg</p>
          <p className="text-lg font-black text-white">
            {Math.round(data.totalRegistrations / data.historicalEventsCount)}
          </p>
        </div>

        <div className="bg-black/20 rounded-xl p-2.5 border border-white/5 text-center">
          <QrCode className="w-3 h-3 text-emerald-400 mx-auto mb-1" />
          <p className="text-[9px] uppercase font-bold text-gray-500">Avg Scans</p>
          <p className="text-lg font-black text-emerald-400">
            {Math.round(data.actualAttendance / data.historicalEventsCount)}
          </p>
        </div>

        <div className="bg-[#8b5cf6]/20 rounded-xl p-2.5 border border-[#8b5cf6]/30 text-center">
          <BarChart3 className="w-3 h-3 text-purple-400 mx-auto mb-1" />
          <p className="text-[9px] uppercase font-bold text-purple-300">Turnout</p>
          <p className="text-lg font-black text-purple-400">{data.showUpRate}%</p>
        </div>
      </div>
      
      <p className="mt-3 text-[10px] text-gray-500 text-center italic">
        *Based on {data.historicalEventsCount} verified past event(s)
      </p>
    </div>
  );
}