import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../supabaseClient';

const RiskManagement = () => {
  const [risks, setRisks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRisk, setCurrentRisk] = useState({
    risk_id: '',
    risk_description: '',
    asset: '',
    date: new Date().toISOString().split('T')[0],
    risk_type: '',
    owner: '',
    mitigation: '',
    probability: '',
    impact_score: '',
    risk_score: '',
    risk_level: ''
  });

  const riskLevels = ['Low', 'Medium', 'High'];
  const riskTypes = ['Strategic', 'Operational', 'Financial', 'Compliance', 'Technology'];

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const { data, error } = await supabase
        .from('risks')
        .select('*')
        .order('risk_id', { ascending: true });
      
      if (error) throw error;
      setRisks(data || []);
    } catch (error) {
      console.error('Error fetching risks:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentRisk({
      risk_id: '',
      risk_description: '',
      asset: '',
      date: new Date().toISOString().split('T')[0],
      risk_type: '',
      owner: '',
      mitigation: '',
      probability: '',
      impact_score: '',
      risk_score: '',
      risk_level: ''
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (risk) => {
    setCurrentRisk({
      ...risk,
      date: new Date(risk.date).toISOString().split('T')[0],
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convert numeric fields to numbers
    if (['probability', 'impact_score', 'risk_score'].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }

    setCurrentRisk(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Automatically calculate risk score if probability and impact_score are set
    if ((name === 'probability' || name === 'impact_score') && currentRisk.probability && currentRisk.impact_score) {
      const probability = Number(name === 'probability' ? value : currentRisk.probability);
      const impactScore = Number(name === 'impact_score' ? value : currentRisk.impact_score);
      const score = probability * impactScore;
      const level = score >= 15 ? 'High' : score >= 8 ? 'Medium' : 'Low';
      
      setCurrentRisk(prev => ({
        ...prev,
        risk_score: score,
        risk_level: level
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const preparedRisk = {
        ...currentRisk,
        probability: Number(currentRisk.probability),
        impact_score: Number(currentRisk.impact_score),
        risk_score: Number(currentRisk.risk_score)
      };

      if (editMode) {
        const { error } = await supabase
          .from('risks')
          .update(preparedRisk)
          .eq('risk_id', preparedRisk.risk_id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('risks')
          .insert([preparedRisk]);
        if (error) throw error;
      }
      
      fetchRisks();
      handleClose();
    } catch (error) {
      console.error('Error saving risk:', error);
      alert('Error saving risk: ' + error.message);
    }
  };

  const handleDelete = async (riskId) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        const { error } = await supabase
          .from('risks')
          .delete()
          .eq('risk_id', riskId);
        
        if (error) throw error;
        fetchRisks();
      } catch (error) {
        console.error('Error deleting risk:', error);
        alert('Error deleting risk: ' + error.message);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Risk List</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Risk
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Risk ID</TableCell>
              <TableCell>Risk Description</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Risk Type</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {risks.map((risk) => (
              <TableRow key={risk.risk_id}>
                <TableCell>{risk.risk_id}</TableCell>
                <TableCell>{risk.risk_description}</TableCell>
                <TableCell>{risk.asset}</TableCell>
                <TableCell>{new Date(risk.date).toLocaleDateString()}</TableCell>
                <TableCell>{risk.risk_type}</TableCell>
                <TableCell>{risk.owner}</TableCell>
                <TableCell>{risk.risk_level}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(risk)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(risk.risk_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <TextField
              name="risk_id"
              label="Risk ID"
              value={currentRisk.risk_id || ''}
              onChange={handleInputChange}
              disabled={editMode}
              required
            />
            <TextField
              name="risk_description"
              label="Risk Description"
              multiline
              rows={2}
              value={currentRisk.risk_description || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="asset"
              label="Asset"
              value={currentRisk.asset || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              value={currentRisk.date || ''}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="risk_type"
              label="Risk Type"
              select
              value={currentRisk.risk_type || ''}
              onChange={handleInputChange}
              required
            >
              {riskTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="owner"
              label="Owner"
              value={currentRisk.owner || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="mitigation"
              label="Mitigation"
              multiline
              rows={2}
              value={currentRisk.mitigation || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="probability"
              label="Probability (1-5)"
              type="number"
              value={currentRisk.probability || ''}
              onChange={handleInputChange}
              inputProps={{ min: 1, max: 5 }}
              required
            />
            <TextField
              name="impact_score"
              label="Impact Score (1-5)"
              type="number"
              value={currentRisk.impact_score || ''}
              onChange={handleInputChange}
              inputProps={{ min: 1, max: 5 }}
              required
            />
            <TextField
              name="risk_score"
              label="Risk Score"
              value={currentRisk.risk_score || ''}
              disabled
            />
            <TextField
              name="risk_level"
              label="Risk Level"
              select
              value={currentRisk.risk_level || ''}
              onChange={handleInputChange}
              required
            >
              {riskLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RiskManagement;
