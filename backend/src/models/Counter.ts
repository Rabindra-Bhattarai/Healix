import { Schema, model, Document } from "mongoose";

export interface CounterDocument extends Document {
  key: string;
  seq: number;
}

const counterSchema = new Schema<CounterDocument>({
  key: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export default model<CounterDocument>("Counter", counterSchema);
