import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs, updateDoc, doc, query, limit, addDoc } from 'firebase/firestore';
import { FaHeart, FaComment, FaUserPlus, FaCheckCircle } from 'react-icons/fa';

export default function ForYou() {
    const [posts, setPosts] = useState([]);

// Container for centering and max width
const containerStyle = { maxWidth: "600px", margin: "0 auto", padding: "20px" };
    
    useEffect(() => {
        const fetchPosts = async () => {
            const postsRef = collection(db, 'posts');
            const postQuery = query(postsRef, limit(10)); // Fetch only 10 documents
            const postSnapshot = await getDocs(postQuery);
            const postsData = postSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsData);
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId, likes) => {
        if (typeof likes !== 'number' || isNaN(likes)) {
            alert("Invalid number of likes.");
            return;
        }
        const postRef = doc(db, 'posts', postId);
        try {
            await updateDoc(postRef, { likes: likes + 1 });
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, likes: likes + 1 } : post
                )
            );
        } catch (error) {
            alert("Failed to like post.");
        }
    };

    const handleFollow = async (userId) => {
        if (!userId) {
            alert("User ID is not available.");
            return;
        }
        try {
            const followersRef = collection(db, 'followers');
            const newFollower = {
                userId: userId,
                followedAt: new Date().toISOString(),
            };
            await addDoc(followersRef, newFollower);
            alert(`Successfully followed user: ${userId}`);
        } catch (error) {
            console.error("Error following user:", error);
            alert("Failed to follow user. Please try again.");
        }
    };

    return (
        <div className="p-4">
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <img
                            src={post.userPhoto}
                            className="w-10 h-10 rounded-full"
                            alt="User"
                        />
                        <p>{post.username}</p>
                        {typeof post.followers === 'number' && post.followers >= 1000000 && (
                            <FaCheckCircle className="text-red-500 ml-2" title="Verified" />
                        )}
                        <button
                            onClick={() => handleFollow(post.userId)}
                            className="ml-auto text-blue-600"
                        >
                            <FaUserPlus />
                        </button>
                    </div>
                    {post.fileType === 'video' ? (
                        <video
                            controls
                            src={post.fileURL}
                            className="w-full rounded-lg mt-2"
                        />
                    ) : post.fileType === 'image' ? (
                        <img src={post.fileURL} className="w-full rounded-lg mt-2" alt="" />
                    ) : (
                        <p className="text-gray-500 mt-2">Unsupported file type</p>
                    )}
                    <div className="flex gap-6 mt-4">
                        <button onClick={() => handleLike(post.id, post.likes)}>
                            <FaHeart className="text-red-500" /> {post.likes} Likes
                        </button>
                        <button>
                            <FaComment className="text-blue-500" /> Comments
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}