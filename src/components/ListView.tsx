import { memo } from "react";
import { Link } from "react-router";
import type { Patient } from "@/mock/types";

function ListViewComponent({ patients }: { patients: Patient[] }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">MRN</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Insurance</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p.patientId} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <Link to={`/patients/${p.patientId}`} className="hover:underline">
                    {p.firstName} {p.lastName}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{p.mrn}</td>
                <td className="p-3">
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
                </td>
                <td className="p-3 text-gray-600">{p.insurance.payerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked rows */}
      <div className="md:hidden divide-y">
        {patients.map((p) => (
          <Link
            key={p.patientId}
            to={`/patients/${p.patientId}`}
            className="block p-4 hover:bg-gray-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">
                  {p.firstName} {p.lastName}
                </div>
                <div className="text-sm text-gray-500">{p.mrn}</div>
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
            <div className="mt-2 text-sm text-gray-600">
              Insurance: <span className="font-medium">{p.insurance.payerName}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const ListView = memo(ListViewComponent);
