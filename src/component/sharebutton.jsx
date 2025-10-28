import React from 'react';

const ShareButton = ({ postId }) => {
    const sharePost = async () => {
        const postUrl = `${window.location.origin}/post/${postId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this post on Avradav Revival!',
                    text: 'This blessed me. 🙌',
                    url: postUrl,
                });
                alert('Shared successfully!');
            } catch (error) {
                console.log('Share cancelled', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(postUrl);
                alert('Link copied to clipboard!');
            } catch (err) {
                alert('Unable to copy link');
            }
        }
    };

    return (
        <button onClick={sharePost} style={{ marginLeft: '8px', padding: '6px 12px' }}>
            Share
        </button>
    );
};

export default ShareButton;