// src/services/notificationService.ts
import {
  Notification,
  notifications as mockNotifications
} from '../data/mockData';

/**
 * Mengambil daftar notifikasi.
 * Di masa depan, ini akan memanggil API backend.
 * @param limit Jumlah maksimum notifikasi yang akan diambil (opsional).
 * @param unreadOnly Hanya mengambil notifikasi yang belum dibaca (opsional, perlu implementasi backend).
 */
export const fetchNotifications = async (limit?: number, unreadOnly?: boolean): Promise<Notification[]> => {
  console.log(`Workspaceing notifications (mock, limit: ${limit}, unreadOnly: ${unreadOnly})...`);
  await new Promise(resolve => setTimeout(resolve, 100));

  let notificationsToReturn = [...mockNotifications];

  if (unreadOnly) {
    notificationsToReturn = notificationsToReturn.filter(n => !n.read);
  }

  if (limit) {
    // Biasanya backend yang akan menangani pengurutan (misalnya, berdasarkan timestamp terbaru)
    // Untuk mock, kita asumsikan mockNotifications sudah terurut atau kita ambil dari awal.
    notificationsToReturn = notificationsToReturn.slice(0, limit);
  }

  return notificationsToReturn;
};

/**
 * Menandai notifikasi sebagai sudah dibaca.
 * @param notificationId ID Notifikasi
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  console.log(`Marking notification ${notificationId} as read (mock)...`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
  if (notificationIndex > -1) {
    // Ini memodifikasi array mock secara langsung. Dalam aplikasi nyata, Anda tidak akan melakukan ini.
    // Sebaliknya, Anda akan mengirim permintaan ke backend dan backend yang akan memperbarui status.
    // Untuk tujuan frontend dev, ini bisa diterima.
    mockNotifications[notificationIndex].read = true;
    return true;
  }
  return false;
};

/**
 * Menandai semua notifikasi sebagai sudah dibaca untuk pengguna tertentu (jika ada logika pengguna).
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
    console.log(`Marking all notifications as read (mock)...`);
    await new Promise(resolve => setTimeout(resolve, 100));
    mockNotifications.forEach(n => n.read = true);
    return true;
}

// Anda bisa menambahkan fungsi lain seperti deleteNotification, dll.