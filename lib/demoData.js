import { defaultMenus } from "../data/defaultMenus";
import { defaultWines } from "../data/defaultWines";

const STORAGE_KEYS = {
  wines: "wines",
  menus: "menus",
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

export function ensureDemoDataSeeded() {
  const storedWines = readStoredArray(STORAGE_KEYS.wines);
  const storedMenus = readStoredArray(STORAGE_KEYS.menus);

  if (storedWines.length === 0) {
    window.localStorage.setItem(
      STORAGE_KEYS.wines,
      JSON.stringify(defaultWines)
    );
  }

  if (storedMenus.length === 0) {
    window.localStorage.setItem(
      STORAGE_KEYS.menus,
      JSON.stringify(defaultMenus)
    );
  }
}

export function getSeededDashboardData() {
  ensureDemoDataSeeded();

  return {
    wines: readStoredArray(STORAGE_KEYS.wines),
    menus: readStoredArray(STORAGE_KEYS.menus),
  };
}
