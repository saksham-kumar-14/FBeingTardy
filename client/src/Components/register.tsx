import React , { useState } from 'react';

const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [CnfPwd, setCnfPwd] = useState("");

  return(
    <div>
      <h2> Register </h2>
      <input onChange={(e)=>{
        setUsername(e.target.value)
      }} placeholder="USERNAME" type="text" />
      <input onChange={(e)=>{
        setEmail(e.target.value)
      }} placeholder="EMAIL" type="text" />
      <input onChange={(e)=>{
        setPwd(e.target.value)
      }} placeholder="PASSWORD" type="password" />
      <input onChange={(e)=>{
        setCnfPwd(e.target.value)
      }} placeholder="CONFIRM PASSWORD" type="password" />
      <button>Register</button>
      <span>Already have an account? Then 
        <a> Login </a>
      </span>
    </div>
  )
}

export default Register;
