import React from 'react';
import DOMPurify from 'dompurify';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type AlertProps = {
  title: string;
  description: string;
}

const AlertDialog: React.FC<AlertProps> = ({ title, description }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogDescription>
          <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}

export default AlertDialog;
