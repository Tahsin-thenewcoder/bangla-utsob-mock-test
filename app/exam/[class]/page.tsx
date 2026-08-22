"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";

const exams: Record<
  string,
  {
    title: string;
    formUrl: string;
    height: number;
  }
> = {
  "6": {
    title: "ষষ্ঠ শ্রেণির প্রস্তুতিমূলক মডেল টেস্ট",
    formUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScASlOYXnRRHfMdlnCKmVtIe5DX1aIm4YTrXGG8KtaFu2HddQ/viewform?embedded=true",
    height: 1703,
  },

  "7": {
    title: "সপ্তম শ্রেণির প্রস্তুতিমূলক মডেল টেস্ট",
    formUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSejHd9X9uUuRL9MsJcj4iN4UOHN_E0ga7xrcsJwEl6N7u7X9A/viewform?embedded=true",
    height: 3717,
  },

  "8": {
    title: "অষ্টম শ্রেণির প্রস্তুতিমূলক মডেল টেস্ট",
    formUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSdV7omm9_FBCERGRXEacooHh72IEgsuYRU7PwY4wWNYX2VEuA/viewform?embedded=true",
    height: 6017,
  },

  "9-10": {
    title: "নবম–দশম শ্রেণির প্রস্তুতিমূলক মডেল টেস্ট",
    formUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSe-wID-uOR76WSNQ0kEFhPAxyddCSGURrJUG9mPlRVL5cTKPg/viewform?embedded=true",
    height: 6463,
  },
};

export default function ExamPage() {
  const params = useParams();

  const classId = params.class as string;
  const exam = exams[classId];

  // প্রথমবার iframe load হওয়ার পর true হবে
  const firstLoad = useRef(true);

  const handleIframeLoad = () => {
    // প্রথম load হলে scroll করবে না
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    // Submit করার পর Google Form confirmation page load হলে
    // website-কে iframe-এর উপরে নিয়ে যাবে
    setTimeout(() => {
      const iframe = document.getElementById("exam-form");

      if (iframe) {
        const top =
          iframe.getBoundingClientRect().top + window.scrollY - 20;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }, 500);
  };

  if (!exam) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-5">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="text-5xl">😕</div>

          <h1 className="mt-5 text-xl font-black text-slate-900">
            পরীক্ষা পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            এই বিভাগের কোনো পরীক্ষা পাওয়া যায়নি।
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-orange-500">
            বাংলা উৎসব ১৪৩৩
          </p>

          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {exam.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            মূল পরীক্ষার আগে নিজের প্রস্তুতি যাচাই করে নাও।
          </p>
        </div>

        {/* Google Form */}
        <div
          id="exam-form"
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          <iframe
            src={exam.formUrl}
            width="100%"
            height={exam.height}
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            onLoad={handleIframeLoad}
            className="w-full"
          >
            Loading…
          </iframe>
        </div>

      </div>
    </main>
  );
}