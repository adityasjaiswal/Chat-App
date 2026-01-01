import {createContext, useEffect, useState} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {connect, io} from 'socket.io-client'


const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL= backendUrl

const AuthContext = createContext()

const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState(null)
    const [socket, setSocket] = useState(null)

    // check if user is authenticated and if so then set the user data and connect to the socket
    const checkAuth = async () => {
        try {
            const {data} = await axios.get('/api/user/check')
            if(data.success){
                setAuthUser(data.data)
                connectSocket(data.data)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    // login and register function
    const login = async (state, credentials) => {
        try {
            const {data} = await axios.post(`/api/user/${state}`, credentials)
            console.log(data)
            if(data.success){
                setAuthUser(data.data)
                connectSocket(data.data)
                axios.defaults.headers.common["token"]  = data.data.refreshToken
                setToken(data.data.refreshToken)
                localStorage.setItem('token', data.data.refreshToken)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    //logout function
    const logout = async () => {
        try {
            const {data} = await axios.put('/api/user/logout')
            console.log(data)
            if(data.success){
                setAuthUser(null)
                setToken(null)
                localStorage.removeItem('token')
                socket.disconnect()
                setSocket(null)
                setOnlineUsers([])
                axios.defaults.headers.common["token"]  = null
                toast.success(data.message)
            }else{
                toast.error("Some error occured. Unable to logout user")
            }
        } catch (error) {
            // toast.error(error.response.data.message)
            console.log(error)
            toast.error("Hello World")
        }
    }

    //update profile function
    const updateProfile = async (credentials) => {
        try {
            const {data} = await axios.put('/api/user/update-profile', credentials)
            if(data.success){
                setAuthUser(data.data)
                localStorage.setItem('token', data.data.refreshToken)
                axios.defaults.headers.common["token"]  = data.data.refreshToken
                setToken(data.data.refreshToken)
                toast.success(data.message) 
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    // connect socket function to handle socket connection and handle user updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected){
            return;
        }
        const newSocket = io(backendUrl, {
            query: {
                userId: userData?._id
            }
        })
        newSocket.connect()
        setSocket(newSocket)
        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUsers(userIds)
        })
    }



    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }


    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth()
        }
    },[token]) 

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthProvider,
}
