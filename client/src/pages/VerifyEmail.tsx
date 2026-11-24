import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmailRequest } from "../api/auth.api";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) return;
    verifyEmailRequest(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") return <p>Verifying...</p>;
  if (status === "error") return <p>This link is invalid or expired.</p>;
  return <p>Email verified. <Link to="/login">Log in</Link></p>;
};

export default VerifyEmail;