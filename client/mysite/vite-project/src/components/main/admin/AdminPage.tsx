import EventService from '@/EventService';
import { useLocation } from 'react-router-dom';
import Books from "./Books";
import { useEffect, useState } from 'react';
import { BookListType } from '../types';

const AdminPage = () => {

  const location = useLocation();
  const bookListType = location.state?.bookListType;
  const [allBookLists, setAllBookLists] = useState<BookListType[]>([]);

  const getBookLists = async () => {
    if (bookListType.id) {
      try{
        const response = await EventService.getBookLists(bookListType.id);
        if (response.data && response.data.length > 0) {
          setAllBookLists(response.data);
        }
      } catch (error) {
        console.error("Error fetching book lists:", error);
      }
    }
  }

  useEffect(() => {
    getBookLists();
  }, [bookListType]);


  return (
    <div>
      <p style={{ fontWeight: 'bold', fontSize: '24px' }}>
        「{ bookListType.type }」の推し棚
      </p>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {allBookLists.length > 0 && allBookLists.map((bookList) => (
          <div
            key={bookList.id}
            className={`bookCard ${bookList.owner.id === localStorage.getItem('id') ? 'highlight' : ''}`}
          >
            <Books
              memberName={bookList.owner.username}
              books={bookList.books} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
