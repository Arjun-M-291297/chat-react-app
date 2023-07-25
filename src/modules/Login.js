import {React, useState} from 'react'
import {useNavigate , Link} from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase"
import { Spinner, useToast } from "@chakra-ui/react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const toast = useToast()
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try{
      await signInWithEmailAndPassword(auth, email, password)
      setLoading(false)
      toast({
        title: "Successfully logged in",
        isClosable: true,
        status:'success'
      })
      navigate("/")
    }
    catch(err){
      toast({
        title: err.message,
        isClosable: true,
        status:'error'
      })
      setLoading(false)
    }
  };
  return (
    <div className='formContainer'>
    <div className='formWrapper'>
    <span className='logo'>ChatApp</span>
    <span className='title'>Login</span>
    <form onSubmit={handleSubmit}>
        <input type='email' placeholder='Email'></input>
        <input type='password' placeholder='Password'></input>
        <button>Login</button>
    </form>
    <p>You don't have an account? <Link to="/register">Register</Link></p>
    </div>
    {loading && <div className="container-spinner"><Spinner size="xl" color="yellow.500" /></div>}
    </div>
  )
}

export default Login
