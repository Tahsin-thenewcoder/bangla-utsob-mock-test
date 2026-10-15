import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/student-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxn5dL8cgN6ITClAoj0Irvrb0AdvLrT9_yHetYEg4U9cxxIU9Bwxgox6VLGy_ZQh0p6/exec";
const examActions = new Set(["start", "save", "submit", "status"]);
const publicActions = new Set(["register", "login"]);

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    if (!input || typeof input !== "object" || typeof input.action !== "string") {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    const action = input.action;
    if (!examActions.has(action) && !publicActions.has(action)) {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
    let payload: Record<string, unknown>;
    if (examActions.has(action)) {
      const student = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
      if (!student) return NextResponse.json({ success: false, error: "পরীক্ষার আগে Login করো।" }, { status: 401 });
      const sharedSecret = process.env.EXAM_BACKEND_SECRET;
      if (!sharedSecret || sharedSecret.length < 32) {
        throw new Error("EXAM_BACKEND_SECRET is missing or too short");
      }
      // Never trust identity or class fields sent by the browser.
      payload = {
        action,
        studentId: student.studentId,
        name: student.name,
        school: student.school,
        class: student.className,
        year: student.year,
        token: typeof input.token === "string" ? input.token : "",
        answers: input.answers,
        retake: input.retake === true,
        backendSecret: sharedSecret,
      };
    } else {
      // Preserve the existing registration/login endpoint.
      payload = { action, ...input };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const upstream = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        cache: "no-store",
        redirect: "follow",
        signal: controller.signal,
      });
      if (!upstream.ok) throw new Error(`Backend HTTP ${upstream.status}`);
      const data = await upstream.json();
      return NextResponse.json(data, {
        status: data.success ? 200 : 400,
        headers: { "Cache-Control": "no-store" },
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Exam API error:", error);
    return NextResponse.json({ success: false, error: "সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না। আবার চেষ্টা করো।" }, { status: 502 });
  }
}
