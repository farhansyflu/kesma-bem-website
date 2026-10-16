const opts: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC", // kolom bertipe date (tanpa jam) -> hindari pergeseran hari
};

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", opts);
}

export function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const noYear: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", timeZone: "UTC" };
  if (s.getUTCFullYear() === e.getUTCFullYear()) {
    return `${s.toLocaleDateString("id-ID", noYear)} - ${e.toLocaleDateString("id-ID", noYear)}`;
  }
  return `${formatDate(start)} - ${formatDate(end)}`;
}
