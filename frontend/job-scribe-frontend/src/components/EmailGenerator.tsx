import React, { useState } from 'react';
import { apiClient } from '../services/api';
import type { EmailGenerationResponse, EmailContent } from '../types';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const EmailGenerator: React.FC = () => {
  const [jobUrl, setJobUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailResponse, setEmailResponse] = useState<EmailGenerationResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobUrl.trim()) {
      setError('Please enter a job URL');
      return;
    }

    setIsGenerating(true);
    setError('');
    setEmailResponse(null);

    try {
      const response = await apiClient.generateEmail(jobUrl.trim());
      setEmailResponse(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (email: EmailContent) => {
    const emailText = `Subject: ${email.subject}

${email.greeting}

${email.para1}

${email.para2}

${email.sign_off.replace(/\\n/g, '\n')}`;

    navigator.clipboard.writeText(emailText).then(() => {
      alert('Email copied to clipboard!');
    });
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
            Generate Personalized Email
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
              <TextField
                fullWidth
                label="Job Posting URL"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://example.com/job-posting"
                required
                error={!!jobUrl && !isValidUrl(jobUrl)}
                helperText={!!jobUrl && !isValidUrl(jobUrl) ? 'Please enter a valid URL' : ''}
                disabled={isGenerating}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isGenerating || !jobUrl.trim() || !isValidUrl(jobUrl)}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{ minWidth: 160, py: 1.75 }}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {emailResponse?.message && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {emailResponse.message}
            </Alert>
          )}

          {isGenerating && (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center', mb: 3 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Analyzing job posting and generating personalized email...
              </Typography>
            </Paper>
          )}

          {emailResponse?.email && (
            <Stack spacing={3}>
              {/* Job Details */}
              {emailResponse.structured && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon color="primary" />
                      Job Details
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Position
                          </Typography>
                          <Typography variant="body1">{emailResponse.structured.job_title}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Company
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" />
                            {emailResponse.structured.company_name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Experience Level
                          </Typography>
                          <Typography variant="body1">{emailResponse.structured.experience_level}</Typography>
                        </Box>
                        {emailResponse.structured.location && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              Location
                            </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationOnIcon fontSize="small" />
                              {emailResponse.structured.location}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {emailResponse.matched_skills && emailResponse.matched_skills.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                            Matched Skills
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {emailResponse.matched_skills.map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                color="success"
                                variant="outlined"
                                icon={<CheckCircleIcon />}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Generated Email */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Generated Email
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard(emailResponse.email!)}
                      size="small"
                    >
                      Copy Email
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Subject: {emailResponse.email.subject}
                      </Typography>

                      <Typography paragraph sx={{ mt: 2 }}>
                        {emailResponse.email.greeting}
                      </Typography>

                      <Typography paragraph>
                        {emailResponse.email.para1}
                      </Typography>

                      <Typography paragraph>
                        {emailResponse.email.para2}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 2,
                          whiteSpace: 'pre-line'  // This will preserve newlines
                        }}
                      >
                        {emailResponse.email.sign_off.replace(/\\n/g, '\n')}
                      </Typography>
                    </Box>
                  </Paper>
                </CardContent>
              </Card>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmailGenerator;