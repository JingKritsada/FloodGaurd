import React, { useState, useEffect } from 'react';
import { Announcement } from '../types/index';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, Megaphone, Info } from 'lucide-react';

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onSubmit: (data: Partial<Announcement>) => void;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [image, setImage] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setPriority(announcement.priority);
      setImage(announcement.image || '');
      setIsPublished(announcement.isPublished);
    }
  }, [announcement]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('กรุณากรอกหัวข้อและเนื้อหา');
      return;
    }

    onSubmit({
      title,
      content,
      priority,
      image,
      isPublished
    });
  };

  return (
    <div className="bg-white dark:bg-slate-950 h-full overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg z-10 px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <button 
          onClick={onCancel} 
          className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-gold-500 hover:text-white transition-all"
        >
          <ArrowLeft size={20}/>
        </button>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {announcement ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่'}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-base font-black text-slate-900 dark:text-white mb-3">หัวข้อประกาศ</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-gold-500/10 outline-none transition-all placeholder:text-slate-400"
            placeholder="ตัวอย่าง: แจ้งเตือนระดับน้ำสูง"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-base font-black text-slate-900 dark:text-white mb-3">ระดับความสำคัญ</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'HIGH', label: 'ด่วนมาก', icon: <AlertTriangle size={18}/>, color: 'bg-red-500' },
              { id: 'MEDIUM', label: 'ปกติ', icon: <Megaphone size={18}/>, color: 'bg-amber-500' },
              { id: 'LOW', label: 'ทั่วไป', icon: <Info size={18}/>, color: 'bg-blue-500' }
            ].map((p) => (
              <button 
                key={p.id}
                onClick={() => setPriority(p.id as any)}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                  priority === p.id 
                  ? `border-transparent shadow-lg ${p.color} text-white` 
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${priority === p.id ? 'bg-white/20' : 'bg-white dark:bg-slate-800 shadow-sm'}`}>
                  {React.cloneElement(p.icon as React.ReactElement<any>, { 
                    className: priority === p.id ? 'text-white' : 'text-slate-600 dark:text-slate-400' 
                  })}
                </div>
                <span className={`text-xs font-bold text-center leading-tight ${priority === p.id ? 'text-white' : 'text-slate-900 dark:text-slate-300'}`}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-base font-black text-slate-900 dark:text-white mb-3">เนื้อหาประกาศ</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-gold-500/10 outline-none resize-none transition-all placeholder:text-slate-400"
            rows={6}
            placeholder="รายละเอียดประกาศ..."
          ></textarea>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-base font-black text-slate-900 dark:text-white mb-3">รูปภาพ (URL)</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Upload size={18} />
            </div>
            <input 
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white font-medium text-base focus:ring-4 focus:ring-gold-500/10 outline-none transition-all placeholder:text-slate-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {image && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
              <img src={image} alt="Preview" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>

        {/* Published Toggle */}
        <div>
          <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-gold-400 transition-all">
            <input 
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-gold-600 focus:ring-2 focus:ring-gold-500/20 cursor-pointer"
            />
            <div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">เผยแพร่ทันที</span>
              <span className="text-xs text-slate-500">ถ้าไม่เลือก จะถูกบันทึกเป็นร่าง</span>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          className="w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest text-white bg-gold-600 shadow-2xl shadow-gold-600/30 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <CheckCircle size={20} strokeWidth={3} />
          {announcement ? 'บันทึกการแก้ไข' : 'สร้างประกาศ'}
        </button>
      </div>
    </div>
  );
};

export default AnnouncementForm;
