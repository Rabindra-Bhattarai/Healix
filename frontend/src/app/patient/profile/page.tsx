"use client";

import { useEffect, useState } from "react";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import PersonalInfoCard from "@/app/patient/profile/_components/PersonalInfoCard";
import SecurityAccountCard from "@/components/profile/SecurityAccountCard";
import MedicalInfoCard from "@/app/patient/profile/_components/MedicalInfoCard";
import EditProfileModal from "@/app/patient/profile/_components/EditProfileModal";
import { INITIAL_PROFILE, ProfileData } from "@/app/patient/profile/_components/types";
import { getSession } from "@/lib/auth";
import { sessionUserToProfile, updateProfile } from "@/lib/profile";
import { uploadAvatar } from "@/lib/security";
import { fileToCompressedDataUrl } from "@/lib/image";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [memberSince, setMemberSince] = useState<string | undefined>(undefined);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setProfile(sessionUserToProfile(session.user));
      setAvatarUrl(session.user.avatarUrl);
      setTwoFactorEnabled(Boolean(session.user.twoFactorEnabled));
      if (session.user.createdAt) {
        setMemberSince(
          new Date(session.user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        );
      }
    }
  }, []);

  async function handleSave(next: ProfileData) {
    const saved = await updateProfile(next);
    setProfile(saved);
    setModalOpen(false);
  }

  async function handleAvatarChange(file: File) {
    const dataUrl = await fileToCompressedDataUrl(file);
    const user = await uploadAvatar(dataUrl);
    setAvatarUrl(user.avatarUrl);
  }

  return (
    <div className="max-w-content mx-auto">
      <ProfileHeaderCard
        name={profile.fullName}
        avatarUrl={avatarUrl}
        memberSince={memberSince}
        onEditClick={() => setModalOpen(true)}
        onAvatarChange={handleAvatarChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid_gutter">
        <div className="lg:col-span-8 space-y-grid_gutter">
          <PersonalInfoCard
            email={profile.email}
            phone={profile.phone}
            address={profile.address}
            onEditClick={() => setModalOpen(true)}
          />
          <SecurityAccountCard
            twoFactorEnabled={twoFactorEnabled}
            onTwoFactorChange={setTwoFactorEnabled}
          />
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
