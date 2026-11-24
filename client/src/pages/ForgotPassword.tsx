import { FormEvent, useState } from "react";
import { forgotPasswordRequest } from "../api/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await forgotPasswordRequest(email);
    setMessage(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Forgot password</h1>
      {message && <p>{message}</p>}
      <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Send reset link</button>
    </form>
  );
};

export default ForgotPassword;