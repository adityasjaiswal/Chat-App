import React from "react";
import { useContext} from 'react'
import { ChatContext } from '../context/ChatContext';

const UnknownUserAlert = () => {
  const {
    setSelectedUser,
    addUserToSidebar,
    setInput
  } = useContext(ChatContext)

  return (
    <div className="w-full h-full inset-0 z-50 flex items-center justify-center">
      <div className="w-[90%] max-w-3/5 rounded-lg bg-emerald-50/60 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">
          Unknown User
        </h2>

        <p className="mt-2 text-gray-600">
          You are trying to chat with someone who is not in your known users list. Do you want to add this user to your known user list?

        </p>

        <div className="flex gap-8">
            <button
            onClick={() => {
                setSelectedUser(null)
                setInput('')
            }}
            className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
            Cancel
            </button>

            <button
            className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => {
                addUserToSidebar()
                setInput('')
            }}
            >
            OK
            </button>
        </div>
      </div>
    </div>
  );
}

export default UnknownUserAlert