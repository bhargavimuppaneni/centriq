import React from 'react';

interface BudgetGoalsProps {
  totalBudget?: number;
  currentSpend?: number;
  remainingBudget?: number;
  budgetProgress?: number;
  targetApplications?: number;
  currentApplications?: number;
  applicationsNeeded?: number;
  goalProgress?: number;
}

export const BudgetGoals: React.FC<BudgetGoalsProps> = ({
  totalBudget = 4000,
  currentSpend = 1750,
  remainingBudget = 2250,
  budgetProgress = 43.75,
  targetApplications = 2000,
  currentApplications = 845,
  applicationsNeeded = 1155,
  goalProgress = 42.25,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget & Goals</h3>
      
      {/* Budget Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Total Budget</span>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(totalBudget)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Current Spend</span>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(currentSpend)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Remaining Budget</span>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(remainingBudget)}</span>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Budget Progress</span>
            <span className="text-sm font-medium text-gray-900">{budgetProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${budgetProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Target Applications</span>
          <span className="text-sm font-medium text-gray-900">{targetApplications.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Current Applications</span>
          <span className="text-sm font-medium text-gray-900">{currentApplications.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Applications Needed</span>
          <span className="text-sm font-medium text-gray-900">{applicationsNeeded.toLocaleString()}</span>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Goal Progress</span>
            <span className="text-sm font-medium text-gray-900">{goalProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};