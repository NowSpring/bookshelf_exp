import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import EventService from '@/EventService';
import { GenreType } from '../../types';

const drawerWidth = 200;

const NavigationBar = () => {

  const navigate = useNavigate();
  const [bookListTypes, setBookListTypes] = useState<GenreType[]>([])

  const getBookListTypes = async () => {
    try {
      const response = await EventService.getBookListTypes();
      setBookListTypes(response.data);
    } catch (error) {
      console.error('Error fetching book list types:', error);
    }
  };

  useEffect(() => {
    getBookListTypes();
  }, []);

  const handleItemClick = (bookListType: GenreType) => {
    navigate(`/display/${bookListType.id}`, { state: { bookListType } });
  };

  return (
    <div style={{ zIndex: 1, position: 'relative' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {bookListTypes.map((bookListType) => (
              <ListItem key={bookListType.id} disablePadding>
                <ListItemButton onClick={() => handleItemClick(bookListType)}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={bookListType.type} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default NavigationBar;
