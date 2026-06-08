const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;
const MULTIPLE_SPACES = /\s+/g;
const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;
const SCRIPT_PATTERN = /(<script\b|javascript:|on\w+\s*=)/i;
const SQL_META_PATTERN = /(--|\/\*|\*\/|;|\bunion\s+select\b|\bdrop\s+table\b|\binsert\s+into\b|\bdelete\s+from\b|\balter\s+table\b|\bexec(?:ute)?\b)/i;
const ADDRESS_UNSAFE_CHARACTERS = /[<>{}[\]`\\|]/g;
const MONEY_UNSAFE_CHARACTERS = /[^\d,]/g;
const DIGIT_UNSAFE_CHARACTERS = /\D/g;

export const sanitizeTextInput = (value: string, maxLength = 160) =>
  value.replace(CONTROL_CHARACTERS, "").replace(MULTIPLE_SPACES, " ").trim().slice(0, maxLength);

export const sanitizeAddressInput = (value: string) =>
  sanitizeTextInput(value.replace(ADDRESS_UNSAFE_CHARACTERS, ""), 180);

export const sanitizeMoneyInput = (value: string) =>
  value.replace(MONEY_UNSAFE_CHARACTERS, "").slice(0, 15);

export const sanitizeDigitsInput = (value: string, maxLength = 2) =>
  value.replace(DIGIT_UNSAFE_CHARACTERS, "").slice(0, maxLength);

export const formatMoneyInput = (value: string) => {
  const digits = sanitizeMoneyInput(value).replace(/,/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
};

export const containsUnsafeInput = (value: string) => {
  const normalized = sanitizeTextInput(value, 300);
  return HTML_TAG_PATTERN.test(normalized) || SCRIPT_PATTERN.test(normalized) || SQL_META_PATTERN.test(normalized);
};
