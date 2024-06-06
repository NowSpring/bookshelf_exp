import axios from "axios";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import EventService from '@/EventService'
import AlertDialog from "./AlertDialog";

type BookListType = {
  id: string;
  type: string;
}

const Login = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isShowLoginAlert, setIsShowLoginAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [bookListTypes, setBookListTypes] = useState<BookListType[]>([])

  const getBookListTypes = async (id: string): Promise<BookListType[]> => {
    try {
      const response = await EventService.getBookListTypes(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching book list types:', error);
      throw error;
    }
  };

  useEffect(() => {
    setIsValid(username !== '' && password !== '');
  }, [username, password]);

  const submitLogin = async () => {
    try {
      const formState = {
        username: username,
        password: password
      }
      const response = await EventService.submitLogin(formState);
      window.localStorage.setItem('token', response.data.token);
      window.localStorage.setItem('id', response.data.user.id);
      window.localStorage.setItem('username', response.data.user.username);
      window.localStorage.setItem('email', response.data.user.email);
      setIsShowLoginAlert(false);

      const fetchedBookListTypes = await getBookListTypes(response.data.user.id);
      setBookListTypes(fetchedBookListTypes);

      if (fetchedBookListTypes.length > 0) {
        const bookListType = fetchedBookListTypes[0];
        navigate(`/edit/${bookListType.id}`, { state: { bookListType } });
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const data = error.response.data as Record<string, string[]>;
          const detailedErrorMessages = Object.entries(data)
            .map(([key, value]) => `${key}: ${value.join(", ")}`)
            .join("\n");
          setAlertTitle("登録エラー");
          setAlertDescription(`エラーが発生しました: <br>${detailedErrorMessages.replace(/\n/g, '<br>')}`);
        } else {
          setAlertTitle("登録エラー");
          setAlertDescription("不明なエラーが発生しました。");
        }
      } else {
        const err = error as Error;
        setAlertTitle("登録エラー");
        setAlertDescription(`エラーが発生しました: ${err.message}`);
      }
      setIsShowLoginAlert(true);
    }
  };

  return (

    <Card>
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <form>
          <div className="space-y-1">
            <Label htmlFor="loginName">名前</Label>
            <Input
              id="loginName"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="loginPassword">パスワード</Label>
            <Input
              id="loginPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>

        <Dialog open={isShowLoginAlert} onOpenChange={setIsShowLoginAlert}>
          <Button
            color="primary"
            disabled={!isValid}
            onClick={submitLogin}
          >
            ログイン
          </Button>

          {
            isShowLoginAlert &&
            <AlertDialog
              title={alertTitle}
              description={alertDescription}
            />
          }
        </Dialog>
      </CardFooter>
    </Card>
  )
}
export default Login;