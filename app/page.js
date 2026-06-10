"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { defaultWines } from "../data/defaultWines";
import { getSeededDashboardData } from "../lib/demoData";

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

const VALUE_POINTS = [
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,45,32,0.14),_transparent_24%),linear-gradient(180deg,#080706_0%,#120d0b_46%,#f6f2ec_46%,#f6f2ec_100%)] text-[#f4ede6]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-[#4a352c] bg-[linear-gradient(135deg,rgba(18,13,10,0.98)_0%,rgba(28,20,17,0.96)_55%,rgba(17,12,10,0.98)_100%)] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:p-8 lg:min-h-[780px] lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(184,127,57,0.12),transparent_28%),radial-gradient(circle_at_75%_75%,rgba(121,34,49,0.18),transparent_22%)]" />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-[#e0bf8d]">
                    WineOps AI
                  </p>
                  <p className="mt-2 text-sm text-[#cdbfb2]">
                    AI 기반 와인 운영 및 콜키지 추천 플랫폼
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <Link
                    href="/"
                    className="rounded-full border border-[#5a4338] px-4 py-2 text-[#f2e6d8] transition hover:bg-white/5"
                  >
                    Home
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-[#5a4338] px-4 py-2 text-[#f2e6d8] transition hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-[linear-gradient(90deg,#7b1e2f_0%,#8c2734_55%,#652335_100%)] px-4 py-2 text-white transition hover:brightness-110"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>

              <h1 className="mt-10 max-w-4xl text-4xl font-semibold leading-[1.16] tracking-[-0.05em] text-[#f7f2ec] sm:text-5xl lg:text-7xl">
                더 스마트한 와인 운영과
                <br />
                <span className="bg-[linear-gradient(180deg,#f0cc8c_0%,#ddb06c_100%)] bg-clip-text text-transparent">
                  완벽한 페어링
                </span>
                을 한 곳에서
              </h1>

              <p className="mt-8 max-w-3xl text-base leading-9 text-[#d0c1b5] sm:text-[1.05rem]">
                와인 운영, 재고 관리, 판매 분석부터 고객 취향 기반 추천까지 와인
                비즈니스의 모든 것을 지원하는 AI 기반 플랫폼입니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[linear-gradient(90deg,#7b1e2f_0%,#8c2734_55%,#652335_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_28px_rgba(110,20,32,0.28)] transition hover:brightness-110"
                >
                  시작하기
                </Link>
                <Link
                  href="/recommend"
                  className="rounded-full border border-[#5a4338] px-6 py-3 text-base font-semibold text-[#f3e6d8] transition hover:bg-white/5"
                >
                  추천 보기
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <RoleCard
                  title="소비자"
                  description="취향에 맞는 와인 추천과 콜키지 가능한 매장 탐색"
                  icon={<GlassIcon />}
                />
                <RoleCard
                  title="사업자"
                  description="매장·메뉴·재고 관리부터 판매 분석까지 한 번에"
                  icon={<StoreIcon />}
                />
                <RoleCard
                  title="관리자"
                  description="플랫폼 운영 관리와 데이터 통합 관리"
                  icon={<CheckShieldIcon />}
                />
              </div>

              <div className="mt-10 grid items-end gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[310px] rounded-[28px] border border-[#4a352c] bg-[linear-gradient(180deg,rgba(19,15,13,0.64),rgba(10,8,7,0.82))] p-6">
                  <div className="absolute bottom-6 left-4 h-28 w-28 rounded-full bg-[#4e1019]/35 blur-2xl" />
                  <div className="absolute bottom-10 left-14 right-14 h-7 rounded-full bg-black/35 blur-xl" />

                  <div className="absolute bottom-0 left-2 w-40 sm:w-48">
                    <img
                      src={FALLBACK_WINE_IMAGE}
                      alt="와인 병"
                      className="h-auto w-full object-contain drop-shadow-[0_26px_24px_rgba(0,0,0,0.45)]"
                    />
                  </div>

                  <div className="absolute bottom-2 left-36 hidden h-52 w-28 items-end justify-center sm:flex">
                    <div className="absolute bottom-0 h-10 w-20 rounded-full bg-black/30 blur-md" />
                    <div className="relative flex h-full w-full items-end justify-center">
                      <div className="absolute bottom-10 h-1 w-16 rounded-full bg-[#8b1d2a]" />
                      <div className="absolute bottom-[4.6rem] h-20 w-[4.6rem] rounded-b-[2.6rem] rounded-t-[1.8rem] border border-[#ccb6a6] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                      <div className="absolute bottom-[4.7rem] h-10 w-[4.2rem] rounded-b-[2rem] bg-[linear-gradient(180deg,rgba(99,18,23,0.92),rgba(58,8,10,0.95))]" />
                      <div className="absolute bottom-7 h-16 w-[2px] bg-[#d7cabf]" />
                      <div className="absolute bottom-5 h-3 w-14 rounded-full border border-[#d7cabf] bg-[rgba(255,255,255,0.02)]" />
                    </div>
                  </div>

                  <div className="absolute inset-0 pointer-events-none" />
                </div>

                <div className="rounded-[28px] border border-[#433028] bg-[rgba(17,13,12,0.66)] p-5 backdrop-blur">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FeatureItem label="실시간 재고 흐름" value={`${counts.wines}개의 와인 데이터가 준비되어 있습니다.`} />
                    <FeatureItem label="추천 정확도" value="음식과 와인의 규칙 기반 추천 로직 제공" />
                    <FeatureItem label="역할 분리" value="소비자, 사업자, 관리자별 대시보드 구성" />
                    <FeatureItem label="현재 상태" value={hasAnyData ? "발표 및 데모 진행 가능" : "초기 설정 진행 중"} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#4a352c] bg-[linear-gradient(180deg,rgba(24,18,16,0.96),rgba(17,12,10,0.98))] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:p-8 lg:min-h-[780px]">
            <p className="text-sm uppercase tracking-[0.34em] text-[#e0bf8d]">
              Dashboard
            </p>
            <h2 className="mt-8 text-5xl font-semibold tracking-[-0.05em] text-[#fbf5ee]">
              서비스 현황
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#d0c1b5]">
              발표용 MVP에 필요한 핵심 운영 지표와 빠른 진입 메뉴를 한 화면에서
              확인할 수 있습니다.
            </p>

            <div className="mt-10 grid gap-4">
              <StatCard label="와인 수" value={counts.wines} helper="localStorage wines 기준" />
              <StatCard label="메뉴 수" value={counts.menus} helper="localStorage menus 기준" />
              <StatusCard
                title="추천 상태"
                description={
                  hasAnyData
                    ? "데이터 확인 및 추천이 가능한 상태입니다."
                    : "첫 데이터 등록을 기다리는 상태입니다."
                }
              />
            </div>

            <div className="mt-10 grid gap-3">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[22px] border border-[#4e3a31] bg-[rgba(47,34,30,0.62)] px-5 py-5 transition hover:bg-[rgba(64,44,38,0.82)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#f8f0e6]">
                        {item.label}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-[#d4c5b8]">
                        {item.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(255,255,255,0.08)] px-3 py-1 text-sm text-[#f0decd]">
                      이동
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 rounded-[28px] border border-[#ebdfd3] bg-[linear-gradient(180deg,#fbf7f2_0%,#f3ece4_100%)] px-5 py-6 text-[#322822] shadow-[0_20px_55px_rgba(0,0,0,0.08)] md:grid-cols-2 xl:grid-cols-4 xl:px-8">
          {VALUE_POINTS.map((item, index) => (
            <div
              key={item.title}
              className={`flex gap-4 ${index < VALUE_POINTS.length - 1 ? "xl:border-r xl:border-[#e5d9cf] xl:pr-6" : ""}`}
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

        <section className="mt-8 rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7]/95 px-6 py-6 text-[#3f352f] shadow-[0_18px_45px_rgba(78,64,52,0.08)] sm:px-8">
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

          {previewDefaultWines.length === 0 ? (
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

        <section className="mt-8 rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7]/95 px-6 py-6 text-[#3f352f] shadow-[0_18px_45px_rgba(78,64,52,0.08)] sm:px-8">
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

          {topRecommendations.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-10 text-center text-sm text-[#8a7d72]">
              메뉴를 등록하면 추천 랭킹이 표시됩니다.
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
                    <span className="text-sm text-[#8a7769]">점수 {wine.score}</span>
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

function RoleCard({ title, description, icon }) {
  return (
    <div className="rounded-[28px] border border-[#5b453b] bg-[rgba(50,35,31,0.55)] p-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_rgba(138,35,54,0.68),rgba(74,21,31,0.92))] text-[#f1d5c0]">
        {icon}
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#f1c98a]">
        {title}
      </h2>
      <p className="mt-3 text-base leading-8 text-[#eaded2]">{description}</p>
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

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-[24px] border border-[#4e3a31] bg-[rgba(47,34,30,0.62)] p-5">
      <p className="text-sm uppercase tracking-[0.24em] text-[#cba98a]">{label}</p>
      <p className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[#d4c5b8]">{helper}</p>
    </div>
  );
}

function StatusCard({ title, description }) {
  return (
    <div className="rounded-[24px] border border-[#4e3a31] bg-[linear-gradient(135deg,rgba(78,20,31,0.72),rgba(53,29,36,0.88))] p-5">
      <p className="text-sm uppercase tracking-[0.24em] text-[#e6c4ac]">{title}</p>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
        {description}
      </p>
    </div>
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
