"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Table from "../Table"; // Import the Table component
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {CoefficientKey, coefTable, DurationKey,durationTable } from '@/lib/data';
import { toast } from "react-toastify";

const schema = z.object({
  examen: z.string().min(1, { message: "Examen est requis!" }),
  date: z.string(),
  debut: z.string().min(1, { message: "Temps du début d'examen est requis!" }),
  fin: z.string(),
  duration: z.string(),
});

type Inputs = z.infer<typeof schema>;

const RoomReservationForm = ({ type, data, id,handleClose }: {
  type: "reserve" | "view";
  data?: any; 
  id?: number;
  handleClose : ()=>void
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [exams, setExams] = useState<any[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const [exam, setexam] = useState<any | null>(null)

  const debut = watch("debut");
  const duration = watch("duration");

  const __fetchExamsByRoomId=async(controller:AbortController)=>{
    try {
      const response = await axiosPrivate.get('/exams/getExamsByRoomId/'+id, {
        signal: controller.signal
      });
      if(response.status === 200){
        setExams(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const __fetchNotReservedExams=async(controller:AbortController)=>{
    try {
      const response = await axiosPrivate.get('/exams/getNotReservedExams', {
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
      __fetchExamsByRoomId(controller);
    }
    if(type === "reserve"){
      __fetchNotReservedExams(controller)
    }
    return () => {
      controller.abort();
  }
  }, [type, id])

  useEffect(() => {
    if (debut && duration) {
      const finTime = calculateFinTime(debut, duration);
      setValue("fin", finTime);
    }
  }, [debut, duration, setValue]);

  const calculateFinTime = (debut: string, duration: string): string => {
    const durationValue = parseFloat(duration);
    // Convert the duration to minutes
    const durationInMinutes = durationValue * 60;
  
    // Split the debut time into hours and minutes
    const [debutHours, debutMinutes] = debut.split(':').map(Number);
  
    // Convert the debut time to total minutes since midnight
    const debutInMinutes = debutHours * 60 + debutMinutes;
  
    // Calculate the fin time in total minutes since midnight
    const finInMinutes = debutInMinutes + durationInMinutes;
  
    // Convert the fin time back to HH:MM format
    const finHours = Math.floor(finInMinutes / 60) % 24; // Ensure it wraps around if necessary
    const finMinutes = finInMinutes % 60;
  
    // Format the fin time to always show two digits for hours and minutes
    const formattedFinHours = String(finHours).padStart(2, '0');
    const formattedFinMinutes = String(finMinutes).padStart(2, '0');
  
    return `${formattedFinHours}:${formattedFinMinutes}`;
};

const handleExamenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedExam = exams.find(subject => subject.exam_id === Number(event.target.value));
  if (selectedExam) {
    // Créer une nouvelle copie de l'exam avec les valeurs transformées
    const transformedExam = {
      ...selectedExam,
      subject: {
        ...selectedExam.subject,
        coefficient: coefTable[selectedExam.subject.coefficient as CoefficientKey]
      },
      duration: durationTable[selectedExam.duration as DurationKey] // Conversion de la durée en nombre
    };

    // Mettre à jour les valeurs du formulaire
    setValue("duration", transformedExam.duration.toString()); // Stocker la valeur numérique
    setValue("date", transformedExam.exam_date.slice(0, 10));
    setexam(transformedExam);
  }
};


  const onSubmit = handleSubmit(async(data) => {
    const exam_id = data.examen;
    const start_time = data.debut;
    const end_time = data.fin;
    const room_id = id;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post('/rooms/reserveRoom', 
      {
        exam_id: exam_id,
        room_id: room_id,
        start_time:  start_time,
        end_time:end_time
      },
      {
        signal: controller.signal,
      }
    );    
      if (response.status === 201) {
        toast.success("Salle réservée avec succès");
        handleClose()
      }
      
  } catch (err: any) {
    console.log(err);
    if (err.name !== "CanceledError") {
        if (err.response.status === 409) {
      toast.error(""+err.response.data.error);
        }
    
      else{
        toast.error("❌ Opération annulée");
      }
    }
  }
  });

  // Define columns for the table
  const columns = [
    { header: "Examen", accessor: "examen", className: "text-center" },
    { header: "Filière",accessor: "filiere_name", className: "text-center"},
    { header: "Date", accessor: "date", className: "text-center" },
    { header: "Durée", accessor: "duration", className: "text-center" },
    { header: "Début", accessor: "debut", className: "text-center" },
    { header: "Fin", accessor: "fin", className: "text-center" },
  ];
  

  return (
    <>
      {/* RESERVE FORM */}
      {type === "reserve" && (
        <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
          {/* TITRE */}
          <h1 className="text-lg font-semibold text-center">Réserver une salle</h1>

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
                        {exam.subject.name+" : "+exam.subject.filiere_name}
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
                  value={exam!== null ? exam.subject.coefficient:""}
                />
              </div>
            </div>

            {/* Date Field (Locked, type: date) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Date</label>
              <input
                {...register("date")}
                type="date"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                readOnly
                value={exam!== null ? exam.exam_date.slice(0,10) :""}
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
                value={exam?.duration ? `${exam.duration}h` : ""}
              />
            </div>

            <div className="flex gap-4 w-full">
              {/* Début Field (Editable, type: time) */}
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-xs text-gray-500">Début</label>
                <input
                  {...register("debut")}
                  type="time"
                  step="1800"
                  min="08:00"
                  max="15:00" 
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                />
                {errors.debut && (
                  <span className="text-red-500 text-xs">{errors.debut.message}</span>
                )}
              </div>

              {/* Fin Field (Locked, type: time) */}
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-xs text-gray-500">Fin</label>
                <input
                  {...register("fin")}
                  type="time"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* BUTTON RESERVER */}
          <button className="bg-blue-500 text-white text-base p-2 rounded-md hover:bg-blue-400 transition-colors">
            Réserver
          </button>
        </form>
      )}

      {/* VIEW FORM */}
      {type === "view" && (
        <div className="flex flex-col mt-3">
          {/* TITRE */}
          <h1 className="text-lg font-semibold text-center">Liste des réservations du salle</h1>

          {/* CONTENU */}
          <div className="overflow-y-auto max-h-[400px]">
            <Table
              columns={columns}
              data={exams}
              renderRow={(item) => (
                <tr key={item.exam_id} className="border-b border-gray-200 odd:bg-slate-50 text-sm hover:bg-lamaPurpleLight text-center">
                  <td className="p-4">{item.exam.subject.name}</td>
                  <td className="p-4">{item.exam.subject.filiere_name}</td>
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

export default RoomReservationForm;