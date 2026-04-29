import type { ClinicDb, AppointmentStatus, EncounterDiagnosis } from "../types";
import { addDaysUtc, toDayKeyUtc } from "./date";

export type AnalyticsFilters = {
  startIso: string; // inclusive
  endIso: string; // inclusive
  providerId?: string;
  locationId?: string;
};

export type TimePoint = { day: string; value: number };

export type OutcomesPoint = {
  week: string; // YYYY-MM-DD of week start
  completed: number;
  no_show: number;
  cancelled: number;
  scheduled: number;
};

export type DiagnosisPoint = { diagnosis: EncounterDiagnosis; count: number };

export type AgeBucketPoint = { bucket: string; count: number };
export type SexPoint = { sex: string; count: number };

export type BpControlPoint = { month: string; controlledPct: number }; // 0..100
export type LabAbnormalPoint = { week: string; abnormal: number; critical: number };

function within(iso: string, startIso: string, endIso: string) {
  return iso >= startIso && iso <= endIso;
}

function filterAppointments(db: ClinicDb, f: AnalyticsFilters) {
  return db.appointments.filter((a) => {
    if (!within(a.startAt, f.startIso, f.endIso)) return false;
    if (f.providerId && a.providerId !== f.providerId) return false;
    if (f.locationId && a.locationId !== f.locationId) return false;
    return true;
  });
}

export type AnalyticsKpis = {
  totalVisits: number;
  completionRate: number; // 0..1
  noShowRate: number; // 0..1
};

export function getAnalyticsKpis(db: ClinicDb, f: AnalyticsFilters): AnalyticsKpis {
  const appts = filterAppointments(db, f).filter((a) => a.status !== "cancelled");
  const denom = appts.length || 1;
  const completed = appts.filter((a) => a.status === "completed").length;
  const noShows = appts.filter((a) => a.status === "no_show").length;
  return {
    totalVisits: appts.length,
    completionRate: completed / denom,
    noShowRate: noShows / denom,
  };
}

export function getAppointmentsOverTime(db: ClinicDb, f: AnalyticsFilters): TimePoint[] {
  const appts = filterAppointments(db, f).filter((a) => a.status !== "cancelled");
  const counts = new Map<string, number>();
  for (const a of appts) {
    const key = toDayKeyUtc(a.startAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const start = new Date(f.startIso);
  const end = new Date(f.endIso);
  const points: TimePoint[] = [];
  for (let d = start; d <= end; d = addDaysUtc(d, 1)) {
    const key = toDayKeyUtc(d);
    points.push({ day: key, value: counts.get(key) ?? 0 });
  }
  return points;
}

function weekStartKeyUtc(iso: string) {
  const d = new Date(iso);
  // Week starts Monday (ISO-ish)
  const day = d.getUTCDay(); // Sun=0
  const delta = day === 0 ? -6 : 1 - day;
  const ws = addDaysUtc(d, delta);
  return toDayKeyUtc(ws);
}

export function getAppointmentOutcomesByWeek(db: ClinicDb, f: AnalyticsFilters): OutcomesPoint[] {
  const appts = filterAppointments(db, f);
  const agg = new Map<string, OutcomesPoint>();

  const ensure = (week: string) => {
    const existing = agg.get(week);
    if (existing) return existing;
    const base: OutcomesPoint = {
      week,
      completed: 0,
      no_show: 0,
      cancelled: 0,
      scheduled: 0,
    };
    agg.set(week, base);
    return base;
  };

  for (const a of appts) {
    const week = weekStartKeyUtc(a.startAt);
    const row = ensure(week);
    const key = a.status as AppointmentStatus;
    if (key === "checked_in") row.scheduled += 1;
    else row[key] += 1;
  }

  return [...agg.values()].sort((a, b) => a.week.localeCompare(b.week));
}

export function getTopDiagnoses(db: ClinicDb, f: AnalyticsFilters, limit = 8): DiagnosisPoint[] {
  const enc = db.encounters.filter((e) => within(e.startAt, f.startIso, f.endIso));
  const counts = new Map<EncounterDiagnosis, number>();
  for (const e of enc) {
    if (f.providerId && e.providerId !== f.providerId) continue;
    for (const dx of e.diagnoses) counts.set(dx, (counts.get(dx) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([diagnosis, count]) => ({ diagnosis, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function ageFromDob(dob: string, asOf: Date) {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const birth = new Date(Date.UTC(y, m - 1, d));
  let age = asOf.getUTCFullYear() - birth.getUTCFullYear();
  const md = asOf.getUTCMonth() - birth.getUTCMonth();
  if (md < 0 || (md === 0 && asOf.getUTCDate() < birth.getUTCDate())) age -= 1;
  return Math.max(0, age);
}

export function getDemographics(db: ClinicDb, asOfIso: string) {
  const asOf = new Date(asOfIso);
  const ageBuckets = [
    { bucket: "0–17", min: 0, max: 17 },
    { bucket: "18–34", min: 18, max: 34 },
    { bucket: "35–49", min: 35, max: 49 },
    { bucket: "50–64", min: 50, max: 64 },
    { bucket: "65+", min: 65, max: 200 },
  ];
  const ageCounts = new Map<string, number>(ageBuckets.map((b) => [b.bucket, 0]));
  const sexCounts = new Map<string, number>();

  for (const p of db.patients) {
    const age = ageFromDob(p.dob, asOf);
    const bucket = ageBuckets.find((b) => age >= b.min && age <= b.max)?.bucket ?? "Unknown";
    ageCounts.set(bucket, (ageCounts.get(bucket) ?? 0) + 1);
    sexCounts.set(p.sexAtBirth, (sexCounts.get(p.sexAtBirth) ?? 0) + 1);
  }

  const ageSeries: AgeBucketPoint[] = [...ageCounts.entries()].map(([bucket, count]) => ({
    bucket,
    count,
  }));
  const sexSeries: SexPoint[] = [...sexCounts.entries()].map(([sex, count]) => ({ sex, count }));
  return { ageSeries, sexSeries };
}

export function getBpControlByMonth(db: ClinicDb, f: AnalyticsFilters): BpControlPoint[] {
  const vitals = db.vitals.filter((v) => within(v.recordedAt, f.startIso, f.endIso));
  const byMonth = new Map<string, { controlled: number; total: number }>();

  for (const v of vitals) {
    const month = v.recordedAt.slice(0, 7); // YYYY-MM
    const row = byMonth.get(month) ?? { controlled: 0, total: 0 };
    row.total += 1;
    if (v.systolicBP < 140 && v.diastolicBP < 90) row.controlled += 1;
    byMonth.set(month, row);
  }

  return [...byMonth.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, row]) => ({
      month,
      controlledPct: row.total ? Math.round((row.controlled / row.total) * 1000) / 10 : 0,
    }));
}

export function getLabAbnormalRateByWeek(db: ClinicDb, f: AnalyticsFilters): LabAbnormalPoint[] {
  const labs = db.labs.filter((l) => within(l.resultedAt, f.startIso, f.endIso));
  const byWeek = new Map<string, { abnormal: number; critical: number }>();
  for (const l of labs) {
    const week = weekStartKeyUtc(l.resultedAt);
    const row = byWeek.get(week) ?? { abnormal: 0, critical: 0 };
    if (l.flag !== "normal") row.abnormal += 1;
    if (l.flag === "critical") row.critical += 1;
    byWeek.set(week, row);
  }
  return [...byWeek.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, row]) => ({ week, abnormal: row.abnormal, critical: row.critical }));
}

