import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scriptUrl = process.env.EXAM_SCRIPT_URL;
    if (!scriptUrl) throw new Error("EXAM_SCRIPT_URL is missing");
    const url = new URL(scriptUrl);
    url.searchParams.set("action", "schedule");
    const response = await fetch(url.toString(), { cache: "no-store", redirect: "follow" });
    if (!response.ok) throw new Error(`Backend HTTP ${response.status}`);
    const data = await response.json();
    if (!data.success || !Array.isArray(data.tests)) {
      return NextResponse.json({ success: false, error: data.error || "Schedule unavailable" }, { status: 502 });
    }
    return NextResponse.json({ success: true, tests: data.tests }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Schedule API error:", error);
    return NextResponse.json({ success: false, error: "সময়সূচি লোড করা যাচ্ছে না।" }, { status: 502 });
  }
}