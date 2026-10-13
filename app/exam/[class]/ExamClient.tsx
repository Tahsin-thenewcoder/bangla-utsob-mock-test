"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Question = { id: string | number; question: string; options: string[]; marks: number };
type Review = Question & { selectedIndex: number; correctIndex: number; explanation: string };
type Result = { score: number; total: number; correct: number; wrong: number; unanswered: number; attempt: number; leaderboardEligible: boolean; review: Review[] };
type Session = { token: string; startedAt: number | string; expiresAt: number | string; questions: Question[]; name: string; school: string };
type Props = { className: string };

const labels: Record<string, string> = { "6": "ষষ্ঠ শ্রেণি", "7": "সপ্তম শ্রেণি", "8": "অষ্টম শ্রেণি", "9-10": "নবম-দশম শ্রেণি" };
const sheets: Record<string, string> = { "6": "Class_6", "7": "Class_7", "8": "Class_8", "9-10": "Class_9_10" };
const letters = ["ক", "খ", "গ", "ঘ"];

// Apps Script may return Unix milliseconds, Unix seconds, or ISO strings.
function toMilliseconds(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" || (typeof value === "string" && /^\d+(?:\.\d+)?$/.test(value.trim()))) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n < 1e11 ? n * 1000 : n;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function deadlineFor(session: Session): number | null {
  const explicit = toMilliseconds(session.expiresAt);
  if (explicit !== null) return explicit;
  const start = toMilliseconds(session.startedAt);
  return start === null ? null : start + session.questions.length * 60_000;
}


async function api(payload: Record<string, unknown>) {
  const response = await fetch("/api/exam", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "অনুরোধ সম্পন্ন হয়নি।");
  return data;
}

