import { Link } from "react-router-dom";
import Profile from "@features/users/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { useAuth } from "@context/auth.context";
import { Bot } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">E</span>dit
        </h1>
        <Avatar className="">
          <AvatarImage src={user.asset} alt={user.username} />
          <AvatarFallback className="bg-background">
            <Bot size={64} className="text-primary" />
          </AvatarFallback>
        </Avatar>
        <Profile />
        <div className="w-full text-xs flex justify-end">
          <Link to="/users/register" className="text-destructive">
            Delete account?&nbsp;
          </Link>
        </div>
      </div>
    </div>
  );
}
