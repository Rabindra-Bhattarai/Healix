import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Patient routes
import patientAuthRoutes from './routes/patient/auth';
import patientAppointmentRoutes from './routes/patient/appointments';
import patientDepartmentRoutes from './routes/patient/departments';
import patientQueueRoutes from './routes/patient/queue';
import patientVaultRoutes from './routes/patient/vault';
import patientMessageRoutes from './routes/patient/messages';
import patientProfileRoutes from './routes/patient/profile';
import patientNotificationRoutes from './routes/patient/notifications';

// Doctor routes
import doctorAuthRoutes from './routes/doctor/auth';
import doctorAppointmentRoutes from './routes/doctor/appointments';
import doctorPatientRoutes from './routes/doctor/patients';
import doctorPrescriptionRoutes from './routes/doctor/prescriptions';
import doctorQueueRoutes from './routes/doctor/queue';
import doctorMessageRoutes from './routes/doctor/messages';

// Admin routes
import adminAuthRoutes from './routes/admin/auth';
import adminUserRoutes from './routes/admin/users';
import adminDoctorRoutes from './routes/admin/doctors';
import adminDepartmentRoutes from './routes/admin/departments';
import adminAppointmentRoutes from './routes/admin/appointments';
import adminAnalyticsRoutes from './routes/admin/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Healix API is running', version: '1.0.0' });
});

// Patient API routes
app.use('/api/patient/auth', patientAuthRoutes);
app.use('/api/patient/appointments', patientAppointmentRoutes);
app.use('/api/patient/departments', patientDepartmentRoutes);
app.use('/api/patient/queue', patientQueueRoutes);
app.use('/api/patient/vault', patientVaultRoutes);
app.use('/api/patient/messages', patientMessageRoutes);
app.use('/api/patient/profile', patientProfileRoutes);
app.use('/api/patient/notifications', patientNotificationRoutes);

// Doctor API routes
app.use('/api/doctor/auth', doctorAuthRoutes);
app.use('/api/doctor/appointments', doctorAppointmentRoutes);
app.use('/api/doctor/patients', doctorPatientRoutes);
app.use('/api/doctor/prescriptions', doctorPrescriptionRoutes);
app.use('/api/doctor/queue', doctorQueueRoutes);
app.use('/api/doctor/messages', doctorMessageRoutes);

// Admin API routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/doctors', adminDoctorRoutes);
app.use('/api/admin/departments', adminDepartmentRoutes);
app.use('/api/admin/appointments', adminAppointmentRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);

app.listen(PORT, () => {
  console.log(`Healix server running on port ${PORT}`);
});

export default app;