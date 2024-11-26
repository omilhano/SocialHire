// useFirebase.js

import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, getDocs, doc } from 'firebase/firestore';

// Custom hook for fetching ordered messages
export const useGetMessagesOrdered = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);  // To show loading state
  const [error, setError] = useState(null);  // For error handling

  useEffect(() => {
    if (!chatId) return;  // Ensure that chatId is provided before trying to fetch messages

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const chatRef = doc(db, 'chats', chatId); // Reference to the specific chat document
        const messagesRef = collection(chatRef, 'messages');  // Reference to the messages subcollection
        
        const q = query(messagesRef, orderBy('timestamp', 'asc'));  // Query to order messages by timestamp
        
        const querySnapshot = await getDocs(q);  // Fetch the query snapshot
        const fetchedMessages = querySnapshot.docs.map(doc => doc.data());  // Map the documents to message data
        
        setMessages(fetchedMessages);  // Set the messages state with the fetched messages
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err);  // Set error state if there’s any issue
      } finally {
        setLoading(false);  // Set loading to false once fetching is done
      }
    };

    fetchMessages();
  }, [chatId]);  // Only re-run the effect if chatId changes

  return { messages, loading, error };
};
