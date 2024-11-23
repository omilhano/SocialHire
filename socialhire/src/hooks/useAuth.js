import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig"; 

export const useAuth = () => {
  const [user, loading] = useAuthState(auth); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/SignIn"); // Redirect to /SignIn if no user
    }
  }, [user, loading, navigate]);

  return { user, loading };
};