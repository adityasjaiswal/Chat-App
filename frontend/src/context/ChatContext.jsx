// import { createContext, useState, useContext, useEffect } from "react";
// import { AuthContext } from "./AuthContext.jsx";
// import toast from 'react-hot-toast'

// const ChatContext = createContext()

// const ChatProvider = ({ children }) => {

//     const [input, setInput] = useState('');
//     const [userProfile, setUserProfile] = useState(false);
//     const [messages, setMessages] = useState([])
//     const [leftOutUsers, setLeftOutUsers] = useState([])
//     const [selectedUser, setSelectedUser] = useState(null)
//     const [sidebarUser, setSidebarUser] = useState([])
//     const [blockedUsers, setBlockedUsers] = useState([])
//     const [blockUserSideBar, setBlockUserSidebar] = useState(false)
//     const [unSeenMessages, setUnSeenMessages] = useState({}) // unseen messages for each user to be stored in key-value pair.

//     const { socket, axios, authUser } = useContext(AuthContext)

//     // function to get users for the sidebar
//     const getUsers = async () => {
//         try {
//             const { data } = await axios.get('/api/message/users')
//             if (data.success) {
//                 setSidebarUser(data.data.usersForSidebar)
//                 setLeftOutUsers(data.data.leftOutUsers)
//                 setUnSeenMessages(data.data.unseenMessages)
//                 const leftUsers = data.data.leftOutUsers
//                 let blockedUsersProfile = leftUsers.filter(user => authUser.blockedList.toString().includes(user._id.toString()))
//                 setBlockedUsers(blockedUsersProfile)
//             }
//         } catch (error) {
//             toast.error(error.response.data.message)
//         }
//     }

//     //function to get messages for selected user
//     const getMessages = async (userId) => {
//         try {
//             const { data } = await axios.get(`/api/message/${userId}`)
//             if (data.success) {
//                 setMessages(data.data)
//             }
//         } catch (error) {
//             toast.error(error.response.data.message)
//         }
//     }

//     //function to send message to selected user
//     const sendMessage = async (messageData) => {
//         try {
//             const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData)
//             if (data.success) {
//                 setMessages((prevMessages) => [...prevMessages, data.data])
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.response.data.message)
//         }
//     }

//     // function to get messages in real-time
//     const subscribeToMessages = async () => {
//         if (!socket) {
//             return;
//         }
//         console.log('I am inside subscribe function')
//         socket.on('newMessage', (newMessage) => {
//             // console.log(selectedUser)
//             console.log('I am inside socket.on()')
//             if (selectedUser && newMessage.senderId === selectedUser._id) {
//                 newMessage.seen = true
//                 setMessages((prevMessages) => [...prevMessages, newMessage])
//                 axios.put(`/api/message/mark/${newMessage._id}`)
//                 // console.log('If block is getting executed')
//             } else {
//                 setUnSeenMessages((prevUnseenMessages) => ({
//                     ...prevUnseenMessages, [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1,
//                 }))

//             }
//             //Yaha par agar koi naya banda message bhej raha h to usko sidebarUser me add karo and letfOutUSer se nikalo so that us user ka profile sidebar me show ho


//             const senderId = newMessage.senderId;

//             const isInSidebar = sidebarUser.some(
//                 u => u._id.toString() === senderId.toString()
//             );

//             const isBlocked = blockedUsers.some(
//                 u => u._id.toString() === senderId.toString()
//             );

//             if (!isInSidebar && !isBlocked) {

//                 console.log("I am inside addUserToSidebarWithoutNotification block")
//                 addUserToSidebarWithoutNotification(senderId)

//                 const userToAdd = leftOutUsers.find(
//                     u => u._id.toString() === senderId.toString()
//                 );

//                 if (userToAdd) {
//                     setSidebarUser(prev => {
//                         [...prev, userToAdd]
//                     });
//                     setLeftOutUsers(prev =>
//                         prev.filter(u => u._id.toString() !== senderId.toString())
//                     );
//                 }
//             }

//             // if (leftOutUsers.some(user => user._id.toString() === sendId.toString())) {

//             // }

//             // setLeftOutUsers(prevLeftOutUsers =>
//             //     prevLeftOutUsers.filter(
//             //         u => u._id.toString() !== sendId.toString()
//             //     )
//             // );
//         })
//     }

