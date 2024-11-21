import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { auth } from '../firebaseConfig';

const useAuthRedirect = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is logged in
                setCurrentUser(user);
            } else {
                // No user is logged in, redirect to SignIn
                <Navigate to="/SignIn" replace={true} />
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    });

    return { currentUser, loading };
};

export default useAuthRedirect;
