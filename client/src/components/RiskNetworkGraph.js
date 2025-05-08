import React from 'react';
import { ResponsiveNetwork } from '@nivo/network';

const RiskNetworkGraph = ({ risks }) => {
  // Process data for network graph
  const nodes = [];
  const links = [];
  
  // Create nodes for each unique risk type
  const riskTypes = [...new Set(risks.map(risk => risk.risk_type))];
  riskTypes.forEach((type, index) => {
    nodes.push({
      id: type,
      height: 2,
      size: risks.filter(r => r.risk_type === type).length * 10,
      color: "rgb(97, 205, 187)",
    });
  });

  // Create nodes for each risk level
  const riskLevels = ['High', 'Medium', 'Low'];
  riskLevels.forEach(level => {
    nodes.push({
      id: level,
      height: 1,
      size: risks.filter(r => r.risk_level === level).length * 10,
      color: level === 'High' ? "#ff0000" : level === 'Medium' ? "#ffa500" : "#00ff00",
    });
  });

  // Create links between risk types and risk levels
  riskTypes.forEach(type => {
    const typeRisks = risks.filter(r => r.risk_type === type);
    riskLevels.forEach(level => {
      const count = typeRisks.filter(r => r.risk_level === level).length;
      if (count > 0) {
        links.push({
          source: type,
          target: level,
          distance: 50,
          width: count,
        });
      }
    });
  });

  const networkData = {
    nodes,
    links,
  };

  return (
    <div style={{ height: 300 }}>
      <ResponsiveNetwork
        data={networkData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={e => e.distance}
        centeringStrength={0.3}
        repulsivity={6}
        nodeSize={n => n.size}
        activeNodeSize={n => 1.5 * n.size}
        nodeColor={n => n.color}
        nodeBorderWidth={1}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]],
        }}
        linkThickness={l => 2 + l.width * 0.5}
        linkBlendMode="multiply"
        motionConfig="gentle"
      />
    </div>
  );
};

export default RiskNetworkGraph;
