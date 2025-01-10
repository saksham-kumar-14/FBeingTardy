import React, { useState } from 'react';
import axios from 'axios';

const Search : React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<any>([]);

    async function loadUsers(){
        const res = await axios.get('http://localhost:3001/users');
        const data = await res.data;
        setSearchResult(data);
    }

    return(
        <div>
            <div>
                <input type="text"
                placeholder="Search for a user"
                value={search} 
                onChange={(e) => setSearch(e.target.value)} />
                <button onClick={loadUsers}>Search</button>
            </div>

            <div>
                <h2>Search Result</h2>
                <div>
                    {searchResult.map((user: any)=>{
                        return(
                            <div>
                                <ul>{user.username}</ul>

                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default Search;