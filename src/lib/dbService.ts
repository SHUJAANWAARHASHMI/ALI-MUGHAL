import { supabase } from './supabase';

export const dbService = {
  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_images(*)');
    if (error) throw error;
    return data;
  },

  async addProject(project: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteProject(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // Services
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Settings
  async getSettings() {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    return data;
  },

  // Contact
  async sendMessage(message: any) {
    const { error } = await supabase.from('contact_messages').insert([message]);
    if (error) throw error;
  }
};
