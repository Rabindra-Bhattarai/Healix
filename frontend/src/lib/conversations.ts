import { api } from "@/lib/api";

export interface ChatMessage {
  id: string;
  sender: "doctor" | "patient";
  text: string;
  time: string;
}

interface ConversationRecord {
  _id: string;
  doctor: { _id: string; name: string; specialty: string } | string;
}

interface MessageRecord {
  _id: string;
  senderRole: "doctor" | "patient";
  text: string;
  createdAt: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export async function startConversation(doctorId: string): Promise<string> {
  const { conversation } = await api.post<{ conversation: ConversationRecord }>("/conversations", {
    doctorId,
  });
  return conversation._id;
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const { messages } = await api.get<{ messages: MessageRecord[] }>(
    `/conversations/${conversationId}/messages`
  );
  return messages.map((m) => ({
    id: m._id,
    sender: m.senderRole,
    text: m.text,
    time: formatTime(m.createdAt),
  }));
}

export async function sendMessage(conversationId: string, text: string): Promise<ChatMessage> {
  const { message } = await api.post<{ message: MessageRecord }>(
    `/conversations/${conversationId}/messages`,
    { text }
  );
  return { id: message._id, sender: message.senderRole, text: message.text, time: formatTime(message.createdAt) };
}
