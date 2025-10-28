import React from 'react';
import './PostCard.css';

const PostCard = ({ mediaUrl, mediaType, caption, userId, postId, likes, followers }) => {
    const isVerified = likes >= 1000000 && followers >= 1000000;
    // Inside PostCard.jsx or UserProfile.jsx, where username dey show
{user.followersCount >= 1000000 && (
  <span style={{ color: 'red', marginLeft: '5px' }}>✔️</span>
)}

    return (
        <div className="post-card">
            <div className="user-info">
                <p>
                    {userId} {isVerified && <span className="red-tick">✔</span>}
                    {/* Assuming you want to check for followers as well */}
                    {/* Add a followers prop and check here if needed */}
                </p>
            </div>
            {mediaType === 'video' ? (
                <video src={mediaUrl} controls className="media" />
            ) : (
                <img src={mediaUrl} alt="Post" className="media" />
            )}
            <p className="caption">{caption}</p>
            <div className="actions">
                <button>Like</button>
                <button>Comment</button>
                <button>Share</button>
                <button>Save</button>
            </div>
        </div>
    );
};

export default PostCard;