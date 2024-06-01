import { DragDropContext, DropResult, Droppable, Draggable } from "react-beautiful-dnd";
import { BookType } from "../types"
// import Book from "../commons/Book";
import Book from "./Book";
import "@/components/main/style.css"
import { useCallback } from "react";

type BooksProps = {
  books: BookType[];
  setBooks: React.Dispatch<React.SetStateAction<BookType[]>>;
}

// const reorder = (books: BookType[], startIndex: number, endIndex: number) => {
//   const remove = books.splice(startIndex, 1);
//   books.splice(endIndex, 0, remove[0]);
// };

const reorder = (books: BookType[], startIndex: number, endIndex: number): BookType[] => {
  const result = Array.from(books);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Books: React.FC<BooksProps> = ({ books, setBooks }) => {

  const handleDragEnd = (result: DropResult) => {
    // if (!setBooks) return;
    // const { destination, source } = result;
    // if (destination && destination.index !== source.index) {
    //   reorder(books, source.index, destination.index);
    //   setBooks(books);
    // }
    if (!result.destination) return;
    const { source, destination } = result;
    if (destination.index !== source.index) {
      const reorderedBooks = reorder(books, source.index, destination.index);
      if (setBooks) {
        setBooks(reorderedBooks);
      }
      // console.log(`Moved from index ${source.index} to ${destination.index}`);
      // reorderedBooks.forEach((book: BookType, index: number) => {
      //   console.log(`Book ID ${book.id} is now at index ${index}`);
      // });
    }
  };

  const updateBook = useCallback((updatedBook: BookType) => {
    setBooks((prevBooks: BookType[]) =>
      prevBooks.map(book =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
  }, [setBooks]);


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          <div
            className="books"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {books.map((book, index) => (
              <Draggable key={book.id} draggableId={String(book.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Book
                      book={book}
                      updateBook={updateBook}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Books