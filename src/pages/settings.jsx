import React, { useEffect, useState } from 'react';
import { auth, db } from '../component/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Settings = () => {
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('Hidden for privacy');
const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const [aboutText] = useState(
        `Avradav Revival is a Christian platform built to help people overcome sin,
         share testimonies, and connect with others in faith through videos, blogs,
          and uplifting content And a  place of fun 
        chat are safe and secure they are encrypted and data saving.`
    );

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setEmail(data.email || '');
                setPhone(data.phone || '');
            }
        };
        fetchUserData();
    }, [userId]);

    const handleEmailUpdate = async () => {
        setMessage('');
        if (newEmail && userId) {
            try {
                await updateDoc(doc(db, 'users', userId), {
                    email: newEmail
                });
                setEmail(newEmail);
                setNewEmail('');
                setMessage('Email updated successfully!');
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    if (!userId) return <p>Please sign in to access settings.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Settings</h2>

            <div>
                <p><strong>Email:</strong> {email}</p>
                <input
                    type="email"
                    placeholder="Update email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <button onClick={handleEmailUpdate}>Update Email</button>
            </div>
            {message && <p>{message}</p>}

            <div>
                <p><strong>Phone:</strong> Hidden for privacy</p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3>About Avradav Revival</h3>
                <p>coming soon</p>
            </div>
        </div>
    );
};

export default Settings;