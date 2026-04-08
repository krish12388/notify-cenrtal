import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import NoticeCard from '../components/notices/NoticeCard';
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  const categories = ['All', 'Academic', 'Exam', 'Event', 'Holiday', 'Urgent', 'General'];

  useEffect(() => {
    fetchNotices();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (socket) {
      socket.on('new-notice', (notice) => {
        setNotices((prev) => [notice, ...prev]);
      });
      socket.on('urgent-notice', (notice) => {
        setNotices((prev) => [notice, ...prev]);
      });
      socket.on('notice-deleted', (noticeId) => {
        setNotices((prev) => prev.filter(n => n._id !== noticeId));
      });
      socket.on('notice-updated', (updatedNotice) => {
        setNotices((prev) => prev.map(n => n._id === updatedNotice._id ? updatedNotice : n));
      });

      return () => {
        socket.off('new-notice');
        socket.off('urgent-notice');
        socket.off('notice-deleted');
        socket.off('notice-updated');
      };
    }
  }, [socket]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (activeCategory !== 'All') queryParams.append('category', activeCategory);
      if (searchQuery) queryParams.append('search', searchQuery);
      
      const res = await api.get(`/notices?${queryParams.toString()}`);
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Latest Notices</h1>
          <p className="text-muted-foreground text-sm">Stay updated with the latest college announcements.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_10px_oklch(0.65_0.22_295/0.4)]' 
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="h-48 bg-card border border-border rounded-xl"></div>
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <NoticeCard key={notice._id} notice={notice} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground text-lg">No notices found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
