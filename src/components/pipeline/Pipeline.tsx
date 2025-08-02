import * as React from "react"

export interface PipelineStep {
  id: number
  label: string
  isActive: boolean
  isCompleted: boolean
}

export interface PipelineProps {
  steps: PipelineStep[]
}

export const Pipeline = React.forwardRef<HTMLDivElement, PipelineProps>(
  ({ steps }, ref) => (
    <div ref={ref} className="bg-gray-100 px-6 py-8">
      <div className="flex items-center justify-between max-w-6xl mx-auto relative">
        {/* Connecting lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -translate-y-1/2 z-0"></div>
        
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-100 px-4 relative z-10">
            {step.isActive ? (
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1751D0', padding: '0.5px' }}>
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center" style={{ padding: '0.5px' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#1751D0' }}>
                    {step.id}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ECECED', padding: '0.5px' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#ECECED', color: '#ADACB0' }}>
                  {step.id}
                </div>
              </div>
            )}
            <span className={step.isActive ? "text-blue-600 font-medium text-sm" : "text-gray-500 text-sm"}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
)

Pipeline.displayName = "Pipeline"