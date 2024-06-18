import { BookType } from "../types"
import Book from "./Book";
import "@/components/main/style.css"

type BooksProps = {
  title: string;
  books: BookType[];
}

const Books: React.FC<BooksProps> = ({ title, books }) => {

  return (
    <div>
      <p style={{ fontWeight: 'bold' }}>
        { title }
      </p>
      <div className="books">
        {books.map((book, index) => (
          <div key={book.id}>
            <Book
              index={index}
              book={book}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books