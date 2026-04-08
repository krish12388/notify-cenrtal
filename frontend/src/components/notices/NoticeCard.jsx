import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { categoryColors, categoryBorders } from '../../utils/categoryColors';
import { Calendar, User } from 'lucide-react';

const NoticeCard = ({ notice }) => {
  const badgeColorClass = categoryColors[notice.category] || categoryColors['General'];
  const borderColorClass = categoryBorders[notice.category] || categoryBorders['General'];
  
  return (
    <Card className="group hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-5 flex flex-col h-full justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <Badge className={badgeColorClass} variant="secondary">
              {notice.category}
            </Badge>
            {notice.priority === 'urgent' && (
              <Badge className="bg-destructive text-destructive-foreground animate-pulse shadow-[0_0_10px_oklch(0.57_0.19_25/0.4)]">
                URGENT
              </Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {notice.title}
          </h3>
          
          {/* Extract simple text if it contains HTML (basic implementation) */}
          <p className="text-sm text-muted-foreground line-clamp-2" 
             dangerouslySetInnerHTML={{ __html: notice.description.replace(/<[^>]*>?/gm, '') }}>
          </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(notice.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate max-w-[120px]">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{notice.postedBy?.name || 'Admin'}</span>
            </div>
          </div>
          
          <Link to={`/notice/${notice._id}`} className="mt-2 group-hover:text-primary transition-colors text-sm font-medium flex items-center justify-between w-full">
            <span>Read Full Notice</span>
            <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoticeCard;
