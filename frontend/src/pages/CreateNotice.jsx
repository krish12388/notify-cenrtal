import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../services/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const CreateNotice = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', category: 'General', priority: 'normal',
    targetType: 'all', targetValue: ''
  });
  const [description, setDescription] = useState('');

  const categories = ['Academic', 'Exam', 'Event', 'Holiday', 'Urgent', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !description) {
      return toast.error('Title and description are required.');
    }
    
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description,
        category: formData.category,
        priority: formData.priority,
        targetAudience: JSON.stringify(
          formData.targetType === 'all' ? { type: 'all' } : { type: formData.targetType, [formData.targetType]: formData.targetValue }
        )
      };
      
      const res = await api.post('/notices', payload);
      if (res.data.success) {
        toast.success("Notice published successfully!");
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create notice');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4 border-b border-border mb-6">
          <CardTitle className="text-2xl font-bold">Create New Notice</CardTitle>
          <p className="text-muted-foreground text-sm">Publish an announcement to students across the college.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                placeholder="Enter a descriptive title..." 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <div className="bg-card rounded-md">
                <ReactQuill 
                  theme="snow" 
                  value={description} 
                  onChange={setDescription} 
                  className="h-64 mb-12"
                  placeholder="Format your notice content here..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border mt-12">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="px-8 shadow-sm">
                {loading ? 'Publishing...' : 'Publish Notice'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNotice;
