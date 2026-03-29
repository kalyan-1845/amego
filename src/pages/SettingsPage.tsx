import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Moon, 
  Sun, 
  Globe,
  Settings,
  Mail,
  LogOut,
  Camera
} from 'lucide-react';
import { cn } from '../utils/cn';

import { useUIStore } from '../store/uiStore';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme, logout } = useUIStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Visual Experience', icon: Moon },
    { id: 'billing', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your identity and app experience</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-12 min-h-[600px]">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("h-5 w-5 transition-transform", activeTab === tab.id ? "scale-110" : "group-hover:scale-110")} />
              <span className="font-bold">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab" 
                  className="absolute left-0 w-1 h-8 bg-zinc-100/30 rounded-full"
                />
              )}
            </button>
          ))}

          <div className="h-px bg-border my-4" />

          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold group"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Sign out
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-border/50 rounded-3xl p-8 shadow-2xl overflow-hidden relative group/content transition-all duration-500">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-opacity group-hover/content:opacity-10">
            <Settings className="h-64 w-64 rotate-12" />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12 relative z-10"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-black">Personal Identity</h3>
                  <div className="flex items-center gap-8 p-6 bg-muted/30 border border-border/30 rounded-3xl group/avatar transition-all hover:bg-muted/50">
                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <div 
                      onClick={() => avatarInputRef.current?.click()}
                      className="relative h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-background shadow-xl ring-offset-2 ring-offset-primary/20 group-hover/avatar:scale-105 transition-all cursor-pointer"
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-full w-full p-6 text-white" />
                      )}
                      <button className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Alex Chen</h4>
                      <p className="text-muted-foreground text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        San Francisco, CA
                      </p>
                      <button 
                        onClick={() => avatarInputRef.current?.click()}
                        className="mt-4 text-xs font-black text-primary hover:text-primary/80 uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-primary/20 transition-all active:scale-95"
                      >
                        Update Picture
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                    <div className="relative group/input">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                        <input 
                            placeholder="Display Name" 
                            defaultValue="Alex Chen"
                            className="w-full bg-background border border-border/60 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-lg font-bold"
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <div className="relative group/input">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                        <input 
                            placeholder="Email" 
                            defaultValue="alex@amego.ai"
                            readOnly
                            className="w-full bg-muted/60 border border-border/60 rounded-2xl pl-12 pr-4 py-4 cursor-not-allowed opacity-70 text-lg font-medium"
                        />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Bio / About you</label>
                    <textarea 
                        placeholder="Tell us about yourself..." 
                        rows={4}
                        className="w-full bg-background border border-border/60 rounded-2xl p-4 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-lg font-medium resize-none shadow-sm"
                    />
                </div>

                <div className="flex justify-end pt-8">
                    <button className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all">Save Changes</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 h-full"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-black">Visual Experience</h3>
                  <p className="text-muted-foreground">Customize how the platform looks and feels.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => setTheme('light')}
                    className={cn(
                        "p-8 rounded-3xl border-2 transition-all group flex flex-col items-center gap-4",
                        theme === 'light' ? "border-primary bg-primary/5 shadow-2xl" : "border-border/30 bg-muted/30 hover:border-border"
                    )}
                  >
                    <div className="h-16 w-16 rounded-2xl bg-white border border-border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Sun className="h-8 w-8 text-orange-500" />
                    </div>
                    <span className="font-bold">Light Mode</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={cn(
                        "p-8 rounded-3xl border-2 transition-all group flex flex-col items-center gap-4",
                        theme === 'dark' ? "border-primary bg-primary/5 shadow-2xl" : "border-border/30 bg-muted/30 hover:border-border"
                    )}
                  >
                    <div className="h-16 w-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Moon className="h-8 w-8 text-zinc-100" />
                    </div>
                    <span className="font-bold">Dark Mode</span>
                  </button>
                </div>

                <div className="space-y-4 pt-8 border-t border-border/30">
                  <h4 className="text-lg font-bold">Accent Color</h4>
                   <div className="flex gap-4">
                      {['blue', 'purple', 'emerald', 'rose', 'amber'].map((color) => (
                        <button 
                          key={color} 
                          className={cn(
                            "h-10 w-10 rounded-full border-2 transition-all",
                            color === 'blue' ? "bg-blue-500 border-primary" : `bg-${color}-500 border-transparent hover:scale-110`
                          )}
                        />
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-black">Notifications</h3>
                  <p className="text-muted-foreground">Manage how you receive alerts and updates.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Push Notifications', desc: 'Receive real-time alerts on your device.' },
                    { label: 'Email Summaries', desc: 'Get weekly activity summaries via email.' },
                    { label: 'AI Insights', desc: 'New AI suggestions and note summaries.' },
                    { label: 'Team Activity', desc: 'Alerts when someone edits a shared note.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border/30">
                      <div>
                        <p className="font-bold">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className="h-6 w-12 bg-primary rounded-full relative p-1 cursor-pointer">
                        <div className="h-4 w-4 bg-white rounded-full absolute right-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-black">Account Security</h3>
                  <p className="text-muted-foreground">Protect your account with advanced security features.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-muted/30 rounded-3xl border border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-all">Enable</button>
                  </div>

                  <div className="p-6 bg-muted/30 rounded-3xl border border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <LogOut className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold">Active Sessions</p>
                        <p className="text-xs text-muted-foreground">Logged in from 3 devices (SF, London, Tokyo)</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 text-muted-foreground font-bold hover:text-red-500 transition-all">Logout Others</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-black">Subscription Plan</h3>
                  <p className="text-muted-foreground">You are currently on the Pro Plan.</p>
                </div>

                <div className="p-8 bg-gradient-to-br from-primary to-indigo-600 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] uppercase font-black tracking-widest">Active Plan</span>
                        <h4 className="text-3xl font-black mt-2">Pro Member</h4>
                      </div>
                      <CreditCard className="h-10 w-10 opacity-50 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-2 mb-8">
                       <p className="text-white/70 text-sm font-medium">Billed Monthly</p>
                       <p className="text-4xl font-black">$29<span className="text-lg font-normal opacity-50">/mo</span></p>
                    </div>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 bg-white text-primary font-black rounded-xl hover:scale-105 transition-all active:scale-95">Upgrade Plan</button>
                      <button className="px-6 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 transition-all">Manage Billing</button>
                    </div>
                  </div>
                  <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
