"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { StatusDialog } from "../../components/status-dialog";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function AptosInitForm() {
  const navigate = useNavigate();

  const [network, setNetwork] = useState<string>("devnet");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [faucetEndpoint, setFaucetEndpoint] = useState<string>("");

  const [cliStatus, setcliStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showDialog, setShowDialog] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [initTialized, setInitTialized] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setInitializing(true);
    if (window.vscode) {
      setInitializing(true)
      setShowDialog(true)
      try {
        window.vscode.postMessage({
          command: "aptos.init",
          initConfig: [network, endpoint, faucetEndpoint, privateKey],
        });
      } catch (error) {
        console.error(error);
        setInitializing(false);
        setcliStatus({
          type: "error",
          message: "Failed to initialize config",
        });
        setShowDialog(true);
      }
    }
  };

  //Check Aptos is initialized
  useEffect(() => {
    if (window.vscode) {
      setInitTialized(false);

      try {
        window.vscode.postMessage({
          command: "aptos.checkInit",
        });
      }
      catch {
        console.error("Failed to check Aptos initialization");
      }
    }
  }, []);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "cliStatus") {
        if (message.message) {
          setcliStatus({
            type: message.success ? "success" : "error",
            message: message.message,
          });
          setInitializing(false);
          setShowDialog(true);
        }
        if (message.initialized) {
          setInitTialized(message.initialized);
        }
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  // Disable the submit button if 'endpoint' is required and not filled in when custom network is selected

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto">
        <Card className="min-h-screen border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Aptos Init Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {initTialized &&
              <Alert className="border-yellow-600/20 bg-yellow-600/10 mt-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-200">
                  Your Aptos has already been initialized. Do you want to reinitialize?
                </AlertDescription>
              </Alert>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="network" className="text-white">
                  Choose Network
                </Label>
                <Select onValueChange={setNetwork} defaultValue={network}>
                  <SelectTrigger
                    id="network"
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {["devnet", "testnet", "mainnet", "custom"].map(
                      (net) => (
                        <SelectItem
                          key={net}
                          value={net}
                          className="text-white hover:bg-gray-700"
                        >
                          {net.toUpperCase()}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {network !== "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="privateKey" className="text-white">
                    Private Key (None: Auto generate new key-pair)
                  </Label>
                  <Input
                    id="privateKey"
                    type="password"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your private key"
                  />
                </div>
              )}

              {network === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="endpoint" className="text-white">
                      Endpoint (required)
                    </Label>
                    <Input
                      id="endpoint"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter custom endpoint"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faucetEndpoint" className="text-white">
                      Faucet Endpoint (optional)
                    </Label>
                    <Input
                      id="faucetEndpoint"
                      value={faucetEndpoint}
                      onChange={(e) => setFaucetEndpoint(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter custom faucet endpoint"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customPrivateKey" className="text-white">
                      Private Key (None: Auto generate new key-pair)
                    </Label>
                    <Input
                      id="customPrivateKey"
                      type="password"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your private key"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"
              >
                Init
              </Button>
              <Button
                onClick={() => navigate("/aptos/help")}
                variant="outline"
                className="w-full bg-grey-600 hover:bg-red-700 text-white"
              >
                Back
              </Button>
            </form>
          </CardContent>
        </Card>
        <StatusDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          loading={initializing}
          status={cliStatus}
          loadingTitle="Initializing..."
          loadingMessage="Please wait while initializing config..."
          successTitle="Initialization Successful"
          errorTitle="Initialization Failed"
          successAction={{
            label: "Go to init",
            onClick: () => navigate("/aptos/move/init"),
          }}
        />
      </div>
    </div>
  );
}
