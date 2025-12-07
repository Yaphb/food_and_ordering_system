import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { API_URL } from '../config';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // Account Info State
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Apply theme on mount - use user's saved preference from server
  useEffect(() => {
    const userTheme = user?.themePreference || localStorage.getItem('theme') || 'light';
    setTheme(userTheme);
    
    if (userTheme === 'auto') {
      applyAutoTheme();
    } else {
      document.documentElement.setAttribute('data-theme', userTheme);
    }
  }, [user]);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile`, accountData);
      updateUser(response.data.user);
      showToast('Profile updated successfully! ✓', 'success');
    } catch (error) {
      showToast('Failed to update profile: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Password changed successfully! ✓', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast('Failed to change password: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyAutoTheme = () => {
    // Get current time in Malaysia timezone (UTC+8)
    const now = new Date();
    const malaysiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
    const hour = malaysiaTime.getHours();
    
    // Dark mode: 6 PM (18:00) to 6 AM (06:00)
    // Light mode: 6 AM (06:00) to 6 PM (18:00)
    const isDarkTime = hour >= 18 || hour < 6;
    const autoTheme = isDarkTime ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', autoTheme);
    return autoTheme;
  };

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Save theme preference to server
    try {
      await axios.put(`${API_URL}/api/auth/theme-preference`, { themePreference: newTheme });
      
      // Update user context with new theme preference
      updateUser({ ...user, themePreference: newTheme });
      
      if (newTheme === 'auto') {
        const appliedTheme = applyAutoTheme();
        showToast(`Theme set to auto (currently ${appliedTheme} mode based on Malaysia time)`, 'success');
      } else {
        document.documentElement.setAttribute('data-theme', newTheme);
        showToast(`Theme changed to ${newTheme} mode`, 'success');
      }
    } catch (error) {
      showToast('Failed to save theme preference: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  // Auto theme updater
  useEffect(() => {
    if (theme === 'auto') {
      applyAutoTheme();
      
      // Update theme every minute to check time changes
      const interval = setInterval(() => {
        applyAutoTheme();
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [theme]);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="profile-role">{user?.role}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'account' && (
            <form onSubmit={handleUpdateAccount} className="profile-form">
              <h2>Account Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={accountData.name}
                  onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={accountData.phone}
                  onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={accountData.address}
                  onChange={(e) => setAccountData({ ...accountData, address: e.target.value })}
                  rows="3"
                  required
                />
              </div>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="profile-form">
              <h2>Change Password</h2>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'preferences' && (
            <div className="profile-form">
              <h2>Preferences</h2>
              
              <div className="preference-section">
                <h3>Theme</h3>
                <p className="preference-desc">Choose your preferred color theme. Your preference will be saved and applied across all sessions.</p>
                <div className="theme-options">
                  <div 
                    className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="theme-preview light-preview">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <span>Light</span>
                  </div>
                  <div 
                    className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="theme-preview dark-preview">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <span>Dark</span>
                  </div>
                  <div 
                    className={`theme-card ${theme === 'auto' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('auto')}
                  >
                    <div className="theme-preview auto-preview">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <span>Auto</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
