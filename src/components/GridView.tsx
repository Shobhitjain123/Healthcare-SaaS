import { Link } from "react-router";
import type { Patient } from "@/mock/types";

export function GridView({ patients }: { patients: Patient[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {patients.map((p) => (
        <Link
          key={p.patientId}
          to={`/patients/${p.patientId}`}
          className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">
                {p.firstName} {p.lastName}
              </h3>
              <p className="text-sm text-gray-500">MRN: {p.mrn}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full border ${
                p.riskLevel === "high"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : p.riskLevel === "medium"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              {p.riskLevel.toUpperCase()}
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Primary provider</span>
              <span className="font-medium">{p.primaryProviderId}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Insurance</span>
              <span className="font-medium">{p.insurance.payerName}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
