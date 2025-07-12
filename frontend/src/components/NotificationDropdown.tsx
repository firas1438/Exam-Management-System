"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import SendNotificationForm from './forms/SendNotificationForm';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export default function NotificationDropdown() {
  const {auth} = useAuth()
  const axiosPrivate = useAxiosPrivate();
  {/* Notification box */}
  const [isOpen, setIsOpen] = useState(false);

  {/* Listener lors du click lbara mel notification box */}
  const dropdownRef = useRef<HTMLDivElement>(null);

  {/* Form (envoyer notification) */}
  const [showSendForm, setShowSendForm] = useState(false);


  
  {/* Exemple de notifications */}
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: string; read: boolean }[]>([]);

  const loadNotifications = async () => {
    const controller = new AbortController();
    try {
      const response=await axiosPrivate.get('/notifications/'+ auth.email, {
        signal: controller.signal,
      })
      if (response.status === 200) {
        setNotifications(response.data.map((n: { notification_id: string; message: string; created_at: string; notification_status: string }) => ({
          id: n.notification_id,
          message: n.message,
          time: new Date(n.created_at).toLocaleDateString(),
          read: n.notification_status === 'ENVOYEE' ? false : true,
        })));
      }

    } catch (error:any) {
      toast.error(error.response.data.error)
    } finally {
      controller.abort();
    }
  };

  {/* Nombre de notifications non lu */}
  const unreadCount = notifications.filter(n => !n.read).length;
  {/* Si nombre de notifications non lu yfout 100 afficher "99+" sinon afficher nombre de notifications non lu */}
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  {/*Close notification box when you click outside */}
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSendForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 2*60*1000);
    return () => clearInterval(interval);
  },[])
  
   {/* Marquer un seul notifications comme lu lors du click sur le souris */}
  const markAsRead =async (id: string) => {
    const controller = new AbortController();
    try{
      const response=await axiosPrivate.post('/notifications/mark-as-read', { notification_id: parseInt(id), email: auth.email })
      if (response.status === 200) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ));
      }
    }catch(error:any){
      toast.error(error.response.data.error);
    }
    finally {
      controller.abort();
    }
  };

   {/* Marquer tous les notifications comme lu */}
  const markAllAsRead = async () => {
    const controller = new AbortController();
    try{
      const response=await axiosPrivate.post('/notifications/mark-all-as-read', { email: auth.email })
      if (response.status === 200) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    }catch(error:any){
      toast.error(error.response.data.error);
    }
    finally {
      controller.abort();
    }
    
  };

   {/* Effacer tous les notifications */}
  const clearAllNotifications =async () => {
    const controller = new AbortController();
    try{
      const response=await axiosPrivate.post('/notifications/mark-all-as-read', { email: auth.email })
      if (response.status === 200) {
        console.log("biz9i9i")
        setNotifications([]);
      }
    }catch(error:any){
      toast.error(error.response.data.error);
    }
    finally {
      controller.abort();
    }
    
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification icon in the navbar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowSendForm(false);
        }}
        className='rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'
      >
        <Image src="/announcement.png" alt="Notifications" width={22} height={22} />
        {/* Ken fama des notifications non lus, afficher ce nombre fou9 l icon */}
        {unreadCount > 0 && (
          <div className='absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs px-1'>
            {displayCount}
          </div>
        )}
      </button>

      {/* 1. Cas ou notification box ma7loul */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          {/* 1.1 Cas ou form ta3 envoi de notification ma7loula */}
          {showSendForm ? (
            <SendNotificationForm 
            onClose={() => setShowSendForm(false)} 
            onSuccess={() => {setShowSendForm(false); setIsOpen(false);}}
          />
          ) : (
            <>
            {/* 1.2 Cas ou form ta3 envoi de notification msakra (Notifications 3adiyin) */}
              <div className="p-3 border-b border-gray-200 flex justify-between">
                <h3 className="font-medium">Notifications</h3>
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-purple-600 font-semibold"
                  disabled={unreadCount === 0}
                >
                  Marquer tout comme lu
                </button>
              </div>

              {/* Ken fama des notifications affichehom */}
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  // Sinon mafamech des notifications
                  <div className="p-6 text-center text-sm text-gray-500">
                    Pas de notifications
                  </div>
                )}
              </div>

              <div className="border-t">

                {/* Button effacer */}
                <button 
                  onClick={clearAllNotifications}
                  className="w-full flex items-center justify-center gap-2 text-xs text-purple-600 font-semibold p-3 hover:bg-gray-50"
                  disabled={notifications.length === 0}
                >
                  
                  <span>Effacer tous</span>
                </button>

                {/* Button envoyer notification*/}
                <button 
                  onClick={() => setShowSendForm(true)}
                  className="w-full flex items-center justify-center gap-2 text-xs rounded-b-md text-white font-semibold p-3 bg-purple-600 hover:bg-purple-700"
                >
                  <Image src="/addnotification.png" alt="Add Icon" width={16} height={16} />
                  <span>Envoyer une notification</span>
                </button>

              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}