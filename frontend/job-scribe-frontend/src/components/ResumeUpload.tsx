import React, { useState, useRef } from 'react';
import { apiClient } from '../services/api';
import type { ResumeUploadResponse } from '../types';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface ResumeUploadProps {
  onUploadSuccess?: (response: ResumeUploadResponse) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const response = await apiClient.uploadResume(file);
      setUploadStatus('success');
      onUploadSuccess?.(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(droppedFile);
      setError('');
      setUploadStatus('idle');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setError('');
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: 500 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
          Upload Resume
        </Typography>
        
        {!file ? (
          <Paper
            elevation={0}
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'action.hover',
              },
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Drop your PDF resume here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or{' '}
              <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
                browse files
              </Typography>
            </Typography>
            <Chip label="PDF up to 10MB" size="small" variant="outlined" />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </Paper>
        ) : (
          <Box>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'grey.50',
              }}
            >
              <PictureAsPdfIcon sx={{ color: 'error.main', mr: 2, fontSize: 32 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
              <IconButton onClick={resetUpload} size="small">
                <CloseIcon />
              </IconButton>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={isUploading}
              startIcon={isUploading ? null : <CloudUploadIcon />}
              sx={{ py: 1.5 }}
            >
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </Button>

            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
              </Box>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {uploadStatus === 'success' && (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{ mt: 2 }}
          >
            Resume uploaded successfully! Your profile has been updated.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;