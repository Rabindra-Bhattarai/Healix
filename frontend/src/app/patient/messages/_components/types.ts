export interface ChatMessage {
  id: string;
  sender: "doctor" | "patient";
  text: string;
  time: string;
  attachment?: { name: string; meta: string };
}

export function buildSeedConversation(): ChatMessage[] {
  return [
    {
      id: "1",
      sender: "doctor",
      text: "Good morning, I've finished reviewing your latest symptoms log and the data from your wearable device. Your resting heart rate shows a healthy downward trend.",
      time: "09:15 AM",
    },
    {
      id: "2",
      sender: "patient",
      text: "That's great to hear, Doctor. I've also completed the blood panel tests you requested earlier this week. I just received the digital report.",
      time: "09:22 AM",
    },
    {
      id: "3",
      sender: "doctor",
      text: "Perfect. Could you please share the report here? I'll review it and see if we can discuss any necessary adjustments to your prescription during our call later.",
      time: "09:45 AM",
    },
    {
      id: "4",
      sender: "patient",
      text: "Sure thing! Attaching the PDF report below.",
      time: "09:46 AM",
      attachment: { name: "Lab Results - Blood Panel", meta: "1.2 MB • Oct 26, 2023" },
    },
    {
      id: "5",
      sender: "doctor",
      text: "The results look promising, I have shared the blood panel report with the pharmacy as well. Your cholesterol levels have improved significantly.",
      time: "10:24 AM",
    },
  ];
}
