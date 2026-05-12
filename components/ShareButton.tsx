"use client";

import { useState } from "react";

export default function ShareButton({ auditId }: { auditId: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/audit/${auditId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-gray-900 border border-gray-700 hover:border-emerald-400 rounded-xl p-5 text-left transition-colors w-full"
    >
      <div className="text-2xl mb-2">{copied ? "✅" : "🔗"}</div>
      <div className="font-semibold text-white mb-1">
        {copied ? "Link copied!" : "Share this audit"}
      </div>
      <div className="text-sm text-gray-400">
        {copied ? "Send it to your team" : "Share a public link — email stripped"}
      </div>
    </button>
  );
}
