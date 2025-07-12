import React, { useState } from "react";
import SessionModal from "./SessionModal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { toast } from "react-toastify";
import Countdown from "./Countdown";


const sessionSchema = z.object({
  sessionType: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: "La date de fin doit être postérieure à la date de début", 
  path: ["endDate"],
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
  return diffInDays >= 7 && diffInDays <= 21;
}, {
  message: "La durée de la session doit être entre 1 et 3 semaines",
  path: ["endDate"],
}).refine(data => {
  const today = new Date();
  const start = new Date(data.startDate);
  const diffInDays = (start.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return diffInDays >= 14;
}, {
  message: "La session doit commencer au moins 2 semaines après la date actuelle",
  path: ["startDate"],
});


export type SessionType = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  session: any | null;
  onSessionCreated?: (session: any) => void;
}

const Session: React.FC<SessionFormProps> = ({ session, onSessionCreated }) => {
  const { register, handleSubmit: handleFormSubmit, formState: { errors } } = useForm<SessionType>({
    resolver: zodResolver(sessionSchema), 
    defaultValues: session || undefined
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const axiosPrivate = useAxiosPrivate();


  const handleSaveSession = (updatedSession: SessionType) => {
    console.log("Updated session:", updatedSession);

  };

  const handleSubmit = async(data: SessionType) => {
    console.log("Form data:", data);
    const abortController = new AbortController()
    try {
      const response = await axiosPrivate.post('/sessions', data, {
        signal: abortController.signal
      });
      if(response.status === 201) {
        toast.success("La session a été créée avec succès!", {
          className: "bg-white text-black",
        });
        if (onSessionCreated) {
          onSessionCreated(response.data);
        }
      }
    } catch(err:any) {
      if (err.name !== "CanceledError") {
        toast.error(err.response.data.error, {
          className: "bg-white text-black",
        });        
      }
    }
  };

  return (
    <div>
      {!session ? (
        <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4 mb-10">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="sessionType" className="block text-sm mb-2">Type session</label>
              <select 
                id="sessionType" 
                {...register("sessionType")} 
                className={`border p-2.5 rounded w-full text-sm ${errors.sessionType ? "border-red-500" : ""}`}
              >
                <option value="DS1">DS1</option>
                <option value="EX1">EX1</option>
                <option value="DS2">DS2</option>
                <option value="EX2">EX2</option>
                <option value="CONTROLE">CONTROLE</option>
              </select>
              {errors.sessionType && <p className="text-red-500 text-xs mt-1">{errors.sessionType.message}</p>}
            </div>

            <div className="flex-1 mb-1">
              <label htmlFor="startDate" className="block text-sm mb-2">Date début</label>
              <input
                type="date"
                id="startDate"
                {...register("startDate")}
                className={`border p-2 rounded w-full text-sm ${errors.startDate ? "border-red-500" : ""}`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
            </div>

            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm mb-2">Date fin</label>
              <input
                type="date"
                id="endDate"
                {...register("endDate")}
                className={`border p-2 rounded w-full text-sm ${errors.endDate ? "border-red-500" : ""}`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
            </div>

            <div className="flex-1">
              <button 
                type="submit" 
                className="inline-flex items-center justify-center gap-4 rounded w-full bg-[#f9e17c] mt-7 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-sm transition duration-150 ease-in-out hover:bg-[#e6d06b] focus:bg-[#f9e17c] active:bg-[#d9bc5f]"
              >
                <img src="/session.png" alt="Session Icon" className="w-5 h-5"/>
                Créer session
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 mb-4">
            <label className="block text-sm mb-2">Type session:</label>
            <input 
              type="text" 
              value={session.session_type} 
              readOnly 
              className="border p-2 rounded bg-gray-200 w-full text-sm"
            />
          </div>

          <div className="flex-1 mb-4">
            <label className="block text-sm mb-2">Date début:</label>
            <input 
              type="text" 
              value={session.date_debut.slice(0,10)} 
              readOnly 
              className="border p-2 rounded bg-gray-200 w-full text-sm"
            />
          </div>

          <div className="flex-1 mb-4">
            <label className="block text-sm mb-2">Date fin:</label>
            <input 
              type="text" 
              value={session.date_fin.slice(0,10)} 
              readOnly 
              className="border p-2 rounded bg-gray-200 w-full text-sm"
            />
          </div>

          <div className="flex-1 mb-4 pl-6">
            <label className="block text-sm ">Temps restant:</label>
            <Countdown date_debut={session.date_debut.slice(0,10)} />
          </div>

          

          {/* <div className="flex-1">
            <button 
              type="button" 
              onClick={handleOpenModal}
              className="inline-flex items-center justify-center gap-4 rounded w-full bg-[#f9e17c] mt-7 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-sm transition duration-150 ease-in-out hover:bg-[#e6d06b] focus:bg-[#f9e17c] active:bg-[#d9bc5f]"
            >
              <img src="/edit.png" alt="Modifier Icon" className="w-5 h-5"/>
              Modifier
            </button>
            <SessionModal 
              open={isModalOpen} 
              onClose={handleCloseModal} 
              session={session} 
              onSave={handleSaveSession}
            />
          </div> */}

        </div>
      )}
    </div>
  );
};

export default Session;