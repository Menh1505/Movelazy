import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AptosPage = () => {
  const navigate = useNavigate();
  const [isAptosInstalled, setIsAptosInstalled] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    //console.log("🔹 Sending message to VS Code to check Aptos...");
    window.vscode.postMessage({ command: "aptos.check" });

    const messageHandler = (event: MessageEvent) => {
      //console.log("📩 Received message from VS Code:", event.data);
      const message = event.data;

      if (message.type === "cliStatus" || message.type === "error") {
        //console.log("✅ Aptos CLI Status:", message.installed ? "Installed" : "Not Installed");
        setIsAptosInstalled(message.installed);
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  useEffect(() => {
    if (isAptosInstalled === false) {
      console.log("🚨 Aptos CLI is not installed. Redirecting to installation page...");
      navigate("/aptos/cli-not-found");
    }
  }, [isAptosInstalled, navigate]);

  return (
    <div className="min-h-screen bg-black">
      <main className="p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AptosPage;
