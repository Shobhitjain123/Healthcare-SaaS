import { useState } from "react";
import { GridView } from "@/components/GridView";
import { ListView } from "@/components/ListView";
import { clinicDb } from "@/mock/clinicDb";

export default function Patients() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const patients = clinicDb.patients;

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setView("grid")}
          className={`px-3 py-1 rounded-lg ${
            view === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Grid
        </button>

        <button
          onClick={() => setView("list")}
          className={`px-3 py-1 rounded-lg ${
            view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          List
        </button>
      </div>

      {/* Content */}
      {view === "grid" ? (
        <GridView patients={patients} />
      ) : (
        <ListView patients={patients} />
      )}
    </div>
  );
}
