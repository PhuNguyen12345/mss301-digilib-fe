import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const currentUser = useAuthStore((state) => state.user);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/api/v1/members');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      await apiClient.put(`/api/v1/members/${memberId}/status`, { status: newStatus });
      fetchUsers(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin / Librarian Dashboard</h1>
      <p className="mb-4">Logged in as: {currentUser?.email}</p>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Name</th>
              <th className="p-4">Roles</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.firstName} {u.lastName}</td>
                <td className="p-4">{u.roles?.join(', ')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${u.status === 'UNLOCKED' ? 'bg-green-100 text-green-800' : 
                      u.status === 'SOFT_LOCKED' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <select 
                    className="border rounded p-1"
                    value={u.status}
                    onChange={(e) => handleStatusChange(u.id, e.target.value)}
                  >
                    <option value="UNLOCKED">UNLOCKED</option>
                    <option value="SOFT_LOCKED">SOFT_LOCKED</option>
                    <option value="LOCKED">LOCKED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
