"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [email, setEmail] = useState("demo@wineops.ai");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("mockAuth");
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.email) {
        setEmail(parsed.email);
      }
    } catch {}
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-6 py-10 text-[#3f352f]">
      <div className="mx-auto max-w-5xl rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7] p-8 shadow-[0_18px_45px_rgba(78,64,52,0.08)]">
        <p className="text-sm uppercase tracking-[0.34em] text-[#a38f80]">
          admin
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#2f2622]">
          관리자 대시보드
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6c61]">
          전체 사용자 흐름과 역할 구조를 관리하는 관리자용 목업 화면입니다.
        </p>

        <div className="mt-8 rounded-[28px] border border-[#eadfd2] bg-white/70 p-5">
          <p className="text-sm text-[#7a6c61]">목업 로그인 계정</p>
          <p className="mt-2 text-xl font-semibold text-[#2f2622]">{email}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardCard label="관리 영역" value="사용자 / 역할 / 운영 상태" />
          <DashboardCard label="발표 포인트" value="권한 분리 구조" />
          <DashboardCard label="현재 상태" value="목업 UI 단계" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-[#d8c9ba] px-5 py-3 text-sm font-semibold text-[#433730] transition hover:bg-[#f3ece3]"
          >
            홈으로 이동
          </Link>
          <Link
            href="/login"
            className="rounded-2xl bg-[#312823] px-5 py-3 text-sm font-semibold text-[#f8f3ee] transition hover:bg-[#433730]"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-[#eadfd2] bg-[#fbf8f4] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-[#a38f80]">
        {label}
      </p>
      <p className="mt-4 text-xl font-semibold text-[#2f2622]">{value}</p>
    </div>
  );
}
