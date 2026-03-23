import { useState } from 'react';

type AskResponse = {
  answer: string;
  sources?: string[];
};

export function Ask() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">
          Ask the Zoning By-law
        </h1>
        <p className="text-slate-600 mb-8">
          Ask a natural language question about uploaded or ingested zoning documents.
        </p>

        <form onSubmit={handleAsk} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your question
          </label>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='e.g. "What are the zoning regions in Waterloo?"'
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium disabled:opacity-50"
            >
              {loading ? 'Asking...' : 'Ask'}
            </button>

            <button
              type="button"
              onClick={() => {
                setQuestion('');
                setResult(null);
                setError(null);
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700 font-medium"
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Answer</h2>
            <p className="text-slate-800 whitespace-pre-wrap">{result.answer}</p>

            {result.sources && result.sources.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Sources</h3>
                <ul className="space-y-2">
                  {result.sources.map((source, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700"
                    >
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-sm text-slate-500">
          Try: “What is the max height in R1?” or “What are the parking requirements in Waterloo R9?”
        </div>
      </div>
    </div>
  );
}