import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RiskBubbleChart = ({ risks }) => {
  // Ensure risks is an array
  if (!Array.isArray(risks)) {
    return <div>No data available</div>;
  }

  // Transform data for bubble chart, filtering out invalid entries
  const risksByType = risks.reduce((acc, risk) => {
    // Skip if required properties are missing or invalid
    if (!risk.risk_type || 
        typeof risk.probability !== 'number' || 
        typeof risk.impact_score !== 'number' || 
        typeof risk.risk_score !== 'number') {
      return acc;
    }

    if (!acc[risk.risk_type]) {
      acc[risk.risk_type] = [];
    }

    acc[risk.risk_type].push({
      x: Number(risk.probability),
      y: Number(risk.impact_score),
      z: Number(risk.risk_score),
      name: risk.risk_id || 'Unknown',
      description: risk.risk_description || 'No description',
      type: risk.risk_type,
      level: risk.risk_level || 'Unknown',
    });
    return acc;
  }, {});

  const COLORS = {
    Strategic: '#8884d8',
    Operational: '#82ca9d',
    Financial: '#ffc658',
    Compliance: '#ff7300',
    Technology: '#0088fe'
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Probability" 
          unit="" 
          domain={[0, 5]}
          label={{ value: 'Probability', position: 'bottom' }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Impact" 
          unit="" 
          domain={[0, 5]}
          label={{ value: 'Impact', angle: -90, position: 'left' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          content={({ payload }) => {
            if (payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '10px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}>
                  <p><strong>Risk ID:</strong> {data.name}</p>
                  <p><strong>Description:</strong> {data.description}</p>
                  <p><strong>Type:</strong> {data.type}</p>
                  <p><strong>Probability:</strong> {data.x}</p>
                  <p><strong>Impact:</strong> {data.y}</p>
                  <p><strong>Risk Score:</strong> {data.z}</p>
                  <p><strong>Risk Level:</strong> {data.level}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        {Object.entries(risksByType).map(([type, data]) => (
          <Scatter
            key={type}
            name={type}
            data={data}
            fill={COLORS[type] || '#999999'}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default RiskBubbleChart;
