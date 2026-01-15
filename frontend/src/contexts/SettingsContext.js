import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../config/api';
import axios from 'axios';

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
    site_name: 'Recovery',
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
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    youtube_url: '',
    tiktok_url: '',
  });
  const [loading, setLoading] = useState(true);

  const applyTheme = useCallback((settings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.primary_color || '#000000');
    root.style.setProperty('--secondary-color', settings.secondary_color || '#808080');
    root.style.setProperty('--accent-color', settings.accent_color || '#DC143C');
    root.style.setProperty('--background-color', settings.background_color || '#FFFFFF');
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await api.get('/settings/public/');
      setSettings(response.data);
      applyTheme(response.data);
    } catch (error) {
      // Silently handle error - settings will use defaults
    } finally {
      setLoading(false);
    }
  }, [applyTheme]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings) => {
    try {
      // Check if there's a file to upload (background_image)
      const hasFile = newSettings.background_image instanceof File;
      
      let response;
      if (hasFile || newSettings.background_image === null) {
        // Use FormData for file uploads or when removing image
        const formData = new FormData();
        
        // Add all fields to FormData
        Object.keys(newSettings).forEach(key => {
          if (key === 'background_image') {
            if (newSettings[key] instanceof File) {
              formData.append('background_image', newSettings[key]);
            } else if (newSettings[key] === null) {
              // Send empty string to remove image
              formData.append('background_image', '');
            }
            // If it's a string (URL), don't include it (backend keeps existing)
          } else {
            // Handle social media URLs: send empty string for null values so backend can clear them
            const socialMediaFields = ['facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url', 'youtube_url', 'tiktok_url'];
            if (socialMediaFields.includes(key) && newSettings[key] === null) {
              formData.append(key, '');
            } else {
              // Convert non-file values to strings
              const value = newSettings[key];
              if (value !== null && value !== undefined) {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
              }
            }
          }
        });
        
        // Use axios with FormData (axios handles Content-Type automatically)
        const token = localStorage.getItem('firebaseToken');
        let API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        
        // Validate API URL is set and is a full URL (not relative)
        if (window.location.hostname !== 'localhost') {
          if (!process.env.REACT_APP_API_URL) {
            return { 
              success: false, 
              error: 'API URL not configured. Please set REACT_APP_API_URL in Railway environment variables and trigger a new deployment.' 
            };
          }
          
          // Check if it's a relative path (starts with /)
          if (API_BASE_URL.startsWith('/')) {
            return { 
              success: false, 
              error: 'REACT_APP_API_URL must be a full URL (starting with http:// or https://), not a relative path.' 
            };
          }
          
          // Ensure it starts with http:// or https://
          if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
            return { 
              success: false, 
              error: 'REACT_APP_API_URL must be a full URL starting with http:// or https://' 
            };
          }
        }
        
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Use axios directly for FormData request
        response = await axios.patch(`${API_BASE_URL}/settings/1/`, formData, { headers });
        
        setSettings(response.data);
        applyTheme(response.data);
        return { success: true };
      } else {
        // Regular JSON request for non-file updates
        response = await api.patch('/settings/1/', newSettings);
        setSettings(response.data);
        applyTheme(response.data);
        return { success: true };
      }
    } catch (error) {
      // Error handled and returned to caller
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
