"use client"

import axios from "@/api/axios"
import useAuth from "./useAuth"
import { jwtDecode } from 'jwt-decode'



const useRefreshToken = () => {
    const { setAuth } = useAuth()

    const refresh = async () => {
        const response = await axios.get('/auth/refreshToken', {
            withCredentials: true //allow us to send cookies with our request mrgl ? lifih refresh token  
        });
        setAuth(() => {
                const  accessToken=response.data.accessToken
                const decodedToken: any = jwtDecode(accessToken)
                const user_id=decodedToken.userInfo?.id
            return {
                user_id:user_id,
                email:response.data.email,
                accessToken: response.data.accessToken,
                role:response.data.role
            }
        });
        return response.data.accessToken
    }

    return refresh
}

export default useRefreshToken