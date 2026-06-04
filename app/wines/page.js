"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { defaultWines } from "../../data/defaultWines";
import { ensureDemoDataSeeded } from "../../lib/demoData";

const STORAGE_KEY = "wines";
const FALLBACK_WINE_IMAGE = "/images/wines/default-wine.jpg";

const initialForm = {
  name: "",
  type: "Red",
  body: "Medium",
  acidity: "Medium",
  sweetness: "Dry",
  tannin: "Medium",
  price: "",
  stock: "",
};

const typeOptions = [
  { value: "Red", label: "\ub808\ub4dc" },
  { value: "White", label: "\ud654\uc774\ud2b8" },
  { value: "Sparkling", label: "\uc2a4\ud30c\ud074\ub9c1" },
  { value: "Rose", label: "\ub85c\uc81c" },
];

const bodyOptions = [
  { value: "Light", label: "\uac00\ubcbc\uc6c0" },
  { value: "Medium", label: "\uc911\uac04" },
  { value: "Full", label: "\ubb35\uc9c1\ud568" },
];

const acidityOptions = [
  { value: "Low", label: "\ub0ae\uc74c" },
  { value: "Medium", label: "\uc911\uac04" },
  { value: "High", label: "\ub192\uc74c" },
];

const sweetnessOptions = [
  { value: "Dry", label: "\ub4dc\ub77c\uc774" },
  { value: "Medium", label: "\uc911\uac04" },
  { value: "Sweet", label: "\uc2a4\uc704\ud2b8" },
];

const tanninOptions = [
  { value: "Low", label: "\ub0ae\uc74c" },
  { value: "Medium", label: "\uc911\uac04" },
  { value: "High", label: "\ub192\uc74c" },
];

const typeLabels = Object.fromEntries(typeOptions.map((item) => [item.value, item.label]));
const bodyLabels = Object.fromEntries(bodyOptions.map((item) => [item.value, item.label]));
const acidityLabels = Object.fromEntries(acidityOptions.map((item) => [item.value, item.label]));
const sweetnessLabels = Object.fromEntries(
  sweetnessOptions.map((item) => [item.value, item.label])
);
const tanninLabels = Object.fromEntries(
  tanninOptions.map((item) => [item.value, item.label])
);

const typeGradients = {
  Red: "from-[#5b1f28] via-[#7e2832] to-[#2f0f15]",
  White: "from-[#f2dfad] via-[#f6ebc8] to-[#c9b57e]",
  Sparkling: "from-[#d9c6a1] via-[#f7f0de] to-[#b69a67]",
  Rose: "from-[#d89aa6] via-[#f4d4d9] to-[#b56d7b]",
};

