import EventService from '@/EventService';
import { useLocation } from 'react-router-dom';
import Books from "./Books";
import { useEffect, useState } from 'react';
import { BookListType } from '../types';
import { Button } from '@/components/ui/button';
import { FileDown } from "lucide-react";
import SearchComponent from './SearchComponent';

const MemberPage = () => {

  const location = useLocation();
  const member = location.state?.member;
  const [allBookLists, setAllBookLists] = useState<BookListType[]>([]);
  const [filteredBookLists, setFilteredBookLists] = useState<BookListType[]>([]);

  const getBookLists = async () => {
    if (member.id) {
      try{
        const response = await EventService.getBookLists({member_id:member.id});
        if (response.data && response.data.length > 0) {
          setAllBookLists(response.data);
          setFilteredBookLists(response.data);
        }
      } catch (error) {
        console.error("Error fetching book lists:", error);
      }
    }
  }

  useEffect(() => {
    getBookLists();
  }, [member]);

  const downloadJsonFile = () => {
    const dataStr = JSON.stringify(allBookLists, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${member.username}_book_lists.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // useEffect(() => {
  //   console.log("allBookLists:", allBookLists);
  // }, [allBookLists]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '24px', marginRight: '10px' }}>
          「{ member.username }」の推し棚
        </p>
        <Button size="icon" onClick={downloadJsonFile} className="rounded-md">
          <FileDown />
        </Button>
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
            <Books
              title={bookList.type.type}
              books={bookList.books}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberPage;
