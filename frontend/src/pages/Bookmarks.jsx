import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NoticeCard from '../components/notices/NoticeCard';
import { Bookmark as BookmarkIcon } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/bookmarks');
      if (res.data.success) {
        setBookmarks(res.data.data.filter(b => b.notice)); // filter out null notices
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        <p className="text-muted-foreground text-sm">Notices you've saved for later.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(n => <div key={n} className="h-48 bg-card border border-border rounded-xl"></div>)}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <NoticeCard key={bookmark._id} notice={bookmark.notice} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center">
          <BookmarkIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No bookmarks yet</p>
          <p className="text-muted-foreground/60 text-sm">When you bookmark a notice, it will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
