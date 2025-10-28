import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { encryptText, decryptText } from '../utils/encryption';

const secret = "SecretKey2024";
const originalMessage = "You can be saved from  all sins";

// Encrypt
const encryptedMessage = encryptText(originalMessage, secret);

// Decrypt
const decryptedMessage = decryptText(encryptedMessage, secret);

console.log("Encrypted:", encryptedMessage);
console.log("Decrypted:", decryptedMessage);

const sinTypes = [
    "Lust",
    "Stealing",
    "Lying",
    "Pride",
    "Anger",
    "Addiction",
    "Jealousy",
    "Hatred",
    "Disobedience",
    "Unforgiveness"
];
const solutions = [
    "Pray for strength and guidance.",
    "Seek accountability from a trusted friend.",
    "Read scripture related to overcoming sin.",
    "Practice forgiveness and let go of grudges.",
    "Engage in community service to shift focus.",
    "Attend counseling or support groups.",
    "Meditate on God's word daily.",
    "Avoid triggers that lead to temptation.",
    "Cultivate gratitude to combat jealousy.",
    "Focus on humility to counter pride."
];
const sinSolutions = [
    "1 Corinthians 10:13 - God provides a way out of temptation.",
    "Ephesians 4:28 - Work hard and share with those in need.",
    "Proverbs 12:22 - The Lord detests lying lips.",
    "Proverbs 16:18 - Pride goes before destruction.",
    "James 1:19 - Be quick to listen, slow to speak, and slow to become angry.",
    "1 Corinthians 6:12 - Everything is permissible, but not everything is beneficial.",
    "James 3:16 - Where jealousy and selfish ambition exist, there is disorder.",
    "1 John 2:9 - Whoever claims to be in the light but hates a brother or sister is still in the darkness.",
    "Ephesians 6:1 - Children, obey your parents in the Lord, for this is right.",
    "Matthew 6:14 - For if you forgive other people when they sin against you, your heavenly Father will also forgive you."
];
import { db, auth } from '../firebase'; 
const Testimony = () => {
    const [showSins, setShowSins] = useState(false);
    const [selectedSin, setSelectedSin] = useState(null);
    const [description, setDescription] = useState('');
    const [solution, setSolution] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [testimonies, setTestimonies] = useState([]);
    const [video, setVideo] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchTestimonies = async () => {
        if (!selectedSin) return;
        const q = query(collection(db, 'testimonies'), where('sinType', '==', selectedSin));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTestimonies(data);
    };

    // Video upload handler
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Only allow video files
        if (!file.type.startsWith('video/')) {
            alert('Only video files are allowed.');
            return;
        }
        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
            alert('Video size must be less than 10MB.');
            return;
        }
        setVideo(file);
    };

    const handleVideoUpload = async () => {
        if (!video) return '';
        setUploading(true);
        try {
            // Use Firebase Storage for video uploads
            const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
            const storage = getStorage();
            const videoRef = ref(storage, `testimony_videos/${Date.now()}_${video.name}`);
            // Upload the video
            const snapshot = await uploadBytes(videoRef, video);
            // Get the download URL
            const url = await getDownloadURL(snapshot.ref);
            setVideoUrl(url);
            return url;
        } catch (err) {
            alert('Video upload failed.');
            return '';
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        let uploadedVideoUrl = '';
        if (video) {
            uploadedVideoUrl = await handleVideoUpload();
            if (!uploadedVideoUrl) return; // Stop if upload failed
        }
        try {
            await addDoc(collection(db, 'testimonies'), {
                sinType: selectedSin,
                description,
                solution,
                isAnonymous,
                userId: auth.currentUser?.uid || 'anonymous',
                timestamp: Timestamp.now(),
                videoUrl: uploadedVideoUrl
            });
            setDescription('');
            setSolution('');
            setVideo(null);
            setVideoUrl('');
            fetchTestimonies();
            alert('Testimony posted!');
        } catch (err) {
            console.error('Error posting testimony:', err);
        }
    };

    useEffect(() => {
        fetchTestimonies();
        // eslint-disable-next-line
    }, [selectedSin]);

    return (
        <div className="centered">
            {/* Page Content */}
            <div style={{ padding: 20 }}>
                <h2>Testimony Section</h2>
                <button onClick={() => setShowSins(!showSins)}>
                    {showSins ? 'Hide Sins' : 'Show Sins & Solutions'}
                </button>

                {showSins && (
                    <div style={{ marginTop: 10 }}>
                        {sinTypes.map((sin, index) => (
                            <button key={index} style={{ margin: 5 }} onClick={() => setSelectedSin(sin)}>
                                {sin}
                            </button>
                        ))}
                    </div>
                )}

                {selectedSin && (
                    <div style={{ marginTop: 20 }}>
                        <h3>{selectedSin} Testimonies</h3>

                        <textarea
                            placeholder="Write your testimony..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            style={{ width: '100%', marginBottom: 10 }}
                        />

                        <textarea
                            placeholder="How did you overcome it? Include Bible reference if prefered."
                            value={solution}
                            onChange={(e) => setSolution(e.target.value)}
                            rows={3}
                            style={{ width: '100%', marginBottom: 10 }}
                        />

                        <div style={{ marginBottom: 10 }}>
                            <label>
                                <strong>Upload Video Testimony (max 20MB):</strong>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    disabled={uploading}
                                    style={{ display: 'block', marginTop: 5 }}
                                />
                            </label>
                            {video && (
                                <div>
                                    <small>Selected: {video.name} ({(video.size / (1024 * 1024)).toFixed(2)} MB)</small>
                                </div>
                            )}
                        </div>

                        <label>
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={() => setIsAnonymous(!isAnonymous)}
                            />
                            Post Anonymously
                        </label>

                        <button onClick={handleSubmit} style={{ display: 'block', marginTop: 10 }} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Submit Testimony'}
                        </button>

                        <div style={{ marginTop: 20 }}>
                            {testimonies.map((t, i) => (
                                <div key={i} style={{ border: '1px solid gray', padding: 10, marginTop: 10 }}>
                                    <p><strong>Posted by:</strong> {t.isAnonymous ? 'Anonymous' : t.userId}</p>
                                    <p><strong>Description:</strong> {t.description}</p>
                                    <p><strong>Solution:</strong> {t.solution}</p>
                                    {t.videoUrl && (
                                        <div style={{ marginTop: 10 }}>
                                            <video
                                                src={t.videoUrl}
                                                controls
                                                style={{ maxWidth: '100%', maxHeight: 300, background: '#000' }}
                                                onError={() => alert('This video cannot be played (may be corrupt or removed).')}
                                            >
                                                Sorry, your browser doesn't support embedded videos.
                                            </video>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        );
    };
    
    export default Testimony;