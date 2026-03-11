
import React, { useState } from 'react';
import { RoadStatus, Shelter, ReportType } from '../types/index';
import { TYPE_LABELS } from '../constants/index';
import { Role, IncidentType, Location, OfficerReportMode } from '../types/index';
import { ArrowLeft, AlertOctagon, Waves, AlertTriangle, Undo, CheckCircle, Navigation, Package, Stethoscope, Users, Phone, Upload, Plus, Minus } from 'lucide-react';
import MapBoard from './MapBoard';

interface ReportFormProps {
  role: Role;
  reportType: ReportType;
  officerReportMode: OfficerReportMode;
  setOfficerReportMode: (mode: OfficerReportMode) => void;
  formLocation: Location | null;
  setFormLocation: (loc: Location | null) => void;
  draftPoints: Location[];
  setDraftPoints: (pts: Location[] | ((prev: Location[]) => Location[])) => void;
  formType: IncidentType;
  setFormType: (type: IncidentType) => void;
  formDesc: string;
  setFormDesc: (desc: string) => void;
  victimCount: number;
  setVictimCount: (count: number) => void;
  hasBedridden: boolean;
  setHasBedridden: (val: boolean) => void;
  phone: string;
  setPhone: (phone: string) => void;
  address: string;
  setAddress: (address: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  roads: RoadStatus[];
  shelters: Shelter[];
}

const ReportForm: React.FC<ReportFormProps> = ({ 
  role, reportType, officerReportMode, setOfficerReportMode, formLocation, setFormLocation,
  draftPoints, setDraftPoints, formType, setFormType, formDesc, setFormDesc,
  victimCount, setVictimCount, hasBedridden, setHasBedridden, phone, setPhone, address, setAddress,
  onSubmit, onCancel,
  roads, shelters
}) => {
  
  // 1. Initial Choice for Officers OR Citizens (TRAFFIC mode)
  if ((role === 'OFFICER' && officerReportMode === 'NONE') || (role === 'CITIZEN' && reportType === 'TRAFFIC' && officerReportMode === 'NONE')) {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto flex flex-col items-center justify-start space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{role === 'OFFICER' ? 'รายงานสถานการณ์' : 'แจ้งเหตุน้ำท่วม/ถนน'}</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{role === 'OFFICER' ? 'Field Officer Portal' : 'Citizen Report'}</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
           <button onClick={() => setOfficerReportMode('ROAD_CLOSURE')} className="w-full p-6 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:border-gold-400 transition-all active:scale-95 text-left">
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <AlertOctagon size={28} />
              </div>
              <div>
                <span className="font-black text-lg text-slate-900 dark:text-white block leading-tight">ปิดการจราจร</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Draw on Map</span>
              </div>
           </button>

           <button onClick={() => setOfficerReportMode('LEVEE')} className="w-full p-6 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:border-gold-400 transition-all active:scale-95 text-left">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Waves size={28} />
              </div>
              <div>
                <span className="font-black text-lg text-slate-900 dark:text-white block leading-tight">น้ำล้น/ตลิ่งพัง</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Critical Point</span>
              </div>
           </button>

           <button onClick={() => setOfficerReportMode('GENERAL')} className="w-full p-6 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:border-gold-400 transition-all active:scale-95 text-left">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <AlertTriangle size={28} />
              </div>
              <div>
                <span className="font-black text-lg text-slate-900 dark:text-white block leading-tight">เหตุอุบัติภัยทั่วไป</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rescue Support</span>
              </div>
           </button>
        </div>
      </div>
    );
  }

  const isRoadMode = officerReportMode === 'ROAD_CLOSURE';
  const isLeveeMode = officerReportMode === 'LEVEE';
  const isDrawingRoad = isRoadMode && !formDesc;
  
  // 2. Map Selection Mode
  if (isDrawingRoad || (isLeveeMode && !formLocation) || (officerReportMode === 'GENERAL' && !formLocation) || (role === 'CITIZEN' && reportType === 'SOS' && !formLocation)) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-950 relative">
        <div className="flex-none p-4 dark:bg-slate-950 z-10 flex justify-between items-center">
           
           {role === 'OFFICER' 
           ? <button onClick={onCancel} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400"><ArrowLeft size={20}/></button>
           : <div className="w-11"></div>
           }
           
           <h2 className="font-black text-lg tracking-tight dark:text-white">
             {isRoadMode ? 'ปิดการจราจร' : isLeveeMode ? 'น้ำล้น/ตลิ่งพัง' : 'จุดแจ้งขอความช่วยเหลือ'}
           </h2>

           <div className="w-11"></div>
        </div>
        
