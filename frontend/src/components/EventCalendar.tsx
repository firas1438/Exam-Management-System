"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
  {
    id: 1,
    title: "Examens S1",
    time: "2024/2025",
    description: "Les examens de semestre 1 prend lieu du 2025/01/07 à 2025/01/18.",
  },
  {
    id: 2,
    title: "DS S1",
    time: "2024/2025",
    description: "Les DS de semestre 1 prend lieu du 2024/11/18 à 2024/11/23.",
  },
  {
    id: 3,
    title: "Examens S2",
    time: "2023/2024",
    description: "Les examens de semestre 2 prend lieu du 2024/05/19 à 2024/05/27.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default EventCalendar;
