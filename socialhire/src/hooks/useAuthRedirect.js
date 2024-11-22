import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from '../firebaseConfig';

const useAuthRedirect = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is logged in
                setCurrentUser(user);
            } else {
                // No user is logged in
                navigate("/SignIn", { replace: true });
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]); 

    return { currentUser, loading };
};

export default useAuthRedirect;
