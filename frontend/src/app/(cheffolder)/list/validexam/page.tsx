"use client";

import { useState,useEffect } from 'react';
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {  search } from "@/lib/data";
import Image from "next/image";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { CoefficientKey,DurationKey,coefTable,durationTable } from '@/lib/data';




const columns = [
  { header: "Exam ID", accessor: "exam_id" },
  { header: "Matiere", accessor: "subject" },
  {header: "Filière",accessor: "filiere_name"},
  { header: "Date", accessor: "exam_date" },
  { header: "Start Time", accessor: "start_time" },
  { header: "End Time", accessor: "end_time" },
  { header: "Duration", accessor: "duration" },
  { header: "Coefficient", accessor: "coefficient" },
  { header: "Salle", accessor: "salle" },
  { header: "Surveillant", accessor: "surveillant" },
];
const keys=[
  "exam_id",
  "start_time",
  "end_time",
  "teacher.user.name",
  "exam.exam_date",
  "exam.subject.name",
  "exam.duration",
  "exam.subject.coefficient",
  "exam.subject.department_id",
  "exam.subject.filiere_name",
  "room.room_name",
]

export default function ValidExams0({searchParams}:{searchParams?:{[key:string]:string}}) {
  const { page, ...queryParams } = searchParams || {};
  const currentPage = page ? parseInt(page) : 1
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [filteredExams, setFilteredExams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {auth}=useAuth()
  const totalExams = JSON.parse(sessionStorage.getItem('validatedExams') || '0')

    useEffect(() => {
      const controller = new AbortController();
  
      const getExams = async () => {
          try {
              const response = await axiosPrivate.get('/exams/validatedExamsByDeaprtment/'+auth.user_id+'/'+currentPage, {
                  signal: controller.signal
              });
              console.log("data fetched",response.data);
              if (response.status === 200) {
                setExams(response.data); 
              }
              
          } catch (err: any) {
            console.log(err);
            if (err.name !== "CanceledError") {
              console.error("Erreur lors de la récupération des examens:", err);
              router.push('/sign-in');
          }
            }
      }
  
      getExams();
  
      return () => {
          controller.abort();
      }
  }, [axiosPrivate, router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExams(exams);
    } else {
      const results = search(exams, searchQuery, keys);
      setFilteredExams(results);
    }
  }, [searchQuery, exams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderRow = (item: any) => (
    <tr key={item.exam_id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-5">{item.exam_id}</td>
      <td>{item.exam.subject.name}</td>
      <td>{item.exam.subject.filiere_name}</td>
      <td>{item.exam.exam_date.slice(0,10)}</td>
      <td>{item.start_time.slice(11,16)}</td>
      <td>{item.end_time.slice(11,16)}</td>
      <td>{durationTable[item.exam.duration as DurationKey]}h</td>
      <td>{coefTable[item.exam.subject.coefficient as CoefficientKey ]}</td>
      <td>{item.room.room_name}</td>
      <td>{item.teacher.user.name}</td>
    </tr>
  );

  return (
    <div className="p-4 flex flex-col items-center w-full">
      {/* TABLE */}
      <div className="mt-4 w-full">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Examens validées du département:</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch onSearch={handleSearch} />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="Filter" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="Sort" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>

        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={filteredExams} />

        {/* PAGINATION */}
        { exams.length>0 && <Pagination
            currentPage={currentPage}
            count ={totalExams}
        />}
      </div>


    </div>
  );
}
