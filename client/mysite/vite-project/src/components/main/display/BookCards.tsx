import Books from "./Books";
import { Button } from "@/components/ui/button";
import { BookListType, GenreType } from "../types"
import { useNavigate } from "react-router-dom";
import { Pen } from "lucide-react"
import "@/components/main/style.css"
import { useEffect, useState } from "react";

type BookListsProps = {
  bookLists: BookListType[];
  bookListType?: GenreType;
}

const BookCards: React.FC<BookListsProps> = ({ bookLists, bookListType }) => {

  const navigate = useNavigate();
  const navigateToEditPage = (bookList: BookListType, bookListType: GenreType) => {
    navigate(`/edit/${bookListType.id}`, { state: { bookList, bookListType } });
  }

  const [localStorageId, setLocalStorageId] = useState<string | null>(null);
  useEffect(() => {
    const id = window.localStorage.getItem('id');
    setLocalStorageId(id);
  }, []);

  return (
    <div>
      {bookLists.map(bookList => (

        <div
          key={bookList.id}
          className={`bookCard ${bookList.owner.id === localStorageId ? 'highlight' : ''}`}
        >

          <div  className="flexContainer">
            <p>
              {bookList.owner.username}
            </p>
            {bookList.owner.id === localStorageId && bookListType && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigateToEditPage(bookList, bookListType)}
              >
                <Pen/>
              </Button>
            )}
          </div>

          <Books
            books={bookList.books}
          />
        </div>
      ))}
    </div>
  );
}
export default BookCards