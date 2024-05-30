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

const AlertDialog: React.FC<AlertProps> = ({title, description}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          { title }
        </DialogTitle>
        <DialogDescription>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}
export default AlertDialog