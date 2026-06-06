import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { storage } from "@/store/persistentStorage";

export const useDraftForm = <T extends Record<string, unknown>>(applicationId: string, value?: T) => {
  const key = useMemo(() => `draft:${applicationId}`, [applicationId]);
  const [savedDraft, setSavedDraft] = useState<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveDraft = useCallback(
    (data: T) => {
      storage.set(key, JSON.stringify(data)).catch(() => undefined);
      setSavedDraft(data);
    },
    [key]
  );

  const clearDraft = useCallback(() => {
    storage.remove(key).catch(() => undefined);
    setSavedDraft(null);
  }, [key]);

  useEffect(() => {
    let isMounted = true;

    const loadDraft = async () => {
      const stored = await storage.getString(key);
      if (!isMounted || !stored) return;
      setSavedDraft(JSON.parse(stored) as T);
    };

    loadDraft().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [key]);

  useEffect(() => {
    if (!value) return undefined;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => saveDraft(value), 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [saveDraft, value]);

  return { savedDraft, saveDraft, clearDraft };
};
