"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FlagsSettings } from "../../components/tester/Flags";
import { TestStatus } from "../../types/status";

const TesterAptosPage = () => {
  const [flags, setFlags] = useState({
    enabled: false,
    testName: "",
  });

  const [testing, setTesting] = useState(false);
  const [testingStatus, setTestingStatus] = useState<TestStatus>({
    type: null,
    message: "",
  });

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === "testerStatus") {
        setTesting(false);
        setTestingStatus({
          type: message.success ? "success" : "error",
          message: message.message,
        });
      }

      if (message.type === "testerStatus" || message.type === "cleanStatus") {
        setTimeout(() => {
          setTestingStatus({ type: null, message: "" });
        }, 5000);
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const handleTester = async () => {
    setTesting(true);
    setTestingStatus({ type: null, message: "" });

    if (window.vscode) {
      try {
        window.vscode.postMessage({
          command: "aptos.tester",
          flags: flags,
        });
      } catch {
        setTesting(false);
        setTestingStatus({
          type: "error",
          message: "Failed to start Testing",
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="p-4 border-b border-[rgba(128,128,128,0.35)]">
          <div className="flex justify-between items-center">
            <h2 className="text-[13px] font-medium text-[rgba(215,215,215,0.9)]">
              Aptos Tester
            </h2>
            <button
              onClick={handleTester}
              disabled={testing}
              className={`
                px-3 h-7 
                bg-[rgba(60,60,60,0.45)] 
                hover:bg-[rgba(70,70,70,0.5)]
                text-[rgba(215,215,215,0.9)]
                text-xs
                rounded-[3px]
                border border-[rgba(128,128,128,0.35)]
                hover:border-[rgba(128,128,128,0.5)]
                focus:outline-none
                focus:border-[rgba(128,128,128,0.5)]
                focus:ring-1
                focus:ring-blue-500
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex items-center gap-2
              `}
            >
              {testing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : (
                "Run Tests"
              )}
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <FlagsSettings
              enabled={flags.enabled}
              onChange={(enabled, testName) =>
                setFlags({ enabled, testName: testName || "" })
              }
            />
          </div>
        </div>
      </div>

      {testingStatus.type && (
        <div
          className={`
            p-3 border-t text-xs font-mono
            ${
              testingStatus.type === "success"
                ? "bg-[rgba(40,167,69,0.1)] border-[rgba(40,167,69,0.2)] text-[rgb(77,184,101)]"
                : "bg-[rgba(220,53,69,0.1)] border-[rgba(220,53,69,0.2)] text-[rgb(220,53,69)]"
            }
          `}
        >
          <pre className="whitespace-pre-wrap">{testingStatus.message}</pre>
        </div>
      )}
    </div>
  );
};

export default TesterAptosPage;
