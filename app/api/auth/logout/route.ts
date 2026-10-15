import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  verifySession,
} from "@/lib/student-session";
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({success:false,error:'Invalid origin'},{status:403});
  const response = NextResponse.json({success:true},{headers:{'Cache-Control':'no-store'}});
  response.cookies.set(SESSION_COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:'lax',path:'/',maxAge:0});
  return response;
}
