import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import departmentsRoutes from "./routes/departments.routes";
import doctorsRoutes from "./routes/doctors.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import vaultRoutes from "./routes/vault.routes";
import conversationsRoutes from "./routes/conversations.routes";
import triageRoutes from "./routes/triage.routes";
import notificationsRoutes from "./routes/notifications.routes";
import { startAppointmentReminderJob } from "./jobs/appointmentReminders";

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000,https://localhost:3000").split(",");
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.path}` });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT ?? 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Healix API listening on port ${PORT}`));
    startAppointmentReminderJob();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
