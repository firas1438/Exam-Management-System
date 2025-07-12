"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState,useEffect } from "react";
import { useRouter } from 'next/navigation';
import { CoefficientKey,coefTable,durationTable,DurationKey} from '@/lib/data';
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";


// Schéma pour la création
const createSchema = z.object({
  examen: z.string().min(1, { message: "Examen est requis!" }),
  duration: z.string().min(1, { message: "Durée est requis!" }),
  date: z.string().min(1, { message: "Date est requis!" }),
});

// Schéma pour la mise à jour
const updateSchema = z.object({
  date: z.string().min(1, { message: "Date est requis!" }),
});

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

interface Subject {
  name: string,
  coefficient: string,
  subject_id:number,
  department_id:number,
  filiere_name:string
}

const ExamForm = ({type,data,id,addExam,updateExam,handleClose,session}: {
  type: "create" | "update";
  data?: any;
  id?: number;
  addExam ? :(id: number) => void;
  updateExam?: (updatedExam: any)=>void
  handleClose : ()=>void
  session: any
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInputs | UpdateInputs>({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
  });
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedCoefficient, setSelectedCoefficient] = useState<number | null>(null)
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const {auth} = useAuth()

  
  const getSubjects= async (controller:AbortController) => {
      try {
          const response = await axiosPrivate.get('/subjects/getAllSubjects', {
              signal: controller.signal
          });
          console.log(response.data);
          if (response.status === 200) {
            setSubjects(response.data); 
          }   
      } catch (err: any) {
        console.log(err);
        if (err.name !== "CanceledError") {
          console.error("Erreur lors de la récupération des matiéres:", err);
          router.push('/sign-in');
      }
        }
  }

  useEffect(() => {
    const controller = new AbortController();
    if(type === "create"){
      getSubjects(controller);
    }

    return () => {
        controller.abort();
    }
}, [axiosPrivate, router,type])

const handleExamenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedSubject = subjects.find(subject => subject.subject_id === Number(event.target.value));
  setSelectedCoefficient(selectedSubject ? coefTable[selectedSubject.coefficient  as CoefficientKey] : null);
};

  const __addExam = handleSubmit(async (formData) => {
    // Trouver la clé correspondant à la durée sélectionnée
    const selectedDurationKey = (Object.keys(durationTable) as DurationKey[]).find(key => durationTable[key] === Number((formData as CreateInputs).duration));
    const controller = new AbortController();


    try {
      console.log(session,"muchachos")
      const response = await axiosPrivate.post('/exams/createExam/', 
      {
        subject_id: (formData as CreateInputs).examen,
        duration: selectedDurationKey,
        exam_date:  (formData as CreateInputs).date,
        email: auth.email,
        session: session
      },
      {
        signal: controller.signal,
      }
    );
    
      console.log(response.data);
      if (response.status === 201) {
        const newExam = await axiosPrivate.get('/exams/getExamById/'+response.data.exam_id, {
          signal: controller.signal
      });
      console.log(response.data);
      if (newExam.status === 200) {
        setSubjects(response.data); 
      }   
        addExam && addExam(newExam.data)
        handleClose()
        toast.success("Examen ajouté avec succès");
      }

  } catch (err: any) {
    console.log(err);
    if (err.name !== "CanceledError") {
       if ([409, 404, 400].includes(err.response?.status)) {
        toast.error(err.response.data.error);
      }
      else{
        console.error("Erreur lors de la récupération des examens:", err);        
        toast.error(" Erreur lors de l'ajout' de l'examen");
      } 

  }
  }});


  const __updateExam = handleSubmit(async (formData) => {
    const inpuForm = formData as UpdateInputs;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put('/exams/updateExam/'+data.exam_id, 
      {
        exam_date: inpuForm.date,
        session: session,
        subject_id: data.subject.subject_id,

      },
      {
        signal: controller.signal,
      }
    );
      if (response.status === 201) {
        toast.success("Examen modifié avec succès");
        console.log(response.data);
        updateExam && updateExam(response.data)
        handleClose()
      }
      else if (response.status===404 ||response.status===404 ){
        toast.error(response.data.error)
      } 

    } catch (err: any) {
      console.log(err);
      if (err.name !== "CanceledError") {
        if(err.response?.status === 409){
          toast.error(err.response.data.error)
        }
        else{
          console.error("Erreur lors de la mise à jour de l'examen:", err);        
          toast.error("❌ Erreur lors de la mise à jour de l'examen: ");}
        }

      }
  });

  return (
    <>

      {/* CREATE FORM */}
      {type === "create" && (
        <form className="flex flex-col gap-8 p-3" onSubmit={__addExam}>
          {/* TITRE */}
          <h1 className="text-xl font-semibold text-center">Créer un nouveau examen</h1>

          {/* CONTENU */}
          <div className="flex justify-between flex-wrap gap-4">

            <div className="flex gap-4 w-full">

              {/* Matière Field (Dropdown list) */}
              <div className="flex flex-col gap-2 w-3/4">
                <label className="text-xs text-gray-500">Examen</label>
                <select
                  {...register("examen")} // Register the examen field
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  onChange={handleExamenChange}
                >
                  <option value="">Sélectionnez un examen</option>
                  {
                    subjects && subjects.map((matiere) => (
                      <option key={matiere.subject_id} value={matiere.subject_id}>
                        {matiere.name+" : "+matiere.filiere_name}
                      </option>
                    ))
                  }
                </select>
                {type === "create" && (errors as FieldErrors<CreateInputs>).examen && (
                  <span className="text-red-500 text-xs">{(errors as FieldErrors<CreateInputs>).examen?.message}</span>
                )}
              </div>

                {/* Coefficient Field */}
                <div className="flex flex-col gap-2 w-1/4">
                  <label className="text-xs text-gray-500">Coefficient</label>
                  <input
                    type="number"
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                    value={selectedCoefficient !== null ? selectedCoefficient : ""}
                    readOnly
                  />
                </div>

            </div>

            {/* Durée Field (Dropdown) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Durée</label>
              <select
                {...register("duration")} // Register the duration field
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              >
                <option value="">Sélectionnez une durée</option>
                <option value="1">1h</option>
                <option value="1.5">1.5h</option>
                <option value="2">2h</option>
              </select>
              {type === "create" && (errors as FieldErrors<CreateInputs>).duration && (
                <span className="text-red-500 text-xs">{(errors as FieldErrors<CreateInputs>).duration?.message}</span>
              )}
            </div>


            {/* Date Field */}
            <InputField
              label="Date"
              name="date"
              type="date"
              register={register}
              error={errors?.date}
            />
          </div>

          {/* BUTTON CREER */}
          <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-400 transition-colors">
            Créer
          </button>
        </form>
      )}
      

      {/* UPDATE FORM */}
      {type === "update" && (
        <form className="flex flex-col gap-8 p-3" onSubmit={__updateExam}>
          {/* TITRE */}
          <h1 className="text-xl font-semibold text-center">Modifier un examen</h1>

          {/* CONTENU */}
          <div className="flex justify-between flex-wrap gap-4">
            {/* Matière and Coefficient Fields */}
            <div className="flex gap-4 w-full">
              {/* Matière Field (Locked Text Field) */}
              <div className="flex flex-col gap-2 w-3/4">
                <label className="text-xs text-gray-500">Examen</label>
                <input
                  type="text"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                  value={data && data.subject.name}
                />
              </div>

              {/* Coefficient Field (Locked) */}
              <div className="flex flex-col gap-2 w-1/4">
                <label className="text-xs text-gray-500">Coefficient</label>
                <input
                  type="number"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                  value={data && coefTable[data.subject.coefficient as CoefficientKey]}
                />
              </div>
            </div>

            {/* Durée Field (Locked Text Field) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Durée</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                readOnly
                value={data && durationTable[data.duration as DurationKey]+"h"}
              />
            </div>

            {/* Date Field */}
            <InputField
              label="Date"
              name="date"
              type="date"
              register={register}
              error={errors?.date}
            />

          </div>
          <button className="bg-blue-500 text-white text-base p-2 rounded-md hover:bg-blue-400 transition-colors" >
            Modifier
          </button>
        </form>
      )}
    </>
  );
};

export default ExamForm;