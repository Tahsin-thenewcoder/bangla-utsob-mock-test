import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_SECONDS, signSession } from "@/lib/student-session";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const SCRIPT_URL = process.env.EXAM_SCRIPT_URL;

if (!SCRIPT_URL) {
  throw new Error("EXAM_SCRIPT_URL is missing");
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({success:false,error:'Invalid origin'}, {status:403});
  try {
    const body = await request.json();
    const studentId = String(body.studentId || '').trim().toUpperCase();
    const pin = String(body.pin || '');
    if (!/^BU\d{2}-[A-F0-9]{8}$/.test(studentId) || !/^\d{6}$/.test(pin)) return NextResponse.json({success:false,error:'সঠিক ID ও ৬ সংখ্যার PIN দাও।'}, {status:400});
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    let data: Record<string, unknown>;
    try {
      const upstream = await fetch(SCRIPT_URL!, {method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'login',studentId,pin}),redirect:'follow',cache:'no-store',signal:controller.signal});
      if (!upstream.ok) throw new Error('Upstream unavailable');
      data = await upstream.json();
    } finally { clearTimeout(timer); }
    if (!data.success) return NextResponse.json({success:false,error:String(data.error || 'ID অথবা PIN সঠিক নয়।')},{status:401});
    if (data.studentId !== studentId || typeof data.name !== 'string' || typeof data.school !== 'string' || typeof data.class !== 'string' || typeof data.year !== 'number') throw new Error('Invalid backend login response');
    const student = {studentId, name:data.name, school:data.school, className:data.class, year:data.year};
    const response = NextResponse.json({success:true,student}, {headers:{'Cache-Control':'no-store'}});
    response.cookies.set(SESSION_COOKIE, signSession({...student,expiresAt:Date.now()+SESSION_SECONDS*1000}), {httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:'lax',path:'/',maxAge:SESSION_SECONDS});
    return response;
  } catch (error) {
    console.error('Student login failed:', error);
    return NextResponse.json({success:false,error:'Login সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পরে চেষ্টা করো।'},{status:502});
  }
}
