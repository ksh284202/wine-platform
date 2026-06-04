"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ensureDemoDataSeeded } from "../../lib/demoData";

const STORAGE_KEY = "menus";

const initialForm = {
  name: "",
  category: "Steak",
  weight: "Medium",
  oiliness: "Medium",
  spicyLevel: "Low",
  price: "",
};

const categoryOptions = [
  { value: "Steak", label: "\uc2a4\ud14c\uc774\ud06c" },
  { value: "Seafood", label: "\ud574\uc0b0\ubb3c" },
  { value: "Pasta", label: "\ud30c\uc2a4\ud0c0" },
  { value: "Dessert", label: "\ub514\uc800\ud2b8" },
  { value: "Cheese", label: "\uce58\uc988" },
  { value: "Spicy", label: "\ub9e4\uc6b4 \uc74c\uc2dd" },
];

const weightOptions = [
  { value: "Light", label: "\uac00\ubcbc\uc6c0" },
  { value: "Medium", label: "\uc911\uac04" },
  { value: "Heavy", label: "\ubb34\uac70\uc6c0" },
];

const levelOptions = [
  { value: "Low", label: "\ub0ae\uc74c" },
  { value: "Medium", label: "\uc911\uac04" },
  { value: "High", label: "\ub192\uc74c" },
];

const categoryLabels = Object.fromEntries(
  categoryOptions.map((item) => [item.value, item.label])
);
const weightLabels = Object.fromEntries(weightOptions.map((item) => [item.value, item.label]));
const levelLabels = Object.fromEntries(levelOptions.map((item) => [item.value, item.label]));

