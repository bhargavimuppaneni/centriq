import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Pipeline } from '@/components/pipeline';
import type { PipelineStep } from '@/components/pipeline';

export const ClientDataSourceDashboard = () => {
  const handleAddNewClient = () => {
    console.log('Adding new client...');
  };

  const pipelineSteps: PipelineStep[] = [
    { id: 1, label: 'Client & Data Source', isActive: true, isCompleted: false },
    { id: 2, label: 'Campaign Set up', isActive: false, isCompleted: false },
    { id: 3, label: 'Review & Submit', isActive: false, isCompleted: false }
  ];

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar userName="John Doe" />

      {/* Progress Steps */}
      <Pipeline steps={pipelineSteps} />

      {/* Main Content */}
      <div className="flex-1 px-8 pb-12">
        <div className="max-w-full mx-auto px-16">
          <div 
            className="bg-white rounded-xl border border-gray-200 pt-7 pb-12 pl-6 pr-6"
            style={{ 
              boxShadow: '0px 15px 30px 0px #0000001A, 0px 8px 15px 0px #00000015',
              maxWidth: 'calc(100% - 40px)'
            }}
          >
            <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-left">Client & Data Source</h1>
            
            {/* Hero Card */}
            <div 
              className="bg-slate-900 rounded-lg pt-10 pb-13 pl-15 pr-18  text-white flex items-center justify-between"
              style={{ 
                boxShadow: '0px 8px 15px 0px #0000001A, 0px 4px 8px 0px #0000001A' 
              }}
            >
              <div className="flex-1 text-left">
                <h2 className="text-white mb-3 font-bold text-4xl leading-tight tracking-normal" style={{ lineHeight: '38px' }}>Create a New Client.</h2>
                <p className="text-gray-300 font-normal text-base leading-6 tracking-normal">
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