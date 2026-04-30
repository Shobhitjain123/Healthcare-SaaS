import { create } from "zustand";
import type { Patient } from "@/mock/types";
import { clinicDb } from "@/mock/clinicDb";

type PatientStore = {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: clinicDb.patients,
  addPatient: (patient) => {
    set((state) => {
      const newPatients = [...state.patients, patient];
      return { patients: newPatients };
    });
  },
}));
