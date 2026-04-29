export function parseIso(iso: string) {
  return new Date(iso);
}

export function startOfDayUtc(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export function toDayKeyUtc(isoOrDate: string | Date) {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  const s = startOfDayUtc(d);
  return s.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function daysBetweenUtc(a: Date, b: Date) {
  const ms = startOfDayUtc(b).getTime() - startOfDayUtc(a).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export function addDaysUtc(d: Date, deltaDays: number) {
  return new Date(d.getTime() + deltaDays * 24 * 60 * 60 * 1000);
}

