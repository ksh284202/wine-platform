"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const WINES_KEY = "wines";
const MENUS_KEY = "menus";

const typeLabels = {
  Red: "\ub808\ub4dc",
  White: "\ud654\uc774\ud2b8",
  Sparkling: "\uc2a4\ud30c\ud074\ub9c1",
  Rose: "\ub85c\uc81c",
};

const categoryLabels = {
  Steak: "\uc2a4\ud14c\uc774\ud06c",
  Seafood: "\ud574\uc0b0\ubb3c",
  Pasta: "\ud30c\uc2a4\ud0c0",
  Dessert: "\ub514\uc800\ud2b8",
  Cheese: "\uce58\uc988",
  Spicy: "\ub9e4\uc6b4 \uc74c\uc2dd",
};

const levelLabels = {
  Low: "\ub0ae\uc74c",
  Medium: "\uc911\uac04",
  High: "\ub192\uc74c",
};

const weightLabels = {
  Light: "\uac00\ubcbc\uc6c0",
  Medium: "\uc911\uac04",
  Heavy: "\ubb34\uac70\uc6c0",
};

const sweetnessLabels = {
  Dry: "\ub4dc\ub77c\uc774",
  Medium: "\uc911\uac04",
  Sweet: "\uc2a4\uc704\ud2b8",
};

