export default function BasicInfoCard({
  email,
  phone,
  onEditClick,
}: {
  email: string;
  phone: string;
  onEditClick: () => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-container_padding">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-h3 text-h3 text-on-surface">Personal Information</h3>
        <button
          onClick={onEditClick}
          aria-label="Edit personal information"
          className="text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-outline">Email Address</label>
          <p className="font-body-lg text-body-lg text-on-surface">{email}</p>
        </div>
        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-outline">Phone Number</label>
          <p className="font-body-lg text-body-lg text-on-surface">{phone || "—"}</p>
        </div>
      </div>
    </div>
  );
}
