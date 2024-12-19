import { useState, useEffect } from 'react';
import { db } from 'firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const useGetMessagesOrdered = (chatId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const messagesData = [];
                querySnapshot.forEach((doc) => {
                    messagesData.push(doc.data());
                });
                setMessages(messagesData);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Cleanup on unmount
    }, [chatId]);

    return { messages, loading, error };
};
