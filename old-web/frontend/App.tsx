
import React, { useState, useEffect } from 'react';
import { Role, Incident, Location, IncidentType, TicketStatus, AppView, OfficerReportMode, RoadStatus, Shelter, ReportType, Announcement } from './types/index';
import api from './api';
import { FILTER_LABELS } from './constants/index';

import AppBar from './components/AppBar';
import BottomNav from './components/BottomNav';
import MapBoard from './components/MapBoard';
import StatsDashboard from './components/StatsDashboard';
import IncidentList from './components/IncidentList';
import IncidentModal from './components/IncidentModal';
import ReportForm from './components/ReportForm';
import LoginModal from './components/LoginModal';
import AnnouncementList from './components/AnnouncementList';
import AnnouncementForm from './components/AnnouncementForm';
import authService from './src/services/auth';

import { Map as MapIcon, AlertCircle, Navigation, Info, Bell, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  // --- Global State ---
  const [role, setRole] = useState<Role>('CITIZEN');
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('MAP');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [roads, setRoads] = useState<RoadStatus[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [mapFilter, setMapFilter] = useState<'ALL' | 'SOS' | 'TRAFFIC' | 'SHELTER' | 'WATER'>('ALL');
  const [filterToast, setFilterToast] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseInt(saved) : 100;
  });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as any) || 'light';
  });

  // --- Theme Logic ---
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Font Size Logic ---
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  // --- Handlers ---
  const handleStatusUpdate = (id: string, newStatus: TicketStatus) => {
    // Optimistic UI update
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }

    // Send update to backend (requires auth)
    (async () => {
      try {
        await api.patch(`/incidents/${id}/status`, { status: newStatus });
      } catch (e) {
        console.error('Failed to update status', e);
      }
    })();
  };

  const handleFilterChange = (filter: 'ALL' | 'SOS' | 'TRAFFIC' | 'SHELTER' | 'WATER') => {
    setMapFilter(filter);
    setFilterToast(FILTER_LABELS[filter]);
  };

  useEffect(() => {
    if (filterToast) {
      const timer = setTimeout(() => setFilterToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [filterToast]);

  const resetForm = () => {
    setFormLocation(null);
    setDraftPoints([]);
    setFormDesc('');
    setOfficerReportMode('NONE');
    setVictimCount(1);
    setHasBedridden(false);
    setPhone('');
    setAddress('');
    setSelectedAnnouncement(null);
  };

  const [officerReportMode, setOfficerReportMode] = useState<OfficerReportMode>('NONE');
  const [reportType, setReportType] = useState<ReportType>('SOS');
  const [formLocation, setFormLocation] = useState<Location | null>(null);
  const [draftPoints, setDraftPoints] = useState<Location[]>([]);
  const [formType, setFormType] = useState<IncidentType>('MEDICAL');
  const [formDesc, setFormDesc] = useState('');
  const [victimCount, setVictimCount] = useState<number>(1);
  const [hasBedridden, setHasBedridden] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const handleSubmitReport = async () => {
    let finalLocation = formLocation;
    let pathData: Location[] | undefined = undefined;

    if (officerReportMode === 'ROAD_CLOSURE') {
       if (draftPoints.length < 2) return;
       finalLocation = draftPoints[0]; 
       pathData = draftPoints;
    }

    if (!finalLocation) return;

    const payload: any = {
      type: officerReportMode === 'ROAD_CLOSURE' ? 'ROAD_BLOCKED' : (officerReportMode === 'LEVEE' ? 'LEVEE_BREACH' : formType),
      status: 'OPEN',
      description: formDesc || (officerReportMode === 'ROAD_CLOSURE' ? 'แจ้งปิดการจราจร' : 'แจ้งเหตุทั่วไป'),
      location: { latitude: finalLocation.lat, longitude: finalLocation.lng },
    };
    if (pathData && pathData.length > 0) {
      payload.path = pathData.map(p => ({ lat: p.lat, lng: p.lng }));
    }
    
    // Add new fields for citizen reports
    if (role === 'CITIZEN' || officerReportMode === 'GENERAL') {
      payload.victimCount = victimCount;
      payload.hasBedridden = hasBedridden;
      payload.phone = phone;
      payload.address = address;
    }

    console.log('📤 Submitting incident:', payload);

    try {
      const res = await api.post('/incidents', payload);
      console.log('✅ Response from API:', res);
      
      // map backend incident to frontend Incident
      const inc = res;
      const normalizePathSingle = (rawPath: any) => {
        if (!rawPath) return undefined;
        return rawPath.map((p: any) => Array.isArray(p) ? { lat: p[0], lng: p[1] } : { lat: p.lat ?? p.latitude, lng: p.lng ?? p.longitude });
      };

      const mapped: Incident = {
        id: inc._id || inc.id || String(Date.now()),
        type: inc.type,
        status: inc.status,
        description: inc.description,
        location: { lat: inc.location?.latitude ?? inc.location?.lat, lng: inc.location?.longitude ?? inc.location?.lng },
        timestamp: new Date(inc.createdAt || inc.created_at || Date.now()).getTime(),
        reporterName: (inc.reporterName as string) || 'พลเมืองดี',
        path: normalizePathSingle(inc.path),
        victimCount: inc.victimCount,
        hasBedridden: inc.hasBedridden,
        phone: inc.phone,
        address: inc.address
      };
      
      console.log('📝 Mapped incident:', mapped);
      setIncidents(prev => [...prev, mapped]);
      setCurrentView('MAP');
      resetForm();
      alert('✅ บันทึกข้อมูลสำเร็จ!');
    } catch (error) {
      console.error('❌ Failed to submit report', error);
      alert('❌ ไม่สามารถบันทึกข้อมูลได้: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Helper to filter incidents for Announcements
  const filteredIncidents = role === 'CITIZEN' 
    ? incidents.filter(i => i.reporterName === 'เจ้าหน้าที่ภาคสนาม' || i.reporterName === 'หน่วยกู้ภัยที่ 1')
    : incidents;

  // Announcement handlers
  const handleCreateAnnouncement = async (data: Partial<Announcement>) => {
    try {
      // Debug: ตรวจสอบ token
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'มี token' : 'ไม่มี token');
      console.log('Current User Role:', currentUserRole);
      console.log('Role:', role);
      
      if (!token) {
        alert('กรุณา Login ก่อนสร้างประกาศ');
        return;
      }

      const payload = {
        ...data,
        createdBy: currentUserRole || 'ADMIN'
      };
      const newAnnouncement = await api.post('/announcements', payload);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setCurrentView('ANNOUNCEMENTS');
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error('Failed to create announcement', error);
      alert('ไม่สามารถสร้างประกาศได้: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdateAnnouncement = async (data: Partial<Announcement>) => {
    if (!selectedAnnouncement) return;
    try {
      const updated = await api.patch(`/announcements/${selectedAnnouncement.id}`, data);
      setAnnouncements(prev => prev.map(a => a.id === selectedAnnouncement.id ? updated : a));
      setCurrentView('ANNOUNCEMENTS');
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error('Failed to update announcement', error);
      alert('ไม่สามารถอัปเดตประกาศได้');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('ต้องการลบประกาศนี้?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete announcement', error);
      alert('ไม่สามารถลบประกาศได้');
    }
  };

  // Load initial data
  useEffect(() => {
    (async () => {
      try {
        console.log('🔄 Fetching initial data...');
        const incs = await api.get('/incidents?limit=100');  // Fetch up to 100 incidents
        console.log('📥 Raw incidents from API:', incs);
        
        const normalizePath = (rawPath: any) => {
          if (!rawPath) return undefined;
          return rawPath.map((p: any) => {
            if (Array.isArray(p) && p.length >= 2) return { lat: p[0], lng: p[1] };
            return { lat: p.lat ?? p.latitude, lng: p.lng ?? p.longitude };
          });
        };

        const mapped = (incs || []).map((inc: any) => ({
          id: inc._id || inc.id,
          type: inc.type,
          status: inc.status,
          description: inc.description,
          location: { lat: inc.location.latitude, lng: inc.location.longitude },
          timestamp: new Date(inc.createdAt || inc.created_at).getTime(),
          reporterName: inc.reporterName || 'พลเมืองดี',
          path: normalizePath(inc.path),
          victimCount: inc.victimCount,
          hasBedridden: inc.hasBedridden,
          phone: inc.phone,
          address: inc.address
        }));
        
        console.log('📝 Mapped incidents:', mapped);
        setIncidents(mapped);
        
        // Show summary
        const summary = mapped.reduce((acc: any, inc: any) => {
          acc[inc.type] = (acc[inc.type] || 0) + 1;
          return acc;
        }, {});
        console.log('📊 Incidents Summary:', summary);
        console.log('Total incidents loaded:', mapped.length);

        const r = await api.get('/roads');
        setRoads(r || []);
        const s = await api.get('/shelters');
        setShelters(s || []);
        const ann = await api.get('/announcements');
        setAnnouncements(ann || []);
      } catch (e) {
        console.error('Failed to load initial data', e);
      }
    })();
    // load token role
    const roleFromToken = authService.decodeTokenRole();
    if (roleFromToken) {
      setCurrentUserRole(roleFromToken);
      // map to local Role if present
      if (roleFromToken === 'เจ้าหน้าที่' || roleFromToken === 'OFFICER') setRole('OFFICER');
      if (roleFromToken === 'ADMIN') setRole('ADMIN');
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      <AppBar 
        role={role}
        setRole={setRole}
        setCurrentView={setCurrentView}
        resetForm={resetForm}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onAuthClick={() => setLoginOpen(true)}
        onLogout={() => { authService.logout(); setCurrentUserRole(null); setRole('CITIZEN'); }}
        currentUserRole={currentUserRole}
      />

      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onLoginSuccess={(r) => { 
          setCurrentUserRole(r); 
          if (r === 'เจ้าหน้าที่' || r === 'OFFICER') {
            setRole('OFFICER');
            setCurrentView('LIST');
          } 
          if (r === 'ADMIN' || r === 'ศูนย์บัญชาการ') {
            setRole('ADMIN');
            setCurrentView('STATS');
          }
          setLoginOpen(false);
        }} 
      />

      <main className="flex-1 relative overflow-hidden flex flex-col">
        {currentView === 'MAP' && (
          <div className="flex-1 relative">
            <MapBoard 
              incidents={incidents} 
              shelters={shelters} 
              roads={roads}
              interactive={false}
              filter={mapFilter}
              onMarkerClick={(inc) => setSelectedIncident(inc)}
            />
            
            {/* Map Filters Overlay - Icon Only with Tooltips */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-[500]">
              <button 
                onClick={() => handleFilterChange('ALL')} 
                title="แสดงทั้งหมด"
                className={`flex items-center justify-center rounded-2xl shadow-lg border border-white/20 glass transition-all active:scale-95 hover:scale-110 ${mapFilter === 'ALL' ? 'text-gold-500 scale-110 ring-2 ring-gold-500/50' : 'text-slate-400 hover:text-gold-500'}`}
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}
              >
                <MapIcon size={20} />
              </button>
              <button 
                onClick={() => handleFilterChange('SOS')} 
                title="เฉพาะขอความช่วยเหลือ (SOS)"
                className={`relative rounded-2xl shadow-lg border-2 transition-all active:scale-95 hover:scale-110 ${mapFilter === 'SOS' ? 'bg-red-500 border-white scale-110 ring-4 ring-red-500/30 shadow-red-500/40' : 'bg-red-500/90 border-white/50 hover:bg-red-500 shadow-red-500/30'}`}
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Bell size={18} className="text-white mb-0.5 animate-[wiggle_1s_ease-in-out_infinite]" strokeWidth={2.5} />
                  <span className="text-[9px] font-black text-white leading-none tracking-tight">SOS</span>
                </div>
              </button>
              <button 
                onClick={() => handleFilterChange('TRAFFIC')} 
                title="เฉพาะสภาพจราจร"
                className={`flex items-center justify-center rounded-2xl shadow-lg border border-white/20 glass transition-all active:scale-95 hover:scale-110 ${mapFilter === 'TRAFFIC' ? 'bg-cyan-400 text-white scale-110 ring-2 ring-cyan-400/50 shadow-cyan-400/30' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'}`}
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}
              >
                <AlertTriangle size={20} />
              </button>
            </div>

            {/* Filter Toast */}
            {filterToast && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none animate-slide-up">
                <div className="glass dark:bg-slate-900/90 text-slate-900 dark:text-white px-5 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                  <span className="text-sm font-bold tracking-tight">{filterToast}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {currentView === 'STATS' && <StatsDashboard incidents={incidents} theme={theme} />}
        
        {currentView === 'LIST' && (
          <IncidentList 
            incidents={filteredIncidents} 
            role={role} 
            onStatusUpdate={handleStatusUpdate} 
            onViewOnMap={(inc) => { setSelectedIncident(inc); setCurrentView('MAP'); }} 
          />
        )}
        
        {currentView === 'FORM' && (
            <ReportForm 
              role={role}
              reportType={reportType}
              officerReportMode={officerReportMode}
              setOfficerReportMode={setOfficerReportMode}
              formLocation={formLocation}
              setFormLocation={setFormLocation}
              draftPoints={draftPoints}
              setDraftPoints={setDraftPoints}
              formType={formType}
              setFormType={setFormType}
              formDesc={formDesc}
              setFormDesc={setFormDesc}
              victimCount={victimCount}
              setVictimCount={setVictimCount}
              hasBedridden={hasBedridden}
              setHasBedridden={setHasBedridden}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              onSubmit={handleSubmitReport}
              onCancel={resetForm}
              roads={roads}
              shelters={shelters}
            />
        )}

        {currentView === 'ANNOUNCEMENTS' && (
          <AnnouncementList
            announcements={role === 'CITIZEN' ? announcements.filter(a => a.isPublished) : announcements}
            role={role}
            onCreateNew={role === 'ADMIN' ? () => {
              setSelectedAnnouncement(null);
              setCurrentView('ANNOUNCEMENT_FORM');
            } : undefined}
            onEdit={role === 'ADMIN' ? (announcement) => {
              setSelectedAnnouncement(announcement);
              setCurrentView('ANNOUNCEMENT_FORM');
            } : undefined}
            onDelete={role === 'ADMIN' ? handleDeleteAnnouncement : undefined}
          />
        )}

        {currentView === 'ANNOUNCEMENT_FORM' && role === 'ADMIN' && (
          <AnnouncementForm
            announcement={selectedAnnouncement}
            onSubmit={selectedAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
            onCancel={() => {
              setCurrentView('ANNOUNCEMENTS');
              setSelectedAnnouncement(null);
            }}
          />
        )}
      </main>

      <IncidentModal 
        incident={selectedIncident} 
        onClose={() => setSelectedIncident(null)} 
        role={role} 
        onStatusUpdate={handleStatusUpdate} 
      />

      <BottomNav 
        role={role} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        resetForm={resetForm}
        setReportType={setReportType}
      />
    </div>
  );
};

export default App;
