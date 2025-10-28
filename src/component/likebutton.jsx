import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {

doc,
updateDoc,
arrayUnion,
arrayRemove,
onSnapshot,
} from 'firebase/firestore';

const LikeButton = ({ postId }) => {
const [likes, setLikes] = useState([]);
const [hasLiked, setHasLiked] = useState(false);

useEffect(() => {
    const postRef = doc(db, 'posts', postId);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const likesArray = data.likes || [];
            setLikes(likesArray);
            setHasLiked(auth.currentUser && likesArray.includes(auth.currentUser.uid));
        }
    });

    return () => unsubscribe();
}, [postId]);

const toggleLike = async () => {
    const postRef = doc(db, 'posts', postId);
    if (!auth.currentUser) return;

    if (hasLiked) {
        await updateDoc(postRef, {
            likes: arrayRemove(auth.currentUser.uid),
        });
    } else {
        await updateDoc(postRef, {
            likes: arrayUnion(auth.currentUser.uid),
        });
    }
};

return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
            onClick={toggleLike}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                marginRight: '8px',
            }}
        >
            {hasLiked ? '❤️' : '🤍'}
        </button>
        <span>{likes.length}</span>
    </div>
);
};

export default LikeButton;