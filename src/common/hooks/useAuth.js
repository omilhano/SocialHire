// Importing necessary libraries and hooks
import { useEffect } from "react"; // React's effect hook for performing side effects in components
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation in React Router
import { useAuthState } from "react-firebase-hooks/auth"; // Firebase hook to track authentication state
import { auth } from "firebaseConfig"; // Firebase authentication instance from the app's configuration

// Custom hook for managing user authentication state and navigation
export const useAuth = () => {
  // Destructuring the authentication state and loading state from `useAuthState`
  const [user, loading] = useAuthState(auth); 
  // `user`: current authenticated user (if logged in)
  // `loading`: indicates whether Firebase is still checking the authentication state

  const navigate = useNavigate(); // Hook to navigate between routes in the app

  // useEffect for handling side effects based on authentication state
  useEffect(() => {
    if (!loading && !user) { 
      // When Firebase is done loading and no user is authenticated:
      navigate("/SignIn"); // Redirect the user to the sign-in page
    }
  }, [user, loading, navigate]); 
  // Dependencies: Effect re-runs whenever `user`, `loading`, or `navigate` changes

  // Return the `user` and `loading` states for use in other components
  return { user, loading }; 
};
