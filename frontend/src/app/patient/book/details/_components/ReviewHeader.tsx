export default function ReviewHeader() {
  return (
    <header className="fixed top-0 right-0 w-full h-16 bg-surface border-b border-outline-variant/20 flex justify-between items-center px-4 sm:px-container_padding z-40">
      <div className="flex items-center gap-2 sm:gap-stack_gap_md min-w-0">
        <span className="font-h2 text-h2 font-bold text-primary shrink-0">Healix</span>
        <div className="h-6 w-[1px] bg-outline-variant/30 mx-1 sm:mx-2 hidden sm:block" />
        <h1 className="font-h3 text-h3 text-on-surface truncate">
          <span className="hidden sm:inline">Step 3: </span>Final Review
        </h1>
      </div>
      <div className="flex items-center gap-stack_gap_md">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            person
          </span>
        </div>
      </div>
    </header>
  );
}
