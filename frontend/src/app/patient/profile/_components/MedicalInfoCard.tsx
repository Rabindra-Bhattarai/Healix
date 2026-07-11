import Link from "next/link";

export default function MedicalInfoCard({
  bloodType,
  allergies,
  chronicConditions,
}: {
  bloodType: string;
  allergies: string;
  chronicConditions: string;
}) {
  const allergyList = allergies
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
      <div className="bg-primary px-6 py-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-on-primary">medical_information</span>
        <h3 className="font-h3 text-h3 text-on-primary">Medical Information</h3>
      </div>
      <div className="p-6 space-y-8">
        <div>
          <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
            Blood Type
          </label>
          <div className="flex items-center mt-2">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center mr-3">
              <span className="material-symbols-outlined text-error">bloodtype</span>
            </div>
            <span className="font-h2 text-h2 text-on-surface">{bloodType}</span>
          </div>
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
            Known Allergies
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {allergyList.length === 0 ? (
              <span className="font-body-md text-body-md text-on-surface-variant italic">
                No known allergies.
              </span>
            ) : (
              allergyList.map((allergy, i) => (
                <span
                  key={allergy}
                  className={`px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center ${
                    i === 0
                      ? "bg-error/5 text-error border border-error/20"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {i === 0 && (
                    <span className="material-symbols-outlined text-[14px] mr-1">warning</span>
                  )}
                  {allergy}
                </span>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
            Chronic Conditions
          </label>
          <div className="mt-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
            <p className="font-body-md text-body-md text-on-surface-variant italic">
              {chronicConditions.trim() || "No chronic conditions listed in patient history."}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
            Quick Actions
          </label>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              href="/patient/appointments"
              className="flex flex-col items-center justify-center p-3 bg-white border border-outline-variant/20 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all group"
            >
              <span className="material-symbols-outlined text-outline group-hover:text-on-primary-container mb-1">
                history
              </span>
              <span className="font-label-sm text-label-sm">History</span>
            </Link>
            <button className="flex flex-col items-center justify-center p-3 bg-white border border-outline-variant/20 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all group">
              <span className="material-symbols-outlined text-outline group-hover:text-on-primary-container mb-1">
                pill
              </span>
              <span className="font-label-sm text-label-sm">Prescriptions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
