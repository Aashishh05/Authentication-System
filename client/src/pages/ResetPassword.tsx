import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { resetPasswordRequest } from "../api/auth.api";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If no token in URL, redirect to login
  if (!token) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await resetPasswordRequest(token, password);
      navigate("/login");
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.message ?? "Reset failed" : "Reset failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Reset password</h1>
      {error && <p role="alert">{error}</p>}
      <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
      <button type="submit">Update password</button>
    </form>
  );
};

export default ResetPassword;