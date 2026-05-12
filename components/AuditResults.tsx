"use client";

import { useState } from "react";
import EmailCapture from "@/components/EmailCapture";

interface Recommendation {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string;
  estimatedSavings: number;
  reason: string;
}

interface AuditData {
  ai_summary: string;
  total_monthly_savings: number;
  total_annual_savings: number;
  is_already_optimal: boolean;
  recommendations: Recommendation[];
}

export default function AuditResults({
  result,
  auditId,
}: {
  result: AuditData;
  auditId: string;
}) {
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const actionColors: Record<string, string> = {
    downgrade: "text-amber-400 bg-amber-400/10",
    switch: "text-blue-400 bg-blue-400/10",
    keep: "text-emerald-400 bg-emerald-400/10",
  };

  const toolNames: Record<string, string> = {
    cursor: "Cursor",
    github_copilot: "GitHub Copilot",
    claude: "Claude",
    chatgpt: "ChatGPT",
    anthropic_api: "Anthropic API",
    openai_api: "OpenAI API",
    gemini: "Gemini",
    windsurf: "Windsurf",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-400">SpendSmart AI</span>
          </div>
          <span className="text-sm text-gray-400">Your Audit Results</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          {result.is_already_optimal ? (
            <div>
              <div className="text-5xl mb-4"></div>
              <h1 className="text-4xl font-bold mb-4 text-emerald-400">
                You are spending well!
              </h1>
              <p className="text-gray-400 text-lg">
                Your current AI stack is already optimised for your team.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-2">You could be saving</p>
              <h1 className="text-6xl font-bold text-emerald-400 mb-2">
                ${result.total_monthly_savings.toFixed(0)}
                <span className="text-2xl text-gray-400">/month</span>
              </h1>
              <p className="text-xl text-gray-400">
                That is{" "}
                <span className="text-white font-bold">
                  ${result.total_annual_savings.toFixed(0)}/year
                </span>{" "}
                back in your pocket
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-emerald-400 font-medium mb-2">
            AI Summary
          </p>
          <p className="text-gray-300">{result.ai_summary}</p>
        </div>

        {result.total_monthly_savings > 500 && (
          <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-6 mb-8">
            <h3 className="text-emerald-400 font-bold text-lg mb-2">
              Save even more with Credex
            </h3>
            <p className="text-gray-300 mb-4">
              You are overspending by ${result.total_monthly_savings.toFixed(0)}/month.
              Credex sells discounted AI credits at lower prices.
            </p>
            
            <a 
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-400 text-gray-950 font-bold px-6 py-3 rounded-lg hover:bg-emerald-300 transition-colors"
            >
              Book a free Credex consultation
            </a>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Per-tool breakdown</h2>
        <div className="space-y-4 mb-10">
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {toolNames[rec.tool] || rec.tool}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {rec.currentPlan} plan · ${rec.currentSpend}/month
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    actionColors[rec.recommendedAction] || "text-gray-400 bg-gray-800"
                  }`}
                >
                  {rec.recommendedAction}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{rec.reason}</p>
              {rec.estimatedSavings > 0 && (
                <p className="text-emerald-400 font-bold">
                  Save ${rec.estimatedSavings.toFixed(0)}/month
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="flex-1 border border-gray-700 text-gray-300 font-medium px-6 py-3 rounded-lg hover:border-gray-500 transition-colors"
          >
            Share this audit
          </button>
          <button
            onClick={() => setShowEmailCapture(true)}
            className="flex-1 bg-emerald-400 text-gray-950 font-bold px-6 py-3 rounded-lg hover:bg-emerald-300 transition-colors"
          >
            Email me this report
          </button>
        </div>

        {showEmailCapture && (
  <EmailCapture 
    auditId={auditId}
    monthlySavings={result.total_monthly_savings}
    onClose={() => setShowEmailCapture(false)}
    onSuccess={() => {
      setShowEmailCapture(false);
      alert("✅ Report sent to your email!");
    }}
  />
)}
      </div>
    </div>
  );
}