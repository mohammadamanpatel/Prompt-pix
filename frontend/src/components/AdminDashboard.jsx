import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/v1/userRoutes/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/v1/userRoutes/deleteForAdmin/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Control</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
        <div className="flex flex-col space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white p-4 border rounded shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar.secure_url}
                    alt={`${user.username}'s profile`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="text-xl font-semibold">{user.username}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
