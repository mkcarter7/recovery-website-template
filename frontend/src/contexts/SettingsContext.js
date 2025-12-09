import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: '2nd Chance Recovery',
    primary_color: '#000000',
    secondary_color: '#808080',
    accent_color: '#DC143C',
    background_color: '#FFFFFF',
    hero_title: 'Your Journey to Recovery Starts Here',
    hero_subtitle: 'Compassionate care for lasting recovery',
    about_content: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/public/');
      setSettings(response.data);
      applyTheme(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (settings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.primary_color || '#000000');
    root.style.setProperty('--secondary-color', settings.secondary_color || '#808080');
    root.style.setProperty('--accent-color', settings.accent_color || '#DC143C');
    root.style.setProperty('--background-color', settings.background_color || '#FFFFFF');
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.patch('/settings/1/', newSettings);
      setSettings(response.data);
      applyTheme(response.data);
      return { success: true };
    } catch (error) {
      console.error('Error updating settings:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.detail || 
                      error.response.data?.message || 
                      JSON.stringify(error.response.data) ||
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Is the backend running?';
      } else {
        // Error in setting up the request
        errorMessage = error.message || 'Error setting up request';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    settings,
    updateSettings,
    fetchSettings,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
