import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { Link } from "react-router";
import { clinicDb, MOCK_NOW_ISO } from "@/mock/clinicDb";
import {
  getDashboardKpis,
  getHighRiskPatients,
  getRecentAbnormalLabs,
  getScheduleForDay,
  getTasksDueSoon,
} from "@/mock/selectors/dashboard";

function pct(n: number) {
  return `${Math.round(n * 1000) / 10}%`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function Dashboard() {
  const kpis = getDashboardKpis(clinicDb, MOCK_NOW_ISO);
  const schedule = getScheduleForDay(clinicDb, MOCK_NOW_ISO, 10);
  const highRisk = getHighRiskPatients(clinicDb, 6);
  const tasksDueSoon = getTasksDueSoon(clinicDb, MOCK_NOW_ISO, 7, 8);
  const abnormalLabs = getRecentAbnormalLabs(clinicDb, 8);

  return (
    <div>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <StatCard title="Total Patients" value={String(kpis.totalPatients)} />
          <StatCard title="Appointments Today" value={String(kpis.appointmentsToday)} />
          <StatCard title="No-show Rate (30d)" value={pct(kpis.noShowRate30d)} />
          <StatCard title="Open Care Gaps" value={String(kpis.openCareGaps)} />
          <StatCard title="Critical Alerts" value={String(kpis.criticalAlerts)} />
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Today’s schedule">
            {schedule.length ? (
              <div className="space-y-3">
                {schedule.map((s) => (
                  <div key={s.appointmentId} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm text-gray-600">{formatTime(s.startAt)}</div>
                      <Link
                        to={`/patients/${s.patientId}`}
                        className="font-medium hover:underline block truncate"
                      >
                        {s.patientName}
                      </Link>
                      <div className="text-sm text-gray-600 truncate">
                        {s.type} · {s.providerName} · {s.locationName}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full border bg-white whitespace-nowrap">
                      {s.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No appointments scheduled for today.</div>
            )}
          </Card>

          <Card title="High-risk patients">
            {highRisk.length ? (
              <div className="space-y-3">
                {highRisk.map((p) => (
                  <div key={p.patientId} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link to={`/patients/${p.patientId}`} className="font-medium hover:underline block truncate">
                        {p.name}
                      </Link>
                      <div className="text-sm text-gray-600">
                        Risk: <span className="font-medium">{String(p.riskLevel).toUpperCase()}</span> · Active alerts:{" "}
                        <span className="font-medium">{p.activeAlerts}</span>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${
                        p.riskLevel === "high"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : p.riskLevel === "medium"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }`}
                    >
                      {String(p.riskLevel).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No high-risk patients found.</div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Care gaps due soon (7d)">
            {tasksDueSoon.length ? (
              <div className="space-y-3">
                {tasksDueSoon.map((t) => (
                  <div key={t.taskId} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium">{t.type}</div>
                      <Link to={`/patients/${t.patientId}`} className="text-sm text-blue-600 hover:underline">
                        {t.patientName}
                      </Link>
                      <div className="text-sm text-gray-600">Due: {new Date(t.dueAt).toLocaleDateString()}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 whitespace-nowrap">
                      {t.priority.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No upcoming care gaps.</div>
            )}
          </Card>

          <Card title="Recent abnormal labs">
            {abnormalLabs.length ? (
              <div className="space-y-3">
                {abnormalLabs.map((l) => (
                  <div key={l.labId} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium">
                        {l.test}: {l.value} {l.unit}
                      </div>
                      <Link to={`/patients/${l.patientId}`} className="text-sm text-blue-600 hover:underline">
                        {l.patientName}
                      </Link>
                      <div className="text-sm text-gray-600">
                        Resulted: {new Date(l.resultedAt).toLocaleDateString()} · Ref: {l.refRange}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${
                        l.flag === "critical"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : l.flag === "high"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-sky-50 border-sky-200 text-sky-700"
                      }`}
                    >
                      {l.flag.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No abnormal labs found.</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
