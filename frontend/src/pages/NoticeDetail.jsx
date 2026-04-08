import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { categoryColors } from '../utils/categoryColors';
import { ArrowLeft, User, Calendar, BookmarkPlus, BookmarkCheck, Paperclip } from 'lucide-react';
import { toast } from 'sonner';

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotice();
    checkBookmark();
  }, [id]);

  const fetchNotice = async () => {
    try {
      const res = await api.get(`/notices/${id}`);
      if (res.data.success) setNotice(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load notice');
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const res = await api.get('/bookmarks');
      if (res.data.success) {
        setIsBookmarked(res.data.data.some(b => b.notice === id || b.notice._id === id));
      }
    } catch (error) {}
  };

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setIsBookmarked(false);
        toast('Bookmark removed');
      } else {
        await api.post(`/bookmarks/${id}`);
        setIsBookmarked(true);
        toast.success('Notice bookmarked!');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) return <div className="animate-pulse space-y-4 max-w-4xl mx-auto"><div className="h-64 bg-card rounded-xl"></div></div>;
  if (!notice) return <div className="text-center mt-20 text-muted-foreground">Notice not found.</div>;

  const badgeColorClass = categoryColors[notice.category] || categoryColors['General'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/dashboard" className="inline-flex items-center text-primary hover:underline font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
      </Link>
      
      <Card className="rounded-2xl border-border bg-card shadow-2xl relative overflow-hidden">
        {notice.priority === 'urgent' && <div className="absolute top-0 left-0 w-full h-2 bg-destructive shadow-[0_0_15px_var(--destructive)]"></div>}
        
        <CardHeader className="p-8 border-b border-border pb-6 relative">
          <button 
            onClick={toggleBookmark}
            className={`absolute top-8 right-8 p-2 rounded-full transition-colors ${isBookmarked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-6 h-6" /> : <BookmarkPlus className="w-6 h-6" />}
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
             <Badge className={badgeColorClass}>{notice.category}</Badge>
             {notice.priority === 'urgent' && <Badge className="bg-destructive text-destructive-foreground">URGENT</Badge>}
          </div>

          <CardTitle className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{notice.title}</CardTitle>
          
          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(new Date(notice.createdAt), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              <span>Posted by <span className="font-medium text-foreground">{notice.postedBy?.name || 'Admin'}</span></span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="prose prose-invert max-w-none text-foreground/90 prose-a:text-primary" 
               dangerouslySetInnerHTML={{ __html: notice.description }}>
          </div>
          
          {notice.attachments?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-muted-foreground" /> Attachments
              </h4>
              <div className="flex flex-wrap gap-3">
                {notice.attachments.map((file, idx) => (
                  <a key={idx} href={`http://localhost:5000${file.url}`} target="_blank" rel="noreferrer"
                     className="px-4 py-2 rounded-lg bg-input border border-border flex items-center gap-2 text-sm hover:border-primary/50 transition-colors">
                     {file.filename}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoticeDetail;
