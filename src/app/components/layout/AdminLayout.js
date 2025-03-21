'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Notifications from '../Notifications';
import { 
  AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, 
  CssBaseline, Box, Typography, Avatar, Stack, alpha, useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;
const NAV_WIDTH = 280;

export default function AdminLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);

  const renderHeader = (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        bgcolor: alpha(theme.palette.background.default, 0.8),
        [theme.breakpoints.up('lg')]: {
          height: HEADER_DESKTOP,
          width: `calc(100% - ${NAV_WIDTH}px)`,
          padding: theme.spacing(0, 5),
        },
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>

        <SearchIcon
          sx={{
            color: 'text.disabled',
            width: 20,
            height: 20,
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          <Notifications />
          <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: 'grey.300',
              }} 
            />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );

  const renderDrawer = (
    <Drawer
      open={isDrawerOpen}
      onClose={toggleDrawer}
      variant="permanent"
      PaperProps={{
        sx: {
          width: NAV_WIDTH,
          bgcolor: 'background.default',
          borderRightStyle: 'dashed',
          [theme.breakpoints.up('lg')]: {
            marginTop: '24px',
            height: 'calc(100% - 24px)',
            borderRadius: '16px',
          },
        },
      }}
      sx={{
        width: NAV_WIDTH,
        flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Typography variant="h6" noWrap component="div">
          RTL Admin
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {['Dashboard', 'Symptoms', 'Diseases', 'Cases', 'Users'].map((text) => (
          <ListItem 
            key={text} 
            component={Link} 
            href={`/dashboard${text.toLowerCase() === 'dashboard' ? '' : `/${text.toLowerCase()}`}`}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // Mobile drawer version
  const renderMobileDrawer = (
    <Drawer
      open={isDrawerOpen}
      onClose={toggleDrawer}
      variant="temporary"
      PaperProps={{
        sx: { width: NAV_WIDTH },
      }}
      sx={{
        display: { xs: 'block', lg: 'none' },
      }}
    >
      {/* Same content as desktop drawer */}
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Typography variant="h6" noWrap component="div">
          RTL Admin
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {['Dashboard', 'Symptoms', 'Diseases', 'Cases', 'Users'].map((text) => (
          <ListItem 
            key={text} 
            button 
            component={Link} 
            href={`/dashboard${text.toLowerCase() === 'dashboard' ? '' : `/${text.toLowerCase()}`}`}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <Box sx={{ 
      display: { lg: 'flex' },
      minHeight: '100%',
    }}>
      <CssBaseline />
      
      {renderHeader}
      {renderDrawer}
      {renderMobileDrawer}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          mt: { xs: 10, lg: 20 },
          // py: { xs: 10, lg: 10},
          px: { xs: 2, lg: 5 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
