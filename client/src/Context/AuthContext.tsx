import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext<AuthContextType | null>(null);

interface User{
    username: string,
    email: string,
    password: string
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
    setIsLoggedIn: (loggedIn: boolean) => void;
    login : (iden: string, pwd: string) => void;
    logout: () => void;
    deleteUser: (id: string) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function useAuth() {
    return useContext(AuthContext);
}


export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        async function verifyToken(token: string){
            const res = await axios.get('http://localhost:3001/api/login', {
                headers: {
                    'token': token
                }
            });
            const data = res.data;
            if(data.status == 'ok') setIsLoggedIn(true);
            else setIsLoggedIn(false);
        }
        const token = localStorage.getItem('token');
        if(token){
            verifyToken(token);
        }else setIsLoggedIn(false)
    }, [])

    const login = async (username: string, pwd: string) => {

        try{
            const res = await axios.post('http://localhost:3001/login', {
                username: username,
                password: pwd
            });
            const data = res.data;

            if(data.token){
                localStorage.setItem('token', data.token);
                alert('Logged In!');
            }else{
                alert("User not found!");
            }
        }catch{
            alert("User not found!")
        }
    }

    const deleteUser = async (id: string) => {
        const res = await axios.delete(`http://localhost:3001/user/${id}`);
        const data = await res.data;
        if(data.status == 'ok') {
            localStorage.removeItem('token');
            alert("User is now deleted");
        }else {
            alert("Error occured");
        }
    }

    const logout = async () => {
        localStorage.removeItem('token');
        alert("You're logged out!")
    }

    const value = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        deleteUser
    };

    return(
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}


