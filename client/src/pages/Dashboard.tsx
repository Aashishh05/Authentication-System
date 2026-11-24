import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout, hasRole } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      {!user?.isVerified && <p>Please verify your email.</p>}

      {hasRole("admin") && <Link to="/admin">Admin panel</Link>}
      {hasRole("admin", "moderator") && <p>You can moderate content.</p>}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;