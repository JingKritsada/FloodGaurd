import React, { useState } from 'react';
import authService from '../src/services/auth';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string | null) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authService.login(username, password);
      onLoginSuccess(user?.role || null);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-md z-10">
        <h3 className="font-black text-lg mb-4">เข้าสู่ระบบ</h3>
        <div className="space-y-3">
          <input className="w-full p-3 rounded-lg border" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="w-full p-3 rounded-lg border" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100">ยกเลิก</button>
            <button onClick={submit} className="px-4 py-2 rounded-lg bg-gold-500 text-white" disabled={loading}>{loading ? 'กำลัง...' : 'เข้าสู่ระบบ'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
