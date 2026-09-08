"use client";

import { useEffect } from "react";

let activeLocks = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (activeLocks === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousDocumentOverflow = document.documentElement.style.overflow;
    }
    activeLocks += 1;

    const applyLock = () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
    applyLock();
    window.addEventListener("resize", applyLock);

    return () => {
      window.removeEventListener("resize", applyLock);
      activeLocks = Math.max(0, activeLocks - 1);

      if (activeLocks === 0) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousDocumentOverflow;
      }
    };
  }, [locked]);
}
