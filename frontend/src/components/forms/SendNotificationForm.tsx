"use client";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';

const notificationSchema = z.object({
  type: z.string().min(1, "Le type de session est requis"),
  recipient: z.string().min(1, "Le destinataire est requis")
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export default function SendNotificationForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void;}) {

  // Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema)
  });
  const {auth} = useAuth()
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async(data: NotificationFormData) => {
    const controller = new AbortController();
    try{
      
      const {type,recipient}=data
      const response=await axiosPrivate.post('/notifications',      {
        type: type,
        recipient: recipient,
        msg: "Notification de test envoyé à "+recipient+" par "+auth?.email,
      },
      {
        signal: controller.signal,
      })
      if (response.status === 200) {
        toast.success('notification envoyée avec succées');
        reset(); //Resets form state 
        onClose(); // Close the form
        onSuccess(); // Close the notification box
      } else {
        toast.error(`Erreur de l'envoi de  notification`);
      }

    }catch(err: any){
      toast.error(err.response.data.error)
    }
    finally{
      controller.abort()
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <h3 className="font-medium mb-6">Envoyer une notification</h3> 
      
      {/* Type de notification */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type de notification
        </label>
        <select
          {...register("type")}
          className="w-full p-2 text-xs border border-gray-300 rounded-md"
        >
          <option value="">Sélectionner une option</option>
          <option value="VALIDATION">Validation</option>
          <option value="RAPPEL">Rappel</option>
        </select>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
      </div>

      {/* Destinataire */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destinataire
        </label>
        <select
          {...register("recipient")}
          className="w-full p-2 text-xs border border-gray-300 rounded-md"
        >
          <option value="">Sélectionner une option</option>
          <option value="DIRECTEUR">Directeur des études</option>
          <option value="CHEF">Chefs de départments</option>
        </select>
        {errors.recipient && <p className="text-red-500 text-xs mt-1">{errors.recipient.message}</p>}
      </div>

      <div className="flex gap-2">
        
        {/*Button annuler */}
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Annuler
        </button>

        {/*Button envoyer */}
        <button
          type="submit"
          className="flex-1 py-2 text-xs font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Envoyer
        </button>

      </div>
    </form>
  );
}