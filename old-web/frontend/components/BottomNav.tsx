
import React from 'react';
import { Role, AppView, ReportType } from '../types/index';
import { Map as MapIcon, List, Megaphone, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

interface BottomNavProps {
  role: Role;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  resetForm: () => void;
  setReportType: (type: ReportType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ role, currentView, setCurrentView, resetForm, setReportType }) => {
  const NavBtn = ({ icon, label, active, onClick }: any) => (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-2xl transition-all duration-300 ${
        active 
        ? 'text-gold-600 dark:text-gold-400 bg-gold-500/10' 
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
      }`}
    >
      {React.cloneElement(icon, { size: 22, strokeWidth: active ? 2.5 : 2 })}
      <span className="text-[10px] font-bold tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] p-4 flex justify-center pointer-events-none">
      <div className="w-fit max-w-lg space-x-4 glass border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl p-1.5 flex justify-around items-center pointer-events-auto overflow-visible">
        {role === 'CITIZEN' && (
          <>
            <NavBtn icon={<MapIcon />} label="แผนที่" active={currentView === 'MAP'} onClick={() => setCurrentView('MAP')} />
            
            {/* Two elevated action buttons */}
            <div className="flex gap-3 -translate-y-6">
              {/* SOS Emergency Button */}
              <button 
                onClick={() => { setReportType('SOS'); setCurrentView('FORM'); resetForm(); }}
                className="flex flex-col items-center justify-center w-16 h-16 bg-red-500 rounded-2xl shadow-xl shadow-red-500/30 border-4 border-white dark:border-slate-900 hover:scale-110 active:scale-95 transition-all"
              >
                <Bell size={20} className="text-white mb-0.5" strokeWidth={2.5} />
                <span className="text-white font-black text-[8px] leading-none tracking-tight">SOS</span>
              </button>
              
              {/* Report Incident Button (Traffic/Flooding) */}
              <button 
                onClick={() => { setReportType('TRAFFIC'); setCurrentView('FORM'); resetForm(); }}
                className="flex flex-col items-center justify-center w-16 h-16 bg-cyan-400 rounded-2xl shadow-xl shadow-cyan-400/30 border-4 border-white dark:border-slate-900 hover:scale-110 active:scale-95 transition-all"
                title="แจ้งเหตุน้ำท่วม/ถนน"
              >
                <AlertTriangle size={20} className="text-white mb-0.5" strokeWidth={2.5} />
                <span className="text-white font-black text-[7px] leading-none tracking-tight text-center">แจ้งเหตุ</span>
              </button>
            </div>

            <NavBtn icon={<Megaphone />} label="ประกาศ" active={currentView === 'ANNOUNCEMENTS'} onClick={() => setCurrentView('ANNOUNCEMENTS')} />
          </>
        )}
        {(role === 'OFFICER' || role === 'ADMIN') && (
          <>
            <NavBtn 
              icon={<MapIcon />} 
              label={role === 'ADMIN' ? "สั่งการ" : "แผนที่"} 
              active={currentView === 'MAP'} 
              onClick={() => setCurrentView('MAP')} 
            />
            <NavBtn 
              icon={role === 'ADMIN' ? <CheckCircle /> : <List />} 
              label={role === 'ADMIN' ? "วิเคราะห์" : "งาน"} 
              active={currentView === 'LIST' || currentView === 'STATS'} 
              onClick={() => role === 'ADMIN' ? setCurrentView('STATS') : setCurrentView('LIST')} 
            />
            {role === 'OFFICER' && (
              <NavBtn 
                icon={<AlertTriangle />} 
                label="แจ้งเหตุ" 
                active={currentView === 'FORM'} 
                onClick={() => { setCurrentView('FORM'); resetForm(); }} 
              />
            )}
            {role === 'ADMIN' && (
              <>
                <NavBtn 
                  icon={<List />} 
                  label="ใบงาน" 
                  active={currentView === 'LIST'} 
                  onClick={() => setCurrentView('LIST')} 
                />
                <NavBtn 
                  icon={<Megaphone />} 
                  label="ประกาศ" 
                  active={currentView === 'ANNOUNCEMENTS'} 
                  onClick={() => setCurrentView('ANNOUNCEMENTS')} 
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BottomNav;