function readWines() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export default function WinesPage() {
  const [form, setForm] = useState(initialForm);
  const [wines, setWines] = useState([]);

  useEffect(() => {
    ensureDemoDataSeeded();
    setWines(readWines());
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextWine = {
      id: Date.now(),
      name: form.name.trim(),
      type: form.type,
      body: form.body,
      acidity: form.acidity,
      sweetness: form.sweetness,
      tannin: form.tannin,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (!nextWine.name) {
      return;
    }

    const nextWines = [nextWine, ...wines];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextWines));
    setWines(nextWines);
    setForm(initialForm);
  }

  const galleryWines = useMemo(() => {
    return wines.length > 0 ? wines : defaultWines;
  }, [wines]);

  return (
    <main className="min-h-screen bg-[#121212] text-[#f5f1eb]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="rounded-[32px] border border-white/10 bg-[#1b1b1b] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#c3b19f]">
                {"\uc640\uc778 \ub4f1\ub85d"}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {"\uc640\uc778 \uc7ac\uace0 \uad00\ub9ac"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b7afa6] sm:text-base">
                {
                  "MVP \ubc1c\ud45c\uc6a9\uc73c\ub85c \uc640\uc778 \uc815\ubcf4\ub97c \ub85c\uceec\uc5d0 \uc800\uc7a5\ud558\uace0, \uc774\ud6c4 \ucd94\ucc9c \ud750\ub984\uc5d0\uc11c \ubc14\ub85c \ud65c\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."
                }
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {"\ud648\uc73c\ub85c \ub3cc\uc544\uac00\uae30"}
            </Link>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[28px] border border-white/10 bg-[#171717] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#baa996]">
                    {"\uc785\ub825 \ud3fc"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    {"\uc0c8 \uc640\uc778 \ub4f1\ub85d"}
                  </h2>
                </div>
                <span className="rounded-full bg-[#242424] px-4 py-2 text-sm text-[#d2c5b8]">
                  {`\ucd1d ${wines.length}\uac1c`}
                </span>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#d5ccc2]"
                  >
                    {"\uc640\uc778 \uc774\ub984"}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="\uc640\uc778 \uc774\ub984\uc744 \uc785\ub825\ud558\uc138\uc694"
                    className="w-full rounded-2xl border border-white/10 bg-[#222222] px-4 py-3 text-white outline-none transition placeholder:text-[#7f7a75] focus:border-[#d2b48c]/70"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    id="type"
                    name="type"
                    label="\uc885\ub958"
                    value={form.type}
                    options={typeOptions}
                    onChange={handleChange}
                  />
                  <SelectField
                    id="body"
                    name="body"
                    label="\ubc14\ub514\uac10"
                    value={form.body}
                    options={bodyOptions}
                    onChange={handleChange}
                  />
                  <SelectField
                    id="acidity"
                    name="acidity"
                    label="\uc0b0\ub3c4"
                    value={form.acidity}
                    options={acidityOptions}
                    onChange={handleChange}
                  />
                  <SelectField
                    id="sweetness"
                    name="sweetness"
                    label="\ub2f9\ub3c4"
                    value={form.sweetness}
                    options={sweetnessOptions}
                    onChange={handleChange}
                  />
                  <SelectField
                    id="tannin"
                    name="tannin"
                    label="\ud0c4\ub2cc"
                    value={form.tannin}
                    options={tanninOptions}
                    onChange={handleChange}
                  />

                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-medium text-[#d5ccc2]"
                    >
                      {"\uac00\uaca9"}
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="\uc608: 45000"
                      className="w-full rounded-2xl border border-white/10 bg-[#222222] px-4 py-3 text-white outline-none transition placeholder:text-[#7f7a75] focus:border-[#d2b48c]/70"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="stock"
                      className="mb-2 block text-sm font-medium text-[#d5ccc2]"
                    >
                      {"\uc7ac\uace0 \uc218\ub7c9"}
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="\uc608: 12"
                      className="w-full rounded-2xl border border-white/10 bg-[#222222] px-4 py-3 text-white outline-none transition placeholder:text-[#7f7a75] focus:border-[#d2b48c]/70"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#f5f1eb] px-5 py-3 text-sm font-semibold text-[#181818] transition hover:bg-white"
                >
                  {"\uc640\uc778 \uc800\uc7a5"}
                </button>
              </form>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#171717] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#baa996]">
                    {"\uc640\uc778 \ubaa9\ub85d"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    {"\uc800\uc7a5\ub41c \uc640\uc778"}
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#d2c5b8]">
                  {"\ub85c\uceec \uc800\uc7a5\uc18c"}
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                {wines.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-white/10 bg-[#202020] px-5 py-10 text-center text-sm text-[#9e968d]">
                    {
                      "\uc544\uc9c1 \uc800\uc7a5\ub41c \uc640\uc778\uc774 \uc5c6\uc2b5\ub2c8\ub2e4. \uc67c\ucabd \ud3fc\uc5d0\uc11c \uccab \uc640\uc778\uc744 \ub4f1\ub85d\ud574\ubcf4\uc138\uc694."
                    }
                  </div>
                ) : (
                  wines.map((wine) => (
                    <article
                      key={wine.id}
                      className="rounded-[24px] border border-white/10 bg-[#202020] p-5"
                    >
                      <WineBottleImage
                        src={wine.image}
                        alt={wine.name}
                        fallbackSrc={FALLBACK_WINE_IMAGE}
                      />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {wine.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#c3b19f]">
                            {typeLabels[wine.type] || wine.type}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#2b2b2b] px-3 py-1 text-xs text-[#ddd2c6]">
                          {`\uc7ac\uace0 ${wine.stock}`}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm text-[#d8d0c7] sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                          label="\ubc14\ub514\uac10"
                          value={bodyLabels[wine.body] || wine.body}
                        />
                        <InfoItem
                          label="\uc0b0\ub3c4"
                          value={acidityLabels[wine.acidity] || wine.acidity}
                        />
                        <InfoItem
                          label="\ub2f9\ub3c4"
                          value={sweetnessLabels[wine.sweetness] || wine.sweetness}
                        />
                        <InfoItem
                          label="\ud0c4\ub2cc"
                          value={tanninLabels[wine.tannin] || wine.tannin}
                        />
                        <InfoItem
                          label="\uac00\uaca9"
                          value={`${Number(wine.price).toLocaleString()}\uc6d0`}
                        />
                        <InfoItem label="\uc7ac\uace0" value={`${wine.stock}\ubcd1`} />
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="border-t border-white/10 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#baa996]">
                  {"\uc640\uc778 \uac24\ub7ec\ub9ac"}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {wines.length > 0
                    ? "\ub4f1\ub85d\ub41c \uc640\uc778 \ub9ac\uc2a4\ud2b8"
                    : "\uae30\ubcf8 \uc640\uc778 \ub9ac\uc2a4\ud2b8"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#b7afa6]">
                  {wines.length > 0
                    ? "\ud604\uc7ac \uc800\uc7a5\ub41c \uc640\uc778\uc744 \uce74\ub4dc\ud615 \ub9ac\uc2a4\ud2b8\ub85c \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."
                    : "\uc800\uc7a5\ub41c \uc640\uc778\uc774 \uc5c6\uc73c\uba74 \ud14c\uc2a4\ud2b8\uc6a9 \uae30\ubcf8 \uc640\uc778 30\uac1c\uac00 \uc774\ubbf8\uc9c0 \uce74\ub4dc\ub85c \ud45c\uc2dc\ub429\ub2c8\ub2e4."}
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#d2c5b8]">
                {`\ucd1d ${galleryWines.length}\uac1c`}
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {galleryWines.map((wine, index) => (
                <article
                  key={`gallery-${wine.id}-${index}`}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-[#171717]"
                >
                  <div
                    className={`relative bg-gradient-to-br ${typeGradients[wine.type] || "from-[#4a4039] via-[#706258] to-[#2d2520]"}`}
                  >
                    <WineBottleImage
                      src={wine.image}
                      alt={wine.name}
                      fallbackSrc={FALLBACK_WINE_IMAGE}
                      dark
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%)]" />
                    <div className="absolute left-6 top-6 rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                      {`${wine.id ?? index + 1}\ubc88`}
                    </div>
                    <div className="absolute bottom-5 left-6 right-6">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                        {typeLabels[wine.type] || wine.type}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">
                        {wine.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <p className="text-sm leading-7 text-[#cfc4b8]">
                      {wine.description || "\uae30\ubcf8 \uc640\uc778 \ub370\uc774\ud130\uc785\ub2c8\ub2e4."}
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoItem
                        label="\ubc14\ub514\uac10"
                        value={bodyLabels[wine.body] || wine.body}
                      />
                      <InfoItem
                        label="\uc0b0\ub3c4"
                        value={acidityLabels[wine.acidity] || wine.acidity}
                      />
                      <InfoItem
                        label="\ub2f9\ub3c4"
                        value={sweetnessLabels[wine.sweetness] || wine.sweetness}
                      />
                      <InfoItem
                        label="\ud0c4\ub2cc"
                        value={tanninLabels[wine.tannin] || wine.tannin}
                      />
                      <InfoItem label="\uc6d0\uc0b0\uc9c0" value={wine.origin || "-"} />
                      <InfoItem
                        label="\uac00\uaca9"
                        value={`${Number(wine.price || 0).toLocaleString()}\uc6d0`}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SelectField({ id, name, label, value, options, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#d5ccc2]"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-[#222222] px-4 py-3 text-white outline-none transition focus:border-[#d2b48c]/70"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#181818] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-[#8e857c]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function WineBottleImage({ src, alt, fallbackSrc, dark = false }) {
  return (
    <div
      className={`overflow-hidden rounded-[22px] border ${dark ? "border-white/10 bg-white/90" : "border-white/10 bg-[#f6efe6]"} mb-5`}
    >
      <img
        src={src || fallbackSrc}
        alt={alt}
        className="h-52 w-full object-contain p-4 transition duration-300 hover:scale-105"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackSrc;
        }}
      />
    </div>
  );
}