// const blockUser = async () => {
//     try {
//         const { data } = await axios.put(`/api/user/block/${selectedUser._id}`)
//         if (data.success) {
//             setBlockedUsers(prevUsers => [...prevUsers, selectedUser])
//             setLeftOutUsers(prevUsers => [...prevUsers, selectedUser])
//             const newSidebarUsers = sidebarUser.filter(user => user._id.toString() !== selectedUser._id.toString())
//             setSidebarUser(newSidebarUsers);

//             toast.success(data.message)
//         } else {
//             toast.error(data.message)
//         }
//     } catch (error) {
//         toast.error(error.response.data.message)
//     }
// }

// const unBlockUser = async () => {
//     try {
//         const { data } = await axios.put(`/api/user/unblock/${selectedUser._id}`)
//         if (data.success) {
//             setSidebarUser(prevUsers => [...prevUsers, selectedUser])

//             const newBlockedUsers = blockedUsers.filter(user => user._id.toString() !== selectedUser._id.toString())
//             setBlockedUsers(newBlockedUsers)

//             const newLeftOutUsers = leftOutUsers.filter(user => user._id.toString() !== selectedUser._id.toString())
//             setLeftOutUsers(newLeftOutUsers)

//             toast.success(data.message)
//         } else {
//             toast.error(data.message)
//         }
//     } catch (error) {
//         toast.error(error.response.data.message)
//     }
// }

// const addUserToSidebar = async () => {
//     try {
//         const { data } = await axios.put(`/api/user/addToSidebar/${selectedUser._id}`)
//         if (data.success) {
//             setSidebarUser(prevUsers => [...prevUsers, selectedUser])

//             const newLeftOutUsers = leftOutUsers.filter(user => user._id.toString() !== selectedUser._id.toString())
//             setLeftOutUsers(newLeftOutUsers);

//             toast.success(data.message)
//         } else {
//             toast.error(data.message)
//         }
//     } catch (error) {
//         toast.error(error.response.data.message)
//     }
// }

// const addUserToSidebarWithoutNotification = async (senderId) => {
//     try {
//         const { data } = await axios.put(`/api/user/addToSidebar/${senderId}`)
//         if (data.success) {
//             console.log(data.message)
//         } else {
//             console.error(data.message)
//         }
//     } catch (error) {
//         console.error(error.response.data.message)
//     }
// }

//     //function to unsubcribe to message
//     const unSubscribeToMessages = () => {
//         if (socket) {
//             socket.off('newMessage')
//         }
//         console.log('I am inside unSubscribe function')
//     }

//     useEffect(() => {
//         subscribeToMessages()
//         return () => {
//             unSubscribeToMessages()
//         }
//     }, [socket, selectedUser])

//     const value = {
//         messages,
//         selectedUser,
//         setSelectedUser,
//         unSeenMessages,
//         setUnSeenMessages,
//         getUsers,
//         getMessages,
//         sendMessage,
//         sidebarUser,
//         leftOutUsers,
//         blockUser,
//         unBlockUser,
//         addUserToSidebar,
//         input,
//         setInput,
//         blockedUsers,
//         userProfile,
//         setUserProfile,
//         blockUserSideBar,
//         setBlockUserSidebar
//     }

//     return (
//         <ChatContext.Provider value={value}>
//             {children}
//         </ChatContext.Provider>
//     )
// }


// export {
//     ChatContext,
//     ChatProvider,
// }


