import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

const RiskTable = ({ risks }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="risk table">
        <TableHead>
          <TableRow>
            <TableCell>Risk ID</TableCell>
            <TableCell>Risk Description</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Risk Type</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Mitigation</TableCell>
            <TableCell>Probability</TableCell>
            <TableCell>Impact Score</TableCell>
            <TableCell>Risk Score</TableCell>
            <TableCell>Risk Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {risks.map((risk) => (
            <TableRow
              key={risk.risk_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{risk.risk_id}</TableCell>
              <TableCell>{risk.risk_description}</TableCell>
              <TableCell>{risk.asset}</TableCell>
              <TableCell>{formatDate(risk.date)}</TableCell>
              <TableCell>{risk.risk_type}</TableCell>
              <TableCell>{risk.owner}</TableCell>
              <TableCell>{risk.mitigation}</TableCell>
              <TableCell>{risk.probability}</TableCell>
              <TableCell>{risk.impact_score}</TableCell>
              <TableCell>{risk.risk_score}</TableCell>
              <TableCell>
                <Chip
                  label={risk.risk_level}
                  color={getSeverityColor(risk.risk_level)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RiskTable;
