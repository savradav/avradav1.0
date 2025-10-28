import React, { useEffect, useState } from 'react';
import './followbutton.css';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";


const FollowButton = ({ targetUserId }) => {
const [isFollowing, setIsFollowing] = useState(false);
const [currentUserId, setCurrentUserId] = useState(null);

useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (user) {
            setCurrentUserId(user.uid);
        } else {
            setCurrentUserId(null);
        }
            setIsFollowing(Array.isArray(data.following) && data.following.includes(targetUserId));

    if (!auth.currentUser) return;

    setCurrentUserId(auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setIsFollowing(data.following?.includes(targetUserId));
        }
    });

    return () => unsubscribe();
}, [targetUserId]);
    return () => {
        unsubscribe();
        unsubscribeAuth();
    };
}, [targetUserId]);

const handleFollowToggle = async () => {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    if (isFollowing) {
        await updateDoc(currentUserRef, {
            following: arrayRemove(targetUserId),
        });
        await updateDoc(targetUserRef, {
            followers: arrayRemove(currentUserId),
        });
    } else {
        await updateDoc(currentUserRef, {
            following: arrayUnion(targetUserId),
        });
        await updateDoc(targetUserRef, {
            followers: arrayUnion(currentUserId),
        });
    }
};

return (
    <button
        onClick={handleFollowToggle}
        className={isFollowing ? 'follow-button unfollow' : 'follow-button follow'}
    >
        {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
);
};

export default FollowButton;
const FollowButtonWithCount = ({ userIdToFollow }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userIdToFollow || !currentUserId) return;

        const userDocRef = doc(db, "users", userIdToFollow);

        async function fetchFollowers() {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFollowersCount(data.followersCount || 0);
                setIsFollowing(data.followers?.includes(currentUserId));
            }
        }
        fetchFollowers();
    }, [userIdToFollow, currentUserId]);

    const handleFollowToggle = async () => {
        if (!currentUserId) {
            toast.error("Please sign in to follow users.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true,
            });
            setFollowersCount(prev => Math.max(prev - 1, 0));
            return;
        }

        const userDocRef = doc(db, "users", userIdToFollow);

        if (isFollowing) {
            await updateDoc(userDocRef, {
                followers: arrayRemove(currentUserId),
                followersCount: followersCount > 0 ? followersCount - 1 : 0,
            });
            setIsFollowing(false);
            const updatedDoc = await getDoc(userDocRef);
            if (updatedDoc.exists()) {
                const updatedData = updatedDoc.data();
                setFollowersCount(updatedData.followersCount || 0);
            }
        } else {
            await updateDoc(userDocRef, {
                followers: arrayUnion(currentUserId),
                followersCount: followersCount + 1,
            });
            setIsFollowing(true);
            const updatedDoc = await getDoc(userDocRef);
            if (updatedDoc.exists()) {
                const updatedData = updatedDoc.data();
                setFollowersCount(updatedData.followersCount || 0);
            }
        }
    };

    return (
        <button onClick={handleFollowToggle} style={{ marginTop: 5 }}>
            {isFollowing ? "Following" : "Follow"} ({followersCount})
        </button>
    );
};

export { FollowButtonWithCount };

toast.configure();
