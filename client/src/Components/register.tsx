import React , { useState } from 'react';
import axios from 'axios'
import bcrypt from "bcryptjs-react";

interface User{
  username: string,
  email: string,
  password: string // encyrpted one
}

const Register : React.FC = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [CnfPwd, setCnfPwd] = useState("");

  async function username_emailExists(){

    let ans = 0;
    const res = await axios.get("http://localhost:3001/users");
    const data = await res.data;

    if(data != null){
      data.map((e: User) => {
        if(e.username == username || e.email == email){
          ans = 1;
        }
      })
    }

    return ans;
  }

  function removeSpaces(s: string){
    let ans = "";
    Array.from(s).forEach((c) => {
      ans += c;
    });
    return ans;
  }

  function createUser(){
    const rounds = 10;
    bcrypt.hash(pwd, rounds)
    .then((hash) => {
      axios.post('http://localhost:3001/users', {
        username: username,
        email: email,
        password: hash
      }).then(() => {
        alert("User Created");
      }).catch((err) => {
        console.error(err);
        alert("Error occured");
      })
    })
    .catch(() => {
      alert("Some error occured. Please Try again");
    })

  }  

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
      <button onClick={ async () => {
        setUsername(removeSpaces(username))
        const userExists = await username_emailExists();
        
        if(username == "") alert("Username can't be empty");
        else if(email == "") alert("Email can't be empty");
        else if(pwd != CnfPwd) alert("Passwords don't match");
        else if(userExists == 1) alert("This email or username already exists. Try to login instead");
        else createUser();
      }}>
        Register
      </button>

      <span>Already have an account? Then 
        <a> Login </a>
      </span>
    </div>
  )
}

export default Register;
