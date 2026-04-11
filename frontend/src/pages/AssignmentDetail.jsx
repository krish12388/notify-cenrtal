import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { FileText, Download, CheckCircle, Upload as UploadIcon } from 'lucide-react';

const AssignmentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionFile, setSubmissionFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const asgRes = await api.get(`/assignments/${id}`);
      if (asgRes.data.success) {
        setAssignment(asgRes.data.assignment);
      }

      if (user?.role === 'teacher' || user?.role === 'admin') {
        const subRes = await api.get(`/assignments/${id}/submissions`);
        if (subRes.data.success) {
          setSubmissions(subRes.data.submissions);
        }
      } else {
        const mySubRes = await api.get(`/assignments/${id}/mysubmission`);
        if (mySubRes.data.success) {
          setMySubmission(mySubRes.data.submission);
        }
      }
    } catch (err) {
      toast.error('Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmission = async (e) => {
    e.preventDefault();
    if (!submissionFile) return toast.error('Please select a PDF file first');
    
    const formData = new FormData();
    formData.append('document', submissionFile);

    try {
      const res = await api.post(`/assignments/${id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Solution submitted successfully!');
        setSubmissionFile(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit solution');
    }
  };

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  if (loading) return <div>Loading...</div>;
  if (!assignment) return <div>Assignment not found</div>;

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const isPastDue = new Date() > new Date(assignment.dueDate);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{assignment.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Posted by {assignment.createdBy?.name} • Due: {new Date(assignment.dueDate).toLocaleString()}
              </p>
            </div>
            {isPastDue && <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-semibold">Past Due</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-md">
            <p className="whitespace-pre-wrap">{assignment.description}</p>
          </div>
          
          {assignment.documentUrl && (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Assignment Document</p>
                <p className="text-xs text-muted-foreground">PDF File</p>
              </div>
              <a 
                href={`${BASE_URL}${assignment.documentUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-primary hover:underline font-medium px-4 py-2 bg-primary/5 rounded-md"
              >
                <Download className="w-4 h-4" /> View / Download
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {!isTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Your Work</CardTitle>
          </CardHeader>
          <CardContent>
            {mySubmission ? (
              <div className="flex items-center gap-4 p-4 border border-green-500/30 bg-green-500/5 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div className="flex-1">
                  <p className="font-semibold text-green-700 dark:text-green-400">Turned in successfully</p>
                  <p className="text-sm text-muted-foreground">Submitted on: {new Date(mySubmission.submittedAt).toLocaleString()}</p>
                </div>
                <a 
                  href={`${BASE_URL}${mySubmission.documentUrl}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline font-medium px-4 py-2 bg-background border rounded-md"
                >
                  <FileText className="w-4 h-4" /> View Submission
                </a>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmission} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Upload Solution (PDF only)</label>
                  <div className="flex items-center gap-2 h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <UploadIcon className="w-4 h-4 text-muted-foreground" />
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={e => setSubmissionFile(e.target.files[0])}
                      className="w-full file:border-0 file:bg-transparent file:text-sm file:font-medium text-muted-foreground"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isPastDue && !mySubmission} className="h-12 px-6">
                  Turn In
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {isTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Submissions ({submissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Roll Number</th>
                      <th className="px-6 py-3">Submitted At</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, i) => (
                      <tr key={sub._id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-6 py-4 font-medium">{sub.studentId.name}</td>
                        <td className="px-6 py-4">{sub.studentId.rollNumber}</td>
                        <td className="px-6 py-4">{new Date(sub.submittedAt).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <a 
                            href={`${BASE_URL}${sub.documentUrl}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" /> View PDF
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssignmentDetail;
