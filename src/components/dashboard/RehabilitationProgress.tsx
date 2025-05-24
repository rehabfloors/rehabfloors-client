// src/components/dashboard/RehabilitationProgress.tsx
import React from 'react';
import { RehabProgressData } from '../../services/dashboardService'; // Pastikan path ini benar
// import { ArrowUpRight } from 'lucide-react'; // Hanya jika 'change' data akan ditampilkan

interface RehabilitationProgressProps {
  data: RehabProgressData | null;
  isLoading: boolean;
}

const RehabilitationProgress: React.FC<RehabilitationProgressProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm min-h-[200px] flex items-center justify-center">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Rehabilitation Progress</h2>
          <p className="text-gray-500 text-center py-4">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm min-h-[200px] flex items-center justify-center">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Rehabilitation Progress</h2>
          <p className="text-gray-500 text-center py-4">No progress data available.</p>
        </div>
      </div>
    );
  }

  // Data untuk ditampilkan di list (dan bisa digunakan untuk radar chart jika diimplementasikan)
  const metricsToDisplay = [
    { key: 'overall', label: 'Overall', value: data.overall, color: 'bg-blue-600' }, // Warna lebih gelap untuk kontras
    { key: 'symmetry', label: 'Symmetry', value: data.symmetry, color: 'bg-sky-500' },
    { key: 'balance', label: 'Balance', value: data.balance, color: 'bg-green-500' },
    { key: 'speed', label: 'Speed', value: data.speed, color: 'bg-yellow-500' },
    { key: 'endurance', label: 'Endurance', value: data.endurance, color: 'bg-purple-500' },
  ];

  // Implementasi Radar Chart SVG Dinamis (Contoh Sederhana, perlu disesuaikan lebih lanjut)
  // Ini adalah bagian yang kompleks dan mungkin perlu library charting atau SVG kustom yang lebih detail.
  // Untuk MVP, Anda bisa menyederhanakannya atau fokus pada daftar metrik.
  const radarCenterX = 100;
  const radarCenterY = 100;
  const radarMaxRadius = 80;

  const getRadarPoint = (value: number, angleDegrees: number): string => {
    const angleRadians = (angleDegrees - 90) * (Math.PI / 180); // -90 untuk memulai dari atas
    const radius = (value / 100) * radarMaxRadius;
    const x = radarCenterX + radius * Math.cos(angleRadians);
    const y = radarCenterY + radius * Math.sin(angleRadians);
    return `${x},${y}`;
  };

  // Asumsi 5 metrik untuk pentagon (overall, symmetry, speed, endurance, balance)
  const radarDataPoints = [
    data.overall,
    data.symmetry,
    data.speed,
    data.endurance,
    data.balance,
  ];
  const numAxes = radarDataPoints.length;
  const angleSlice = 360 / numAxes;

  const radarPolygonPoints = radarDataPoints
    .map((value, i) => getRadarPoint(value, angleSlice * i))
    .join(' ');

  const radarAxisLabelsData = [
    { label: 'Overall', value: data.overall, angle: 0 },
    { label: 'Symmetry', value: data.symmetry, angle: angleSlice * 1 },
    { label: 'Speed', value: data.speed, angle: angleSlice * 2 },
    { label: 'Endurance', value: data.endurance, angle: angleSlice * 3 },
    { label: 'Balance', value: data.balance, angle: angleSlice * 4 },
  ];


  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Rehabilitation Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Radar Chart Area */}
        <div className="relative h-60 w-full max-w-xs mx-auto md:max-w-none md:mx-0">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Latar Belakang Grid Radar (Contoh untuk 5 level) */}
            {[20, 40, 60, 80, 100].reverse().map(level => (
              <polygon
                key={`grid-${level}`}
                points={Array.from({length: numAxes}).map((_, i) => getRadarPoint(level, angleSlice * i)).join(' ')}
                fill="none"
                stroke={level === 100 ? "#d1d5db" : "#e5e7eb"} // Garis luar lebih tebal
                strokeWidth="1"
              />
            ))}
            {/* Garis Sumbu dari Pusat */}
            {Array.from({length: numAxes}).map((_, i) => (
                 <line
                    key={`axis-line-${i}`}
                    x1={radarCenterX}
                    y1={radarCenterY}
                    x2={parseFloat(getRadarPoint(100, angleSlice * i).split(',')[0])}
                    y2={parseFloat(getRadarPoint(100, angleSlice * i).split(',')[1])}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                 />
            ))}
            {/* Data Polygon */}
            <polygon
              points={radarPolygonPoints}
              fill="rgba(59, 130, 246, 0.3)" // Warna area data (biru transparan)
              stroke="#3b82f6" // Warna garis data (biru) #3b82f6
              strokeWidth="2"
            />
            {/* Titik Data pada Polygon */}
            {radarDataPoints.map((value, i) => {
                const [x,y] = getRadarPoint(value, angleSlice * i).split(',');
                return <circle key={`point-${i}`} cx={x} cy={y} r="3.5" fill="#3b82f6" />;
            })}
            {/* Label Sumbu (Contoh) */}
            {radarAxisLabelsData.map(({label, angle}, i) => {
                const [rawX, rawY] = getRadarPoint(110, angle).split(','); // Posisi label sedikit di luar grid
                let textAnchor = "middle";
                let dy = "0.35em";
                const x = parseFloat(rawX);
                const y = parseFloat(rawY);

                if (x < radarCenterX - 10) textAnchor = "end";
                else if (x > radarCenterX + 10) textAnchor = "start";
                if (y < radarCenterY - 30) dy = "0"; // Adjust for top label
                else if (y > radarCenterY + 30) dy="0.71em" // Adjust for bottom labels


                return (
                    <text key={`label-${i}`} x={x} y={y} dy={dy} textAnchor={textAnchor as any} fontSize="10" fill="#6b7280">{label}</text>
                );
            })}
          </svg>
        </div>

        {/* Daftar Metrik */}
        <div className="space-y-3">
          {metricsToDisplay.map(({ key, label, value, color }) => (
            <div key={key} className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex justify-between items-center mb-1">
                <span className="capitalize text-gray-700 font-medium text-sm">{label}</span>
                {/* Jika ada data 'change', bisa ditambahkan di sini */}
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-800 mr-2">
                  {value}%
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RehabilitationProgress;