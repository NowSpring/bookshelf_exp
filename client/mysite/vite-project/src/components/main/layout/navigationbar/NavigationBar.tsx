import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventService from '@/EventService';
import { GenreType } from '../../types';
import { Check, CircleAlert } from "lucide-react";

const drawerWidth = 200;

const NavigationBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [bookListTypes, setBookListTypes] = useState<GenreType[]>([])
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);
  const [lastSegment, setLastSegment] = useState<string | null>(null);

  useEffect(() => {
    const id = window.localStorage.getItem('id');
    setLocalStorageId(id);
  }, []);

  const getBookListTypes = async(id: string) => {
    try {
      const response = await EventService.getBookListTypes(id);
      setBookListTypes(response.data);
    } catch (error) {
      console.error('Error fetching book list types:', error);
    }
  };

  useEffect(() => {
    const fetchBookListTypes = async () => {
      if (localStorageId) {
        await getBookListTypes(localStorageId);
      }
    };

    fetchBookListTypes();
  }, [location.pathname, localStorageId]);

  useEffect(() => {
    const urlSegments = location.pathname.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    setLastSegment(lastSegment);
  }, [location]);

  const handleItemClick = (bookListType: GenreType) => {
    navigate(`/display/${bookListType.id}`, { state: { bookListType } });
  };

  // useEffect(() =>{
  //   console.log("bookListTypes:", bookListTypes)
  // }, [bookListTypes])

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
                    {bookListType.booklist.is_completed ? (
                      <Check
                        className="mr-2"
                        style={{ width: '20px', height: '20px', fontWeight: 'bold', color: 'green' }}
                      />
                    ) : (
                      <CircleAlert
                        className="mr-2"
                        style={{ width: '20px', height: '20px', fontWeight: 'bold', color: 'red' }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={bookListType.type}
                    style={{ color: bookListType.id === lastSegment ? 'red' : 'inherit' }}
                  />
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
