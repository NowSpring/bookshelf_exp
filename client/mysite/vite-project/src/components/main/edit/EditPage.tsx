import EventService from '@/EventService';
import { useLocation } from 'react-router-dom';
import Books from "./Books";
import { useEffect, useState } from 'react';
import { BookListType, BookType } from '../types';


const EditPage = () => {

  const location = useLocation();
  const bookListType = location.state?.bookListType;
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);

  const [bookList, setBookList] = useState<BookListType>();
  const [books, setBooks] = useState<BookType[]>([]);

  const getBookLists = async (id: string | null) => {
    if (bookListType?.id && id && localStorageId) {
      try{
        const response = await EventService.getBookLists(bookListType.id, localStorageId);
        if (response.data && response.data.length > 0) {
          setBookList(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching book lists:", error);
      }
    }
  }

  const putBookList = async () => {
    const newBooks = books.map((book: BookType, index: number) => ({
      id: book.id,
      booklist: book.booklist,
      title: book.title,
      description: book.description,
      image: book.image,
      order: index,
    }));

    const isCompleted = newBooks.every(book => book.title !== "未登録");

    if (!bookList) {
      console.error("bookList is undefined");
      return;
    }

    const newBookList = {
      books: newBooks,
      id: bookList.id,
      is_completed: isCompleted
    };

    console.log("newBookList:", newBookList)

    try {
      await EventService.putBookList(newBookList);
    } catch (error) {
      console.error("Failed to update book list:", error);
    }
  };

  useEffect(() => {
    const id = window.localStorage.getItem('id');
    setLocalStorageId(id);
  }, []);

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

  useEffect(() => {
    putBookList();
  }, [location]);

  return (
    <div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {bookList && (
          <div
            key={bookList.id}
            className={`bookCard ${bookList.owner.id === localStorageId ? 'highlight' : ''}`}
          >
            <Books
              books={books}
              setBooks={setBooks}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default EditPage;
