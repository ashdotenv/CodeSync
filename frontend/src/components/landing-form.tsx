import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Logo from "./logo"

const LandingForm = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const createroomId = () => {
    const id: string = uuidv4();
    setRoomId(id);
    toast.success("Room Id generated!", {
      duration: 1500,
      position: "bottom-right",
    });
  };
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (!roomId) {
      toast.error("Room Id is required!", {
        duration: 1500,
        position: "bottom-right",
      });
      return;
    }
    if (!name) {
      toast.error("Username is required!", {
        duration: 1500,
        position: "bottom-right",
      });
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        name
      }
    })
  };
  return (
    <Card className="w-[350px] bg-black">
      <CardHeader>
        <CardTitle >
          <Logo />
        </CardTitle>
        <CardDescription>
          Collaborate and code in real-time with seamless synchronization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="roomId">RoomId</Label>
              <Input
                id="roomId"
                placeholder="Room Id"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" onChange={(e) => setName(e.target.value)} value={name} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex justify-end w-full mb-4">
          <Button onClick={handleSubmit}>Join</Button>
        </div>
        <div>
          <p>
            Don't have invite?{" "}
            <span className="underline cursor-pointer" onClick={createroomId}>
              Create Room
            </span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LandingForm;
