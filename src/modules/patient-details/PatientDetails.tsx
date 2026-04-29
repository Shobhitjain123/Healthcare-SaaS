import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Card } from "@/components/Card";
import { clinicDb, MOCK_NOW_ISO } from "@/mock/clinicDb";
import { getPatientBundle } from "@/mock/selectors/patient";

type TabKey = "overview" | "encounters" | "vitals" | "labs" | "meds" | "work";
type ViewMode = "grid" | "list";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function calcAge(dob: string, asOfIso: string) {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const asOf = new Date(asOfIso);
  const birth = new Date(Date.UTC(y, m - 1, d));
  let age = asOf.getUTCFullYear() - birth.getUTCFullYear();
  const md = asOf.getUTCMonth() - birth.getUTCMonth();
  if (md < 0 || (md === 0 && asOf.getUTCDate() < birth.getUTCDate())) age -= 1;
  return Math.max(0, age);
}

function Tabs({
  tab,
  setTab,
}: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
}) {
  const items: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "encounters", label: "Encounters" },
    { key: "vitals", label: "Vitals" },
    { key: "labs", label: "Labs" },
    { key: "meds", label: "Medications" },
    { key: "work", label: "Tasks & Alerts" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => setTab(it.key)}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            tab === it.key ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function ViewToggle({
  view,
  setView,
}: {
  view: ViewMode;
  setView: (v: ViewMode) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setView("grid")}
        className={`px-3 py-1 rounded-lg text-sm ${
          view === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Grid
      </button>
      <button
        onClick={() => setView("list")}
        className={`px-3 py-1 rounded-lg text-sm ${
          view === "list" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        List
      </button>
    </div>
  );
}

export default function PatientDetails() {
  const { patientId } = useParams();
  const [tab, setTab] = useState<TabKey>("overview");
  const [view, setView] = useState<ViewMode>("grid");

  const bundle = useMemo(
    () => (patientId ? getPatientBundle(clinicDb, patientId) : null),
    [patientId],
  );

  if (!patientId) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Patient</h2>
        <p className="text-sm text-gray-600">Missing patient id.</p>
        <Link to="/patients" className="text-blue-600 hover:underline">
          Back to Patients
        </Link>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Patient not found</h2>
        <p className="text-sm text-gray-600">
          No patient exists for <span className="font-mono">{patientId}</span>.
        </p>
        <Link to="/patients" className="text-blue-600 hover:underline">
          Back to Patients
        </Link>
      </div>
    );
  }

  const { patient, provider, encounters, vitals, labs, medications, tasks, alerts, appointments } =
    bundle;

  const age = calcAge(patient.dob, MOCK_NOW_ISO);
  const activeAlerts = alerts.filter((a) => a.status === "active");
  const openTasks = tasks.filter((t) => t.status === "open");
  const nextAppt = appointments
    .filter((a) => a.status === "scheduled" || a.status === "checked_in")
    .slice()
    .sort((a, b) => a.startAt.localeCompare(b.startAt))[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/patients" className="text-sm text-blue-600 hover:underline">
              ← Patients
            </Link>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm text-gray-600">{patient.patientId}</span>
          </div>

          <h2 className="text-xl font-semibold mt-2">
            {patient.firstName} {patient.lastName}
          </h2>
          <div className="text-sm text-gray-600 mt-1">
            MRN: <span className="font-medium">{patient.mrn}</span> · Age:{" "}
            <span className="font-medium">{age}</span> · Sex:{" "}
            <span className="font-medium">{patient.sexAtBirth}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`text-xs px-2 py-1 rounded-full border ${
                patient.riskLevel === "high"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : patient.riskLevel === "medium"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              {patient.riskLevel.toUpperCase()} RISK
            </span>
            <span className="text-xs px-2 py-1 rounded-full border bg-white">
              Active alerts: <span className="font-semibold">{activeAlerts.length}</span>
            </span>
            <span className="text-xs px-2 py-1 rounded-full border bg-white">
              Open tasks: <span className="font-semibold">{openTasks.length}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <div className="text-sm text-gray-600">
            Primary provider:{" "}
            <span className="font-medium">{provider?.name ?? patient.primaryProviderId}</span>
          </div>
          <div className="text-sm text-gray-600">
            Insurance:{" "}
            <span className="font-medium">{patient.insurance.payerName}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
              Schedule
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white border text-sm hover:bg-gray-50">
              Add task
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs tab={tab} setTab={setTab} />
        <ViewToggle view={view} setView={setView} />
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Next appointment">
            {nextAppt ? (
              <div className="space-y-2 text-sm">
                <div className="font-medium">{formatDateTime(nextAppt.startAt)}</div>
                <div className="text-gray-600">
                  Type: <span className="font-medium">{nextAppt.type}</span>
                </div>
                <div className="text-gray-600">
                  Status: <span className="font-medium">{nextAppt.status}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No upcoming appointments.</div>
            )}
          </Card>

          <Card title="Recent vitals">
            {vitals[0] ? (
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">{formatDateTime(vitals[0].recordedAt)}</div>
                <div className="flex justify-between">
                  <span className="text-gray-500">BP</span>
                  <span className="font-medium">
                    {vitals[0].systolicBP}/{vitals[0].diastolicBP}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">HR</span>
                  <span className="font-medium">{vitals[0].heartRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SpO₂</span>
                  <span className="font-medium">{vitals[0].spo2}%</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No vitals recorded.</div>
            )}
          </Card>

          <Card title="Care gaps">
            {openTasks.length ? (
              <div className="space-y-2">
                {openTasks.slice(0, 4).map((t) => (
                  <div key={t.taskId} className="text-sm">
                    <div className="font-medium">{t.type}</div>
                    <div className="text-gray-600">
                      Due: {formatDate(t.dueAt)} · Priority: {t.priority}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No open care gaps.</div>
            )}
          </Card>
        </div>
      )}

      {tab === "encounters" && (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {encounters.map((e) => (
                <div key={e.encounterId} className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="text-sm text-gray-600">{formatDateTime(e.startAt)}</div>
                  <div className="font-semibold mt-1">{e.reason}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {e.diagnoses.map((dx) => (
                      <span key={dx} className="text-xs px-2 py-1 rounded-full border bg-gray-50">
                        {dx}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-3">{e.notesSummary}</div>
                </div>
              ))}
              {!encounters.length && (
                <div className="text-sm text-gray-600">No encounters found.</div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="hidden md:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-sm">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Diagnoses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {encounters.map((e) => (
                      <tr key={e.encounterId} className="border-t">
                        <td className="p-3 text-gray-600">{formatDateTime(e.startAt)}</td>
                        <td className="p-3 font-medium">{e.reason}</td>
                        <td className="p-3 text-gray-600">{e.diagnoses.join(", ")}</td>
                      </tr>
                    ))}
                    {!encounters.length && (
                      <tr className="border-t">
                        <td className="p-3 text-gray-600" colSpan={3}>
                          No encounters found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y">
                {encounters.map((e) => (
                  <div key={e.encounterId} className="p-4">
                    <div className="text-sm text-gray-600">{formatDateTime(e.startAt)}</div>
                    <div className="font-semibold mt-1">{e.reason}</div>
                    <div className="text-sm text-gray-600 mt-1">{e.diagnoses.join(", ")}</div>
                  </div>
                ))}
                {!encounters.length && <div className="p-4 text-sm text-gray-600">No encounters found.</div>}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "vitals" && (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {vitals.map((v) => (
                <div key={v.vitalId} className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="text-sm text-gray-600">{formatDateTime(v.recordedAt)}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-500">BP</span>
                      <span className="font-medium">
                        {v.systolicBP}/{v.diastolicBP}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">HR</span>
                      <span className="font-medium">{v.heartRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">SpO₂</span>
                      <span className="font-medium">{v.spo2}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Temp</span>
                      <span className="font-medium">{v.tempC}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight</span>
                      <span className="font-medium">{v.weightKg} kg</span>
                    </div>
                  </div>
                </div>
              ))}
              {!vitals.length && <div className="text-sm text-gray-600">No vitals found.</div>}
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="hidden md:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-sm">
                    <tr>
                      <th className="p-3">Recorded</th>
                      <th className="p-3">BP</th>
                      <th className="p-3">HR</th>
                      <th className="p-3">SpO₂</th>
                      <th className="p-3">Temp</th>
                      <th className="p-3">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitals.map((v) => (
                      <tr key={v.vitalId} className="border-t">
                        <td className="p-3 text-gray-600">{formatDateTime(v.recordedAt)}</td>
                        <td className="p-3 font-medium">
                          {v.systolicBP}/{v.diastolicBP}
                        </td>
                        <td className="p-3 text-gray-600">{v.heartRate}</td>
                        <td className="p-3 text-gray-600">{v.spo2}%</td>
                        <td className="p-3 text-gray-600">{v.tempC}°C</td>
                        <td className="p-3 text-gray-600">{v.weightKg} kg</td>
                      </tr>
                    ))}
                    {!vitals.length && (
                      <tr className="border-t">
                        <td className="p-3 text-gray-600" colSpan={6}>
                          No vitals found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y">
                {vitals.map((v) => (
                  <div key={v.vitalId} className="p-4">
                    <div className="text-sm text-gray-600">{formatDateTime(v.recordedAt)}</div>
                    <div className="mt-1 text-sm">
                      <span className="text-gray-500">BP:</span>{" "}
                      <span className="font-medium">
                        {v.systolicBP}/{v.diastolicBP}
                      </span>{" "}
                      · <span className="text-gray-500">HR:</span> {v.heartRate}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      SpO₂ {v.spo2}% · Temp {v.tempC}°C · Weight {v.weightKg} kg
                    </div>
                  </div>
                ))}
                {!vitals.length && <div className="p-4 text-sm text-gray-600">No vitals found.</div>}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "labs" && (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {labs.map((l) => (
                <div key={l.labId} className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{l.test}</div>
                      <div className="text-sm text-gray-600">
                        Resulted: {formatDateTime(l.resultedAt)}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        l.flag === "critical"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : l.flag === "high"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : l.flag === "low"
                              ? "bg-sky-50 border-sky-200 text-sky-700"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }`}
                    >
                      {l.flag.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Value</span>
                      <span className="font-medium">
                        {l.value} {l.unit}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500">Ref</span>
                      <span className="font-medium">{l.refRange}</span>
                    </div>
                  </div>
                </div>
              ))}
              {!labs.length && <div className="text-sm text-gray-600">No labs found.</div>}
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="hidden md:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-sm">
                    <tr>
                      <th className="p-3">Test</th>
                      <th className="p-3">Value</th>
                      <th className="p-3">Flag</th>
                      <th className="p-3">Resulted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map((l) => (
                      <tr key={l.labId} className="border-t">
                        <td className="p-3 font-medium">{l.test}</td>
                        <td className="p-3 text-gray-600">
                          {l.value} {l.unit} <span className="text-gray-400">({l.refRange})</span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-1 rounded-full border bg-white">
                            {l.flag.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">{formatDateTime(l.resultedAt)}</td>
                      </tr>
                    ))}
                    {!labs.length && (
                      <tr className="border-t">
                        <td className="p-3 text-gray-600" colSpan={4}>
                          No labs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y">
                {labs.map((l) => (
                  <div key={l.labId} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{l.test}</div>
                        <div className="text-sm text-gray-600">
                          {l.value} {l.unit} <span className="text-gray-400">({l.refRange})</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full border bg-white">
                        {l.flag.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Resulted: {formatDateTime(l.resultedAt)}
                    </div>
                  </div>
                ))}
                {!labs.length && <div className="p-4 text-sm text-gray-600">No labs found.</div>}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "meds" && (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {medications.map((m) => (
                <div key={m.medicationId} className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-sm text-gray-600">
                        {m.dose} · {m.frequency}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full border bg-white">
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Started: {formatDate(m.startAt)}
                    {m.endAt ? ` · Ended: ${formatDate(m.endAt)}` : null}
                  </div>
                </div>
              ))}
              {!medications.length && <div className="text-sm text-gray-600">No medications found.</div>}
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="hidden md:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-sm">
                    <tr>
                      <th className="p-3">Medication</th>
                      <th className="p-3">Dose</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((m) => (
                      <tr key={m.medicationId} className="border-t">
                        <td className="p-3 font-medium">{m.name}</td>
                        <td className="p-3 text-gray-600">{m.dose}</td>
                        <td className="p-3 text-gray-600">{m.frequency}</td>
                        <td className="p-3 text-gray-600">{m.status}</td>
                      </tr>
                    ))}
                    {!medications.length && (
                      <tr className="border-t">
                        <td className="p-3 text-gray-600" colSpan={4}>
                          No medications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y">
                {medications.map((m) => (
                  <div key={m.medicationId} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-sm text-gray-600">
                          {m.dose} · {m.frequency}
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full border bg-white">
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Started: {formatDate(m.startAt)}</div>
                  </div>
                ))}
                {!medications.length && (
                  <div className="p-4 text-sm text-gray-600">No medications found.</div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "work" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Open tasks">
            {openTasks.length ? (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
                {openTasks.map((t) => (
                  <div key={t.taskId} className="p-3 rounded-lg border bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-medium text-sm">{t.type}</div>
                      <span className="text-xs px-2 py-1 rounded-full border bg-gray-50">
                        {t.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Due: {formatDate(t.dueAt)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No open tasks.</div>
            )}
          </Card>

          <Card title="Alerts">
            {alerts.length ? (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
                {alerts.map((a) => (
                  <div key={a.alertId} className="p-3 rounded-lg border bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-sm">{a.message}</div>
                        <div className="text-sm text-gray-600 mt-1">{formatDateTime(a.createdAt)}</div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          a.severity === "high"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : a.severity === "medium"
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        }`}
                      >
                        {a.status === "active" ? a.severity.toUpperCase() : "RESOLVED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No alerts.</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

