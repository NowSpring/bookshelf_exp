import EventService from "@/EventService";
import { RecBookType } from "../types";
import { Dialog } from "@/components/ui/dialog";
import DetailDialog from "./DetailDialog";
import { Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreVert } from "react-icons/md";
import NoImage from "@/assets/no_image.jpg";
import "@/components/main/style.css";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Eye } from "lucide-react";

type BookProps = {
  book: RecBookType;
};

const maxTitleLength = 10;

const TextWithEllipsis = ({
  text,
  maxLength,
}: {
  text: string;
  maxLength: number;
}) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const Book: React.FC<BookProps> = ({ book }) => {
  const isInitialMount = useRef(true);
  const [isDetailDialog, setIsDetailDialog] = useState(false);
  const [isWantToSee, setIsWantToSee] = useState(book.want_to_see);
  const [isWantToRewatch, setIsWantToRewatch] = useState(book.want_to_rewatch);

  const handleWantToSeeToggle = () => {
    setIsWantToSee(!isWantToSee);
  };

  const handleWantToRewatchToggle = () => {
    setIsWantToRewatch(!isWantToRewatch);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      EventService.putRecBook({
        id: book.id,
        want_to_see: isWantToSee,
        want_to_rewatch: isWantToRewatch,
      });
    }
  }, [isWantToSee, isWantToRewatch, book.id]);

  const showDetailDialog = () => {
    if (isDetailDialog) {
      return <DetailDialog book={book} />;
    }
  };

  return (
    <>
      <div
        className="bookBox"
        style={{
          backgroundImage: `url(${book.image ? book.image : NoImage})`,
          backgroundSize: "140%",
          backgroundPosition: "center 50%",
        }}
      >
        <div className="kebabMenu">
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="kebabButton">
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

            <Button
              size="icon"
              style={{
                backgroundColor: isWantToSee ? "red" : "gray",
                color: "white",
              }}
              onClick={handleWantToSeeToggle}
            >
              <ThumbsUp />
            </Button>

            <Button
              size="icon"
              style={{
                backgroundColor: isWantToRewatch ? "orange" : "gray",
                color: "white",
              }}
              onClick={handleWantToRewatchToggle}
            >
              <Eye />
            </Button>
          </div>
        </div>

        <div className="bookHeader">
          <p className="bookTitle">
            <TextWithEllipsis
              text={book.title || ""}
              maxLength={maxTitleLength}
            />
          </p>
        </div>
      </div>

      <Dialog open={isDetailDialog} onOpenChange={setIsDetailDialog}>
        {showDetailDialog()}
      </Dialog>
    </>
  );
};
export default Book;
