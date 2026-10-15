import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  verifySession,
} from "@/lib/student-session";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const student = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json(student ? {success:true,student} : {success:false,error:'Login required'}, {status:student?200:401,headers:{'Cache-Control':'no-store'}});
}
