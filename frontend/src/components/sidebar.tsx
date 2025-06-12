import { IClient } from "@/types";
import Client from "./client";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Copy, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  clients,
  roomId
} : {
  clients: IClient[],
  roomId: string;
}) => {
  const navigate = useNavigate();

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id has been copied", {
        duration: 1500
      });
    } catch (error) {
      console.log(error);
      toast.error("Error copying the room Id");
    }
  }

  const handleLeaveRoom = () => {
    navigate("/");
  }
  return (
    <div className="p-4 flex flex-col min-h-screen">
        <div>
      <Logo />
      <Separator className="my-4" />
        </div>
        <h2 className="text-xl">Connected</h2>
        <div className="flex flex-wrap gap-4 mt-4 flex-grow">
          {clients.map((client, index) => (
            <Client {...client} key={index} />
          ))}
        </div>
        <div className="flex flex-col gap-2 pb-4">
          <Button className="flex gap-2" onClick={copyRoomId}>
            <Copy /> <span>Copy RoomId</span>
            </Button>
          <Button variant={"destructive"} className="flex gap-2" onClick={handleLeaveRoom}>
          <LogOut />  <span>Leave</span> 
          </Button>
        </div>
    </div>
  );
};
export default Sidebar;
