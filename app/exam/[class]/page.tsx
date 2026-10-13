
"use client";

import { useParams } from "next/navigation";
import ExamClient from "./ExamClient";

export default function ExamPage() {
  const params = useParams();
  const className = String(params.class || "");

  return <ExamClient className={className} />;
}
