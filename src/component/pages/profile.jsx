import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

const Profile = () => {
    // State variable to store the currently authenticated user's information.
    // State variable to store the user's posts. Each post is an object with properties like 'caption', 'fileUrl', and 'type'.
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const q = query(collection(db, 'posts'), where('userId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const userPosts = [];

                querySnapshot.forEach(async (doc) => {
                    const data = doc.data();
                    const fileUrl = await getDownloadURL(ref(storage, data.filePath));
                    userPosts.push({ ...data, fileUrl });
                });

                setPosts(userPosts);
            }
        });

        return () => unsubscribe();
    }, []);

    const renderPostMedia = (post) => {
        if (post.type === 'video') {
            return <video src={post.fileUrl} controls width="200" />;
        }
        return <img src={post.fileUrl} alt="Post" width="200" />;
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Your Profile</h1>
            {user && (
                <>
                    <p>Email: {user.email}</p>
                    <h2 className="mt-4 text-lg font-semibold">Your Posts</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {posts.map((post, index) => (
                            <div key={index}>
                                {renderPostMedia(post)}
                                <p>{post.caption}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
// Inside Profile.jsx or UserProfile.jsx

import { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

export const FollowersFollowing = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowData = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setFollowers(userDoc.data().followers || []);
        setFollowing(userDoc.data().following || []);
      }
    };
    fetchFollowData();
  }, [userId]);

  return (
    <div>
      <h3>Followers ({followers.length})</h3>
      <ul>{followers.map((f, i) => <li key={i}>{f}</li>)}</ul>

      <h3>Following ({following.length})</h3>
      <ul>{following.map((f, i) => <li key={i}>{f}</li>)}</ul>
    </div>
  );
};
