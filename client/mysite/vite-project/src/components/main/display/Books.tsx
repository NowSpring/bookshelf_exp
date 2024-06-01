import { BookType } from "../types"
// import Book from "../commons/Book";
import Book from "./Book";
import "@/components/main/style.css"

type BooksProps = {
  books: BookType[];
}

const Books: React.FC<BooksProps> = ({ books }) => {

  return (
    <div className="books">
      {books.map((book) => (
        <div key={book.id}>
          <Book
            book={book}
          />
        </div>
      ))}
    </div>
  );
}

export default Books