function readMenus() {
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

export default function MenusPage() {
  const [form, setForm] = useState(initialForm);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    ensureDemoDataSeeded();
    setMenus(readMenus());
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

    const nextMenu = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      weight: form.weight,
      oiliness: form.oiliness,
      spicyLevel: form.spicyLevel,
      price: Number(form.price),
    };

    if (!nextMenu.name) {
      return;
    }

    const nextMenus = [nextMenu, ...menus];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMenus));
    setMenus(nextMenus);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f2ec] text-[#3f352f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_transparent_34%),linear-gradient(180deg,#f8f5f1_0%,#f3eee8_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[36px] border border-[#e7dfd5] bg-[#fcfaf7]/95 shadow-[0_18px_45px_rgba(78,64,52,0.08)]">
          <div className="flex flex-col gap-5 border-b border-[#ece4da] px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.34em] text-[#a38f80]">
                {"\uba54\ub274 \ub4f1\ub85d"}
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#2f2622] sm:text-4xl">
                {"\ud398\uc5b4\ub9c1 \uba54\ub274 \uad00\ub9ac"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6c61] sm:text-base">
                {
                  "\ucd94\ucc9c \ud14c\uc2a4\ud2b8\uc640 \ucf5c\ud0a4\uc9c0 \uc2dc\ub098\ub9ac\uc624\uc5d0 \uc0ac\uc6a9\ud560 \uba54\ub274 \ub370\uc774\ud130\ub97c \ub85c\uceec\uc5d0 \uc800\uc7a5\ud569\ub2c8\ub2e4."
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

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[28px] border border-[#ece3d9] bg-white/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#a28e80]">
                    {"\uc785\ub825 \ud3fc"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#302722]">
                    {"\uc0c8 \uba54\ub274 \ub4f1\ub85d"}
                  </h2>
                </div>
                <span className="rounded-full bg-[#f5f0ea] px-4 py-2 text-sm text-[#7a6d63]">
                  {`\ucd1d ${menus.length}\uac1c`}
                </span>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#5a4f49]"
                  >
                    {"\uba54\ub274 \uc774\ub984"}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="\uba54\ub274 \uc774\ub984\uc744 \uc785\ub825\ud558\uc138\uc694"
                    className="w-full rounded-2xl border border-[#e4dbd1] bg-[#fcfaf7] px-4 py-3 text-[#2f2622] outline-none transition placeholder:text-[#9a8e84] focus:border-[#b59a87]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    id="category"
                    name="category"
                    label="\uc74c\uc2dd \uce74\ud14c\uace0\ub9ac"
                    value={form.category}
                    options={categoryOptions}
                    onChange={handleChange}
                  />
                  <SelectField
                    id="weight"
                    name="weight"
                    label="\ubb34\uac8c\uac10"
                    value={form.weight}
                    options={weightOptions}
                    onChange={handleChange}
                  />
                  <SelectField
                    id="oiliness"
                    name="oiliness"
                    label="\uae30\ub984\uc9d0"
                    value={form.oiliness}
                    options={levelOptions}
                    onChange={handleChange}
                  />
                  <SelectField
                    id="spicyLevel"
                    name="spicyLevel"
                    label="\ub9e4\uc6b4\ub9db"
                    value={form.spicyLevel}
                    options={levelOptions}
                    onChange={handleChange}
                  />

                  <div className="md:col-span-2">
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-medium text-[#5a4f49]"
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
                      placeholder="\uc608: 32000"
                      className="w-full rounded-2xl border border-[#e4dbd1] bg-[#fcfaf7] px-4 py-3 text-[#2f2622] outline-none transition placeholder:text-[#9a8e84] focus:border-[#b59a87]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#312823] px-5 py-3 text-sm font-semibold text-[#f8f3ee] transition hover:bg-[#433730]"
                >
                  {"\uba54\ub274 \uc800\uc7a5"}
                </button>
              </form>
            </section>

            <section className="rounded-[28px] border border-[#ece3d9] bg-[#f5f0ea] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#a28e80]">
                    {"\uba54\ub274 \ubaa9\ub85d"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#312823]">
                    {"\uc800\uc7a5\ub41c \uba54\ub274"}
                  </h2>
                </div>
                <span className="rounded-full border border-[#e6ddd4] bg-[#fbf8f4] px-4 py-2 text-sm text-[#7a6d63]">
                  {"\ub85c\uceec \uc800\uc7a5\uc18c"}
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                {menus.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-[#ded3c7] bg-[#fbf8f4] px-5 py-10 text-center text-sm text-[#8a7d72]">
                    {
                      "\uc544\uc9c1 \uc800\uc7a5\ub41c \uba54\ub274\uac00 \uc5c6\uc2b5\ub2c8\ub2e4. \uc67c\ucabd \ud3fc\uc5d0\uc11c \uccab \uba54\ub274\ub97c \ub4f1\ub85d\ud574\ubcf4\uc138\uc694."
                    }
                  </div>
                ) : (
                  menus.map((menu) => (
                    <article
                      key={menu.id}
                      className="rounded-[24px] border border-[#e4dbd1] bg-[#fbf8f4] p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-[#2f2622]">
                            {menu.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#8a7769]">
                            {categoryLabels[menu.category] || menu.category}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#f1e8dd] px-3 py-1 text-xs text-[#6f5e52]">
                          {`${Number(menu.price).toLocaleString()}\uc6d0`}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem
                          label="\ubb34\uac8c\uac10"
                          value={weightLabels[menu.weight] || menu.weight}
                        />
                        <InfoItem
                          label="\uae30\ub984\uc9d0"
                          value={levelLabels[menu.oiliness] || menu.oiliness}
                        />
                        <InfoItem
                          label="\ub9e4\uc6b4\ub9db"
                          value={levelLabels[menu.spicyLevel] || menu.spicyLevel}
                        />
                        <InfoItem
                          label="\uac00\uaca9"
                          value={`${Number(menu.price).toLocaleString()}\uc6d0`}
                        />
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

function SelectField({ id, name, label, value, options, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#5a4f49]"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-[#e4dbd1] bg-[#fcfaf7] px-4 py-3 text-[#2f2622] outline-none transition focus:border-[#b59a87]"
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
    <div className="rounded-2xl border border-[#e8ded3] bg-white/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-[#9a8c80]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[#312823]">{value}</p>
    </div>
  );
}
