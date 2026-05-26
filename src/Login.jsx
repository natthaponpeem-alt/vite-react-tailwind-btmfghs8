import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from './firebase';
import { ShieldAlert, Fingerprint, Loader2 } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // 🛑 ยามเฝ้าประตู (Gatekeeper): เช็คอีเมล ถ้าไม่ใช่เมลคุณ เตะออกทันที!
      if (result.user.email !== ADMIN_EMAIL) {
        await auth.signOut();
        setError(`Access Denied: อีเมล ${result.user.email} ไม่มีสิทธิ์เข้าใช้งาน`);
      }
      // ถ้าอีเมลตรงกัน ระบบจะทำงานเงียบๆ แล้วเดี๋ยวไฟล์ App.jsx จะพาเข้า Dashboard อัตโนมัติ
      
    } catch (err) {
      console.error(err);
      setError('ล็อกอินล้มเหลว หรือคุณกดยกเลิกหน้าต่าง Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#012b25] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl text-center relative overflow-hidden">
        
        <div className="w-20 h-20 bg-[#d9eb54] text-[#012b25] rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-6 transform -rotate-3">
          <Fingerprint className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-[#012b25] tracking-tight mb-2">PEEM6PACK</h1>
        <p className="text-sm text-slate-500 mb-8 font-medium">Command Center · CMCT (Admin Only)</p>

        {error && (
          <div className="w-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-4 rounded-xl mb-6 flex items-start gap-2 text-left">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={handleLogin} 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#012b25] hover:bg-[#033c32] text-[#d9eb54] text-sm font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 shadow-md"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}
