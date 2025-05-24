// src/pages/settings/Settings.tsx
import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Shield, Settings as SettingsIconComponent, Edit3, Camera, Save } from 'lucide-react'; // Tambahkan Save
import { useAuth } from '../../contexts/AuthContext'; // Untuk mendapatkan info user awal jika perlu
import {
  fetchUserSettings,
  updateAccountSettings,
  updateNotificationPreferences,
  updateTherapySettings,
  updateSecuritySettings,
  changePassword, // Jika Anda ingin mengimplementasikan ganti password
  UserSettings, // Tipe utama
  AccountSettingsData,
  NotificationPreferencesData,
  TherapySettingsData,
  SecuritySettingsData
} from '../../services/settingsService';

const SettingsPage: React.FC = () => {
  const { user } = useAuth(); // Info user dari AuthContext
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk semua settings, diinisialisasi sebagai null atau objek kosong
  const [accountData, setAccountData] = useState<Partial<AccountSettingsData>>({});
  const [notificationPrefs, setNotificationPrefs] = useState<Partial<NotificationPreferencesData>>({});
  const [therapySettings, setTherapySettings] = useState<Partial<TherapySettingsData>>({});
  const [securitySettings, setSecuritySettings] = useState<Partial<SecuritySettingsData>>({});

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSettingTab, setActiveSettingTab] = useState<'account' | 'notifications' | 'therapy' | 'security'>('account');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // State untuk form ganti password (jika diimplementasikan)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await fetchUserSettings();
        // Gabungkan data dari AuthContext (jika relevan) dengan data dari service untuk AccountSettings
        // Ini memastikan data akun yang ditampilkan adalah yang terbaru dari profil pengguna
        // dan bisa dilengkapi dengan detail lain dari 'settings'.
        setAccountData({
            fullName: user?.name || settings.account.fullName,
            medicalInstitution: user?.institution || settings.account.medicalInstitution,
            role: user?.role || settings.account.role,
            email: user?.email || settings.account.email,
            phoneNumber: settings.account.phoneNumber || '', // Ambil dari settings jika ada
            profilePicture: settings.account.profilePicture // Ambil dari settings (mungkin URL)
        });
        setNotificationPrefs(settings.notifications);
        setTherapySettings(settings.therapy);
        setSecuritySettings(settings.security);
      } catch (error) {
        console.error("Gagal memuat pengaturan pengguna:", error);
        showFeedback("Gagal memuat pengaturan.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [user]); // Jalankan ulang jika user dari AuthContext berubah

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ type, message });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfilePic = reader.result as string;
        setAccountData(prev => ({ ...prev, profilePicture: newProfilePic }));
        // Di sini Anda juga bisa langsung memanggil service untuk upload gambar jika backend mendukung
        // dan kemudian menyimpan URL-nya. Untuk mock, kita hanya update state.
        showFeedback('Profile picture preview updated. Save changes to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({ ...prev, [name]: checked }));
  };

  const handleTherapySettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setTherapySettings(prev => ({
        ...prev,
        [name]: isCheckbox ? inputValue : name === 'defaultSessionDuration' ? parseInt(inputValue as string, 10) : inputValue
    }));
  };

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSecuritySettings(prev => ({ ...prev, [name]: checked }));
  };

  // Handler untuk menyimpan perubahan
  const handleSaveChanges = async (section: typeof activeSettingTab) => {
    try {
      let success = false;
      switch (section) {
        case 'account':
          // Pastikan accountData yang dikirim adalah AccountSettingsData penuh jika diperlukan oleh service
          await updateAccountSettings(accountData as AccountSettingsData); // Mungkin perlu penyesuaian tipe
          // TODO: Jika updateAccountSettings berhasil dan ada perubahan pada nama/institusi/email,
          // Anda mungkin perlu memanggil fungsi update user di AuthContext.
          success = true;
          break;
        case 'notifications':
          await updateNotificationPreferences(notificationPrefs as NotificationPreferencesData);
          success = true;
          break;
        case 'therapy':
          await updateTherapySettings(therapySettings as TherapySettingsData);
          success = true;
          break;
        case 'security':
          await updateSecuritySettings(securitySettings as Partial<SecuritySettingsData>);
          success = true;
          break;
      }
      if (success) {
        showFeedback(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
      }
    } catch (error) {
      console.error(`Gagal menyimpan pengaturan ${section}:`, error);
      showFeedback(`Failed to save ${section} settings.`, "error");
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
        showFeedback("New passwords do not match.", "error");
        return;
    }
    if (!oldPassword || !newPassword) {
        showFeedback("All password fields are required.", "error");
        return;
    }
    try {
        const result = await changePassword(oldPassword, newPassword);
        if (result.success) {
            showFeedback(result.message || "Password changed successfully!");
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            // Muat ulang security settings untuk update 'passwordLastChanged'
            const settings = await fetchUserSettings();
            setSecuritySettings(settings.security);
        } else {
            showFeedback(result.message || "Failed to change password.", "error");
        }
    } catch (error) {
        console.error("Error changing password:", error);
        showFeedback("An unexpected error occurred while changing password.", "error");
    }
  };


  const settingNavItems = [
    { id: 'account' as const, label: 'Account Settings', icon: <User size={18} /> },
    { id: 'notifications' as const, label: 'Notification Preferences', icon: <Bell size={18} /> },
    { id: 'therapy' as const, label: 'Therapy Settings', icon: <SettingsIconComponent size={18} /> },
    { id: 'security' as const, label: 'Security and Privacy', icon: <Shield size={18} /> },
  ];

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col md:flex-row gap-6">
      {feedbackMessage && (
        <div className={`fixed top-20 right-6 px-4 py-2.5 rounded-md shadow-lg z-50 text-white transition-opacity duration-300 animate-fadeInOut ${feedbackMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {feedbackMessage.message}
        </div>
      )}

      {/* Sidebar Pengaturan */}
      <aside className="w-full md:w-72 lg:w-80 mr-0 md:mr-0 mb-6 md:mb-0 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-3 group">
            <img
              src={accountData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(accountData.fullName || 'User')}&background=random`}
              alt={accountData.fullName || 'User Profile'}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-offset-2 ring-blue-300"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Change profile picture"
            >
              <Camera size={24} className="text-white" />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            accept="image/*"
            className="hidden"
          />
          <h2 className="text-lg font-semibold text-gray-800">{accountData.fullName || 'N/A'}</h2>
          <p className="text-sm text-gray-500">{accountData.role || 'N/A'} at {accountData.medicalInstitution || 'N/A'}</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center w-full"
          >
            <Edit3 size={14} className="mr-1" /> Change Picture
          </button>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
          <nav className="space-y-1">
            {settingNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSettingTab(item.id)}
                className={`w-full flex items-center px-3.5 py-3 text-sm font-medium rounded-lg transition-all duration-150 ease-in-out
                  ${activeSettingTab === item.id
                    ? 'bg-blue-500 text-white shadow-md scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:pl-4'
                  }`}
              >
                {React.cloneElement(item.icon, { className: `mr-3 ${activeSettingTab === item.id ? 'text-white' : 'text-gray-500'}` })}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Konten Pengaturan Utama */}
      <main className="flex-1 space-y-6">
        {activeSettingTab === 'account' && (
          <form onSubmit={(e) => {e.preventDefault(); handleSaveChanges('account');}} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="fullName" id="fullName" value={accountData.fullName || ''} onChange={handleAccountInputChange} className="input-field"/>
              </div>
              <div>
                <label htmlFor="medicalInstitution" className="block text-sm font-medium text-gray-700 mb-1">Medical Institution</label>
                <input type="text" name="medicalInstitution" id="medicalInstitution" value={accountData.medicalInstitution || ''} onChange={handleAccountInputChange} className="input-field"/>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input type="text" name="role" id="role" value={accountData.role || ''} className="input-field bg-gray-100 cursor-not-allowed" readOnly/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" id="email" value={accountData.email || ''} onChange={handleAccountInputChange} className="input-field"/>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phoneNumber" id="phoneNumber" value={accountData.phoneNumber || ''} onChange={handleAccountInputChange} className="input-field"/>
              </div>
              <div className="pt-2 text-right">
                <button type="submit" className="btn-primary px-6 py-2.5 flex items-center justify-center ml-auto">
                  <Save size={16} className="mr-2"/> Save Account Changes
                </button>
              </div>
            </div>
          </form>
        )}

        {activeSettingTab === 'notifications' && (
          <form onSubmit={(e) => {e.preventDefault(); handleSaveChanges('notifications');}} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
            <div className="space-y-5">
              {[
                { name: 'fallDetectionAlerts', label: 'Fall detection alerts', description: 'Receive immediate notifications when a fall is detected' },
                { name: 'patientProgressUpdates', label: 'Patient progress updates', description: 'Get notified about significant changes in patient progress' },
                { name: 'systemUpdates', label: 'System updates', description: 'Receive notifications about RehabFloor system updates and maintenance' },
                { name: 'emailNotifications', label: 'Email notifications', description: 'Receive notifications via email' },
                { name: 'whatsAppNotifications', label: 'WhatsApp notifications', description: 'Receive notifications via WhatsApp text messages' },
              ].map(item => (
                <div key={item.name} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id={item.name} name={item.name} type="checkbox"
                           checked={notificationPrefs[item.name as keyof NotificationPreferencesData] || false}
                           onChange={handleNotificationChange}
                           className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={item.name} className="font-medium text-gray-700">{item.label}</label>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-right">
                <button type="submit" className="btn-primary px-6 py-2.5 flex items-center justify-center ml-auto">
                    <Save size={16} className="mr-2"/> Save Notification Preferences
                </button>
              </div>
            </div>
          </form>
        )}

        {activeSettingTab === 'therapy' && (
          <form onSubmit={(e) => {e.preventDefault(); handleSaveChanges('therapy');}} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Therapy Settings</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="defaultSessionDuration" className="block text-sm font-medium text-gray-700 mb-1">Default Session Duration (minutes)</label>
                <input type="number" name="defaultSessionDuration" id="defaultSessionDuration"
                       value={therapySettings.defaultSessionDuration || 45}
                       onChange={handleTherapySettingsChange}
                       className="input-field" min="15" max="120"
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="autoSaveNotes" name="autoSaveNotes" type="checkbox"
                         checked={therapySettings.autoSaveNotes || false}
                         onChange={handleTherapySettingsChange}
                         className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="autoSaveNotes" className="font-medium text-gray-700">Auto-save session notes</label>
                  <p className="text-xs text-gray-500">Automatically save notes every 5 minutes during a session.</p>
                </div>
              </div>
              <div className="pt-2 text-right">
                <button type="submit" className="btn-primary px-6 py-2.5 flex items-center justify-center ml-auto">
                    <Save size={16} className="mr-2"/> Save Therapy Settings
                </button>
              </div>
            </div>
          </form>
        )}

        {activeSettingTab === 'security' && (
          <form onSubmit={(e) => {e.preventDefault(); handleSaveChanges('security');}} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-200">
            <div className="pb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                    <input id="twoFactorAuth" name="twoFactorAuth" type="checkbox"
                            checked={securitySettings.twoFactorAuth || false}
                            onChange={handleSecuritySettingsChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">Enable Two-Factor Authentication (2FA)</label>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                </div>
                <div className="pt-2 text-right">
                    <button type="submit" className="btn-primary px-6 py-2.5 flex items-center justify-center ml-auto">
                        <Save size={16} className="mr-2"/> Save Security Settings
                    </button>
                </div>
            </div>
            <div className="pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
                 <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                        <input type="password" name="oldPassword" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="input-field" required />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" name="newPassword" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="input-field" required />
                    </div>
                     <div className="text-right">
                        <button type="submit" className="btn-primary px-5 py-2.5">Change Password</button>
                    </div>
                </form>
                {securitySettings.passwordLastChanged && (
                    <p className="text-xs text-gray-500 mt-4">Password last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}</p>
                )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;