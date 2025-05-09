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

  // Custom legend with horizontal layout
  const CustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        padding: '10px',
        gap: '15px', // Add space between items
      }}>
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.color,
                marginRight: '8px',
                borderRadius: '50%'
              }}
            />
            <span style={{ fontSize: '0.9rem' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '500px' }}> {/* Increased height for better spacing */}
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 20,
            right: 30,
            bottom: 80, // Increased bottom margin for legend
            left: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Probability"
            domain={[0, 5]}
            label={{
              value: 'Probability',
              position: 'bottom',
              offset: 5
            }}
            ticks={[0, 1, 2, 3, 4, 5]}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Impact"
            domain={[0, 5]}
            label={{
              value: 'Impact',
              angle: -90,
              position: 'left',
              offset: 5
            }}
            ticks={[0, 1, 2, 3, 4, 5]}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div style={{
                    backgroundColor: 'white',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <p style={{ margin: '4px 0' }}><strong>Risk ID:</strong> {data.name}</p>
                    <p style={{ margin: '4px 0' }}><strong>Description:</strong> {data.description}</p>
                    <p style={{ margin: '4px 0' }}><strong>Type:</strong> {data.type}</p>
                    <p style={{ margin: '4px 0' }}><strong>Probability:</strong> {data.x}</p>
                    <p style={{ margin: '4px 0' }}><strong>Impact:</strong> {data.y}</p>
                    <p style={{ margin: '4px 0' }}><strong>Risk Score:</strong> {data.z}</p>
                    <p style={{ margin: '4px 0' }}><strong>Risk Level:</strong> {data.level}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            content={<CustomizedLegend />}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '20px',
              bottom: 0
            }}
          />
          {Object.entries(risksByType).map(([type, data]) => (
            <Scatter
              key={type}
              name={type}
              data={data}
              fill={COLORS[type] || '#999999'}
              shape="circle"
              legendType="circle"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskBubbleChart;
