"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialForm = {
  email: "",
  password: "",
  role: "consumer",
};

const ROLE_ROUTES = {
  consumer: "/consumer",
  business: "/business",
  admin: "/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    window.localStorage.setItem(
      "mockAuth",
      JSON.stringify({
        email: form.email.trim() || "demo@wineops.ai",
        role: form.role,
      })
    );

    window.setTimeout(() => {
      router.push(ROLE_ROUTES[form.role] || "/");
    }, 400);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#1f1916_0%,#2b221d_45%,#f6f2ec_45%,#f6f2ec_100%)] px-6 py-10 text-[#f8f3ee]">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.34em] text-[#d7c9bc]">
              WineOps AI
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
              서비스 진입을 위한 로그인 화면
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#ebdfd5]">
              현재는 Supabase Auth 연결 전 단계의 목업 화면입니다. 역할별 진입
              흐름을 먼저 확인하고, 이후 같은 구조에 실제 인증만 연결하면 됩니다.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <RolePreviewCard
                title="consumer"
                description="일반 소비자용 추천/탐색 화면"
              />
              <RolePreviewCard
                title="business"
                description="매장 운영과 추천 관리 화면"
              />
              <RolePreviewCard
                title="admin"
                description="관리자 전용 운영 대시보드"
              />
            </div>
          </section>

          <section className="rounded-[36px] border border-[#3a3029] bg-[#2b221d] p-8 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#d4bba8]">
              Login
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">
              로그인
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#dccfc5]">
              이메일, 비밀번호, 역할을 선택하면 해당 대시보드로 이동합니다.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <FormField
                id="email"
                label="이메일"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <FormField
                id="password"
                label="비밀번호"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-[#f0e6df]"
                >
                  역할 선택
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#5a4c42] bg-[#362b25] px-4 py-3 text-white outline-none transition focus:border-[#d0b29c]"
                >
                  <option value="consumer">consumer</option>
                  <option value="business">business</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#ead7c7] px-5 py-3 text-sm font-semibold text-[#2f2622] transition hover:bg-[#f3e6db] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "이동 중..." : "로그인"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-[#dccfc5]">
              <Link href="/" className="hover:text-white">
                홈으로
              </Link>
              <Link href="/signup" className="hover:text-white">
                회원가입
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FormField({ id, label, type, name, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#f0e6df]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-2xl border border-[#5a4c42] bg-[#362b25] px-4 py-3 text-white outline-none transition focus:border-[#d0b29c]"
      />
    </div>
  );
}

function RolePreviewCard({ title, description }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-[#e4d7cc]">{description}</p>
    </div>
  );
}
