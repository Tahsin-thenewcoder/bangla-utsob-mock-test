
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpenCheck, CalendarDays, Clock3, RefreshCw } from "lucide-react";

const classes = [
  {
    id: "6",
    title: "ষষ্ঠ শ্রেণি",
    group: "ক বিভাগ",
    detail: "ষষ্ঠ শ্রেণির শিক্ষার্থীদের জন্য",
    number: "০১",
  },
  {
    id: "7",
    title: "সপ্তম শ্রেণি",
    group: "খ বিভাগ",
    detail: "সপ্তম শ্রেণির শিক্ষার্থীদের জন্য",
    number: "০২",
  },
  {
    id: "8",
    title: "অষ্টম শ্রেণি",
    group: "গ বিভাগ",
    detail: "অষ্টম শ্রেণির শিক্ষার্থীদের জন্য",
    number: "০৩",
  },
  {
    id: "9-10",
    title: "নবম–দশম শ্রেণি",
    group: "ঘ বিভাগ",
    detail: "নবম ও দশম শ্রেণির শিক্ষার্থীদের জন্য",
    number: "০৪",
  },
];

const guidelines = [
  {
    n: "০১",
    title: "সঠিক তথ্য প্রদান",
    desc: "পরীক্ষার আগে নিজের নিবন্ধন সম্পন্ন করে লগইন করবে।",
  },
  {
    n: "০২",
    title: "নির্ধারিত সময়",
    desc: "প্রতি প্রশ্নের জন্য ১ মিনিট সময়; পরীক্ষার নির্ধারিত শেষ সময় অতিক্রম করা যাবে না।",
  },
  {
    n: "০৩",
    title: "সময় গণনা",
    desc: "পরীক্ষা শুরু করার পর পেজ থেকে বের হলেও নির্ধারিত সময় গণনা চলতে থাকবে।",
  },
  {
    n: "০৪",
    title: "ফলাফল ও লিডারবোর্ড",
    desc: "পরীক্ষা জমা দিলে ব্যক্তিগত ফলাফল দেখতে পারবে। প্রথম প্রচেষ্টা প্রকাশিত হলে লিডারবোর্ডে গণনা হবে; Retake ব্যক্তিগত অনুশীলন।",
  },
];

type ScheduledTest = {
  testId: string;
  year: number;
  title: string;
  startAt: string;
  endAt: string;
  questionsCount: number;
  resultsPublished: boolean;
  archiveVisible: boolean;
};

type ScheduleResponse = {
  success: boolean;
  tests?: ScheduledTest[];
  error?: string;
};

const banglaDigits = (value: string | number) =>
  String(value).replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

const dhakaDate = (value: string) =>
  new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka", day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(value));

