import { useState, ChangeEvent, MouseEvent, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SearchBookType } from '../../types';

type RawSearchBookType = {
  title: string;
  description: string;
  infoLink: string;
  imageLinks?: {
    smallThumbnail: string;
  };
}

const useSearch = () => {
  const [items, setItems] = useState<SearchBookType[]>([]);
  const [value, setValue] = useState<string>("");

  const handleNewBooks = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const searchBooks = async (event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value === '') return;
    const endpoint = 'https://www.googleapis.com/books/v1';

    const res = await fetch(`${endpoint}/volumes?q=${value}`);
    const data = await res.json();
    const dataFormat = data.items.map((item: { volumeInfo: RawSearchBookType }) => {
      const bookId = uuidv4();
      const Info = item.volumeInfo;

      return {
        id: bookId,
        title: Info.title,
        description: Info.description ? Info.description : '概要情報なし',
        image: Info.imageLinks && Info.imageLinks.smallThumbnail ? Info.imageLinks.smallThumbnail : 'http://0.0.0.0:8000/media/no_image.jpg',
      };
    });

    setItems(dataFormat);
  };

  return { items, value, handleNewBooks, searchBooks };
};

export default useSearch;
