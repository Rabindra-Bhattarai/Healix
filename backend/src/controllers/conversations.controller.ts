import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import Doctor from "../models/Doctor";
import Appointment from "../models/Appointment";
import { asyncHandler } from "../utils/asyncHandler";

async function assertParticipant(conversationId: string, userId: string, role: string) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) return null;

  if (role === "doctor") {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor || conversation.doctor.toString() !== doctor._id.toString()) return null;
  } else if (conversation.patient.toString() !== userId) {
    return null;
  }

  return conversation;
}

export const listConversations = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role === "doctor") {
    const doctor = await Doctor.findOne({ user: req.user!.id });
    if (!doctor) return res.json({ conversations: [] });
    const conversations = await Conversation.find({ doctor: doctor._id })
      .populate("patient", "name")
      .sort({ lastMessageAt: -1 });
    return res.json({ conversations });
  }

  const conversations = await Conversation.find({ patient: req.user!.id })
    .populate("doctor", "name specialty")
    .sort({ lastMessageAt: -1 });
  res.json({ conversations });
});

export const startConversation = asyncHandler(async (req: Request, res: Response) => {
  const { doctorId } = req.body ?? {};
  if (!doctorId) return res.status(400).json({ message: "doctorId is required" });

  const hasAppointment = await Appointment.exists({
    patient: req.user!.id,
    doctor: doctorId,
    status: { $ne: "Cancelled" },
  });
  if (!hasAppointment) {
    return res.status(403).json({ message: "You can only message doctors you have booked with" });
  }

  const conversation = await Conversation.findOneAndUpdate(
    { patient: req.user!.id, doctor: doctorId },
    { $setOnInsert: { patient: req.user!.id, doctor: doctorId, lastMessageAt: new Date() } },
    { new: true, upsert: true }
  ).populate("doctor", "name specialty");

  res.status(201).json({ conversation });
});

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await assertParticipant(req.params.id, req.user!.id, req.user!.role);
  if (!conversation) return res.status(403).json({ message: "Not authorized" });

  const messages = await Message.find({ conversation: conversation._id }).sort({ createdAt: 1 });
  res.json({ messages });
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body ?? {};
  if (!text?.trim()) return res.status(400).json({ message: "text is required" });

  const conversation = await assertParticipant(req.params.id, req.user!.id, req.user!.role);
  if (!conversation) return res.status(403).json({ message: "Not authorized" });

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user!.id,
    senderRole: req.user!.role,
    text: text.trim(),
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  res.status(201).json({ message });
});
