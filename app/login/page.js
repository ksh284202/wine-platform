"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProfile, getRoleRoute } from "../../lib/auth";
import { supabase } from "../../lib/supabaseClient";

const initialForm = {
  email: "",
  password: "",
};

const roleCards = [
  {
    title: "소비자",
    description: "취향에 맞는 와인 추천과 콜키지 가능한 매장 탐색",
  },
  {
    title: "사업자",
    description: "매장·메뉴·재고 관리부터 판매 분석까지 한 번에",
  },
  {
    title: "관리자",
    description: "플랫폼 운영 관리와 데이터 통합 관리",
  },
];

const valuePoints = [
  {
    title: "데이터 기반 추천",
    description: "AI와 데이터 분석으로 최적의 와인을 추천합니다.",
    icon: <BottleIcon />,
  },
  {
    title: "신뢰할 수 있는 운영",
    description: "체계적인 재고·판매 관리로 비즈니스를 더 효율적으로.",
    icon: <ShieldIcon />,
  },
  {
    title: "완벽한 페어링",
    description: "음식과 와인의 완벽한 조합을 제안해 드립니다.",
    icon: <CheersIcon />,
  },
  {
    title: "안전한 보안",
    description: "안전한 데이터 보호와 관리자 시스템을 제공합니다.",
    icon: <LockIcon />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active || !session?.user) {
        return;
      }

      const { profile } = await fetchProfile(supabase, session.user.id);

      if (profile?.role) {
        router.replace(getRoleRoute(profile.role));
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      setMessage("로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.");
      setLoading(false);
      return;
    }

    const { profile, error: profileError } = await fetchProfile(
      supabase,
      data.user.id
    );

    if (profileError || !profile) {
      setMessage(
        "프로필 정보를 찾지 못했습니다. Supabase의 profiles 테이블과 트리거 설정을 확인해주세요."
      );
      setLoading(false);
      return;
    }

    router.replace(getRoleRoute(profile.role));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,45,32,0.18),_transparent_26%),linear-gradient(180deg,#080706_0%,#120d0b_100%)] px-4 py-5 text-[#f4ede6] sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <section className="relative overflow-hidden rounded-[28px] border border-[#4a352c] bg-[linear-gradient(135deg,rgba(18,13,10,0.98)_0%,rgba(28,20,17,0.96)_55%,rgba(17,12,10,0.98)_100%)] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:p-8 lg:min-h-[780px] lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(184,127,57,0.12),transparent_28%),radial-gradient(circle_at_75%_75%,rgba(121,34,49,0.18),transparent_22%)]" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.34em] text-[#e0bf8d]">
                WineOps AI
              </p>

              <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-[1.16] tracking-[-0.05em] text-[#f7f2ec] sm:text-5xl lg:text-7xl">
                더 스마트한 와인 운영과
                <br />
                <span className="bg-[linear-gradient(180deg,#f0cc8c_0%,#ddb06c_100%)] bg-clip-text text-transparent">
                  완벽한 페어링
                </span>
                을 한 곳에서
              </h1>

              <p className="mt-8 max-w-3xl text-base leading-9 text-[#d0c1b5] sm:text-[1.05rem]">
                와인 운영, 재고 관리, 판매 분석부터 고객 취향 기반 추천까지
                와인 비즈니스의 모든 것을 지원하는 AI 기반 플랫폼입니다.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {roleCards.map((card, index) => (
                  <div
                    key={card.title}
                    className="rounded-[28px] border border-[#564138] bg-[linear-gradient(180deg,rgba(88,32,42,0.42),rgba(35,23,21,0.58))] p-5 backdrop-blur"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_rgba(138,35,54,0.68),rgba(74,21,31,0.92))] text-[#f1d5c0]">
                      {index === 0 ? (
                        <GlassIcon />
                      ) : index === 1 ? (
                        <StoreIcon />
                      ) : (
                        <CheckShieldIcon />
                      )}
                    </div>
                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#f1c98a]">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-base leading-8 text-[#eadfd4]">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-6">
                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="relative overflow-hidden rounded-[28px] border border-[#4a352c] bg-[linear-gradient(180deg,rgba(19,15,13,0.72),rgba(10,8,7,0.88))] p-6">
                    <div className="absolute bottom-6 left-4 h-28 w-28 rounded-full bg-[#4e1019]/35 blur-2xl" />
                    <div className="absolute bottom-10 left-14 right-14 h-7 rounded-full bg-black/35 blur-xl" />

                    <div className="flex min-h-[300px] items-end gap-4 sm:gap-6">
                      <div className="w-36 shrink-0 sm:w-44">
                        <img
                          src="/images/wines/default-wine.jpg"
                          alt="와인 병"
                          className="h-auto w-full object-contain drop-shadow-[0_26px_24px_rgba(0,0,0,0.45)]"
                        />
                      </div>

                      <div className="relative hidden h-52 w-28 shrink-0 items-end justify-center sm:flex">
                        <div className="absolute bottom-0 h-10 w-20 rounded-full bg-black/30 blur-md" />
                        <div className="relative flex h-full w-full items-end justify-center">
                          <div className="absolute bottom-10 h-1 w-16 rounded-full bg-[#8b1d2a]" />
                          <div className="absolute bottom-[4.6rem] h-20 w-[4.6rem] rounded-b-[2.6rem] rounded-t-[1.8rem] border border-[#ccb6a6] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                          <div className="absolute bottom-[4.7rem] h-10 w-[4.2rem] rounded-b-[2rem] bg-[linear-gradient(180deg,rgba(99,18,23,0.92),rgba(58,8,10,0.95))]" />
                          <div className="absolute bottom-7 h-16 w-[2px] bg-[#d7cabf]" />
                          <div className="absolute bottom-5 h-3 w-14 rounded-full border border-[#d7cabf] bg-[rgba(255,255,255,0.02)]" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm uppercase tracking-[0.28em] text-[#b89365]">
                          Signature Mood
                        </p>
                        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#f4e7d8] sm:text-3xl">
                          WineOps AI
                        </h3>
                        <p className="mt-4 text-base leading-8 text-[#d9c9bc]">
                          프리미엄 와인 운영과 추천 경험을 한 화면에서 자연스럽게
                          보여주는 서비스 인트로 영역입니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#433028] bg-[rgba(17,13,12,0.66)] p-6 backdrop-blur">
                    <p className="text-center text-3xl leading-[1.7] tracking-[-0.04em] text-[#ddb06c]">
                      "
                    </p>
                    <p className="mt-2 text-center text-xl leading-9 text-[#e8d8c9] sm:text-[1.65rem] sm:leading-[2.5rem]">
                      좋은 와인은 순간을 특별하게 만들고,
                      <br />
                      좋은 선택은 경험을 완성합니다.
                    </p>
                    <p className="mt-2 text-center text-3xl leading-[1.7] tracking-[-0.04em] text-[#ddb06c]">
                      "
                    </p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#433028] bg-[rgba(17,13,12,0.66)] p-5 backdrop-blur">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FeatureItem label="실시간 재고 흐름" value="와인 수량과 운영 상태를 빠르게 확인" />
                    <FeatureItem label="추천 정확도" value="음식과 와인의 규칙 기반 추천 로직 제공" />
                    <FeatureItem label="역할 분리" value="소비자, 사업자, 관리자별 대시보드 구성" />
                    <FeatureItem label="발표 준비" value="데모 데이터 기반 시연에 최적화된 구조" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#4a352c] bg-[linear-gradient(180deg,rgba(24,18,16,0.96),rgba(17,12,10,0.98))] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:p-8 lg:min-h-[780px] lg:p-12">
            <p className="text-sm uppercase tracking-[0.34em] text-[#e0bf8d]">
              Login
            </p>
            <h2 className="mt-8 text-5xl font-semibold tracking-[-0.05em] text-[#fbf5ee]">
              로그인
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#d0c1b5]">
              이메일, 비밀번호를 입력하면 해당 대시보드로 이동합니다.
            </p>

            <form className="mt-14 space-y-8" onSubmit={handleSubmit}>
              <FormField
                id="email"
                label="이메일"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
              />
              <FormField
                id="password"
                label="비밀번호"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
              />

              {message ? (
                <p className="rounded-[20px] border border-[#6c3440] bg-[rgba(97,29,43,0.36)] px-5 py-4 text-base leading-7 text-[#f5dfd7]">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-[22px] bg-[linear-gradient(90deg,#7b1e2f_0%,#8c2734_55%,#652335_100%)] px-5 py-5 text-2xl font-semibold tracking-[-0.03em] text-white shadow-[0_18px_28px_rgba(110,20,32,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <div className="mt-12 flex items-center justify-between text-xl text-[#e5d7ca]">
              <Link href="/" className="transition hover:text-white">
                홈으로
              </Link>
              <Link href="/signup" className="transition hover:text-white">
                회원가입
              </Link>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-4 rounded-[28px] border border-[#ebdfd3] bg-[linear-gradient(180deg,#fbf7f2_0%,#f3ece4_100%)] px-5 py-6 text-[#322822] shadow-[0_20px_55px_rgba(0,0,0,0.08)] md:grid-cols-2 xl:grid-cols-4 xl:px-8">
          {valuePoints.map((item, index) => (
            <div
              key={item.title}
              className={`flex gap-4 ${index < valuePoints.length - 1 ? "xl:border-r xl:border-[#e5d9cf] xl:pr-6" : ""}`}
            >
              <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#d9c7bb] bg-white/80 text-[#5d221f]">
                {item.icon}
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#381f18]">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-8 text-[#5a4940]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function FormField({ id, label, type, name, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="mb-3 block text-2xl font-semibold text-[#f4ece4]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full rounded-[22px] border border-[#5b463d] bg-[rgba(55,43,37,0.8)] px-6 py-5 text-xl text-white outline-none transition placeholder:text-[#b9aca1] focus:border-[#d4ad7f]"
      />
    </div>
  );
}

function RolePreviewCard({ title, description }) {
  return (
    <div className="rounded-[28px] border border-[#5b453b] bg-[rgba(50,35,31,0.55)] p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#f8f0e7]">
        {title}
      </p>
      <p className="mt-4 text-lg leading-8 text-[#eaded2]">{description}</p>
    </div>
  );
}

function FeatureItem({ label, value }) {
  return (
    <div className="rounded-[22px] border border-[#4b3930] bg-[rgba(20,15,13,0.66)] p-4">
      <p className="text-sm uppercase tracking-[0.28em] text-[#b89365]">{label}</p>
      <p className="mt-3 text-base leading-7 text-[#eaded2]">{value}</p>
    </div>
  );
}

function BottleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 3h4" />
      <path d="M11 3v4l-3 4v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8l-3-4V3" />
      <path d="M8 14h8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
      <path d="m9.5 12 2 2 4-4" />
    </svg>
  );
}

function CheersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3 5 8a4 4 0 0 0 3 6v4" />
      <path d="M16 3 19 8a4 4 0 0 1-3 6v4" />
      <path d="M8 18h8" />
      <path d="m10 8 4 4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      <path d="M12 15v3" />
    </svg>
  );
}

function GlassIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h10v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5V3Z" />
      <path d="M12 11v6" />
      <path d="M9 21h6" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 9h16l-1-4H5 4l1 4Z" />
      <path d="M5 9v10h14V9" />
      <path d="M9 19v-5h6v5" />
    </svg>
  );
}

function CheckShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
      <path d="m9.5 12 2 2 4-4" />
    </svg>
  );
}
