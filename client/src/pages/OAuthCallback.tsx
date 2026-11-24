import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthCallback = () => {
  const { restoreSession, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // The refresh cookie was set by the server before the redirect
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (isLoading) return;
    navigate(isAuthenticated ? "/dashboard" : "/login?error=oauth", { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  return <p>Signing you in...</p>;
};

export default OAuthCallback;