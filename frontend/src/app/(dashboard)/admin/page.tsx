"use client"

import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { useState,useEffect } from "react";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';




const AdminPage = () => {
  const [counts, setCounts] = useState({ totalSupervisors: 0, totalStudent: 0, totalSubjects: 0, totalExams: 0, examByDep: [], availableRooms: 0, notAvailableRooms: 0, totalRooms: 0 ,logs: []});
  const axiosPrivate=useAxiosPrivate()
  useEffect(() => {
    const controller = new AbortController();

    const count = async () => {
        try {
            const response = await axiosPrivate.get('/supervisors/getCountsSummaryAdmin', {
                signal: controller.signal
            });
            console.log(response.data);
            if (response.status === 200) {
              setCounts(response.data);
              sessionStorage.setItem('totalExams', JSON.stringify(response.data.totalExams)) 
              sessionStorage.setItem('totalRooms', JSON.stringify(response.data.availableRooms+response.data.notAvailableRooms)) 
              sessionStorage.setItem('totalSubjects', JSON.stringify(response.data.totalSubjects)) 
              sessionStorage.setItem('totalSupervisors', JSON.stringify(response.data.totalSupervisors)) 
            }
            
        } catch (err: any) {
          console.log(err);
          if (err.name !== "CanceledError") {
            console.error("Erreur lors de la récupération des examens:", err);
        }
          }
    }

    count();

    return () => {
        controller.abort();
    }
}, [])
  
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Enseignants" count={counts.totalSupervisors} />
          <UserCard type="Etudiants" count={counts.totalStudent} />
          <UserCard type="Matiéres" count={counts.totalSubjects} />
          <UserCard type="Examens" count={counts.totalExams} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart availableRooms={counts.availableRooms} notAvailableRooms={counts.notAvailableRooms}/>
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart examByDep={counts.examByDep}/>
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements data={counts.logs}/>
      </div>
    </div>
  );
};

export default AdminPage;
