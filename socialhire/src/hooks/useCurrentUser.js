// Hook will check if user is loggend in
// Fetch User's data
// Return user data

// src/hooks/useCurrentUser.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;

                if (user) { /* TODO  check code*/
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setCurrentUser(userDoc.data());
                    } else {
                        setError('User not found in the database');
                    }
                } else {
                    setError('No user is logged in');
                }
            } catch (err) {
                setError('Error fetching user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { currentUser, loading, error };
};

export default useCurrentUser;
