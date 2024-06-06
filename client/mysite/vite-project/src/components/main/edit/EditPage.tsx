import EventService from '@/EventService';
import { useLocation } from 'react-router-dom';
import Books from "./Books";
import { useEffect, useState } from 'react';
import { BookListType, BookType } from '../types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import AlertDialog from "../../common/AlertDialog";

const EditPage = () => {

  const location = useLocation();
  const bookListType = location.state?.bookListType;
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);

  const [bookList, setBookList] = useState<BookListType>();
  const [books, setBooks] = useState<BookType[]>([]);

  const [isUpdateAlert, setIsUpdateAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

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
      // console.error("bookList is undefined");
      return;
    }

    const newBookList = {
      books: newBooks,
      id: bookList.id,
      is_completed: isCompleted
    };

    try {
      await EventService.putBookList(newBookList);
    } catch (error) {
      console.error("Failed to update book list:", error);
    }
  };

  const clickSaveButton = async () => {
    try {
      await putBookList()
      setAlertTitle("保存完了")
      setAlertDescription("編集内容を保存しました")
      setIsUpdateAlert(true)
    } catch (error) {
      const err = error as Error;
      setAlertTitle("登録エラー");
      setAlertDescription(`エラーが発生しました: ${err.message}`);
      setIsUpdateAlert(true);
    }
  }

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

        <Dialog open={isUpdateAlert} onOpenChange={setIsUpdateAlert}>
          <DialogTrigger asChild>
            <Button
              className="h-12 w-96"
              onClick={clickSaveButton}
            >
              保存
            </Button>
          </DialogTrigger>

          {
            isUpdateAlert &&
            <AlertDialog
              title={alertTitle}
              description={alertDescription}
            />
          }

        </Dialog>

      </div>
    </div>
  );
};

export default EditPage;
