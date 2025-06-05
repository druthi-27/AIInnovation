
import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Divider,
  Link,
  Paper,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const drawerWidth = 240;

const sidebarItems = [
  {
    text: "Designer Desktop",
    icon: <DesktopWindowsOutlinedIcon />,
    selected: true,
  },
  {
    text: "Server",
    icon: <StorageOutlinedIcon />,
    selected: false,
  },
  {
    text: "Drivers",
    icon: <SettingsOutlinedIcon />,
    selected: false,
  },
];

export default function App() {
  return (
    <Box sx={{ bgcolor: "#f7fafd", minHeight: "100vh" }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: "#23272f", boxShadow: 0 }}>
        <Toolbar variant="dense">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
              gap: 1,
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Alteryx_logo_2022.svg"
              alt="Analytics Cloud"
              style={{ height: 28, background: "#fff", borderRadius: 4, padding: 2 }}
            />
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
              ANALYTICS CLOUD
            </Typography>
          </Box>
          <Tabs
            value={0}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": { color: "#fff", fontWeight: 500, minWidth: 80 },
              ml: 4,
            }}
          >
            <Tab label="Overview" />
            <Tab label="Library" />
            <Tab label="Data" />
            <Tab label="Schedules" />
            <Tab label="Jobs" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: "flex", pt: 4 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#f7fafd",
              borderRight: "none",
              pt: 8,
            },
          }}
          open
        >
          <List>
            {sidebarItems.map((item) => (
              <ListItem
                button
                key={item.text}
                selected={item.selected}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: item.selected ? "#e6f0fa" : "inherit",
                  "&.Mui-selected": {
                    bgcolor: "#e6f0fa",
                    "&:hover": { bgcolor: "#d0e5fa" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Page Content */}
        <Box sx={{ flex: 1, pl: 6, pr: 6, pt: 2, maxWidth: 900, mx: "auto" }}>
          {/* Back Button */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton size="small" sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Back
            </Typography>
          </Box>

          {/* Page Title */}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            'Payank Button'
          </Typography>

          {/* Main Card */}
          <Paper elevation={0} sx={{ p: 4, mb: 3, display: "flex", alignItems: "flex-start", gap: 3 }}>
            <Box>
              <Box
                sx={{
                  bgcolor: "#e6f0fa",
                  borderRadius: "50%",
                  width: 56,
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <DesktopWindowsOutlinedIcon sx={{ fontSize: 36, color: "#1976d2" }} />
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Designer Desktop
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                Alteryx Designer gives you access to data prep, blending, and analytics tools via a drag-and-drop interface.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                Installation Type
              </Typography>
              <RadioGroup row defaultValue="Non-Admin" sx={{ mb: 1 }}>
                <FormControlLabel value="Non-Admin" control={<Radio />} label="Non-Admin" />
                <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </Box>
          </Paper>

          {/* Accordions */}
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Alteryx Designer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <DescriptionOutlinedIcon sx={{ fontSize: 32, color: "#1976d2" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Alteryx Designer (Non-Admin version) - 2025.1
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Last Updated: April 22, 2025{" "}
                    <Link href="#" underline="hover" sx={{ ml: 1 }}>
                      Release Notes
                    </Link>
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mr: 2 }}>
                  843 MB
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{ minWidth: 120, fontWeight: 600 }}
                >
                  Download
                </Button>
                <IconButton>
                  <ShieldOutlinedIcon />
                </IconButton>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Alteryx Predictive Tools</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Download predictive tools for advanced analytics. (Content placeholder)
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Alteryx Intelligence Suite</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Download intelligence suite tools. (Content placeholder)
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>GenAI Tools</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Download GenAI tools. (Content placeholder)
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Copilot</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Download Copilot tools. (Content placeholder)
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Additional Downloads */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Additional Downloads
            </Typography>
            {/* Add additional download items here as needed */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
