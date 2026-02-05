
import React, { useState } from 'react';
import { auth } from '../firebase';
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      alert('登入失敗，請檢查帳號密碼。');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-xl border border-sage/10 text-center">
        <div className="w-20 h-20 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
        </div>
        <h1 className="text-2xl font-bold text-earth mb-2">管理員登入</h1>
        <p className="text-gray-500 mb-8">請輸入管理帳號與密碼以開啟編輯模式</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            required
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-cream border border-gray-100 focus:ring-2 focus:ring-sage outline-none"
            placeholder="管理員 Email"
          />
          <input 
            required
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-cream border border-gray-100 focus:ring-2 focus:ring-sage outline-none"
            placeholder="密碼"
          />
          <button disabled={isLoggingIn} type="submit" className="w-full py-4 bg-sage text-white rounded-2xl font-bold shadow-lg hover:bg-sage/90 transition-all text-lg flex items-center justify-center">
            {isLoggingIn ? <Loader2 className="animate-spin" /> : '登入管理後台'}
          </button>
        </form>
        <p className="mt-8 text-xs text-gray-400 italic">提醒：請使用在 Firebase Console 建立的管理員帳號。</p>
      </div>
    </div>
  );
};

export default LoginPage;
