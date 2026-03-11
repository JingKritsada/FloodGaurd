
import React, { useState } from 'react';
import { Incident, Role, TicketStatus } from '../types/index';
import { TYPE_LABELS } from '../constants/index';
import { PlusCircle, Navigation, AlertTriangle, X, Waves, List, ChevronRight, Users, Phone, MapPin, Clock } from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
  role: Role;
  onStatusUpdate: (id: string, status: TicketStatus) => void;
  onViewOnMap: (incident: Incident) => void;
}

const IncidentList: React.FC<IncidentListProps> = ({ incidents, role, onStatusUpdate, onViewOnMap }) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketStatus>('ALL');

  const filteredIncidents = statusFilter === 'ALL' 
    ? incidents 
    : incidents.filter(i => i.status === statusFilter);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-red-500 text-white shadow-red-500/20';
      case 'IN_PROGRESS': return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'RESOLVED': return 'bg-emerald-500 text-white shadow-emerald-500/20';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto pb-32">
      <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg z-10 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">
              {role === 'OFFICER' ? 'งานที่ได้รับ' : role === 'ADMIN' ? 'ใบงานทั้งหมด' : 'ประกาศและแจ้งเตือน'}
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Sukhothai Region</p>
          </div>
          <span className="text-[10px] bg-gold-500/10 text-gold-600 dark:text-gold-400 px-3 py-1 rounded-full font-black border border-gold-500/20">
            {filteredIncidents.filter(i => i.status !== 'RESOLVED').length} ACTIVE
          </span>
        </div>

        {/* Status Filter */}
        {(role === 'OFFICER' || role === 'ADMIN') && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'ALL', label: 'ทั้งหมด' },
              { id: 'OPEN', label: 'รอความช่วยเหลือ' },
              { id: 'IN_PROGRESS', label: 'กำลังช่วยเหลือ' },
              { id: 'RESOLVED', label: 'เสร็จสิ้น' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id as any)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  statusFilter === filter.id
                    ? 'bg-gold-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        {filteredIncidents.slice().reverse().map(inc => (
          <div key={inc.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:scale-[1.01] group">
             <div className="flex gap-4">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getStatusColor(inc.status)}`}>
                 {inc.type === 'MEDICAL' && <PlusCircle size={28} />}
                 {inc.type === 'SUPPLIES' && <Navigation size={28} />}
                 {inc.type === 'EVACUATION' && <AlertTriangle size={28} />}
                 {inc.type === 'ROAD_BLOCKED' && <X size={28} />}
                 {inc.type === 'LEVEE_BREACH' && <Waves size={28} />}
                 {inc.type === 'RISK_AREA' && <AlertTriangle size={28} />}
               </div>
               
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start mb-1">
                   <h4 className="font-black text-slate-900 dark:text-white text-base truncate">{TYPE_LABELS[inc.type] || inc.type}</h4>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">#{inc.id.slice(-4)}</span>
                 </div>
                 <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug mb-3">{inc.description}</p>
                 
                 {/* Additional Info */}
                 <div className="grid grid-cols-2 gap-2 mb-3">
                   {inc.victimCount !== undefined && inc.victimCount > 0 && (
                     <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                       <Users size={14} className="text-amber-500" />
                       <span className="font-bold">{inc.victimCount} คน</span>
                       {inc.hasBedridden && <span className="text-red-500 font-black">⚠</span>}
                     </div>
                   )}
                   {inc.phone && (
                     <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                       <Phone size={14} className="text-blue-500" />
                       <span className="font-medium">{inc.phone}</span>
                     </div>
                   )}
                   {inc.address && (
                     <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 col-span-2">
                       <MapPin size={14} className="text-green-500" />
                       <span className="font-medium truncate">{inc.address}</span>
                     </div>
                   )}
                   <div className="flex items-center gap-1.5 text-xs text-slate-400 col-span-2">
                     <Clock size={14} />
                     <span className="font-medium">
                       {new Date(inc.timestamp).toLocaleString('th-TH', { 
                         year: 'numeric',
                         month: 'short', 
                         day: 'numeric',
                         hour: '2-digit', 
                         minute: '2-digit' 
                       })}
                     </span>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                     <button 
                       onClick={() => onViewOnMap(inc)}
                       className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-gold-500 hover:text-white transition-all group-hover:bg-gold-500 group-hover:text-white"
                     >
                       <Navigation size={18} />
                     </button>
                     {(role === 'OFFICER' || role === 'ADMIN') && inc.status !== 'RESOLVED' && (
                       <button 
                        onClick={() => onStatusUpdate(inc.id, inc.status === 'OPEN' ? 'IN_PROGRESS' : 'RESOLVED')}
                        className={`px-6 py-2 rounded-xl font-black text-xs transition-all shadow-md ${
                          inc.status === 'OPEN' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-emerald-600 text-white'
                        }`}
                       >
                         {inc.status === 'OPEN' ? (role === 'ADMIN' ? 'จ่ายงาน' : 'รับงาน') : 'ปิดงาน'}
                       </button>
                     )}
                   </div>
                 </div>
               </div>
             </div>
          </div>
        ))}

        {filteredIncidents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <List size={32} className="text-slate-300 dark:text-slate-700" />
            </div>
            <p className="font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest text-xs">
              {statusFilter === 'ALL' ? 'No Official Announcements' : 'ไม่พบรายการ'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
