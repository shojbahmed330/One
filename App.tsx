
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

// --- AUTH COMPONENTS (RESTORED) ---
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
    </div>
  );
};

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
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30"><Mail size={32} /></div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">Reset link has been sent. Check your email.</p>
                    <button onClick={() => {setIsForgot(false); setResetSent(false);}} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs hover:bg-white/10 transition-all">Back to Login</button>
                  </div>
                ) : (
                  <form onSubmit={handleAuth} className="space-y-6">
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Email" />
                    <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Send Link'}</button>
                    <button type="button" onClick={() => setIsForgot(false)} className="w-full text-xs text-slate-500 hover:text-white font-bold transition-all flex items-center justify-center gap-2"><ArrowLeft size={14} /> Back</button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black mb-8">System <span className="text-pink-500">Login</span></h2>
                <form onSubmit={handleAuth} className="space-y-5">
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Email" />
                  <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Password" />
                  <button type="button" onClick={() => setIsForgot(true)} className="w-full text-right text-[10px] text-pink-500/60 font-black uppercase tracking-widest hover:text-pink-500 transition-all">Forgot Key?</button>
                  <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Execute Login'}</button>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Or</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>
                  <button type="button" onClick={handleGithubLogin} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"><Github size={18} /> GitHub Login</button>
                </form>
                <button onClick={() => setIsRegister(true)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">Register</button>
              </>
            )}
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl [transform:rotateY(180deg)] overflow-y-auto code-scroll">
            <h2 className="text-3xl font-black mb-8">New <span className="text-pink-500">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Full Name" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Email" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Password" />
              <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Join Studio'}</button>
            </form>
            <button onClick={() => setIsRegister(false)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">Back to Terminal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP (FULL RESTORE) ---
const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.EDIT);
  const [isBooting, setIsBooting] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<Record<string, string>>({ 'index.html': '<!-- OneClick AI System -->' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const db = DatabaseService.getInstance();
  const gemini = new GeminiService();

  useEffect(() => {
    db.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = await db.getUser(session.user.email || '', session.user.id);
        setUser(userData);
      } else {
        const forceEmail = localStorage.getItem('df_force_login');
        if (forceEmail) {
          const userData = await db.getUser(forceEmail);
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    });
  }, []);

  const handleSendMessage = async (customPrompt?: string) => {
    const promptText = customPrompt || input;
    if (!promptText.trim() || !user || isGenerating) return;

    if (user.tokens <= 0 && !user.isAdmin) {
      alert("টোকেন শেষ! অনুগ্রহ করে টোকেন কিনুন।");
      setAppMode(AppMode.SHOP);
      return;
    }

    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: promptText, timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsGenerating(true);

    try {
      const result = await gemini.generateWebsite(promptText, files, messages);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        timestamp: Date.now(),
        files: result.files,
        inputType: result.inputType,
        options: result.options,
        choices: result.choices
      };
      setMessages(prev => [...prev, assistantMsg]);
      if (result.files) setFiles(result.files);
      const updatedUser = await db.useToken(user.id, user.email);
      if (updatedUser) setUser(updatedUser);
    } catch (e) {
      alert("AI সিস্টেম এখন ব্যস্ত।");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isBooting) return <ScanPage onFinish={() => setIsBooting(false)} />;
  if (!user) return <AuthPage onLoginSuccess={setUser} />;

  return (
    <div className="h-[100dvh] w-full flex bg-[#0a0110] text-white overflow-hidden relative selection:bg-pink-500/30">
      {/* Sidebar Navigation */}
      <nav className="w-16 md:w-20 glass-tech border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,45,117,0.4)] cursor-pointer active:scale-90 transition-all">
          <Rocket size={24} className="text-white" />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <NavIcon icon={<Monitor />} active={appMode === AppMode.EDIT} onClick={() => setAppMode(AppMode.EDIT)} label="Builder" />
          <NavIcon icon={<Smartphone />} active={appMode === AppMode.PREVIEW} onClick={() => setAppMode(AppMode.PREVIEW)} label="Preview" />
          <NavIcon icon={<ShoppingCart />} active={appMode === AppMode.SHOP} onClick={() => setAppMode(AppMode.SHOP)} label="Shop" />
          <NavIcon icon={<UserIcon />} active={appMode === AppMode.PROFILE} onClick={() => setAppMode(AppMode.PROFILE)} label="Profile" />
          {user.isAdmin && <NavIcon icon={<ShieldCheck />} active={appMode === AppMode.ADMIN} onClick={() => setAppMode(AppMode.ADMIN)} label="Admin" />}
        </div>
        <button onClick={() => { db.signOut(); window.location.reload(); }} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all"><LogOut size={20} /></button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* VIEW: BUILDER (CHAT & EDITOR) */}
        {appMode === AppMode.EDIT && (
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            <div className="w-full md:w-[400px] lg:w-[450px] border-r border-white/5 flex flex-col glass-tech relative z-10">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-white">OneClick <span className="text-pink-500">AI</span></h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Builder Terminal v3.1</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-pink-500">{user.tokens} TOKENS</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6 code-scroll">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                    <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center"><Cpu size={40} className="text-pink-500 animate-pulse" /></div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">কি অ্যাপ বানাতে চান?</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">আইডিয়া লিখে পাঠান, আমি কোড এবং ডিজাইন তৈরি করে দিচ্ছি।</p>
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-pink-600 text-white rounded-tr-none shadow-lg shadow-pink-900/20' : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-3xl border border-white/10 animate-pulse">
                    <Loader2 className="animate-spin text-pink-500" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Architecting UI...</span>
                  </div>
                )}
              </div>
              <div className="p-4 glass-tech border-t border-white/5">
                <div className="relative group">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Write your app idea..." className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 px-6 pr-16 text-sm outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600" />
                  <button onClick={() => handleSendMessage()} disabled={isGenerating} className="absolute right-2 top-2 bottom-2 w-12 bg-pink-600 hover:bg-pink-700 rounded-[1.5rem] flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-pink-900/40"><Send size={18} /></button>
                </div>
              </div>
            </div>
            {/* RESTORED EDITOR VIEW */}
            <div className="flex-1 flex flex-col bg-black/40 min-w-0">
               <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-3 py-1 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <FileCode size={14} className="text-pink-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-pink-400">index.html</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => setAppMode(AppMode.PREVIEW)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Live Preview</button>
                  </div>
               </div>
               <div className="flex-1 overflow-hidden relative">
                  <pre className="h-full p-8 text-xs font-mono text-slate-300 overflow-auto code-scroll bg-[#0d0214]">
                    <code>{files['index.html']}</code>
                  </pre>
               </div>
            </div>
          </div>
        )}

        {/* VIEW: PREVIEW */}
        {appMode === AppMode.PREVIEW && (
          <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(255,45,117,0.05)_0%,_transparent_100%)]">
             <div className="relative w-full max-w-[380px] h-[80%] md:h-[90%] glass-tech rounded-[3rem] border-8 border-white/5 shadow-2xl overflow-hidden phone-frame-scale">
                <iframe srcDoc={files['index.html']} title="App Preview" className="w-full h-full border-none bg-white" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
             </div>
          </div>
        )}

        {/* VIEW: SHOP (RESTORED) */}
        {appMode === AppMode.SHOP && (
           <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                 <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Token <span className="text-pink-500">Forge</span></h2>
                 <p className="text-slate-400 font-medium">আপনার প্রোডাকশন লেভেল অ্যাপ তৈরির জন্য প্রয়োজন শক্তিশালী AI টোকেন। নিচের প্যাকেজ থেকে পছন্দ করুন।</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ShopCard tokens={5} price={100} icon={<Zap />} color="cyan" popular={false} />
                <ShopCard tokens={20} price={350} icon={<Rocket />} color="pink" popular={true} />
                <ShopCard tokens={50} price={750} icon={<Trophy />} color="purple" popular={false} />
              </div>
           </div>
        )}

        {/* VIEW: ADMIN (RESTORED FULL) */}
        {appMode === AppMode.ADMIN && user.isAdmin && (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
              <div>
                <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                  <ShieldCheck className="text-pink-500" size={32} /> Admin <span className="text-pink-500">Command</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">Global System Oversight</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={async () => setAdminStats(await db.getAdminStats())} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95"><RefreshCw size={20} /></button>
                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-pink-900/30 transition-all active:scale-95">System Sync</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <AdminStatCard label="Total Revenue" value={`৳${adminStats?.totalRevenue || 0}`} icon={<Coins />} color="text-green-400" />
               <AdminStatCard label="New Users (Today)" value={adminStats?.usersToday || 0} icon={<Users />} color="text-pink-400" />
               <AdminStatCard label="Top Package" value={adminStats?.topPackage || 'None'} icon={<Trophy />} color="text-purple-400" />
               <AdminStatCard label="Token Efficiency" value="98.2%" icon={<Cpu />} color="text-cyan-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-tech p-8 rounded-[3rem] border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2"><Activity className="text-pink-500" /> Revenue Growth (7D)</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adminStats?.chartData || []}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff2d75" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ff2d75" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a0b2e', border: '1px solid rgba(255,45,117,0.2)', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#ff2d75" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-tech p-8 rounded-[3rem] border-white/5 flex flex-col">
                <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2 mb-6"><History className="text-pink-500" /> System Logs</h3>
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] code-scroll pr-2">
                  {logs.length === 0 && <div className="text-slate-600 text-[10px] text-center mt-20 font-bold italic tracking-widest">NO LOGS RECORDED</div>}
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{log.action}</span>
                        <span className="text-[9px] text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 group-hover:text-white transition-colors">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PROFILE (RESTORED) */}
        {appMode === AppMode.PROFILE && (
          <div className="flex-1 flex items-center justify-center p-8">
             <div className="glass-tech p-10 md:p-16 rounded-[4rem] border-pink-500/20 text-center space-y-10 max-w-2xl w-full relative group">
                <div className="absolute inset-0 bg-pink-500/5 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
                <div className="relative inline-block">
                  <img src={user.avatar_url} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-pink-500/30 p-1 bg-white/5" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-8 border-[#0a0110] flex items-center justify-center"><Check size={20} className="text-white" /></div>
                </div>
                <div className="space-y-3">
                   <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{user.name}</h2>
                   <p className="text-xs font-black uppercase tracking-[0.5em] text-pink-500/60">{user.email}</p>
                   <p className="text-slate-400 max-w-md mx-auto italic">"{user.bio || 'Architecting mobile experiences with AI.'}"</p>
                </div>
                <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                   <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                      <div className="text-3xl font-black text-pink-500">{user.tokens}</div>
                      <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mt-1">Tokens</div>
                   </div>
                   <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                      <div className="text-3xl font-black text-pink-500">{user.isAdmin ? 'Admin' : 'Pro'}</div>
                      <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mt-1">Account</div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- MINI COMPONENTS ---
const NavIcon: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void, label: string }> = ({ icon, active, onClick, label }) => (
  <div onClick={onClick} className={`relative flex flex-col items-center group cursor-pointer transition-all duration-300`}>
    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${active ? 'active-nav-pink scale-110' : 'text-slate-500 hover:text-pink-400 hover:bg-pink-500/10'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <span className={`absolute left-16 px-3 py-1 bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 ${active ? 'translate-x-2' : 'translate-x-0'}`}>
      {label}
    </span>
  </div>
);

const ShopCard: React.FC<{ tokens: number, price: number, icon: React.ReactNode, color: string, popular: boolean }> = ({ tokens, price, icon, color, popular }) => (
  <div className={`glass-tech p-8 rounded-[3rem] border-white/5 relative group transition-all duration-500 hover:border-pink-500/30 hover:-translate-y-2 ${popular ? 'shadow-[0_0_50px_rgba(255,45,117,0.15)] ring-2 ring-pink-500/20' : ''}`}>
    {popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">Best Value</div>}
    <div className={`w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 text-${color}-500 group-hover:scale-110 transition-transform`}>{React.cloneElement(icon as React.ReactElement, { size: 32 })}</div>
    <h3 className="text-4xl font-black mb-2">{tokens} <span className="text-lg font-bold text-slate-500">Tokens</span></h3>
    <div className="text-slate-400 text-xs font-bold mb-8">৳{price} BDT • One-time purchase</div>
    <button className="w-full py-4 bg-white/5 hover:bg-pink-600 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">Buy Package</button>
  </div>
);

const AdminStatCard: React.FC<{ label: string, value: string | number, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
  <div className="glass-tech p-6 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
    <div className="absolute -right-4 -bottom-4 opacity-5 scale-150 rotate-12 group-hover:scale-[1.7] transition-transform duration-700">{icon}</div>
    <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 ${color}`}>{React.cloneElement(icon as React.ReactElement, { size: 24 })}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</div>
    <div className="text-3xl font-black tracking-tighter">{value}</div>
  </div>
);

export default App;
