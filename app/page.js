"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { defaultWines } from "../data/defaultWines";
import { getSeededDashboardData } from "../lib/demoData";

const STORAGE_KEYS = {
  wines: "wines",
  menus: "menus",
};

const FALLBACK_WINE_IMAGE = "/images/wines/default-wine.jpg";

const QUICK_LINKS = [
  {
    href: "/wines",
    label: "와인 등록",
    description: "보유 와인을 등록하고 매장용 와인 리스트를 정리합니다.",
  },
  {
    href: "/menus",
    label: "메뉴 등록",
    description: "페어링과 추천 흐름에 사용할 메뉴 데이터를 저장합니다.",
  },
  {
    href: "/recommend",
    label: "추천 결과",
    description: "현재 데이터 기준으로 추천 로직과 결과 화면을 확인합니다.",
  },
];

const TYPE_FILTERS = ["All", "Red", "White", "Sparkling", "Rose"];

const TYPE_LABELS = {
  Red: "레드",
  White: "화이트",
  Sparkling: "스파클링",
  Rose: "로제",
};

const LEVEL_LABELS = {
  Light: "가벼움",
  Medium: "중간",
  Full: "묵직함",
  Heavy: "무거움",
  Low: "낮음",
  High: "높음",
  Dry: "드라이",
  Sweet: "스위트",
};

