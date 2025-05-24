// src/services/iotService.ts
export interface SensorState {
  id: number; // ID unik untuk setiap sensor (0-19)
  isActive: boolean; // true jika disentuh/aktif, false jika tidak
  // pressure?: number; // Opsional: jika TTP223 dikonfigurasi untuk memberikan pembacaan variabel atau jika backend memprosesnya demikian
}

export interface BoardLayout {
  rows: number;
  cols: number;
  // Bisa juga menyertakan pemetaan sensorId ke posisi jika bukan grid sederhana
}

// Definisikan layout default untuk papan 20 sensor Anda (misalnya, 4x5 atau 5x4)
export const DEFAULT_BOARD_LAYOUT: BoardLayout = { rows: 4, cols: 5 }; // Sesuaikan jika perlu

/**
 * Mengambil status sensor saat ini dari semua sensor di papan.
 * Di masa depan, ini akan melakukan panggilan API ke backend.
 */
export const fetchSensorData = async (): Promise<SensorState[]> => {
  console.log("Fetching sensor data (mock)...");
  // Simulasi penundaan API
  await new Promise(resolve => setTimeout(resolve, 50)); // Penundaan lebih singkat untuk data sensor

  // Data mock untuk 20 sensor
  return Array.from({ length: DEFAULT_BOARD_LAYOUT.rows * DEFAULT_BOARD_LAYOUT.cols }, (_, i) => ({
    id: i,
    isActive: Math.random() > 0.85, // Lebih sedikit sensor aktif untuk simulasi yang lebih realistis
  }));
};

/**
 * Berlangganan pembaruan data sensor secara real-time (misalnya, melalui WebSockets).
 * Callback akan dipanggil dengan data sensor baru.
 * Mengembalikan fungsi untuk berhenti berlangganan.
 */
export const subscribeToSensorUpdates = (
  callback: (data: SensorState[]) => void
): (() => void) => {
  console.log("Subscribing to sensor updates (mock)...");
  // Mensimulasikan penerimaan data setiap 1 detik untuk data sensor yang lebih cepat
  const intervalId = setInterval(async () => {
    const newData = await fetchSensorData(); // Menggunakan fetchSensorData untuk pembaruan mock
    callback(newData);
  }, 1000); // Interval lebih cepat untuk data sensor

  // Mengembalikan fungsi untuk berhenti berlangganan
  return () => {
    console.log("Unsubscribing from sensor updates.");
    clearInterval(intervalId);
  };
};

// Anda bisa menambahkan fungsi lain di sini jika diperlukan, misalnya:
// export const calibrateSensors = async (): Promise<boolean> => { ... }
// export const getSensorConfig = async (): Promise<BoardLayout> => { ... }