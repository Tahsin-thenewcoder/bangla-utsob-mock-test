"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, Crown, RefreshCw, Trophy, Users, Sparkles } from "lucide-react";

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
  { medal: "🥇", place: "প্রথম স্থান", border: "border-[#e9ca78]", bg: "bg-gradient-to-br from-[#fff7db] via-white to-[#fffaf0]", accent: "text-[#a46a09]" },
  { medal: "🥈", place: "দ্বিতীয় স্থান", border: "border-[#d3dce0]", bg: "bg-gradient-to-br from-[#edf3f5] via-white to-[#f7f9fa]", accent: "text-[#506b7c]" },
  { medal: "🥉", place: "তৃতীয় স্থান", border: "border-[#e9c5a7]", bg: "bg-gradient-to-br from-[#fff0e3] via-white to-[#fff8f2]", accent: "text-[#b46b39]" },
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
    <main className="min-h-screen bg-[#f5f9f6] text-[#17372e]" style={{ fontFamily: 'SolaimanLipi, "Noto Sans Bengali", sans-serif' }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_10%_15%,rgba(15,130,83,0.055),transparent_45%)]" />
      <header className="relative z-10 border-b border-[#deebe3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#08754d] text-white shadow-[0_5px_15px_rgba(8,117,77,.2)]"><BookOpenCheck size={24} strokeWidth={1.8}/></span>
            <span><strong className="block text-lg leading-tight">বাংলা উৎসব</strong><span className="text-xs text-[#648073]">প্রস্তুতিমূলক পরীক্ষা</span></span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-[#cde3d6] bg-white px-3 py-2.5 text-sm font-bold text-[#08754d] transition hover:bg-[#edf8f1] sm:px-5">
            <ArrowLeft size={16}/> <span>হোমপেজ</span>
          </Link>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <section className="relative overflow-hidden rounded-[28px] bg-[#103e30] px-5 py-9 text-white shadow-[0_16px_40px_rgba(12,61,42,.14)] sm:px-10 sm:py-11">
          <div className="pointer-events-none absolute -right-20 -top-36 h-80 w-80 rounded-full border-[55px] border-white/[.07]" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-72 w-72 rounded-full border-[45px] border-[#41b785]/[.13]" />
          <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#c7f0da]"><Sparkles size={14}/> সূচনা ছাত্র সংগঠন · বাংলা উৎসব ১৪৩৩</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-[42px]">লিডারবোর্ড</h1>
              <p className="mt-3 text-sm leading-7 text-[#cce3d8] sm:text-base">বাংলা ভাষা ও সাহিত্য অলিম্পিয়াড · প্রস্তুতিমূলক পরীক্ষা</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
              <Trophy size={31} className="text-[#f8d780]"/>
              <div><p className="text-xs text-[#cce3d8]">মেধাতালিকা</p><p className="font-bold">সেরাদের সেরা যারা </p></div>
            </div>
          </div>
        </section>

        <section className="mt-8" aria-label="শ্রেণি নির্বাচন">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><p className="text-xs font-bold text-[#08754d]">বিভাগ নির্বাচন</p><h2 className="mt-1 text-xl font-bold sm:text-2xl">তোমার শ্রেণির ফলাফল দেখো</h2></div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {classes.map((item) => {
              const selected = selectedClass === item.id;
              return (
                <button key={item.id} type="button" onClick={() => setSelectedClass(item.id)} aria-pressed={selected}
                  className={`group relative overflow-hidden rounded-2xl border px-3 py-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08754d] sm:px-5 sm:py-5 ${selected ? "border-[#08754d] bg-[#08754d] text-white shadow-[0_10px_24px_rgba(8,117,77,.18)]" : "border-[#dce9e1] bg-white text-[#17372e] shadow-sm hover:-translate-y-0.5 hover:border-[#8ec8a8] hover:shadow-md"}`}>
                  <span className={`text-xs font-bold ${selected ? "text-[#bce9cf]" : "text-[#08754d]"}`}>{item.group}</span>
                  <span className="mt-2 block text-base font-bold sm:text-lg">{item.label}</span>
                  <ArrowUpRight size={16} className={`absolute right-3 top-3 ${selected ? "text-white/70" : "text-[#9bb6a5]"}`}/>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dce8e0] pb-5">
            <div>
              <p className="text-xs font-bold tracking-wide text-[#08754d]">ফলাফল ও অবস্থান</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{active.label} <span className="text-base font-normal text-[#688276]">· {active.group}</span></h2>
              <p className="mt-1 text-sm text-[#688276]">লিডারবোর্ডে শুধু প্রথম প্রচেষ্টার ফলাফল গণনা করা হয়</p>
            </div>
            <button type="button" onClick={() => setRefreshKey((v) => v + 1)} disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#cde3d6] bg-white px-4 py-2.5 text-sm font-bold text-[#08754d] shadow-sm transition hover:bg-[#edf8f1] disabled:opacity-50">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""}/> ফলাফল রিফ্রেশ
            </button>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-[#dce9e1] bg-white p-12 text-center text-[#688276]">
              <RefreshCw className="mx-auto mb-3 animate-spin text-[#08754d]" size={24}/> ফলাফল লোড হচ্ছে...
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-white p-10 text-center">
              <p className="font-semibold text-red-600">{error}</p>
              <button type="button" onClick={() => setRefreshKey((v) => v + 1)} className="mt-4 rounded-lg bg-[#08754d] px-5 py-2 text-white">আবার চেষ্টা করো</button>
            </div>
          ) : students.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#dce9e1] bg-white p-12 text-center">
              <Trophy className="mx-auto mb-3 text-[#a5bdaf]" size={30}/>
              <p className="font-semibold text-[#688276]">এই শ্রেণিতে এখনো কোনো ফলাফল পাওয়া যায়নি।</p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-xl border border-[#dce9e1] bg-white px-4 py-2.5 text-[#688276] shadow-sm"><Users size={17} className="text-[#08754d]"/> অংশগ্রহণকারী <strong className="text-[#17372e]">{students.length} জন</strong></span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-[#dce9e1] bg-white px-4 py-2.5 text-[#688276] shadow-sm"><Crown size={17} className="text-[#b68a2b]"/> সর্বোচ্চ নম্বর <strong className="text-[#08754d]">{maxScore}</strong></span>
              </div>

              <div className="mt-9 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5f5eb] text-[#08754d]"><Trophy size={20}/></span>
                <h3 className="text-xl font-bold sm:text-2xl">সেরা তিন</h3>
                <div className="h-px flex-1 bg-[#dce8e0]" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {students.slice(0, 3).map((student, index) => {
                  const style = podium[index];
                  return (
                    <article key={`${student.rank}-${student.name}-${index}`} className={`relative overflow-hidden rounded-[24px] border ${style.border} ${style.bg} p-5 text-center shadow-[0_7px_22px_rgba(25,65,45,.06)] transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6`}>
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[20px] border-[#17372e]/[.025]" />
                      <div className="relative text-xs font-bold text-[#60746b]">{style.place}</div>
                      <div className="relative mt-3 text-5xl" aria-hidden="true">{style.medal}</div>
                      <h4 className="relative mt-4 break-words text-xl font-bold text-[#17372e]">{student.name || "নাম পাওয়া যায়নি"}</h4>
                      <p className="relative mt-1 min-h-9 break-words text-sm text-[#688276]">{student.school || "বিদ্যালয়ের তথ্য নেই"}</p>
                      <div className="relative mt-4 border-t border-[#17372e]/10 pt-4">
                        <span className={`text-3xl font-bold ${style.accent}`}>{student.score}</span>
                        <span className="ml-1 text-sm text-[#688276]">/ {student.total} নম্বর</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center gap-3">
                <h3 className="text-xl font-bold sm:text-2xl">সম্পূর্ণ ফলাফল</h3>
                <div className="h-px flex-1 bg-[#dce8e0]" />
              </div>
              <div className="mt-5 overflow-hidden rounded-[22px] border border-[#dce9e1] bg-white shadow-sm">
                <div className="grid grid-cols-[44px_minmax(0,1fr)_70px] gap-3 border-b border-[#dce9e1] bg-[#edf6f0] px-4 py-4 text-xs font-bold text-[#416b56] sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_110px] sm:px-6 sm:text-sm">
                  <span>স্থান</span><span>পরীক্ষার্থী</span><span className="hidden sm:block">বিদ্যালয়</span><span className="text-right">নম্বর</span>
                </div>
                {students.map((student, index) => (
                  <div key={`${student.rank}-${student.name}-${index}`} className="grid grid-cols-[44px_minmax(0,1fr)_70px] items-center gap-3 border-b border-[#edf2ee] px-4 py-4 last:border-0 hover:bg-[#f0faf4] sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_110px] sm:px-6">
                    <span className="text-lg font-bold text-[#416b56]">{index < 3 ? podium[index].medal : student.rank}</span>
                    <div className="min-w-0"><p className="break-words font-bold text-[#17372e]">{student.name || "নাম পাওয়া যায়নি"}</p><p className="mt-1 break-words text-xs text-[#688276] sm:hidden">{student.school || "বিদ্যালয়ের তথ্য নেই"}</p></div>
                    <span className="hidden break-words text-sm text-[#688276] sm:block">{student.school || "বিদ্যালয়ের তথ্য নেই"}</span>
                    <span className="text-right font-bold text-[#08754d]">{student.score}<span className="ml-1 text-xs font-normal text-[#84998d]">/{student.total}</span></span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-[#688276]">অবস্থান নির্ধারণের নিয়ম পরীক্ষার ফলাফল ব্যবস্থাপনা অনুযায়ী প্রযোজ্য।</p>
            </>
          )}
        </section>

        <footer className="mt-14 border-t border-[#dce8e0] pt-8 text-center">
          <p className="text-lg font-bold text-[#174a39]">বাংলা উৎসব ১৪৩৩</p>
          <p className="mt-1 text-sm text-[#688276]">হৃদয়ে বাংলা, সাহিত্য ও সৃজনে</p>
          <div className="mx-auto mt-6 grid max-w-xl gap-5 border-t border-[#dce8e0] pt-5 sm:grid-cols-2">
            <div><p className="text-[11px] uppercase tracking-wide text-[#84998d]">An Initiative of</p><p className="mt-1 font-bold text-[#174a39]">একাডেমিক উপকমিটি</p><p className="text-xs text-[#688276]">বাংলা উৎসব আয়োজক কমিটি</p></div>
            <div><p className="text-[11px] text-[#84998d]">Developed & Maintained by</p><p className="mt-1 font-bold text-[#174a39]">তথ্যপ্রযুক্তি উপকমিটি</p><p className="text-xs text-[#688276]">বাংলা উৎসব আয়োজক কমিটি</p></div>
          </div>
          <p className="mt-6 text-sm text-[#688276]">আয়োজনে: সূচনা ছাত্র সংগঠন</p>
          <p className="mt-2 text-xs text-[#91a397]">© ২০২৬ · বাংলা উৎসব · সর্বস্বত্ব সংরক্ষিত</p>
        </footer>
      </div>
    </main>
  );
}
