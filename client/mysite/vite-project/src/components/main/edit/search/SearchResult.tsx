import { Text } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";
import "@/components/main/style.css"
import { BookType, SearchBookType } from '../../types';

type SearchResultProps = {
  item: SearchBookType;
  book: BookType;
  setBook: (book: BookType) => void;
  closeDialog: () => void;
}

const maxTitleLength = 15;
const maxDescriptionLength = 400;

const TextWithEllipsis = ({ text, maxLength }: { text: string; maxLength: number }) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const SearchResult: React.FC<SearchResultProps> = ({item, book, setBook, closeDialog}) => {

  const setNewBook = () => {
    const newBook = {
      id: book.id,
      booklist: book.booklist,
      title: item.title,
      description: item.description,
      image: item.image,
      version: 1,
      order: book.order
    }
    setBook(newBook)
    closeDialog();
  }

  return (
    <div className="layout">

      <div className="sidebar">
        <img className="imageArea" src={item.image} />
      </div>

      <div className="mainContent">
        <div className="header">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Heading className="title" size='lg'>
                  <TextWithEllipsis text={item.title || ''} maxLength={maxTitleLength} />
                </Heading>
              </TooltipTrigger>
              <TooltipContent>
                { item.title }
              </TooltipContent>
              <Button onClick={setNewBook}>
                登録
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="description">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Text align='justify' fontSize='xl'>
                  <TextWithEllipsis text={item.description || ''} maxLength={maxDescriptionLength} />
                </Text>
                </TooltipTrigger>
                <TooltipContent>
                  { item.description }
                </TooltipContent>
              </Tooltip>
          </TooltipProvider>
        </div>

      </div>
    </div>
  )
}
export default SearchResult;