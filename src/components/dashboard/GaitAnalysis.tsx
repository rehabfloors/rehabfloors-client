const GaitAnalysis = () => {
  const footPressureData = [
    [0.1, 0.2, 0.4, 0.6, 0.3, 0.1],
    [0.2, 0.3, 0.5, 0.7, 0.4, 0.2],
    [0.3, 0.5, 0.7, 0.9, 0.5, 0.3],
    [0.4, 0.6, 0.8, 0.9, 0.6, 0.4],
    [0.3, 0.5, 0.7, 0.8, 0.5, 0.3],
    [0.2, 0.3, 0.5, 0.6, 0.3, 0.2],
    [0.1, 0.2, 0.3, 0.4, 0.2, 0.1]
  ];
  
  const getColorFromValue = (value: number) => {
    // Color scale from light blue to dark blue
    if (value < 0.2) return 'bg-blue-100';
    if (value < 0.4) return 'bg-blue-200';
    if (value < 0.6) return 'bg-blue-300';
    if (value < 0.8) return 'bg-blue-400';
    return 'bg-blue-500';
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Gait Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foot Pressure Map */}
        <div>
          <h3 className="text-gray-600 font-medium mb-3">Foot Pressure Map</h3>
          <div className="border border-gray-200 rounded-lg p-3 bg-blue-50">
            <div className="grid grid-cols-6 gap-1">
              {footPressureData.map((row, rowIndex) => (
                row.map((cell, cellIndex) => (
                  <div 
                    key={`${rowIndex}-${cellIndex}`}
                    className={`h-8 rounded-sm ${getColorFromValue(cell)}`}
                  ></div>
                ))
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">0.10</span>
            <div className="flex-1 mx-2 h-2 bg-gradient-to-r from-blue-100 to-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500">0.90</span>
          </div>
        </div>
        
        {/* Metrics */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-gray-600 font-medium mb-1">Balance Score</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-blue-600">0.75</span>
              <span className="ml-2 text-green-600 text-sm">+5% from last session</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-gray-600 font-medium mb-1">Symmetry Score</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-blue-600">0.80</span>
              <span className="ml-2 text-green-600 text-sm">+7% from last session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaitAnalysis;