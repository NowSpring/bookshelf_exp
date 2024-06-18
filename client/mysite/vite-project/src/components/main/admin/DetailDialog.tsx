import { BookType } from "../types"
import { Text } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DialogContent } from "@/components/ui/dialog"
import "@/components/main/style.css"
import NoImage from "@/assets/no_image.jpg"

type BookProps = {
  book: BookType;
};

const maxTitleLength = 15;
const maxDescriptionLength = 400;

const TextWithEllipsis = ({ text, maxLength }: { text: string; maxLength: number }) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const DetailDialog: React.FC<BookProps> = ({book}) => {

  return (

    <DialogContent
      style={{ zIndex: 1000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'visible'}}
      className="sm:max-w-[1000px] max-h-[90%] overflow-hidden"
    >

      <div className="layout">

        <div className="sidebar">
          <img className="imageArea" src={book.image ? book.image : NoImage} />
        </div>

        <div className="mainContent">
          <div className="header">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Heading className="title" size='lg'>
                    <TextWithEllipsis text={book.title || ''} maxLength={maxTitleLength} />
                  </Heading>
                </TooltipTrigger>
                <TooltipContent className="tooltip">
                  { book.title }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="description">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Text align='justify' fontSize='xl'>
                    <TextWithEllipsis text={book.description || ''} maxLength={maxDescriptionLength} />
                  </Text>
                  </TooltipTrigger>
                  <TooltipContent className="tooltip">
                    { book.description }
                  </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

    </DialogContent>
  );
};
export default DetailDialog;
