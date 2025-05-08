import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveHeatMap } from '@nivo/heatmap';

const RiskHeatmap = ({ risks }) => {
  // Process risks data for heatmap
  const processData = () => {
    const heatmapData = Array.from({ length: 5 }, (_, i) => ({
      id: `Impact ${5-i}`,
      data: Array.from({ length: 5 }, (_, j) => ({
        x: `Probability ${j+1}`,
        y: 0
      }))
    }));

    risks.forEach(risk => {
      const impactIndex = Math.floor(risk.impact * 5) - 1;
      const probIndex = Math.floor(risk.probability * 5) - 1;
      if (impactIndex >= 0 && probIndex >= 0) {
        heatmapData[4-impactIndex].data[probIndex].y += 1;
      }
    });

    return heatmapData;
  };

  return (
    <Box sx={{ height: 400 }}>
      <ResponsiveHeatMap
        data={processData()}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: 'Probability',
          legendPosition: 'middle',
          legendOffset: 46
        }}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Impact',
          legendPosition: 'middle',
          legendOffset: -72
        }}
        colors={{
          type: 'sequential',
          scheme: 'reds'
        }}
        emptyColor="#eeeeee"
        legends={[
          {
            anchor: 'right',
            translateX: 30,
            translateY: 0,
            length: 400,
            thickness: 8,
            direction: 'column',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            title: 'Risk Count',
            titleAlign: 'start',
            titleOffset: 4
          }
        ]}
        annotations={[
          {
            type: 'rect',
            match: { id: 'Impact 5', x: 'Probability 5' },
            noteTextOffset: { x: 0, y: -10 },
            noteWidth: 100,
            noteHeight: 30,
            noteAlign: 'middle'
          }
        ]}
      />
    </Box>
  );
};

export default RiskHeatmap;
