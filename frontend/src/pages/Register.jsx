import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { toast } from 'sonner';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', rollNumber: '', branch: '', year: '1', role: 'student'
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...formData, year: parseInt(formData.year) });
      navigate('/dashboard');
      toast.success('Registration successful');
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card/80 backdrop-blur shadow-2xl relative overflow-hidden border-border rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-accent to-primary" />
        <CardHeader className="space-y-1 mt-2">
          <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Join the centralized notice portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name *</label>
                <Input name="name" placeholder="John Doe" onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input name="email" type="email" placeholder="john@college.edu" onChange={handleChange} required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password *</label>
              <Input name="password" type="password" placeholder="••••••••" onChange={handleChange} required minLength={6} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Roll No.</label>
                <Input name="rollNumber" placeholder="EC102" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Branch</label>
                <Input name="branch" placeholder="IT" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Year (1-4)</label>
                <Input name="year" type="number" min="1" max="4" value={formData.year} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Account Role</label>
              <select 
                name="role" 
                onChange={handleChange} 
                defaultValue="student"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-primary/50"
              >
                <option value="student">Student (Read only)</option>
                <option value="cr">Class Representative (Can post notices)</option>
                <option value="teacher">Teacher (Can manage classrooms)</option>
              </select>
            </div>

            <Button type="submit" className="w-full h-12 text-md mt-4 shadow-[0_0_15px_oklch(0.65_0.22_295/0.2)]">Register Account</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
