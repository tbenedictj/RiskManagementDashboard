import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RiskLineChart = ({ risks }) => {
  // Ensure risks is an array
  if (!Array.isArray(risks)) {
    return <div>No data available</div>;
  }

  // Group risks by date and calculate average risk scores for each risk type
  const risksByDate = risks.reduce((acc, risk) => {
    if (!risk.date) return acc; // Skip if date is missing
    
    const date = new Date(risk.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        Strategic: { total: 0, count: 0 },
        Operational: { total: 0, count: 0 },
        Financial: { total: 0, count: 0 },
        Compliance: { total: 0, count: 0 },
        Technology: { total: 0, count: 0 }
      };
    }
    
    // Only process if risk_type and risk_score exist
    if (risk.risk_type && typeof risk.risk_score === 'number') {
      acc[date][risk.risk_type] = acc[date][risk.risk_type] || { total: 0, count: 0 };
      acc[date][risk.risk_type].total += risk.risk_score;
      acc[date][risk.risk_type].count += 1;
    }
    
    return acc;
  }, {});

  // Convert to array and calculate averages
  const data = Object.entries(risksByDate)
    .map(([date, values]) => {
      const result = { date };
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'date') {
          result[key] = value.count > 0 ? value.total / value.count : 0;
        }
      });
      return result;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const COLORS = {
    Strategic: '#8884d8',
    Operational: '#82ca9d',
    Financial: '#ffc658',
    Compliance: '#ff7300',
    Technology: '#0088fe'
  };

  // Get unique risk types that actually exist in the data
  const existingRiskTypes = [...new Set(risks.map(risk => risk.risk_type))].filter(Boolean);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          formatter={(value) => [value.toFixed(2), "Avg Risk Score"]}
        />
        <Legend />
        {existingRiskTypes.map(type => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            name={`${type} Risks`}
            stroke={COLORS[type] || '#000000'}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RiskLineChart;
