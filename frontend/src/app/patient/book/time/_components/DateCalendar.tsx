"use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function buildMonthGrid(year: number, monthIndex: number) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay(); // Sunday-first

  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function DateCalendar({
  selectedDay,
  onSelectDay,
  year,
  monthIndex,
}: {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  year: number;
  monthIndex: number;
}) {
  const [visibleMonth, setVisibleMonth] = useState(monthIndex);
  const [visibleYear, setVisibleYear] = useState(year);

  const cells = useMemo(() => buildMonthGrid(visibleYear, visibleMonth), [visibleYear, visibleMonth]);
  const monthLabel = new Date(visibleYear, visibleMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function goToMonth(delta: number) {
    const next = new Date(visibleYear, visibleMonth + delta, 1);
    setVisibleYear(next.getFullYear());
    setVisibleMonth(next.getMonth());
  }

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <h3 className="font-h3 text-h3">Select Appointment Date</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
            className="material-symbols-outlined p-2 hover:bg-surface-container-low rounded-full border border-outline-variant/20"
          >
            chevron_left
          </button>
          <span className="font-semibold text-body-lg mx-2">{monthLabel}</span>
          <button
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="material-symbols-outlined p-2 hover:bg-surface-container-low rounded-full border border-outline-variant/20"
          >
            chevron_right
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-label-sm font-mono-label text-on-surface-variant mb-4">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="p-4" />;
          const selected =
            day === selectedDay && visibleMonth === monthIndex && visibleYear === year;
          return (
            <button
              key={i}
              onClick={() => onSelectDay(day)}
              className={`p-4 rounded-lg transition-colors ${
                selected
                  ? "bg-primary text-on-primary font-bold shadow-lg shadow-primary/20"
                  : "hover:bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
