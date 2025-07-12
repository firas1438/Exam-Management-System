"use client";

import { useState, useEffect } from 'react';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from '@/utils/PersistLogin';
import { CoefficientKey,DurationKey,coefTable,durationTable } from '@/lib/data';
import { search } from '@/lib/data';
import Session from "@/components/Session";
import AlertPopup from "@/components/AlertPopup";


const columns = [
  {
    header: "Exam ID",
    accessor: "exam_id",
  },
  {
    header: "Matière",
    accessor: "subject",
  },
  {
    header: "Dep. ID",
    accessor: "department_id",
  },
  {
    header: "Filière",
    accessor: "filiere_name",
  },
  {
    header: "Date",
    accessor: "exam_date",
  },
  {
    header: "heure de début",
    accessor: "start_time",
  },
  {
    header: "heure de fin",
    accessor: "end_time",
  },
  {
    header: "Durée",
    accessor: "duration",
  },
  {
    header: "Coeff",
    accessor: "coefficient",
  },
  {
    header: "Salle",
    accessor: "salle",
  },
  {
    header: "Superviseur",
    accessor: "superviseur",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const keys= [
  "exam_id",
  "duration",
  "subject.name",
  "subject.filiere_name",
  "subject.coefficient",
  "subject.department_id",
  "exam_date",
  "examroom.start_time",
  "examroom.end_time",
  "examroom.room.room_name",
  "supervisorexam[0].teacher.user.name",
];

const ExamListPage = ({searchParams}:{searchParams?:{[key:string]:string}}) => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [filteredExams, setFilteredExams] = useState<any[]>([]);
  const [session, setSession] = useState<any | null>(null);
  const [shouldReloadExams, setShouldReloadExams] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const { page, ...queryParams } = searchParams || {};
  const currentPage = page ? parseInt(page) : 1
  const totalExams = JSON.parse(sessionStorage.getItem('totalExams') || '0')

  useEffect(() => {
    const controller = new AbortController();
  
    const getExams = async () => {
        try {
          if (!session) {
            return;
          }
            const response = await axiosPrivate.get('/exams/getAllExams/'+currentPage+'/'+session?.session_id, {
                signal: controller.signal
            });
            console.log(response.data);
            if (response.status === 200) {
              setExams(response.data);
              setShouldReloadExams(false); 
            }
        } catch (err: any) {
          console.log(err);
          if (err.name !== "CanceledError") {
            console.error("Erreur lors de la récupération des examens:", err);
            router.push('/sign-in');
        }
          }
    }

    if (session || shouldReloadExams) {
      getExams();
    }

    return () => {
        controller.abort();
    }
}, [axiosPrivate, router, currentPage, session, shouldReloadExams])

  useEffect(() => {
    const controller = new AbortController();
    const fetchSession = async () => {
      try {
        const response = await axiosPrivate.get('/sessions/current');
        if (response.status === 200) {
          setSession(response.data);
          setShouldReloadExams(true)
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    !session && fetchSession();

    return () => {
      controller.abort();
  }
  }, []);
  
const __deleteExam=(id:number)=>{
  const filteredExams = exams.filter((exam) => exam.exam_id !== id)
  setExams(filteredExams)
}

const __addExam=(newExam:any)=>{
  setExams((prevExams) => [...prevExams, newExam])
}

const __updateExam=(updatedExam:any)=>{
  console.log("updated",updatedExam)
  setExams((prevExams) =>
    prevExams.map((exam) => ( exam.exam_id === updatedExam.exam_id ? { ...exam, exam_date : updatedExam.exam_date } : exam))
  );
}

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
    <tr
      key={item.exam_id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-5">{item.exam_id}</td>
      <td>{item.subject.name}</td>
      <td>{item.subject.department_id}</td>
      <td>{item.subject.filiere_name}</td>
      <td>{item.exam_date.slice(0,10)}</td>
      <td>{item?.examroom?.start_time.slice(11,16) || "-"}</td>
      <td>{item?.examroom?.end_time.slice(11,16) || "-"}</td>
      <td>{durationTable[item.duration as DurationKey]}h</td>
      <td>{coefTable[item.subject.coefficient as CoefficientKey]}</td>
      <td>{item?.examroom?.room?.room_name || "-"}</td>
      <td>{item?.supervisorexam?.[0]?.teacher?.user?.name || "-"}</td>
      
      <td>
        <div className="flex items-center gap-2">
      
              <FormModal  table="exam" type="update" data={item} updateExam={__updateExam}  session={session} />
              <FormModal  table="exam"  type="delete" id={item.exam_id} deleteExam={__deleteExam} />
        </div>
      </td>
    </tr>
  );

  


  return (
    <PersistLogin>
      <RequireAuth requiredRole="ADMIN">
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* SESSION */}
        <div>
          <h1 className="hidden md:block text-lg font-semibold mb-6">Session</h1>
          <Session 
          session={session}
          onSessionCreated={(newSession:any) => {
            setSession(newSession);
            setShouldReloadExams(true);
          }}
          />
        </div>
    
        
       {/* EXAM */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Examens</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch onSearch={handleSearch} />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {/* create exam - only shown when session exists */}
              {session && (
                <FormModal table="exam" type="create" addExam={__addExam} session={session} />
              )}
            </div>
          </div>
        </div>

        {/* Alert Popup - shown when trying to create exam without session */}
        {!session ? (
          <AlertPopup message="Vous devez créer une session avant de pouvoir ajouter des examens" />
        ) : (
          <AlertPopup message="Il est recommandé de valider tous les examens quelques jours avant le début de la session." />
        )}


        <div className="mt-10">
          {/* LIST */}
          <Table columns={columns} renderRow={renderRow} data={filteredExams} />
          {/* PAGINATION */}
          <Pagination currentPage={currentPage} count ={totalExams} />
        </div>
      </div>
      </RequireAuth>
    </PersistLogin>
  );
};
export default ExamListPage
