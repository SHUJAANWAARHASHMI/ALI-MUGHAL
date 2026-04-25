import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  Layers, 
  Image as ImageIcon, 
  Globe, 
  Save, 
  LogOut, 
  Plus, 
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/PageTransition';
import { cn } from '../lib/utils';

const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'seo'>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const navigate = useNavigate();

  // Mock data for demo - in production this comes from Supabase
  const [companySettings, setCompanySettings] = useState({
    name: 'Ali-Mughal',
    slogan_de: 'Präzision im Abbruch.',
    slogan_en: 'Precision in Demolition.',
    email: 'info@ali-mughal.de',
    phone: '+49 123 4567890',
    address: 'Musterstraße 123, 10117 Berlin',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin/login');
      setSession(session);
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  if (!session) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col">
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Control Center</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'general', icon: <Settings size={18} />, label: 'General Settings' },
              { id: 'services', icon: <Layers size={18} />, label: 'Services Content' },
              { id: 'seo', icon: <Globe size={18} />, label: 'SEO & Localization' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-black" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-display font-black uppercase tracking-tighter">
                  {activeTab === 'general' && 'General Configuration'}
                  {activeTab === 'services' && 'Content Management'}
                  {activeTab === 'seo' && 'Search & Languages'}
                </h1>
                <p className="text-zinc-500 text-sm mt-1">Manage your website's dynamic content and settings.</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-sm transition-all",
                  saveStatus === 'saved' ? "bg-green-500 text-white" : "bg-black dark:bg-white text-white dark:text-black hover:scale-105"
                )}
              >
                {saveStatus === 'saving' ? <LogOut className="animate-spin" /> : saveStatus === 'saved' ? <CheckCircle2 /> : <Save />}
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save Changes'}
              </button>
            </div>

            {/* Config Warnings */}
            {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
              <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-sm flex gap-4">
                <AlertTriangle className="shrink-0" />
                <div className="text-sm">
                  <p className="font-bold">Database Disconnected</p>
                  <p>Supabase environment variables are missing. Changes will not be persisted to the cloud until configured in the project settings.</p>
                </div>
              </div>
            )}

            {/* Tab: General */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Company Name</label>
                    <input 
                      type="text" 
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Official Email</label>
                    <input 
                      type="email" 
                      value={companySettings.email}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Slogan (German)</label>
                  <input 
                    type="text" 
                    value={companySettings.slogan_de}
                    className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Slogan (English)</label>
                  <input 
                    type="text" 
                    value={companySettings.slogan_en}
                    className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary" 
                  />
                </div>
                <div className="p-8 bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-sm text-center group cursor-pointer hover:border-primary transition-colors">
                  <ImageIcon className="mx-auto mb-4 text-zinc-400 group-hover:text-primary transition-colors" size={32} />
                  <p className="text-sm font-bold uppercase tracking-widest">Upload Company Logo</p>
                  <p className="text-xs text-zinc-500 mt-1">SVG or PNG recommended (max 2MB)</p>
                </div>
              </div>
            )}

            {/* Tab: Services */}
            {activeTab === 'services' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold uppercase tracking-widest">Active Services (6)</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-primary hover:text-black rounded-sm transition-all font-bold text-xs uppercase tracking-widest">
                    <Plus size={14} /> Add Service
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {['Total Demolition', 'Interior Gutting', 'Industrial Dismantling'].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-sm group hover:border-primary transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-sm flex items-center justify-center text-zinc-400">
                          <Layers size={20} />
                        </div>
                        <div>
                          <p className="font-bold">{s}</p>
                          <p className="text-xs text-zinc-400 uppercase tracking-widest">Status: Active</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-zinc-400 hover:text-primary transition-colors"><Settings size={18} /></button>
                        <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Meta Title Template</label>
                  <input type="text" defaultValue="%company% - %page% | Professional Abbruch" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Default Language</label>
                  <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary">
                    <option value="de">German (Deutsch)</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="p-6 bg-primary/10 border border-primary/20 rounded-sm">
                  <h4 className="font-bold flex items-center gap-2 mb-2"><Globe size={16} /> Translation Synchronization</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Automatically synchronize German content with English using Google Cloud Translation API.</p>
                  <button className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:-translate-y-0.5 transition-transform">Run Sync Job</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
