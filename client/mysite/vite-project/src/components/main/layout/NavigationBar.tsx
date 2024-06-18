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
import { GenreType, MemberType } from '../types';
import { Check, CircleAlert, UserRound} from "lucide-react";
import { Separator } from '@/components/ui/separator';

const drawerWidth = 200;

const NavigationBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [bookListTypes, setBookListTypes] = useState<GenreType[]>([])
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);
  const [localStorageIsSuperuser, setLocalStorageIsSuperuser] = useState<boolean | null>(null);
  const [lastSegment, setLastSegment] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberType[]>([])

  useEffect(() => {
    const id = window.localStorage.getItem('id');
    setLocalStorageId(id);
    const isSuperUser = window.localStorage.getItem('is_superuser') === 'true';
    setLocalStorageIsSuperuser(isSuperUser);
  }, []);

  const getBookListTypes = async(id: string) => {
    try {
      const response = await EventService.getBookListTypes(id);
      setBookListTypes(response.data);
    } catch (error) {
      console.error('Error fetching book list types:', error);
    }
  };

  const getMembers = async() => {
    const response = await EventService.getMembers();
    setMembers(response.data);
  }

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

  useEffect(() => {
    if (location.pathname.includes('admin')) {
      getMembers();
    }
  }, [location]);

  const handleItemClick = (bookListType: GenreType) => {
    if (localStorageIsSuperuser) {
      navigate(`/admin/genre/${bookListType.id}`, { state: { bookListType } });
    } else {
      navigate(`/edit/${bookListType.id}`, { state: { bookListType } });
    }
  };

  const handleMemberClick = (member: MemberType) => {
    navigate(`/admin/member/${member.id}`, { state: { member } });
  }

  // useEffect(() =>{
  //   console.log("bookListTypes:", bookListTypes)
  // }, [bookListTypes])

  // useEffect(() => {
  //   console.log("members:", members);
  // }, [members]);

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
            {location.pathname.includes('admin') &&
              <>
                <Separator />
                {members.map((member) => (
                  <ListItem key={member.id} disablePadding>
                    <ListItemButton onClick={() => handleMemberClick(member)}>
                      <ListItemIcon>
                        <UserRound
                          className="mr-2"
                          style={{ width: '20px', height: '20px', fontWeight: 'bold' }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={member.username}
                        style={{ color: member.id === lastSegment ? 'red' : 'inherit' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            }
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default NavigationBar;
