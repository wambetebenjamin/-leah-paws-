"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { classNames } from "@/lib/utils";

type CalendarProps = {
  availableDates: string[];
  unavailableDates: string[];
  onSelect?: (date: string) => void;
  selectedDate?: string;
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AvailabilityCalendar({ availableDates, unavailableDates, onSelect, selectedDate }: CalendarProps) {
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const prefix = Array.from({ length: first.getDay() }, () => null);
    const dates = Array.from({ length: last.getDate() }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1));
    return [...prefix, ...dates];
  }, [month]);

  const label = new Intl.DateTimeFormat("en-KE", { month: "long", year: "numeric" }).format(month);

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <button type="button" aria-label="Previous month" onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}><ChevronLeft size={18} aria-hidden="true" /></button>
        <strong>{label}</strong>
        <button type="button" aria-label="Next month" onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}><ChevronRight size={18} aria-hidden="true" /></button>
      </div>
      <div className="calendar-weekdays">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-grid">
        {cells.map((date, index) => {
          if (!date) return <span className="calendar-empty" key={`empty-${index}`} />;
          const key = dateKey(date);
          const available = availableDates.includes(key);
          const unavailable = unavailableDates.includes(key);
          return (
            <button
              type="button"
              key={key}
              disabled={!available}
              className={classNames("calendar-day", available && "available", unavailable && "unavailable", selectedDate === key && "selected")}
              onClick={() => available && onSelect?.(key)}
              aria-label={`${key}${available ? ", available" : ", unavailable"}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="calendar-key"><span className="available-key" /> Available <span className="unavailable-key" /> Unavailable</div>
    </div>
  );
}
