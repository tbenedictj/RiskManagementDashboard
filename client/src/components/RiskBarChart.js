import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RiskBarChart = ({ risks }) => {
  // Process data for the bar chart - group by risk type and risk level
  const riskData = risks.reduce((acc, risk) => {
    if (!acc[risk.risk_type]) {
      acc[risk.risk_type] = {
        type: risk.risk_type,
        High: 0,
        Medium: 0,
        Low: 0
      };
    }
    acc[risk.risk_type][risk.risk_level]++;
    return acc;
  }, {});

  const data = Object.values(riskData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="High" stackId="a" fill="#ff0000" />
        <Bar dataKey="Medium" stackId="a" fill="#ffa500" />
        <Bar dataKey="Low" stackId="a" fill="#00ff00" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RiskBarChart;
