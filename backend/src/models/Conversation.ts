import { Schema, model, Document, Types } from "mongoose";

export interface ConversationDocument extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  lastMessageAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>({
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  lastMessageAt: { type: Date, default: Date.now },
});

conversationSchema.index({ patient: 1, doctor: 1 }, { unique: true });

export default model<ConversationDocument>("Conversation", conversationSchema);
