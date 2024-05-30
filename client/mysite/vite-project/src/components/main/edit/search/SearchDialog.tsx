import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BookType } from "../../types";
import useSearch from "./useSearch";
import SearchResults from "./SearchResults";

type BookProps = {
  book: BookType;
  setBook: (book: BookType) => void;
  closeDialog: () => void;
};

const SearchDialog: React.FC<BookProps> = ({book, setBook, closeDialog}) => {

  const { items, value, handleNewBooks, searchBooks } = useSearch();

  return (

    <DialogContent
      style={{ zIndex: 1000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      className="sm:max-w-[1000px] max-h-[90%] overflow-hidden"
      showClose={false}
    >
      <form onSubmit={searchBooks}>
        <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="add a book"
              className="Search"
              onChange={handleNewBooks}
              value={value}
            />

          <Button
            size="icon"
            className="rounded-md"
            onClick={searchBooks}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      { items.length > 0 && (
        <>
          <div className="flex flex-col space-y-4 max-h-[60vh] overflow-y-scroll">
            <SearchResults
              items={items}
              book={book}
              setBook={setBook}
              closeDialog={closeDialog}
            />
          </div>
        </>
      )}

    </DialogContent>
  );
};
export default SearchDialog;
