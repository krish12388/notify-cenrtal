import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', branch: '', year: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        branch: user.branch || '',
        year: user.year || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        setUser(res.data.data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) return;
    try {
      const res = await api.delete('/users/profile');
      if (res.data.success) {
        toast.success("Account deleted successfully");
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Email (Read Only)</label>
              <Input value={user?.email || ''} readOnly className="bg-muted text-muted-foreground" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input value={user?.role?.toUpperCase() || ''} readOnly className="bg-muted text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Input name="branch" value={formData.branch} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input name="year" type="number" value={formData.year} onChange={handleChange} />
              </div>
            </div>
            <Button type="submit" className="mt-4">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="border-none bg-destructive/10 border-l-4 border-l-destructive">
         <CardHeader>
           <CardTitle className="text-destructive">Danger Zone</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-sm text-muted-foreground mb-4">Deleting your account is permanent.</p>
           <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
         </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
