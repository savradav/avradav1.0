import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../component/firebase';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, "users");
            const snapshot = await getDocs(usersRef);
            const filtered = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.username && user.username.toLowerCase().includes(query.toLowerCase()));
            setResults(filtered);
        };
        fetchUsers();
    }, [query]);

    return (
        <div>
            <input
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <ul>
                {results.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default Search;