import { useState, useEffect } from "react";
import { BasicSettings } from "../../components/compiler/BasicSettings";
import { OptimizerSettings } from "../../components/compiler/OptimizerSettings";
import { AdvancedSettings } from "../../components/compiler/AdvancedSettings";
import { CompilerConfig } from "../../types/settings";

// declare global {
//     interface Window {
//         vscode: VSCodeApi;
//     }
// }

const CompilerPage = () => {
  const [settings, setSettings] = useState<CompilerConfig>({
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
      evmVersion: "london",
      viaIR: false,
      metadata: {
        bytecodeHash: "ipfs",
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  });

  const [compiling, setCompiling] = useState(false);
  const [cliStatus, setcliStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [cleaning, setCleaning] = useState(false);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === "cliStatus") {
        setCompiling(false);
        setcliStatus({
          type: message.success ? "success" : "error",
          message: message.message,
        });
      } else if (message.type === "cleanStatus") {
        setCleaning(false);
        setcliStatus({
          type: message.success ? "success" : "error",
          message: message.message,
        });
      }

      // Clear status after 5 seconds
      if (message.type === "cliStatus" || message.type === "cleanStatus") {
        setTimeout(() => {
          setcliStatus({ type: null, message: "" });
        }, 5000);
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const handleCompile = async () => {
    setCompiling(true);
    setcliStatus({ type: null, message: "" });
    try {
      window.vscode.postMessage({
        command: "solidity.compile",
        settings: settings,
      });
    } catch {
      setCompiling(false);
      setcliStatus({
        type: "error",
        message: "Failed to start compilation",
      });
    }
  };

  const handleClean = async () => {
    setCleaning(true);
    setcliStatus({ type: null, message: "" });

    try {
      window.vscode.postMessage({
        command: "solidity.clean",
      });
    } catch {
      setCleaning(false);
      setcliStatus({
        type: "error",
        message: "Failed to clean artifacts",
      });
    }
  };

  const handleBasicSettingsChange = (key: string, value: string | boolean) => {
    if (key === "version") {
      setSettings({ ...settings, version: value as string });
    } else if (key === "evmVersion") {
      setSettings({
        ...settings,
        settings: { ...settings.settings, evmVersion: value as string },
      });
    }
  };

  const handleOptimizerSettingsChange = (enabled: boolean, runs?: number) => {
    setSettings({
      ...settings,
      settings: {
        ...settings.settings,
        optimizer: { enabled, runs: runs || settings.settings.optimizer.runs },
      },
    });
  };

  const handleAdvancedSettingsChange = (
    key: string,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      settings: {
        ...settings.settings,
        [key]: value,
        ...(key === "bytecodeHash"
          ? {
              metadata: {
                ...settings.settings.metadata,
                bytecodeHash: value as "ipfs" | "bzzr1",
              },
            }
          : {}),
      },
    });
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)]">
      <div className="flex-1 bg-background-light border border-border overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-text text-2xl font-medium">
              Compiler Settings
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleClean}
                disabled={cleaning || compiling}
                className={`px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors ${
                  cleaning || compiling ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {cleaning ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cleaning...
                  </div>
                ) : (
                  "Clean"
                )}
              </button>
              <button
                onClick={handleCompile}
                disabled={cleaning || compiling}
                className={`px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors ${
                  cleaning || compiling ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {compiling ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Compiling...
                  </div>
                ) : (
                  "Compile"
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <BasicSettings
              version={settings.version}
              evmVersion={settings.settings.evmVersion}
              onChange={handleBasicSettingsChange}
            />
            <OptimizerSettings
              enabled={settings.settings.optimizer.enabled}
              runs={settings.settings.optimizer.runs}
              onChange={handleOptimizerSettingsChange}
            />
            <AdvancedSettings
              bytecodeHash={settings.settings.metadata.bytecodeHash}
              viaIR={settings.settings.viaIR}
              onChange={handleAdvancedSettingsChange}
            />
          </div>
        </div>
      </div>

      {/* Compilation Status Bar */}
      {cliStatus.type && (
        <div
          className={`p-4 border-t border-border transition-all ${
            cliStatus.type === "success"
              ? "bg-green-500/5 text-green-500 border-green-500/20"
              : "bg-red-500/5 text-red-500 border-red-500/20"
          }`}
        >
          <pre className="font-mono text-sm whitespace-pre-wrap">
            {cliStatus.message}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CompilerPage;
