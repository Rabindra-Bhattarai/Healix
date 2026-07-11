const CATEGORIES = [
  { icon: "folder", label: "All Reports", count: 24, active: true },
  { icon: "biotech", label: "Lab Results", count: 12, active: false },
  { icon: "prescriptions", label: "Prescriptions", count: 8, active: false },
  { icon: "image", label: "Imaging", count: 4, active: false },
];

export default function CategoryFilter() {
  return (
    <aside className="col-span-12 lg:col-span-3 space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/30">
        <h4 className="text-[11px] font-bold text-[#6B7280]/40 uppercase tracking-widest mb-6">
          File Explorer
        </h4>
        <nav className="flex flex-col gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.label}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm transition-all ${
                category.active
                  ? "bg-[#7F77DD]/5 text-[#7F77DD] font-bold"
                  : "text-[#6B7280] hover:bg-gray-50 font-medium"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                {category.label}
              </span>
              <span className="text-[10px] opacity-60">{category.count}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-[#7F77DD]/5 rounded-2xl p-8 relative overflow-hidden group border border-[#7F77DD]/10">
        <div className="relative z-10">
          <h4 className="text-lg font-bold text-[#1A1A1E] mb-2">Need Help?</h4>
          <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
            Our clinical support team is available 24/7 for document retrieval.
          </p>
          <button className="text-[#7F77DD] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            Contact Support
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
        <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[#7F77DD]/5 text-[140px] select-none pointer-events-none">
          support_agent
        </span>
      </div>
    </aside>
  );
}
