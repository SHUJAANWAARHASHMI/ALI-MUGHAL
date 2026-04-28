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
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/PageTransition';
import { cn } from '../lib/utils';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'projects' | 'services' | 'seo'>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [projects, setProjects] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error' | 'missing_tables'>('checking');
  const [isUploading, setIsUploading] = useState(false);
  const [newProject, setNewProject] = useState({ title_de: '', category_de: '', image_url: '' });
  const [newService, setNewService] = useState({ title_de: '', description_de: '', icon: 'Hammer' });
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({
    company_name: 'FJ Bauservice',
    slogan_de: 'Raum für Neues schaffen',
    slogan_en: 'Creating space for the new',
    contact_email: 'amjad.ali@fj-bauservice.com',
    contact_phone: '0159 06142923',
    contact_address: 'Bahnhofstraße 9, 83022 Rosenheim',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingService, setIsSavingService] = useState(false);

  const fetchData = async () => {
    setDbStatus('checking');
    try {
      setFetchError(null);
      
      // Connection & Table presence check
      console.log('Starting fetch from website_settings...');
      const { data: testData, error: testErr } = await supabase.from('website_settings').select('key').limit(1);
      
      if (testErr) {
        console.error('Connection test error:', testErr);
        if (testErr.message?.includes('relation "website_settings" does not exist') || testErr.code === '42P01') {
          setDbStatus('missing_tables');
          setFetchError('TABLES MISSING. Please run the SQL setup script in Supabase.');
        } else if (testErr.code === 'PGRST301' || testErr.message?.includes('JWT')) {
          setDbStatus('error');
          setFetchError('AUTH ERROR: Your Anon Key is likely invalid. Get it from Supabase -> Settings -> API.');
        } else {
          setDbStatus('error');
          setFetchError(`Connection error (${testErr.code || 'unknown'}): ${testErr.message}`);
        }
      } else {
        console.log('Connection test successful.');
        setDbStatus('connected');
      }

      // Fetch Projects
      console.log('Fetching projects...');
      const { data: pData, error: pErr } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (pErr) {
        console.warn('Projects fetch failed:', pErr);
        setProjects([
          { id: '1', title_de: 'Abbrucharbeiten Rosenheim (Local Fallback)', category_de: 'Abbruch', image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=400' },
          { id: '2', title_de: 'Kernbohrung Industriehalle (Local Fallback)', category_de: 'Kernbohrung', image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400' }
        ]);
      } else {
        console.log(`Fetched ${pData?.length || 0} projects`);
        setProjects(pData || []);
      }

      // Fetch Services
      const { data: sData, error: sErr } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (sErr) {
        console.warn('Services fetch warning:', sErr);
        setServicesData([
          { id: '1', title_de: 'Abbrucharbeiten (Fallback)', description_de: 'Fachgerechter Abbruch von Gebäuden.' },
          { id: '2', title_de: 'Entkernungsarbeiten (Fallback)', description_de: 'Vorbereitung von Renovierungen.' }
        ]);
      } else {
        setServicesData(sData || []);
      }

      // Fetch Settings
      console.log('Fetching website settings...');
      const { data: stData, error: stErr } = await supabase.from('website_settings').select('*');
      if (stErr) console.error('Settings fetch error:', stErr);
      if (stData && stData.length > 0) {
        console.log(`Loaded ${stData.length} settings`);
        const map: Record<string, string> = {};
        stData.forEach((item: any) => map[item.key] = item.value);
        setSettingsMap(prev => ({ ...prev, ...map }));
      }
    } catch (err: any) {
      console.error('Critical fetch process error:', err);
      setDbStatus('error');
      setFetchError(err.message || 'Unknown database error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setFetchError(null);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      console.log('Bucket check: Attempting to list files in "projects"...');
      const { data: bucketCheck, error: bucketError } = await supabase.storage.from('projects').list('', { limit: 1 });
      
      if (bucketError) {
        console.error('Bucket access error:', bucketError);
        throw new Error('STORAGE ERROR: Could not access "projects" bucket. Ensure it exists and is PUBLIC in your Supabase Dashboard.');
      }

      console.log('Bucket accessible. Starting upload...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload phase error:', uploadError);
        throw uploadError;
      }

      console.log('Upload success, data:', uploadData);
      
      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      console.log('Resolved Public URL:', publicUrl);
      setNewProject({ ...newProject, image_url: publicUrl });
    } catch (error: any) {
      console.error('Storage Flow Error:', error);
      setFetchError(`Image Upload Failed: ${error.message}`);
      alert(`UPLOAD ERROR!\n\n${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title_de || !newProject.image_url) {
      alert("Missing Title or Image URL");
      return;
    }
    
    setIsSavingProject(true);
    console.log('Attempting to insert project:', newProject);
    try {
      const { data, error } = await supabase.from('projects').insert([{
        title_de: newProject.title_de,
        title_en: newProject.title_de,
        category_de: newProject.category_de || 'Abbruch',
        category_en: newProject.category_de || 'Demolition',
        image_url: newProject.image_url,
      }]).select();

      if (error) {
        console.error('Error adding project:', error);
        alert(`COMMIT FAILED!\n\nError: ${error.message}\n\nHint: Check RLS settings and verify the "projects" table exists.`);
      } else {
        console.log('Project added successfully:', data);
        setNewProject({ title_de: '', category_de: '', image_url: '' });
        await fetchData();
      }
    } catch (err: any) {
      alert(`Unexpected Error: ${err.message}`);
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.title_de || !newService.description_de) {
      alert("Missing Title or Description");
      return;
    }
    
    setIsSavingService(true);
    try {
      const { error } = await supabase.from('services').insert([{
        title_de: newService.title_de,
        title_en: newService.title_de,
        description_de: newService.description_de,
        description_en: newService.description_en || newService.description_de,
        icon: newService.icon,
        sort_order: servicesData.length
      }]);

      if (error) {
        console.error('Error adding service:', error);
        alert(`PROVISION FAILED!\n\nError: ${error.message}`);
      } else {
        setNewService({ title_de: '', description_de: '', icon: 'Hammer' });
        await fetchData();
      }
    } catch (err: any) {
      alert(`Unexpected Error: ${err.message}`);
    } finally {
      setIsSavingService(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setDebugInfo('Running tests...');
    const results: string[] = [];
    
    try {
      // Test 1: Settings Table
      const { data: s1, error: e1 } = await supabase.from('website_settings').select('key').limit(1);
      results.push(`Settings Table: ${e1 ? 'FAILED (' + e1.message + ')' : 'OK'}`);
      
      // Test 2: Projects Table
      const { data: s2, error: e2 } = await supabase.from('projects').select('id').limit(1);
      results.push(`Projects Table: ${e2 ? 'FAILED (' + e2.message + ')' : 'OK'}`);
      
      // Test 3: Test Write
      const testKey = `test_${Date.now()}`;
      const { error: e3 } = await supabase.from('website_settings').upsert({ key: testKey, value: 'test' });
      results.push(`Test Write (Upsert): ${e3 ? 'FAILED (' + e3.message + ')' : 'OK'}`);
      
      // Test 4: Cleanup
      if (!e3) await supabase.from('website_settings').delete().eq('key', testKey);

      setDebugInfo(results.join('\n'));
    } catch (err: any) {
      setDebugInfo(`Diagnostic error: ${err.message}`);
    }
  };

  const handleSaveSettings = async () => {
    console.log('Initiating save for settings:', settingsMap);
    setSaveStatus('saving');
    setFetchError(null);
    
    try {
      const updates = Object.entries(settingsMap).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        updated_at: new Date().toISOString()
      }));

      console.log('Upserting updates:', updates);
      
      const { data, error, status } = await supabase
        .from('website_settings')
        .upsert(updates, { onConflict: 'key' })
        .select();

      if (error) {
        console.error('Supabase Upsert Error:', error);
        console.error('Status Code:', status);
        throw error;
      }
      
      console.log('Save Complete. Data:', data);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Final Save Catch:', err);
      setSaveStatus('error');
      setFetchError(`Save Error: ${err.message || 'Database connection lost'}`);
      alert(`SAVE FAILED!\n\n${err.message || 'Unknown error'}\n\nCommon Causes:\n1. RLS is still enabled.\n2. Table "website_settings" is missing.\n3. Unique constraint on "key" is missing.`);
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col">
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Control Center</h2>
            {fetchError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-sm">
                <p className="text-[10px] text-red-700 dark:text-red-300 font-bold leading-tight">
                  {fetchError}
                </p>
                {dbStatus === 'missing_tables' && (
                  <p className="mt-2 text-[9px] text-zinc-500 font-medium">
                    Run the script in <code className="text-primary">supabase_setup.sql</code> in your Supabase SQL Editor to fix this.
                  </p>
                )}
              </div>
            )}
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
            <div className="mb-4 px-4">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Project Endpoint</p>
              <p className="text-[8px] font-mono break-all opacity-50 truncate" title={(supabase as any).supabaseUrl}>
                {(supabase as any).supabaseUrl || 'Loading...'}
              </p>
            </div>
            <div className="px-4 mb-4">
              <button 
                onClick={runDiagnostics}
                className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 text-[10px] uppercase font-black tracking-widest rounded-sm hover:bg-primary transition-colors"
              >
                Run Connection Test
              </button>
              {debugInfo && (
                <div className="mt-2 p-2 bg-black text-[9px] font-mono text-green-400 whitespace-pre-wrap border border-zinc-800">
                  {debugInfo}
                </div>
              )}
            </div>
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
                  {activeTab === 'services' && 'Service Management'}
                  {activeTab === 'seo' && 'Search & Languages'}
                </h1>
                <p className="text-zinc-500 text-sm mt-1">Manage your website's dynamic content and settings.</p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={saveStatus === 'saving'}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-sm transition-all shadow-[4px_4px_0px_theme(colors.black)] dark:shadow-[4px_4px_0px_theme(colors.white)]",
                  saveStatus === 'saved' ? "bg-green-500 text-white" : 
                  saveStatus === 'error' ? "bg-red-500 text-white" :
                  "bg-primary text-black hover:bg-white"
                )}
              >
                {saveStatus === 'saving' ? <Loader2 className="animate-spin" /> : saveStatus === 'saved' ? <CheckCircle2 /> : <Save />}
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
              </button>
            </div>

            {/* Config Warnings */}
            {fetchError && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-sm flex gap-4">
                <AlertTriangle className="shrink-0" />
                <div className="text-sm">
                  <p className="font-bold uppercase tracking-wider">System Database Error</p>
                  <p>{fetchError}</p>
                  <button 
                    onClick={fetchData}
                    className="mt-2 text-[10px] font-black uppercase tracking-widest underline underline-offset-4"
                  >
                    Attempt Reconnection
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-8 rounded-sm">
                  <h3 className="font-display font-black uppercase text-xl mb-6 italic">Add New Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-60">Project Title (German)</label>
                      <input 
                        type="text" 
                        value={newProject.title_de}
                        onChange={(e) => setNewProject({...newProject, title_de: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                        placeholder="e.g. Industrieabbruch Berlin"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-60">Category (German)</label>
                      <input 
                        type="text" 
                        value={newProject.category_de}
                        onChange={(e) => setNewProject({...newProject, category_de: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                        placeholder="e.g. Abbruch"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-2">Image Upload</label>
                    <div className="relative border-4 border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center hover:border-primary transition-colors bg-zinc-50 dark:bg-black group">
                      {newProject.image_url ? (
                        <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-black">
                          <img src={newProject.image_url} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setNewProject({...newProject, image_url: ''})}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-sm hover:scale-110 transition-transform shadow-lg"
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
                            <Plus className="text-zinc-400 group-hover:text-primary transition-colors mb-2" size={32} />
                            <p className="text-sm font-black uppercase tracking-widest mb-1">
                              {isUploading ? 'Transferring Data...' : 'Select File'}
                            </p>
                            <p className="text-[10px] text-zinc-500 uppercase font-mono">Max size 5MB (Requires 'projects' bucket)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleAddProject}
                    disabled={!newProject.title_de || !newProject.image_url || isSavingProject}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-sm hover:bg-primary hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] shadow-[4px_4px_0px_var(--color-primary)] flex items-center justify-center gap-2"
                  >
                    {isSavingProject ? <Loader2 className="animate-spin text-primary" size={20} /> : null}
                    {isSavingProject ? 'Processing...' : 'Commit Project'}
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-black uppercase italic text-xl">Active Portfolio ({projects.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm group hover:border-black dark:hover:border-white transition-colors">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-black overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                          <img src={project.image_url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold border-b border-transparent group-hover:border-primary w-fit truncate text-sm uppercase">{project.title_de || project.title}</p>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mt-1">{project.category_de || project.category}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-3 text-zinc-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 rounded-sm"
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
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Company Identity</label>
                    <input 
                      type="text" 
                      value={settingsMap.company_name}
                      onChange={(e) => setSettingsMap({...settingsMap, company_name: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Official Correspondence Email</label>
                    <input 
                      type="email" 
                      value={settingsMap.contact_email}
                      onChange={(e) => setSettingsMap({...settingsMap, contact_email: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Slogan (Deutsch)</label>
                    <textarea 
                      rows={2}
                      value={settingsMap.slogan_de}
                      onChange={(e) => setSettingsMap({...settingsMap, slogan_de: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Slogan (English)</label>
                    <textarea 
                      rows={2}
                      value={settingsMap.slogan_en}
                      onChange={(e) => setSettingsMap({...settingsMap, slogan_en: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Hotline / Phone</label>
                    <input 
                      type="text" 
                      value={settingsMap.contact_phone}
                      onChange={(e) => setSettingsMap({...settingsMap, contact_phone: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Headquarters Address</label>
                    <input 
                      type="text" 
                      value={settingsMap.contact_address}
                      onChange={(e) => setSettingsMap({...settingsMap, contact_address: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Services */}
            {activeTab === 'services' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-8 rounded-sm">
                  <h3 className="font-display font-black uppercase text-xl mb-6 italic">Add New Service</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-60">Service Title (German)</label>
                      <input 
                        type="text" 
                        value={newService.title_de}
                        onChange={(e) => setNewService({...newService, title_de: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-60">Description (German)</label>
                      <textarea 
                        rows={3}
                        value={newService.description_de}
                        onChange={(e) => setNewService({...newService, description_de: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 outline-none focus:border-primary font-mono text-sm" 
                      />
                    </div>
                    <button 
                      onClick={handleAddService}
                      disabled={!newService.title_de || !newService.description_de || isSavingService}
                      className="w-full bg-primary text-black font-black uppercase tracking-widest py-4 rounded-sm hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2"
                    >
                      {isSavingService ? <Loader2 className="animate-spin text-white" size={20} /> : null}
                      {isSavingService ? 'Provisioning...' : 'Provision Service'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <h3 className="font-display font-black uppercase italic text-xl">Active Services ({servicesData.length})</h3>
                  {servicesData.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between p-6 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-sm group hover:border-primary transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-sm flex items-center justify-center text-primary font-black text-xs border border-zinc-200 dark:border-zinc-800">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-black uppercase italic">{s.title_de}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-widest line-clamp-1">{s.description_de}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDeleteService(s.id)}
                          className="p-3 text-zinc-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 rounded-sm"
                        >
                          <Trash2 size={20} />
                        </button>
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
