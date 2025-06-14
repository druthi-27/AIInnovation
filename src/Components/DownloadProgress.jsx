import React, { useState, useRef } from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { Download, Close } from '@mui/icons-material';
import { adminDownloadLink, nonAdminDownloadLink } from '../Constants/Const';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DownloadProgress = ({ installType }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [eta, setEta] = useState(0);
  const intervalRef = useRef(null);

  const handleDownload = (e) => {
    if (downloading) {
      e.preventDefault();
      return;
    }
    setDownloading(true);
    setProgress(0);
    setSpeed(0);
    setEta(0);
    let downloaded = 0;
    const total = 50 * 1024 * 1024;
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const chunk = Math.floor(Math.random() * 500000) + 500000;
      downloaded += chunk;
      if (downloaded > total) downloaded = total;

      const elapsed = (Date.now() - startTime) / 1000;
      const currentSpeed = downloaded / elapsed;
      const percent = Math.round((downloaded / total) * 100);
      const remaining = total - downloaded;
      const estimatedTime = currentSpeed > 0 ? Math.round(remaining / currentSpeed) : 0;

      setProgress(percent);
      setSpeed(currentSpeed);
      setEta(estimatedTime);

      if (downloaded >= total) {
        clearInterval(intervalRef.current);
        setTimeout(() => setDownloading(false), 1000);
      }
    }, 500);
  };

  const handleCancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDownloading(false);
    setProgress(0);
    setSpeed(0);
    setEta(0);
  };

  const downloadLink =
    installType === "Non-Admin"
      ? nonAdminDownloadLink
      : installType === "Admin"
      ? adminDownloadLink
      : null;

  return (
    <Box>
      {/* Center the button horizontally */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            py: 1,
            px: 2,
            minWidth: 140,
            border: 'none',
            boxShadow: 'none',
            textTransform: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
          size="medium"
          onClick={handleDownload}
          disabled={downloading || !downloadLink}
          component={downloadLink ? "a" : "button"}
          href={downloadLink && !downloading ? downloadLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {downloading ? 'Downloading...' : 'Download'}
        </Button>
      </Box>
      {downloading && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">{progress}%</Typography>
            <Typography variant="body2">
              Speed: {formatBytes(speed)}/s
            </Typography>
            <Typography variant="body2">
              ETA: {eta}s
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="text"
              color="error"
              startIcon={<Close />}
              onClick={handleCancel}
              size="small"
              sx={{ fontWeight: 500 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DownloadProgress;

// this is download page 