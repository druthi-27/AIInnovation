import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Box
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function ShieldoutlinedIconDialogue({ fileName, hash, publisher, lastScan }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="View security details">
        <IconButton onClick={() => setOpen(true)} size="large">
          {/* Set color to 'action' for greyed out look */}
          <ShieldOutlinedIcon color="action" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ShieldOutlinedIcon color="action" />
            Security Details
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            File: <b>{fileName}</b>
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>SHA256:</b> <span style={{ wordBreak: "break-all" }}>{hash}</span>
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Publisher:</b> {publisher}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Last Security Scan:</b> {lastScan}
          </Typography>
          <Box mt={2} display="flex" alignItems="center" gap={1}>
            <CheckCircleOutlineIcon color="success" />
            <Typography variant="body2" color="success.main">
              This file is digitally signed and has passed all security checks.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}