import Profile from "@features/users/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { useAuth } from "@context/auth.context";
import { Bot } from "lucide-react";
import { Button } from "@ui/button";
import { deleteData } from "@/utils/api/data";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    const response = await deleteData(`v1/users/${user.id}`);
    if (response.ok) {
      alert("Account deleted successfully");
      logout();
    }
  };

  return (
    <div className="flex items-center justify-center h-full gap-4 py-10">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">E</span>dit
        </h1>
        <Avatar className="pb-2">
          <AvatarImage src={user.asset} alt={user.username} />
          <AvatarFallback className="bg-background">
            <Bot size={64} className="text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="border-primary border-b-[1px] w-full gap-4"></div>
        <Profile />
        <div className="w-full text-xs flex justify-end">
          <Button
            type="submit"
            variant="ghost"
            onClick={handleDelete}
            className="text-destructive/50 hover:bg-transparent hover:text-destructive"
          >
            Delete account?&nbsp;
          </Button>
        </div>
      </div>
    </div>
  );
}
