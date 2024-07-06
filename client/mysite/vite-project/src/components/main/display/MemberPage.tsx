import EventService from '@/EventService';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookListType } from '../types';
import SearchComponent from './SearchComponent';
import BookList from './BookList';


const MemberPage = () => {

  const location = useLocation();
  const member = location.state?.member;
  const [allBookLists, setAllBookLists] = useState<BookListType[]>([]);
  const [filteredBookLists, setFilteredBookLists] = useState<BookListType[]>([]);
  const [localStorageId, setLocalStorageId] = useState<string | null>(null);
  const getBookLists = async () => {
    if (member.id && localStorageId) {
      try{
        const response = await EventService.getBookLists({
          member_id: member.id,
          reviewer_id: localStorageId,
          mode: "display"
        });
        if (response.data && response.data.length > 0) {
          setAllBookLists(response.data);
          setFilteredBookLists(response.data);
        }
      } catch (error) {
        console.error("Error fetching book lists:", error);
      }
    }
  }

  const handleSearch = (searchTerm1: string, searchTerm2: string) => {
    if (searchTerm1 === '' && searchTerm2 === '') {
      setFilteredBookLists(allBookLists);
    } else {
      const filteredLists = allBookLists.filter((bookList) => {
        const bookTitles = bookList.books.map((book) => book.title);
        return (
          bookTitles.some((title) => title.includes(searchTerm1)) &&
          (searchTerm2 === '' || bookTitles.some((title) => title.includes(searchTerm2)))
        );
      });
      setFilteredBookLists(filteredLists);
    }
  };

  useEffect(() => {
    const id = window.localStorage.getItem("id");
    setLocalStorageId(id);
  }, []);

  useEffect(() => {
    if (localStorageId !== null) {
      getBookLists();
    }
  }, [member, localStorageId]);

  // useEffect(() => {
  //   console.log("allBookLists:", allBookLists);
  // }, [allBookLists]);

  if (localStorageId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '24px', marginRight: '10px' }}>
          「{ member.username }」の推し棚
        </p>
      </div>

      <SearchComponent onSearch={handleSearch} />

      <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {filteredBookLists.length} 件の結果が見つかりました
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {filteredBookLists.length > 0 && filteredBookLists.map((bookList) => (
          <div
            key={bookList.id}
            className={'bookCard'}
          >
            <BookList
              title={bookList.type.type}
              bookList={bookList}
              reviewer_id={localStorageId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberPage;
