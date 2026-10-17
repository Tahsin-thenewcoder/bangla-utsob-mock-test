'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { LayoutDashboard } from "lucide-react";

type Student = { studentId:string; name:string; school:string; className:string; year:number };
const labels:Record<string,string> = {Class_6:'ষষ্ঠ শ্রেণি',Class_7:'সপ্তম শ্রেণি',Class_8:'অষ্টম শ্রেণি',Class_9_10:'নবম–দশম শ্রেণি'};
function getExamPath(className: string): string | null {
  const paths: Record<string, string> = {
    Class_6: '/exam/6',
    Class_7: '/exam/7',
    Class_8: '/exam/8',
    Class_9_10: '/exam/9-10',
  };

  return paths[className] ?? null;
}
export default function LoginPage() {
  const [studentId,setStudentId] = useState('');
  const [pin,setPin] = useState('');
  const [showPin,setShowPin] = useState(false);
  const [loading,setLoading] = useState(false);
  const [checking,setChecking] = useState(true);
  const [error,setError] = useState('');
  const [student,setStudent] = useState<Student|null>(null);
  useEffect(() => {
    let active = true;
    fetch('/api/auth/me',{cache:'no-store'}).then(r => r.ok?r.json():null).then(data => {if(active && data?.success) setStudent(data.student);}).catch(()=>{}).finally(()=>{if(active)setChecking(false);});
    return ()=>{active=false;};
  },[]);
  async function login(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(loading)return;
    setLoading(true);setError('');
    try {
      const response = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:studentId.trim().toUpperCase(),pin}),cache:'no-store'});
      const data = await response.json();
      if(!response.ok || !data.success) throw new Error(data.error || 'Login হয়নি।');
      setStudent(data.student);setPin('');
    } catch(e) {setError(e instanceof Error?e.message:'যোগাযোগে সমস্যা হয়েছে।');}
    finally {setLoading(false);}
  }
  async function logout() {
    setLoading(true);setError('');
    try {
      const response=await fetch('/api/auth/logout',{method:'POST'});
      if(!response.ok) throw new Error('Logout হয়নি।');
      setStudent(null);setStudentId('');setPin('');
    } catch(e) {setError(e instanceof Error?e.message:'Logout হয়নি।');}
    finally {setLoading(false);}
  }
  return <main className="min-h-screen bg-[#f8f9f1] text-[#123c30]" style={{fontFamily:'SolaimanLipi, sans-serif'}}>
    <nav className="bg-[#063f32] text-[#f8edca]"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
      <Link href="/" className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold hover:text-white"><ArrowLeft size={17}/> মূল পাতা</Link>
      <span className="text-right text-xs font-semibold sm:text-sm"><span className="sm:hidden">বাংলা উৎসব</span><span className="hidden sm:inline">সূচনা ছাত্র সংগঠন · বাংলা উৎসব · মডেল টেস্ট</span></span>
    </div></nav>
    <header className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_15%,#0d654c_0%,#064433_52%,#04372b_100%)] px-4 pb-24 pt-8 text-center text-[#fff8e5] sm:pb-32 sm:pt-12">
      <div className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full border-[38px] border-[#e7d49a]/10"/>
      <div className="pointer-events-none absolute -left-32 top-16 h-60 w-60 rounded-full border-[30px] border-[#e7d49a]/[0.06]"/>
      <div className="relative mx-auto max-w-xl"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 sm:h-14 sm:w-14"><LogIn size={25}/></div>
        <p className="text-sm font-semibold text-[#e9dfb8]">বাংলা উৎসব | মডেল টেস্ট</p><h1 className="mt-2 text-[30px] font-extrabold leading-tight text-[#f9edc9] sm:text-5xl">পরীক্ষার্থী প্রবেশ</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#fff8e5]/85 sm:text-base">তোমার Student ID ও PIN দিয়ে অ্যাকাউন্টে প্রবেশ করো।</p>
      </div>
    </header>
    <div className="relative mx-auto -mt-14 max-w-xl px-4 pb-14 sm:px-6"><section className="rounded-[26px] border border-[#e3e9dc] bg-[#fffefb] p-5 shadow-[0_24px_70px_rgba(6,63,50,0.13)] sm:p-9">
      {checking ? <p className="py-10 text-center text-sm text-slate-600">Session যাচাই করা হচ্ছে...</p> : student ? <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={34}/></div>
        <h2 className="text-2xl font-extrabold">স্বাগতম, {student.name}!</h2><p className="mt-2 text-sm text-slate-600">তুমি সফলভাবে Login করেছ।</p>
        <div className="mt-6 space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left text-sm"><p><b>Student ID:</b> {student.studentId}</p><p><b>বিদ্যালয়:</b> {student.school}</p><p><b>শ্রেণি:</b> {labels[student.className] || student.className}</p><p><b>বছর:</b> {student.year}</p></div>
        
<div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-left text-sm leading-6 text-amber-900">
  <ShieldCheck className="mt-0.5 shrink-0" size={18} />
  <span>
    তোমার পরিচয় যাচাই সম্পন্ন হয়েছে। এখন নিজের শ্রেণির
    প্রস্তুতিমূলক মডেল টেস্টে অংশ নিতে পারবে।
  </span>
</div>

{getExamPath(student.className) ? (
  <Link
    href={getExamPath(student.className)!}
    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07543f] to-[#0a7655] px-5 py-4 font-extrabold text-[#fff8e5] transition hover:from-[#064632] hover:to-[#07563e]"
  >
    <BookOpenCheck size={21} />
    পরীক্ষায় অংশ নাও
    <ArrowRight size={19} />
  </Link>
) : (
  <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
    তোমার শ্রেণির পরীক্ষার লিংক পাওয়া যায়নি।
  </p>
)}

        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        
<Link
    href="/dashboard"
    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#087454] bg-white px-5 py-4 font-bold text-[#07543f] transition hover:bg-[#e9f6ee]"
  >
    <LayoutDashboard size={20} />
    Dashboard দেখো →
  </Link>

        <button onClick={logout} disabled={loading} className="mt-6 w-full rounded-xl border border-emerald-700 px-5 py-3 font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-60">{loading?'অপেক্ষা করো...':'Logout করো'}</button>
      </div> : <>
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-[#f2f7ef] p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dceedd] text-[#064c36]"><LockKeyhole size={22}/></div><div><h2 className="text-xl font-extrabold">তোমার অ্যাকাউন্টে প্রবেশ করো</h2><p className="mt-1 text-sm leading-6 text-[#506b5e]">নিবন্ধনের সময় পাওয়া ID ও নিজের PIN লিখবে।</p></div></div>
        <form onSubmit={login} className="space-y-5"><div><label htmlFor="login-id" className="mb-2 block text-sm font-bold">Student ID</label><input id="login-id" required autoCapitalize="characters" autoComplete="username" value={studentId} onChange={e=>setStudentId(e.target.value.toUpperCase())} placeholder="BU26-XXXXXXXX" className="w-full rounded-xl border border-[#dce5df] bg-[#f8faf9] px-4 py-3.5 font-mono text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"/></div>
          <div><label htmlFor="login-pin" className="mb-2 flex items-center gap-2 text-sm font-bold"><KeyRound size={16}/> ৬ সংখ্যার PIN</label><div className="relative"><input id="login-pin" required type={showPin?'text':'password'} inputMode="numeric" autoComplete="current-password" pattern="[0-9]{6}" minLength={6} maxLength={6} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="••••••" className="w-full rounded-xl border border-[#dce5df] bg-[#f8faf9] px-4 py-3.5 pr-14 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"/><button type="button" aria-label={showPin?'PIN লুকাও':'PIN দেখাও'} onClick={()=>setShowPin(!showPin)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-emerald-800">{showPin?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></div>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07543f] to-[#0a6a4e] px-5 py-4 font-extrabold text-[#fff8e5] hover:from-[#064632] hover:to-[#07563e] disabled:opacity-60">{loading?'যাচাই করা হচ্ছে...':'প্রবেশ করো'} {!loading && <ArrowRight size={19}/>}</button>
        </form><p className="mt-6 text-center text-sm text-slate-600">নতুন পরীক্ষার্থী? <Link href="/register" className="font-bold text-emerald-800 underline underline-offset-4">নিবন্ধন করো</Link></p>
        <p className="mt-3 text-center text-xs text-slate-500">PIN ভুলে গেলে আয়োজক কর্তৃপক্ষের সঙ্গে যোগাযোগ করো।</p>
      </>}
    </section><p className="mt-7 text-center text-xs text-[#647568]">বাংলা উৎসব প্রস্তুতিমূলক মডেল টেস্ট · সূচনা ছাত্র সংগঠন</p></div>
  </main>;
}
