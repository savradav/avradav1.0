import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../component/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { encryptText, decryptText } from '../utils/encryption';

const secret = "SecretKey2024";
const originalMessage = "Jesus saves all sinners";

// Encrypt
const encryptedMessage = encryptText(originalMessage, secret);

// Decrypt
const decryptedMessage = decryptText(encryptedMessage, secret);

console.log("Encrypted:", encryptedMessage);
console.log("Decrypted:", decryptedMessage);

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, 'chatMessages'), orderBy('createdAt'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
            scrollToBottom();
        });
        return () => unsubscribe();
        // eslint-disable-next-line
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (newMsg.trim() === '') return;
        await addDoc(collection(db, 'chatMessages'), {
            text: newMsg,
            uid: auth.currentUser?.uid || 'unknown',
            displayName: auth.currentUser?.displayName || 'Anonymous',
            createdAt: serverTimestamp()
        });
        setNewMsg('');
        scrollToBottom();
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
            <h2>Avradav Chat Room</h2>
            <div style={{ height: 400, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ marginBottom: 10 }}>
                        <b>{msg.displayName}:</b> {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message..."
                style={{ width: '80%', padding: 8, marginTop: 10 }}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>
                Send
            </button>
        </div>
    );
}