import EventService from "@/EventService";
import Book from "./Book";
import React, { useEffect, useState, useRef } from 'react';
import { BookListType } from '../types';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from "lucide-react";


type BookListProps = {
  title: string;
  bookList: BookListType;
  reviewer_id: string;
}

const BookList: React.FC<BookListProps> = ({ title, bookList, reviewer_id }) => {

  const isInitialMount = useRef(true);
  const [isLike, setIsLike] = useState(bookList.likes);

  const postBookListLike = async(likeStatus: boolean) => {
    const bookListLike = {
      booklist_id: bookList.id,
      reviewer_id: reviewer_id,
      like: likeStatus
    }

    try {
      await EventService.postBookListLike(bookListLike);
    } catch (error) {
      console.error("Failed to like:", error);
    }
  }

  const handleLikeToggle = () => {
    setIsLike(!isLike);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      postBookListLike(isLike);
    }
  }, [isLike]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ fontWeight: 'bold' }}>
          {title}
        </p>
        <Button 
          size="icon" 
          style={{ 
            backgroundColor: isLike ? 'red' : 'gray', 
            color: 'white', 
            margin: '0 10px' 
          }}
          onClick={handleLikeToggle}
        >
          <ThumbsUp />
        </Button>
      </div>

      <div className="books">
        {bookList.books.map((book, index) => (
          <div key={book.id}>
            <Book
              index={index}
              book={book}
            />
          </div>
        ))}
      </div>
    </div>
  )
};

export default BookList;
