import { useCallback } from "react";
import { secureStorage } from "./secureStorage";

const DRAFT_PREFIX = "draft:";

export const useDraftForm = (applicationId: string) => {
  const key = `${DRAFT_PREFIX}${applicationId}`;

  const saveDraft = useCallback(
    (data: Record<string, unknown>) => {
      secureStorage.set(key, JSON.stringify(data)).catch(() => undefined);
    },
    [key]
  );

  const loadDraft = useCallback(async () => {
    const raw = await secureStorage.getString(key);
    return raw ? JSON.parse(raw) : null;
  }, [key]);

  const clearDraft = useCallback(async () => {
    await secureStorage.remove(key);
  }, [key]);

  return { saveDraft, loadDraft, clearDraft };
};
