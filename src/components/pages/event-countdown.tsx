"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function calcTimeLeft(targetIso: string): TimeLeft {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function EventCountdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTime(calcTimeLeft(targetDate));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: time?.days ?? "--" },
    { label: "Hours", value: time?.hours ?? "--" },
    { label: "Mins", value: time?.minutes ?? "--" },
    { label: "Secs", value: time?.seconds ?? "--" },
  ];

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label="Countdown to event start"
      className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/95 px-6 py-5 text-center shadow-2xl backdrop-blur-md"
    >
      <span className="text-[10px] font-semibold tracking-[0.22em] text-white/70 uppercase">
        Starts In
      </span>
      <div className="mt-2.5 flex items-center gap-3 sm:gap-4">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
            <div className="flex min-w-[3rem] flex-col items-center">
              <span className="font-mono text-2xl leading-none font-bold tracking-tight text-white tabular-nums md:text-3xl">
                {unit.value}
              </span>
              <span className="mt-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/55 uppercase">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 ? (
              <span
                aria-hidden="true"
                className="-mt-4 text-lg font-bold text-white/35"
              >
                :
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
