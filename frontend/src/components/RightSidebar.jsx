import React, { useContext } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

const RightSidebar = () => {
  const { logout, onlineUsers } = useContext(AuthContext)
  const {
    selectedUser,
    messages,
    blockUser,
    unBlockUser,
    blockedUsers,
    setUserProfile,
    userProfile
  } = useContext(ChatContext)

  return (
    <div className={`bg-[#8185B2]/10 text-white w-full h-screen relative ${userProfile ? '' : 'max-md:hidden' }`}>

      <div className='flex items-center gap-2 py-3 mx-4'>
        <img onClick={() => setUserProfile(false)} src={assets.arrow_icon} alt='Arrow Icon' className='max-w-3 hover:cursor-pointer' />
        <p onClick={() => setUserProfile(false)} className='text-white/60 hover:cursor-pointer'>Back</p>
      </div>
      <div className='pt-8 flex flex-col items-center gap-2 text-xs font-light mx-auto h-[30%]'>
        <img src={selectedUser?.avatar ?? assets.avatar_icon} alt="User Avatar" className='aspect-[1/1] h-[60%] rounded-full mx-auto' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-1'>
          {selectedUser.name}
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
      <div className='flex justify-center mt-2'>
        <hr className='border-[#ffffff50] my-4 w-[95%]' />
      </div>

      {/* <div className='px-5 text-xs max-h-[80%]'>
        <p>Media</p>
        <div className='mt-2 h-full overflow-y-scroll grid grid-cols-2 place-items-center gap-4 opacity-80 w-full'>
          {messages.map((message) => message.image && (
            <div key={message._id} onClick={(e) => window.open(message.image, "_blank")} className='cursor-pointer rounded w-[70%]'>
              <img src={message.image} alt='Shared Media' className='rounded-md ' />
            </div>
          ))}
        </div>
      </div> */}

      <div className="px-5 text-sm text-semibold max-h-[60%] flex flex-col">
        <div className='mx-7'>
          <p className="shrink-0">Media</p>
        </div>

        <div className="mt-2 overflow-y-auto grid grid-cols-3 max-md:grid-cols-2 place-items-center gap-2 opacity-80 w-full">
          {messages.map(
            (message) =>
              message.image && (
                <div
                  key={message._id}
                  onClick={() => window.open(message.image, "_blank")}
                  className="cursor-pointer rounded w-[100%] flex items-center justify-center"
                >
                  <img
                    src={message.image}
                    alt="Shared Media"
                    className="rounded-md object-cover w-[80%]"
                  />
                </div>
              )
          )}
        </div>
      </div>


      <button
        className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-violet-500 py-2 px-20 text-white border-none text-sm font-light rounded-full cursor-pointer'
        onClick={blockedUsers.find(user => user._id.toString() === selectedUser._id.toString()) ? () => unBlockUser() : () => blockUser()}
      >
        {blockedUsers.find(user => user._id.toString() === selectedUser._id.toString()) ? "Unblock" : "Block"}
      </button>
    </div>
  )
}

export default RightSidebar