        <div className="flex-1 relative">
            <MapBoard 
              incidents={[]} 
              roads={roads} 
              shelters={shelters} 
              filter={isRoadMode ? 'TRAFFIC' : isLeveeMode ? 'WATER' : 'ALL'}
              interactive={true} 
              onMapClick={(loc) => {
                if (isRoadMode) setDraftPoints(prev => [...prev, loc]);
                else setFormLocation(loc);
              }}
              onMarkerClick={() => {}}
              draftPoints={draftPoints}
           />

           <div className="absolute top-6 inset-x-6 flex justify-center pointer-events-none z-[400]">
             <div className="glass dark:bg-slate-900/90 text-slate-900 dark:text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/20">
                {isRoadMode ? 'แตะถนนหลายๆ จุดเพื่อวาดเส้นทาง' : 'แตะหรือเลื่อนบนแผนที่เพื่อระบุตำแหน่ง'}
             </div>
           </div>

           {isRoadMode && (
             <div className="absolute bottom-24 inset-x-0 flex justify-center z-[400] pointer-events-none p-4">
               <div className="glass dark:bg-slate-900/90 border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl p-1.5 flex gap-2 pointer-events-auto">
                 <button 
                  onClick={() => setDraftPoints(prev => prev.slice(0, -1))}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
                  disabled={draftPoints.length === 0}
                  title="ยกเลิกจุดล่าสุด"
                 >
                   <Undo size={20} />
                 </button>
                 <button 
                  onClick={() => setFormDesc(' ')}
                  className={`px-6 h-12 rounded-2xl font-black text-xs tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    draftPoints.length >= 2 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={draftPoints.length < 2}
                 >
                   <CheckCircle size={14} strokeWidth={3} />
                   ยืนยันเส้นทาง
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>
    );
  }

  // 3. Form Details Mode
  return (
    <div className="p-6 bg-white dark:bg-slate-950 h-full overflow-y-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { if(isRoadMode) setFormDesc(''); else setFormLocation(null); }} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-gold-500 hover:text-white transition-all"><ArrowLeft size={20}/></button>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {isRoadMode 
            ? 'รายละเอียดการปิดถนน' 
            : isLeveeMode 
              ? 'รายละเอียดจุดวิกฤต' 
              : reportType === 'SOS' 
                ? 'รายละเอียดขอความช่วยเหลือ'
                : 'รายละเอียดการแจ้งเหตุ'}
        </h2>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-base font-black text-slate-900 dark:text-white mb-3">พิกัดของคุณ</label>
          <div className="h-40 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 relative pointer-events-none shadow-sm">
              <MapBoard 
                incidents={[]} 
                roads={roads} 
                shelters={shelters} 
                filter="NONE" 
                interactive={false} 
                onMarkerClick={() => {}} 
                draftPoints={isRoadMode ? draftPoints : (formLocation ? [formLocation] : [])}
                showControls={false}
                draggable={false}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Location Info Below Map */}
          {formLocation && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                ต.ปากแคว อ.เมือง
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                (GPS: {formLocation.lat.toFixed(2)}, {formLocation.lng.toFixed(2)})
              </div>
            </div>
          )}
        </div>

        {/* Location Coordinates */}
        {formLocation && (
          <div>
            <label className="block text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">พิกัดตำแหน่ง</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold mb-1">Latitude</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{formLocation.lat.toFixed(6)}</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold mb-1">Longitude</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{formLocation.lng.toFixed(6)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Address Field */}
        {formLocation && (
          <div>
            <label className="block text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">ที่อยู่</label>
            <input 
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-gold-500/10 outline-none transition-all placeholder:text-slate-400"
              placeholder="ตัวอย่าง: หมู่ 1, ต.เมืองเก่า, อ.เมือง, จ.สุโขทัย"
            />
          </div>
        )}

        {/* Incident Type Selection - Show only for SOS or GENERAL mode */}
        {(reportType === 'SOS' || (reportType === 'TRAFFIC' && officerReportMode === 'GENERAL')) && !isRoadMode && !isLeveeMode && (
          <div>
            <label className="block text-base font-black text-slate-900 dark:text-white mb-3">
              {reportType === 'SOS' ? 'เรื่องที่ต้องการความช่วยเหลือ' : 'ประเภทเหตุการณ์'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'MEDICAL', label: 'ติดในบ้าน (น้ำสูงออกไม่ได้)', icon: <Stethoscope size={18}/>, activeColor: 'bg-red-500', iconColor: 'text-red-500' },
                { id: 'SUPPLIES', label: 'ขาดแคลนเสบียง', icon: <Package size={18}/>, activeColor: 'bg-amber-500', iconColor: 'text-amber-500' },
                { id: 'EVACUATION', label: 'ต้องการอพยพ', icon: <Users size={18}/>, activeColor: 'bg-blue-500', iconColor: 'text-blue-500' },
                { id: 'ROAD_BLOCKED', label: 'มีผู้ป่วย/คนแก่/คนท้อง', icon: <Stethoscope size={18}/>, activeColor: 'bg-rose-500', iconColor: 'text-rose-500' }
              ].map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setFormType(t.id as IncidentType)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    formType === t.id 
                    ? `border-transparent shadow-lg ${t.activeColor} text-white` 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all ${formType === t.id ? 'bg-white/20' : 'bg-white dark:bg-slate-800 shadow-sm'}`}>
                    {React.cloneElement(t.icon as React.ReactElement<any>, { className: formType === t.id ? 'text-white' : t.iconColor })}
                  </div>
                  <span className={`text-xs font-bold text-center leading-tight ${formType === t.id ? 'text-white' : 'text-slate-900 dark:text-slate-300'}`}>
                    {t.label}
                  </span>
                  
                  {formType === t.id && (
                    <div className="absolute top-2 right-2">
                       <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* People Counter - Show only for SOS or GENERAL mode */}
        {(reportType === 'SOS' || (reportType === 'TRAFFIC' && officerReportMode === 'GENERAL')) && !isRoadMode && !isLeveeMode && (
          <div>
            <label className="block text-base font-black text-slate-900 dark:text-white mb-3">มีผู้ประสบภัยกี่คน? (รวมตัวคุณ)</label>
            <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <button 
                type="button"
                onClick={() => setVictimCount(Math.max(0, victimCount - 1))}
                disabled={victimCount <= 0}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-gold-500 hover:text-gold-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={20} strokeWidth={3} />
              </button>
              <div className="text-4xl font-black text-slate-900 dark:text-white min-w-[4rem] text-center">
                {victimCount}
              </div>
              <button 
                type="button"
                onClick={() => setVictimCount(victimCount + 1)}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-gold-500 hover:text-gold-600 transition-all active:scale-95"
              >
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
            
            {/* Bedridden Checkbox */}
            <label className="flex items-center gap-3 mt-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-gold-400 transition-all">
              <input 
                type="checkbox"
                checked={hasBedridden}
                onChange={(e) => setHasBedridden(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-gold-600 focus:ring-2 focus:ring-gold-500/20 cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">มีผู้ป่วยติดเตียง / เคลื่อนย้ายลำบาก</span>
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            {isRoadMode ? 'สาเหตุ / สถานะ' : 'รายละเอียดสถานการณ์'}
          </label>
          <textarea 
            className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-gold-500/10 outline-none resize-none transition-all placeholder:text-slate-400"
            rows={3}
            placeholder={isRoadMode ? "น้ำท่วมสูง... รถเล็กผ่านไม่ได้..." : "อธิบายเพิ่มเติม... เช่น จำนวนคน, ความเร่งด่วน..."}
            value={formDesc.trim()}
            onChange={(e) => setFormDesc(e.target.value)}
          ></textarea>
        </div>

        {/* Phone Number */}
        {!isRoadMode && (
          <div>
            <label className="block text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-3">เบอร์โทรติดต่อ</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone size={18} />
              </div>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-gold-500/10 outline-none transition-all placeholder:text-slate-400"
                placeholder="08X-XXX-XXXX"
              />
            </div>
          </div>
        )}

        {/* Image Upload */}
        {!isRoadMode && (
          <div>
            <label className="block text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-3">แนบรูปถ่าย</label>
            <label className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold-400 hover:bg-gold-50/50 dark:hover:bg-gold-900/10 transition-all">
              <Upload size={28} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">คลิกเพื่อเลือกไฟล์</span>
              <span className="text-xs text-slate-400">รองรับ JPG, PNG ขนาดไม่เกิน 5MB</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        )}

        <button 
          onClick={() => {
            console.log('🔘 Submit button clicked');
            onSubmit();
          }}
          className="w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest text-white bg-gold-600 shadow-2xl shadow-gold-600/30 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <CheckCircle size={20} strokeWidth={3} />
          {isRoadMode 
            ? 'บันทึกการปิดถนน' 
            : isLeveeMode 
              ? 'บันทึกจุดวิกฤต' 
              : reportType === 'SOS' 
                ? 'ส่งขอความช่วยเหลือ'
                : 'ส่งรายงานการแจ้งเหตุ'}
        </button>
      </div>
    </div>
  );
};

export default ReportForm;
