// Importing necessary libraries and hooks
import { useEffect } from "react"; // React's effect hook to handle side effects
import { useAuthState } from "react-firebase-hooks/auth"; // Firebase hook for tracking authentication state
import { useNavigate } from "react-router-dom"; // Hook for navigation within React Router
import { auth } from "../firebaseConfig"; // Firebase authentication instance from the app's configuration

// Custom hook to redirect logged-in users to the "/Main" route
const useRedirectIfLoggedIn = () => {
    // Destructures authentication state and loading flag from `useAuthState`
    const [user, loading] = useAuthState(auth); 
    // `user`: Current authenticated user object (if logged in)
    // `loading`: Indicates whether Firebase is still checking the authentication state

    const navigate = useNavigate(); // React Router hook for programmatic navigation

    // Effect to handle redirection logic
    useEffect(() => {
        if (!loading && user) { 
            // Check if Firebase is done loading and a user is authenticated
            navigate("/Main"); // Redirect the authenticated user to the "/Main" page
        }
    }, [user, loading, navigate]); 
    // Dependencies array: Ensures the effect re-runs when `user`, `loading`, or `navigate` changes
};

// Export the hook for use in other components
export default useRedirectIfLoggedIn;
