import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxn5dL8cgN6ITClAoj0Irvrb0AdvLrT9_yHetYEg4U9cxxIU9Bwxgox6VLGy_ZQh0p6/exec";
const allowed = new Set(["start", "submit"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !allowed.has(body.action)) {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const upstream = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body),
        cache: "no-store",
        redirect: "follow",
        signal: controller.signal,
      });
      if (!upstream.ok) throw new Error(`Backend HTTP ${upstream.status}`);
      const data = await upstream.json();
      return NextResponse.json(data, { status: data.success ? 200 : 400, headers: { "Cache-Control": "no-store" } });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Exam API error:", error);
    return NextResponse.json({ success: false, error: "সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না। আবার চেষ্টা করো।" }, { status: 502 });
  }
}

