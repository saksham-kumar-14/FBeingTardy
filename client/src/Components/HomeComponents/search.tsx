import React, { useState } from 'react';
import axios from 'axios';

interface props{
    user: any,
    setUser: Function
}

const Search : React.FC<props> = ({user, setUser}) => {
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<any>([]);

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
            friends: user.friends
        }).then(() => {
            setUser(user)
            loadUsers();
        }).catch((err) => {
            console.error(err);
            alert("Error occured");
        });
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
                                <ul>{e.username}</ul>
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