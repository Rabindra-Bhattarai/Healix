"use client";

import { useState } from "react";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import TwoFactorModal from "@/components/profile/TwoFactorModal";

export default function SecurityAccountCard({
  twoFactorEnabled,
  onTwoFactorChange,
}: {
  twoFactorEnabled: boolean;
  onTwoFactorChange: (enabled: boolean) => void;
}) {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-container_padding">
      <h3 className="font-h3 text-h3 text-on-surface mb-6">Security &amp; Account</h3>
      <div className="space-y-4">
        <button
          onClick={() => setPasswordModalOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-outline-variant/20 hover:bg-surface-container transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-surface-container p-2 rounded-lg group-hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">lock_reset</span>
            </div>
            <div className="text-left">
              <p className="font-body-lg text-body-lg text-on-surface font-medium">
                Change Password
              </p>
              <p className="font-label-sm text-label-sm text-outline">Update your account password</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </button>

        <button
          onClick={() => setTwoFactorModalOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-outline-variant/20 hover:bg-surface-container transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-surface-container p-2 rounded-lg group-hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">security</span>
            </div>
            <div className="text-left">
              <p className="font-body-lg text-body-lg text-on-surface font-medium">
                Two-Factor Authentication
              </p>
              <p
                className={`font-label-sm text-label-sm ${
                  twoFactorEnabled ? "text-secondary font-semibold" : "text-outline"
                }`}
              >
                {twoFactorEnabled ? "Enabled (Email)" : "Disabled"}
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </button>
      </div>

      {passwordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}
      {twoFactorModalOpen && (
        <TwoFactorModal
          mode={twoFactorEnabled ? "disable" : "enable"}
          onClose={() => setTwoFactorModalOpen(false)}
          onChanged={onTwoFactorChange}
        />
      )}
    </div>
  );
}
