"use client";

import { useEffect } from "react";

const SCROLLABLE_SELECTORS = [
  "[class*='overflow-y-auto']",
  "[class*='overflow-y-scroll']",
] as const;

const WOMPI_SELECTORS = [
  "#wompi-checkout-modal",
  ".wompi-checkout-modal",
  "iframe[src*='wompi']",
  "[class*='wompi']",
] as const;

function esElementoWompi(el: Element): boolean {
  return WOMPI_SELECTORS.some((selector) => {
    if (selector.startsWith("#") || selector.startsWith(".")) {
      return el.matches(selector) || el.closest(selector) !== null;
    }
    return el.matches(selector);
  });
}

function aplicarBloqueoScroll() {
  SCROLLABLE_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement && !esElementoWompi(el)) {
        el.dataset.scrollLockPrev = el.style.overflow || "";
        el.style.overflow = "hidden";
      }
    });
  });
}

function restaurarBloqueoScroll() {
  SCROLLABLE_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement && el.dataset.scrollLockPrev !== undefined) {
        el.style.overflow = el.dataset.scrollLockPrev;
        delete el.dataset.scrollLockPrev;
      }
    });
  });
}

export function useBloqueoScroll(activo: boolean) {
  useEffect(() => {
    if (activo) {
      aplicarBloqueoScroll();
    } else {
      restaurarBloqueoScroll();
    }
  }, [activo]);
}
