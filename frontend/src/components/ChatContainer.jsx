import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets.js'
import { formatMessageTime } from '../lib/utils.js';
import { ChatContext } from '../context/ChatContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx'
import UnknownUserAlert from './UnknownuserAlert.jsx';

const ChatContainer = () => {
  const scrollEnd = useRef(null);
  const {
    messages,
    sendMessage,
    getMessages,
    selectedUser,
    setSelectedUser,
    sidebarUser,
    blockedUsers,
    unBlockUser,
    setUserProfile
  } = useContext(ChatContext)

  const { authUser, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState('')
  const image  = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (image.current) {
      formData.append('image', image.current)
    } else {
      if (input.trim() === '') return null;
      formData.append('text', input.trim())
    }
    sendMessage(formData)
    setInput('')
    image.current = null
  }


  useEffect(() => {
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(() => {
    if (messages && scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return selectedUser ? (
    <div className={`h-full overflow-y-scroll relative backdrop-blur-lg ${selectedUser ? '' : 'max-md:hidden'}`}>

      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt='Arrow Icon' className='max-w-3 hover:cursor-pointer' />
        <img src={selectedUser.avatar ?? assets.avatar_icon} alt="User Avatar" className='w-8 rounded-full aspect-[1/1]' />
        <div className='flex-1 text-md text-white flex items-center gap-2'>
          {selectedUser.name}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </div>
        <img src={assets.help_icon} alt='Help Icon' className='max-w-5 hover:cursor-pointer' 
        onClick={() =>setUserProfile(true) }/>
      </div>


      {!sidebarUser.find(user => user._id.toString() === selectedUser._id.toString()) && 
      !blockedUsers.find(user => user._id.toString() === selectedUser._id.toString()) ? 
      <UnknownUserAlert /> : (
      <>
        {/* Chat Area */}
        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
              {msg.image ? (
                <img src={msg.image} alt='' className={`max-w-[30%] border border-gray-700 rounded-xl overflow-hidden mb-8 ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`} />
              ) : (
                <p className={`p-2 max-w-[40%] text-md font-light rounded-xl mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
              )}
              <div className='text-center text-xs'>
                <img src={msg.senderId === authUser._id ? authUser?.avatar || assets.avatar_icon : selectedUser.avatar || assets.avatar_icon} alt='Avatar icon' className='w-7 aspect-[1/1] rounded-full' />
                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
              </div>

            </div>
          ))}
          <div ref={scrollEnd}></div>
        </div>


        {/* Message Input */}
        {!blockedUsers.find(user => user._id.toString() === selectedUser._id.toString()) ? 
        (
        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
          <div className='flex-1 flex items-center bg-gray-100/10 rounded-full px-3'>
            <input
              type="text"
              placeholder='Write a message'
              className='border-none flex-1 p-3 text-md rounded-lg outline-none text-white placeholder-gray-100'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? handleSubmit(e) : null}
            />
            <input
              type="file"
              id='image'
              accept='image/jpg, image/png'
              hidden
              onChange={(e) => {
                image.current = e.target.files[0]
                handleSubmit(e)
              }}
            />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>
          <img
            src={assets.send_button}
            alt="Send Button"
            className='w-7 cursor-pointer'
            onClick={handleSubmit}
          />
        </div> 
        ): (
          <div>
          <div className='border-[1px] border-gray-600/20 w-full'>
          </div>
          <div className='relative top-0 bottom-0 left-0 right-0 flex items-center p-3 h-full '>
            <div className='flex-1 text-md flex justify-center items-center h-auto w-auto gap-25 px-3'>
              <p className='text-gray-800/60 text-wrap'>User is blocked. Click to unblock</p>
              <button 
              className='bg-gradient-to-r from-purple-500 to-violet-500 py-2 px-15 rounded-full text-white py-auto cursor-pointer border-none text-sm'
              onClick={unBlockUser}
              >
                Unblock
              </button>
            </div>
          </div>
          </div>
        )}
      </>
      )}
    </div>

  ) : (
    <div className='flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt='Logo Icon' className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat Anytime, anywhwere</p>
    </div>
  )
}

export default ChatContainer

