export default function AuthFooter() {
  return (
    <footer className="border-t border-outline-variant/10 bg-background px-4 sm:px-grid_margin pt-[33px] pb-8 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center gap-4 opacity-50">
        <div className="size-6 rounded bg-surface-variant" />
        <div className="size-6 rounded bg-surface-variant" />
      </div>
      <div className="flex items-start gap-4">
        <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary">
          Help Center
        </a>
        <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary">
          System Status
        </a>
      </div>
    </footer>
  );
}
