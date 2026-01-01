import React, { useContext, useState } from 'react'
import ChatContainer from '../components/ChatContainer'
import Sidebar from '../components/Sidebar'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../context/ChatContext'
import UnknownUserAlert from '../components/UnknownuserAlert'

const HomePage = () => {
  const {
    userProfile,
    selectedUser
  } = useContext(ChatContext)
  return (
    <div className='w-full h-screen border '>
      <div className={`backdrop-blur-xl border-2 border-gray-600 divide-x-[1px] divide-gray-100/20 overflow-hidden h-full grid grid-cols-[1fr_2fr] relative max-md:grid-cols-1`}>
        <Sidebar />
        {userProfile ? <RightSidebar /> : <ChatContainer />}
        {/* {selectedUser && <RightSidebar />} */}
      </div>
    </div>
  )
}

export default HomePage
