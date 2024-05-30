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
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EventService from '@/EventService'
import AlertDialog from "../commons/AlertDialog";


const Signup = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isShowSignupAlert, setIsShowSignupAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  useEffect(() => {
    setIsValid(username !== '' && email !== '' && password !== '');
  }, [username, email, password]);

  const submitSignup = async () => {
    console.log("username:", username)
    console.log("email:", email)
    console.log("password:", password)
    try {
      const formState = {
        username: username,
        email: email,
        password: password
      };

      await EventService.submitSignup(formState);

      setAlertTitle("登録完了");
      setAlertDescription("ログインフォームからログインしてください");
      setIsShowSignupAlert(true);

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
      setIsShowSignupAlert(true);
    }
  };

  return (

    <Card>
      <CardHeader>
        <CardTitle>新規登録</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <form>
          <div className="space-y-1">
            <Label htmlFor="signupName">名前</Label>
            <Input
              id="signupName"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="signupEmail">メールアドレス</Label>
            <Input
              id="signupEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="signupPassword">パスワード</Label>
            <Input
              id="signupPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Dialog open={isShowSignupAlert} onOpenChange={setIsShowSignupAlert}>
          <DialogTrigger asChild>
            <Button
              color="primary"
              disabled={!isValid}
              onClick={submitSignup}
            >
              登録
            </Button>
          </DialogTrigger>

          {
            isShowSignupAlert &&
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
export default Signup;