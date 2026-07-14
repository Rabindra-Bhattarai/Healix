"use client";

import { useState } from "react";
import Portal from "@/components/ui/Portal";
import { ApiError } from "@/lib/api";

export default function ConfirmDeleteModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/20 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-sm p-stack_gap_lg rounded-xl shadow-xl border border-outline-variant/20">
          <h2 className="font-h2 text-h2 text-on-surface mb-2">{title}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">{message}</p>
          {error && (
            <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-label-sm text-label-sm hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-error text-on-error rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
