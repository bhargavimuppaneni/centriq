import { Button } from '@/components/ui/button';

export const ClientDataSourceDashboard = () => {
  const handleAddNewClient = () => {
    console.log('Adding new client...');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">CentriQ</span>
            </div>
            <nav className="flex items-center gap-8">
              <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-3">Dashboard</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">1</span>
              </div>
            </div>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto relative">
          {/* Connecting lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -translate-y-1/2 z-0"></div>
          
          <div className="flex flex-col items-center gap-2 bg-gray-50 px-4 relative z-10">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
            <span className="text-blue-600 font-medium text-sm">Client & Data Source</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-gray-50 px-4 relative z-10">
            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">2</div>
            <span className="text-gray-500 text-sm">Campaign Set up</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-gray-50 px-4 relative z-10">
            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">3</div>
            <span className="text-gray-500 text-sm">Review & Submit</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto h-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full">
            <h1 className="text-xl font-medium text-gray-700 mb-8">Client & Data Source</h1>
            
            {/* Hero Card */}
            <div className="bg-slate-800 rounded-lg p-10 text-white flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-medium mb-3">Create a New Client.</h2>
                <p className="text-gray-300 leading-relaxed" style={{ fontSize: '16px' }}>
                  Onboard a brand new client to CentriQ and integrate their job feed for the first time.
                </p>
              </div>
              <div className="ml-12">
                <Button 
                  onClick={handleAddNewClient}
                  className="bg-transparent border border-white/40 hover:bg-white/10 text-white px-6 py-2.5 text-sm font-normal rounded-md"
                >
                  Add a New Client
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};