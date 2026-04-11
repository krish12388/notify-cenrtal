import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const ClassroomsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // For teachers creating a classroom
  const [showCreate, setShowCreate] = useState(new URLSearchParams(location.search).get('create') === 'true');
  const [formData, setFormData] = useState({ name: '', branch: '', year: '1' });

  // For students/cr joining a classroom
  const [showJoin, setShowJoin] = useState(false);
  const [joinId, setJoinId] = useState('');

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await api.get('/classrooms');
      if (res.data.success) {
        setClassrooms(res.data.classrooms);
      }
    } catch (err) {
      toast.error('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms', { ...formData, year: parseInt(formData.year) });
      if (res.data.success) {
        toast.success('Classroom created');
        setShowCreate(false);
        fetchClassrooms();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create classroom');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms/join', { id: joinId });
      if (res.data.success) {
        toast.success('Joined classroom successfully');
        setShowJoin(false);
        setJoinId('');
        fetchClassrooms();
      }
    } catch (err) {
      console.log('Join error:', err);
      toast.error(err.response?.data?.message || 'Failed to join classroom. Check ID.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <Card key={n} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4 border-b border-border">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Classrooms</h1>
        <div>
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <Button onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? 'Cancel' : 'Create Classroom'}
            </Button>
          )}
          {(user?.role === 'student' || user?.role === 'cr') && (
            <Button onClick={() => setShowJoin(!showJoin)}>
              {showJoin ? 'Cancel' : 'Join Classroom'}
            </Button>
          )}
        </div>
      </div>

      {showCreate && (
        <Card className="mb-6 border-primary/50">
          <CardHeader>
            <CardTitle>Create New Classroom</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Classroom Name (e.g. CS 3rd Year Data Structures)" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <Input placeholder="Branch (e.g. CS)" required value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} />
                <Input type="number" min="1" max="4" required placeholder="Year" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {showJoin && (
        <Card className="mb-6 border-primary/50">
          <CardHeader>
            <CardTitle>Join Classroom</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="flex gap-4">
                <Input placeholder="Enter Classroom ID (Ask your teacher)" required value={joinId} onChange={e => setJoinId(e.target.value)} className="flex-1" />
                <Button type="submit">Join</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {classrooms.length === 0 ? (
        <div className="text-center text-muted-foreground p-10 bg-card/50 rounded-xl border border-border">
          <p>No classrooms found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map(cr => (
            <Card key={cr._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/classrooms/${cr._id}`)}>
              <CardHeader className="bg-primary/5 pb-4 border-b border-border">
                <CardTitle>{cr.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{cr.branch} - Year {cr.year}</p>
              </CardHeader>
              <CardContent className="pt-4 flex justify-between items-end gap-2">
                <div>
                  <p className="text-sm"><strong>Teacher:</strong> {cr.teacher?.name || 'Unknown'}</p>
                </div>
                <div className="bg-muted px-3 py-1 rounded-md border border-border shrink-0 max-w-[50%] overflow-hidden">
                  <p className="text-xs font-mono font-bold text-primary truncate" title={cr.classId || cr._id}>
                    ID: {cr.classId || cr._id}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassroomsList;
