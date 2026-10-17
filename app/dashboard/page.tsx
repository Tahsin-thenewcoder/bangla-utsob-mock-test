"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";


type Student = { studentId: string; name: string; school: string; className: string; year: number };
type Attempt = { examId: string; testId: string; attempt: number; score: number; total: number; correct: number; wrong: number; unanswered: number; submittedAt?: string };
type Raw = Record<string, unknown>;

function asObj(value: unknown): Raw | null { return value && typeof value === "object" && !Array.isArray(value) ? value as Raw : null; }
function asNumber(value: unknown, fallback = 0) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
function asString(value: unknown) { return typeof value === "string" ? value : ""; }
function testIdFromExamId(examId: string) { return examId.match(/(MT\d{2,})$/i)?.[1]?.toUpperCase() || ""; }
function normalizeAttempt(value: unknown): Attempt | null {
  const r = asObj(value); if (!r) return null;
  const examId = asString(r.examId ?? r.Exam_ID ?? r.examID);
  const testId = asString(r.testId ?? r.Test_ID).toUpperCase() || testIdFromExamId(examId);
  const attempt = asNumber(r.attempt ?? r.Attempt, 1);
  const score = asNumber(r.score ?? r.Score);
  const total = asNumber(r.total ?? r.Total);
  if (!testId || !Number.isInteger(attempt) || attempt < 1) return null;
  return { examId, testId, attempt, score, total, correct: asNumber(r.correct ?? r.Correct), wrong: asNumber(r.wrong ?? r.Wrong), unanswered: asNumber(r.unanswered ?? r.Unanswered), submittedAt: asString(r.submittedAt ?? r.Submitted_At) };
}
function extractAttempts(payload: Raw): Attempt[] {
  // Supports common history shapes. Adjust this function if the Apps Script response differs.
  const collections: unknown[] = [payload.attempts, payload.history, payload.results, payload.items];
  const result: Attempt[] = [];
  for (const collection of collections) {
    if (!Array.isArray(collection)) continue;
    for (const item of collection) {
      const r = asObj(item);
      if (!r) continue;
      const nested = Array.isArray(r.attempts) ? r.attempts : Array.isArray(r.results) ? r.results : null;
      if (nested) {
        for (const attempt of nested) {
          const a = asObj(attempt);
          const normalized = normalizeAttempt(a ? { ...r, ...a } : attempt);
          if (normalized) result.push(normalized);
        }
      } else {
        const normalized = normalizeAttempt(item);
        if (normalized) result.push(normalized);
      }
    }
    if (result.length) break;
  }
  return result.sort((a, b) => a.testId.localeCompare(b.testId, undefined, { numeric: true }) || a.attempt - b.attempt);
}
function classLabel(value: string) { return ({ Class_6: "ষষ্ঠ", Class_7: "সপ্তম", Class_8: "অষ্টম", Class_9_10: "নবম–দশম" } as Record<string, string>)[value] || value; }
function percent(score: number, total: number) { return total > 0 ? Math.min(100, Math.max(0, Math.round(score / total * 100))) : 0; }

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawKeys, setRawKeys] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(""); setRawKeys("");
    try {
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const me = await meRes.json();
      const s = asObj(me.student) ?? asObj(me);
      if (!meRes.ok || !s || !asString(s.studentId)) {
        window.location.assign("/login"); return;
      }
      setStudent({ studentId: asString(s.studentId), name: asString(s.name), school: asString(s.school), className: asString(s.className ?? s.class), year: asNumber(s.year) });
      const response = await fetch("/api/exam", { method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", body: JSON.stringify({ action: "history" }) });
      const payload: Raw = await response.json();
      if (!response.ok || payload.success === false) throw new Error(asString(payload.error) || "ফলাফলের ইতিহাস আনা যায়নি।");
      const parsed = extractAttempts(payload);
      setAttempts(parsed);
      if (!parsed.length) setRawKeys(Object.keys(payload).join(", "));
    } catch (e) { setError(e instanceof Error ? e.message : "কিছু একটা সমস্যা হয়েছে।"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  
const handleLogout = async () => {
  setBusy(true);

  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Logout করা যায়নি।");
    }

    window.location.assign("/login");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Logout করতে সমস্যা হয়েছে।"
    );
  } finally {
    setBusy(false);
  }
};


  const tests = useMemo(() => {
    const map = new Map<string, Attempt[]>();
    for (const a of attempts) map.set(a.testId, [...(map.get(a.testId) || []), a]);
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([testId, items]) => {
      const sorted = [...items].sort((a, b) => a.attempt - b.attempt);
      const official = sorted.find(a => a.attempt === 1);
      const best = sorted.reduce((max, a) => !max || percent(a.score, a.total) > percent(max.score, max.total) ? a : max, null as Attempt | null);
      return { testId, items: sorted, official, best };
    });
  }, [attempts]);
  const officialTests = tests.filter(t => t.official);
  const average = officialTests.length ? Math.round(officialTests.reduce((sum, t) => sum + percent(t.official!.score, t.official!.total), 0) / officialTests.length) : 0;
  const classPath = student ? ({ Class_6: "6", Class_7: "7", Class_8: "8", Class_9_10: "9-10" } as Record<string, string>)[student.className] || "6" : "6";

  return <main className="min-h-screen bg-[#f5f7f3] text-[#173a32]">
    <header className="bg-[#074a3b] px-5 pb-24 pt-7 text-[#fff5d8]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/" className="hover:underline">← মূল পাতা</Link>
          <span className="font-semibold">বাংলা উৎসব · মডেল টেস্ট</span>
        </div>
        <div className="mt-12">
          <p className="text-sm opacity-80">বাংলা উৎসব {student?.year || "২০২৭"}</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">আমার ড্যাশবোর্ড</h1>
          <p className="mt-3 text-sm opacity-85">{student ? `${student.name} · ${classLabel(student.className)} শ্রেণি · ${student.school}` : "ব্যক্তিগত ফলাফল ও অগ্রগতি"}</p>
        </div>
      </div>
    </header>
    <div className="mx-auto -mt-14 max-w-5xl space-y-6 px-4 pb-16 sm:px-6">
      {loading ? <section className="rounded-3xl bg-white p-10 text-center shadow-sm">ফলাফল লোড হচ্ছে...</section> : error ?
        <section className="rounded-3xl bg-white p-8 shadow-sm"><p className="font-semibold text-red-700">{error}</p><button onClick={() => void load()} className="mt-4 rounded-xl bg-[#087454] px-5 py-3 font-semibold text-white">আবার চেষ্টা করো</button></section> : <>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "সম্পন্ন মডেল টেস্ট", value: String(officialTests.length) },
            { label: "মোট Attempt", value: String(attempts.length) },
            { label: "অফিসিয়াল গড়", value: `${average}%` },
            { label: "Practice Retake", value: String(attempts.filter(a => a.attempt > 1).length) },
          ].map(card => <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">{card.label}</p><p className="mt-2 text-3xl font-extrabold text-[#087454]">{card.value}</p></div>)}
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold">অফিসিয়াল অগ্রগতি</h2><p className="mt-1 text-sm text-slate-500">প্রতিটি পরীক্ষার শুধু প্রথম Attempt গণনা করা হয়েছে।</p></div><Link href={`/exam/${classPath}`} className="rounded-xl bg-[#087454] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#065c43]">পরীক্ষা দাও →</Link></div>
          {officialTests.length ? <div className="mt-6 space-y-5">{officialTests.map(t => <div key={t.testId}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">{t.testId}</span><span>{t.official!.score} / {t.official!.total} · {percent(t.official!.score, t.official!.total)}%</span></div><div className="h-3 overflow-hidden rounded-full bg-[#e6eee9]"><div className="h-full rounded-full bg-[#087454]" style={{ width: `${percent(t.official!.score, t.official!.total)}%` }}/></div></div>)}</div> : <p className="mt-6 rounded-xl bg-[#f5f7f3] p-5 text-sm text-slate-600">এখনো কোনো অফিসিয়াল ফলাফল নেই। প্রথম মডেল টেস্ট দেওয়ার পর এখানে অগ্রগতি দেখা যাবে।</p>}
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-extrabold">মডেল টেস্ট অনুযায়ী ফলাফল</h2><p className="mt-1 text-sm text-slate-500">Retake শুধু ব্যক্তিগত অনুশীলনের জন্য; Leaderboard-এ প্রথম Attempt গণনা হবে।</p>
          {tests.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{tests.map(t => <article key={t.testId} className="rounded-2xl border border-[#dce9e1] p-5"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-extrabold">{t.testId}</h3><span className="rounded-full bg-[#eaf7f0] px-3 py-1 text-xs font-bold text-[#087454]">{t.items.length} Attempt</span></div><div className="flex justify-between gap-3 text-sm"><span>প্রথম Attempt (অফিসিয়াল)</span><strong>{t.official ? `${t.official.score}/${t.official.total}` : "—"}</strong></div><div className="mt-3 flex justify-between gap-3 text-sm"><span>সেরা Attempt</span><strong>{t.best ? `${t.best.score}/${t.best.total}` : "—"}</strong></div>{t.official && t.best && t.best.attempt > 1 && <p className="mt-3 text-sm font-semibold text-[#087454]">সেরা Practice: {t.best.score - t.official.score >= 0 ? "+" : ""}{t.best.score - t.official.score} নম্বর পার্থক্য</p>}<div className="mt-4 border-t border-[#e6eee9] pt-3"><p className="mb-2 text-xs font-bold text-slate-500">Attempt History</p>{t.items.map(a => <div key={`${t.testId}-${a.attempt}`} className="flex justify-between py-1 text-sm"><span>Attempt {a.attempt}{a.attempt === 1 ? " · অফিসিয়াল" : " · Practice"}</span><span className="font-semibold">{a.score}/{a.total}</span></div>)}</div></article>)}</div> : <p className="mt-5 text-sm text-slate-500">পরীক্ষা সম্পন্ন করলে এখানে History দেখা যাবে।</p>}
        </section>
        {!attempts.length && rawKeys && <p className="text-xs text-slate-500">History response-এর গঠন যাচাই করা প্রয়োজন। পাওয়া field: {rawKeys}</p>}
        <div className="flex flex-wrap gap-3"><Link href="/leaderboard" className="rounded-xl border border-[#087454] px-5 py-3 text-sm font-bold text-[#087454]">Leaderboard দেখো</Link><button onClick={() => void load()} className="rounded-xl border border-[#d4e3d9] bg-white px-5 py-3 text-sm font-bold">ফলাফল Refresh করো</button><button type="button" onClick={() => void handleLogout()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-[#b9d5c7] bg-white px-4 py-2 text-sm font-bold text-[#07543f] transition hover:bg-[#e9f6ee] disabled:cursor-not-allowed disabled:opacity-50"><LogOut size={17} /> {busy ? "অপেক্ষা করো…" : "Logout"}</button></div>
      </>}
    </div>
  </main>;
}
