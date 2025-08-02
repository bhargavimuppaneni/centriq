import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

export const ClientDataSourceDashboard = () => {
  const handleAddNewClient = () => {
    console.log('Adding new client...');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Progress Steps */}
      <div className="bg-gray-100 px-6 py-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto relative">
          {/* Connecting lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -translate-y-1/2 z-0"></div>
          
          <div className="flex flex-col items-center gap-2 bg-gray-100 px-4 relative z-10">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1751D0', padding: '0.5px' }}>
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center" style={{ padding: '0.5px' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#1751D0' }}>1</div>
              </div>
            </div>
            <span className="text-blue-600 font-medium text-sm">Client & Data Source</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-gray-100 px-4 relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center p-1" style={{ backgroundColor: '#ECECED' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#ECECED', color: '#ADACB0' }}>2</div>
            </div>
            <span className="text-gray-500 text-sm">Campaign Set up</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-gray-100 px-4 relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center p-1" style={{ backgroundColor: '#ECECED' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#ECECED', color: '#ADACB0' }}>3</div>
            </div>
            <span className="text-gray-500 text-sm">Review & Submit</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-left">Client & Data Source</h1>
            
            {/* Hero Card */}
            <div 
              className="bg-slate-900 rounded-lg p-10 text-white flex items-center justify-between"
              style={{ 
                boxShadow: '0px 10px 15px 0px #0000001A, 0px 4px 6px 0px #0000001A' 
              }}
            >
              <div className="flex-1 text-left">
                <h2 className="text-white mb-3 font-bold text-4xl leading-tight tracking-normal">Create a New Client.</h2>
                <p className="text-gray-300 leading-relaxed text-base">
                  Onboard a brand new client to CentriQ and integrate their job feed for the first time.
                </p>
              </div>
              <div className="ml-12">
                <Button 
                  onClick={handleAddNewClient}
                  className="bg-transparent border-2 text-white px-8 py-3 text-sm font-normal hover:bg-white/10"
                  style={{ borderColor: '#FFFFFF', borderRadius: '8px' }}
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