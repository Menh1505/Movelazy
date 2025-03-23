import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";

interface cliStatus {
  loading: boolean;
  initialized?: boolean;
  error?: string;
}

const ProjectPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<cliStatus>({ loading: true });

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      console.group("Check sol", message);
      switch (message.type) {
        case "cliStatus":
          setStatus({
            loading: message.loading,
            initialized: message.initialized,
            error: message.error,
          });
          if (message.initialized && !message.loading) {
            navigate("/sol/compiler");
          }
          break;
      }
    };

    window.addEventListener("message", messageHandler);
    window.vscode.postMessage({ command: "solidity.checkWorkspace" });

    return () => window.removeEventListener("message", messageHandler);
  }, [navigate]);

  const handleInitialize = () => {
    window.vscode.postMessage({ command: "solidity.initWorkspace" });
  };

  if (status.initialized) {
    return (
      <div className="h-[calc(100vh-48px)] flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-6">
            Hardhat Project Initialized
          </h1>
          <p className="text-gray-400 mb-6">
            Your workspace is already set up for Hardhat development.
          </p>
          <button
            onClick={() => navigate("/sol/compiler")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Go to Compiler
          </button>
        </div>
      </div>
    );
  }

  if (status.loading) {
    return (
      <div className="h-[calc(100vh-48px)] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-4">
            The initialization process speed base on your PC specs.
          </p>
          <p className="text-gray-400 mt-4">This might take a while.</p>
          <p className="text-gray-400 mt-4">Please don't close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-48px)] flex items-center justify-center">
      <div className="max-w-2xl text-center px-4">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-24 h-24" />
          <h1 className="font-pacifico text-4xl text-white mt-4 mb-8">
            Movelazy
          </h1>
        </div>
        <h1 className="text-3xl font-bold mb-6">Solidity</h1>

        {status.error ? (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{status.error}</p>
          </div>
        ) : (
          <p className="text-gray-400 mb-6">
            This workspace is not initialized for Hardhat development. Would you
            like to set it up now?
          </p>
        )}

        <button
          onClick={handleInitialize}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Initialize Hardhat Project
        </button>

        <div className="mt-8 text-sm text-gray-500">
          <p>This will:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Initialize a new npm project (if needed)</li>
            <li>Install Hardhat and required dependencies</li>
            <li>Create initial project structure</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
