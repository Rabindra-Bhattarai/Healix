export default function ConsultationCard() {
  return (
    <div className="bg-primary p-6 sm:p-10 rounded-[2.5rem] text-on-primary flex flex-col justify-between min-h-[340px] lg:h-[380px] shadow-[0_20px_50px_-12px_rgba(87,78,177,0.5)] relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ring-white/30">
            Upcoming Consultation
          </div>
          <span className="material-symbols-outlined cursor-pointer hover:bg-white/10 rounded-full p-2 transition-colors">
            more_vert
          </span>
        </div>

        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 shadow-xl flex items-center justify-center text-2xl font-bold">
            SJ
          </div>
          <div>
            <h4 className="text-2xl font-extrabold tracking-tight">Dr. Sarah Jenkins</h4>
            <p className="text-white/80 font-medium text-lg">Head of Cardiology</p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-10">
          <div>
            <p className="text-[11px] font-bold uppercase opacity-60 tracking-widest">Start Time</p>
            <p className="text-2xl font-black">
              14:00 <span className="text-sm font-normal">EST</span>
            </p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-[11px] font-bold uppercase opacity-60 tracking-widest">Countdown</p>
            <p className="text-2xl font-black">
              24 <span className="text-sm font-normal">min</span>
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="relative z-10 w-full bg-white text-primary py-5 rounded-3xl font-black uppercase tracking-[0.15em] text-sm hover:scale-[1.02] hover:shadow-2xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group"
      >
        <span
          className="material-symbols-outlined transition-transform group-hover:scale-110"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          videocam
        </span>
        Join Consultation
      </button>
    </div>
  );
}