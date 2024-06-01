import EventService from '@/EventService';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BookListType } from '../types';
import BookCards from './BookCards';

const DisplayPage = () => {

  const location = useLocation();
  const bookListType = location.state?.bookListType;
  const [ownerBookLists, setOwnerBookLists] = useState<BookListType[]>([]);
  const [otherBookLists, setOtherBookLists] = useState<BookListType[]>([]);
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.localStorage.getItem('id');
    setLocalStorageId(id);
  }, []);

  const getBookLists = async (id: string | null) => {
    if (bookListType?.id && id) {
      try{
        const response = await EventService.getBookLists(bookListType.id);
        const allBookLists = response.data;

        const ownerBookLists = allBookLists.filter((bookList: BookListType) => bookList.owner.id === localStorageId);
        const otherBookLists = allBookLists.filter((bookList: BookListType) => bookList.owner.id !== localStorageId);

        setOwnerBookLists(ownerBookLists);
        setOtherBookLists(otherBookLists);
      } catch (error) {
        console.error("Error fetching book lists:", error);
      }
    }
  }

  useEffect(() => {
    if (localStorageId) {
      getBookLists(localStorageId);
    }
  }, [localStorageId, bookListType?.id]);

  // useEffect(() => {
  //   getBookLists();
  // }, [bookListType.id]);

  // useEffect(() => {
  //   console.log("bookListType:", bookListType);
  // }, [bookListType]);

  // useEffect(() => {
  //   console.log("ownerBookLists:", ownerBookLists);
  // }, [ownerBookLists]);

  // useEffect(() => {
  //   console.log("otherBookLists:", otherBookLists);
  // }, [otherBookLists]);

  return (
    <>
      <p>
        { bookListType.type }
      </p>
      <BookCards
        bookLists={ownerBookLists}
        bookListType={bookListType}
      />
      <BookCards
        bookLists={otherBookLists}
      />
    </>
  );
};

export default DisplayPage;
