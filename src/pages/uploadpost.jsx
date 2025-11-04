import React, { useState } from 'react';

const MAX_FILE_SIZE_MB = 50; // Maximum file size in MB
import { storage, db, auth } from '../component/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const UploadPost = () => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async () => {
        if (!file) return alert('Select a file first!');
        const validMediaTypes = ['image', 'video'];
        const fileType = file.type.split('/')[0];
        if (!validMediaTypes.includes(fileType)) {
            return alert('Unsupported file type. Please upload an image or video.');
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return alert(`File size must be under ${MAX_FILE_SIZE_MB}MB.`);
        }

        setUploading(true);
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progressValue = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progressValue);
            },
            (error) => {
                console.error(error);
                alert('An error occurred during upload. Please try again.');
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                await addDoc(collection(db, 'posts'), {
                    mediaUrl: downloadURL,
                    caption: caption,
                    mediaType: file.type.startsWith('video') ? 'video' : 'image',
                    userId: auth.currentUser?.uid || 'anonymous',
                    createdAt: serverTimestamp(),
                    likes: 0,
                });

                alert('Post uploaded!');
                setFile(null);
                setCaption('');
                setUploading(false);
                setProgress(0);
            }
        );
    };

    return (
        <div>
            <h2>Upload Post</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpload();
                }}
            >
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        const validMediaTypes = ['image', 'video'];
                        if (selectedFile) {
                            const fileType = selectedFile.type.split('/')[0];
                            if (!validMediaTypes.includes(fileType)) {
                                alert('Unsupported file type. Please upload an image or video.');
                                e.target.value = null; // Reset the input
                                return;
                            }
                            setFile(selectedFile);
                        }
                    }}
                />
                <br />
                <textarea
                    placeholder="Enter a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <br />
                {uploading && <progress value={progress} max="100">{progress}%</progress>}
                <br />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default UploadPost;