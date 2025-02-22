import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface props{
    user: any,
    setUser: Function
}

const Search : React.FC<props> = ({user, setUser}) => {
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<any>([]);
    const navigate = useNavigate();

    async function loadUsers(){
        const res = await axios.get('http://localhost:3001/users');
        const data = await res.data;
        let ans = []

        let m = new Map();
        data.map((e: any) => {
            let k = 0;
            for(const char of search)
                if(char == e.username[k]) k++;

            m.set(e.username, k);
        })

        const sortedMap = new Map([...m.entries()].sort((a, b) => a[1] - b[1]));

        for(const [usr, scr] of sortedMap)
            if(scr/search.length >= 0.3 && usr != user.username){
                if(user.friends.includes(usr))
                    ans.push(
                        {
                            username: usr,
                            friend: true
                        }
                    );
                else ans.push(
                    {
                        username: usr,
                        friend: false
                    }
                );
            }

        setSearchResult(ans);
    }

    async function addFriend (username: string){
        user.friends.push(username);

        axios.post('http://localhost:3001/update', {
            username: user.username,
            friends: user.friends,
            friendsOf: user.friendsOf
        }).then(() => {
            setUser(user)
            loadUsers();
        }).catch((err) => {
            console.error(err);
            alert("Error occured");
        });

        const allUsers = await axios.get('http://localhost:3001/users');
        const user2 = await allUsers.data;
        user2.map((e: any) => {
            if(e.username == username){
                if(e.friendsOf == undefined) e.friendsOf = [];
                e.friendsOf.push(user.username);
                axios.post('http://localhost:3001/update', {
                    username: e.username,
                    friends: e.friends,
                    friendsOf: e.friendsOf
                }).then(() => {
                    loadUsers();
                }).catch((err) => {
                    console.error(err);
                    alert("Error occured");
                });
            }
        })

    }

    return(
        <div>
            <div>
                <input type="text"
                placeholder="Search for a user"
                value={search} 
                onChange={(e) => setSearch(e.target.value)} />
                <button onClick={()=>{
                    if(search.length > 0) loadUsers();
                }
                }>Search</button>
            </div>

            <div>
                <h2>Search Result</h2>
                <div>
                    {searchResult.map((e: any, idx: number)=>{
                        return(
                            <div>
                                <ul onClick={() => {
                                    navigate(`/profile/${e.username}`);
                                }}>{e.username}</ul>
                                {!e.friend && <button onClick={() => {
                                    addFriend(e.username);
                                }}>Add Friend</button>}
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default Search;