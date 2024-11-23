import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; 

const useRedirectIfLoggedIn = () => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate("/Main"); // Redirect to Main if user is logged in
        }
    }, [user, loading, navigate]);
};

export default useRedirectIfLoggedIn;
