import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricData {
  title: string;
  value: string;
  change: number;
  isPercentage?: boolean;
}

interface CampaignMetricsProps {
  totalSpend: number;
  achievedCTAs: number;
  averageCPA: number;
  ctr: number;
  spendChange: number;
  ctaChange: number;
  cpaChange: number;
  ctrChange: number;
}

export const CampaignMetrics: React.FC<CampaignMetricsProps> = ({
  totalSpend,
  achievedCTAs,
  averageCPA,
  ctr,
  spendChange,
  ctaChange,
  cpaChange,
  ctrChange
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const renderMetricCard = (title: string, value: string, change: number, isPercentage: boolean = false) => {
    const isPositive = change >= 0;
    const changeColor = isPercentage 
      ? (title === "Average CPA" ? (isPositive ? "text-red-600" : "text-green-600") : (isPositive ? "text-green-600" : "text-red-600"))
      : (isPositive ? "text-green-600" : "text-red-600");
    
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`flex items-center gap-1 ${changeColor}`}>
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{formatPercentage(change)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {renderMetricCard("Total Spend", formatCurrency(totalSpend), spendChange)}
      {renderMetricCard("Achieved CTAs", achievedCTAs.toLocaleString(), ctaChange)}
      {renderMetricCard("Average CPA", `$${averageCPA.toFixed(2)}`, cpaChange)}
      {renderMetricCard("CTR", `${ctr}%`, ctrChange)}
    </div>
  );
};