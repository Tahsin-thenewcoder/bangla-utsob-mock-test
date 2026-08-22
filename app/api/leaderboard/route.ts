import { NextRequest, NextResponse } from "next/server";

const urls: Record<string, string> = {
  "6": "https://script.google.com/macros/s/AKfycbybkfp7ZLO5CiD9CPSNJuKX5dSIlIJGDCkt4338qaon1DnRZex5DoKMK3SbWvMtuhIMfA/exec",

  "7": "https://script.google.com/macros/s/AKfycbwQTMe8z1sPNuEqMhAVBXIu2nORmDjVyzLoBnwPR3zh2pwH2qciGfen4eY369xlkeFoSw/exec",

  "8": "https://script.google.com/macros/s/AKfycbxjIAzsFCsUDv7-4dX3Ar6VI3maRam6LbF5-wa35n1ndrLOJhw5TPdRYjyfLr2U9hoZ/exec",

  "9-10":
    "https://script.google.com/macros/s/AKfycbxjhbhh7pdkIS1MlfhV-SoMPPPOFb3smX_mzsViitm71QwBmYU9VRdkh6E_MjebgUBh/exec",
};

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get("class") || "6";

  const url = urls[classId];

  if (!url) {
    return NextResponse.json(
      { error: "Invalid class" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Fetch failed" },
      { status: 500 }
    );
  }
}