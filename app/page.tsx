import SpendForm from "@/components/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-400">⚡</span>
            <span className="text-xl font-bold">SpendSmart AI</span>
          </div>
          <span className="text-sm text-gray-400">Free AI Spend Audit</span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-block bg-emerald-400/10 text-emerald-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
          Free • No login required • Takes 2 minutes
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Are you overpaying for
          <span className="text-emerald-400"> AI tools?</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Enter your current AI subscriptions and get an instant audit showing
          exactly where you're wasting money and how to fix it.
        </p>

        {/* Form */}
        <SpendForm />
      </div>
    </main>
  );
}