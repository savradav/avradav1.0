import React, { useEffect, useState } from 'react';
import { auth, db } from '../component/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const UserProfile = () => {
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            fetchUserPosts(currentUser.uid);
        }
    }, []);

    const fetchUserPosts = async (uid) => {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', uid));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);
    };

    const handleFollow = () => {
        setFollowers(prev => prev + 1);
    };

    const handleLike = (id) => {
        setPosts(posts.map(post =>
            post.id === id ? { ...post, likes: (post.likes || 0) + 1 } : post
        ));
    };

    const handleComment = (id, comment) => {
        // Simplified: You would store this to Firestore in a real app
        alert(`Comment on ${id}: ${comment}`);
    };
// Inside PostCard.jsx or UserProfile.jsx, where username dey show
{user.followersCount >= 1000000 && (
  <span style={{ color: 'red', marginLeft: '5px' }}>✔️</span>
)}

    return (
        <div style={{ padding: 20 }}>
            <h2>{user?.displayName || "Your Profile"}</h2>
            <p>Followers: {followers}</p>
            <button onClick={handleFollow}>Follow</button>

            <div style={{ marginTop: 20 }}>
                {posts.map(post => (
                    <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 20, padding: 10 }}>
                        <h3>{post.caption || "No caption"}</h3>
                        {post.mediaType === 'video' ? (
                            <video width="300" controls src={post.mediaUrl}></video>
                        ) : (
                            <img width="300" src={post.mediaUrl} alt="User upload" />
                        )}
                        <p>Likes: {post.likes || 0}</p>
                        <button onClick={() => handleLike(post.id)}>Like</button>
                        <button onClick={() => handleComment(post.id, prompt("Enter comment"))}>Comment</button>
                        <button onClick={() => alert('Saved!')}>Save</button>
                        <button onClick={() => alert('Sharing...')}>Share</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserProfile;