const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formatNaira = (kobo: number) => nairaFormatter.format(kobo / 100);

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));

export const formatLoanTerm = (months: number) => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (!years) return `${months} months`;
  if (!remainingMonths) return `${years} ${years === 1 ? "year" : "years"}`;
  return `${years}y ${remainingMonths}m`;
};

export const formatRelativeDate = (iso: string) => {
  const now = Date.now();
  const target = new Date(iso).getTime();
  const diffDays = Math.max(0, Math.floor((now - target) / 86_400_000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso);
};
