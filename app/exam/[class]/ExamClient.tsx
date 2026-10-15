"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock3, ShieldCheck, LogOut } from "lucide-react";

type Question = { id: string | number; question: string; options: string[]; marks: number };
type Review = Question & { selectedIndex: number; correctIndex: number; explanation: string };
type Result = { score: number; total: number; correct: number; wrong: number; unanswered: number; attempt: number; leaderboardEligible: boolean; review: Review[] };
type Student = { studentId: string; name: string; school: string; className: string; year: number };
type ExamSession = { token: string; startedAt: number; expiresAt: number; questions: Question[]; answers: Record<string, number>; status: string; result?: Result };
const sheets: Record<string, string> = { "6": "Class_6", "7": "Class_7", "8": "Class_8", "9-10": "Class_9_10" };
const labels: Record<string, string> = { "6": "ষষ্ঠ শ্রেণি", "7": "সপ্তম শ্রেণি", "8": "অষ্টম শ্রেণি", "9-10": "নবম–দশম শ্রেণি" };
const letters = ["ক", "খ", "গ", "ঘ"];
async function api(body: Record<string, unknown>) {
  const response = await fetch("/api/exam", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "অনুরোধ সম্পন্ন হয়নি।");
  return data;
}

export default function ExamClient({ className }: { className: string }) {
  const examClass = sheets[className];
  const [student, setStudent] = useState<Student | null>(null);
  const [checking, setChecking] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [retake, setRetake] = useState(false);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answersRef = useRef<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [saveState, setSaveState] = useState("সংরক্ষিত");
  const [revision, setRevision] = useState(0);
  const [savedRevision, setSavedRevision] = useState(0);
  const lastSavedRevision = useRef(0);
  const saving = useRef(false);
  const submitting = useRef(false);
  const sessionRef = useRef<ExamSession | null>(null);
  useEffect(() => { sessionRef.current = session; }, [session]);
  const applySession = useCallback((data: ExamSession) => {
    if (data.status === "SUBMITTED" && data.result) {
      setResult(data.result);
      setSession(null);
      sessionRef.current = null;
    } else {
      setSession(data);
      sessionRef.current = data;
      const next = data.answers || {};
      answersRef.current = next;
      setAnswers(next);
      setNow(Date.now());
      setRevision(0);
      lastSavedRevision.current = 0;
      setSavedRevision(0);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        if (!cancelled && data.success && data.student) setStudent(data.student);
      } catch { /* Login prompt shown below */ }
      finally { if (!cancelled) setChecking(false); }
    })();
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!session || result) return;
    const interval = window.setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, [session, result]);

  const flushSave = useCallback(async () => {
    const active = sessionRef.current;
    if (!active || saving.current || submitting.current || lastSavedRevision.current >= revision) return;
    saving.current = true;
    setSaveState("সংরক্ষণ হচ্ছে…");
    const savingRevision = revision;
    try {
      const data = await api({ action: "save", token: active.token, answers: answersRef.current });
      if (data.status === "SUBMITTED" && data.result) applySession(data);
      else {
        lastSavedRevision.current = savingRevision;
        setSavedRevision(savingRevision);
        setSaveState("সংরক্ষিত ✓");
      }
    } catch (e) {
      setSaveState("সংরক্ষণ ব্যর্থ — আবার চেষ্টা হবে");
      setError(e instanceof Error ? e.message : "উত্তর সংরক্ষণ করা যায়নি।");
    } finally { saving.current = false; }
  }, [revision, applySession]);
  useEffect(() => {
    if (!session || result || revision <= lastSavedRevision.current) return;
    const id = window.setTimeout(() => void flushSave(), 800);
    return () => clearTimeout(id);
  }, [revision, savedRevision, session, result, flushSave]);
  // Also try saving when the student returns online or leaves the tab.
  useEffect(() => {
    const save = () => { if (document.visibilityState === "hidden") void flushSave(); };
    const online = () => void flushSave();
    document.addEventListener("visibilitychange", save);
    window.addEventListener("online", online);
    return () => { document.removeEventListener("visibilitychange", save); window.removeEventListener("online", online); };
  }, [flushSave]);
  const submitExam = useCallback(async () => {
    const active = sessionRef.current;
    if (!active || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    setConfirm(false);
    try {
      const data = await api({ action: "submit", token: active.token, answers: answersRef.current });
      applySession({ ...active, status: "SUBMITTED", result: data.result, answers: answersRef.current });
    } catch (e) { setError(e instanceof Error ? e.message : "জমা দেওয়া যায়নি।"); }
    finally { submitting.current = false; setBusy(false); }
  }, [applySession]);
  const secondsLeft = session ? Math.max(0, Math.ceil((Number(session.expiresAt) - now) / 1000)) : null;
  useEffect(() => {
    if (session && !result && secondsLeft === 0 && !submitting.current) void submitExam();
  }, [secondsLeft, session, result, submitExam]);
  async function handleLogout() {
    if (sessionRef.current || busy) return;
    if (!window.confirm("তুমি কি Logout করতে চাও?")) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
      if (!response.ok) throw new Error("Logout করা যায়নি। আবার চেষ্টা করো।");
      window.location.replace("/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Logout করা যায়নি।");
      setBusy(false);
    }
  }
  async function startExam() {
    if (!student || !agreed || !examClass) return;
    setBusy(true); setError(""); setResult(null);
    try {
      const data = await api({ action: "start", retake });
      applySession(data);
      setRetake(false);
    } catch (e) { setError(e instanceof Error ? e.message : "পরীক্ষা শুরু করা যায়নি।"); }
    finally { setBusy(false); }
  }
  function choose(id: string, index: number) {
    if (!session || secondsLeft === 0 || busy) return;
    const next = { ...answersRef.current, [id]: index };
    answersRef.current = next;
    setAnswers(next);
    setRevision(r => r + 1);
    setSaveState("সংরক্ষণ বাকি…");
  }
  const questions = session?.questions || [];
  const question = questions[current];
  const answeredCount = questions.filter(q => answers[String(q.id)] !== undefined).length;
  const timeText = secondsLeft === null ? "--:--" : `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  return <main className="min-h-screen bg-[#f4f7f1] text-[#073e32]" style={{ fontFamily: "SolaimanLipi, sans-serif" }}>
    <div className="bg-[#064334] text-[#fff0cc]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 text-sm">
        <Link href="/" className="inline-flex shrink-0 items-center gap-2 font-bold"><ArrowLeft size={17}/> মূল পাতা</Link>
        <span className="text-right font-semibold">বাংলা উৎসব · মডেল টেস্ট</span>
      </nav>
      <header className="mx-auto max-w-5xl px-4 pb-12 pt-7 text-center sm:pb-16">
        <BookOpenCheck className="mx-auto mb-3" size={30}/>
        <h1 className="text-3xl font-extrabold sm:text-4xl">প্রস্তুতিমূলক মডেল টেস্ট</h1>
        <p className="mt-2 text-sm text-[#e3e8d5]">{labels[className] || "অজানা শ্রেণি"} · সূচনা ছাত্র সংগঠন</p>
      </header>
    </div>
    <div className="mx-auto -mt-7 max-w-4xl px-4 pb-14">
      {!examClass ? <div className="rounded-2xl bg-white p-8">এই শ্রেণির পরীক্ষা পাওয়া যায়নি।</div>
      : checking ? <div className="rounded-2xl bg-white p-8 text-center">Login যাচাই হচ্ছে…</div>
      : !student ? <section className="rounded-3xl bg-white p-7 text-center shadow-xl"><ShieldCheck className="mx-auto mb-3" size={36}/><h2 className="text-2xl font-bold">প্রথমে Login করো</h2><p className="my-4 text-slate-600">Student ID ও PIN দিয়ে প্রবেশ করলে পরীক্ষা দিতে পারবে।</p><Link href="/login" className="inline-block rounded-xl bg-[#087457] px-6 py-3 font-bold text-white">Login পেজে যাও</Link></section>
      : student.className !== examClass ? 
(
  <section className="rounded-3xl bg-white p-7 text-center shadow-xl sm:p-9">
    <ShieldCheck
      className="mx-auto mb-4 text-[#087457]"
      size={40}
    />

    <h2 className="text-2xl font-extrabold">
      তোমার নিবন্ধিত শ্রেণির পরীক্ষা নয়
    </h2>

    <p className="mt-3 text-sm leading-7 text-slate-600">
      তুমি {student.className === "Class_6"
        ? "ষষ্ঠ"
        : student.className === "Class_7"
        ? "সপ্তম"
        : student.className === "Class_8"
        ? "অষ্টম"
        : "নবম–দশম"} শ্রেণিতে নিবন্ধিত।
      নিজের শ্রেণির পরীক্ষায় অংশ নাও।
    </p>

    <div className="mx-auto mt-7 max-w-sm space-y-3">
      <Link
        href={
          student.className === "Class_9_10"
            ? "/exam/9-10"
            : `/exam/${student.className.replace("Class_", "")}`
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#087457] px-5 py-3.5 font-bold text-white transition hover:bg-[#065b44]"
      >
        <BookOpenCheck size={19} />
        নিজের শ্রেণির পরীক্ষায় যাও
      </Link>

      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={busy}
        className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
      >
        Logout করো
      </button>
    </div>
  </section>
)

      : !session && !result ? <section className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">
          <div className="rounded-2xl bg-[#eef5e9] p-5"><h2 className="mb-3 text-xl font-extrabold">পরীক্ষার্থীর তথ্য</h2><p><b>নাম:</b> {student.name}</p><p><b>বিদ্যালয়:</b> {student.school}</p><p><b>Student ID:</b> {student.studentId}</p><p><b>শ্রেণি:</b> {labels[className]}</p></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dce9db] bg-[#f7faf4] px-4 py-3">
            <p className="text-sm text-[#45685b]">অন্য অ্যাকাউন্টে পরীক্ষা দিতে চাও?</p>
            <button type="button" onClick={() => void handleLogout()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-[#b9d5c7] bg-white px-4 py-2 text-sm font-bold text-[#07543f] transition hover:bg-[#e9f6ee] disabled:cursor-not-allowed disabled:opacity-50"><LogOut size={17} /> {busy ? "অপেক্ষা করো…" : "Logout"}</button>
          </div>
          <h3 className="mb-3 mt-7 text-xl font-bold">পরীক্ষার গুরুত্বপূর্ণ নির্দেশনা</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700"><li>নির্ধারিত সময়
৫টি প্রশ্নে ৫ মিনিট এবং ২০টি প্রশ্নে ২০ মিনিট সময় থাকবে। পরীক্ষা শুরু করলেই সময় গণনা শুরু হবে।</li><li>অন্য Tab-এ গেলেও বা পেজ বন্ধ করলেও সময় চলতে থাকবে।</li><li>উত্তর সার্ভারে সংরক্ষণ করা হয়; সংরক্ষণ সম্পন্ন হয়েছে কি না দেখবে।</li><li>সময় শেষ হলে সংরক্ষিত উত্তর দিয়ে ফলাফল চূড়ান্ত হবে।</li><li>উত্তর না দেওয়া প্রশ্নে কোনো নম্বর যোগ হবে না।</li><li>প্রথম Attempt-ই Leaderboard-এ গণনা হবে।</li></ul>
          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-[#dce9db] bg-[#f7faf4] p-4 text-sm"><input type="checkbox" className="mt-1 accent-emerald-700" checked={agreed} onChange={e => setAgreed(e.target.checked)}/><span>আমি নির্দেশনাগুলো পড়েছি ও বুঝেছি।</span></label>
          {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
          <button onClick={() => void startExam()} disabled={!agreed || busy} className="mt-5 w-full rounded-xl bg-[#087457] px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "পরীক্ষা প্রস্তুত হচ্ছে…" : "পরীক্ষা শুরু করো"}</button>
        </section>
      : session && !result ? <section className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{student.name}</p><p className="text-xs text-slate-500">{saveState}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-[#e9f5e9] px-3 py-2 text-sm">{answeredCount}/{questions.length} উত্তর</span><span className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 font-bold tabular-nums ${secondsLeft !== null && secondsLeft <= 60 ? "bg-red-50 text-red-700" : "bg-slate-100"}`}><Clock3 size={16}/>{timeText}</span></div></div>
          <div className="my-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-[#087457]" style={{width:`${questions.length ? answeredCount/questions.length*100 : 0}%`}}/></div>
          {question && <><div className="mb-4 flex justify-between text-sm"><b>প্রশ্ন {current+1} / {questions.length}</b><span>নম্বর: {question.marks}</span></div><h2 className="mb-6 text-xl font-bold leading-relaxed">{question.question}</h2><div className="space-y-3">{question.options.map((opt,i)=><button key={i} disabled={busy || secondsLeft === 0} onClick={()=>choose(String(question.id),i)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left ${answers[String(question.id)] === i ? "border-[#087457] bg-[#e9f6ee]" : "border-slate-200 hover:bg-slate-50"}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-bold">{letters[i]}</span>{opt}</button>)}</div><div className="mt-7 flex justify-between gap-3"><button disabled={current===0} onClick={()=>setCurrent(c=>c-1)} className="rounded-lg border px-5 py-3 disabled:opacity-40">পূর্ববর্তী</button><button disabled={current===questions.length-1} onClick={()=>setCurrent(c=>c+1)} className="rounded-lg bg-[#087457] px-5 py-3 text-white disabled:opacity-40">পরবর্তী</button></div><div className="mt-7 flex flex-wrap gap-2">{questions.map((q,i)=><button key={String(q.id)} onClick={()=>setCurrent(i)} className={`h-10 w-10 rounded-lg border text-sm font-bold ${i===current ? "bg-[#087457] text-white" : answers[String(q.id)] !== undefined ? "bg-[#e9f6ee]" : "bg-white"}`}>{i+1}</button>)}</div><button disabled={busy} onClick={()=>setConfirm(true)} className="mt-7 w-full rounded-xl bg-[#087457] px-5 py-3 font-bold text-white">{busy ? "জমা হচ্ছে…" : "পরীক্ষা জমা দাও"}</button></>}
          {error && <div role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error} <button onClick={()=>void flushSave()} className="underline">আবার সংরক্ষণ করো</button></div>}
          {confirm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6"><h3 className="text-xl font-bold">পরীক্ষা জমা দেবে?</h3><p className="my-4 text-slate-600">উত্তর দেওয়া হয়েছে {answeredCount}টি, বাকি {questions.length-answeredCount}টি। জমা দিলে আর পরিবর্তন করা যাবে না।</p><div className="flex justify-end gap-3"><button onClick={()=>setConfirm(false)} className="rounded-lg border px-4 py-2">ফিরে যাও</button><button onClick={()=>void submitExam()} className="rounded-lg bg-[#087457] px-4 py-2 text-white">হ্যাঁ, জমা দাও</button></div></div></div>}
        </section>
      : result ? <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8"><CheckCircle2 className="mx-auto text-[#087457]" size={42}/><h2 className="mt-3 text-center text-2xl font-bold">পরীক্ষার ফলাফল</h2><p className="mt-3 text-center text-4xl font-extrabold text-[#087457]">{result.score} / {result.total}</p><p className="mt-3 text-center text-slate-600">সঠিক {result.correct} · ভুল {result.wrong} · উত্তর দাওনি {result.unanswered}</p><p className="mt-2 text-center text-sm">Attempt {result.attempt} · {result.leaderboardEligible ? "Leaderboard-এ গণনা হবে" : "Leaderboard-এ গণনা হবে না"}</p><h3 className="mb-4 mt-8 text-xl font-bold">উত্তর পর্যালোচনা</h3><div className="space-y-4">{result.review.map((q,i)=><article key={`${q.id}-${i}`} className="rounded-xl border p-4"><h4 className="mb-3 font-bold">{i+1}. {q.question}</h4>{q.options.map((opt,j)=><p key={j} className={`my-1 rounded-lg px-3 py-2 ${j===q.correctIndex ? "bg-emerald-50 text-emerald-900" : j===q.selectedIndex ? "bg-red-50 text-red-800" : "bg-slate-50"}`}>{letters[j]}. {opt} {j===q.correctIndex ? "✓ সঠিক" : j===q.selectedIndex ? "✗ তোমার উত্তর" : ""}</p>)}{q.explanation && <p className="mt-2 text-sm">ব্যাখ্যা: {q.explanation}</p>}</article>)}</div><button onClick={()=>{setResult(null);setSession(null);setAgreed(false);setRetake(true);setError("");}} className="mt-6 w-full rounded-xl border border-[#087457] p-3 font-bold">আবার পরীক্ষা দাও</button><button
  type="button"
  onClick={() => void handleLogout()}
  disabled={busy}
  className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
>
  Logout করো
</button></section> : null}
    </div>
  </main>;
}
