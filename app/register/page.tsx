"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCopy, GraduationCap, KeyRound, ShieldCheck, UserRoundPlus } from "lucide-react";

const classes = [
  { value: "Class_6", label: "ষষ্ঠ শ্রেণি" },
  { value: "Class_7", label: "সপ্তম শ্রেণি" },
  { value: "Class_8", label: "অষ্টম শ্রেণি" },
  { value: "Class_9_10", label: "নবম–দশম শ্রেণি" },
];

type RegisterResponse = { success?: boolean; studentId?: string; error?: string };

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState("");
  const [copied, setCopied] = useState(false);

  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (!name.trim() || !school.trim() || !studentClass) {
      setError("নাম, বিদ্যালয় ও শ্রেণি পূরণ করো।");
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      setError("PIN অবশ্যই ইংরেজি অঙ্কে ৬ সংখ্যার হতে হবে।");
      return;
    }
    if (pin !== confirmPin) {
      setError("দুইবার লেখা PIN মিলছে না।");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ action: "register", name: name.trim(), school: school.trim(), class: studentClass, pin }),
      });
      const data: RegisterResponse = await response.json();
      if (!response.ok || !data.success || !data.studentId) {
        throw new Error(data.error || "নিবন্ধন সম্পন্ন হয়নি। আবার চেষ্টা করো।");
      }
      setStudentId(data.studentId);
      setPin("");
      setConfirmPin("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না।");
    } finally {
      setLoading(false);
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(studentId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9f1] text-slate-800" style={{ fontFamily: "SolaimanLipi, sans-serif" }}>
      <div className="bg-[#063f32] text-[#f8edca]">
  <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-5">
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold hover:text-white"
    >
      <ArrowLeft size={17} />
      মূল পাতা
    </Link>

    <span className="text-right text-xs font-semibold sm:text-sm">
      <span className="hidden sm:inline">
        সূচনা ছাত্র সংগঠন · মডেল টেস্ট
      </span>
      <span className="sm:hidden">বাংলা উৎসব</span>
    </span>
  </div>
</div>

      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_15%,#0d654c_0%,#064433_52%,#04372b_100%)] px-5 pb-28 pt-8 text-[#fff8e5] sm:pb-32">
        <div className="pointer-events-none absolute -right-16 -top-36 h-80 w-80 rounded-full border-[48px] border-[#e7d49a]/10" />
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full border-[36px] border-[#e7d49a]/[0.06]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#033c2f]/70 to-transparent" />
        <div className="pointer-events-none absolute -bottom-44 -left-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/20 bg-white/10">
            <UserRoundPlus size={27} />
          </div>
          <p className="mb-2 text-sm font-semibold text-[#e9dfb8]">বাংলা উৎসব | মডেল টেস্ট</p>
          <h1 className="text-center text-[29px] font-extrabold leading-tight tracking-tight text-[#f9edc9] sm:text-5xl">পরীক্ষার্থী নিবন্ধন</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#fff8e5]/85 sm:text-base">
            বাংলা উৎসবের প্রস্তুতিমূলক মডেল টেস্টে অংশ নিতে ২০২৬ সালের জন্য তোমার পরীক্ষার্থী আইডি তৈরি করো।
          </p>
        </div>
      </div>

      <div className="relative mx-auto -mt-16 max-w-2xl px-4 pb-16 sm:px-6">
        <section className="rounded-[26px] border border-[#e3e9dc] bg-[#fffefb] p-5 shadow-[0_24px_70px_rgba(6,63,50,0.13)] sm:p-9">
          {studentId ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={34} />
              </div>
              <h2 className="text-2xl font-extrabold text-[#063f32]">নিবন্ধন সফল!</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">তোমার পরীক্ষার্থী আইডি তৈরি হয়েছে। এটি নিরাপদে লিখে রাখো।</p>
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold text-emerald-800">তোমার Student ID</p>
                <p className="mt-2 break-all font-mono text-2xl font-extrabold tracking-wide text-[#063f32] sm:text-3xl">{studentId}</p>
                <button type="button" onClick={copyId} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#087354] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#075d46]">
                  <ClipboardCopy size={17} /> {copied ? "কপি হয়েছে" : "আইডি কপি করো"}
                </button>
              </div>
              <p className="mt-5 text-sm leading-7 text-amber-800">ID এবং PIN কাউকে দেবে না। PIN ভুলে গেলে এই পেজ থেকে উদ্ধার করা যাবে না।</p>
              <Link href="/login" className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07543f] to-[#0a7655] px-5 py-4 text-center font-extrabold text-[#fff8e5] transition hover:from-[#064632] hover:to-[#07563e]">
                <span>Login করে পরীক্ষায় অংশ নাও</span><ArrowRight size={19} />
              </Link>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Link href="/" className="flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-3 font-bold text-emerald-800 hover:bg-emerald-50">মূল পাতায় যাও</Link>
                <button type="button" onClick={() => { setStudentId(""); setName(""); setSchool(""); setStudentClass(""); setCopied(false); }} className="flex items-center justify-center gap-2 rounded-xl border border-[#b9d5c7] px-4 py-3 font-bold text-emerald-800 hover:bg-emerald-50">নতুন নিবন্ধন <ArrowRight size={17} /></button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-7 flex items-start gap-3 rounded-2xl border-b border-[#e8ecdf] bg-[#f2f7ef] p-4 sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dceedd] text-[#064c36]"><GraduationCap size={23} /></div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#063f32]">তোমার তথ্য দাও</h2>
                  <p className="mt-1 text-sm leading-6 text-[#506b5e]">সঠিক নাম ও বিদ্যালয়ের নাম লিখবে। নিবন্ধনের পর এই তথ্য দিয়েই ফলাফল দেখানো হবে।</p>
                </div>
              </div>
              <form onSubmit={register} className="space-y-5">
                <div>
                  <label htmlFor="student-name" className="mb-2 block text-sm font-bold">শিক্ষার্থীর পূর্ণ নাম <span className="text-red-600">*</span></label>
                  <input id="student-name" required maxLength={100} autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="তোমার পূর্ণ নাম লিখো" className="w-full rounded-xl border border-[#dce5df] bg-[#f8faf9] px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div>
                  <label htmlFor="student-school" className="mb-2 block text-sm font-bold">বিদ্যালয়ের নাম <span className="text-red-600">*</span></label>
                  <input id="student-school" required maxLength={160} value={school} onChange={e => setSchool(e.target.value)} placeholder="তোমার বিদ্যালয়ের নাম লিখো" className="w-full rounded-xl border border-[#dce5df] bg-[#f8faf9] px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div>
                  <label htmlFor="student-class" className="mb-2 block text-sm font-bold">শ্রেণি নির্বাচন <span className="text-red-600">*</span></label>
                  <select id="student-class" required value={studentClass} onChange={e => setStudentClass(e.target.value)} className="w-full rounded-xl border border-[#dce5df] bg-[#f8faf9] px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100">
                    <option value="">তোমার শ্রেণি বেছে নাও</option>
                    {classes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="student-pin" className="mb-2 flex items-center gap-1.5 text-sm font-bold"><KeyRound size={15} /> ৬ সংখ্যার PIN <span className="text-red-600">*</span></label>
                    <input id="student-pin" required type={visible ? "text" : "password"} inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} autoComplete="new-password" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" className="w-full rounded-xl border border-[#dce5df] bg-[#f8faf9] px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
                  </div>
                  <div>
                    <label htmlFor="student-confirm-pin" className="mb-2 block text-sm font-bold">PIN আবার লেখো <span className="text-red-600">*</span></label>
                    <input id="student-confirm-pin" required type={visible ? "text" : "password"} inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} autoComplete="new-password" value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" className="w-full rounded-xl border border-[#dce5df] bg-[#f8faf9] px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
                  </div>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} className="h-4 w-4 accent-emerald-700" /> PIN দেখাও</label>
                <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-900">
                  <ShieldCheck className="mt-0.5 shrink-0" size={20} />
                  <p>PIN মনে রাখবে এবং অন্য কাউকে জানাবে না। একই নাম, বিদ্যালয় ও শ্রেণি দিয়ে দ্বিতীয়বার নিবন্ধন নাও হতে পারে।</p>
                </div>
                {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07543f] to-[#0a6a4e] px-5 py-4 font-extrabold text-[#fff8e5] shadow-lg shadow-emerald-900/10 transition hover:from-[#064632] hover:to-[#07563e] disabled:cursor-wait disabled:opacity-60">
                  {loading ? "নিবন্ধন করা হচ্ছে..." : "নিবন্ধন সম্পন্ন করো"} {!loading && <ArrowRight size={19} />}
                </button>
              </form>
            </>
          )}
        </section>
        <p className="mt-7 text-center text-xs leading-6 text-[#647568]">বাংলা উৎসব প্রস্তুতিমূলক মডেল টেস্ট · সূচনা ছাত্র সংগঠন</p>
      </div>
    </main>
  );
}
