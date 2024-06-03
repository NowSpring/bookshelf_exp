import EventService from '@/EventService';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BookListType, BookType, GenreType } from '../types';
import Books from './Books';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import BookCards from './BookCards';


const DisplayPage = () => {

  const location = useLocation();
  const bookListType = location.state?.bookListType;
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);

  // const [ownerBookLists, setOwnerBookLists] = useState<BookListType[]>([]);
  // const [otherBookLists, setOtherBookLists] = useState<BookListType[]>([]);

  const [bookList, setBookList] = useState<BookListType>();
  const [books, setBooks] = useState<BookType[]>([]);

  useEffect(() => {
    const id = window.localStorage.getItem('id');
    setLocalStorageId(id);
  }, []);

  const getBookLists = async (id: string | null) => {
    if (bookListType?.id && id && localStorageId) {
      try{
        const response = await EventService.getBookLists(bookListType.id, localStorageId);
        // const allBookLists = response.data;

        // const ownerBookLists = allBookLists.filter((bookList: BookListType) => bookList.owner.id === localStorageId);
        // const otherBookLists = allBookLists.filter((bookList: BookListType) => bookList.owner.id !== localStorageId);

        // setOwnerBookLists(ownerBookLists);
        // setOtherBookLists(otherBookLists);

        if (response.data && response.data.length > 0) {
          setBookList(response.data[0]);
        }

      } catch (error) {
        console.error("Error fetching book lists:", error);
      }
    }
  }

  useEffect(() => {
    if (localStorageId) {
      getBookLists(localStorageId);
    }
  }, [localStorageId, bookListType?.id]);

  useEffect(() => {
    if (bookList && bookList.books) {
      setBooks(bookList.books);
    }
  }, [bookList]);

  const navigate = useNavigate();
  const navigateToEditPage = (bookList: BookListType, bookListType: GenreType) => {
    navigate(`/edit/${bookListType.id}`, { state: { bookList, bookListType } });
  }

  // useEffect(() => {
  //   getBookLists();
  // }, [bookListType.id]);

  // useEffect(() => {
  //   console.log("bookListType:", bookListType);
  // }, [bookListType]);

  // useEffect(() => {
  //   console.log("ownerBookLists:", ownerBookLists);
  // }, [ownerBookLists]);

  // useEffect(() => {
  //   console.log("otherBookLists:", otherBookLists);
  // }, [otherBookLists]);

  useEffect(() => {
    console.log("bookList:", bookList);
  }, [bookList]);


  if (!bookList || !bookListType) {
    return <div>Loading...</div>; // bookListまたはbookListTypeがない場合はローディング表示
  }

  return (
    <>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Display : {bookListType.type}
      </h1>

      {/* <BookCards
        bookLists={ownerBookLists}
        bookListType={bookListType}
      /> */}
      {/* <BookCards
        bookLists={otherBookLists}
      /> */}

      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div
          key={bookList.id}
          className={`bookCard ${bookList.owner.id === localStorageId ? 'highlight' : ''}`}
        >
          <Books
            books={books}
          />
        </div>
        <Button
          className="h-12 w-96"
          onClick={() => navigateToEditPage(bookList, bookListType)}
        >
          編集
        </Button>
      </div>

    </>
  );
};

export default DisplayPage;
