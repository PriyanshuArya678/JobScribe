import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ResumeUpload from './ResumeUpload';
import EmailGenerator from './EmailGenerator';
import type { ResumeUploadResponse } from '../types';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Email as EmailIcon,
  ExitToApp as ExitToAppIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);

  const handleResumeUploadSuccess = (_response: ResumeUploadResponse) => {
    setHasUploadedResume(true);
    // Automatically switch to email generation tab after successful upload
    setTimeout(() => {
      setActiveTab(1);
    }, 2000);
  };

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            JobScribe
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
            Welcome, {user?.full_name || user?.email}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 1 }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              sx={{ px: 2 }}
            >
              <Tab
                icon={<CloudUploadIcon />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Upload Resume
                    {!hasUploadedResume && (
                      <Chip
                        label="Required"
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    )}
                  </Box>
                }
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab
                icon={<EmailIcon />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Generate Email
                    {hasUploadedResume && (
                      <Chip
                        label="Ready"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    )}
                  </Box>
                }
                iconPosition="start"
                disabled={!hasUploadedResume}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Upload Your Resume
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Upload your resume to get started. We'll analyze it and use the information to generate personalized emails for job applications.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ResumeUpload onUploadSuccess={handleResumeUploadSuccess} />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {!hasUploadedResume ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <WarningIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  No resume uploaded
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Please upload your resume first to generate personalized emails.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => setActiveTab(0)}
                  size="large"
                >
                  Upload Resume
                </Button>
              </Box>
            ) : (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Generate Personalized Email
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Enter a job posting URL and we'll generate a personalized email based on your resume and the job requirements.
                  </Typography>
                </Box>
                <EmailGenerator />
              </Box>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;