"use client";

import { useEffect } from "react";

const SCROLLABLE_SELECTORS = [
  "[class*='overflow-y-auto']",
  "[class*='overflow-y-scroll']",
] as const;

function aplicarBloqueoScroll() {
  SCROLLABLE_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement) {
        el.dataset.scrollLockPrev = el.style.overflow || "";
        el.style.overflow = "hidden";
      }
    });
  });
}

function restaurarBloqueoScroll() {
  SCROLLABLE_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.overflow = el.dataset.scrollLockPrev || "";
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
