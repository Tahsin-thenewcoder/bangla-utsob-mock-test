"use client";

import { useEffect, useState } from "react";

type Student = { name: string; school: string; score: number; total: number; rank: number };
type ApiResult = { success: boolean; leaderboard?: Student[]; error?: string };
const classes = [
  { id: "6", name: "ষষ্ঠ", icon: "০৬" },
  { id: "7", name: "সপ্তম", icon: "০৭" },
  { id: "8", name: "অষ্টম", icon: "০৮" },
  { id: "9-10", name: "নবম–দশম", icon: "০৯–১০" },
];
const podium = [
  { medal: "🥇", label: "প্রথম স্থান", ring: "border-amber-300/70", accent: "text-amber-300", glow: "from-amber-400/20" },
  { medal: "🥈", label: "দ্বিতীয় স্থান", ring: "border-slate-300/40", accent: "text-slate-200", glow: "from-slate-200/10" },
  { medal: "🥉", label: "তৃতীয় স্থান", ring: "border-orange-300/40", accent: "text-orange-300", glow: "from-orange-400/10" },
];

export default function LeaderboardPage() {
  const [selectedClass, setSelectedClass] = useState("6");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      setStudents([]);
      try {
        const response = await fetch(`/api/leaderboard?class=${encodeURIComponent(selectedClass)}`, {
          cache: "no-store", signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data: ApiResult = await response.json();
        if (!data.success || !Array.isArray(data.leaderboard)) throw new Error(data.error || "সঠিক ফলাফল পাওয়া যায়নি।");
        const list = data.leaderboard.map((item, index) => ({
          name: String(item.name ?? "").trim(),
          school: String(item.school ?? "").trim(),
          score: Number(item.score ?? 0),
          total: Number(item.total ?? 0),
          rank: Number(item.rank ?? index + 1),
        })).filter(item => item.name && Number.isFinite(item.score));
        if (!controller.signal.aborted) setStudents(list);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "ফলাফল লোড করা যায়নি।");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [selectedClass, refresh]);

  const selected = classes.find(item => item.id === selectedClass);
  const best = students[0];
  return (
    <main className="min-h-screen bg-[#071525] text-white" style={{ fontFamily: "SolaimanLipi, 'Noto Sans Bengali', sans-serif" }}>
      <div className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a1d31]">
        <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-4 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold tracking-wide text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> সূচনা ছাত্র সংগঠন
            </span>
            <div className="mt-6 text-5xl sm:text-6xl" aria-hidden="true">🏆</div>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">সেরাদের <span className="bg-gradient-to-r from-amber-200 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">লিডারবোর্ড</span></h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">বাংলা উৎসব ১৪৩৩ <span className="mx-1 text-emerald-400">✦</span> প্রস্তুতিমূলক মডেল টেস্ট</p>
            <p className="mt-2 text-sm text-slate-400">মেধা, অধ্যবসায় ও শেখার আনন্দে এগিয়ে যাও</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {classes.map(item => {
              const active = item.id === selectedClass;
              return <button key={item.id} onClick={() => setSelectedClass(item.id)} aria-pressed={active}
                className={`group rounded-2xl border px-3 py-4 text-left transition-all duration-200 sm:px-5 ${active ? "border-emerald-300/70 bg-emerald-400 text-[#06271f] shadow-[0_12px_35px_rgba(16,185,129,0.2)]" : "border-white/10 bg-white/[0.06] text-white hover:border-emerald-300/40 hover:bg-white/10"}`}>
                <span className={`text-xs font-bold tracking-wider ${active ? "text-emerald-950/70" : "text-emerald-300"}`}>{item.icon}</span>
                <span className="mt-1 block text-lg font-black sm:text-xl">{item.name}</span>
                <span className={`block text-xs ${active ? "text-emerald-950/70" : "text-slate-400"}`}>শ্রেণি</span>
              </button>;
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-9 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">CLASS RANKING</p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">{selected?.name} শ্রেণি <span className="text-emerald-400">✦</span></h2>
            <p className="mt-1 text-sm text-slate-400">শুধু প্রথম প্রচেষ্টার ফলাফল গণনা করা হয়</p>
          </div>
          <button onClick={() => setRefresh(v => v + 1)} disabled={loading}
            className="rounded-xl border border-white/15 bg-white/[0.07] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/50 hover:bg-white/10 disabled:opacity-50">↻ ফলাফল রিফ্রেশ</button>
        </div>

        {loading ? <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-16 text-center text-slate-300"><div className="mb-4 text-4xl">⏳</div>ফলাফল লোড হচ্ছে...</div>
          : error ? <div className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-10 text-center"><p className="font-bold text-rose-200">ফলাফল লোড করা যাচ্ছে না</p><p className="mt-2 text-sm text-rose-100/80">{error}</p><button onClick={() => setRefresh(v => v + 1)} className="mt-5 rounded-xl bg-white px-5 py-2 font-bold text-slate-900">আবার চেষ্টা করো</button></div>
          : students.length === 0 ? <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-14 text-center"><div className="text-4xl">📋</div><p className="mt-4 text-slate-300">এখনো কোনো ফলাফল পাওয়া যায়নি।</p></div>
          : <>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5"><p className="text-xs text-slate-400">অংশগ্রহণকারী</p><p className="mt-1 text-3xl font-black text-white">{students.length}<span className="ml-1 text-sm font-normal text-slate-400">জন</span></p></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5"><p className="text-xs text-slate-400">সর্বোচ্চ নম্বর</p><p className="mt-1 text-3xl font-black text-emerald-300">{best.score}<span className="ml-1 text-sm font-normal text-slate-400">/ {best.total}</span></p></div>
              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:col-span-1 sm:p-5"><p className="text-xs text-slate-400">বর্তমান বিভাগ</p><p className="mt-1 text-xl font-black text-white">{selected?.name} শ্রেণি</p></div>
            </div>

            <div className="mt-10 flex items-center gap-3"><span className="text-2xl">✨</span><h3 className="text-xl font-black sm:text-2xl">সেরা তিন</h3><div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" /></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {students.slice(0, 3).map((student, index) => {
                const style = podium[index];
                return <div key={`${student.name}-${index}`} className={`relative overflow-hidden rounded-3xl border ${style.ring} bg-gradient-to-b ${style.glow} to-[#102438] p-6 text-center shadow-xl ${index === 0 ? "sm:-translate-y-2" : ""}`}>
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/10" />
                  <p className={`text-xs font-bold ${style.accent}`}>{style.label}</p>
                  <div className="mt-3 text-5xl" aria-hidden="true">{style.medal}</div>
                  <p className="mt-4 break-words text-xl font-black text-white">{student.name}</p>
                  <p className="mt-1 min-h-10 break-words text-sm text-slate-300">{student.school}</p>
                  <div className="mt-5 border-t border-white/10 pt-4"><span className={`text-4xl font-black ${style.accent}`}>{student.score}</span><span className="ml-1 text-sm text-slate-400">/ {student.total} নম্বর</span></div>
                </div>;
              })}
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#102438] shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-5 sm:px-7"><h3 className="text-xl font-black">সম্পূর্ণ মেধাতালিকা</h3><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">{students.length} জন পরীক্ষার্থী</span></div>
              <div className="hidden grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_110px] gap-4 bg-white/[0.04] px-7 py-4 text-xs font-bold text-slate-400 sm:grid"><span>অবস্থান</span><span>পরীক্ষার্থী</span><span>বিদ্যালয়</span><span className="text-right">প্রাপ্ত নম্বর</span></div>
              {students.map((student, index) => <div key={`${student.name}-${index}`} className="grid grid-cols-[42px_minmax(0,1fr)_76px] items-center gap-3 border-t border-white/[0.07] px-4 py-4 transition hover:bg-white/[0.04] sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_110px] sm:gap-4 sm:px-7">
                <div className="text-lg font-black text-slate-300">{student.rank <= 3 ? ["🥇", "🥈", "🥉"][student.rank - 1] : String(student.rank).padStart(2, "0")}</div>
                <div className="min-w-0"><p className="break-words font-bold text-white">{student.name}</p><p className="mt-1 break-words text-xs text-slate-400 sm:hidden">{student.school}</p></div>
                <div className="hidden min-w-0 break-words text-sm text-slate-300 sm:block">{student.school}</div>
                <div className="text-right"><span className="text-lg font-black text-emerald-300">{student.score}</span><span className="block text-xs text-slate-500">/ {student.total}</span></div>
              </div>)}
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">শেখার যাত্রায় প্রতিটি প্রচেষ্টাই মূল্যবান ✦ সূচনা ছাত্র সংগঠন</p>
          </>}
      </div>
    </main>
  );
}
