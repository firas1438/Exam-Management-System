
import Image from "next/image"
import useAuth from "@/hooks/useAuth"
import NotificationDropdown from "./NotificationDropdown"

const Navbar = () => {
  const {auth} = useAuth()
  return (
    <div className='flex items-center justify-between p-4'>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-3 justify-end w-full'>
        <div className='rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt="" width={20} height={20}/>
        </div>

        {/* Button notifications */}
        <div className="pr-6">
          <NotificationDropdown/>
        </div>

        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">{auth.email}</span>
          <span className="text-[10px] text-gray-500 text-right">{auth.role}</span>
        </div>
        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
      </div>
    </div>
  )
}

export default Navbar