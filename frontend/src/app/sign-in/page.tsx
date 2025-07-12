"use client"

import React,{useState,useEffect} from 'react'
import {useRouter  } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import axios from '../../api/axios'
import { jwtDecode } from 'jwt-decode'
const LOGIN_URL = '/auth/login'

const LoginPage: React.FC = () => {
  // our global state to manage authentification
  const {setAuth} = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    setErrMsg('');
  }, [email, password])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    //axios will throw the error automatically not like fetch hook we need to handle exceptions manually
    //axios will convert automatically the response to json
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ email, password }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    )

    const accessToken = response?.data?.accessToken
    const role = response?.data?.role
    const decodedToken: any = jwtDecode(accessToken)
    const user_id=decodedToken.userInfo?.id
    console.log("user id is :",user_id)
    setAuth({ email, password, role, accessToken,user_id })
    setEmail('')
    setPassword('')
    const from = role ==="ADMIN" ? "/admin" : role ==="CHEF" ? "/chef" :  "/directeur"
    router.push(from)
    } catch (err: any) {
        if (!err?.response) {
          setErrMsg('Aucune réponse du serveur')
      } else if (err.response?.status === 400) {
          setErrMsg('Nom d\'utilisateur ou mot de passe manquant')
      } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized')
          //check it in the backend !!!!
      } else {
          setErrMsg('La connexion a échoué')
      }
    }
  }

  return (

      <div>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-36 w-auto transition-transform transform hover:scale-110 hover:rotate-6"
              src="https://i.ibb.co/BgXTm7t/isimm2.png"
              alt="Logo ISIMM"
            />
            <h2 className="mt-12 text-center text-2xl font-bold tracking-tight text-gray-900">
              Connectez à votre compte
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Adresse E-mail
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Mot de passe
                  </label>

                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  className="mt-8 flex w-full justify-center rounded-md bg-blue-800 px-3 py-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Se connecter
                </button>
              </div>
{             errMsg && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur: </strong>
                <span className="block sm:inline">{errMsg}</span>
              </div>}
            </form>
            
          </div>
        </div>
      </div>
  );
}

export default LoginPage;
