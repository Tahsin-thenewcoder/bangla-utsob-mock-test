
"use client";

import { useEffect, useState } from "react";

type Question = {
  id: number | string;
  question: string;
  options: string[];
  marks: number;
};

type Props = {
  className: string;
};

const API_URL =
  "https://script.google.com/macros/s/AKfycbxn5dL8cgN6ITClAoj0Irvrb0AdvLrT9_yHetYEg4U9cxxIU9Bwxgox6VLGy_ZQh0p6/exec";

const classLabels: Record<string, string> = {
  "6": "ষষ্ঠ শ্রেণি",
  "7": "সপ্তম শ্রেণি",
  "8": "অষ্টম শ্রেণি",
  "9-10": "নবম-দশম শ্রেণি",
};

const sheetNames: Record<string, string> = {
  "6": "Class_6",
  "7": "Class_7",
  "8": "Class_8",
  "9-10": "Class_9_10",
};

export default function ExamClient({ className }: Props) {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sheetName = sheetNames[className];
  const classTitle = classLabels[className] || "মডেল টেস্ট";

  useEffect(() => {
    if (!started || !sheetName) return;

    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}?class=${encodeURIComponent(sheetName)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("প্রশ্ন লোড করা যায়নি।");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.questions)) {
          throw new Error("প্রশ্ন পাওয়া যায়নি।");
        }

        if (!cancelled) {
          setQuestions(data.questions);
          setCurrent(0);
          setAnswers({});
        }
      } catch {
        if (!cancelled) {
          setError(
            "প্রশ্ন লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করো।"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [started, sheetName]);

  function startExam() {
    if (!name.trim() || !school.trim()) {
      setError("নাম ও বিদ্যালয়ের নাম পূরণ করো।");
      return;
    }

    setError("");
    setStarted(true);
  }

  function selectAnswer(index: number) {
    const question = questions[current];
    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [String(question.id)]: index,
    }));
  }

  const question = questions[current];
  const answeredCount = Object.keys(answers).length;

  if (!sheetName) {
    return (
      <main className="min-h-screen p-8 text-center">
        <h1 className="text-2xl font-bold">
          এই শ্রেণির পরীক্ষা পাওয়া যায়নি।
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <p className="font-semibold text-emerald-700">
            সূচনা ছাত্র সংগঠন
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            বাংলা উৎসব | মডেল টেস্ট
          </h1>

          <p className="mt-2 text-slate-500">
            {classTitle}
          </p>
        </header>

        {!started ? (
          <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold">
              পরীক্ষার্থীর তথ্য
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              পরীক্ষা শুরু করার আগে তথ্য পূরণ করো।
            </p>

            <label className="mb-2 block font-medium">
              তোমার নাম
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="সম্পূর্ণ নাম লিখো"
              className="mb-5 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-emerald-600"
            />

            <label className="mb-2 block font-medium">
              বিদ্যালয়ের নাম
            </label>

            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="বিদ্যালয়ের নাম লিখো"
              className="mb-5 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-emerald-600"
            />

            {error && (
              <p className="mb-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={startExam}
              className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              পরীক্ষা শুরু করো
            </button>
          </section>
        ) : loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            প্রশ্ন লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setStarted(false)}
              className="mt-4 text-emerald-700 underline"
            >
              আবার চেষ্টা করো
            </button>
          </div>
        ) : !question ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            এই শ্রেণিতে এখনো কোনো প্রশ্ন যোগ করা হয়নি।
          </div>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">
                  পরীক্ষার্থী: {name}
                </p>
                <p className="text-sm text-slate-500">
                  বিদ্যালয়: {school}
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                উত্তর দিয়েছ: {answeredCount}/{questions.length}
              </span>
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-emerald-600 transition-all"
                style={{
                  width: `${(answeredCount / questions.length) * 100}%`,
                }}
              />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold text-emerald-700">
                প্রশ্ন {current + 1} / {questions.length}
              </span>
              <span className="text-sm text-slate-500">
                নম্বর: {question.marks}
              </span>
            </div>

            <h2 className="mb-6 text-xl font-semibold leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const selected =
                  answers[String(question.id)] === index;

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-semibold">
                      {["ক", "খ", "গ", "ঘ"][index]}
                    </span>

                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between gap-3">
              <button
                disabled={current === 0}
                onClick={() => setCurrent((c) => c - 1)}
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium disabled:opacity-40"
              >
                পূর্ববর্তী
              </button>

              <button
                disabled={current === questions.length - 1}
                onClick={() => setCurrent((c) => c + 1)}
                className="rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white disabled:opacity-40"
              >
                পরবর্তী
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {questions.map((q, index) => (
                <button
                  key={String(q.id)}
                  onClick={() => setCurrent(index)}
                  className={`h-10 w-10 rounded-lg border text-sm font-semibold ${
                    current === index
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : answers[String(q.id)] !== undefined
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              পরীক্ষার ফলাফল জমা দেওয়ার সুবিধা শিগগিরই যুক্ত হবে।
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

