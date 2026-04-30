import { useState, Suspense } from "react";
import { GridView } from "@/components/GridView";
import { ListView } from "@/components/ListView";
import { AddPatientModal } from "@/components/AddPatientModal";
import { usePatientStore } from "@/store/usePatientStore";
import { GridSkeleton, TableSkeleton } from "@/components/LoadingSkeleton";

export default function Patients() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const patients = usePatientStore((state) => state.patients);

  return (
    <div className="space-y-4">
      {/* View Toggle and Add Patient */}
      <div className="flex justify-between items-center">
        <AddPatientModal />
        <div className="flex gap-2">
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
      </div>

      {/* Content */}
      <Suspense fallback={view === "grid" ? <GridSkeleton /> : <TableSkeleton />}>
        {view === "grid" ? (
          <GridView patients={patients} />
        ) : (
          <ListView patients={patients} />
        )}
      </Suspense>
    </div>
  );
}
