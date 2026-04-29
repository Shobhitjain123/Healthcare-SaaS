import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { clinicDb, MOCK_NOW_ISO } from "@/mock/clinicDb";
import {
  getAnalyticsKpis,
  getAppointmentOutcomesByWeek,
  getAppointmentsOverTime,
  getDemographics,
  getTopDiagnoses,
  type AnalyticsFilters,
} from "@/mock/selectors/analytics";
import { addDaysUtc } from "@/mock/selectors/date";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Analytics() {
  const now = useMemo(() => new Date(MOCK_NOW_ISO), []);
  const defaultEnd = MOCK_NOW_ISO;

  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [providerId, setProviderId] = useState<string>("");
  const [locationId, setLocationId] = useState<string>("");

  const { startIso, endIso } = useMemo(() => {
    const daysBack = range === "7d" ? -7 : range === "90d" ? -90 : -30;
    return {
      startIso: addDaysUtc(now, daysBack).toISOString(),
      endIso: defaultEnd,
    };
  }, [range, now, defaultEnd]);

  const filters = useMemo<AnalyticsFilters>(
    () => ({
      startIso,
      endIso,
      providerId: providerId || undefined,
      locationId: locationId || undefined,
    }),
    [startIso, endIso, providerId, locationId],
  );

  const kpis = useMemo(() => getAnalyticsKpis(clinicDb, filters), [filters]);
  const visitsSeries = useMemo(() => getAppointmentsOverTime(clinicDb, filters), [filters]);
  const outcomesSeries = useMemo(
    () => getAppointmentOutcomesByWeek(clinicDb, filters),
    [filters],
  );
  const topDx = useMemo(() => getTopDiagnoses(clinicDb, filters, 8), [filters]);
  const demographics = useMemo(() => getDemographics(clinicDb, MOCK_NOW_ISO), []);

  const locations = clinicDb.clinic.locations;
  const providers = clinicDb.providers.filter((p) => (locationId ? p.locationId === locationId : true));

  const sexColors: Record<string, string> = {
    female: "#2563eb",
    male: "#16a34a",
    unknown: "#6b7280",
    intersex: "#a855f7",
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                range === r ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
          <div className="text-sm text-gray-600 flex items-center ml-1">
            {new Date(startIso).toLocaleDateString()} – {new Date(endIso).toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={locationId}
            onChange={(e) => {
              setLocationId(e.target.value);
              setProviderId("");
            }}
            className="px-3 py-2 rounded-lg border bg-white text-sm"
          >
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l.locationId} value={l.locationId}>
                {l.name}
              </option>
            ))}
          </select>

          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white text-sm"
          >
            <option value="">All providers</option>
            {providers.map((p) => (
              <option key={p.providerId} value={p.providerId}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Visits" value={String(kpis.totalVisits)} />
        <StatCard title="Completion Rate" value={`${Math.round(kpis.completionRate * 1000) / 10}%`} />
        <StatCard title="No-show Rate" value={`${Math.round(kpis.noShowRate * 1000) / 10}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Appointments over time">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitsSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Appointments" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Outcomes by week">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomesSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#16a34a" />
                <Bar dataKey="scheduled" stackId="a" fill="#2563eb" />
                <Bar dataKey="no_show" stackId="a" fill="#f59e0b" />
                <Bar dataKey="cancelled" stackId="a" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Top diagnoses">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDx} layout="vertical" margin={{ left: 32 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="diagnosis" tick={{ fontSize: 12 }} width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Demographics (age)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographics.ageSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Demographics (sex)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={demographics.sexSeries} dataKey="count" nameKey="sex" outerRadius={90}>
                  {demographics.sexSeries.map((s) => (
                    <Cell key={s.sex} fill={sexColors[s.sex] ?? "#6b7280"} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
