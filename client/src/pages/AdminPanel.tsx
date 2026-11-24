import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const { user } = useAuth();

  // This calls the admin-only endpoint /api/admin/users
  // Protection is enforced by the backend authorize("middleware")
  import { api } from "../api/axios";

  const [users, setUsers] = useState<any[]>( []);

  // Note: In a full app, you'd fetch this in useEffect on component mount
  // For now, we'll just show the user info
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.name} (Admin)</p>
      <p>Role: {user?.role}</p>
      <button onClick={() => logout()}>Logout</button>

      <h2>Users</h2>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};

export default AdminPanel;