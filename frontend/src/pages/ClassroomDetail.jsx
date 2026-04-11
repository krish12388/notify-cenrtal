import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const ClassroomDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Creation
  const [showCreateAsg, setShowCreateAsg] = useState(false);
  const [asgData, setAsgData] = useState({ title: '', description: '', dueDate: '' });
  const [asgFile, setAsgFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const crRes = await api.get(`/classrooms/${id}`);
      if (crRes.data.success) {
        setClassroom(crRes.data.classroom);
      }
      
      const asgRes = await api.get(`/assignments/classroom/${id}`);
      if (asgRes.data.success) {
        setAssignments(asgRes.data.assignments);
      }
    } catch (err) {
      toast.error('Failed to load classroom details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', asgData.title);
    formData.append('description', asgData.description);
    formData.append('classroomId', id);
    formData.append('dueDate', asgData.dueDate);
    if (asgFile) {
      formData.append('document', asgFile);
    }

    try {
      const res = await api.post(`/assignments/classroom/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Assignment created');
        setShowCreateAsg(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!classroom) return <div>Classroom not found</div>;

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 relative">
        {classroom.classId && (
          <div className="absolute top-6 right-6 bg-background px-4 py-2 rounded-lg border shadow-sm text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class ID</p>
            <p className="font-mono text-xl font-bold tracking-wider text-primary">{classroom.classId}</p>
          </div>
        )}
        <h1 className="text-3xl font-bold text-primary pr-32">{classroom.name}</h1>
        <p className="text-muted-foreground mt-2">Branch: {classroom.branch} | Year: {classroom.year}</p>
        <p className="text-sm mt-1 font-medium">Teacher: {classroom.teacher?.name}</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold border-b pb-2 w-full flex justify-between">
            Assignments
            {isTeacher && (
              <Button size="sm" onClick={() => setShowCreateAsg(!showCreateAsg)}>
                {showCreateAsg ? 'Cancel' : 'Add Assignment'}
              </Button>
            )}
          </h2>
        </div>

        {showCreateAsg && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <Input placeholder="Assignment Title" required value={asgData.title} onChange={e => setAsgData({ ...asgData, title: e.target.value })} />
                <textarea 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  placeholder="Description" 
                  rows="3"
                  required
                  value={asgData.description}
                  onChange={e => setAsgData({ ...asgData, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Input type="datetime-local" required value={asgData.dueDate} onChange={e => setAsgData({ ...asgData, dueDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Upload PDF (Optional)</label>
                    <Input type="file" accept="application/pdf" onChange={e => setAsgFile(e.target.files[0])} />
                  </div>
                </div>
                <Button type="submit">Post Assignment</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {assignments.length === 0 && <p className="text-muted-foreground">No assignments yet.</p>}
          {assignments.map(asg => (
            <Card key={asg._id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">{asg.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Due: {new Date(asg.dueDate).toLocaleString()}</p>
                </div>
                <Button variant="outline" onClick={() => navigate(`/assignments/${asg._id}`)}>
                  View Details
                </Button>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm">{asg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;
