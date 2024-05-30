import React from "react";
import SearchResult from "./SearchResult";
import { Separator } from "@/components/ui/separator";
import { BookType, SearchBookType } from "../../types";

type SearchResultsProps = {
  items: SearchBookType[];
  book: BookType;
  setBook: (book: BookType) => void;
  closeDialog: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({items, book, setBook, closeDialog}) => {

  return (
    <div className="mb-16">
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <SearchResult
            key={item.id}
            item={item}
            book={book}
            setBook={setBook}
            closeDialog={closeDialog}
          />
          <Separator className="my-4" />
        </React.Fragment>
      ))}
    </div>
  )
}
export default SearchResults;