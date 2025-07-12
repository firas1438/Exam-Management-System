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

const columns = [
  {
    header: "Room ID",
    accessor: "id",
  },
  {
    header: "Nom de la salle",
    accessor: "name",
  },
  {
    header: "Emplacement",
    accessor: "location",
    className: "hidden md:table-cell",
  },
  {
    header: "Capacité",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Disponibilité",
    accessor: "disponibility",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
const keys= [
  "room_id",
  "room_name",
  "location",
  "capacity",
];

const ClassListPage = ({searchParams}:{searchParams?:{[key:string]:string}}) => {
  //récuperer la page courante :
  const { page, ...queryParams } = searchParams || {};
  // par default la prémiere page est égale à 1 :
  const currentPage = page ? parseInt(page) : 1

  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const totalRooms = JSON.parse(sessionStorage.getItem('totalRooms') || '0')

    useEffect(() => {
      const controller = new AbortController();
  
      const getRooms = async () => {
          try {
              const response = await axiosPrivate.get('/rooms/getAllRooms/'+currentPage, {
                  signal: controller.signal
              });
              console.log(response.data);
              if (response.status === 200) {
                setRooms(response.data); 
              }
              
          } catch (err: any) {
            console.log(err);
            if (err.name !== "CanceledError") {
              console.error("Erreur lors de la récupération des salles:", err);
              router.push('/sign-in');
          }
            }
      }
  
      getRooms();
  
      return () => {
          controller.abort();
      }
  }, [axiosPrivate, router,page])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRooms(rooms);
    } else {
      const results = search(rooms, searchQuery,keys);
      setFilteredRooms(results);
    }
  }, [searchQuery, rooms]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderRow = (item: any) => (
    <tr
      key={item.room_id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.room_id}</td>
      <td>{item.room_name}</td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.is_available === true ? "Disponible" : "Indisponible"}</td>
      <td>
        <div className="flex items-center gap-2">
              <FormModal table="salle" type="reserve" id={item.room_id}  />
              <FormModal table="salle" type="view" data={item} id={item.room_id} />
        </div>
      </td>
    </tr>
  );



  return (
    <PersistLogin>
      <RequireAuth requiredRole="ADMIN">
 
        <div className="bg-white p-5 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">Salles</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
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
            <Table columns={columns} renderRow={renderRow} data={filteredRooms} />
            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              count ={totalRooms}
            />
          </div>
        </div>
      </RequireAuth>
    </PersistLogin>

  );
};

export default ClassListPage;