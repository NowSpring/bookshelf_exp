import EventService from '@/EventService';
import { useLocation, useNavigate } from 'react-router-dom';
import Books from "./Books";
import { useState } from 'react';
import { BookType } from '../types';
import { Button } from "@/components/ui/button";

const localStorageId = window.localStorage.getItem('id');

const EditPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const bookList = location.state?.bookList;
  const bookListType = location.state?.bookListType;
  const [books, setBooks] = useState<BookType[]>(bookList.books);

  const putBookList = async () => {
    const newBooks = books.map((book: BookType, index: number) => ({
      id: book.id,
      booklist: book.booklist,
      title: book.title,
      description: book.description,
      image: book.image,
      order: index,
    }));

    const newBookList = { books: newBooks };
    console.log("newBookList:", newBookList);

    try {
      await EventService.putBookList(newBookList);
      navigate(-1); // 前の画面に戻る
    } catch (error) {
      console.error("Failed to update book list:", error);
    }
  };

  return (
    <div>
      <p>
        { bookListType.type }
      </p>
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
  );
};

export default EditPage;
