"use client";

import { useState } from "react";
import ProfileHeaderCard from "@/app/patient/profile/_components/ProfileHeaderCard";
import PersonalInfoCard from "@/app/patient/profile/_components/PersonalInfoCard";
import SecurityAccountCard from "@/app/patient/profile/_components/SecurityAccountCard";
import MedicalInfoCard from "@/app/patient/profile/_components/MedicalInfoCard";
import EditProfileModal from "@/app/patient/profile/_components/EditProfileModal";
import { INITIAL_PROFILE, ProfileData } from "@/app/patient/profile/_components/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [modalOpen, setModalOpen] = useState(false);

  function handleSave(next: ProfileData) {
    setProfile(next);
    setModalOpen(false);
  }

  return (
    <div className="max-w-content mx-auto">
      <ProfileHeaderCard name={profile.fullName} onEditClick={() => setModalOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid_gutter">
        <div className="lg:col-span-8 space-y-grid_gutter">
          <PersonalInfoCard
            email={profile.email}
            phone={profile.phone}
            address={profile.address}
            onEditClick={() => setModalOpen(true)}
          />
          <SecurityAccountCard />
        </div>

        <div className="lg:col-span-4">
          <MedicalInfoCard
            bloodType={profile.bloodType}
            allergies={profile.allergies}
            chronicConditions={profile.chronicConditions}
          />
        </div>
      </div>

      {modalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
