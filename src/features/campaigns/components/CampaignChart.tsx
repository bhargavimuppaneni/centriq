import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChartDataPoint {
  date: string;
  dailyCTAs: number;
  dailySpend: number;
}

interface CampaignChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  showDateRangeSelector?: boolean;
  dateRangeOptions?: string[];
  onDateRangeChange?: (range: string) => void;
  ctaColor?: string;
  spendColor?: string;
  ctaDomain?: [number, number];
  spendDomain?: [number, number];
}

export const CampaignChart: React.FC<CampaignChartProps> = ({
  data,
  title = "Daily CTAs & Spend Trend",
  height = 320,
  showDateRangeSelector = true,
  dateRangeOptions = ["Last 7 days", "Last 30 days", "Last 90 days"],
  onDateRangeChange,
  ctaColor = "#3b82f6",
  spendColor = "#6b7280",
  ctaDomain,
  spendDomain
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState(dateRangeOptions[1] || "Last 30 days");

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    onDateRangeChange?.(range);
  };

  // Auto-calculate domains if not provided
  const calculatedCtaDomain = ctaDomain || [
    Math.min(...data.map(d => d.dailyCTAs)) - 5,
    Math.max(...data.map(d => d.dailyCTAs)) + 5
  ];

  const calculatedSpendDomain = spendDomain || [
    Math.min(...data.map(d => d.dailySpend)) - 20,
    Math.max(...data.map(d => d.dailySpend)) + 20
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showDateRangeSelector && (
          <select 
            value={selectedDateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateRangeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={calculatedCtaDomain}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={calculatedSpendDomain}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
              labelStyle={{ 
                color: '#374151',
                fontWeight: '600',
                marginBottom: '4px'
              }}
              formatter={(value, name) => {
                if (name === 'Daily CTAs') {
                  return [value, 'Daily CTAs'];
                } else if (name === 'Daily Spend') {
                  return [`$${value}`, 'Daily Spend'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="dailyCTAs"
              stroke={ctaColor}
              strokeWidth={2}
              dot={{ fill: ctaColor, strokeWidth: 2, r: 4 }}
              name="Daily CTAs"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="dailySpend"
              stroke={spendColor}
              strokeWidth={2}
              dot={{ fill: spendColor, strokeWidth: 2, r: 4 }}
              name="Daily Spend"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};