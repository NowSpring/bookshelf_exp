import { BookType } from "../types";
import { Dialog } from "@/components/ui/dialog";
import DetailDialog from "../commons/DetailDialog";
import { Check } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdMoreVert } from 'react-icons/md';
import "@/components/main/style.css"


type BookProps = {
  book: BookType;
};

const maxTitleLength = 15;

const TextWithEllipsis = ({ text, maxLength }: { text: string; maxLength: number }) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const Book: React.FC<BookProps> = ({ book }) => {

  const [isDetailDialog, setIsDetailDialog] = useState(false)

  const showDetailDialog = () =>{
    if (isDetailDialog) {
      return (
        <DetailDialog
          book={book}
        />
      )
    }
  }

  return (

    <div
      className="bookBox"
      style={{
        backgroundImage: `url(${book.image})`,
        backgroundSize: '100%',
        backgroundPosition: 'center 50%',
      }}
    >

      <div className="kebabMenu">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span>
              <MdMoreVert size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dropdown-menu" align="start">
            <DropdownMenuItem onClick={() => setIsDetailDialog(true)}>
              <Check className="mr-2 h-4 w-4" />
              <span>詳細情報</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bookHeader">
        <p className="bookText">
          <TextWithEllipsis text={book.title || ''} maxLength={maxTitleLength} />
        </p>
      </div>

      <Dialog
        open={isDetailDialog}
        onOpenChange={setIsDetailDialog}
      >
        {showDetailDialog()}
      </Dialog>

    </div>
  );
};
export default Book
