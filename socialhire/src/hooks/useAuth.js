import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use react-router-dom for navigation
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig"; // Import auth from firebaseConfig.js

export const useAuth = () => {
  const [user, loading] = useAuthState(auth); // Check user state with firebase-hooks
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/SignIn"); // Redirect to /SignIn if no user
    }
  }, [user, loading, navigate]);

  return { user, loading };
};