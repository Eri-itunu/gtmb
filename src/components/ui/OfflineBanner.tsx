import { AlertBanner } from "./AlertBanner";

export interface OfflineBannerProps {
  message?: string;
}

export function OfflineBanner({
  message = "You appear to be offline. Your draft is safe on this device.",
}: OfflineBannerProps) {
  return <AlertBanner title="Offline mode" message={message} variant="warning" />;
}
