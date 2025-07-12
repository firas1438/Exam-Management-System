"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Sep", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Oct", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Nov", "Exams conducted": 135, "Supervisors appointed": 78 },
  { name: "Dec", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Jan", "Exams conducted": 159, "Supervisors appointed": 102 },
  { name: "Feb", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Mar", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Apr", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "May", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Jun", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Jul", "Exams conducted": 0, "Supervisors appointed": 0 },
  { name: "Aug", "Exams conducted": 0, "Supervisors appointed": 0 },
];

const ExamsChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold mb-6">Exam related statistics</h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#a8b0be" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#a8b0be" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{
              paddingTop: "10px",
              paddingBottom: "30px",
              fontWeight: "bold", // Make the legend text bold
            }}
          />
          <Line
            type="monotone"
            dataKey="Exams conducted"
            stroke="#b6b2eb"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Supervisors appointed"
            stroke="#FAE27C"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExamsChart;
