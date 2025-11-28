// ManageUsersPanel.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function ManageUsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // id awaiting confirmation
  const { user } = useAuth();
  const currentUserId = user?.user_id;

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.user_id !== id));
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="mt-4 p-4 border border-slate-700 rounded bg-slate-800 text-sm">
      <h3 className="font-semibold mb-2 text-gray-200">Users</h3>
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {users.length === 0 && <li className="text-gray-400">No users found.</li>}
          {users.map(u => {
            const isSelf = u.user_id === currentUserId;
            return (
              <li key={u.user_id} className="flex items-center justify-between bg-slate-700/40 px-2 py-1 rounded gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-gray-200 truncate text-sm">
                    {u.username} {isSelf && <span className="text-xs text-blue-400">(You)</span>}
                  </span>
                  <span className="text-[10px] text-gray-400 flex gap-2">
                    <span>ID: {u.user_id}</span>
                    <span className={"px-1 rounded bg-slate-600/60 text-[10px] " + (u.system_role ? 'text-amber-300' : 'text-gray-400')}>{u.system_role || 'No Role'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!isSelf && (
                    confirmId === u.user_id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(u.user_id)}
                          disabled={deletingId === u.user_id}
                          className="text-[10px] px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                        >
                          {deletingId === u.user_id ? "Deleting..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          disabled={deletingId === u.user_id}
                          className="text-[10px] px-2 py-1 rounded bg-slate-600 hover:bg-slate-500 text-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(u.user_id)}
                        className="text-[10px] px-2 py-1 rounded bg-red-500/80 hover:bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex justify-end mt-3">
        <button
          onClick={refresh}
          disabled={loading}
          className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-gray-200 disabled:opacity-40"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
