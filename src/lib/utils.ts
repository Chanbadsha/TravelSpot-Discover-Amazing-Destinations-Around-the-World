export const isValidUrl = (url: unknown): string | false => {
  if (typeof url !== "string") return false;
  if (url !== url.trim()) return false;
  try {
    new URL(url);
    return url;
  } catch {
    return false;
  }
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};