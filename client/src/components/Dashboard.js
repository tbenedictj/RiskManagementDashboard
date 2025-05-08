import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RiskHeatmap from './RiskHeatmap';
import RiskTrends from './RiskTrends';
import RiskTable from './RiskTable';
import MitigationRecommendations from './MitigationRecommendations';
import RiskBarChart from './RiskBarChart';
import RiskPieChart from './RiskPieChart';
import RiskLineChart from './RiskLineChart';
import RiskBubbleChart from './RiskBubbleChart';
import RiskNetworkGraph from './RiskNetworkGraph';
import { supabase } from '../supabaseClient';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const [risks, setRisks] = useState([]);
  const [filteredRisks, setFilteredRisks] = useState([]);
  const [riskLevel, setRiskLevel] = useState('all');
  const [riskType, setRiskType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchRisks();
    // Set up real-time subscription
    const subscription = supabase
      .channel('risks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'risks' }, fetchRisks)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRisks = async () => {
    try {
      const { data, error } = await supabase
        .from('risks')
        .select('*')
        .order('risk_id', { ascending: true });
      
      if (error) throw error;
      setRisks(data || []);
      setFilteredRisks(data || []);
    } catch (error) {
      console.error('Error fetching risks:', error);
    }
  };

  const applyFilters = (data) => {
    let filtered = [...data];

    if (riskLevel !== 'all') {
      filtered = filtered.filter(risk => risk.risk_level === riskLevel);
    }
    if (riskType !== 'all') {
      filtered = filtered.filter(risk => risk.risk_type === riskType);
    }
    if (timeRange !== 'all') {
      const now = new Date();
      const timeFilter = {
        '7days': 7,
        '30days': 30,
        '90days': 90
      }[timeRange];
      
      filtered = filtered.filter(risk => {
        const riskDate = new Date(risk.date);
        const diffTime = Math.ceil((now - riskDate) / (1000 * 60 * 60 * 24));
        return diffTime <= timeFilter;
      });
    }

    setFilteredRisks(filtered);
  };

  useEffect(() => {
    applyFilters(risks);
  }, [riskLevel, riskType, timeRange, risks]);

  // Get unique risk types from the data
  const riskTypes = ['all', ...new Set(risks.map(risk => risk.risk_type))];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        4Horse-Man Risk Management Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Risk Level</InputLabel>
            <Select
              value={riskLevel}
              label="Risk Level"
              onChange={(e) => setRiskLevel(e.target.value)}
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Risk Type</InputLabel>
            <Select
              value={riskType}
              label="Risk Type"
              onChange={(e) => setRiskType(e.target.value)}
            >
              {riskTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Risk Distribution by Type
            </Typography>
            <RiskBarChart risks={filteredRisks} />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Risk Type Distribution
            </Typography>
            <RiskPieChart risks={filteredRisks} />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Risk Score Trends
            </Typography>
            <RiskLineChart risks={filteredRisks} />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Risk Matrix
            </Typography>
            <RiskBubbleChart risks={filteredRisks} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Risk Network Analysis
            </Typography>
            <RiskNetworkGraph risks={filteredRisks} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Risk Details
            </Typography>
            <RiskTable risks={filteredRisks} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Mitigation Recommendations
            </Typography>
            <MitigationRecommendations risks={filteredRisks} />
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
