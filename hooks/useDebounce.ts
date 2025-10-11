"use client";

import { useCallback, useRef } from "react";

export function useDebounce(callback: () => void, delay: number) {
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(() => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);
}