function readStoredArray(key) {
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function buildRecommendations(selectedMenu, wines) {
  if (!selectedMenu) {
    return [];
  }

  return wines
    .map((wine) => {
      let score = 0;
      const reasons = [];

      if (selectedMenu.category === "Steak" && wine.type === "Red") {
        score += 30;
        reasons.push(
          "\uc2a4\ud14c\uc774\ud06c\ub294 \ub808\ub4dc \uc640\uc778\uacfc \uc798 \uc5b4\uc6b8\ub9bd\ub2c8\ub2e4."
        );
      }

      if (selectedMenu.category === "Seafood" && wine.type === "White") {
        score += 30;
        reasons.push(
          "\ud574\uc0b0\ubb3c\uc740 \ud654\uc774\ud2b8 \uc640\uc778\uacfc \uc798 \uc5b4\uc6b8\ub9bd\ub2c8\ub2e4."
        );
      }

      if (selectedMenu.category === "Dessert" && wine.sweetness === "Sweet") {
        score += 30;
        reasons.push(
          "\ub514\uc800\ud2b8\ub294 \uc2a4\uc704\ud2b8 \uc640\uc778\uacfc \uad81\ud569\uc774 \uc88b\uc2b5\ub2c8\ub2e4."
        );
      }

      if (
        selectedMenu.category === "Cheese" &&
        (wine.type === "Sparkling" || wine.type === "Red")
      ) {
        score += 20;
        reasons.push(
          "\uce58\uc988\ub294 \uc2a4\ud30c\ud074\ub9c1 \ub610\ub294 \ub808\ub4dc \uc640\uc778\uacfc \uc798 \ub9de\uc2b5\ub2c8\ub2e4."
        );
      }

      if (selectedMenu.weight === "Heavy" && wine.body === "Full") {
        score += 20;
        reasons.push(
          "\ubb34\uac8c\uac10 \uc788\ub294 \uc74c\uc2dd\uc740 \ud480 \ubc14\ub514 \uc640\uc778\uacfc \uc798 \uc5b4\uc6b8\ub9bd\ub2c8\ub2e4."
        );
      }

      if (
        selectedMenu.spicyLevel === "High" &&
        (wine.sweetness === "Sweet" || wine.type === "Sparkling")
      ) {
        score += 20;
        reasons.push(
          "\ub9e4\uc6b4 \uc74c\uc2dd\uc740 \uc2a4\uc704\ud2b8 \ub610\ub294 \uc2a4\ud30c\ud074\ub9c1 \uc640\uc778\uc774 \uade0\ud615\uc744 \uc7a1\uc544\uc90d\ub2c8\ub2e4."
        );
      }

      if (selectedMenu.oiliness === "High" && wine.acidity === "High") {
        score += 15;
        reasons.push(
          "\uc0b0\ub3c4\uac00 \ub192\uc740 \uc640\uc778\uc740 \uae30\ub984\uc9c4 \uc74c\uc2dd\uc758 \ub290\ub07c\ud568\uc744 \uc7a1\uc544\uc90d\ub2c8\ub2e4."
        );
      }

      return {
        ...wine,
        score,
        reasons,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.name.localeCompare(b.name);
    });
}

export default function RecommendPage() {
  const [menus, setMenus] = useState([]);
  const [wines, setWines] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");

  useEffect(() => {
    const storedMenus = readStoredArray(MENUS_KEY);
    const storedWines = readStoredArray(WINES_KEY);

    setMenus(storedMenus);
    setWines(storedWines);

    if (storedMenus.length > 0) {
      setSelectedMenuId(String(storedMenus[0].id));
    }
  }, []);

  const selectedMenu = useMemo(() => {
    return menus.find((menu) => String(menu.id) === selectedMenuId) || null;
  }, [menus, selectedMenuId]);

  const recommendations = useMemo(() => {
    return buildRecommendations(selectedMenu, wines);
  }, [selectedMenu, wines]);

  const hasMenus = menus.length > 0;
  const hasWines = wines.length > 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f2ec] text-[#3f352f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_transparent_34%),linear-gradient(180deg,#f8f5f1_0%,#f3eee8_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7]/95 shadow-[0_18px_45px_rgba(78,64,52,0.08)]">
          <div className="flex flex-col gap-5 border-b border-[#ece4da] px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.34em] text-[#a38f80]">
                {"\ucd94\ucc9c \uc5d4\uc9c4"}
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#2f2622] sm:text-4xl">
                {"\uc640\uc778 \ucd94\ucc9c \uacb0\uacfc"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6c61] sm:text-base">
                {
                  "\uc800\uc7a5\ub41c \uba54\ub274\ub97c \uc120\ud0dd\ud558\uba74 MVP \ucd94\ucc9c \uaddc\uce59\uc5d0 \ub530\ub77c \uc640\uc778 \uc810\uc218\uc640 \ucd94\ucc9c \uc774\uc720\ub97c \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."
                }
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-[#e6ddd4] bg-[#f5f1eb] px-5 py-3 text-sm font-medium text-[#3f352f] transition hover:bg-white"
            >
              {"\ud648\uc73c\ub85c \ub3cc\uc544\uac00\uae30"}
            </Link>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-[28px] border border-[#ece3d9] bg-white/70 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#a28e80]">
                {"\uba54\ub274 \uc120\ud0dd"}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#302722]">
                {"\ucd94\ucc9c \uae30\uc900 \uba54\ub274"}
              </h2>

              {!hasMenus || !hasWines ? (
                <div className="mt-6 rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-8 text-sm leading-7 text-[#8a7d72]">
                  {!hasMenus && !hasWines
                    ? "\uba54\ub274\uc640 \uc640\uc778 \ub370\uc774\ud130\uac00 \uc544\uc9c1 \uc5c6\uc2b5\ub2c8\ub2e4. \uba3c\uc800 \uba54\ub274\uc640 \uc640\uc778\uc744 \ub4f1\ub85d\ud574\uc8fc\uc138\uc694."
                    : !hasMenus
                      ? "\uba54\ub274 \ub370\uc774\ud130\uac00 \uc5c6\uc2b5\ub2c8\ub2e4. \uba3c\uc800 \uba54\ub274\ub97c \ud558\ub098 \uc774\uc0c1 \ub4f1\ub85d\ud574\uc8fc\uc138\uc694."
                      : "\uc640\uc778 \ub370\uc774\ud130\uac00 \uc5c6\uc2b5\ub2c8\ub2e4. \uba3c\uc800 \uc640\uc778\uc744 \ud558\ub098 \uc774\uc0c1 \ub4f1\ub85d\ud574\uc8fc\uc138\uc694."}
                </div>
              ) : (
                <>
                  <div className="mt-6">
                    <label
                      htmlFor="menu-select"
                      className="mb-2 block text-sm font-medium text-[#5a4f49]"
                    >
                      {"\uba54\ub274"}
                    </label>
                    <select
                      id="menu-select"
                      value={selectedMenuId}
                      onChange={(event) => setSelectedMenuId(event.target.value)}
                      className="w-full rounded-2xl border border-[#e4dbd1] bg-[#fcfaf7] px-4 py-3 text-[#2f2622] outline-none transition focus:border-[#b59a87]"
                    >
                      {menus.map((menu) => (
                        <option key={menu.id} value={String(menu.id)}>
                          {menu.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedMenu ? (
                    <div className="mt-6 rounded-[24px] border border-[#e4dbd1] bg-[#fbf8f4] p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#9a8c80]">
                        {"\uc120\ud0dd\ub41c \uba54\ub274"}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-[#2f2622]">
                        {selectedMenu.name}
                      </h3>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <InfoItem
                          label="\uce74\ud14c\uace0\ub9ac"
                          value={categoryLabels[selectedMenu.category] || selectedMenu.category}
                        />
                        <InfoItem
                          label="\ubb34\uac8c\uac10"
                          value={weightLabels[selectedMenu.weight] || selectedMenu.weight}
                        />
                        <InfoItem
                          label="\uae30\ub984\uc9d0"
                          value={levelLabels[selectedMenu.oiliness] || selectedMenu.oiliness}
                        />
                        <InfoItem
                          label="\ub9e4\uc6b4\ub9db"
                          value={levelLabels[selectedMenu.spicyLevel] || selectedMenu.spicyLevel}
                        />
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </section>

            <section className="rounded-[28px] border border-[#ece3d9] bg-[#f5f0ea] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#a28e80]">
                    {"\uacb0\uacfc \ubaa9\ub85d"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#312823]">
                    {"\ucd94\ucc9c \uc21c\uc704"}
                  </h2>
                </div>
                <span className="rounded-full border border-[#e6ddd4] bg-[#fbf8f4] px-4 py-2 text-sm text-[#7a6d63]">
                  {`\ucd1d ${recommendations.length}\uac1c`}
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                {!hasMenus || !hasWines ? (
                  <div className="rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-10 text-center text-sm text-[#8a7d72]">
                    {
                      "\uba54\ub274\uc640 \uc640\uc778 \ub370\uc774\ud130\ub97c \uc800\uc7a5\ud558\uba74 \uc774 \uc601\uc5ed\uc5d0 \ucd94\ucc9c \uacb0\uacfc\uac00 \ud45c\uc2dc\ub429\ub2c8\ub2e4."
                    }
                  </div>
                ) : (
                  recommendations.map((wine) => (
                    <article
                      key={wine.id}
                      className="rounded-[24px] border border-[#e4dbd1] bg-[#fbf8f4] p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-[#2f2622]">
                            {wine.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#8a7769]">
                            {typeLabels[wine.type] || wine.type}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#312823] px-4 py-2 text-sm font-medium text-[#f8f3ee]">
                          {`\uc810\uc218 ${wine.score}`}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem label="\uc885\ub958" value={typeLabels[wine.type] || wine.type} />
                        <InfoItem
                          label="\uac00\uaca9"
                          value={`${Number(wine.price).toLocaleString()}\uc6d0`}
                        />
                        <InfoItem label="\uc7ac\uace0" value={`${wine.stock}\ubcd1`} />
                        <InfoItem
                          label="\ub2f9\ub3c4"
                          value={sweetnessLabels[wine.sweetness] || wine.sweetness}
                        />
                      </div>

                      <div className="mt-5 rounded-[20px] border border-[#e8ded3] bg-white/70 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#9a8c80]">
                          {"\ucd94\ucc9c \uc774\uc720"}
                        </p>
                        {wine.reasons.length === 0 ? (
                          <p className="mt-3 text-sm leading-7 text-[#7a6c61]">
                            {
                              "\uc774 \uc640\uc778\uc5d0\ub294 \uac15\ud558\uac8c \uc77c\uce58\ud558\ub294 \ucd94\ucc9c \uaddc\uce59\uc774 \uc801\uc6a9\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4."
                            }
                          </p>
                        ) : (
                          <ul className="mt-3 space-y-2 text-sm leading-7 text-[#5f5249]">
                            {wine.reasons.map((reason) => (
                              <li key={reason}>- {reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
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
