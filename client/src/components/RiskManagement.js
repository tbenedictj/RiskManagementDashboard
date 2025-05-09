import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../supabaseClient';

const RiskManagement = () => {
  const [open, setOpen] = useState(false);
  const [risks, setRisks] = useState([]);
  const [editingRisk, setEditingRisk] = useState(null);
  const [availableRiskTypes, setAvailableRiskTypes] = useState([]);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchRisks();
    fetchRiskTypes();
    // Set up real-time subscription
    const subscription = supabase
      .channel('risks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'risks' }, fetchRisks)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRiskTypes = async () => {
    try {
      // Fetch distinct risk types from the database
      const { data, error } = await supabase
        .from('risks')
        .select('risk_type')
        .not('risk_type', 'is', null);
      
      if (error) throw error;
      
      // Get unique risk types
      const uniqueTypes = [...new Set(data.map(item => item.risk_type))];
      setAvailableRiskTypes(uniqueTypes);
    } catch (error) {
      console.error('Error fetching risk types:', error);
    }
  };

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
    setEditingRisk(null);
    setFormData({
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

  const handleEdit = (risk) => {
    setEditingRisk(risk);
    setFormData({
      risk_id: risk.risk_id,
      risk_description: risk.risk_description,
      asset: risk.asset,
      date: risk.date,
      risk_type: risk.risk_type,
      owner: risk.owner,
      mitigation: risk.mitigation,
      probability: risk.probability,
      impact_score: risk.impact_score,
      risk_score: risk.risk_score,
      risk_level: risk.risk_level
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRisk(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: value
    };

    // Calculate risk score and level when probability or impact changes
    if (name === 'probability' || name === 'impact_score') {
      const probability = name === 'probability' ? Number(value) : Number(formData.probability);
      const impact = name === 'impact_score' ? Number(value) : Number(formData.impact_score);
      
      if (!isNaN(probability) && !isNaN(impact)) {
        const riskScore = probability * impact;
        updatedFormData.risk_score = riskScore;
        
        // Determine risk level based on risk score
        if (riskScore >= 15) {
          updatedFormData.risk_level = 'High';
        } else if (riskScore >= 8) {
          updatedFormData.risk_level = 'Medium';
        } else {
          updatedFormData.risk_level = 'Low';
        }
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingRisk) {
        const { error } = await supabase
          .from('risks')
          .update(formData)
          .eq('risk_id', editingRisk.risk_id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('risks')
          .insert([formData]);
        
        if (error) throw error;
      }

      handleClose();
      fetchRisks();
    } catch (error) {
      console.error('Error saving risk:', error);
    }
  };

  const handleDelete = async (risk) => {
    try {
      const { error } = await supabase
        .from('risks')
        .delete()
        .eq('risk_id', risk.risk_id);
      
      if (error) throw error;
      fetchRisks();
    } catch (error) {
      console.error('Error deleting risk:', error);
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
                  <IconButton onClick={() => handleDelete(risk)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingRisk ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
            <TextField
              name="risk_id"
              label="Risk ID"
              value={formData.risk_id}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="risk_description"
              label="Risk Description"
              value={formData.risk_description}
              onChange={handleInputChange}
              multiline
              rows={3}
              required
            />
            <TextField
              name="asset"
              label="Asset"
              value={formData.asset}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
            <FormControl required>
              <InputLabel>Risk Type</InputLabel>
              <Select
                name="risk_type"
                value={formData.risk_type}
                onChange={handleInputChange}
                label="Risk Type"
              >
                {availableRiskTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="owner"
              label="Owner"
              value={formData.owner}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="mitigation"
              label="Mitigation"
              value={formData.mitigation}
              onChange={handleInputChange}
              multiline
              rows={2}
              required
            />
            <TextField
              name="probability"
              label="Probability (1-5)"
              type="number"
              value={formData.probability}
              onChange={handleInputChange}
              inputProps={{ min: 1, max: 5 }}
              required
            />
            <TextField
              name="impact_score"
              label="Impact Score (1-5)"
              type="number"
              value={formData.impact_score}
              onChange={handleInputChange}
              inputProps={{ min: 1, max: 5 }}
              required
            />
            <TextField
              name="risk_score"
              label="Risk Score"
              value={formData.risk_score}
              InputProps={{ readOnly: true }}
            />
            <TextField
              name="risk_level"
              label="Risk Level"
              value={formData.risk_level}
              InputProps={{ readOnly: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingRisk ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RiskManagement;
