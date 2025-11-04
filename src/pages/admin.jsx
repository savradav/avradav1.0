import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../component/firebase';

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
    };
    getUsers();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>Email: {user.email}</p>
          <p>Followers: {user.followersCount}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Admin;
