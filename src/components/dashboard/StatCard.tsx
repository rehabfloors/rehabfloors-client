interface StatCardProps {
  value: number;
  label: string;
  unit?: string;
  icon?: React.ReactNode;
}

const StatCard = ({ value, label, unit = '', icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col items-center justify-center text-center">
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-3xl font-bold text-blue-600">
        {value}{unit}
      </div>
      <div className="text-gray-600 mt-1">{label}</div>
    </div>
  );
};

export default StatCard;