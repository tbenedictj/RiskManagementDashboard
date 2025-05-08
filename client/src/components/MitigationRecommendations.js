import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';

const MitigationRecommendations = ({ risks }) => {
  // Ensure risks is an array
  if (!Array.isArray(risks) || risks.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        No risks available for recommendations
      </Typography>
    );
  }

  // Get high priority risks (High risk level or risk score >= 4)
  const highPriorityRisks = risks.filter(risk => 
    (risk.risk_level && risk.risk_level.toLowerCase() === 'high') || 
    (typeof risk.risk_score === 'number' && risk.risk_score >= 4)
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Risk ID</TableCell>
            <TableCell>Risk Description</TableCell>
            <TableCell>Current Mitigation</TableCell>
            <TableCell>Risk Level</TableCell>
            <TableCell>Risk Score</TableCell>
            <TableCell>Recommended Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {highPriorityRisks.map((risk) => (
            <TableRow key={risk.risk_id}>
              <TableCell>{risk.risk_id || 'N/A'}</TableCell>
              <TableCell>{risk.risk_description || 'N/A'}</TableCell>
              <TableCell>{risk.mitigation || 'No mitigation plan specified'}</TableCell>
              <TableCell>{risk.risk_level || 'N/A'}</TableCell>
              <TableCell>{typeof risk.risk_score === 'number' ? risk.risk_score.toFixed(2) : 'N/A'}</TableCell>
              <TableCell>
                {generateRecommendation(risk)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {highPriorityRisks.length === 0 && (
        <Typography variant="body1" sx={{ p: 2 }}>
          No high priority risks requiring immediate attention
        </Typography>
      )}
    </TableContainer>
  );
};

// Helper function to generate recommendations based on risk attributes
const generateRecommendation = (risk) => {
  if (!risk) return 'Unable to generate recommendation';

  const recommendations = [];

  if (risk.risk_level && risk.risk_level.toLowerCase() === 'high') {
    recommendations.push('Immediate attention required');
  }

  if (typeof risk.risk_score === 'number' && risk.risk_score >= 4) {
    recommendations.push('Develop detailed mitigation plan');
  }

  if (!risk.mitigation || risk.mitigation.trim() === '') {
    recommendations.push('Define mitigation strategy');
  }

  switch (risk.risk_type && risk.risk_type.toLowerCase()) {
    case 'strategic':
      recommendations.push('Review business strategy alignment');
      break;
    case 'operational':
      recommendations.push('Evaluate process improvements');
      break;
    case 'financial':
      recommendations.push('Consider financial impact assessment');
      break;
    case 'compliance':
      recommendations.push('Review regulatory requirements');
      break;
    case 'technology':
      recommendations.push('Assess technical controls');
      break;
    default:
      recommendations.push('Categorize risk type for specific recommendations');
  }

  return recommendations.join('. ') + '.';
};

export default MitigationRecommendations;
