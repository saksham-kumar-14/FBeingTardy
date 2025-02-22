import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';


interface userDataProps{
    username?: string,
    email?: string,
    friends?: string[] | undefined,
    friendsOf?: string[] | undefined
}

const Profile : React.FC = () => {

    const navigate = useNavigate();
    let { username } = useParams();
    const [userData, setUserData] = useState<userDataProps | undefined>(undefined);

    async function getUser(username: string | undefined){
        const res = await axios.get("http://localhost:3001/users");
        const data = await res.data;

        data.map((e: any) => {
            if(e.username == username){
                setUserData(e);
            }
        })
    }

    useEffect(() => { 
        getUser(username);
    }, []);

    return (
        <div>
            {userData === undefined && <h1>Loading...</h1>}

            {userData !== undefined && 
                <div>
                    <h1>{userData.username}'s Profile</h1>
                    <h2>{userData.email}</h2>

                    <div>
                        <h3>Friends</h3>
                        <ul>
                        {(userData.friends == undefined || userData.friends.length === 0 )&& <p> NO Friends</p>}

                        {userData.friends != undefined &&  userData.friends.map((friend) => {
                            return <li onClick={() => {
                                navigate(`/profile/${friend}`)
                                window.location.reload();
                            }}>{friend}</li>
                        })}
                        </ul>
                    </div>

                    <div>
                        <h3>Friends Of</h3>
                        <ul>
                            {(userData.friendsOf == undefined || userData.friendsOf.length === 0) && <p> NO Friends</p>}

                            {userData.friendsOf != undefined &&  userData.friendsOf.map((friend) => {
                                return <li onClick={() => {
                                    navigate(`/profile/${friend}`)
                                    window.location.reload();
                                }}>{friend}</li>
                            })}
                        </ul>
                    </div>

                </div>
            }

        </div>
    )
}

export default Profile