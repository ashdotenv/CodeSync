import Editor from "@monaco-editor/react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LANGUAGE_MAPPING } from "@/data/language";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ACTIONS } from "@/actions";

interface EditorComponentProps {
  socketRef: React.MutableRefObject<Socket | null>;
  roomId: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (code: string) => void;
}

const EditorComponent = ({
  socketRef,
  roomId,
  onCodeChange,
  onLanguageChange,
}: EditorComponentProps) => {
  const [language, setLanguage] = useState(LANGUAGE_MAPPING["js"].monaco);
  const [code, setCode] = useState(LANGUAGE_MAPPING["js"].boilerplate);

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = Object.keys(LANGUAGE_MAPPING).find(
      (lang) => LANGUAGE_MAPPING[lang].monaco === value
    );
    if (selectedLanguage) {
      setLanguage(value);
      onLanguageChange(value);
      setCode(LANGUAGE_MAPPING[selectedLanguage].boilerplate);
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
          language: value,
          roomId,
        });
      }
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange(newCode);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        code: newCode,
        roomId,
      });
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        setCode(code);
      });

      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
        const selectedLanguage = Object.keys(LANGUAGE_MAPPING).find(
          (lang) => LANGUAGE_MAPPING[lang].monaco === language
        );
        if (selectedLanguage) {
          setLanguage(language);
          onLanguageChange(language);
          setCode(LANGUAGE_MAPPING[selectedLanguage].boilerplate);
          if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
              setCode(code);
            });
          }
        }
      });
    }
  }, [socketRef.current]);

  return (
    <div>
      <div className="p-4">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(LANGUAGE_MAPPING).map((lang) => (
              <SelectItem key={lang} value={LANGUAGE_MAPPING[lang].monaco}>
                {LANGUAGE_MAPPING[lang]?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Editor
        height="90vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(newValue) => handleCodeChange(newValue!)}
        options={{
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default EditorComponent;