import { createContext, useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const { socket, axios, authUser } = useContext(AuthContext);

    const [input, setInput] = useState("");
    const [userProfile, setUserProfile] = useState(false);
    const [messages, setMessages] = useState([]);
    const [leftOutUsers, setLeftOutUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sidebarUser, setSidebarUser] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [blockUserSideBar, setBlockUserSidebar] = useState(false);
    const [unSeenMessages, setUnSeenMessages] = useState({});

    const sidebarRef = useRef(sidebarUser);
    const leftOutRef = useRef(leftOutUsers);
    const blockedRef = useRef(blockedUsers);
    const selectedUserRef = useRef(selectedUser);

    useEffect(() => { sidebarRef.current = sidebarUser; }, [sidebarUser]);
    useEffect(() => { leftOutRef.current = leftOutUsers; }, [leftOutUsers]);
    useEffect(() => { blockedRef.current = blockedUsers; }, [blockedUsers]);
    useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);


    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/message/users");
            if (data.success) {
                setSidebarUser(data.data.usersForSidebar);
                setLeftOutUsers(data.data.leftOutUsers);
                setUnSeenMessages(data.data.unseenMessages);

                const blocked = data.data.leftOutUsers.filter(user =>
                    authUser.blockedList.includes(user._id)
                );
                setBlockedUsers(blocked);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/message/${userId}`);
            if (data.success) setMessages(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(
                `/api/message/send/${selectedUser._id}`,
                messageData
            );
            if (data.success) {
                setMessages(prev => [...prev, data.data]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };


    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            const senderId = newMessage.senderId.toString();
            const currentSelected = selectedUserRef.current;

            if (currentSelected && senderId === currentSelected._id.toString()) {
                newMessage.seen = true;
                setMessages(prev => [...prev, newMessage]);
                axios.put(`/api/message/mark/${newMessage._id}`);
                return;
            }

            if (currentSelected && newMessage.senderId === currentSelected._id) {
                newMessage.seen = true
                setMessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/message/mark/${newMessage._id}`)
            } else {
                setUnSeenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1,
                }))
            }

            const isInSidebar = sidebarRef.current.some(
                u => u._id.toString() === senderId
            );

            const isBlocked = blockedRef.current.some(
                u => u._id.toString() === senderId
            );

            if (isInSidebar || isBlocked) return;

            const userToAdd = leftOutRef.current.find(
                u => u._id.toString() === senderId
            );

            if (!userToAdd) return;

            setSidebarUser(prev => [...prev, userToAdd]);
            setLeftOutUsers(prev =>
                prev.filter(u => u._id.toString() !== senderId)
            );

            axios.put(`/api/user/addToSidebar/${senderId}`);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            if (socket) socket.off("newMessage", handleNewMessage);
        }
    }, [socket]);


    const blockUser = async () => {
        try {
            const { data } = await axios.put(`/api/user/block/${selectedUser._id}`)
            if (data.success) {
                setBlockedUsers(prevUsers => [...prevUsers, selectedUser])
                setLeftOutUsers(prevUsers => [...prevUsers, selectedUser])
                const newSidebarUsers = sidebarUser.filter(user => user._id.toString() !== selectedUser._id.toString())
                setSidebarUser(newSidebarUsers);

                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const unBlockUser = async () => {
        try {
            const { data } = await axios.put(`/api/user/unblock/${selectedUser._id}`)
            if (data.success) {
                setSidebarUser(prevUsers => [...prevUsers, selectedUser])

                const newBlockedUsers = blockedUsers.filter(user => user._id.toString() !== selectedUser._id.toString())
                setBlockedUsers(newBlockedUsers)

                const newLeftOutUsers = leftOutUsers.filter(user => user._id.toString() !== selectedUser._id.toString())
                setLeftOutUsers(newLeftOutUsers)

                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const addUserToSidebar = async () => {
        try {
            const { data } = await axios.put(`/api/user/addToSidebar/${selectedUser._id}`)
            if (data.success) {
                setSidebarUser(prevUsers => [...prevUsers, selectedUser])

                const newLeftOutUsers = leftOutUsers.filter(user => user._id.toString() !== selectedUser._id.toString())
                setLeftOutUsers(newLeftOutUsers);

                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const addUserToSidebarWithoutNotification = async (senderId) => {
        try {
            const { data } = await axios.put(`/api/user/addToSidebar/${senderId}`)
            if (data.success) {
                console.log(data.message)
            } else {
                console.error(data.message)
            }
        } catch (error) {
            console.error(error.response.data.message)
        }
    }


    const value = {
        messages,
        selectedUser,
        setSelectedUser,
        unSeenMessages,
        setUnSeenMessages,
        getUsers,
        getMessages,
        sendMessage,
        sidebarUser,
        leftOutUsers,
        blockedUsers,
        blockUserSideBar,
        setBlockUserSidebar,
        input,
        setInput,
        userProfile,
        setUserProfile,
        blockUser,
        unBlockUser,
        addUserToSidebar,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export {
    ChatContext,
    ChatProvider
}