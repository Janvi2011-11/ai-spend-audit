"use client";

export default function AISummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-emerald-400 text-sm font-medium">
          AI Summary
        </span>
      </div>
      <p className="text-gray-300 leading-relaxed">{summary}</p>
    </div>
  );
}