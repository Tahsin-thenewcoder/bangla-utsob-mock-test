"use client";

import { useCallback, useEffect, useState } from "react";

type Student = { rank: number; name: string; school: string; score: number; total: number; class: string };
type ApiResponse = { success: boolean; leaderboard?: Student[]; error?: string };

const classes = [
  { id: "6", label: "ষষ্ঠ শ্রেণি", group: "ক বিভাগ" },
  { id: "7", label: "সপ্তম শ্রেণি", group: "খ বিভাগ" },
  { id: "8", label: "অষ্টম শ্রেণি", group: "গ বিভাগ" },
  { id: "9-10", label: "নবম–দশম শ্রেণি", group: "ঘ বিভাগ" },
] as const;
type ClassId = (typeof classes)[number]["id"];

const podium = [
  { medal: "🥇", place: "প্রথম স্থান", border: "border-amber-200", bg: "bg-gradient-to-b from-amber-50 to-white", accent: "text-amber-700" },
  { medal: "🥈", place: "দ্বিতীয় স্থান", border: "border-slate-200", bg: "bg-gradient-to-b from-slate-50 to-white", accent: "text-slate-600" },
  { medal: "🥉", place: "তৃতীয় স্থান", border: "border-orange-200", bg: "bg-gradient-to-b from-orange-50 to-white", accent: "text-orange-700" },
];

