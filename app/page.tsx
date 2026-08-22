import Link from "next/link";

const classes = [
  {
    title: "ষষ্ঠ শ্রেণি",
    subtitle: "৬ষ্ঠ",
    emoji: "🧒",
    link: "/exam/6",
  },
  {
    title: "সপ্তম শ্রেণি",
    subtitle: "৭ম",
    emoji: "👦",
    link: "/exam/7",
  },
  {
    title: "অষ্টম শ্রেণি",
    subtitle: "৮ম",
    emoji: "🧑",
    link: "/exam/8",
  },
  {
    title: "নবম–দশম শ্রেণি",
    subtitle: "৯ম–১০ম",
    emoji: "🧑‍🎓",
    link: "/exam/9-10",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf3] text-slate-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white shadow-md">
              বাংলা
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                বাংলা উৎসব
              </h1>

              <p className="text-xs text-slate-500">
                প্রস্তুতিমূলক মডেল টেস্ট
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
  <a href="#" className="text-orange-600">
    মডেল টেস্ট
  </a>

  <Link
    href="/leaderboard"
    className="text-slate-700 transition hover:text-orange-500"
  >
    🏆 লিডারবোর্ড
  </Link>

  <a
    href="#rules"
    className="text-slate-600 transition hover:text-orange-600"
  >
    📋 নিয়মাবলি
  </a>

  <Link
    href="/leaderboard"
    className="text-slate-600 transition hover:text-orange-600"
  >
    📊 আমার ফলাফল
  </Link>
</div>

          <Link
            href="#classes"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            শুরু করুন
          </Link>

        </div>
      </nav>


      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Decorative shapes */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />

        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:pt-28">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 shadow-sm">

              ✨ বাংলা উৎসব ১৪৩৩

              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

              প্রস্তুতির নতুন অধ্যায়

            </div>

            <h2 className="text-5xl font-black leading-tight tracking-tight sm:text-7xl">

              প্রস্তুতি হোক

              <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-emerald-600 bg-clip-text text-transparent">
                আরও এক ধাপ এগিয়ে
              </span>

            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              বাংলা উৎসবের মূল পরীক্ষার আগে নিজের প্রস্তুতি যাচাই করুন।
              অনলাইন মডেল টেস্টে অংশ নিন, ফলাফল দেখুন এবং লিডারবোর্ডে
              নিজের অবস্থান জেনে নিন।
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href="#classes"
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-7 py-4 font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                🚀 মডেল টেস্ট শুরু করুন
              </Link>

              <Link
                href="/leaderboard"
                className="rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                🏆 লিডারবোর্ড দেখুন
              </Link>

            </div>

          </div>


          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">

            <div className="rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-orange-500">
                ৪
              </div>

              <div className="mt-1 text-sm text-slate-500">
                বিভাগ
              </div>
            </div>


            <div className="rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-emerald-600">
                MCQ
              </div>

              <div className="mt-1 text-sm text-slate-500">
                প্রশ্নের ধরন
              </div>
            </div>


            <div className="rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-blue-600">
                ⏱
              </div>

              <div className="mt-1 text-sm text-slate-500">
                সময় নির্ধারিত
              </div>
            </div>


            <div className="rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-purple-600">
                🏆
              </div>

              <div className="mt-1 text-sm text-slate-500">
                লিডারবোর্ড
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* Class Selection */}
      <section
        id="classes"
        className="mx-auto max-w-7xl px-5 py-20"
      >

        <div className="mb-10 text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Choose Your Category
          </p>

          <h3 className="mt-2 text-3xl font-black sm:text-4xl">
            তোমার শ্রেণি নির্বাচন করো
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            তোমার শ্রেণি অনুযায়ী প্রস্তুতিমূলক মডেল টেস্টে অংশ নাও।
          </p>

        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {classes.map((item, index) => (

            <Link
              key={item.title}
              href={item.link}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
            >

              {/* Decorative circle */}
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-orange-50 transition group-hover:bg-orange-100" />


              <div className="relative">

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl transition group-hover:scale-110">
                    {item.emoji}
                  </div>

                  <span className="text-sm font-bold text-slate-300">
                    0{index + 1}
                  </span>

                </div>


                <h4 className="text-xl font-bold">
                  {item.title}
                </h4>


                <p className="mt-2 text-sm text-slate-500">
                  প্রস্তুতিমূলক মডেল টেস্ট
                </p>


                <div className="mt-6 font-semibold text-orange-500">
                  পরীক্ষা শুরু করুন →
                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* Features */}
      <section className="border-y border-orange-100 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-20">

          <div className="grid gap-6 md:grid-cols-3">


            {/* Exam */}
            <div className="rounded-3xl bg-orange-50 p-7">

              <div className="text-3xl">
                📝
              </div>

              <h3 className="mt-5 text-xl font-bold">
                অনলাইনে পরীক্ষা
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                নির্দিষ্ট সময়ের মধ্যে MCQ পরীক্ষায় অংশগ্রহণ করো।
              </p>

            </div>


            {/* Result */}
            <div
              id="result"
              className="rounded-3xl bg-emerald-50 p-7"
            >

              <div className="text-3xl">
                📊
              </div>

              <h3 className="mt-5 text-xl font-bold">
                তাৎক্ষণিক ফলাফল
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                পরীক্ষা শেষ হওয়ার পরপরই নিজের প্রাপ্ত নম্বর জানতে পারবে।
              </p>

            </div>


            {/* Leaderboard */}
            <div
              id="leaderboard"
              className="rounded-3xl bg-blue-50 p-7"
            >

              <div className="text-3xl">
                🏆
              </div>

              <h3 className="mt-5 text-xl font-bold">
                লিডারবোর্ড
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                নাম, শ্রেণি ও বিদ্যালয়সহ নিজের অবস্থান দেখো।
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Rules */}
      <section
        id="rules"
        className="mx-auto max-w-4xl px-5 py-20 text-center"
      >

        <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
          Good Luck
        </p>

        <h3 className="mt-2 text-3xl font-black">
          প্রস্তুত তো?
        </h3>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
          নিজের জ্ঞান যাচাই করো, ভুলগুলো থেকে শেখো এবং বাংলা উৎসবের
          মূল পরীক্ষার জন্য নিজেকে প্রস্তুত করো।
        </p>

      </section>


      {/* Footer */}
      <footer className="bg-slate-950 px-5 py-10 text-center text-slate-400">

        <p className="font-semibold text-white">
          বাংলা উৎসব ১৪৩৩
        </p>

        <p className="mt-2 text-sm">
          প্রস্তুতি হোক আনন্দে, অংশগ্রহণ হোক উৎসবে।
        </p>

        <p className="mt-6 text-xs text-slate-500">
          © 2026 বাংলা উৎসব · সূচনা ছাত্র সংগঠন
        </p>

      </footer>

    </main>
  );
}