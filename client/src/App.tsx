import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Components/home';
import { AuthProvider } from './Context/authContext';
import Profile from './Components/Profile/profile';

const App = () => {

  return(
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/profile/:username' element={<Profile/>} />
          </Routes>
        </BrowserRouter>  
      </AuthProvider>
    </>
  )
}

export default App
