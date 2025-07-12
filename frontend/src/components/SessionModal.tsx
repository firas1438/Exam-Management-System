"use client";

import Image from "next/image";
import React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

{/* ============================================= ZOD VALIDATION =============================================*/}
const sessionSchema = z.object({
  sessionType: z.string(),
  startDate: z.string()
    .min(1, "La date de début est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  endDate: z.string()
    .min(1, "La date de fin est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")
})
.refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: "La date de fin doit être postérieure à la date de début", 
  path: ["endDate"],
})
.refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
  return diffInDays >= 7 && diffInDays <= 21; // 1-3 weeks
}, {
  message: "La durée de la session doit être entre 1 et 3 semaines",
  path: ["endDate"],
})
.refine(data => {
  const today = new Date();
  const start = new Date(data.startDate);
  const diffInDays = (start.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return diffInDays >= 14; // At least 2 weeks
}, {
  message: "La session doit commencer au moins 2 semaines après aujourd'hui",
  path: ["startDate"],
});

type SessionFormData = z.infer<typeof sessionSchema>;

{/* ==================== INTERFACE POUR DECLARER LES TYPES DE PROPS (TYPESCSRIPT OBLIGE) ======================*/}
interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  session: SessionFormData;
  onSave: (updatedSession: SessionFormData) => void;
}

function SessionModal({ open, onClose, session, onSave }: SessionModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema), 
    defaultValues: session
  });

{/* ==================== cette méthode va appliquer la méthode réçu dans les props  ======================*/}
  const onSubmit = (data: SessionFormData) => { 
    onSave(data); 
    onClose(); 
  };

  return (
    <>
    {/* ====================  MODAL DE MODIFICATION DE SESSION ======================*/}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md relative w-[80%] lg:w-[70%] xl:w-[50%]">
            <h2 className="text-lg font-semibold mb-6 text-center">Modifier la session</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="sessionType" className="block text-sm mb-2">Type session</label>
                  <select id="sessionType" {...register("sessionType")} 
                    className={`border p-2.5 rounded w-full text-sm ${errors.sessionType ? "border-red-500" : ""}`}>
                    <option value="DS1">DS1</option>
                    <option value="EX1">EX1</option>
                    <option value="DS2">DS2</option>
                    <option value="EX2">EX2</option>
                    <option value="CONTROLE">CONTROLE</option>
                  </select>
                  {errors.sessionType && <p className="text-red-500 text-xs mt-1">{errors.sessionType.message}</p>}
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm mb-2">Date début</label>
                  <input 
                    type="date" 
                    id="startDate" 
                    {...register("startDate")}
                    className={`border p-2 rounded w-full text-sm ${errors.startDate ? "border-red-500" : ""}`}
                  />
                  {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm mb-2">Date fin</label>
                  <input 
                    type="date" 
                    id="endDate" 
                    {...register("endDate")} 
                    className={`border p-2 rounded w-full text-sm mb-4 ${errors.endDate ? "border-red-500" : ""}`}
                  />
                  {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-400 transition-colors mb-2">
                  Appliquer
                </button>
              </div>
            </form>

            {/* Bouton de fermeture */}
            <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SessionModal;