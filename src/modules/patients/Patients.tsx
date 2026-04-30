import { useState } from "react";
import { GridView } from "@/components/GridView";
import { ListView } from "@/components/ListView";
import { AddPatientModal } from "@/components/AddPatientModal";
import { usePatientStore } from "@/store/usePatientStore";

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
      {view === "grid" ? (
        <GridView patients={patients} />
      ) : (
        <ListView patients={patients} />
      )}
    </div>
  );
}
