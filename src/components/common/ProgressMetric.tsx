import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ProgressMetricProps {
  title: string;
  value: number;
  change: number;
  color?: string;
  unit?: string;
}

const ProgressMetric = ({ 
  title, 
  value, 
  change, 
  color = 'blue', 
  unit = '%' 
}: ProgressMetricProps) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-gray-600 font-medium mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className={`text-3xl font-bold ${getColorClass()}`}>
          {value}{unit}
        </span>
        {change !== 0 && (
          <div className={`ml-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">{Math.abs(change)}% from last assessment</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressMetric;