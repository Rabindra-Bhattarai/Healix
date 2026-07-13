import { Schema, model, Document, Types } from "mongoose";

export type VaultReportStatus = "Ready" | "Pending";
export type LabFlag = "NORMAL" | "HIGH" | "LOW" | "OPTIMAL";

export interface LabResultRow {
  testName: string;
  result: string;
  flag: LabFlag;
  referenceRange: string;
  units: string;
}

export interface VaultReportDocument extends Document {
  patient: Types.ObjectId;
  title: string;
  category: string;
  orderedBy: Types.ObjectId;
  orderedByName: string;
  date: Date;
  dateLabel: string;
  status: VaultReportStatus;
  fileSize: string;
  results: LabResultRow[];
}

const labResultSchema = new Schema<LabResultRow>(
  {
    testName: { type: String, required: true },
    result: { type: String, required: true },
    flag: { type: String, enum: ["NORMAL", "HIGH", "LOW", "OPTIMAL"], required: true },
    referenceRange: { type: String, required: true },
    units: { type: String, required: true },
  },
  { _id: false }
);

const vaultReportSchema = new Schema<VaultReportDocument>({
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  orderedBy: { type: Schema.Types.ObjectId, ref: "Doctor" },
  orderedByName: { type: String, required: true },
  date: { type: Date, required: true },
  dateLabel: { type: String, required: true },
  status: { type: String, enum: ["Ready", "Pending"], default: "Pending" },
  fileSize: { type: String, default: "" },
  results: { type: [labResultSchema], default: [] },
});

export default model<VaultReportDocument>("VaultReport", vaultReportSchema);
