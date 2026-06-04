"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "consumer",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      "mockSignupProfile",
      JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      })
    );

    setMessage("목업 회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");

    window.setTimeout(() => {
      router.push("/login");
    }, 500);
  }

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-6 py-10 text-[#3f352f]">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7] p-8 shadow-[0_18px_45px_rgba(78,64,52,0.08)]">
            <p className="text-sm uppercase tracking-[0.34em] text-[#a38f80]">
              Sign Up
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#2f2622]">
              WineOps AI 회원가입
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#7a6c61]">
              현재는 목업 단계라 실제 계정 생성은 하지 않습니다. 다만 이후
              Supabase Auth를 붙이기 좋은 형태로 필드를 구성해두었습니다.
            </p>

            <div className="mt-8 space-y-3">
              <FeatureLine text="consumer와 business만 선택 가능" />
              <FeatureLine text="admin은 회원가입 화면에서 선택 불가" />
              <FeatureLine text="추후 같은 폼 구조에 실제 인증 연결 가능" />
            </div>
          </section>

          <section className="rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7] p-8 shadow-[0_18px_45px_rgba(78,64,52,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#a38f80]">
              Create Account
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#2f2622]">
              회원가입 정보 입력
            </h2>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <LightField
                id="name"
                label="이름"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <LightField
                id="email"
                label="이메일"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <LightField
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
                  className="mb-2 block text-sm font-medium text-[#5a4f49]"
                >
                  역할 선택
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e4dbd1] bg-[#fcfaf7] px-4 py-3 text-[#2f2622] outline-none transition focus:border-[#b59a87]"
                >
                  <option value="consumer">consumer</option>
                  <option value="business">business</option>
                </select>
              </div>

              {message ? (
                <p className="rounded-2xl bg-[#f5ebe3] px-4 py-3 text-sm text-[#7b463a]">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#312823] px-5 py-3 text-sm font-semibold text-[#f8f3ee] transition hover:bg-[#433730] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "처리 중..." : "회원가입"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-[#7a6c61]">
              <Link href="/" className="hover:text-[#2f2622]">
                홈으로
              </Link>
              <Link href="/login" className="hover:text-[#2f2622]">
                로그인
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function LightField({ id, label, type, name, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#5a4f49]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-2xl border border-[#e4dbd1] bg-[#fcfaf7] px-4 py-3 text-[#2f2622] outline-none transition focus:border-[#b59a87]"
      />
    </div>
  );
}

function FeatureLine({ text }) {
  return (
    <div className="rounded-2xl border border-[#eadfd2] bg-white/70 px-4 py-3 text-sm text-[#5f5249]">
      {text}
    </div>
  );
}
