import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusDialog } from "../../components/status-dialog";
import { FileEditor } from "../../components/FileEditor";

interface MarkdownFile {
  path: string;
  content: string;
}

export default function ProjectPageAptos() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cliStatus, setcliStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showDialog, setShowDialog] = useState(false);

  const [fileList, setFileList] = useState<MarkdownFile[]>([]);
  // const [selectedFileContent, setSelectedFileContent] = useState<string>("");

  const handleAiCommand = () => {
    if (!window.vscode) {
      return;
    }
    setIsLoading(true);
    setShowDialog(true);
    window.vscode.postMessage({
      command: "ai-command",
    });
  };

  const handleGetFiles = () => {
    if (!window.vscode) return;
    window.vscode.postMessage({
      command: "getFiles",
    });
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.log("check message file", message);
      if (message.type === "cliStatus" && message.message) {
        let finalMessage = message.message;

        if (typeof message.message === "string") {
          const jsonMatch = message.message.match(/{[\s\S]*}$/);
          if (jsonMatch) {
            try {
              finalMessage = JSON.parse(jsonMatch[0]);
            } catch (error) {
              console.error("Không parse được JSON:", error);
            }
          }
        }

        if (typeof finalMessage === "object" && finalMessage.out) {
          finalMessage = finalMessage.out;
        } else if (typeof finalMessage === "object") {
          // Nếu không có thuộc tính .out, chuyển thành chuỗi để đảm bảo an toàn khi render
          finalMessage = JSON.stringify(finalMessage, null, 2);
        }

        setcliStatus({
          type: message.success ? "success" : "error",
          message: finalMessage,
        });

        setIsLoading(false);
        console.log("cliStatus: ", finalMessage);
        setShowDialog(true);
      }

      if (message.type === "cliStatus" && message.files) {
        console.log("check run");
        setFileList(message.files);
      }
      console.log("check filelist", fileList);
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);
  return (
    <div className="min-h-screen bg-black">
      <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
        <CardHeader className="space-y-2 text-center">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-16 w-16" />
            <CardTitle className="mt-4 font-pacifico text-2xl">
              Movelazy
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => {
                handleAiCommand();
              }}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              AI Command
            </Button>

            <Button
              onClick={handleGetFiles}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Get Files
            </Button>
          </div>

          <FileEditor files={fileList} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos/help")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos Commands
            </Button>
          </div>

          <div className="flex flex-row justify-center gap-4 mb-2">
            <a
              href="https://aptos.dev/en/build/get-started"
              className="flex-1 h-10 flex items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Documents
            </a>
            <a
              href="https://movelazy-landing-page-six.vercel.app/"
              className="flex-1 h-10 flex items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Movelazy
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-14 flex flex-col items-center justify-center gap-2 border-gray-700 bg-white-800/50 hover:bg-red-800"
            >
              Back
            </Button>
          </div>
        </CardContent>
        <StatusDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          loading={isLoading}
          status={cliStatus}
          loadingTitle="Ai Executing..."
          loadingMessage="Please wait while running command..."
          successTitle="Ai Execution Successful"
          errorTitle="Ai Execution Failed"
        />
      </Card>
    </div>
  );
}
