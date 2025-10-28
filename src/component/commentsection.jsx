import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

const CommentSection = ({ postId }) => {
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, 'posts', postId, 'comments'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAllComments(commentsData);
        });

        return () => unsubscribe();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) return alert("You must be logged in to comment.");

        if (comment.trim() === '') return;

        await addDoc(collection(db, 'posts', postId, 'comments'), {
            text: comment,
            user: auth.currentUser.email,
            createdAt: Timestamp.now(),
        });

        setComment('');
    };

    return (
        <div style={{ borderTop: '1px solid #ccc', marginTop: 20 }}>
            <h4>Comments</h4>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    style={{ width: '80%', padding: 8 }}
                />
                <button type="submit" style={{ padding: 8, marginLeft: 4 }}>
                    Post
                </button>
            </form>
            <div style={{ marginTop: 10 }}>
                {allComments.map((com) => (
                    <div key={com.id} style={{ marginBottom: 8 }}>
                        <strong>{com.user}</strong>: {com.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;