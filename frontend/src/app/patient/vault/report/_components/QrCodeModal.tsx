"use client";

import Portal from "@/components/ui/Portal";

export default function QrCodeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-md"
          onClick={onClose}
        />
        <div className="relative bg-surface rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col items-center p-8 text-center">
          <div className="mb-6">
            <h2 className="font-h3 text-h3 text-on-surface mb-2">Secure Clinical QR</h2>
            <p className="font-body-md text-on-surface-variant">Scan at your pharmacy to verify.</p>
          </div>
          <div className="w-64 h-64 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-outline-variant text-[120px]">
              qr_code_2
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </Portal>
  );
}