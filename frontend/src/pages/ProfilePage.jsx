import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const [selectedImage, setSelectedImage] = useState();
  const [name, setName] = useState(authUser?.name);
  const [bio, setBio] = useState(authUser?.bio);
  const navigate = useNavigate();
  const userAvatar = authUser?.avatar

  // A lot to learn here about File, Blob and URL.createObjectURL and how to handle images in React and what comes when we import an image or file

  // useEffect(() => {
  //   {console.log(typeof pic1, pic1)};
  //   async function fileGenerator(pic) {
  //     const response = await fetch(pic);
  //     console.log("Response: ",response);
  //     const blob = await response.blob();
  //     console.log(blob);
  //     const file = new File([blob], "profile.jpg", { type: blob.type });
  //     console.log(file);
  //     setSelectedImage(file);
  //   }
  //   fileGenerator(pic1);
  //   // setSelectedImage(pic1);
  //   // {console.log(typeof selectedImage, selectedImage);}
  // }, []);

  const handleSumbit = async (e) => {
    e.preventDefault();
    
    const formdata = new FormData()
    formdata.append('name', name)
    formdata.append('bio', bio)
    formdata.append('avatar', selectedImage)
    updateProfile(formdata)

  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-xl'>
      <div className='w-5/6 max-w-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg '>
        <form className='flex flex-col gap-5 p-10 flex-1' onSubmit={handleSumbit}>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center cursor-pointer'>
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon}
              alt="User Avatar"
              className='w-12 aspect-[1/1] rounded-full mr-4'
            />
            Upload Profile Image
          </label>
          <input
            type="file"
            id='avatar'
            accept='.png, .jpeg, .jpg'
            hidden
            onChange={(e) => {
              // console.log(typeof e.target.files, e.target.files);
              setSelectedImage(e.target.files[0]);
            }}
          />

          <input
            type="text"
            required
            placeholder='Please enter your Name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 '
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            rows={4}
            placeholder='Enter your Bio'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 '
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 py-2 px-20 text-white border-none text-lg font-light rounded-full cursor-pointer'
            required
          // onClick={(e) => {
          //   e.preventDefault();
          //   // Here we will update the user profile details in backend
          //   navigate('/');
          // }}
          >Save</button>
        </form>
        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${userAvatar && 'max-w-46 aspect-[1/1] rounded-full mr-4 cursor-pointer'}`}
          src={userAvatar || assets.logo_icon}
          alt="User avatar"
          onClick={(e) => window.open(e.target.src, "_blank")}
        />
      </div>
    </div>
  )
}

export default ProfilePage
