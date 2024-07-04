import { BookType } from "../types"
import Book from "./Book";
import { useState } from 'react';
import "@/components/main/style.css"
import { Button } from '@/components/ui/button';
import { ThumbsUp } from "lucide-react";

type BooksProps = {
  title: string;
  books: BookType[];
  isLike?: boolean;
}

const Books: React.FC<BooksProps> = ({ title, books, isLike = false }) => {
  const [liked, setLiked] = useState(isLike);

  const handleLikeToggle = () => {
    setLiked(!liked);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ fontWeight: 'bold' }}>
          {title}
        </p>
        <Button 
          size="icon" 
          style={{ 
            backgroundColor: liked ? 'red' : 'gray', 
            color: 'white', 
            margin: '0 10px' 
          }}
          onClick={handleLikeToggle}
        >
          <ThumbsUp />
        </Button>
      </div>
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

export default Books;