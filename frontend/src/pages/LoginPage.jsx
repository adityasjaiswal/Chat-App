import React, { useState, useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign Up")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const submitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
    } else{
      // Handle form submission logic here
      const formData = {
        name,
        email,
        password,
        bio: bio,
      };
      console.log("Form Data Submitted: ", formData);
      login(currState === 'Sign Up'? 'register' : 'login', formData)

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setBio(""); 
      setIsDataSubmitted(false);
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-xl'>

      {/* Left side */}
      <img src={assets.logo_icon} alt="Logo" className='w-[min(30vw,170px)]' />

      {/* Right Side */}
      <form onSubmit={submitHandler}   
      className='border-2 border-gray-500 bg-white/8 text-white p-6 flex flex-col gap-6 rounded-lg shadow-lg'
      >
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && (
            <img 
            src={assets.arrow_icon} 
            alt="Arrow Icon" 
            className='w-5 cursor-pointer' 
            onClick={() => {
              setIsDataSubmitted(false);
            }}
            />
          )}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && 
          (
            <input 
            type="text" 
            name='Name'
            placeholder='Full Name' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none' 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} />
          )
        }

        {!isDataSubmitted && (
          <>
            <input 
            type="email" 
            name='Email'
            placeholder='Email' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            />

            <input 
            type="password" 
            name='Password'
            placeholder='Password' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            />

          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <>
            <textarea 
            name="Bio"  
            placeholder='Write your Bio'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            />
          </>
        )}

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" id='termsConditions' required/>
          <label htmlFor='termsConditions'>I agree to the Terms of Service and Privacy Policy</label>
        </div>

        <button 
          type='submit' 
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white  rounded-md cursor-pointer'
        >
          {currState === "Sign Up" ? (!isDataSubmitted ? "Next" : "Create Account") : "Login"}
        </button>

        

        <div className='flex flex-col gap-2'>
          {currState === "Sign Up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account? 
              <span 
              className='font-medium text-violet-500 cursor-pointer'
              onClick={() => {
                setCurrState("Login");
                setIsDataSubmitted(false);
              }}
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account? 
              <span 
              className='font-medium text-violet-500 cursor-pointer'
              onClick={() => {
                setCurrState("Sign Up");
              }}
              >
                Click Here
              </span>
            </p>
          )}
        </div>

      </form>


    </div>
  )
}

export default LoginPage
