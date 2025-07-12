"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Table from "../Table";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState,useEffect } from "react";
import { CoefficientKey, coefTable, DurationKey, durationTable } from "@/lib/data";
import { toast } from "react-toastify";

const schema = z.object({
  examen: z.string().min(1, { message: "Examen est requis!" }),
  salle: z.string(),
  date: z.string(),
  duration: z.string(), 
  debut: z.string(),
  fin: z.string(),
});

type Inputs = z.infer<typeof schema>;


const SurveillantForm = ({type,data,id,handleClose}: {
  type: "assign" | "view";
  data?: any;
  id?: number;
  handleClose : ()=>void
}) => {
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [exam, setexam] = useState<any | null>(null)
  const [exams, setExams] = useState<any[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const __fetchExamsBySupervisorId=async(controller:AbortController)=>{
    try {
      const response = await axiosPrivate.get('/exams/getExamsBySupervisorId/'+id, {
        signal: controller.signal
      });
      if(response.status === 200){
        console.log(response.data)
        setExams(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleExamenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedExam = exams.find(subject => subject.exam_id === Number(event.target.value));
    if (selectedExam) {
      console.log(selectedExam)
      // Créer une nouvelle copie de l'exam avec les valeurs transformées
      const transformedExam = {
        ...selectedExam,
        exam: {
          ...selectedExam.exam,
          duration: durationTable[selectedExam.exam.duration as DurationKey],
          subject:{
          ...selectedExam.exam.subject,
          coefficient: coefTable[selectedExam.exam.subject.coefficient as CoefficientKey]
          }
        },
      };
      setexam(transformedExam);
    }
  };

  const __fetchAssignedExams=async(controller:AbortController)=>{
    try {
      const response = await axiosPrivate.get('/exams/getAllAssignedExams', {
        signal: controller.signal
      });
      if(response.status === 200){
        console.log(response.data);
        setExams(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    if(type === "view"){
      __fetchExamsBySupervisorId(controller);
    }
    if(type === "assign"){
      __fetchAssignedExams(controller)
    }
    return () => {
      controller.abort();
  }
  }, [type, id])

  const onSubmit = handleSubmit(async (data) => {
    const exam_id= data.examen;
    const supervisor_id=id;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put('/supervisors/adjust',
        {
          exam_id: exam_id,
          new_teacher_id: supervisor_id
        },
        {
          signal: controller.signal,
        }
      );
      if(response.status === 200){
        toast.success("Surveillant attribué avec succès!");
        setExams(response.data);
        handleClose()
      }

    }catch (error: any) {
      console.log(error);
      if (error.name !== "CanceledError") {
        if (error.response?.status === 400){
          toast.error(error.response.data.error);
        }
        else {
        console.error("Erreur lors de l'affectation de l'enseignant:", error);        
        toast.error("Erreur lors de la mise à jour de l'examen: ");
        }
      }
    }

  });

  
  // Define columns for the table
  const columns = [
    { header: "Examen", accessor: "examen", className: "text-center" },
    { header: "Filière",accessor: "filiere_name", className: "text-center"},
    { header: "Salle", accessor: "salle", className: "text-center" },
    { header: "Date", accessor: "date", className: "text-center" },
    { header: "Durée", accessor: "duration", className: "text-center" },
    { header: "Début", accessor: "debut", className: "text-center" },
    { header: "Fin", accessor: "fin", className: "text-center" },
  ];
  

  return (
    <>


      {/* ASSIGN FORM */}
      {type === "assign" && (
          <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
          {/* TITRE */}
          <h1 className="text-lg font-semibold text-center">Assigner un surveillant</h1>
        
          {/* CONTENU */}
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex gap-4 w-full">
              {/* Matière Field (Dropdown list) */}
              <div className="flex flex-col gap-2 w-3/4">
                <label className="text-xs text-gray-500">Examen</label>
                <select
                  {...register("examen")}
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  onChange={handleExamenChange}
                >
                  <option value="">Sélectionnez un examen</option>
                  {
                    exams && exams.map((exam) => (
                      <option key={exam.exam_id} value={exam.exam_id}>
                        {exam.exam.subject.name+" : "+exam.exam.subject.filiere_name}
                      </option>
                    ))
                  }
                </select>
                {errors.examen && (
                  <span className="text-red-500 text-xs">{errors.examen.message}</span>
                )}
              </div>
        
              {/* Coefficient Field */}
              <div className="flex flex-col gap-2 w-1/4">
                <label className="text-xs text-gray-500">Coefficient</label>
                <input
                  type="number"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                  value={exam!== null ? exam.exam.subject.coefficient:""}
                />
              </div>
            </div>

            {/* Salle Field (Locked) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Salle</label>
              <input
                {...register("salle")}
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                readOnly
                value={exam!== null ? exam.room.room_name:""}

              />
            </div>
        
            {/* Date Field (Locked, type: date) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Date</label>
              <input
                {...register("date")}
                type="date"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                readOnly
                value={exam!== null ? exam.exam.exam_date.slice(0, 10):""}
                
              />
            </div>
        
            {/* Durée Field (Locked) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Durée</label>
              <input
                {...register("duration")}
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                readOnly
                value={exam!== null ? exam.exam.duration+"h":""}

              />
            </div>
        
            <div className="flex gap-4 w-full">

              {/* Debut Field (Locked, type: time) */}
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-xs text-gray-500">Début</label>
                <input
                  {...register("debut")}
                  type="text"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                  value={exam!== null ? exam.start_time.slice(11,16):""}
                />
              </div>


              {/* Fin Field (Locked, type: time) */}
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-xs text-gray-500">Fin</label>
                <input
                  {...register("fin")}
                  type="text"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                  value={exam!== null ? exam.end_time.slice(11,16):""}

                />
              </div>

            </div>
          </div>
        
          {/* BUTTON RESERVER */}
          <button className="bg-blue-500 text-white text-base p-2 rounded-md hover:bg-blue-400 transition-colors">
            Assigner
          </button>
        </form>
      )}

      {/* VIEW FORM */}
      {type === "view" && (
         <div className="flex flex-col  mt-3">
            {/* TITRE */}
            <h1 className="text-lg font-semibold text-center">Liste de surveillance d'enseignant</h1>
        
            {/* CONTENU */}
            <div className="overflow-y-auto max-h-[400px]">
            <Table
              columns={columns}
              data={exams}
              renderRow={(item) => (
                <tr key={item.exam_id} className="border-b border-gray-200 odd:bg-slate-50 text-sm hover:bg-lamaPurpleLight text-center">
                  <td className="p-4">{item.exam.subject.name}</td>
                  <td className="p-4">{item.exam.subject.filiere_name}</td>
                  <td className="p-4">{item.room.room_name}</td>
                  <td className="p-4">{item.exam.exam_date.slice(0,10)}</td>
                  <td className="p-4">{durationTable[item.exam.duration as DurationKey]}h</td>
                  <td className="p-4">{item.start_time.slice(11,16)}</td>
                  <td className="p-4">{item.end_time.slice(11,16)}</td>
                </tr>
              )}
            />
          </div>

         </div>
          
      )} 

    </>
  );
};

export default SurveillantForm;