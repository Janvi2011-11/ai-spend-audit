"use client";

import { useState } from "react";

interface Props {
  auditId: string;
  monthlySavings: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmailCapture({ auditId, monthlySavings, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async () => {
    if (honeypot) return;
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, email, company, role }),
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Get your audit report</h2>
            <p className="text-sm text-gray-400">
              {monthlySavings > 0
                ? `We'll send your $${monthlySavings}/mo savings report to your inbox.`
                : "We'll notify you when new savings apply to your stack."}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        {/* Honeypot - hidden from real users */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Company (optional)</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Role (optional)</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Engineering Manager"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full mt-6 bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send my report →"}
        </button>

        <p className="text-xs text-gray-600 text-center mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
