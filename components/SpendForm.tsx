"use client";

import { useState, useEffect } from "react";
import { AuditFormData, ToolEntry, AITool, UseCase } from "@/types";
import { useRouter } from "next/navigation";

const TOOLS = [
  { id: "cursor", name: "Cursor", plans: ["hobby", "pro", "business"] },
  { id: "github_copilot", name: "GitHub Copilot", plans: ["individual", "business", "enterprise"] },
  { id: "claude", name: "Claude", plans: ["free", "pro", "max", "team", "enterprise"] },
  { id: "chatgpt", name: "ChatGPT", plans: ["free", "plus", "team", "enterprise"] },
  { id: "anthropic_api", name: "Anthropic API", plans: ["payg"] },
  { id: "openai_api", name: "OpenAI API", plans: ["payg"] },
  { id: "gemini", name: "Gemini", plans: ["free", "pro", "enterprise"] },
  { id: "windsurf", name: "Windsurf", plans: ["free", "pro", "team"] },
];

const USE_CASES = ["coding", "writing", "data", "research", "mixed"];

const DEFAULT_TOOL: ToolEntry = {
  tool: "cursor",
  plan: "pro",
  monthlySpend: 0,
  seats: 1,
};

export default function SpendForm() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolEntry[]>([{ ...DEFAULT_TOOL }]);
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auditFormData");
    if (saved) {
      const parsed: AuditFormData = JSON.parse(saved);
      setTools(parsed.tools);
      setTeamSize(parsed.teamSize);
      setUseCase(parsed.useCase);
    }
  }, []);

  useEffect(() => {
    const data: AuditFormData = { tools, teamSize, useCase };
    localStorage.setItem("auditFormData", JSON.stringify(data));
  }, [tools, teamSize, useCase]);

  const addTool = () => setTools([...tools, { ...DEFAULT_TOOL }]);

  const removeTool = (index: number) => setTools(tools.filter((_, i) => i !== index));

  const updateTool = (index: number, field: keyof ToolEntry, value: string | number) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "tool") {
      const toolData = TOOLS.find((t) => t.id === value);
      updated[index].plan = toolData?.plans[0] || "pro";
    }
    setTools(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData: AuditFormData = { tools, teamSize, useCase };
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.id) router.push(`/audit/${data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-8 text-left border border-gray-800">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Team Size</label>
          <input
            type="number"
            min={1}
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Primary Use Case</label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value as UseCase)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
          >
            {USE_CASES.map((uc) => (
              <option key={uc} value={uc}>
                {uc.charAt(0).toUpperCase() + uc.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-white">Your AI Tools</h3>
        {tools.map((tool, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tool</label>
                <select
                  value={tool.tool}
                  onChange={(e) => updateTool(index, "tool", e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                >
                  {TOOLS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Plan</label>
                <select
                  value={tool.plan}
                  onChange={(e) => updateTool(index, "plan", e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                >
                  {TOOLS.find((t) => t.id === tool.tool)?.plans.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Monthly Spend ($)</label>
                <input
                  type="number"
                  min={0}
                  value={tool.monthlySpend}
                  onChange={(e) => updateTool(index, "monthlySpend", Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Number of Seats</label>
                <input
                  type="number"
                  min={1}
                  value={tool.seats}
                  onChange={(e) => updateTool(index, "seats", Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
            {tools.length > 1 && (
              <button onClick={() => removeTool(index)} className="mt-3 text-xs text-red-400 hover:text-red-300">
                Remove tool
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addTool}
        className="w-full border border-dashed border-gray-600 rounded-xl py-3 text-gray-400 hover:border-emerald-400 hover:text-emerald-400 transition-colors mb-6"
      >
        + Add another tool
      </button>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Analyzing your spend..." : "Get My Free Audit →"}
      </button>
    </div>
  );
}
