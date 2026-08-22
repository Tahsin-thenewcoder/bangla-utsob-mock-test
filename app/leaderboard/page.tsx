"use client";

import { useEffect, useState } from "react";

type Student = {
  name: string;
  school: string;
  score: number;
};

const leaderboardApis = {
  "6": "https://script.google.com/macros/s/AKfycbybkfp7ZLO5CiD9CPSNJuKX5dSIlIJGDCkt4338qaon1DnRZex5DoKMK3SbWvMtuhIMfA/exec",

  "7": "https://script.google.com/macros/s/AKfycbwQTMe8z1sPNuEqMhAVBXIu2nORmDjVyzLoBnwPR3zh2pwH2qciGfen4eY369xlkeFoSw/exec",

  "8": "https://script.google.com/macros/s/AKfycbxjIAzsFCsUDv7-4dX3Ar6VI3maRam6LbF5-wa35n1ndrLOJhw5TPdRYjyfLr2U9hoZ/exec",

  "9-10":
    "https://script.google.com/macros/s/AKfycbxjhbhh7pdkIS1MlfhV-SoMPPPOFb3smX_mzsViitm71QwBmYU9VRdkh6E_MjebgUBh/exec",
};

const classes = [
  {
    id: "6",
    name: "ষষ্ঠ",
    emoji: "🧒",
  },
  {
    id: "7",
    name: "সপ্তম",
    emoji: "👦",
  },
  {
    id: "8",
    name: "অষ্টম",
    emoji: "🧑",
  },
  {
    id: "9-10",
    name: "নবম–দশম",
    emoji: "🧑‍🎓",
  },
];

