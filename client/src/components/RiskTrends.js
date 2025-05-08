import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box } from '@mui/material';

const RiskTrends = ({ risks }) => {
  const processData = () => {
    const sortedRisks = [...risks].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    const trendData = sortedRisks.reduce((acc, risk) => {
      const date = new Date(risk.timestamp).toLocaleDateString();
      const existing = acc.find(item => item.date === date);

      if (existing) {
        existing.count += 1;
        existing[risk.severity.toLowerCase()] = (existing[risk.severity.toLowerCase()] || 0) + 1;
      } else {
        acc.push({
          date,
          count: 1,
          [risk.severity.toLowerCase()]: 1
        });
      }
      return acc;
    }, []);

    return trendData;
  };

  return (
    <Box sx={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processData()}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#ff0000"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="medium"
            stroke="#ffa500"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#00ff00"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RiskTrends;
