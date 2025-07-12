"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";



const CountChart = ( {availableRooms, notAvailableRooms} : { availableRooms: number, notAvailableRooms: number}) => {
  const total=availableRooms+notAvailableRooms
  const data = [
    {
      name: "Total",
      count: total,
      fill: "white",
    },
    {
      name: "Salles non disponibles",
      count: notAvailableRooms,
      fill: "#C3EBFA",
    },
    {
      name: "Salles disponibles",
      count: availableRooms,
      fill: "#FAE27C",
    },

  ];
  const availableRoomsPercentage=(availableRooms/total) *100
  const notAvailableRoomsPercentage=(notAvailableRooms/total) *100
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Salles</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        
        <Image
          src="/classclass.jpg"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-8">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{notAvailableRooms}</h1>
          <h2 className="text-xs text-gray-400">disponible ({notAvailableRoomsPercentage}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{availableRooms}</h1>
          <h2 className="text-xs text-gray-400">non disponible ({availableRoomsPercentage}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