function readStoredArray(key) {
  try {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatLabel(value) {
  return TYPE_LABELS[value] || LEVEL_LABELS[value] || value || "-";
}

function calculateRecommendationScore(menu, wine) {
  let score = 0;
  const reasons = [];

  const spicyLevel = menu.spicyLevel || menu.spicy || "Low";
  const oilyLevel = menu.oiliness || menu.oily || "Low";

  if (menu.category === "Steak" && wine.type === "Red") {
    score += 30;
    reasons.push("스테이크와 레드 와인의 기본 궁합이 좋습니다.");
  }

  if (menu.category === "Seafood" && wine.type === "White") {
    score += 30;
    reasons.push("해산물은 화이트 와인과 산뜻하게 어울립니다.");
  }

  if (menu.category === "Dessert" && wine.sweetness === "Sweet") {
    score += 30;
    reasons.push("디저트에는 단맛 있는 와인이 자연스럽게 맞습니다.");
  }

  if (
    menu.category === "Cheese" &&
    (wine.type === "Sparkling" || wine.type === "Red")
  ) {
    score += 20;
    reasons.push("치즈의 풍미를 스파클링 또는 레드 와인이 잘 받쳐줍니다.");
  }

  if (menu.weight === "Heavy" && wine.body === "Full") {
    score += 20;
    reasons.push("무게감 있는 음식은 풀바디 와인과 어울립니다.");
  }

  if (
    spicyLevel === "High" &&
    (wine.sweetness === "Sweet" || wine.type === "Sparkling")
  ) {
    score += 20;
    reasons.push("매운 음식은 스위트 또는 스파클링 와인이 균형을 잡아줍니다.");
  }

  if (oilyLevel === "High" && wine.acidity === "High") {
    score += 15;
    reasons.push("기름진 음식은 산도 높은 와인이 깔끔하게 정리해줍니다.");
  }

  return { score, reasons };
}

export default function Home() {
  const [counts, setCounts] = useState({ wines: 0, menus: 0 });
  const [storedWines, setStoredWines] = useState([]);
  const [storedMenus, setStoredMenus] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncDashboardData = () => {
      const { wines, menus } = getSeededDashboardData();

      setStoredWines(wines);
      setStoredMenus(menus);
      setCounts({
        wines: wines.length,
        menus: menus.length,
      });
    };

    syncDashboardData();
    window.addEventListener("storage", syncDashboardData);

    return () => {
      window.removeEventListener("storage", syncDashboardData);
    };
  }, []);

  const hasAnyData = counts.wines > 0 || counts.menus > 0;

  const filteredDefaultWines = useMemo(() => {
    const sourceWines = defaultWines.length > 0 ? defaultWines : storedWines;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return sourceWines.filter((wine) => {
      const matchesType = typeFilter === "All" || wine.type === typeFilter;

      if (!matchesType) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchTarget = [wine.name, wine.type, wine.origin]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchTarget.includes(normalizedQuery);
    });
  }, [storedWines, typeFilter, searchQuery]);

  const previewDefaultWines = filteredDefaultWines.slice(0, 6);

  const topRecommendations = useMemo(() => {
    if (storedMenus.length === 0) {
      return [];
    }

    const baseMenu = storedMenus[0];
    const sourceWines = storedWines.length > 0 ? storedWines : defaultWines;

    return sourceWines
      .map((wine) => {
        const result = calculateRecommendationScore(baseMenu, wine);

        return {
          ...wine,
          score: result.score,
          reasons: result.reasons,
          menuName: baseMenu.name,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [storedMenus, storedWines]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f2ec] text-[#3f352f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_transparent_34%),linear-gradient(180deg,#f8f5f1_0%,#f3eee8_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="sticky top-4 z-20 mb-6 rounded-full border border-[#e6ddd3] bg-[#fcfaf7]/90 px-5 py-4 shadow-[0_10px_30px_rgba(78,64,52,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#a38f80]">
                WineOps AI
              </p>
              <p className="mt-1 text-sm text-[#6c5f55]">
                AI 기반 와인 운영 및 콜키지 추천 플랫폼
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/"
                className="rounded-full border border-[#e2d7cb] px-4 py-2 text-[#51453d] transition hover:bg-white"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[#e2d7cb] px-4 py-2 text-[#51453d] transition hover:bg-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#312823] px-4 py-2 font-medium text-[#f8f3ee] transition hover:bg-[#433730]"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>

        <section className="overflow-hidden rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7]/95 shadow-[0_18px_45px_rgba(78,64,52,0.08)] backdrop-blur">
          <div className="grid gap-8 border-b border-[#ece4da] px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.34em] text-[#a38f80]">
                Premium Landing
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-[#2f2622] sm:text-5xl">
                WineOps AI
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#7a6c61]">
                AI 기반 와인 운영 및 콜키지 추천 플랫폼
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6c61] sm:text-base">
                와인 등록, 메뉴 관리, 추천 로직 테스트, 역할별 서비스 진입 구조를
                한 흐름으로 보여주는 발표용 MVP입니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[#312823] px-6 py-3 text-sm font-semibold text-[#f8f3ee] transition hover:bg-[#433730]"
                >
                  시작하기
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-[#ddd2c6] px-6 py-3 text-sm font-semibold text-[#433730] transition hover:bg-white"
                >
                  회원가입
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-[#e9dfd5] bg-[#f7f2ec] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#a39183]">
                  현재 상태
                </p>
                <p className="mt-4 text-2xl font-semibold text-[#332923]">
                  {hasAnyData ? "발표 준비 완료" : "초기 설정 진행 중"}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#7f7065]">
                  와인과 메뉴 데이터를 먼저 등록한 뒤 추천 결과 흐름으로
                  이동하세요.
                </p>
              </div>

              <div className="rounded-[28px] border border-[#e9dfd5] bg-[linear-gradient(135deg,#332822_0%,#5b4338_100%)] p-6 text-[#f8f3ee]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d8c9bc]">
                  Role Entry
                </p>
                <p className="mt-4 text-2xl font-semibold">
                  consumer / business / admin
                </p>
                <p className="mt-3 text-sm leading-6 text-[#eadfd5]">
                  로그인 진입 화면에서 역할별 대시보드 흐름을 바로 시연할 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:px-8 lg:grid-cols-[0.9fr_0.9fr_1.2fr]">
            <div className="rounded-[28px] border border-[#ece3d9] bg-white/70 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#a28e80]">
                와인 수
              </p>
              <p className="mt-4 text-5xl font-semibold text-[#2f2622]">
                {counts.wines}
              </p>
              <p className="mt-4 text-sm text-[#84766b]">
                localStorage `wines` 기준
              </p>
            </div>

            <div className="rounded-[28px] border border-[#ece3d9] bg-white/70 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#a28e80]">
                메뉴 수
              </p>
              <p className="mt-4 text-5xl font-semibold text-[#2f2622]">
                {counts.menus}
              </p>
              <p className="mt-4 text-sm text-[#84766b]">
                localStorage `menus` 기준
              </p>
            </div>

            <div className="rounded-[28px] border border-[#ece3d9] bg-[#f5f0ea] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#a28e80]">
                추천 상태
              </p>
              <p className="mt-4 text-2xl font-semibold text-[#312823]">
                {hasAnyData ? "데이터 확인 및 추천 가능" : "첫 데이터 등록 대기 중"}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#7f7065]">
                저장 후 바로 추천 흐름을 확인할 수 있어 발표 시나리오 구성에
                적합합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[32px] border border-[#e9e0d7] bg-[#fbf8f4] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ddd1c5] hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.24em] text-[#ac998a]">
                  바로가기
                </span>
                <span className="rounded-full border border-[#e6ddd4] bg-[#f5f1eb] px-3 py-1 text-xs text-[#7a6d63]">
                  이동
                </span>
              </div>
              <h2 className="mt-7 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#302722]">
                {item.label}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#83756a]">
                {item.description}
              </p>
              <span className="mt-8 inline-flex items-center rounded-full bg-[#312823] px-4 py-2 text-sm font-medium text-[#f8f3ee] transition group-hover:bg-[#433730]">
                페이지 열기
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7]/95 px-6 py-6 shadow-[0_18px_45px_rgba(78,64,52,0.08)] sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#a38f80]">
                기본 와인 리스트
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#2f2622]">
                기본 와인 리스트 미리보기
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6c61]">
                필터와 검색을 통해 기본 와인 데이터를 확인하고, 추천 테스트에
                사용할 구성을 미리 볼 수 있습니다.
              </p>
            </div>

            <Link
              href="/wines"
              className="inline-flex items-center rounded-full bg-[#312823] px-5 py-3 text-sm font-medium text-[#f8f3ee] transition hover:bg-[#433730]"
            >
              와인 리스트 페이지로 이동 ({filteredDefaultWines.length}개)
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTypeFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    typeFilter === filter
                      ? "bg-[#312823] text-[#f8f3ee]"
                      : "border border-[#e4dbd1] bg-white/70 text-[#6f6257] hover:bg-white"
                  }`}
                >
                  {filter === "All" ? "All" : formatLabel(filter)}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="와인 이름, 종류, 원산지로 검색"
              className="w-full rounded-2xl border border-[#e4dbd1] bg-white/70 px-4 py-3 text-[#2f2622] outline-none transition placeholder:text-[#9a8e84] focus:border-[#b59a87]"
            />
          </div>

          {defaultWines.length === 0 && storedWines.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-10 text-center text-sm text-[#8a7d72]">
              data/defaultWines.js 파일이 없고 저장된 와인도 없습니다. 먼저
              와인을 등록하거나 기본 데이터 파일을 추가해주세요.
            </div>
          ) : previewDefaultWines.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-10 text-center text-sm text-[#8a7d72]">
              조건에 맞는 와인이 없습니다.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {previewDefaultWines.map((wine, index) => (
                <article
                  key={wine.id}
                  className="rounded-[28px] border border-[#e4dbd1] bg-[#fbf8f4] p-5"
                >
                  <WineBottleImage
                    src={wine.image}
                    alt={wine.name}
                    heightClassName="h-52"
                    fallbackSrc={FALLBACK_WINE_IMAGE}
                    containerClassName="mb-5 overflow-hidden rounded-[22px] border border-[#eadfce] bg-[#fffaf4]"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-[#312823] px-3 py-1 text-xs font-medium text-[#f8f3ee]">
                        {wine.id ?? index + 1}
                      </span>
                      <h3 className="mt-3 text-xl font-semibold text-[#2f2622]">
                        {wine.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#8a7769]">
                        {formatLabel(wine.type)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#f1e8dd] px-3 py-1 text-xs text-[#6f5e52]">
                      {Number(wine.price || 0).toLocaleString()}원
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoItem label="바디감" value={formatLabel(wine.body)} />
                    <InfoItem label="산도" value={formatLabel(wine.acidity)} />
                    <InfoItem label="당도" value={formatLabel(wine.sweetness)} />
                    <InfoItem label="탄닌" value={formatLabel(wine.tannin)} />
                    <InfoItem label="원산지" value={wine.origin || "-"} />
                    <InfoItem
                      label="페어링"
                      value={
                        Array.isArray(wine.pairingTags) && wine.pairingTags.length > 0
                          ? wine.pairingTags.join(", ")
                          : "-"
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7]/95 px-6 py-6 shadow-[0_18px_45px_rgba(78,64,52,0.08)] sm:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#a38f80]">
              추천 랭킹
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#2f2622]">
              추천 랭킹 TOP 3
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6c61]">
              메뉴가 있으면 첫 번째 메뉴를 기준으로 와인 추천 점수를 계산해 상위
              3개를 표시합니다.
            </p>
          </div>

          {storedMenus.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-10 text-center text-sm text-[#8a7d72]">
              메뉴를 등록하면 추천 랭킹이 표시됩니다.
            </div>
          ) : topRecommendations.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-10 text-center text-sm text-[#8a7d72]">
              추천에 사용할 와인 데이터가 없습니다. localStorage 또는
              defaultWines 데이터를 확인해주세요.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {topRecommendations.map((wine, index) => (
                <article
                  key={`${wine.id}-${index}`}
                  className="rounded-[28px] border border-[#e4dbd1] bg-[#fbf8f4] p-5"
                >
                  <WineBottleImage
                    src={wine.image}
                    alt={wine.name}
                    heightClassName="h-48"
                    fallbackSrc={FALLBACK_WINE_IMAGE}
                    containerClassName="mb-5 overflow-hidden rounded-[22px] border border-[#eadfce] bg-[#fffaf4]"
                  />

                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#312823] px-4 py-2 text-sm font-medium text-[#f8f3ee]">
                      {index + 1}위
                    </span>
                    <span className="text-sm text-[#8a7769]">
                      점수 {wine.score}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold text-[#2f2622]">
                    {wine.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#8a7769]">
                    기준 메뉴: {wine.menuName}
                  </p>

                  <div className="mt-5 rounded-[22px] border border-[#e8ded3] bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#9a8c80]">
                      추천 이유
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-[#5f5249]">
                      {(wine.reasons.length > 0
                        ? wine.reasons.slice(0, 2)
                        : ["강한 일치 규칙은 없지만 무난한 선택지입니다."]).map(
                        (reason) => (
                          <li key={reason}>- {reason}</li>
                        )
                      )}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e8ded3] bg-white/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-[#9a8c80]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[#312823]">{value}</p>
    </div>
  );
}

function WineBottleImage({
  src,
  alt,
  fallbackSrc,
  heightClassName,
  containerClassName,
}) {
  return (
    <div className={containerClassName}>
      <img
        src={src || fallbackSrc}
        alt={alt}
        className={`w-full ${heightClassName} object-contain p-4 transition duration-300 hover:scale-105`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackSrc;
        }}
      />
    </div>
  );
}
