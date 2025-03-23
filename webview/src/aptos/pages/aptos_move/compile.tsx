import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { StatusDialog } from "../../components/status-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { CompileArgs } from "../../types/compileArgs";

// interface CompileArgs {
//   namedAddresses: string;
//   template: string;
//   artifacts: "none" | "sparse" | "all";
//   optimization: "none" | "default" | "extra";
//   saveMetadata: boolean;
//   devMode: boolean;
//   skipGitDeps: boolean;
//   skipAttributeChecks: boolean;
//   checkTestCode: boolean;
//   packageDir: string;
//   outputDir: string;
//   fetchDepsOnly: boolean;
//   overrideStd: "mainnet" | "testnet" | "devnet" | null;
// }

export default function MoveCompile() {
  const navigate = useNavigate();
  const [compiling, setCompiling] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [cliStatus, setcliStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: "success", message: "" });
  const [compileArgs, setCompileArgs] = useState<CompileArgs>({
    saveMetadata: false,
    fetchDepsOnly: false,
    artifacts: "sparse",
    packageDir_compile: "",
    outputDir: "",
    named_addresses: "",
    overrideStd: "",
    devMode: false,
    skipGitDeps: false,
    skipAttributeChecks: false,
    checkTestCode: false,
    optimization: "default",
  });

  const [selectTab, setSelectTab] = useState("simple");
  const handleChange = (
    field: keyof typeof compileArgs,
    value: string | boolean | null
  ) => {
    setCompileArgs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const messageHandler = (event: MessageEvent) => {
    const message = event.data;

    if (message.type === "cliStatus") {
      setCompiling(false);
      setcliStatus({
        type: message.success ? "success" : "error",
        message: message.message,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const handleCompile = async () => {
    setCompiling(true);
    setcliStatus({ type: null, message: "" });
    setShowDialog(true);
    if (window.vscode) {
      try {
        console.log("check compile agrs:", compileArgs);
        window.vscode.postMessage({
          command: "aptos.compile",
          compileArgs: compileArgs,
        });
      } catch {
        setCompiling(false);
        setcliStatus({
          type: "error",
          message: "Failed to start compilation",
        });
      }
    }
  };

  // useEffect(() => {
  //   if (cliStatus.type) {
  //     setShowDialog(true);
  //   }
  // }, [cliStatus]);

  return (
    <div>
      <Card className="min-h-screen border-gray-800 bg-gray-900/50">
        <Button
          variant="outline"
          className="h-12 flex items-center justify-center gap-2 hover:bg-gray-700 mt-2 ml-2"
          onClick={() => navigate("/aptos/move/help")}
        >
          <span>Back</span>
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Compile Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simple" className="mb-6" value={selectTab} onValueChange={(value) => {
            setSelectTab(value);
            setCompileArgs({
              saveMetadata: false,
              fetchDepsOnly: false,
              artifacts: "sparse",
              packageDir_compile: "",
              outputDir: "",
              named_addresses: "",
              overrideStd: "",
              devMode: false,
              skipGitDeps: false,
              skipAttributeChecks: false,
              checkTestCode: false,
              optimization: "default",
            });
          }}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 mb-6">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <div className="space-y-2">
              <Label htmlFor="namedAddresses" className="text-white">
                Named Addresses
              </Label>
              <Input
                id="namedAddresses"
                value={compileArgs.named_addresses}
                onChange={(e) =>
                  handleChange("named_addresses", e.target.value)
                }
                placeholder="e.g. alice, bob"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <TabsContent value="advanced">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Save Metadata</Label>
                    <div className="text-sm text-gray-400">
                      Save the package metadata in build directory
                    </div>
                  </div>
                  <Switch
                    checked={compileArgs.saveMetadata}
                    onCheckedChange={(checked) =>
                      handleChange("saveMetadata", checked)
                    }
                    className="bg-white "
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fetch Dependencies Only</Label>
                    <div className="text-sm text-gray-400">
                      Skip compilation, only fetch dependencies
                    </div>
                  </div>
                  <Switch
                    checked={compileArgs.fetchDepsOnly}
                    onCheckedChange={(checked) =>
                      handleChange("fetchDepsOnly", checked)
                    }
                    className="bg-white "
                  />
                </div>

                <div className="space-y-2">
                  <Label>Artifacts</Label>
                  <Select
                    value={compileArgs.artifacts}
                    onValueChange={(value) => handleChange("artifacts", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select artifacts" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sparse">Sparse</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Package Directory</Label>
                  <Input
                    value={compileArgs.packageDir_compile}
                    onChange={(e) =>
                      handleChange("packageDir_compile", e.target.value)
                    }
                    placeholder="Path to Move package"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Output Directory</Label>
                  <Input
                    value={compileArgs.outputDir}
                    onChange={(e) => handleChange("outputDir", e.target.value)}
                    placeholder="Path to save compiled package"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Override Standard Library</Label>
                  <Select
                    value={compileArgs.overrideStd || ""}
                    onValueChange={(value) =>
                      handleChange("overrideStd", value || null)
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="mainnet">Mainnet</SelectItem>
                      <SelectItem value="testnet">Testnet</SelectItem>
                      <SelectItem value="devnet">Devnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dev Mode</Label>
                    <div className="text-sm text-gray-400">
                      Use dev-addresses and dev-dependencies
                    </div>
                  </div>
                  <Switch
                    checked={compileArgs.devMode}
                    onCheckedChange={(checked) =>
                      handleChange("devMode", checked)
                    }
                    className="bg-white "
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Skip Git Dependencies</Label>
                    <div className="text-sm text-gray-400">
                      Skip pulling latest git dependencies
                    </div>
                  </div>
                  <Switch
                    checked={compileArgs.skipGitDeps}
                    onCheckedChange={(checked) =>
                      handleChange("skipGitDeps", checked)
                    }
                    className="bg-white "
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Skip Attribute Checks</Label>
                    <div className="text-sm text-gray-400">
                      Do not complain about unknown attributes in Move code
                    </div>
                  </div>
                  <Switch
                    checked={compileArgs.skipAttributeChecks}
                    onCheckedChange={(checked) =>
                      handleChange("skipAttributeChecks", checked)
                    }
                    className="bg-white "
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Check Test Code</Label>
                    <div className="text-sm text-gray-400">
                      Apply extended checks for Aptos on test code
                    </div>
                  </div>
                  <Switch
                    checked={compileArgs.checkTestCode}
                    onCheckedChange={(checked) =>
                      handleChange("checkTestCode", checked)
                    }
                    className="bg-white "
                  />
                </div>

                <div className="space-y-2">
                  <Label>Optimization Level</Label>
                  <Select
                    value={compileArgs.optimization}
                    onValueChange={(value) =>
                      handleChange("optimization", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select optimization level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="extra">Extra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCompile}
            disabled={compiling}
          >
            {compiling ? <Loader2 /> : "Compile"}
          </Button>
        </CardContent>
      </Card>

      <StatusDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        loading={compiling}
        status={cliStatus}
        loadingTitle="Compiling..."
        loadingMessage="Please wait while Compile Project..."
        successTitle="Compile Successful"
        errorTitle="Compile Failed"
        successAction={{
          label: "Go to Deploy",
          onClick: () => navigate("/aptos/move/deploy"),
        }}
      />
    </div>
  );
}
