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
  const [activeTab, setActiveTab] = useState<'general' | 'projects' | 'services' | 'seo'>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [projects, setProjects] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', category: '', image_url: '' });
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
    const initDashboard = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          setSession(currentSession);
          fetchProjects();
        } else {
          // Fallback if protected route somehow lets them through
          navigate('/admin/login', { replace: true });
        }
      } catch (err) {
        console.error('Initalization failed:', err);
      }
    };
    
    initDashboard();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/admin/login', { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setFetchError(null);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setProjects(data);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setFetchError(err.message || 'Failed to fetch projects. Check RLS policies.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`; // Direct in bucket root

    try {
      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      setNewProject({ ...newProject, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed. Ensure a "projects" bucket exists and is public in Supabase Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.image_url) return;
    
    const projectToInsert = {
      title_de: newProject.title,
      title_en: newProject.title, // Default same for now
      category_de: newProject.category || 'Abbruch',
      category_en: newProject.category || 'Demolition',
      image_url: newProject.image_url,
      status: 'completed'
    };

    const { error } = await supabase.from('projects').insert([projectToInsert]);
    if (!error) {
      setNewProject({ title: '', category: '', image_url: '' });
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) fetchProjects();
  };

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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

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
              { id: 'projects', icon: <ImageIcon size={18} />, label: 'Project Portfolio' },
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
                  {activeTab === 'projects' && 'Project Portfolio'}
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

            {/* Tab: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {fetchError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-sm flex gap-4">
                    <AlertTriangle className="shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold">Database Access Error</p>
                      <p>{fetchError}</p>
                      <button 
                        onClick={fetchProjects}
                        className="mt-2 text-xs font-black uppercase tracking-widest underline underline-offset-4"
                      >
                        Retry Connection
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl">
                  <h3 className="font-bold uppercase tracking-widest mb-6 italic">Add New Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-60">Project Title</label>
                      <input 
                        type="text" 
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl outline-none focus:border-primary" 
                        placeholder="e.g. Industrial Demolition Berlin"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-60">Category</label>
                      <input 
                        type="text" 
                        value={newProject.category}
                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                        className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl outline-none focus:border-primary" 
                        placeholder="e.g. Demolition"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-2">Image</label>
                    <div className="relative border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center hover:border-primary transition-colors bg-neutral-50 dark:bg-black group">
                      {newProject.image_url ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                          <img src={newProject.image_url} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setNewProject({...newProject, image_url: ''})}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center">
                            <Plus className="text-neutral-400 group-hover:text-primary transition-colors mb-2" size={32} />
                            <p className="text-sm font-bold uppercase tracking-widest mb-1">
                              {isUploading ? 'Uploading...' : 'Upload Image'}
                            </p>
                            <p className="text-xs text-neutral-500">Max size 5MB (Requires projects bucket)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleAddProject}
                    disabled={!newProject.title || !newProject.image_url}
                    className="w-full bg-primary text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Project to Portfolio
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest italic">Current Portfolio ({projects.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl group hover:border-primary/50 transition-colors">
                        <img src={project.image_url} className="w-16 h-16 rounded-lg object-cover bg-neutral-100" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{project.title}</p>
                          <p className="text-[10px] uppercase tracking-widest text-neutral-500">{project.category}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
