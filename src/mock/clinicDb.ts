import type {
  Alert,
  Appointment,
  ClinicDb,
  Encounter,
  Lab,
  Medication,
  Patient,
  Provider,
  Task,
  Vital,
} from "./types";

// Deterministic mock clock so charts don’t “drift” between runs.
export const MOCK_NOW_ISO = "2026-04-29T10:00:00.000Z";

const days = (n: number) => n * 24 * 60 * 60 * 1000;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function iso(d: Date) {
  return d.toISOString();
}

function addHours(d: Date, hrs: number) {
  return new Date(d.getTime() + hrs * 60 * 60 * 1000);
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function id(prefix: string, n: number) {
  return `${prefix}_${String(n).padStart(3, "0")}`;
}

function buildProviders(): Provider[] {
  return [
    {
      providerId: "prov_001",
      name: "Dr. Asha Mehta",
      specialty: "Family Medicine",
      locationId: "loc_001",
    },
    {
      providerId: "prov_002",
      name: "Dr. Rohan Kapoor",
      specialty: "Internal Medicine",
      locationId: "loc_001",
    },
    {
      providerId: "prov_003",
      name: "Dr. Sara Iqbal",
      specialty: "Family Medicine",
      locationId: "loc_002",
    },
    {
      providerId: "prov_004",
      name: "Dr. Vikram Nair",
      specialty: "Internal Medicine",
      locationId: "loc_002",
    },
    {
      providerId: "prov_005",
      name: "Dr. Neel Banerjee",
      specialty: "Cardiology",
      locationId: "loc_001",
    },
    {
      providerId: "prov_006",
      name: "Dr. Isha Sen",
      specialty: "Cardiology",
      locationId: "loc_002",
    },
  ];
}

function buildPatients(rng: () => number, providers: Provider[]): Patient[] {
  const firstNames = [
    "Aarav",
    "Ananya",
    "Vihaan",
    "Ira",
    "Kabir",
    "Meera",
    "Arjun",
    "Diya",
    "Reyansh",
    "Saanvi",
    "Aditya",
    "Nisha",
    "Karan",
    "Pooja",
    "Sameer",
    "Riya",
    "Dev",
    "Tara",
    "Neha",
    "Rahul",
    "Ishaan",
    "Maya",
    "Aditi",
    "Siddharth",
    "Priya",
  ];
  const lastNames = [
    "Sharma",
    "Patel",
    "Gupta",
    "Singh",
    "Khan",
    "Das",
    "Iyer",
    "Menon",
    "Joshi",
    "Chopra",
  ];
  const cities = ["Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad"];
  const states = ["KA", "MH", "DL", "MH", "TS"];
  const payers = [
    { payerName: "BlueCross", planName: "Silver Plus" },
    { payerName: "Aetna", planName: "HMO Choice" },
    { payerName: "United", planName: "Preferred" },
    { payerName: "Cigna", planName: "Open Access" },
  ];

  const patients: Patient[] = [];
  for (let i = 1; i <= 25; i++) {
    const fn = firstNames[i - 1] ?? `Patient${i}`;
    const ln = pick(rng, lastNames);
    const cityIdx = Math.floor(rng() * cities.length);
    const payer = pick(rng, payers);
    const primaryProvider = pick(rng, providers);

    const dobYear = clamp(1945 + Math.floor(rng() * 55), 1940, 2006);
    const dobMonth = 1 + Math.floor(rng() * 12);
    const dobDay = 1 + Math.floor(rng() * 28);

    patients.push({
      patientId: id("pt", i),
      mrn: `MRN-${String(100000 + i)}`,
      firstName: fn,
      lastName: ln,
      dob: `${dobYear}-${String(dobMonth).padStart(2, "0")}-${String(dobDay).padStart(2, "0")}`,
      sexAtBirth: pick(rng, ["female", "male", "unknown"]),
      phone: `+1 (555) 01${String(i).padStart(2, "0")}-0${String(10 + i)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      address: {
        line1: `${100 + i} ${pick(rng, ["Oak", "Maple", "Pine", "Lake"])} St`,
        city: cities[cityIdx]!,
        state: states[cityIdx]!,
        zip: `94${String(100 + i)}`,
      },
      insurance: {
        payerName: payer.payerName,
        planName: payer.planName,
        memberId: `M-${String(700000 + i)}`,
      },
      primaryProviderId: primaryProvider.providerId,
      riskLevel: pick(rng, ["low", "medium", "medium", "high"]),
      status: "active",
    });
  }
  return patients;
}

function buildAppointments(
  rng: () => number,
  now: Date,
  patients: Patient[],
  providers: Provider[],
): Appointment[] {
  const types: Appointment["type"][] = [
    "Annual",
    "Follow-up",
    "Urgent",
    "Lab Review",
    "New Patient",
  ];

  const appts: Appointment[] = [];
  const start = new Date(now.getTime() - days(90));
  let idCounter = 1;

  for (
    let dayCursor = startOfDay(start);
    dayCursor <= now;
    dayCursor = new Date(dayCursor.getTime() + days(1))
  ) {
    const weekday = dayCursor.getUTCDay(); // 0-6
    const base = weekday === 0 || weekday === 6 ? 1 : 5; // weekends quieter
    const count = clamp(Math.floor(rng() * (base + 3)), 0, 10);

    for (let j = 0; j < count; j++) {
      const hour = 9 + Math.floor(rng() * 8); // 9..16
      const minute = pick(rng, [0, 15, 30, 45]);
      const startAt = new Date(dayCursor);
      startAt.setUTCHours(hour, minute, 0, 0);

      const patient = pick(rng, patients);
      const provider = pick(rng, providers);

      // Outcome distribution with slight no-show/cancel rates.
      const r = rng();
      const status: Appointment["status"] =
        r < 0.08
          ? "cancelled"
          : r < 0.16
            ? "no_show"
            : startAt.getTime() < now.getTime() - days(1)
              ? "completed"
              : "scheduled";

      appts.push({
        appointmentId: id("appt", idCounter++),
        patientId: patient.patientId,
        providerId: provider.providerId,
        locationId: provider.locationId,
        startAt: iso(startAt),
        type: pick(rng, types),
        status,
      });
    }
  }

  return appts;
}

function buildEncountersFromAppointments(
  rng: () => number,
  appointments: Appointment[],
): Encounter[] {
  const reasons = [
    "Annual physical",
    "Blood pressure follow-up",
    "Diabetes check-in",
    "Medication review",
    "Shortness of breath",
    "Lab results discussion",
  ];
  const diagnoses = [
    "Hypertension",
    "Type 2 Diabetes",
    "Hyperlipidemia",
    "Asthma",
    "Anxiety",
    "Obesity",
    "Hypothyroidism",
    "GERD",
  ] as const;

  const completed = appointments.filter((a) => a.status === "completed");
  const encounters: Encounter[] = [];
  let idCounter = 1;

  for (const appt of completed) {
    // Not every completed appointment becomes an encounter in the mock model.
    if (rng() < 0.35) continue;

    const start = new Date(appt.startAt);
    const end = addHours(start, 0.5 + rng()); // ~30-90 minutes
    const dxCount = rng() < 0.6 ? 1 : 2;
    const dx = new Set<string>();
    while (dx.size < dxCount) dx.add(pick(rng, [...diagnoses]));

    encounters.push({
      encounterId: id("enc", idCounter++),
      patientId: appt.patientId,
      providerId: appt.providerId,
      startAt: iso(start),
      endAt: iso(end),
      reason: pick(rng, reasons),
      diagnoses: [...dx] as Encounter["diagnoses"],
      notesSummary: "Patient evaluated. Plan updated and follow-up advised.",
    });
  }
  return encounters;
}

function buildVitals(
  rng: () => number,
  encounters: Encounter[],
  patients: Patient[],
): Vital[] {
  const vitals: Vital[] = [];
  let idCounter = 1;

  const lastWeightByPatient = new Map<string, number>();
  for (const p of patients) lastWeightByPatient.set(p.patientId, 60 + rng() * 30);

  for (const enc of encounters) {
    const base = new Date(enc.startAt);
    const samples = rng() < 0.7 ? 1 : 2;
    for (let i = 0; i < samples; i++) {
      const recordedAt = addHours(base, -0.25 + rng() * 0.5);
      const wPrev = lastWeightByPatient.get(enc.patientId) ?? 75;
      const weight = clamp(wPrev + (rng() - 0.5) * 0.8, 50, 120);
      lastWeightByPatient.set(enc.patientId, weight);

      const riskBoost = enc.diagnoses.includes("Hypertension") ? 10 : 0;
      const sys = clamp(112 + Math.floor(rng() * 35) + riskBoost, 90, 190);
      const dia = clamp(70 + Math.floor(rng() * 22) + Math.floor(riskBoost / 3), 55, 120);

      vitals.push({
        vitalId: id("vit", idCounter++),
        patientId: enc.patientId,
        recordedAt: iso(recordedAt),
        heartRate: clamp(62 + Math.floor(rng() * 30), 50, 130),
        systolicBP: sys,
        diastolicBP: dia,
        spo2: clamp(94 + Math.floor(rng() * 6), 85, 100),
        weightKg: Math.round(weight * 10) / 10,
        tempC: Math.round((36.4 + rng() * 1.2) * 10) / 10,
      });
    }
  }

  // Backfill a few vitals for patients without encounters (so analytics still works).
  const hasAny = new Set(vitals.map((v) => v.patientId));
  const now = new Date(MOCK_NOW_ISO);
  for (const p of patients) {
    if (hasAny.has(p.patientId)) continue;
    const recordedAt = new Date(now.getTime() - days(3 + Math.floor(rng() * 30)));
    vitals.push({
      vitalId: id("vit", idCounter++),
      patientId: p.patientId,
      recordedAt: iso(recordedAt),
      heartRate: clamp(62 + Math.floor(rng() * 30), 50, 130),
      systolicBP: clamp(112 + Math.floor(rng() * 35), 90, 190),
      diastolicBP: clamp(70 + Math.floor(rng() * 22), 55, 120),
      spo2: clamp(94 + Math.floor(rng() * 6), 85, 100),
      weightKg: Math.round((60 + rng() * 35) * 10) / 10,
      tempC: Math.round((36.4 + rng() * 1.2) * 10) / 10,
    });
  }

  return vitals;
}

function buildLabs(rng: () => number, encounters: Encounter[]): Lab[] {
  const labs: Lab[] = [];
  let idCounter = 1;

  for (const enc of encounters) {
    if (rng() < 0.55) continue;
    const orderedAt = addHours(new Date(enc.startAt), -24 - rng() * 48);
    const resultedAt = addHours(orderedAt, 12 + rng() * 36);

    const test = pick(rng, [
      "HbA1c",
      "LDL",
      "TSH",
      "Creatinine",
      "Potassium",
      "Hemoglobin",
    ] as const);

    let value = 0;
    let unit = "";
    let refRange = "";
    let flag: Lab["flag"] = "normal";

    if (test === "HbA1c") {
      value = Math.round((5.2 + rng() * 4.2) * 10) / 10;
      unit = "%";
      refRange = "4.0–5.6";
      flag = value >= 9 ? "critical" : value >= 6.5 ? "high" : "normal";
    } else if (test === "LDL") {
      value = Math.round(70 + rng() * 120);
      unit = "mg/dL";
      refRange = "<100";
      flag = value >= 190 ? "critical" : value >= 130 ? "high" : "normal";
    } else if (test === "TSH") {
      value = Math.round((0.2 + rng() * 8) * 10) / 10;
      unit = "mIU/L";
      refRange = "0.4–4.0";
      flag = value >= 10 ? "critical" : value >= 4.1 ? "high" : value < 0.4 ? "low" : "normal";
    } else if (test === "Creatinine") {
      value = Math.round((0.6 + rng() * 1.8) * 10) / 10;
      unit = "mg/dL";
      refRange = "0.6–1.3";
      flag = value >= 2.5 ? "critical" : value >= 1.4 ? "high" : "normal";
    } else if (test === "Potassium") {
      value = Math.round((3.2 + rng() * 3.2) * 10) / 10;
      unit = "mmol/L";
      refRange = "3.5–5.0";
      flag = value >= 6.2 ? "critical" : value > 5.0 ? "high" : value < 3.5 ? "low" : "normal";
    } else if (test === "Hemoglobin") {
      value = Math.round((9 + rng() * 7) * 10) / 10;
      unit = "g/dL";
      refRange = "12–17";
      flag = value < 8 ? "critical" : value < 12 ? "low" : "normal";
    }

    labs.push({
      labId: id("lab", idCounter++),
      patientId: enc.patientId,
      orderedAt: iso(orderedAt),
      resultedAt: iso(resultedAt),
      test,
      value,
      unit,
      refRange,
      flag,
    });
  }
  return labs;
}

function buildMedications(rng: () => number, patients: Patient[]): Medication[] {
  const meds: Medication[] = [];
  let idCounter = 1;
  const now = new Date(MOCK_NOW_ISO);

  for (const p of patients) {
    const medCount = rng() < 0.2 ? 0 : rng() < 0.7 ? 1 : 2;
    const choices: Medication["name"][] = [
      "Metformin",
      "Atorvastatin",
      "Lisinopril",
      "Albuterol",
      "Levothyroxine",
      "Omeprazole",
    ];

    for (let i = 0; i < medCount; i++) {
      const name = pick(rng, choices);
      const startAt = new Date(now.getTime() - days(20 + Math.floor(rng() * 200)));
      const stopped = rng() < 0.12;
      const endAt = stopped ? iso(new Date(now.getTime() - days(2 + Math.floor(rng() * 60)))) : undefined;

      const dose =
        name === "Metformin"
          ? "500 mg"
          : name === "Atorvastatin"
            ? "20 mg"
            : name === "Lisinopril"
              ? "10 mg"
              : name === "Albuterol"
                ? "90 mcg"
                : name === "Levothyroxine"
                  ? "75 mcg"
                  : "20 mg";

      const frequency =
        name === "Albuterol" ? "PRN" : pick(rng, ["Once daily", "Twice daily"]);

      meds.push({
        medicationId: id("med", idCounter++),
        patientId: p.patientId,
        name,
        dose,
        frequency,
        startAt: iso(startAt),
        endAt,
        status: stopped ? "stopped" : "active",
      });
    }
  }
  return meds;
}

function buildTasks(rng: () => number, patients: Patient[]): Task[] {
  const tasks: Task[] = [];
  let idCounter = 1;
  const now = new Date(MOCK_NOW_ISO);
  const types: Task["type"][] = [
    "Schedule follow-up",
    "Repeat labs",
    "Annual wellness visit",
    "Medication refill",
    "Care plan review",
  ];

  for (const p of patients) {
    if (rng() < 0.35) continue;
    const count = rng() < 0.7 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const dueOffsetDays = -10 + Math.floor(rng() * 40); // some overdue, some upcoming
      const dueAt = new Date(now.getTime() + days(dueOffsetDays));
      const done = dueAt.getTime() < now.getTime() - days(3) && rng() < 0.55;

      tasks.push({
        taskId: id("task", idCounter++),
        patientId: p.patientId,
        type: pick(rng, types),
        dueAt: iso(dueAt),
        status: done ? "done" : "open",
        priority: pick(rng, ["low", "medium", "medium", "high"]),
      });
    }
  }
  return tasks;
}

function buildAlerts(rng: () => number, labs: Lab[], vitals: Vital[], tasks: Task[]): Alert[] {
  const alerts: Alert[] = [];
  let idCounter = 1;

  // Critical labs create high severity alerts.
  for (const lab of labs) {
    if (lab.flag !== "critical") continue;
    alerts.push({
      alertId: id("al", idCounter++),
      patientId: lab.patientId,
      createdAt: lab.resultedAt,
      severity: "high",
      category: "lab",
      message: `Critical lab: ${lab.test} ${lab.value}${lab.unit}`,
      status: "active",
    });
  }

  // Uncontrolled BP (very high) creates medium/high alerts.
  for (const v of vitals) {
    if (v.systolicBP < 170 && v.diastolicBP < 110) continue;
    alerts.push({
      alertId: id("al", idCounter++),
      patientId: v.patientId,
      createdAt: v.recordedAt,
      severity: v.systolicBP >= 180 || v.diastolicBP >= 120 ? "high" : "medium",
      category: "vitals",
      message: `Elevated BP: ${v.systolicBP}/${v.diastolicBP}`,
      status: "active",
    });
  }

  // Overdue high-priority tasks create medium alerts.
  const now = new Date(MOCK_NOW_ISO).getTime();
  for (const t of tasks) {
    if (t.status !== "open" || t.priority !== "high") continue;
    if (new Date(t.dueAt).getTime() >= now) continue;
    alerts.push({
      alertId: id("al", idCounter++),
      patientId: t.patientId,
      createdAt: t.dueAt,
      severity: "medium",
      category: "task",
      message: `Overdue task: ${t.type}`,
      status: "active",
    });
  }

  // Randomly resolve a few so UI can show both states later.
  for (const a of alerts) {
    if (rng() < 0.12) a.status = "resolved";
  }

  return alerts;
}

export function createClinicDb(seed = 42): ClinicDb {
  const rng = mulberry32(seed);
  const now = new Date(MOCK_NOW_ISO);

  const clinic: ClinicDb["clinic"] = {
    clinicId: "clinic_001",
    name: "Health SaaS Clinic",
    locations: [
      { locationId: "loc_001", name: "Downtown", city: "Bengaluru" },
      { locationId: "loc_002", name: "Uptown", city: "Bengaluru" },
    ],
  };

  const providers = buildProviders();
  const patients = buildPatients(rng, providers);
  const appointments = buildAppointments(rng, now, patients, providers);
  const encounters = buildEncountersFromAppointments(rng, appointments);
  const vitals = buildVitals(rng, encounters, patients);
  const labs = buildLabs(rng, encounters);
  const medications = buildMedications(rng, patients);
  const tasks = buildTasks(rng, patients);
  const alerts = buildAlerts(rng, labs, vitals, tasks);

  return {
    clinic,
    providers,
    patients,
    appointments,
    encounters,
    vitals,
    labs,
    medications,
    tasks,
    alerts,
  };
}

export const clinicDb = createClinicDb(42);

