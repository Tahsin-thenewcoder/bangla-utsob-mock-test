
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const classNames: Record<string, string> = {
  "6": "Class_6",
  "7": "Class_7",
  "8": "Class_8",
  "9-10": "Class_9_10",
};

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get("class") || "6";
  const className = classNames[classId];

  if (!className) {
    return NextResponse.json(
      { success: false, error: "Invalid class" },
      { status: 400 }
    );
  }

  try {
    const scriptUrl = process.env.EXAM_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error("EXAM_SCRIPT_URL is missing");
    }

    const url = new URL(scriptUrl);
    url.searchParams.set("action", "leaderboard");
    url.searchParams.set("class", className);

    const response = await fetch(url.toString(), {
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Backend HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Leaderboard unavailable",
        },
        { status: 502 }
      );
    }

   return NextResponse.json(
  {
    success: true,
    testId: data.testId ?? null,
    leaderboard: data.leaderboard || [],
  },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Leaderboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Leaderboard লোড করা যাচ্ছে না।",
      },
      { status: 502 }
    );
  }
}
