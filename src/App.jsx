import React, { useState } from "react";
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
  IconButton,
  Link,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadProgress from "./Components/DownloadProgress";
import ShieldoutlinedIconDialogue from "./Components/ShieldoutlinedIconDialogue";

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
  const [installType, setInstallType] = useState("Non-Admin");

  return (
    <Box sx={{ bgcolor: "#f7fafd", minHeight: "100vh" }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#23272f", boxShadow: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
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
              src="data:image/jpeg;base64,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"
              alt="Analytics Cloud"
              style={{ height: 28,  padding: 2 }}
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
      {/* Spacer for fixed AppBar */}
      <Toolbar variant="dense" />

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
              pt: 0,
            },
          }}
          open
        >
          <Toolbar variant="dense" />
          {/* Back Button and Payank Button Title at Top of Sidebar */}
          <Box sx={{ px: 2, pt: 2, pb: 1, bgcolor: "#f7fafd", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <Link
              href="#"
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
                mb: 1
              }}
              aria-label="Go back"
            >
              <ArrowBackIcon sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Back
              </Typography>
            </Link>
          </Box>
          {/* Navigation List in White Container */}
          <Box sx={{ bgcolor: "#fff", borderRadius: 2, mx: 2, boxShadow: 1 }}>
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
          </Box>
          {/* Bottom area with #e6f0fa background */}
          <Box sx={{ flex: 1, bgcolor: "#f7fafd", mt: 2, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} />
        </Drawer>

        {/* Page Content */}
        <Box sx={{ flex: 1, pl: 6, pr: 6, pt: 2, maxWidth: 900, mx: "auto" }}>

          {/* Main Card */}
          <Paper elevation={0} sx={{ p: 4, mb: 3, display: "flex", alignItems: "flex-start", gap: 3, bgcolor: "#f7fafd" }}>
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
              <RadioGroup
                row
                value={installType}
                onChange={e => setInstallType(e.target.value)}
                sx={{ mb: 1 }}
              >
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
                    {`Alteryx Designer (${installType} version) - 2025.1`}
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
                <DownloadProgress installType={installType} />
                <ShieldoutlinedIconDialogue
                fileName="Alteryx Designer 2025.1.exe"
                hash="a1b2c3d4e5f6... (SHA256)"
                publisher="Alteryx, Inc."
                lastScan="April 22, 2025"
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Alteryx Predictive Tools</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <DescriptionOutlinedIcon sx={{ fontSize: 32, color: "#1976d2" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {`Alteryx Predictive Tools (${installType} version) - 2025.1`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Last Updated: April 22, 2025{" "}
                    <Link href="#" underline="hover" sx={{ ml: 1 }}>
                      Release Notes
                    </Link>
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mr: 2 }}>
                  250 MB
                </Typography>
                <DownloadProgress  installType={installType}/>
                <ShieldoutlinedIconDialogue
                fileName="Alteryx Designer 2025.1.exe"
                hash="a1b2c3d4e5f6... (SHA256)"
                publisher="Alteryx, Inc."
                lastScan="April 22, 2025"
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Alteryx Intelligence Suite</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <InfoOutlinedIcon sx={{ fontSize: 32, color: "#1976d2" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {`Alteryx Intelligence Suite (${installType} version) - 2025.1`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Last Updated: April 22, 2025{" "}
                    <Link href="#" underline="hover" sx={{ ml: 1 }}>
                      Release Notes
                    </Link>
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mr: 2 }}>
                  500 MB
                </Typography>
                <DownloadProgress installType={installType}/>
                <ShieldoutlinedIconDialogue
                fileName="Alteryx Designer 2025.1.exe"
                hash="a1b2c3d4e5f6... (SHA256)"
                publisher="Alteryx, Inc."
                lastScan="April 22, 2025"
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>GenAI Tools</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <StorageOutlinedIcon sx={{ fontSize: 32, color: "#1976d2" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {`GenAI Tools (${installType} version) - 2025.1`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Last Updated: April 22, 2025{" "}
                    <Link href="#" underline="hover" sx={{ ml: 1 }}>
                      Release Notes
                    </Link>
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mr: 2 }}>
                  120 MB
                </Typography>
                <DownloadProgress installType={installType} />
                <ShieldoutlinedIconDialogue
                fileName="Alteryx Designer 2025.1.exe"
                hash="a1b2c3d4e5f6... (SHA256)"
                publisher="Alteryx, Inc."
                lastScan="April 22, 2025"
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Copilot</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <SettingsOutlinedIcon sx={{ fontSize: 32, color: "#1976d2" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {`Copilot (${installType} version) - 2025.1`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Last Updated: April 22, 2025{" "}
                    <Link href="#" underline="hover" sx={{ ml: 1 }}>
                      Release Notes
                    </Link>
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mr: 2 }}>
                  80 MB
                </Typography>
                <DownloadProgress  installType={installType}/>
                <ShieldoutlinedIconDialogue
                fileName="Alteryx Designer 2025.1.exe"
                hash="a1b2c3d4e5f6... (SHA256)"
                publisher="Alteryx, Inc."
                lastScan="April 22, 2025"
                />
              </Box>
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