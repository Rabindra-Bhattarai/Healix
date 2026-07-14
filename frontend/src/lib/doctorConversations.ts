import { api } from "@/lib/api";

export interface DoctorConversation {
  conversationId: string;
  patientId: string;
  patientName: string;
}

interface ConversationRecord {
  _id: string;
  patient: { _id: string; name: string } | string;
}

export async function listMyConversations(): Promise<DoctorConversation[]> {
  const { conversations } = await api.get<{ conversations: ConversationRecord[] }>(
    "/conversations"
  );
  return conversations.map((c) => {
    const patient = typeof c.patient === "string" ? { _id: c.patient, name: "Patient" } : c.patient;
    return { conversationId: c._id, patientId: patient._id, patientName: patient.name };
  });
}

export { getMessages, sendMessage } from "@/lib/conversations";
