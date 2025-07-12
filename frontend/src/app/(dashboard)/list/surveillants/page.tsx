"use client"; // Mark this component as a Client Component

import { useState,useEffect } from "react";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from "@/utils/PersistLogin";
import { search } from "@/lib/data";

type TitleKey = "PROFESSEUR" | "PROFESSEUR_TRONC_COMMUN" | "MAITRE_ASSISTANT" | "MAITRE_DES_CONFERENCES"|"ASSISTANT"|"CONTRACTUEL";

const titleTable: Record<TitleKey, string> = {
  "PROFESSEUR": "professeur",
  "PROFESSEUR_TRONC_COMMUN": "professeur tronc commun",
  "MAITRE_ASSISTANT": "maitre assistant",
  "MAITRE_DES_CONFERENCES": "maitre des conferences",
  "ASSISTANT": "assistant",
  "CONTRACTUEL": "contractuel"
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Surveillant ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Titre",
    accessor: "titre",
    className: "hidden md:table-cell",
  },
  {
    header: "Id de département",
    accessor: "departmentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const keys= [
  "teacher_id",
  "department_id",
  "title",
  "user.name",
  "user.email"
];

const TeacherListPage = ({searchParams}:{searchParams?:{[key:string]:string}}) => {
  const { page, ...queryParams } = searchParams || {};
  const currentPage = page ? parseInt(page) : 1
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const totalSupervisors = JSON.parse(sessionStorage.getItem('totalSupervisors') || '0')

  useEffect(() => {
    const controller = new AbortController();

    const getSupervisors = async () => {
        try {
            const [response1, response2] = await Promise.all([
              axiosPrivate.get('/supervisors/getAllSupervisors/'+currentPage,{signal: controller.signal}), // Première API
              axiosPrivate.get("/supervisors/auto-generate",{signal: controller.signal}), // Deuxième API
            ]);
            console.log(response1.data);
            if (response1.status === 200) {
              setSupervisors(response1.data); 
            }
            
        } catch (err: any) {
          console.log(err);
          if (err.name !== "CanceledError") {
            console.error("Erreur lors de la récupération des surveillants:", err);
            router.push('/sign-in');
        }
          }
    }

    getSupervisors();

    return () => {
        controller.abort();
    }
}, [axiosPrivate, router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSupervisors(supervisors);
    } else {
      const results = search(supervisors, searchQuery,keys);
      setFilteredSupervisors(results);
    }
  }, [searchQuery, supervisors]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderRow = (item: any) => (
    <tr
      key={item.teacher_id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src="/pfp.jpg"
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.user.name}</h3>
          <p className="text-xs text-gray-500">{item.user.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacher_id}</td>
      <td className="hidden md:table-cell">{titleTable[item.title as TitleKey]}</td>
      <td className="hidden md:table-cell">{item.department_id}</td>
      <td>
        <div className="flex items-center gap-2">
              <FormModal table="surveillant" type="assign" id={item.teacher_id}/>
              <FormModal table="surveillant" type="view" data={item} id={item.teacher_id} />
        </div>
      </td>
    </tr>
  );


  return (
    <PersistLogin>
      <RequireAuth requiredRole="ADMIN">
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">Enseignants </h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto  ">
              <TableSearch onSearch={handleSearch} />
              <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                  <Image src="/filter.png" alt="" width={14} height={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                  <Image src="/sort.png" alt="" width={14} height={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-10">
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={filteredSupervisors} />
            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              count ={totalSupervisors}
            />
          </div>
        </div>
    </RequireAuth>
    </PersistLogin>
  );
};

export default TeacherListPage;