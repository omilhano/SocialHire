import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Check if user is logged in
                if (!auth.currentUser) {
                    setError('No user is logged in');
                    navigate('/signin'); // Redirect to the login page
                    return;
                }

                const user = auth.currentUser;

                // Fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setCurrentUser(userDoc.data());
                } else {
                    setError('User not found in the database');
                }
            } catch (err) {
                setError('Error fetching user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    return { currentUser, loading, error };
};

export default useCurrentUser;
