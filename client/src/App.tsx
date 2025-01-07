import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Components/home';
import { AuthProvider } from './Context/authContext';

const App = () => {

  return(
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>} />
          </Routes>
        </BrowserRouter>  
      </AuthProvider>
    </>
  )
}

export default App
