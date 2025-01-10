import { useState } from "react";
import { useAuth } from "../Context/authContext";
import Login from "./login";
import Register from "./register";
import Search from "./HomeComponents/search";


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

  async function handleDeleteUser(){
    await deleteUser(user.id);
    window.location.reload();
  }

  return (
      <div>
          {isLoggedIn ? (
            <div>
              <div>
                <button onClick={logout}>Logout</button>
                <button onClick={handleDeleteUser}>Delete Account</button>
              </div>
              <div>
                <Search user={user} setUser={setUser} />
              </div>
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
