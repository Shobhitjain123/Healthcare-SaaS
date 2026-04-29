export type ID = string;

export type RiskLevel = "low" | "medium" | "high";
export type PatientStatus = "active" | "inactive";

export type AppointmentStatus =
  | "scheduled"
  | "checked_in"
  | "completed"
  | "no_show"
  | "cancelled";

export type EncounterDiagnosis =
  | "Hypertension"
  | "Type 2 Diabetes"
  | "Hyperlipidemia"
  | "Asthma"
  | "Anxiety"
  | "Obesity"
  | "Hypothyroidism"
  | "GERD";

export type LabFlag = "normal" | "high" | "low" | "critical";
export type AlertSeverity = "low" | "medium" | "high";
export type AlertStatus = "active" | "resolved";

export type TaskStatus = "open" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type SexAtBirth = "female" | "male" | "intersex" | "unknown";

export type ClinicLocation = {
  locationId: ID;
  name: string;
  city: string;
};

export type Clinic = {
  clinicId: ID;
  name: string;
  locations: ClinicLocation[];
};

export type Provider = {
  providerId: ID;
  name: string;
  specialty: "Family Medicine" | "Internal Medicine" | "Cardiology";
  locationId: ID;
};

export type PatientInsurance = {
  payerName: string;
  planName: string;
  memberId: string;
};

export type Patient = {
  patientId: ID;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  sexAtBirth: SexAtBirth;
  phone: string;
  email: string;
  address: { line1: string; city: string; state: string; zip: string };
  insurance: PatientInsurance;
  primaryProviderId: ID;
  riskLevel: RiskLevel;
  status: PatientStatus;
};

export type Appointment = {
  appointmentId: ID;
  patientId: ID;
  providerId: ID;
  locationId: ID;
  startAt: string; // ISO
  type: "Annual" | "Follow-up" | "Urgent" | "Lab Review" | "New Patient";
  status: AppointmentStatus;
};

export type Encounter = {
  encounterId: ID;
  patientId: ID;
  providerId: ID;
  startAt: string; // ISO
  endAt: string; // ISO
  reason: string;
  diagnoses: EncounterDiagnosis[];
  notesSummary: string;
};

export type Vital = {
  vitalId: ID;
  patientId: ID;
  recordedAt: string; // ISO
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  spo2: number;
  weightKg: number;
  tempC: number;
};

export type Lab = {
  labId: ID;
  patientId: ID;
  orderedAt: string; // ISO
  resultedAt: string; // ISO
  test: "HbA1c" | "LDL" | "TSH" | "Creatinine" | "Potassium" | "Hemoglobin";
  value: number;
  unit: string;
  refRange: string;
  flag: LabFlag;
};

export type Medication = {
  medicationId: ID;
  patientId: ID;
  name:
    | "Metformin"
    | "Atorvastatin"
    | "Lisinopril"
    | "Albuterol"
    | "Levothyroxine"
    | "Omeprazole";
  dose: string;
  frequency: string;
  startAt: string; // ISO
  endAt?: string; // ISO
  status: "active" | "stopped";
};

export type Task = {
  taskId: ID;
  patientId: ID;
  type:
    | "Schedule follow-up"
    | "Repeat labs"
    | "Annual wellness visit"
    | "Medication refill"
    | "Care plan review";
  dueAt: string; // ISO
  status: TaskStatus;
  priority: TaskPriority;
};

export type Alert = {
  alertId: ID;
  patientId: ID;
  createdAt: string; // ISO
  severity: AlertSeverity;
  category: "lab" | "vitals" | "task";
  message: string;
  status: AlertStatus;
};

export type ClinicDb = {
  clinic: Clinic;
  providers: Provider[];
  patients: Patient[];
  appointments: Appointment[];
  encounters: Encounter[];
  vitals: Vital[];
  labs: Lab[];
  medications: Medication[];
  tasks: Task[];
  alerts: Alert[];
};

