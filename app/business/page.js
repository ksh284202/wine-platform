"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProfile, getRoleRoute } from "../../lib/auth";
import { supabase } from "../../lib/supabaseClient";

export default function BusinessPage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;

    async function protectPage() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const { profile: loadedProfile } = await fetchProfile(supabase, session.user.id);

      if (!loadedProfile) {
        router.replace("/login");
        return;
      }

      if (loadedProfile.role !== "business") {
        router.replace(getRoleRoute(loadedProfile.role));
        return;
      }

      if (active) {
        setProfile(loadedProfile);
        setStatus("ready");
      }
    }

    protectPage();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#f6f2ec] px-6 py-10 text-[#3f352f]">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7] p-8 text-center shadow-[0_18px_45px_rgba(78,64,52,0.08)]">
          권한을 확인하는 중입니다...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-6 py-10 text-[#3f352f]">
      <div className="mx-auto max-w-5xl rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7] p-8 shadow-[0_18px_45px_rgba(78,64,52,0.08)]">
        <p className="text-sm uppercase tracking-[0.34em] text-[#a38f80]">
          business
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#2f2622]">
          사업자 대시보드
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6c61]">
          와인 운영, 메뉴 등록, 추천 결과 검토를 위한 사업자용 대시보드입니다.
        </p>

        <div className="mt-8 rounded-[28px] border border-[#eadfd2] bg-white/70 p-5">
          <p className="text-sm text-[#7a6c61]">로그인 계정</p>
          <p className="mt-2 text-xl font-semibold text-[#2f2622]">
            {profile?.email}
          </p>
          <p className="mt-4 text-sm text-[#7a6c61]">사업장 이름</p>
          <p className="mt-2 text-lg font-semibold text-[#2f2622]">
            {profile?.business_name || "미입력"}
          </p>
          <p className="mt-4 text-sm text-[#7a6c61]">역할</p>
          <p className="mt-2 text-lg font-semibold text-[#2f2622]">
            {profile?.role}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardCard label="운영 영역" value="와인 / 메뉴 / 추천 관리" />
          <DashboardCard label="발표 포인트" value="매장용 AI 운영 흐름" />
          <DashboardCard label="접속 상태" value="Supabase Auth 연동 완료" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-[#d8c9ba] px-5 py-3 text-sm font-semibold text-[#433730] transition hover:bg-[#f3ece3]"
          >
            홈으로 이동
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-[#312823] px-5 py-3 text-sm font-semibold text-[#f8f3ee] transition hover:bg-[#433730]"
          >
            로그아웃
          </button>
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
