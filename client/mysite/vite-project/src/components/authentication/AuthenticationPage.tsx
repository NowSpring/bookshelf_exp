import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Login from "./Login"
import Signup from "./Signup"
import "./style.css"

const AuthenticationPage = () => {
  return (
    <div className="background">
      <div className="dialog">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login/>
          </TabsContent>

          <TabsContent value="signup">
            <Signup/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
export default AuthenticationPage;