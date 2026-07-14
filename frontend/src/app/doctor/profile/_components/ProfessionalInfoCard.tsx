export default function ProfessionalInfoCard({
  specialty,
  description,
  tags,
  experienceYears,
  location,
  onEditClick,
}: {
  specialty: string;
  description: string;
  tags: string[];
  experienceYears: number;
  location: string;
  onEditClick: () => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-container_padding">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-h3 text-h3 text-on-surface">Professional Information</h3>
        <button
          onClick={onEditClick}
          aria-label="Edit professional information"
          className="text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-outline">Specialty</label>
          <p className="font-body-lg text-body-lg text-on-surface">{specialty}</p>
        </div>
        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-outline">Experience</label>
          <p className="font-body-lg text-body-lg text-on-surface">{experienceYears} years</p>
        </div>
        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-outline">Location</label>
          <p className="font-body-lg text-body-lg text-on-surface">{location}</p>
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="font-label-sm text-label-sm text-outline">Bio</label>
          <p className="font-body-lg text-body-lg text-on-surface">{description || "—"}</p>
        </div>
        {tags.length > 0 && (
          <div className="md:col-span-2 space-y-2">
            <label className="font-label-sm text-label-sm text-outline">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
