import React from 'react';
import { Announcement, Role } from '../types/index';
import { Megaphone, AlertTriangle, Info, Calendar, User } from 'lucide-react';

interface AnnouncementListProps {
  announcements: Announcement[];
  role: Role;
  onCreateNew?: () => void;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (id: string) => void;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ 
  announcements, 
  role,
  onCreateNew,
  onEdit,
  onDelete
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500 text-white shadow-red-500/20';
      case 'MEDIUM': return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'LOW': return 'bg-blue-500 text-white shadow-blue-500/20';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return <AlertTriangle size={24} />;
      case 'MEDIUM': return <Megaphone size={24} />;
      case 'LOW': return <Info size={24} />;
      default: return <Megaphone size={24} />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'ด่วนมาก';
      case 'MEDIUM': return 'ปกติ';
      case 'LOW': return 'ทั่วไป';
      default: return priority;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto pb-32">
      <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg z-10 px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-end">
        <div>
          <h2 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">
            {role === 'ADMIN' ? 'จัดการประกาศ' : 'ประกาศและแจ้งเตือน'}
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Flood Management System</p>
        </div>
        {role === 'ADMIN' && onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-gold-600 text-white rounded-2xl font-black text-xs shadow-lg hover:bg-gold-700 transition-all active:scale-95"
          >
            + สร้างประกาศ
          </button>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        {announcements.map(announcement => (
          <div 
            key={announcement.id} 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-xl hover:scale-[1.01] group"
          >
            {announcement.image && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={announcement.image} 
                  alt={announcement.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-5">
              <div className="flex gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getPriorityColor(announcement.priority)}`}>
                  {getPriorityIcon(announcement.priority)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-900 dark:text-white text-base">{announcement.title}</h4>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                      announcement.priority === 'HIGH' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      announcement.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {getPriorityLabel(announcement.priority)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3 whitespace-pre-line">
                    {announcement.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{announcement.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(announcement.createdAt).toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>

                  {role === 'ADMIN' && (
                    <div className="flex gap-2 mt-4">
                      {!announcement.isPublished && (
                        <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-bold">
                          ร่าง
                        </span>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(announcement)}
                          className="px-4 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-gold-500 hover:text-white transition-all"
                        >
                          แก้ไข
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(announcement.id)}
                          className="px-4 py-1.5 text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          ลบ
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Megaphone size={32} className="text-slate-300 dark:text-slate-700" />
            </div>
            <p className="font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest text-xs">
              {role === 'ADMIN' ? 'ยังไม่มีประกาศ' : 'ไม่มีประกาศในขณะนี้'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementList;
