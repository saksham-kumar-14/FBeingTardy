import React , { useState } from 'react';

interface props{
  login: (username: string, pwd: string) => string
};

const Login : React.FC<props> = ({login}) => {

  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");

  async function handleLogin(){
    await login(username, pwd);
    await window.location.reload();
  }

  return(
    <div>
      <h2> Login </h2>
      <input onChange={(e)=>{
        setUsername(e.target.value)
      }} placeholder="USERNAME" type="text" />
      <input onChange={(e)=>{
        setPwd(e.target.value)
      }} placeholder="PASSWORD" type="password" />
      <button onClick={handleLogin}>Login</button>
      <span>Don't have an account? Then 
        <a> Create One </a>
      </span>
    </div>
  )
}

export default Login;
