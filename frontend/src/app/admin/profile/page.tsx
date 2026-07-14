"use client";

import { useEffect, useState } from "react";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import SecurityAccountCard from "@/components/profile/SecurityAccountCard";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import EditBasicInfoModal from "@/components/profile/EditBasicInfoModal";
import { getSession } from "@/lib/auth";
import { uploadAvatar } from "@/lib/security";
import { fileToCompressedDataUrl } from "@/lib/image";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [memberSince, setMemberSince] = useState<string | undefined>(undefined);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setName(session.user.name);
    setEmail(session.user.email);
    setPhone(session.user.phone ?? "");
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
  }, []);

  async function handleAvatarChange(file: File) {
    const dataUrl = await fileToCompressedDataUrl(file);
    const user = await uploadAvatar(dataUrl);
    setAvatarUrl(user.avatarUrl);
  }

  return (
    <div className="max-w-content mx-auto">
      <ProfileHeaderCard
        name={name}
        avatarUrl={avatarUrl}
        memberSince={memberSince}
        onEditClick={() => setModalOpen(true)}
        onAvatarChange={handleAvatarChange}
      />

      <div className="grid grid-cols-1 gap-grid_gutter">
        <BasicInfoCard email={email} phone={phone} onEditClick={() => setModalOpen(true)} />
        <SecurityAccountCard
          twoFactorEnabled={twoFactorEnabled}
          onTwoFactorChange={setTwoFactorEnabled}
        />
      </div>

      {modalOpen && (
        <EditBasicInfoModal
          name={name}
          email={email}
          phone={phone}
          onClose={() => setModalOpen(false)}
          onSaved={(data) => {
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
          }}
        />
      )}
    </div>
  );
}
