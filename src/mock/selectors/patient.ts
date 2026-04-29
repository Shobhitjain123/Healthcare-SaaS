import type { ClinicDb } from "../types";

export function getPatientById(db: ClinicDb, patientId: string) {
  return db.patients.find((p) => p.patientId === patientId) ?? null;
}

export function getProviderById(db: ClinicDb, providerId: string) {
  return db.providers.find((p) => p.providerId === providerId) ?? null;
}

export function getPatientBundle(db: ClinicDb, patientId: string) {
  const patient = getPatientById(db, patientId);
  if (!patient) return null;

  const provider = getProviderById(db, patient.primaryProviderId);

  const appointments = db.appointments
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => b.startAt.localeCompare(a.startAt));

  const encounters = db.encounters
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => b.startAt.localeCompare(a.startAt));

  const vitals = db.vitals
    .filter((v) => v.patientId === patientId)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));

  const labs = db.labs
    .filter((l) => l.patientId === patientId)
    .sort((a, b) => b.resultedAt.localeCompare(a.resultedAt));

  const medications = db.medications
    .filter((m) => m.patientId === patientId)
    .sort((a, b) => (a.status === b.status ? b.startAt.localeCompare(a.startAt) : a.status === "active" ? -1 : 1));

  const tasks = db.tasks
    .filter((t) => t.patientId === patientId)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  const alerts = db.alerts
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    patient,
    provider,
    appointments,
    encounters,
    vitals,
    labs,
    medications,
    tasks,
    alerts,
  };
}

