import EventService from '@/EventService';
import { useLocation } from 'react-router-dom';
import Books from "./Books";
import { useEffect, useState } from 'react';
import { BookListType } from '../types';
import { Button } from '@/components/ui/button';
import { FileDown } from "lucide-react";

const MemberPage = () => {

  const location = useLocation();
  const member = location.state?.member;
  const [allBookLists, setAllBookLists] = useState<BookListType[]>([]);

  // const getBookLists = async () => {
  //   if (member.id) {
  //     try{
  //       const response = await EventService.getBookLists(member_id:member.id);
  //       if (response.data && response.data.length > 0) {
  //         setAllBookLists(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching book lists:", error);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   getBookLists();
  // }, [member]);

  // const downloadJsonFile = () => {
  //   const dataStr = JSON.stringify(allBookLists, null, 2);
  //   const blob = new Blob([dataStr], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `${member.username}_book_lists.json`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // useEffect(() => {
  //   console.log("allBookLists:", allBookLists);
  // }, [allBookLists]);

  return (
    <div>
      {/* <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ fontWeight: 'bold', fontSize: '24px', marginRight: '10px' }}>
          「{ bookListType.type }」の推し棚
        </p>
        <Button size="icon" onClick={downloadJsonFile} className="rounded-md">
          <FileDown />
        </Button>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {allBookLists.length > 0 && allBookLists.map((bookList) => (
          <div
            key={bookList.id}
            className={`bookCard ${bookList.owner.id === localStorage.getItem('id') ? 'highlight' : ''}`}
          >
            <Books
              memberName={bookList.owner.username}
              books={bookList.books} />
          </div>
        ))}
      </div> */}
      Hello
    </div>
  );
};

export default MemberPage;
