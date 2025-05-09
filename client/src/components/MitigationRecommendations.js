import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box
} from '@mui/material';

const MitigationRecommendations = ({ risks }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Ensure risks is an array
  if (!Array.isArray(risks) || risks.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        No risks available for recommendations
      </Typography>
    );
  }

  // Sort risks by risk score (highest to lowest)
  const sortedRisks = [...risks].sort((a, b) => {
    const scoreA = typeof a.risk_score === 'number' ? a.risk_score : -1;
    const scoreB = typeof b.risk_score === 'number' ? b.risk_score : -1;
    return scoreB - scoreA;
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the risks to display on current page
  const displayedRisks = sortedRisks
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Function to get cell background color based on risk level
  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return '#ffebee'; // Light red
      case 'medium':
        return '#fff3e0'; // Light orange
      case 'low':
        return '#e8f5e9'; // Light green
      default:
        return 'transparent';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
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
            {displayedRisks.map((risk) => (
              <TableRow 
                key={risk.risk_id}
                sx={{ 
                  '& > td': { 
                    backgroundColor: getRiskLevelColor(risk.risk_level)
                  }
                }}
              >
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
            {displayedRisks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ p: 2 }}>
                    No risks available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedRisks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

// Helper function to generate recommendations based on risk attributes
const generateRecommendation = (risk) => {
  if (!risk) return 'Unable to generate recommendation';

  const recommendations = [];

  // Add recommendations based on risk level
  if (risk.risk_level) {
    switch (risk.risk_level.toLowerCase()) {
      case 'high':
        recommendations.push('Immediate attention required');
        break;
      case 'medium':
        recommendations.push('Monitor closely and implement controls');
        break;
      case 'low':
        recommendations.push('Regular monitoring advised');
        break;
    }
  }

  // Add recommendations based on risk score
  if (typeof risk.risk_score === 'number') {
    if (risk.risk_score >= 20) {
      recommendations.push('Escalate to senior management for immediate action');
    } else if (risk.risk_score >= 15) {
      recommendations.push('Prioritize mitigation efforts and allocate resources');
    } else if (risk.risk_score >= 8) {
      recommendations.push('Develop mitigation plan');
    }
  }

  if (!risk.mitigation || risk.mitigation.trim() === '') {
    recommendations.push('Define mitigation strategy');
  }

  switch (risk.risk_type && risk.risk_type.toLowerCase()) {
    case 'infrastruktur ti':
      recommendations.push('Review IT infrastructure components and implement redundancy measures');
      break;
    case 'data security':
      recommendations.push('Enhance data protection measures and access controls');
      break;
    case 'end user security':
      recommendations.push('Strengthen user authentication and security awareness training');
      break;
    case 'software/apps':
      recommendations.push('Implement application security testing and updates');
      break;
    case 'data protection':
      recommendations.push('Review data backup procedures and disaster recovery plans');
      break;
    default:
      recommendations.push('Evaluate specific risk category and implement appropriate controls');
  }

  return recommendations.join('. ') + '.';
};

export default MitigationRecommendations;
