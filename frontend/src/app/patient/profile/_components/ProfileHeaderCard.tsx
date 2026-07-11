export default function ProfileHeaderCard({
  name,
  onEditClick,
}: {
  name: string;
  onEditClick: () => void;
}) {
  return (
    <section className="bg-surface-container-lowest p-stack_gap_lg rounded-xl border border-outline-variant/20 mb-stack_gap_lg flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
      <div className="relative shrink-0">
        <div className="w-32 h-32 rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[64px]">
            person
          </span>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-lg shadow-lg">
          <span className="material-symbols-outlined text-[18px]">verified</span>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="font-h1 text-h1 text-on-surface">{name}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center md:justify-start mt-1">
              <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
              San Francisco, CA &bull; Patient ID: #HX-98210
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <button
              onClick={onEditClick}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
            >
              Edit Profile
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-outline-variant/20 pt-6">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Member Since
            </span>
            <span className="font-h3 text-h3 text-on-surface mt-1">Oct 2023</span>
          </div>
        </div>
      </div>
    </section>
  );
}
