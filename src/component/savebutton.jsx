import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const SaveButton = ({ postId }) => {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkIfSaved = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const saved = docSnap.data().savedPosts || [];
                setIsSaved(saved.includes(postId));
            }
        };
        checkIfSaved();
    }, [postId]);

    const toggleSave = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please sign in to save posts.');
            return;
        }

        const userRef = doc(db, 'users', user.uid);
        try {
            await updateDoc(userRef, {
                savedPosts: isSaved ? arrayRemove(postId) : arrayUnion(postId)
            });
            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Error updating saved posts:', error);
        }
    };

    return (
        <button onClick={toggleSave} style={{ marginLeft: '8px', padding: '6px 12px' }}>
            {isSaved ? 'Unsave' : 'Save'}
        </button>
    );
};

export default SaveButton;