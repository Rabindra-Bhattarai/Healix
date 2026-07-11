"use client";

import Portal from "@/components/ui/Portal";

export default function LogoutConfirmModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/20 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-sm p-stack_gap_lg rounded-xl shadow-xl border border-outline-variant/20">
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Logout</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-label-sm text-label-sm hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-error text-on-error rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}