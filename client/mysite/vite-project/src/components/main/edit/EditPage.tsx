import EventService from '@/EventService';
import { useLocation, useNavigate } from 'react-router-dom';
import Books from "./Books";
import { useEffect, useState } from 'react';
import { BookType } from '../types';
import { Button } from "@/components/ui/button";


const EditPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const bookList = location.state?.bookList;
  const bookListType = location.state?.bookListType;
  const [books, setBooks] = useState<BookType[]>(bookList.books);
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.localStorage.getItem('id');
    setLocalStorageId(id);
  }, []);

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

    const newBookList = {
      books: newBooks,
      id: bookList.id,
      is_completed: isCompleted
    };

    try {
      await EventService.putBookList(newBookList);

      // navigate(-1); // 前の画面に戻る
      navigate(`/display/${bookListType.id}`, { state: { bookListType } });
    } catch (error) {
      console.error("Failed to update book list:", error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Edit : {bookListType.type}
      </h1>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div
          key={bookList.id}
          className={`bookCard ${bookList.owner.id === localStorageId ? 'highlight' : ''}`}
        >
          <Books
            books={books}
            setBooks={setBooks}
          />
        </div>
        <Button className="h-12 w-96" onClick={putBookList}>
          保存
        </Button>
      </div>

    </div>
  );
};

export default EditPage;
