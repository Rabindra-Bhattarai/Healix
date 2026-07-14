export const VAULT_CATEGORIES = ["Lab Results", "Prescriptions", "Imaging", "Vitals"] as const;
export type VaultCategory = (typeof VAULT_CATEGORIES)[number];

export interface VaultCategoryFields {
  rowLabel: string;
  addButtonLabel: string;
  columns: {
    testName: string;
    result: string;
    referenceRange: string;
    units: string;
  };
  showFlag: boolean;
  presetTestNames?: string[];
}

export type VitalTone = "primary" | "secondary" | "tertiary" | "error";

export interface VitalMetric {
  name: string;
  icon: string;
  defaultUnits: string;
  defaultRange: string;
  tone: VitalTone;
}

export const VITAL_METRICS: VitalMetric[] = [
  { name: "Heart Rate", icon: "monitor_heart", defaultUnits: "bpm", defaultRange: "60-100", tone: "error" },
  { name: "Blood Pressure", icon: "favorite", defaultUnits: "mmHg", defaultRange: "90/60-120/80", tone: "primary" },
  { name: "SpO2", icon: "air", defaultUnits: "%", defaultRange: "95-100", tone: "secondary" },
  { name: "Temperature", icon: "thermostat", defaultUnits: "°F", defaultRange: "97-99", tone: "tertiary" },
  { name: "Respiratory Rate", icon: "pulmonology", defaultUnits: "breaths/min", defaultRange: "12-20", tone: "secondary" },
  { name: "Weight", icon: "monitor_weight", defaultUnits: "lbs", defaultRange: "—", tone: "primary" },
];

export const VAULT_CATEGORY_FIELDS: Record<VaultCategory, VaultCategoryFields> = {
  "Lab Results": {
    rowLabel: "Test",
    addButtonLabel: "+ Add Test",
    columns: {
      testName: "Test Name",
      result: "Result",
      referenceRange: "Reference Range",
      units: "Units",
    },
    showFlag: true,
  },
  Prescriptions: {
    rowLabel: "Medication",
    addButtonLabel: "+ Add Medication",
    columns: {
      testName: "Medication",
      result: "Dosage",
      referenceRange: "Frequency",
      units: "Duration",
    },
    showFlag: false,
  },
  Imaging: {
    rowLabel: "Finding",
    addButtonLabel: "+ Add Finding",
    columns: {
      testName: "Study Type",
      result: "Finding",
      referenceRange: "Impression",
      units: "Notes",
    },
    showFlag: false,
  },
  Vitals: {
    rowLabel: "Vital",
    addButtonLabel: "+ Add Vital",
    columns: {
      testName: "Metric",
      result: "Value",
      referenceRange: "Normal Range",
      units: "Units",
    },
    showFlag: true,
    presetTestNames: VITAL_METRICS.map((v) => v.name),
  },
};

export function getVaultCategoryFields(category: string): VaultCategoryFields {
  return VAULT_CATEGORY_FIELDS[category as VaultCategory] ?? VAULT_CATEGORY_FIELDS["Lab Results"];
}
