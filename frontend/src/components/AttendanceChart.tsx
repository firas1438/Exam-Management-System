"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


interface DepartmentChartProps {
  examByDep: any; // Replace 'any' with the appropriate type if known
}

const DepartmentChart = ({ examByDep }: DepartmentChartProps) => {
  const data: { name: string; [key: string]: number | string }[] = [{ name: "Department" }];
  examByDep.forEach((element: { department_id:number,department_name: string; exam_count: number }) => {
    data[0][element.department_name] = element.exam_count;
  });

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Examens par Department</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={50} barGap={50}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#a8b0be" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#a8b0be" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
            formatter={(value) => <span style={{ fontWeight: "bold" }}>{value}</span>}
          />
          <Bar
            dataKey="Informatique"
            fill="#FAE27C"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="Mathématiques"
            fill="#d0ccfc"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="Technologie"
            fill="#C3EBFA"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentChart;
