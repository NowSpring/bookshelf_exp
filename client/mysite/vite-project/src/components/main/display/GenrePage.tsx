import EventService from '@/EventService';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookListType } from '../types';
import { Button } from '@/components/ui/button';
import { FileDown } from "lucide-react";
import SearchComponent from './SearchComponent';
import BookList from './BookList';

const GenrePage = () => {

  const location = useLocation();
  const bookListType = location.state?.bookListType;
  const [allBookLists, setAllBookLists] = useState<BookListType[]>([]);
  const [myBookList, setMyBookList] = useState<BookListType>();
  const [otherBookLists, setOtherBookLists] = useState<BookListType[]>([]);
  const [filteredBookLists, setFilteredBookLists] = useState<BookListType[]>([]);
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);
  const [isSuperUser, setIsSuperuser] = useState<boolean | null>(null);

  const getBookLists = async() => {
    if (bookListType.id && localStorageId) {
      try{
        const response = await EventService.getBookLists({
          booklisttype_id: bookListType.id,
          reviewer_id: localStorageId,
          mode: "display"
        });
        if (response.data && response.data.length > 0) {
          setAllBookLists(response.data);
          const myList = response.data.find((bookList: BookListType) => bookList.owner.id === localStorageId);
          const otherLists = response.data.filter((bookList: BookListType) => bookList.owner.id !== localStorageId);
          setMyBookList(myList);
          setOtherBookLists(otherLists);
          setFilteredBookLists(otherLists);
        }
      } catch (error) {
        console.error("Error fetching book lists:", error);
      }
    }
  }

  const downloadJsonFile = async () => {
    try {
      const response = await EventService.getBookListAdminView(bookListType.id);
      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookListType.type}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download JSON file:", error);
    }
  };

  const handleSearch = (searchTerm1: string, searchTerm2: string) => {
    if (searchTerm1 === '' && searchTerm2 === '') {
      setFilteredBookLists(otherBookLists);
    } else {
      const filteredLists = otherBookLists.filter((bookList) => {
        const bookTitles = bookList.books.map((book) => book.title);
        return (
          bookTitles.some((title) => title.includes(searchTerm1)) &&
          (searchTerm2 === '' || bookTitles.some((title) => title.includes(searchTerm2)))
        );
      });
      setFilteredBookLists(filteredLists);
    }
  };

  useEffect(() => {
    const id = window.localStorage.getItem("id");
    setLocalStorageId(id);
    const isSuperUserStr = window.localStorage.getItem("is_superuser");
    setIsSuperuser(isSuperUserStr === "true")
  }, []);

  useEffect(() => {
    if (localStorageId !== null) {
      getBookLists();
    }
  }, [bookListType, localStorageId]);

  // useEffect(() => {
  //   console.log("allBookLists:", allBookLists);
  // }, [allBookLists]);

  // useEffect(() => {
  //   console.log("myBookLists:", myBookLists);
  // }, [myBookLists]);

  // useEffect(() => {
  //   console.log("otherBookLists:", otherBookLists);
  // }, [otherBookLists]);

  // useEffect(() => {
  //   console.log("localStorageId:", localStorageId);
  // }, [localStorageId]);

  // useEffect(() => {
  //   console.log("isSuperUser:", isSuperUser);
  // }, [isSuperUser]);

  if (localStorageId === null) {
    return <div>Loading...</div>;
  }

  return (
    
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '24px', marginRight: '10px' }}>
          「{ bookListType.type }」の推し棚
        </p>

        {isSuperUser && (
          <Button size="icon" onClick={downloadJsonFile} className="rounded-md">
            <FileDown />
          </Button>
        )}
      </div>

      <SearchComponent onSearch={handleSearch} />

      <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {filteredBookLists.length} 件の結果が見つかりました
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {filteredBookLists.length > 0 && filteredBookLists.map((bookList, index) => (
          <div
            key={bookList.id}
            className={`bookCard ${bookList.owner.id === localStorageId? 'highlight' : ''}`}
          >
            <BookList
              title={isSuperUser ? bookList.owner.username : `other${String(index + 1).padStart(2, '0')}`}
              bookList={bookList}
              reviewer_id={localStorageId}
            />
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default GenrePage;
