"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProfile, getRoleRoute } from "../../lib/auth";
import { supabase } from "../../lib/supabaseClient";

export default function ConsumerPage() {
  return (
    <RoleDashboard
      requiredRole="consumer"
      role="consumer"
      title="소비자 대시보드"
      description="개인 추천, 선호 와인 탐색, 콜키지 추천 결과를 확인하는 소비자용 화면입니다."
      cards={[
        { label: "추천 모드", value: "개인 취향 기반" },
        { label: "관심 기능", value: "와인 추천 / 즐겨찾기" },
        { label: "접속 상태", value: "Supabase Auth 연동 완료" },
      ]}
    />
  );
}

function RoleDashboard({ requiredRole, role, title, description, cards }) {
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

      if (loadedProfile.role !== requiredRole) {
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
  }, [requiredRole, router]);

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
          {role}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#2f2622]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6c61]">
          {description}
        </p>

        <div className="mt-8 rounded-[28px] border border-[#eadfd2] bg-white/70 p-5">
          <p className="text-sm text-[#7a6c61]">로그인 계정</p>
          <p className="mt-2 text-xl font-semibold text-[#2f2622]">
            {profile?.email}
          </p>
          <p className="mt-4 text-sm text-[#7a6c61]">역할</p>
          <p className="mt-2 text-lg font-semibold text-[#2f2622]">
            {profile?.role}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] border border-[#eadfd2] bg-[#fbf8f4] p-5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#a38f80]">
                {card.label}
              </p>
              <p className="mt-4 text-xl font-semibold text-[#2f2622]">
                {card.value}
              </p>
            </div>
          ))}
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
