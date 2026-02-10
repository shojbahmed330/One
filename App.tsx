
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Smartphone, Loader2, Zap, Cpu, LogOut, Check, Rocket, Settings,
  Download, Globe, Activity, Terminal, ShieldAlert, Package as PackageIcon, QrCode, 
  AlertCircle, Key, Mail, ArrowLeft, FileCode, ShoppingCart, User as UserIcon,
  ChevronRight, Github, Save, Trash2, Square, Circle, RefreshCw, Fingerprint,
  User, Lock, Eye, EyeOff, MessageSquare, Monitor, CreditCard, Upload, X, ShieldCheck,
  FileJson, Layout, Users, BarChart3, Clock, Wallet, CheckCircle2, XCircle, Search, TrendingUp,
  Plus, Edit2, Ban, ShieldX, LayoutDashboard, History, Gift, Filter, Bell, ListTodo,
  Trophy, Star, Award, Layers, Target, Code2, Sparkles, BrainCircuit, ShieldEllipsis, 
  Fingerprint as BioIcon, Camera, Laptop, Tablet, Menu, Smartphone as MobileIcon, Eye as ViewIcon, ExternalLink, Calendar, Coins, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction, ActivityLog } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

// --- BIOMETRIC SCAN PAGE ---
const ScanPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isScanning, setIsScanning] = useState(false);
  const handleStartAuth = () => {
    setIsScanning(true);
    setTimeout(() => onFinish(), 2000);
  };
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0a0110] text-white relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,45,117,0.15)_0%,_transparent_70%)] opacity-50"></div>
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-400 to-pink-600 drop-shadow-[0_0_20px_rgba(255,45,117,0.4)]">
            OneClick Studio
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/60">
            Secure Uplink System • AI Core
          </p>
        </div>
        <div onClick={!isScanning ? handleStartAuth : undefined} className={`relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center cursor-pointer transition-transform active:scale-95 group mb-12`}>
          <div className={`absolute inset-0 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all ${!isScanning ? 'animate-pulse' : ''}`}></div>
          <Fingerprint size={isScanning ? 80 : 70} className={`${isScanning ? 'text-pink-400 scale-110' : 'text-pink-600'} transition-all duration-500 relative z-10 drop-shadow-[0_0_25px_rgba(255,45,117,0.6)] ${!isScanning ? 'animate-[float_3s_ease-in-out_infinite]' : 'animate-pulse'}`} />
          {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-pink-400 shadow-[0_0_25px_#ff2d75] rounded-full animate-[scanning_1.5s_infinite] z-20"></div>}
        </div>
        <h2 className={`text-sm md:text-xl font-bold tracking-widest uppercase transition-colors duration-500 ${isScanning ? 'text-pink-400' : 'text-slate-500'}`}>
          {isScanning ? 'Identity Scanning...' : 'Touch sensor to initiate login'}
        </h2>
      </div>
      <style>{`
        @keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
    </div>
  );
};

// --- AUTH PAGE ---
const AuthPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isForgot) {
        const { error } = await db.resetPassword(formData.email);
        if (error) throw error;
        setResetSent(true);
      } else {
        const res = isRegister ? await db.signUp(formData.email, formData.password, formData.name) : await db.signIn(formData.email, formData.password);
        if (res.error) throw res.error;
        if (isRegister) {
          alert("Registration Successful! Please check your email.");
          setIsRegister(false);
          return;
        }
        const userData = await db.getUser(formData.email, res.data.user?.id);
        if (userData) {
          if (userData.is_banned) throw new Error("Account has been terminated by system.");
          onLoginSuccess(userData);
        }
      }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await db.signInWithGithub();
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0a0110] text-white p-4">
      <div className="relative w-full max-w-[420px] h-[600px] [perspective:1200px]">
        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(-180deg)]' : ''}`}>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl overflow-y-auto code-scroll">
            {isForgot ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <h2 className="text-3xl font-black mb-4">Reset <span className="text-pink-500">Access</span></h2>
                {resetSent ? (
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                      <Mail size={32} />
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      A <span className="text-pink-400 font-bold">password reset link</span> has been sent to your email address. Please check your inbox (or spam folder) and follow the instructions to reset your password.
                    </p>
                    <button onClick={() => {setIsForgot(false); setResetSent(false);}} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs hover:bg-white/10 transition-all">Back to Login</button>
                  </div>
                ) : (
                  <form onSubmit={handleAuth} className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">Enter your registered email below, and we will send you a recovery link.</p>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="your-email@example.com" />
                    <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                      {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Send Recovery Link'}
                    </button>
                    <button type="button" onClick={() => setIsForgot(false)} className="w-full text-xs text-slate-500 hover:text-white font-bold transition-all flex items-center justify-center gap-2">
                      <ArrowLeft size={14} /> Back to Login
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black mb-8">System <span className="text-pink-500">Login</span></h2>
                <form onSubmit={handleAuth} className="space-y-5">
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="developer@studio" />
                  <div className="space-y-2">
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
                    <button type="button" onClick={() => setIsForgot(true)} className="w-full text-right text-[10px] text-pink-500/60 font-black uppercase tracking-widest hover:text-pink-500 transition-all">Forgot Key?</button>
                  </div>
                  <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                    {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Execute Login'}
                  </button>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Or login with</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGithubLogin} 
                    disabled={isLoading}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
                  >
                    <Github size={18} /> Continue with GitHub
                  </button>
                </form>
                <button onClick={() => setIsRegister(true)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">New developer? Registry here</button>
              </>
            )}
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl [transform:rotateY(180deg)] overflow-y-auto code-scroll">
            <h2 className="text-3xl font-black mb-8">New <span className="text-pink-500">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Full Name" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Email" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Join Studio'}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Or join with</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button 
                type="button"
                onClick={handleGithubLogin} 
                disabled={isLoading}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
              >
                <Github size={18} /> Continue with GitHub
              </button>
            </form>
            <button onClick={() => setIsRegister(false)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">Already registered? Access terminal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main application component that orchestrates authentication,
 * biometric scanning, and the main dashboard interface.
 */
const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  if (!showApp) {
    return <ScanPage onFinish={() => setShowApp(true)} />;
  }

  if (!user) {
    return <AuthPage onLoginSuccess={setUser} />;
  }

  const handleLogout = async () => {
    await DatabaseService.getInstance().signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a0110] text-white flex flex-col items-center justify-center p-8 selection:bg-pink-500/30">
      <div className="glass-tech p-8 md:p-12 rounded-[3rem] border-pink-500/20 text-center space-y-8 max-w-2xl w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[80px] -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 blur-[80px] -ml-16 -mb-16"></div>
        
        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/40 transition-all duration-500"></div>
          <img 
            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
            alt="Avatar" 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-pink-500/50 relative z-10 shadow-[0_0_30px_rgba(255,45,117,0.3)]"
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-[#1a0b2e] flex items-center justify-center z-20 shadow-lg">
            <CheckCircle size={14} className="text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-400">
            Welcome, {user.name}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/60">
            OneClick Studio Developer Account
          </p>
        </div>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto italic">
          "{user.bio || 'Architecting the future of mobile applications, one click at a time.'}"
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all">
            <div className="text-pink-500 font-black text-3xl mb-1">{user.tokens}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Available Tokens</div>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all">
            <div className="text-pink-500 font-black text-3xl mb-1">{user.isAdmin ? 'Admin' : 'Pro'}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Access Status</div>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button className="w-full py-4 bg-pink-600 hover:bg-pink-700 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_-10px_rgba(219,39,119,0.5)]">
            <Rocket size={18} /> Launch Terminal
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
          >
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-6 opacity-40">
        <Smartphone size={20} className="hover:text-pink-500 cursor-pointer transition-colors" />
        <Monitor size={20} className="hover:text-pink-500 cursor-pointer transition-colors" />
        <Tablet size={20} className="hover:text-pink-500 cursor-pointer transition-colors" />
      </div>
    </div>
  );
};

export default App;