export default function ExamClient({ className }: Props) {
  const sheetName = sheets[className];
  const storageKey = `bangla-utsob-exam-v2-${className}`;
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const submitLock = useRef(false);
  const answersRef = useRef(answers);
  const sessionRef = useRef(session);
  const resultRef = useRef(result);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { resultRef.current = result; }, [result]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.session?.token && Array.isArray(saved.session.questions)) {
        setSession(saved.session);
        setName(saved.session.name);
        setSchool(saved.session.school);
        setAnswers(saved.answers || {});
      }
    } catch { /* corrupted local state */ }
  }, [storageKey]);

  useEffect(() => {
    if (!session || result) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ session, answers })); } catch { /* storage unavailable */ }
  }, [session, answers, result, storageKey]);

  useEffect(() => {
    if (!session || result) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [session, result]);

  const submitExam = useCallback(async () => {
    const active = sessionRef.current;
    if (!active || resultRef.current || submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setError("");
    setConfirm(false);
    try {
      const data: Result = await api({ action: "submit", token: active.token, answers: answersRef.current });
      resultRef.current = data;
      setResult(data);
      try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    } catch (e) {
      setError(e instanceof Error ? e.message : "ফলাফল জমা দেওয়া যায়নি।");
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }, [storageKey]);

  const deadline = session ? deadlineFor(session) : null;
  const secondsLeft = deadline === null ? null : Math.max(0, Math.ceil((deadline - now) / 1000));
  useEffect(() => {
    if (session && !result && secondsLeft === 0 && !submitting && !error) void submitExam();
  }, [session, result, secondsLeft, submitting, error, submitExam]);

  async function startExam() {
    if (!name.trim() || !school.trim()) { setError("নাম ও বিদ্যালয়ের নাম পূরণ করো।"); return; }
    if (!sheetName) return;
    setLoading(true);
    setError("");
    try {
      const data = await api({ action: "start", name: name.trim(), school: school.trim(), class: sheetName });
      const next: Session = { token: data.token, startedAt: data.startedAt, expiresAt: data.expiresAt, questions: data.questions, name: name.trim(), school: school.trim() };
      if (!Array.isArray(next.questions) || deadlineFor(next) === null) {
        throw new Error("সার্ভার থেকে পরীক্ষার সময় পাওয়া যায়নি। Apps Script-এর startedAt/expiresAt যাচাই করো।");
      }
      setSession(next);
      sessionRef.current = next;
      setAnswers({});
      answersRef.current = {};
      setNow(Date.now());
      setCurrent(0);
    } catch (e) { setError(e instanceof Error ? e.message : "পরীক্ষা শুরু করা যায়নি।"); }
    finally { setLoading(false); }
  }

  const questions = session?.questions || [];
  const question = questions[current];
  const answeredCount = questions.filter(q => answers[String(q.id)] !== undefined).length;
  const timeText = secondsLeft === null ? "--:--" : `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  if (!sheetName) return <main className="p-10 text-center">এই শ্রেণির পরীক্ষা পাওয়া যায়নি।</main>;
  return (
    <main className={`font-[family-name:var(--font-solaiman)] min-h-screen bg-[#f5f7f6] px-4 py-10 text-slate-800`}>
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <p className="font-semibold text-emerald-700">সূচনা ছাত্র সংগঠন</p>
          <h1 className="mt-2 text-3xl font-bold">বাংলা উৎসব | মডেল টেস্ট</h1>
          <p className="mt-2 text-slate-500">{labels[className]}</p>
        </header>

        {!session && <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-bold">পরীক্ষার্থীর তথ্য</h2>
          <p className="mb-6 text-sm text-slate-500">প্রতি প্রশ্নের জন্য ১ মিনিট সময়। পরীক্ষা শুরু হলে সময় গণনা শুরু হবে।</p>
          <label className="mb-2 block font-medium" htmlFor="exam-name">তোমার নাম</label>
          <input id="exam-name" value={name} onChange={e => setName(e.target.value)} placeholder="সম্পূর্ণ নাম লিখো" className="mb-5 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-emerald-600" />
          <label className="mb-2 block font-medium" htmlFor="exam-school">বিদ্যালয়ের নাম</label>
          <input id="exam-school" value={school} onChange={e => setSchool(e.target.value)} placeholder="বিদ্যালয়ের নাম লিখো" className="mb-5 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-emerald-600" />
          {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
          <button disabled={loading} onClick={startExam} className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{loading ? "পরীক্ষা প্রস্তুত হচ্ছে..." : "পরীক্ষা শুরু করো"}</button>
        </section>}

        {session && !result && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm text-slate-500">পরীক্ষার্থী: {session.name}</p><p className="text-sm text-slate-500">বিদ্যালয়: {session.school}</p></div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">উত্তর দিয়েছ: {answeredCount}/{questions.length}</span>
              <span aria-live="off" className={`rounded-xl px-4 py-2 font-bold tabular-nums ${secondsLeft !== null && secondsLeft <= 60 ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-800"}`}>⏱ {timeText}</span>
            </div>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-600 transition-all" style={{ width: `${questions.length ? answeredCount / questions.length * 100 : 0}%` }} /></div>
          {deadline === null && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">পরীক্ষার সময় পাওয়া যায়নি। অ্যাডমিনকে জানাও।</p>}
          {question && <>
            <div className="mb-6 flex items-center justify-between"><span className="font-semibold text-emerald-700">প্রশ্ন {current + 1} / {questions.length}</span><span className="text-sm text-slate-500">নম্বর: {question.marks}</span></div>
            <h2 className="mb-6 text-xl font-semibold leading-relaxed">{question.question}</h2>
            <div className="space-y-3">{question.options.map((option, index) => <button key={index} disabled={submitting || secondsLeft === 0 || secondsLeft === null} onClick={() => {
              const next = { ...answersRef.current, [String(question.id)]: index };
              answersRef.current = next;
              setAnswers(next);
            }} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed ${answers[String(question.id)] === index ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:bg-slate-50"}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-semibold">{letters[index]}</span><span>{option}</span></button>)}</div>
            <div className="mt-8 flex justify-between gap-3"><button disabled={current === 0} onClick={() => setCurrent(c => c - 1)} className="rounded-lg border border-slate-300 px-5 py-3 font-medium disabled:opacity-40">পূর্ববর্তী</button><button disabled={current === questions.length - 1} onClick={() => setCurrent(c => c + 1)} className="rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white disabled:opacity-40">পরবর্তী</button></div>
            <div className="mt-8 flex flex-wrap gap-2">{questions.map((q, index) => <button key={String(q.id)} onClick={() => setCurrent(index)} className={`h-10 w-10 rounded-lg border text-sm font-semibold ${current === index ? "border-emerald-700 bg-emerald-700 text-white" : answers[String(q.id)] !== undefined ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white"}`}>{index + 1}</button>)}</div>
            <div className="mt-8 border-t border-slate-100 pt-5 text-center"><button disabled={submitting} onClick={() => setConfirm(true)} className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white disabled:opacity-50">{submitting ? "জমা হচ্ছে..." : "পরীক্ষা জমা দাও"}</button></div>
          </>}
          {error && <div role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">{error}<button onClick={() => void submitExam()} disabled={submitting} className="ml-3 underline">আবার জমা দাও</button></div>}
          {confirm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div role="dialog" aria-modal="true" aria-label="পরীক্ষা জমা নিশ্চিত করো" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h3 className="text-xl font-bold">পরীক্ষা জমা দেবে?</h3><p className="my-4 text-slate-600">{questions.length - answeredCount}টি প্রশ্নের উত্তর দেওয়া হয়নি। জমা দিলে আর পরিবর্তন করা যাবে না।</p><div className="flex justify-end gap-3"><button onClick={() => setConfirm(false)} className="rounded-lg border px-4 py-2">ফিরে যাও</button><button onClick={() => void submitExam()} className="rounded-lg bg-emerald-700 px-4 py-2 text-white">হ্যাঁ, জমা দাও</button></div></div></div>}
        </section>}

        {result && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-center text-2xl font-bold">পরীক্ষার ফলাফল</h2>
          <p className="mt-3 text-center text-4xl font-bold text-emerald-700">{result.score} / {result.total}</p>
          <p className="mt-3 text-center text-slate-600">সঠিক: {result.correct} · ভুল: {result.wrong} · উত্তর দাওনি: {result.unanswered}</p>
          <p className="mt-2 text-center text-sm text-slate-500">Attempt: {result.attempt} · {result.leaderboardEligible ? "Leaderboard-এর জন্য গণনা হবে" : "এই Attempt Leaderboard-এ গণনা হবে না"}</p>
          <h3 className="mb-4 mt-8 text-xl font-bold">উত্তর পর্যালোচনা</h3>
          <div className="space-y-5">{result.review.map((q, i) => <article key={`${q.id}-${i}`} className="rounded-xl border border-slate-200 p-4"><h4 className="mb-3 font-semibold">{i + 1}. {q.question}</h4><div className="space-y-2">{q.options.map((opt, idx) => <div key={idx} className={`rounded-lg border px-3 py-2 ${idx === q.correctIndex ? "border-emerald-300 bg-emerald-50 text-emerald-900" : idx === q.selectedIndex ? "border-red-300 bg-red-50 text-red-800" : "border-slate-100"}`}>{letters[idx]}. {opt} {idx === q.correctIndex ? "✓ সঠিক" : idx === q.selectedIndex ? "✗ তোমার উত্তর" : ""}</div>)}</div><p className="mt-3 text-sm text-slate-600">{q.selectedIndex < 0 ? "তুমি উত্তর দাওনি।" : q.selectedIndex === q.correctIndex ? "তোমার উত্তর সঠিক।" : "তোমার উত্তর ভুল।"}</p>{q.explanation && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm">ব্যাখ্যা: {q.explanation}</p>}</article>)}</div>
          <p className="mt-6 text-center text-sm text-slate-500">আবার পরীক্ষা দিতে চাইলে এই পেজ Refresh করো। প্রথম বৈধ Attempt-এর ফলাফলই Leaderboard-এ থাকবে।</p>
          <button onClick={() => { setSession(null); sessionRef.current = null; setResult(null); resultRef.current = null; setAnswers({}); answersRef.current = {}; setCurrent(0); setError(""); }} className="mt-4 w-full rounded-xl border border-emerald-700 px-5 py-3 font-semibold text-emerald-700">আবার পরীক্ষা দাও</button>
        </section>}
      </div>
    </main>
  );
}
