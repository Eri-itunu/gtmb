import { useCallback } from "react";
import { storage } from "./persistentStorage";

const DRAFT_PREFIX = "draft:";

export const useDraftForm = (applicationId: string) => {
  const key = `${DRAFT_PREFIX}${applicationId}`;

  const saveDraft = useCallback(
    (data: Record<string, unknown>) => {
      storage.set(key, JSON.stringify(data)).catch(() => undefined);
    },
    [key]
  );

  const loadDraft = useCallback(async () => {
    const raw = await storage.getString(key);
    return raw ? JSON.parse(raw) : null;
  }, [key]);

  const clearDraft = useCallback(async () => {
    await storage.remove(key);
  }, [key]);

  return { saveDraft, loadDraft, clearDraft };
};