function testStatus(test: ScheduledTest, now: number) {
  const start = Date.parse(test.startAt);
  const end = Date.parse(test.endAt);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "অনির্ধারিত";
  if (test.resultsPublished && now >= end) return "ফলাফল প্রকাশিত";
  if (now < start) return "আসন্ন";
  if (now < end) return "চলমান";
  return "পরীক্ষা শেষ";
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tests, setTests] = useState<ScheduledTest[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [reloadSchedule, setReloadSchedule] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchSchedule() {
      setScheduleLoading(true);
      setScheduleError("");
      try {
        const response = await fetch("/api/schedule", {
          cache: "no-store", signal: controller.signal,
        });
        const data: ScheduleResponse = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.tests)) {
          throw new Error(data.error || "সময়সূচি পাওয়া যাচ্ছে না।");
        }
        if (!controller.signal.aborted) setTests(data.tests);
      } catch (error) {
        if (!controller.signal.aborted) {
          setScheduleError(error instanceof Error ? error.message : "সময়সূচি পাওয়া যাচ্ছে না।");
        }
      } finally {
        if (!controller.signal.aborted) setScheduleLoading(false);
      }
    }
    void fetchSchedule();
    return () => controller.abort();
  }, [reloadSchedule]);

  const closeMenu = () => setMenuOpen(false);
  const scrollToClasses = () => {
    setMenuOpen(false);
    document.getElementById("classes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToGuidelines = () => {
  setMenuOpen(false);

  document.getElementById("guidelines")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  return (
    <main
      className="min-h-screen bg-white text-[#172b31]"
      style={{
        fontFamily:
          'SolaimanLipi, "Noto Sans Bengali", sans-serif',
      }}
    >
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#e4eee8] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#08754d] shadow-sm sm:h-11 sm:w-11">
  <BookOpenCheck
    size={24}
    strokeWidth={1.8}
    className="text-white"
  />
</div>

            <div className="min-w-0">
              <p className="text-base font-bold leading-tight sm:text-lg">
                বাংলা উৎসব
              </p>
              <p className="text-[11px] text-[#58756b] sm:text-xs">
                প্রস্তুতিমূলক পরীক্ষা
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <button
            onClick={scrollToClasses}
              
              className="text-[#47675d] transition hover:text-[#08754d]"
            >
              মডেল টেস্ট
            </button>

            <button
  type="button"
  onClick={scrollToGuidelines}
  className="text-[#47675d] transition hover:text-[#08754d]"
>
  নির্দেশনা
</button>
            <Link
              href="/leaderboard"
              className="rounded-xl border border-[#cfe3d9] px-5 py-2.5 text-[#08754d] transition hover:bg-[#f0faf5]"
            >
              লিডারবোর্ড ↗
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#08754d] px-5 py-2.5 text-white transition hover:bg-[#065f40]"
            >
              আমার ড্যাশবোর্ড
            </Link>
          </nav>

          {/* MOBILE NAVIGATION */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#08754d] px-3 py-2 text-xs font-bold text-white"
            >
              ড্যাশবোর্ড
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "মেনু বন্ধ করো" : "মেনু খোলো"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce9e1] text-[#174a39]"
            >
              {menuOpen ? (
                <span className="text-2xl leading-none">×</span>
              ) : (
                <span className="text-xl leading-none">☰</span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="border-t border-[#e4eee8] bg-white px-5 py-3 shadow-lg md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 text-sm font-semibold">
              <button
                type="button"
                onClick={scrollToClasses}
                className="rounded-lg px-3 py-3 text-left text-[#174a39] hover:bg-[#f0faf5]"
              >
                মডেল টেস্ট
              </button>

              <button
  type="button"
  onClick={scrollToGuidelines}
  className="w-full rounded-lg px-3 py-3 text-left text-[#174a39] hover:bg-[#f0faf5]"
>
  পরীক্ষার নির্দেশনা
</button>

              <Link
                href="/leaderboard"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-[#174a39] hover:bg-[#f0faf5]"
              >
                লিডারবোর্ড
              </Link>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 font-bold text-[#08754d] hover:bg-[#f0faf5]"
              >
                আমার ড্যাশবোর্ড
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#e8f1eb] bg-[#f7fbf8]">
        <div className="pointer-events-none absolute -right-28 -top-32 h-72 w-72 rounded-full border-[38px] border-[#e6f4eb]" />

        <div className="pointer-events-none absolute -bottom-36 -left-32 h-72 w-72 rounded-full border-[35px] border-[#edf5ed]" />

        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center sm:py-14 lg:py-16">
          <p className="mx-auto inline-flex max-w-full items-center justify-center rounded-full border border-[#cfe5d6] bg-white px-4 py-2 text-center text-xs font-semibold text-[#08754d] sm:text-sm">
            সূচনা ছাত্র সংগঠনের আয়োজনে · বাংলা উৎসব ২০২৭
          </p>

          <h1 className="mx-auto mt-5 max-w-5xl font-bold leading-[1.3] tracking-tight text-[#153b32]">
            <span className="block text-4xl sm:text-5xl lg:text-[54px]">
              বাংলা উৎসব
            </span>

            <span className="mt-2 block text-2xl text-[#08754d] sm:text-3xl lg:text-[38px]">
              বাংলা ভাষা ও সাহিত্য অলিম্পিয়াড
            </span>

            <span className="mt-2 block text-3xl sm:text-4xl lg:text-[44px]">
              প্রস্তুতিমূলক পরীক্ষা
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#587168] sm:text-base sm:leading-8">
            ঘরে বসেই বাংলা ভাষা ও সাহিত্য বিষয়ে নিজের জ্ঞান ও
            প্রস্তুতি যাচাই করো। শ্রেণি নির্বাচন করে পরীক্ষায় অংশ
            নাও, ফলাফল জানো এবং লিডারবোর্ডে নিজের অবস্থান দেখো।
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToClasses}
              className="w-full rounded-xl bg-[#08754d] px-8 py-3 text-center font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#065f40] sm:w-auto"
            >
              পরীক্ষা শুরু করো →
            </button>

           <button
  type="button"
  onClick={scrollToGuidelines}
  className="w-full rounded-xl border border-[#cbded3] bg-white px-8 py-3 text-center font-bold text-[#174d3a] transition hover:bg-[#eff8f2] sm:w-auto"
>
  পরীক্ষার নির্দেশনা দেখো
</button>
            <Link
              href="/leaderboard"
              className="w-full rounded-xl border border-[#cbded3] bg-white px-8 py-3 text-center font-bold text-[#174d3a] transition hover:bg-[#eff8f2] sm:w-auto"
            >
              লিডারবোর্ড দেখো
            </Link>
            <Link
              href="/dashboard"
              className="w-full rounded-xl border border-[#cbded3] bg-white px-8 py-3 text-center font-bold text-[#08754d] transition hover:bg-[#eff8f2] sm:w-auto"
            >
              আমার ড্যাশবোর্ড
            </Link>
          </div>

          <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#dceae1] pt-4 text-xs text-[#587168] sm:text-sm">
            <span>✓ বহুনির্বাচনি প্রশ্ন</span>
            <span>✓ নির্ধারিত সময়</span>
            <span>✓ তাৎক্ষণিক ফলাফল</span>
          </div>
        </div>
      </section>

      {/* LIVE TEST SCHEDULE — sourced from ExamConfig */}
      <section id="schedule" className="scroll-mt-24 border-b border-[#e5eee8] bg-[#f6faf7]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#08754d]">২০২৭ সালের পরীক্ষাসূচি</p>
              <h2 className="mt-2 text-2xl font-bold text-[#153b32] sm:text-3xl">মডেল টেস্টের সময়সূচি</h2>
              <p className="mt-2 text-sm text-[#667b72]">সময়সূচি আয়োজকদের ExamConfig থেকে আপডেট হয়। সময় বাংলাদেশ সময় অনুযায়ী।</p>
            </div>
            <button type="button" onClick={() => setReloadSchedule((v) => v + 1)}
              disabled={scheduleLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#cfe3d9] bg-white px-4 py-2.5 text-sm font-bold text-[#08754d] disabled:opacity-50">
              <RefreshCw size={16} className={scheduleLoading ? "animate-spin" : ""} /> সময়সূচি রিফ্রেশ
            </button>
          </div>
          {scheduleLoading ? (
            <div className="rounded-2xl border border-[#dce9e1] bg-white p-8 text-center text-[#667b72]">সময়সূচি লোড হচ্ছে...</div>
          ) : scheduleError ? (
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center text-red-700">{scheduleError}</div>
          ) : tests.length === 0 ? (
            <div className="rounded-2xl border border-[#dce9e1] bg-white p-8 text-center text-[#667b72]">এখনো কোনো মডেল টেস্টের সময়সূচি ঘোষণা করা হয়নি।</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => {
                const status = testStatus(test, now);
                const active = status === "চলমান";
                return (
                  <article key={`${test.year}-${test.testId}`} className="rounded-[22px] border border-[#dce9e1] bg-white p-5 shadow-[0_4px_22px_rgba(17,65,45,0.05)]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-lg bg-[#eaf7ee] px-3 py-1.5 text-sm font-bold text-[#08754d]">{test.testId}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-[#dcfce7] text-[#166534]" : status === "ফলাফল প্রকাশিত" ? "bg-[#e8f1ff] text-[#2454a6]" : "bg-[#f0f3f1] text-[#597267]"}`}>{status}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-[#153b32]">{test.title || `মডেল টেস্ট ${banglaDigits(test.testId.replace(/\D/g, ""))}`}</h3>
                    <p className="mt-2 text-sm text-[#667b72]">{banglaDigits(test.questionsCount)}টি প্রশ্ন · প্রতি প্রশ্নে ১ মিনিট</p>
                    <div className="mt-5 space-y-3 border-t border-[#e5eee8] pt-4 text-sm text-[#4e6a5e]">
                      <p className="flex items-start gap-2"><CalendarDays size={17} className="mt-0.5 shrink-0 text-[#08754d]" /> শুরু: {dhakaDate(test.startAt)}</p>
                      <p className="flex items-start gap-2"><Clock3 size={17} className="mt-0.5 shrink-0 text-[#08754d]" /> শেষ: {dhakaDate(test.endAt)}</p>
                    </div>
                    <p className="mt-4 text-xs leading-6 text-[#71847b]">{active ? "পরীক্ষায় অংশ নিতে নিচের শ্রেণি নির্বাচন করো।" : status === "ফলাফল প্রকাশিত" ? "প্রকাশিত মেধাতালিকা লিডারবোর্ডে দেখো।" : status === "আসন্ন" ? "নির্ধারিত সময় শুরু হলে পরীক্ষা দেওয়া যাবে।" : "এই পরীক্ষার সময়সীমা শেষ হয়েছে।"}</p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CLASS SELECTION */}
      <section
        id="classes"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12 sm:py-16"
      >
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold tracking-wider text-[#08754d]">
              পরীক্ষা নির্বাচন
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              তোমার শ্রেণি বেছে নাও
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#667b72]">
            প্রতিটি শ্রেণির জন্য আলাদা প্রশ্নপত্র। নিজের শ্রেণির
            কার্ডে ক্লিক করে পরীক্ষা শুরু করো।
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((item) => (
            <Link
              key={item.id}
              href={`/exam/${item.id}`}
              className="group flex min-h-56 flex-col rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-[0_4px_22px_rgba(17,65,45,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#62ad87] hover:shadow-[0_16px_36px_rgba(17,65,45,0.11)]"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-[#eaf7ee] px-3 py-1.5 text-sm font-bold text-[#08754d]">
                  {item.group}
                </span>

                <span className="text-sm font-semibold text-[#a7b9ae]">
                  {item.number}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#153b32]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-[#71847b]">
                {item.detail}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-[#edf2ee] pt-4 font-bold text-[#08754d]">
                <span>পরীক্ষায় অংশ নাও</span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf8f1] text-xl transition group-hover:bg-[#08754d] group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* GUIDELINES */}
      <section
        id="guidelines"
        className="scroll-mt-24 border-y border-[#e7efe9] bg-[#f8fbf9]"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_1.15fr] md:items-center">
          <div>
            <p className="text-sm font-bold text-[#08754d]">
              পরীক্ষার আগে জেনে নাও
            </p>

            <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
              সহজ নিয়মে, নিজের প্রস্তুতি যাচাই
            </h2>

            <p className="mt-4 leading-8 text-[#64786e]">
              নিবন্ধন করে লগইন করার পর পরীক্ষা শুরু করো।
              প্রতিটি প্রশ্ন মনোযোগ দিয়ে পড়ো এবং নির্ধারিত
              সময়ের মধ্যে উত্তর জমা দাও।
            </p>

            <Link
              href="/leaderboard"
              className="mt-6 inline-block font-bold text-[#08754d] hover:underline"
            >
              লিডারবোর্ড দেখো →
            </Link>
          </div>

          <div className="grid gap-3">
            {guidelines.map((rule) => (
              <div
                key={rule.n}
                className="flex gap-4 rounded-xl border border-[#e0ebe4] bg-white p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f6ee] font-bold text-[#08754d]">
                  {rule.n}
                </span>

                <div>
                  <h3 className="font-bold text-[#193d32]">
                    {rule.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#667c71]">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e5eee8] bg-white px-5 py-10 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-[#174a39]">
            বাংলা উৎসব ২০২৭
          </h2>

          <p className="mt-1 text-sm text-[#6a8175]">
            হৃদয়ে বাংলা, সাহিত্য ও সৃজনে
          </p>

          <div className="mx-auto mt-7 grid max-w-xl gap-5 border-t border-[#e5eee8] pt-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#84998d]">
                An Initiative of
              </p>

              <p className="mt-1 font-bold text-[#174a39]">
                একাডেমিক উপকমিটি
              </p>

              <p className="mt-1 text-xs text-[#71847b]">
                বাংলা উৎসব আয়োজক কমিটি
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#84998d]">
                Developed & Maintained by
              </p>

              <p className="mt-1 font-bold text-[#174a39]">
                তথ্যপ্রযুক্তি উপকমিটি
              </p>

              <p className="mt-1 text-xs text-[#71847b]">
                সূচনা ছাত্র সংগঠন
              </p>
            </div>
          </div>

          <p className="mt-7 text-sm text-[#587168]">
            আয়োজনে: সূচনা ছাত্র সংগঠন
          </p>

          <p className="mt-3 text-xs text-[#8a9c92]">
            © ২০২৭ · বাংলা উৎসব · সর্বস্বত্ব সংরক্ষিত
          </p>
        </div>
      </footer>
    </main>
  );
}
