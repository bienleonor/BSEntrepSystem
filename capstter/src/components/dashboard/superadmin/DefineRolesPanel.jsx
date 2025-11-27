// DefineRolesPanel.jsx
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";

export default function DefineRolesPanel() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameQuery, setUsernameQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/auth/roles");
      setRoles(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Live suggestions on input change (debounced)
  useEffect(() => {
    if (!usernameQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.get('/users/search', { params: { q: usernameQuery.trim(), limit: 8 } });
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [usernameQuery]);

  const handleSelectSuggestion = (s) => {
    setFoundUser(s);
    setUsernameQuery(s.username);
    setShowSuggestions(false);
    setFeedback(null);
  };

  const clearFoundUser = () => {
    setFoundUser(null);
    setUsernameQuery('');
    setSelectedRoleId('');
    setSuggestions([]);
    setShowSuggestions(false);
    setFeedback(null);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setFeedback(null);
    if (!foundUser?.user_id || !selectedRoleId) return;
    setUpdating(true);
    try {
      const roleObj = roles.find(r => r.system_role_id.toString() === selectedRoleId);
      if (!roleObj) {
        setFeedback({ type: 'error', msg: 'Invalid role selected' });
      } else {
        await axiosInstance.post('/auth/upgrade-role', { user_id: Number(foundUser.user_id), role: roleObj.role });
        setFeedback({ type: 'success', msg: 'Role updated successfully' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: err.response?.data?.error || err.message || 'Update failed' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-slate-700 rounded bg-slate-800 text-sm">
      <h3 className="font-semibold mb-3 text-gray-200">Define / Assign Roles</h3>
      {loading && <p className="text-gray-400">Loading roles...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && (
        <>
          <ul className="space-y-1 max-h-40 overflow-y-auto pr-1 mb-4">
            {roles.length === 0 && <li className="text-gray-400">No roles found.</li>}
            {roles.map(r => (
              <li key={r.system_role_id} className="bg-slate-700/40 px-2 py-1 rounded flex items-center justify-between">
                <span className="text-gray-200 text-xs font-medium">{r.role}</span>
                <span className="text-[10px] text-gray-400">ID: {r.system_role_id}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 mb-3 relative">
            <div className="flex flex-col">
              <label className="text-[11px] text-gray-400 mb-1">Search Username</label>
              <input
                type="text"
                value={usernameQuery}
                onChange={(e) => setUsernameQuery(e.target.value)}
                className="bg-slate-700 text-gray-200 px-2 py-1 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter username"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-700 rounded mt-1 max-h-40 overflow-y-auto z-10 text-xs">
                  {suggestions.map(s => (
                    <li
                      key={s.user_id}
                      onClick={() => handleSelectSuggestion(s)}
                      className="px-2 py-1 cursor-pointer hover:bg-slate-700 flex justify-between"
                    >
                      <span className="text-gray-200 truncate">{s.username}</span>
                      <span className="text-[10px] text-gray-400">ID {s.user_id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {foundUser && (
            <div className="mb-4 text-xs text-gray-300 flex items-center justify-between bg-slate-700/40 px-2 py-2 rounded">
              <span>Found: <strong className="text-blue-400">{foundUser.username}</strong> (ID {foundUser.user_id})</span>
              <button
                onClick={clearFoundUser}
                className="text-[10px] px-2 py-1 rounded bg-slate-600 hover:bg-slate-500 text-gray-200"
              >Clear</button>
            </div>
          )}
          <form onSubmit={handleAssign} className="space-y-2">
            <div className="flex flex-col">
              <label className="text-[11px] text-gray-400 mb-1">Select Role</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="bg-slate-700 text-gray-200 px-2 py-1 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- choose role --</option>
                {roles.map(r => (
                  <option key={r.system_role_id} value={r.system_role_id}>{r.role}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={updating || !foundUser?.user_id || !selectedRoleId}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium py-2 rounded"
            >
              {updating ? 'Updating...' : 'Assign Role'}
            </button>
            {feedback && (
              <p className={`text-[11px] mt-1 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.msg}</p>
            )}
          </form>
        </>
      )}
      <p className="text-[10px] text-gray-500 mt-3">Roles are managed centrally. Use this tool to update a user's system role.</p>
    </div>
  );
}
