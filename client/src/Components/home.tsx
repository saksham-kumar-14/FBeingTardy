import { useState } from "react";
import { useAuth } from "../Context/authContext";
import Login from "./login";
import Register from "./register";


const Home = () => {
  const { user, 
    isLoggedIn, 
    setUser, 
    setIsLoggedIn,
    login,
    logout,
    deleteUser
  } = useAuth();
  const [showComponent, setShowComponent] = useState<string | null>(null);

  return (
      <div>
          {isLoggedIn ? (
            <div>
              <button onClick={logout}>Logout</button>
              <button onClick={()=>{
                deleteUser(user.id)
              }}>Delete Account</button>
            </div>
          ) : (
            <div>
              <button onClick={() => setShowComponent('LOGIN')}>Login</button>
              <button onClick={() => setShowComponent('REGISTER')}>Register</button>
            </div>
          )}

          {
            showComponent == 'LOGIN' &&
            <Login login={login} /> 
          }
          {
            showComponent == 'REGISTER' &&
            <Register />
          }

      </div>
  );
};

export default Home;
