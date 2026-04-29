import type { ClinicDb, AppointmentStatus, Task, Lab, Alert } from "../types";
import { toDayKeyUtc, addDaysUtc } from "./date";

export type DashboardKpis = {
  totalPatients: number;
  appointmentsToday: number;
  noShowRate30d: number; // 0..1
  openCareGaps: number;
  criticalAlerts: number;
};

function isNoShow(status: AppointmentStatus) {
  return status === "no_show";
}

export function getDashboardKpis(db: ClinicDb, nowIso: string): DashboardKpis {
  const now = new Date(nowIso);
  const todayKey = toDayKeyUtc(now);
  const start30 = addDaysUtc(now, -30).toISOString();

  const totalPatients = db.patients.length;

  const appointmentsToday = db.appointments.filter(
    (a) => toDayKeyUtc(a.startAt) === todayKey && a.status !== "cancelled",
  ).length;

  const appts30 = db.appointments.filter((a) => a.startAt >= start30);
  const denom = appts30.filter((a) => a.status !== "cancelled").length || 1;
  const noShows = appts30.filter((a) => isNoShow(a.status)).length;
  const noShowRate30d = noShows / denom;

  const openCareGaps = db.tasks.filter((t) => t.status === "open").length;

  const criticalAlerts = db.alerts.filter(
    (al) => al.status === "active" && al.severity === "high",
  ).length;

  return {
    totalPatients,
    appointmentsToday,
    noShowRate30d,
    openCareGaps,
    criticalAlerts,
  };
}

export type ScheduleItem = {
  appointmentId: string;
  startAt: string;
  patientName: string;
  providerName: string;
  locationName: string;
  status: AppointmentStatus;
  type: string;
  patientId: string;
};

export function getScheduleForDay(db: ClinicDb, dayIso: string, limit = 10): ScheduleItem[] {
  const dayKey = toDayKeyUtc(dayIso);
  const providersById = new Map(db.providers.map((p) => [p.providerId, p]));
  const patientsById = new Map(db.patients.map((p) => [p.patientId, p]));
  const locationsById = new Map(db.clinic.locations.map((l) => [l.locationId, l]));

  return db.appointments
    .filter((a) => toDayKeyUtc(a.startAt) === dayKey)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .slice(0, limit)
    .map((a) => {
      const p = patientsById.get(a.patientId);
      const prov = providersById.get(a.providerId);
      const loc = locationsById.get(a.locationId);
      return {
        appointmentId: a.appointmentId,
        startAt: a.startAt,
        patientName: p ? `${p.firstName} ${p.lastName}` : a.patientId,
        providerName: prov?.name ?? a.providerId,
        locationName: loc?.name ?? a.locationId,
        status: a.status,
        type: a.type,
        patientId: a.patientId,
      };
    });
}

export type HighRiskPatient = {
  patientId: string;
  name: string;
  riskLevel: string;
  activeAlerts: number;
  lastEncounterAt?: string;
};

export function getHighRiskPatients(db: ClinicDb, limit = 6): HighRiskPatient[] {
  const alertsByPatient = new Map<string, Alert[]>();
  for (const a of db.alerts) {
    if (a.status !== "active") continue;
    const arr = alertsByPatient.get(a.patientId) ?? [];
    arr.push(a);
    alertsByPatient.set(a.patientId, arr);
  }

  const lastEncounterByPatient = new Map<string, string>();
  for (const e of db.encounters) {
    const prev = lastEncounterByPatient.get(e.patientId);
    if (!prev || e.startAt > prev) lastEncounterByPatient.set(e.patientId, e.startAt);
  }

  return db.patients
    .map((p) => {
      const activeAlerts = alertsByPatient.get(p.patientId)?.length ?? 0;
      return {
        patientId: p.patientId,
        name: `${p.firstName} ${p.lastName}`,
        riskLevel: p.riskLevel,
        activeAlerts,
        lastEncounterAt: lastEncounterByPatient.get(p.patientId),
      };
    })
    .sort((a, b) => {
      const r = (x: string) => (x === "high" ? 2 : x === "medium" ? 1 : 0);
      const byRisk = r(b.riskLevel) - r(a.riskLevel);
      if (byRisk !== 0) return byRisk;
      return (b.activeAlerts ?? 0) - (a.activeAlerts ?? 0);
    })
    .slice(0, limit);
}

export type TaskDueSoon = Task & { patientName: string };

export function getTasksDueSoon(db: ClinicDb, nowIso: string, daysAhead = 7, limit = 8): TaskDueSoon[] {
  const now = new Date(nowIso);
  const endIso = addDaysUtc(now, daysAhead).toISOString();
  const patientsById = new Map(db.patients.map((p) => [p.patientId, p]));

  return db.tasks
    .filter((t) => t.status === "open" && t.dueAt <= endIso)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(0, limit)
    .map((t) => {
      const p = patientsById.get(t.patientId);
      return { ...t, patientName: p ? `${p.firstName} ${p.lastName}` : t.patientId };
    });
}

export type AbnormalLabItem = Lab & { patientName: string };

export function getRecentAbnormalLabs(db: ClinicDb, limit = 8): AbnormalLabItem[] {
  const patientsById = new Map(db.patients.map((p) => [p.patientId, p]));
  return db.labs
    .filter((l) => l.flag !== "normal")
    .sort((a, b) => b.resultedAt.localeCompare(a.resultedAt))
    .slice(0, limit)
    .map((l) => {
      const p = patientsById.get(l.patientId);
      return { ...l, patientName: p ? `${p.firstName} ${p.lastName}` : l.patientId };
    });
}

