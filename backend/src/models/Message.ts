import { Schema, model, Document, Types } from "mongoose";

export interface MessageDocument extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  senderRole: "patient" | "doctor";
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["patient", "doctor"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<MessageDocument>("Message", messageSchema);
