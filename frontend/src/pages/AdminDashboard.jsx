import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TrendingUp, Bell, Users, PlusCircle, Pencil, Trash, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, users: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [noticesRes, usersRes] = await Promise.all([
        api.get('/notices?limit=50'),
        api.get('/users').catch(() => ({ data: { data: [] } }))
      ]);
      if (noticesRes.data.success) {
        setNotices(noticesRes.data.data);
        const data = noticesRes.data.data;
        setStats({
          total: data.length,
          active: data.filter(n => n.isActive).length,
          users: usersRes.data?.data?.length || 0
        });
      }
    } catch (error) {
      toast.error('Failed to fetch admin data');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this notice?')) {
      try {
        await api.delete(`/notices/${id}`);
        setNotices(notices.filter(n => n._id !== id));
        toast.success('Notice deleted');
      } catch (err) { toast.error('Failed to delete'); }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin/CR Panel</h1>
        <Button className="shadow-[0_0_15px_oklch(0.65_0.22_295/0.4)] transition-all">
          <PlusCircle className="mr-2 h-4 w-4" /> Post New Notice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Notices</p>
              <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded flex items-center gap-1 text-muted-foreground">
                 <TrendingUp className="w-3 h-3"/> +12.5%
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-4">{stats.total}</h3>
            <p className="text-xs text-muted-foreground">Trending up this month</p>
            <p className="text-xs text-muted-foreground/60">Notices for the last 6 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Notices</p>
              <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded flex items-center gap-1 text-muted-foreground">
                 -20%
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-4">{stats.active}</h3>
            <p className="text-xs text-muted-foreground">Down 20% this period</p>
            <p className="text-xs text-muted-foreground/60">Activity needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-muted-foreground">Students Reached</p>
              <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded flex items-center gap-1 text-muted-foreground">
                 <TrendingUp className="w-3 h-3"/> +12.5%
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-4">{stats.users}</h3>
            <p className="text-xs text-muted-foreground">Strong user retention</p>
            <p className="text-xs text-muted-foreground/60">Engagement exceed targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
              <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded flex items-center gap-1 text-muted-foreground">
                 <TrendingUp className="w-3 h-3"/> +4%
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-4">4.5%</h3>
            <p className="text-xs text-muted-foreground">Steady performance</p>
            <p className="text-xs text-muted-foreground/60">Meets growth projections</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {notices.map(notice => (
                  <tr key={notice._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{notice.title}</td>
                    <td className="px-6 py-4">{notice.category}</td>
                    <td className="px-6 py-4">{format(new Date(notice.createdAt), 'MMM dd')}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-accent hover:text-accent/80"><Pencil className="w-4 h-4 inline" /></button>
                      <button className="text-muted-foreground hover:text-foreground"><Archive className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(notice._id)} className="text-destructive hover:text-destructive/80"><Trash className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
