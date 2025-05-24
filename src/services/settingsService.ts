// src/services/settingsService.ts

// Tipe data dari SettingsPage.tsx
export interface AccountSettingsData {
  fullName: string;
  medicalInstitution: string;
  role: string; // Biasanya tidak bisa diubah pengguna, diambil dari data user
  email: string;
  phoneNumber: string;
  profilePicture?: string; // Bisa berupa URL atau base64 string
}

export interface NotificationPreferencesData {
  fallDetectionAlerts: boolean;
  patientProgressUpdates: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  whatsAppNotifications: boolean;
}

export interface TherapySettingsData {
  defaultSessionDuration: number; // dalam menit
  autoSaveNotes: boolean;
}

export interface SecuritySettingsData {
  twoFactorAuth: boolean;
  passwordLastChanged?: string; // Tanggal string, opsional
  // Mungkin ada data lain seperti activity log, dll.
}

// Gabungan semua data settings
export interface UserSettings {
  account: AccountSettingsData;
  notifications: NotificationPreferencesData;
  therapy: TherapySettingsData;
  security: SecuritySettingsData;
}

// Mock data awal untuk settings
// Di aplikasi nyata, ini akan diambil dari backend atau default aplikasi
// Data `account` biasanya sebagian besar diambil dari data user (AuthContext)
const mockUserSettings: UserSettings = {
  account: {
    fullName: 'Dr. Jessica Chen (Mock)',
    medicalInstitution: 'Rehab Medical Center (Mock)',
    role: 'Physical Therapist',
    email: 'jessica.chen@rehabfloor.mock',
    phoneNumber: '(+62) 812-0000-0000',
    profilePicture: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  notifications: {
    fallDetectionAlerts: true,
    patientProgressUpdates: true,
    systemUpdates: true,
    emailNotifications: true,
    whatsAppNotifications: false,
  },
  therapy: {
    defaultSessionDuration: 45,
    autoSaveNotes: true,
  },
  security: {
    twoFactorAuth: false,
    passwordLastChanged: '2025-05-20',
  }
};

/**
 * Mengambil semua pengaturan pengguna.
 */
export const fetchUserSettings = async (): Promise<UserSettings> => {
  console.log("Fetching user settings (mock)...");
  await new Promise(resolve => setTimeout(resolve, 200));
  // Di aplikasi nyata, Anda mungkin perlu mengambil User dari AuthContext
  // untuk menyesuaikan data akun. Untuk sekarang, kita kembalikan mock penuh.

  // Cek localStorage seperti yang dilakukan di Settings.tsx
  const storedNotificationPrefs = localStorage.getItem('notificationPrefs_settingsPage');
  if (storedNotificationPrefs) {
    mockUserSettings.notifications = JSON.parse(storedNotificationPrefs);
  }
  const storedTherapySettings = localStorage.getItem('therapySettings_settingsPage');
  if (storedTherapySettings) {
    mockUserSettings.therapy = JSON.parse(storedTherapySettings);
  }
  const storedSecuritySettings = localStorage.getItem('securitySettings_settingsPage');
  if (storedSecuritySettings) {
    mockUserSettings.security = JSON.parse(storedSecuritySettings);
  }

  return JSON.parse(JSON.stringify(mockUserSettings)); // Kembalikan salinan mendalam
};

/**
 * Memperbarui pengaturan akun pengguna.
 * @param accountData Data akun yang akan diperbarui
 */
export const updateAccountSettings = async (accountData: Partial<AccountSettingsData>): Promise<AccountSettingsData> => {
  console.log("Updating account settings (mock)...", accountData);
  await new Promise(resolve => setTimeout(resolve, 300));
  mockUserSettings.account = { ...mockUserSettings.account, ...accountData };
  // Simpan ke localStorage jika diperlukan, atau panggil API backend.
  // Di AuthContext, user data juga mungkin perlu diperbarui.
  return { ...mockUserSettings.account };
};

/**
 * Memperbarui preferensi notifikasi pengguna.
 * @param notificationPrefs Preferensi notifikasi yang akan diperbarui
 */
export const updateNotificationPreferences = async (notificationPrefs: NotificationPreferencesData): Promise<NotificationPreferencesData> => {
  console.log("Updating notification preferences (mock)...", notificationPrefs);
  await new Promise(resolve => setTimeout(resolve, 200));
  mockUserSettings.notifications = { ...notificationPrefs };
  localStorage.setItem('notificationPrefs_settingsPage', JSON.stringify(mockUserSettings.notifications));
  return { ...mockUserSettings.notifications };
};

/**
 * Memperbarui pengaturan terapi.
 * @param therapySettings Pengaturan terapi yang akan diperbarui
 */
export const updateTherapySettings = async (therapySettings: TherapySettingsData): Promise<TherapySettingsData> => {
  console.log("Updating therapy settings (mock)...", therapySettings);
  await new Promise(resolve => setTimeout(resolve, 200));
  mockUserSettings.therapy = { ...therapySettings };
  localStorage.setItem('therapySettings_settingsPage', JSON.stringify(mockUserSettings.therapy));
  return { ...mockUserSettings.therapy };
};

/**
 * Memperbarui pengaturan keamanan.
 * @param securitySettings Pengaturan keamanan yang akan diperbarui
 */
export const updateSecuritySettings = async (securitySettings: Partial<SecuritySettingsData>): Promise<SecuritySettingsData> => {
  console.log("Updating security settings (mock)...", securitySettings);
  await new Promise(resolve => setTimeout(resolve, 200));
  mockUserSettings.security = { ...mockUserSettings.security, ...securitySettings };
  localStorage.setItem('securitySettings_settingsPage', JSON.stringify(mockUserSettings.security));
  return { ...mockUserSettings.security };
};

// Fungsi untuk mengganti password (contoh, akan memanggil API)
export const changePassword = async (oldPassword: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    console.log("Changing password (mock)...");
    await new Promise(resolve => setTimeout(resolve, 500));
    // Logika backend akan memverifikasi oldPassword dan memperbarui
    // Di sini kita hanya mensimulasikan berhasil
    if (oldPassword === "password123") { // Contoh validasi mock
        mockUserSettings.security.passwordLastChanged = new Date().toISOString().split('T')[0];
        localStorage.setItem('securitySettings_settingsPage', JSON.stringify(mockUserSettings.security));
        return { success: true, message: "Password changed successfully." };
    }
    return { success: false, message: "Old password incorrect." };
}