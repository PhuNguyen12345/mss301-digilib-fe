import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProfilePage = () => {
  const { user, fetchProfile, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatarKey: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatarKey: user.avatarKey || ''
      });
    } else {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch('/api/v1/members/me', formData);
      setMessage('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  if (!user) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="destructive" onClick={logout}>Logout</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <Label>Email (Read-only)</Label>
          <Input value={user.email} disabled />
        </div>
        <div>
          <Label>Role (Read-only)</Label>
          <Input value={user.roles?.join(', ')} disabled />
        </div>
        <div>
          <Label>Status (Read-only)</Label>
          <Input value={user.status} disabled />
        </div>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Edit Information</h2>
        {message && <p className="text-sm font-medium text-blue-600">{message}</p>}
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="avatarKey">Avatar Key/URL</Label>
          <Input id="avatarKey" value={formData.avatarKey} onChange={handleChange} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default ProfilePage;
