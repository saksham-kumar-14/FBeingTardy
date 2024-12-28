import React , { useState } from 'react';

const Login = () => {

  const [iden, setIden] = useState("");
  const [pwd, setPwd] = useState("");

  return(
    <div>
      <h2> Login </h2>
      <input onChange={(e)=>{
        setIden(e.target.value)
      }} placeholder="USERNAME or EMAIL" type="text" />
      <input onChange={(e)=>{
        setPwd(e.target.value)
      }} placeholder="PASSWORD" type="password" />
      <button>Login</button>
      <span>Don't have an account? Then 
        <a> Create One </a>
      </span>
    </div>
  )
}

export default Login;