export default function LeaderboardPage() {
  const [selectedClass, setSelectedClass] = useState<ClassId>("6");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async (classId: ClassId, signal: AbortSignal) => {
    setLoading(true);
    setError("");
    setStudents([]);
    try {
      const response = await fetch(`/api/leaderboard?class=${encodeURIComponent(classId)}`, {
        cache: "no-store", signal,
      });
      if (!response.ok) throw new Error("সার্ভার থেকে ফলাফল আনা যাচ্ছে না।");
      const data: ApiResponse = await response.json();
      if (!data.success || !Array.isArray(data.leaderboard)) {
        throw new Error(data.error || "ফলাফলের তথ্য সঠিক নয়।");
      }
      if (!signal.aborted) setStudents(data.leaderboard);
    } catch (err) {
      if (!signal.aborted) setError(err instanceof Error ? err.message : "ফলাফল লোড করা যায়নি।");
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(selectedClass, controller.signal);
    return () => controller.abort();
  }, [selectedClass, refreshKey, load]);

  const active = classes.find((item) => item.id === selectedClass)!;
  const maxScore = students.length ? Math.max(...students.map((s) => s.score)) : null;

  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-8 text-slate-800 sm:px-6 sm:py-12" style={{ fontFamily: 'SolaimanLipi, "Noto Sans Bengali", sans-serif' }}>
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white px-5 py-10 text-center shadow-sm sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-emerald-50 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-12 h-52 w-52 rounded-full bg-amber-50 blur-2xl" />
          <div className="relative">
            <p className="text-sm font-bold tracking-wide text-emerald-700 sm:text-base">সূচনা ছাত্র সংগঠন</p>
            <h1 className="mt-3 text-3xl font-bold leading-snug text-[#102d2b] sm:text-5xl">বাংলা উৎসব</h1>
            <p className="mt-2 text-lg font-semibold text-slate-600 sm:text-2xl">প্রস্তুতিমূলক মডেল টেস্ট</p>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-emerald-600" />
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-800">
              <span aria-hidden="true">🏆</span> পরীক্ষার্থীদের লিডারবোর্ড
            </div>
          </div>
        </header>

        <section className="mt-7" aria-label="শ্রেণি নির্বাচন">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {classes.map((item) => {
              const selected = selectedClass === item.id;
              return (
                <button key={item.id} type="button" onClick={() => setSelectedClass(item.id)}
                  aria-pressed={selected}
                  className={`rounded-2xl border px-3 py-4 text-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:py-5 ${selected ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-100" : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50"}`}>
                  <span className="block text-base font-bold sm:text-lg">{item.label}</span>
                  <span className={`mt-1 block text-xs sm:text-sm ${selected ? "text-emerald-100" : "text-slate-500"}`}>{item.group}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-700">ফলাফল ও অবস্থান</p>
              <h2 className="mt-1 text-2xl font-bold text-[#102d2b] sm:text-3xl">{active.label} <span className="text-base font-normal text-slate-500">· {active.group}</span></h2>
              <p className="mt-1 text-sm text-slate-500">শুধু প্রথমবারের পরীক্ষার ফলাফল গণনা করা হয়</p>
            </div>
            <button type="button" onClick={() => setRefreshKey((v) => v + 1)} disabled={loading}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 disabled:opacity-50">↻ ফলাফল রিফ্রেশ</button>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-14 text-center text-slate-500">ফলাফল লোড হচ্ছে...</div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-white p-10 text-center">
              <p className="font-semibold text-red-600">{error}</p>
              <button onClick={() => setRefreshKey((v) => v + 1)} className="mt-4 rounded-lg bg-emerald-700 px-5 py-2 text-white">আবার চেষ্টা করো</button>
            </div>
          ) : students.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-14 text-center">
              <p className="text-3xl">📋</p><p className="mt-3 font-semibold text-slate-600">এই শ্রেণিতে এখনো কোনো ফলাফল পাওয়া যায়নি।</p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600">অংশগ্রহণকারী <strong className="ml-1 text-slate-900">{students.length} জন</strong></span>
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600">সর্বোচ্চ নম্বর <strong className="ml-1 text-emerald-700">{maxScore}</strong></span>
              </div>

              <div className="mt-9 flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">✨</span>
                <h3 className="text-xl font-bold text-[#102d2b] sm:text-2xl">সেরা তিন</h3>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {students.slice(0, 3).map((student, index) => {
                  const style = podium[index];
                  return (
                    <article key={`${student.rank}-${student.name}-${index}`} className={`relative overflow-hidden rounded-[24px] border ${style.border} ${style.bg} p-6 text-center shadow-sm transition-shadow hover:shadow-md`}>
                      <div className="text-xs font-bold text-slate-500">{style.place}</div>
                      <div className="mt-3 text-5xl" aria-hidden="true">{style.medal}</div>
                      <h4 className="mt-4 break-words text-xl font-bold text-[#102d2b]">{student.name}</h4>
                      <p className="mt-1 min-h-10 break-words text-sm text-slate-500">{student.school}</p>
                      <div className="mt-4 border-t border-slate-200/80 pt-4">
                        <span className={`text-3xl font-bold ${style.accent}`}>{student.score}</span>
                        <span className="ml-1 text-sm text-slate-500">/ {student.total} নম্বর</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center gap-3">
                <h3 className="text-xl font-bold text-[#102d2b] sm:text-2xl">সম্পূর্ণ ফলাফল</h3>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[50px_minmax(0,1fr)_75px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-500 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_110px] sm:px-6 sm:text-sm">
                  <span>স্থান</span><span>পরীক্ষার্থী</span><span className="hidden sm:block">বিদ্যালয়</span><span className="text-right">নম্বর</span>
                </div>
                {students.map((student, index) => (
                  <div key={`${student.rank}-${student.name}-${index}`} className="grid grid-cols-[50px_minmax(0,1fr)_75px] items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-0 hover:bg-emerald-50/40 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_110px] sm:px-6">
                    <span className="text-lg font-bold text-slate-700">{index < 3 ? podium[index].medal : student.rank}</span>
                    <div className="min-w-0"><p className="break-words font-bold text-slate-800">{student.name}</p><p className="mt-1 break-words text-xs text-slate-500 sm:hidden">{student.school}</p></div>
                    <span className="hidden break-words text-sm text-slate-500 sm:block">{student.school}</span>
                    <span className="text-right font-bold text-emerald-700">{student.score}<span className="ml-1 text-xs font-normal text-slate-400">/{student.total}</span></span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-slate-500">সমান নম্বরের ক্ষেত্রে জমা দেওয়ার সময় অনুযায়ী অবস্থান নির্ধারিত হয়।</p>
            </>
          )}
        </section>
        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">সূচনা ছাত্র সংগঠন · ভালো কিছু শুরু হোক</footer>
      </div>
    </main>
  );
}
