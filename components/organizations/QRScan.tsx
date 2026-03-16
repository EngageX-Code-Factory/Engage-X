"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, CheckCircle, XCircle, Camera } from "lucide-react";

type ScanResult = { success: boolean; message: string; student?: string } | null;
const VALID_TOKENS = ["STU001-EVT001", "STU002-EVT001", "STU003-EVT001"];

export default function QRScan() {
  const [manualToken, setManualToken] = useState("");
  const [result, setResult] = useState<ScanResult>(null);
  const [scanning, setScanning] = useState(false);

  function validateToken(token: string) {
    setScanning(true);
    setTimeout(() => {
      if (VALID_TOKENS.includes(token.trim())) {
        setResult({ success: true, message: "Attendance marked successfully!", student: "Ashan Perera" });
      } else if (!token.trim()) {
        setResult({ success: false, message: "Please enter a token." });
      } else {
        setResult({ success: false, message: "Invalid or already used token." });
      }
      setScanning(false);
    }, 600);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/organization/attendance" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">QR Attendance</h2>
          <p className="text-sm mt-0.5 text-gray-500 dark:text-gray-400">Scan student QR codes to mark attendance</p>
        </div>
      </div>

      {/* Camera area */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Camera size={16} className="text-[#8b5cf6]" /> Camera Scanner
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-gray-50 dark:bg-white/5">
          <div className="w-48 h-48 rounded-2xl flex items-center justify-center mb-4 relative border-2 border-dashed border-gray-200 dark:border-white/20">
            <QrCode size={64} className="text-gray-300 dark:text-white/20" />
            {[["top-2 left-2 border-t-2 border-l-2 rounded-tl"], ["top-2 right-2 border-t-2 border-r-2 rounded-tr"], ["bottom-2 left-2 border-b-2 border-l-2 rounded-bl"], ["bottom-2 right-2 border-b-2 border-r-2 rounded-br"]].map(([cls], i) => (
              <div key={i} className={`absolute w-6 h-6 ${cls} border-[#8b5cf6]`} />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Camera scanner</p>
          <p className="text-xs mt-1 text-center text-gray-400 dark:text-gray-500">
            Install <code className="bg-gray-100 dark:bg-white/10 px-1 rounded text-[#8b5cf6]">react-qr-reader</code> to enable live scanning
          </p>
        </div>
      </div>

      {/* Manual entry */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <QrCode size={16} className="text-[#8b5cf6]" /> Manual Token Entry
        </h3>
        <form onSubmit={e => { e.preventDefault(); validateToken(manualToken); }} className="flex gap-3">
          <input value={manualToken} onChange={e => setManualToken(e.target.value)}
            placeholder="Enter QR token (e.g. STU001-EVT001)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition" />
          <button type="submit" disabled={scanning}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-60 transition-colors">
            {scanning ? "Checking..." : "Validate"}
          </button>
        </form>
        <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">
          Try: <code className="bg-gray-100 dark:bg-white/10 px-1 rounded text-[#8b5cf6]">STU001-EVT001</code> for a valid token
        </p>
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl p-6 border flex items-start gap-4 ${result.success ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20" : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"}`}>
          {result.success
            ? <CheckCircle size={28} className="text-green-600 dark:text-green-400 shrink-0" />
            : <XCircle size={28} className="text-red-600 dark:text-red-400 shrink-0" />
          }
          <div>
            <p className={`font-semibold text-base ${result.success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
              {result.success ? "Attendance Marked!" : "Validation Failed"}
            </p>
            <p className={`text-sm mt-0.5 ${result.success ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>{result.message}</p>
            {result.student && <p className="text-sm font-medium mt-2 text-green-700 dark:text-green-400">Student: {result.student}</p>}
            <button onClick={() => { setResult(null); setManualToken(""); }}
              className={`mt-3 text-xs font-semibold underline ${result.success ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              Scan next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}