export default function LeaderboardPage() {
  const [selectedClass, setSelectedClass] = useState("6");

  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      setError("");
      setStudents([]);

      try {
        const apiUrl =
          leaderboardApis[
            selectedClass as keyof typeof leaderboardApis
          ];

        const response = await fetch(apiUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status}`
          );
        }

        /*
          প্রথমে text হিসেবে নিই।
          কারণ Google Apps Script মাঝে মাঝে সরাসরি JSON
          না দিয়ে HTML/login page পাঠাতে পারে।
        */
        const text = await response.text();

        if (
          text.trim().startsWith("<!") ||
          text.trim().startsWith("<html") ||
          text.trim().startsWith("<HTML")
        ) {
          throw new Error(
            "Google Apps Script থেকে JSON পাওয়া যায়নি। Web App access check করুন।"
          );
        }

        let data: unknown;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Leaderboard API থেকে ভুল data পাওয়া গেছে।"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Leaderboard data একটি list নয়।"
          );
        }

        const formattedData: Student[] = data
          .map((student: any) => ({
            name: String(student?.name ?? "").trim(),

            school: String(student?.school ?? "").trim(),

            score: Number(student?.score ?? 0),
          }))
          .filter(
            (student: Student) =>
              student.name !== ""
          )
          .sort(
            (a: Student, b: Student) =>
              b.score - a.score
          );

        setStudents(formattedData);
      } catch (err) {
        console.error(
          "Leaderboard error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Leaderboard লোড করা যাচ্ছে না।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [selectedClass]);

  const currentClass = classes.find(
    (item) => item.id === selectedClass
  );

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}

        <div className="text-center">

          <div className="text-5xl">
            🏆
          </div>

          <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
            লিডারবোর্ড
          </h1>

          <p className="mt-2 text-slate-500">
            বাংলা উৎসব ১৪৩৩ · প্রস্তুতিমূলক মডেল টেস্ট
          </p>

        </div>


        {/* ================= CLASS TABS ================= */}

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

          {classes.map((item) => {

            const active =
              selectedClass === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setSelectedClass(item.id)
                }
                className={`rounded-2xl border p-4 text-center font-bold transition ${
                  active
                    ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >

                <div className="text-2xl">
                  {item.emoji}
                </div>

                <div className="mt-1">
                  {item.name} শ্রেণি
                </div>

              </button>
            );
          })}

        </div>


        {/* ================= CURRENT CLASS ================= */}

        <div className="mt-8 text-center">

          <h2 className="text-2xl font-black text-slate-900">
            {currentClass?.name} শ্রেণি
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            সর্বোচ্চ নম্বর অনুযায়ী সাজানো
          </p>

        </div>


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-lg">

            <div className="text-4xl">
              ⏳
            </div>

            <p className="mt-4 font-semibold text-slate-600">
              ফলাফল লোড হচ্ছে...
            </p>

          </div>
        )}


        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-lg">

            <div className="text-5xl">
              😕
            </div>

            <h3 className="mt-4 text-lg font-black text-slate-800">
              Leaderboard লোড করা যাচ্ছে না
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-red-500">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800"
            >
              আবার চেষ্টা করুন
            </button>

          </div>
        )}


        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          students.length === 0 && (
            <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-lg">

              <div className="text-5xl">
                📋
              </div>

              <p className="mt-4 font-semibold text-slate-600">
                এখনো কোনো ফলাফল পাওয়া যায়নি।
              </p>

            </div>
          )}


        {/* ================= LEADERBOARD ================= */}

        {!loading &&
          !error &&
          students.length > 0 && (
            <>

              {/* ================= TOP 3 ================= */}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">

                {students
                  .slice(0, 3)
                  .map((student, index) => {

                    const medals = [
                      "🥇",
                      "🥈",
                      "🥉",
                    ];

                    return (
                      <div
                        key={`${student.name}-${index}`}
                        className={`rounded-3xl bg-white p-6 text-center shadow-lg ${
                          index === 0
                            ? "border-2 border-orange-300"
                            : "border border-slate-100"
                        }`}
                      >

                        <div className="text-4xl">
                          {medals[index]}
                        </div>

                        <p className="mt-3 font-black text-slate-900">
                          {student.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {student.school}
                        </p>

                        <div className="mt-4 text-3xl font-black text-orange-500">
                          {student.score}
                        </div>

                        <p className="text-xs text-slate-400">
                          নম্বর
                        </p>

                      </div>
                    );
                  })}

              </div>


              {/* ================= FULL LIST ================= */}

              <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl">

                {/* Desktop Header */}

                <div className="hidden grid-cols-[80px_1fr_1fr_100px] gap-4 border-b bg-slate-50 px-6 py-4 text-sm font-bold text-slate-500 sm:grid">

                  <div>
                    Rank
                  </div>

                  <div>
                    নাম
                  </div>

                  <div>
                    বিদ্যালয়
                  </div>

                  <div className="text-right">
                    নম্বর
                  </div>

                </div>


                {/* Students */}

                {students.map(
                  (student, index) => {

                    const rank = index + 1;

                    return (
                      <div
                        key={`${student.name}-${index}`}
                        className="grid grid-cols-[50px_1fr_80px] items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-0 sm:grid-cols-[80px_1fr_1fr_100px] sm:gap-4 sm:px-6"
                      >

                        {/* Rank */}

                        <div className="text-lg font-black text-slate-700">

                          {rank <= 3 ? (
                            <span className="text-2xl">
                              {rank === 1
                                ? "🥇"
                                : rank === 2
                                  ? "🥈"
                                  : "🥉"}
                            </span>
                          ) : (
                            rank
                          )}

                        </div>


                        {/* Name */}

                        <div>

                          <p className="font-bold text-slate-800">
                            {student.name}
                          </p>

                          {/* School on mobile */}

                          <p className="mt-1 text-xs text-slate-500 sm:hidden">
                            {student.school}
                          </p>

                        </div>


                        {/* School on desktop */}

                        <div className="hidden text-sm text-slate-500 sm:block">
                          {student.school}
                        </div>


                        {/* Score */}

                        <div className="text-right">

                          <span className="text-lg font-black text-orange-500">
                            {student.score}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>


              {/* ================= PARTICIPANTS ================= */}

              <p className="mt-5 text-center text-xs text-slate-400">
                মোট অংশগ্রহণকারী:{" "}
                {students.length} জন
              </p>

            </>
          )}

      </div>
    </main>
  );
}