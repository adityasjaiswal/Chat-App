import { useContext, useEffect, useRef, useState } from 'react'
import assests from '../assets/assets.js'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { ChatContext } from '../context/ChatContext.jsx'

const Sidebar = () => {

  const searchRef = useRef(null);
  const { logout, onlineUsers } = useContext(AuthContext)
  const {
    sidebarUser,   
    selectedUser,
    setSelectedUser,
    unSeenMessages,
    getUsers,
    setUnSeenMessages,
    leftOutUsers,
    setInput,
    input,
    setUserProfile,
    blockedUsers,
    blockUserSideBar,
    setBlockUserSidebar
  } = useContext(ChatContext)
  


  const filterUsers = input ? (sidebarUser.filter((user) => user.name.toLowerCase().includes(input.trim().toLowerCase())).length > 0 ? sidebarUser.filter((user) => user.name.toLowerCase().includes(input.trim().toLowerCase())) : leftOutUsers.filter((user) => user.email.toLowerCase().includes(input.trim().toLowerCase()))) : sidebarUser


  useEffect(() => {
    getUsers()
  }, [onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5  text-white ${selectedUser ? 'max-md:hidden' : ''}`} >
      <div className='pb-5 h-full relative'>

        {/* Header */}
        <div className='flex justify-between items-center px-5 max-h-[10%]'>
          <div className='flex gap-1'>
            <img src='/image.png' alt='Logo' className='max-w-6 cursor-pointer' />
            <p>Chit Chat</p>
          </div>
          <div className='relative py-2 group '>
            <img src={assests.menu_icon} alt='Menu' className='max-h-5 cursor-pointer' />
            <div className='absolute top-7 right-0 z-20  p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block flex justify-center items-center text-sm text-nowrap'>
              <Link to='/profile'>Edit Profile</Link>
              <hr className='my-2 border-gray-600' />
              <button className='cursor-pointer ' onClick={() => setBlockUserSidebar(true)}>Blocked Users</button>
              <hr className='my-2 border-gray-600' />
              <button className='cursor-pointer' onClick={logout}>Logout</button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mt-5 m-auto w-[95%] h-10 max-h-[10%] bg-gray-700 rounded-full flex items-center px-3 py-1'>
          <img src={assests.search_icon} alt='Search' className='max-h-4 max-w-3' onClick={() => { searchRef.current.focus() }} />
          <input
            ref={searchRef}
            type='text'
            value={input}
            placeholder='Search user (Use E-mail for unknown users)'
            className='bg-transparent outline-none ml-3 w-full h-[90%] text-sm placeholder-gray-300'
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* User List */}
        {!blockUserSideBar ? (
          <div className='absolute mt-6 mb-2 px-5 py-2 flex flex-col gap-1.5 max-h-[80%] overflow-y-auto w-full'>
            {
              filterUsers.map((user) => (
                <div
                  key={user._id}
                  className={`relative flex justify-between items-center w-full cursor-pointer hover:bg-gray-100/10 rounded-3xl ${selectedUser?._id === user?._id && 'bg-gray-200/20'} `}
                  onClick={() => {
                    setSelectedUser(user)
                    setUnSeenMessages(prev => ({
                      ...prev,
                      [user._id]: 0
                    }))
                    setUserProfile(false)
                  }}
                >
                  <div className='flex gap-5 item-center'>
                    <img src={user.avatar ?? assests.avatar_icon} alt='User Avatar' className='max-h-10 aspect-[1/1] rounded-full my-auto' />
                    <div>
                      <div className='my-0'>{user.name}</div>
                      {sidebarUser.find(sideUser => sideUser._id.toString() === user._id.toString()) ?
                        <div className={`my-0 text-sm ${onlineUsers.includes(user._id) ? 'text-green-600' : 'text-gray-500'} leading-5`}>{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</div>
                        : <div className={`my-0 text-sm text-gray-500 leading-5`}>{user.email}</div>
                      }
                    </div>
                  </div>
                  {unSeenMessages[user._id] > 0 && <div className='absolute top-3 right-4 h-5 w-5 text-xs text-white bg-violet-500/50 rounded-full flex justify-center items-center'>
                    {unSeenMessages[user._id]}
                  </div>}
                </div>
              ))
            }
          </div>
        ) : (
          <div>
            <div className='flex items-center gap-2 py-3 mx-4'>
              <img onClick={() => setBlockUserSidebar(false)} src={assests.arrow_icon} alt='Arrow Icon' className='max-w-3 hover:cursor-pointer' />
              <p>Blocked Users</p>
            </div>
            {blockedUsers.length > 0 ?
              blockedUsers.map((user) => (
                <div
                  key={user._id}
                  className={`relative flex justify-between item-center w-full cursor-pointer hover:bg-gray-100/10 rounded-3xl ${selectedUser?._id === user._id && 'bg-gray-200/20'} `}
                  onClick={() => {
                    setSelectedUser(user)
                    setUnSeenMessages(prev => ({
                      ...prev,
                      [user._id]: 0
                    }))
                    setUserProfile(false)
                  }}
                >
                  <div className='flex gap-5 item-center'>
                    <img src={user.avatar ?? assests.avatar_icon} alt='User Avatar' className='max-h-10 aspect-[1/1] rounded-full my-auto' />
                    <div>
                      <div className='my-0'>{user.name}</div>
                      {sidebarUser.find(sideUser => sideUser._id.toString() === user._id.toString()) ?
                        <div className={`my-0 text-sm ${onlineUsers.includes(user._id) ? 'text-green-600' : 'text-gray-500'} leading-5`}>{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</div>
                        : <div className={`my-0 text-sm text-gray-500 leading-5`}>Start Chatting</div>
                      }
                    </div>
                  </div>
                  {unSeenMessages[user._id] > 0 && <div className='absolute top-3 right-4 h-5 w-5 text-xs text-white bg-violet-500/50 rounded-full flex justify-center items-center'>
                    {unSeenMessages[user._id]}
                  </div>}
                </div>
              )) : (
                <div className='h-full flex justify-center items-center'>
                  <p>No blocked User found</p>
                </div>
              )
            }
          </div>
        )}

      </div>
    </div>
  )
}

export default Sidebar
