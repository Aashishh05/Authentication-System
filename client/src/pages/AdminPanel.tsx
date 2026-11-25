import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/admin/users")
      .then((res) => setUsers(res.data.users))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.name} (Admin)</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>

      <h2>Users</h2>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};

export default AdminPanel;