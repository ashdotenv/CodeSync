import { ACTIONS } from "@/actions";
import Editor from "@/components/editor";
import Sidebar from "@/components/sidebar";
import { initSocket } from "@/lib/socket";
import { IClient } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

const EditorPage = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const codeRef = useRef<string>("");
  const languageRef = useRef<string>("");
  const reactNavigator = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        // Joining a room
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          name: location.state?.name,
        });

        // Listening for joined event
        socketRef.current.on(ACTIONS.JOINED, ({ clients, name, socketId }) => {
          if (location.state.name !== name) {
            toast.success(`${name} joined the room`, {
              duration: 1500,
              position: "top-right",
            });
          }
          setClients(clients);
          socketRef.current?.emit(ACTIONS.SYNC_CODE, { code: codeRef.current, socketId })
          socketRef.current?.emit(ACTIONS.SYNC_LANGUAGE, { language: languageRef.current, socketId })
        });

        // Listening for disconnect event
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ name, socketId }) => {
          toast.info(`${name} has left the room`, {
            duration: 1500,
            position: "top-right",
          });

          setClients((prev) =>
            prev.filter((item) => item.socketId !== socketId)
          );
        });
      } catch (error) {
        console.error("Socket connection failed:", error);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="grid grid-cols-[250px_1fr]">
      <Sidebar clients={clients} roomId={roomId!} />
      <Editor
        socketRef={socketRef}
        roomId={roomId!}
        onCodeChange={(code: string) => {
          codeRef.current = code;
        }}
        onLanguageChange={(language: string) => {
          languageRef.current = language
        }}
      />
    </div>
  );
};
export default EditorPage;
