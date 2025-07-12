"use client";

import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from "@/utils/PersistLogin";
import { CoefficientKey, coefTable, DurationKey, durationTable } from "@/lib/data";
import { toast } from "react-toastify";

const columns = [
  { header: "Examen", accessor: "Examen", className: "text-center px-4 py-3" },
  { header: "Coefficient", accessor: "Coefficient", className: "text-center px-4 py-3" },
  { header: "Department", accessor: "Department", className: "text-center px-4 py-3" },
  { header: "Filière", accessor: "Filière", className: "text-center px-4 py-3" },
  { header: "Date", accessor: "Date", className: "text-center px-4 py-3" },
  { header: "Durée", accessor: "Durée", className: "text-center px-4 py-3" },
  { header: "Début", accessor: "Début", className: "text-center px-4 py-3" },
  { header: "Fin", accessor: "Fin", className: "text-center px-4 py-3" },
  { header: "Salle", accessor: "Salle", className: "text-center px-4 py-3" },
  { header: "Surveillant", accessor: "Surveillant", className: "text-center px-4 py-3" },
];

type Session = {
  session_id: number;
  session_type: string;
  date_debut: string;
  date_fin: string;
  label?: string;
};

type SessionColumns = {
  Examen: string;
  Coefficient: number;
  Department: string;
  Filière: string;
  Date: string;
  Durée: string;
  Début: string;
  Fin: string;
  Salle: string;
  Surveillant: string;
};

const renderRow = (row:any) => (
  <tr key={row.exam_id} 
  className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
    <td className="text-center px-4 py-5 align-middle">{row.subject.name}</td>
    <td className="text-center align-middle">{coefTable[row.subject.coefficient as CoefficientKey]}</td>
    <td className="text-center align-middle">{row.subject.department.name}</td>
    <td className="text-center align-middle">{row.subject.filiere_name}</td>
    <td className="text-center align-middle">{row.exam_date.slice(0,10)}</td>
    <td className="text-center align-middle">{durationTable[row.duration as DurationKey]}h</td>
    <td className="text-center align-middle">{row?.examroom?.start_time.slice(11,16) || "-"}</td>
    <td className="text-center align-middle">{row?.examroom?.end_time.slice(11,16) || "-"}</td>
    <td className="text-center align-middle">{row?.examroom?.room?.room_name || "-"}</td>
    <td className="text-center align-middle">{row?.supervisorexam?.[0]?.teacher?.user?.name || "-"}</td>
  </tr>
);

const HistoriqueSessionPage = ({ searchParams }: { searchParams?: { [key: string]: string } }) => {
  const axiosPrivate = useAxiosPrivate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [tableData, setTableData] = useState<SessionColumns[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { page, ...queryParams } = searchParams || {};
  const currentPage = page ? parseInt(page) : 1;
  const controller = new AbortController();
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosPrivate.get('/sessions/',{signal: controller.signal});
        if (response.status === 200) {
          console.log(response.data);
          const formattedSessions = response.data.map((session: Session) => {
            const label = `${session.session_type} ( ${formatDate(session.date_debut)} - ${formatDate(session.date_fin)} )`;
            return {
              ...session,
              label,
            };
          });
          setSessions(formattedSessions);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSessions();

    return () => {
      controller.abort();
    };
  }, []);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!selectedSession) return;
      try {
        const respnse = await axiosPrivate.get(`exams/getExamsBySessionId/${selectedSession}/`, {
          signal: controller.signal
        });
        if (respnse.status === 200) {
        setTableData(respnse.data);

        }
      } catch (error) {
        toast.error("Erreur lors de la récupération des examens de la session sélectionnée");
      }
    };
    fetchSessionData();
  }, [selectedSession,currentPage]);

  const handleDuplicateSession = () => {
    // Logic for duplicating session 
    console.log("Duplicating session:", selectedSession);
  };

  return (
    <PersistLogin>
      <RequireAuth requiredRole="ADMIN">
        <div className="bg-white p-5 rounded-md flex-1 m-4 mt-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-lg font-semibold mb-6">Historique</h1>

            {/* Session Selector and Button */}
            <div className="w-full mb-10 flex items-center space-x-4">
              <div className="relative w-3/4">
                <select
                  id="session-select"
                  value={selectedSession ?? ""}
                  onChange={(e) => setSelectedSession(Number(e.target.value))}
                  className="block w-full appearance-none bg-white rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm text-gray-800 shadow-sm focus:border-lamaPurple focus:ring-2 focus:ring-lamaPurpleLight transition-all"
                >
                  <option value="" disabled>
                    Sélectionnez la session voulue
                  </option>
                  {sessions.map((session) => (
                    <option key={session.session_id} value={session.session_id}>
                      {session.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Dupliquer Session Button */}
              <button
                onClick={handleDuplicateSession}
                className="w-1/4 inline-flex items-center justify-center gap-4 rounded-lg bg-[#f9e17c] px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-sm transition duration-150 ease-in-out hover:bg-[#e6d06b] focus:bg-[#f9e17c] active:bg-[#d9bc5f]"
              >
                <img src="/duplicate.png" alt="Modifier Icon" className="w-5 h-5"/>
                Dupliquer session
              </button>


              
            </div>
          </div>

          {/* Table Section */}
          <Table columns={columns} renderRow={renderRow} data={tableData} />
          {/* Pagination ici */}
          
        </div>
      </RequireAuth>
    </PersistLogin>
  );
};

export default HistoriqueSessionPage;
