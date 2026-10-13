import Link from "next/link";

const classes = [
  { id: "6", title: "ষষ্ঠ শ্রেণি", group: "ক বিভাগ", detail: "ষষ্ঠ শ্রেণির শিক্ষার্থীদের জন্য", number: "০১" },
  { id: "7", title: "সপ্তম শ্রেণি", group: "খ বিভাগ", detail: "সপ্তম শ্রেণির শিক্ষার্থীদের জন্য", number: "০২" },
  { id: "8", title: "অষ্টম শ্রেণি", group: "গ বিভাগ", detail: "অষ্টম শ্রেণির শিক্ষার্থীদের জন্য", number: "০৩" },
  { id: "9-10", title: "নবম–দশম শ্রেণি", group: "ঘ বিভাগ", detail: "নবম ও দশম শ্রেণির শিক্ষার্থীদের জন্য", number: "০৪" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#172b31]" style={{ fontFamily: 'SolaimanLipi, "Noto Sans Bengali", sans-serif' }}>
      <header className="sticky top-0 z-30 border-b border-[#e4eee8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#08754d] text-xl font-bold text-white">ব</div>
            <div className="min-w-0"><p className="text-lg font-bold leading-tight">বাংলা উৎসব</p><p className="text-xs text-[#58756b]">প্রস্তুতিমূলক মডেল টেস্ট</p></div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-5 text-sm font-semibold">
            <Link href="#classes" className="hidden text-[#47675d] hover:text-[#08754d] sm:inline">মডেল টেস্ট</Link>
            <Link href="#guidelines" className="hidden text-[#47675d] hover:text-[#08754d] md:inline">নির্দেশনা</Link>
            <Link href="/leaderboard" className="rounded-xl border border-[#cfe3d9] px-3 py-2 text-[#08754d] transition hover:bg-[#f0faf5] sm:px-5">লিডারবোর্ড ↗</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#e8f1eb] bg-[#f7fbf8]">
        <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full border-[45px] border-[#e6f4eb]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full border-[40px] border-[#edf5ed]" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 text-center sm:py-24">
          <p className="mx-auto inline-flex items-center rounded-full border border-[#cfe5d6] bg-white px-5 py-2 text-sm font-semibold text-[#08754d]">সূচনা ছাত্র সংগঠনের আয়োজন · বাংলা উৎসব ১৪৩৩</p>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-[1.35] tracking-tight text-[#153b32] sm:text-6xl">
            বাংলা উৎসব <span className="text-[#08754d]">প্রস্তুতিমূলক</span><br />মডেল টেস্ট
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#587168] sm:text-lg">বাংলা ভাষা ও সাহিত্য বিষয়ে নিজের প্রস্তুতি যাচাই করো। শ্রেণি নির্বাচন করে পরীক্ষায় অংশ নাও, ফলাফল জানো এবং লিডারবোর্ডে নিজের অবস্থান দেখো।</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#classes" className="w-full rounded-xl bg-[#08754d] px-8 py-3.5 text-center font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#065f40] sm:w-auto">পরীক্ষা শুরু করো <span aria-hidden>→</span></Link>
            <Link href="/leaderboard" className="w-full rounded-xl border border-[#cbded3] bg-white px-8 py-3.5 text-center font-bold text-[#174d3a] transition hover:bg-[#eff8f2] sm:w-auto">ফলাফলের তালিকা দেখো</Link>
          </div>
          <div className="mx-auto mt-12 flex max-w-xl flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-[#dceae1] pt-6 text-sm text-[#587168]">
            <span>✓ বহুনির্বাচনি প্রশ্ন</span><span>✓ নির্ধারিত সময়</span><span>✓ তাৎক্ষণিক ফলাফল</span>
          </div>
        </div>
      </section>

      <section id="classes" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:py-20">
        <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><p className="text-sm font-bold tracking-wider text-[#08754d]">পরীক্ষা নির্বাচন</p><h2 className="mt-2 text-3xl font-bold sm:text-4xl">তোমার শ্রেণি বেছে নাও</h2></div>
          <p className="max-w-sm text-sm leading-7 text-[#667b72]">প্রতিটি শ্রেণির জন্য আলাদা প্রশ্নপত্র। নিজের শ্রেণির কার্ডে ক্লিক করে পরীক্ষা শুরু করো।</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((item) => (
            <Link key={item.id} href={`/exam/${item.id}`} className="group flex min-h-64 flex-col rounded-2xl border border-[#dce9e1] bg-white p-6 shadow-[0_4px_22px_rgba(17,65,45,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#62ad87] hover:shadow-[0_16px_36px_rgba(17,65,45,0.11)]">
              <div className="flex items-start justify-between"><span className="rounded-lg bg-[#eaf7ee] px-3 py-1.5 text-sm font-bold text-[#08754d]">{item.group}</span><span className="text-sm font-semibold text-[#a7b9ae]">{item.number}</span></div>
              <h3 className="mt-8 text-2xl font-bold text-[#153b32]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#71847b]">{item.detail}</p>
              <div className="mt-auto flex items-center justify-between border-t border-[#edf2ee] pt-5 font-bold text-[#08754d]"><span>পরীক্ষায় অংশ নাও</span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf8f1] text-xl transition group-hover:bg-[#08754d] group-hover:text-white">→</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section id="guidelines" className="scroll-mt-24 border-y border-[#e7efe9] bg-[#f8fbf9]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.15fr] md:items-center">
          <div><p className="text-sm font-bold text-[#08754d]">পরীক্ষার আগে জেনে নাও</p><h2 className="mt-2 text-3xl font-bold leading-snug">সহজ নিয়মে, নিজের প্রস্তুতি যাচাই</h2><p className="mt-4 leading-8 text-[#64786e]">নাম ও বিদ্যালয়ের তথ্য দিয়ে পরীক্ষা শুরু করো। প্রতিটি প্রশ্ন মনোযোগ দিয়ে পড়ো এবং নির্ধারিত সময়ের মধ্যে উত্তর জমা দাও।</p><Link href="/leaderboard" className="mt-6 inline-block font-bold text-[#08754d] hover:underline">লিডারবোর্ড দেখো →</Link></div>
          <div className="grid gap-3">
            {[{n:"০১",title:"নাম ও বিদ্যালয়",desc:"পরীক্ষা শুরুর আগে নিজের সঠিক তথ্য লিখবে।"},{n:"০২",title:"প্রশ্ন অনুযায়ী সময়",desc:"৫টি প্রশ্নে ৫ মিনিট, ২০টি প্রশ্নে ২০ মিনিট—প্রতি প্রশ্নে ১ মিনিট।"},{n:"০৩",title:"ফলাফল ও পুনরায় চেষ্টা",desc:"জমা দেওয়ার পর ফলাফল ও সঠিক উত্তর দেখতে পারবে। লিডারবোর্ডে শুধু প্রথম প্রচেষ্টার ফলাফল গণনা হবে।"}].map((rule)=>(<div key={rule.n} className="flex gap-4 rounded-xl border border-[#e0ebe4] bg-white p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f6ee] font-bold text-[#08754d]">{rule.n}</span><div><h3 className="font-bold text-[#193d32]">{rule.title}</h3><p className="mt-1 text-sm leading-6 text-[#667c71]">{rule.desc}</p></div></div>))}
          </div>
        </div>
      </section>

      <footer className="bg-white px-5 py-10 text-center"><p className="font-bold text-[#174a39]">বাংলা উৎসব ১৪৩৩</p><p className="mt-2 text-sm text-[#6a8175]">হৃদয়ে বাংলা, সাহিত্য ও সৃজনে</p><p className="mt-5 text-xs text-[#8a9c92]">© ২০২৬ · সূচনা ছাত্র সংগঠন</p></footer>
    </main>
  );
}
