"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { StatusDialog } from "../../components/status-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function MoveInit() {
    const navigate = useNavigate();
    const [initializing, setInitializing] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [cliStatus, setcliStatus] = useState<{ type: "success" | "error", message: string }>({ type: "success", message: "" })
    const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple")
    const [initArgs, setInitArgs] = useState({
        name: "",
        packageDir: "",
        namedAddresses: "",
        template: "",
        assumeYes: false,
        assumeNo: false,
        frameworkGitRev: "",
        frameworkLocalDir: "",
        skipFetchLatestGitDeps: false,
    })

    const templates = ["hello-blockchain", "hello_prover", "moon_coin", "NFT_Marketplace", "ToDo_list"]; 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        setInitArgs((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleTemplateChange = (value: string) => {
        setInitArgs((prev) => ({
            ...prev,
            template: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (window.vscode) {
            setInitializing(true)
            try {
                window.vscode.postMessage({
                    command: "aptos.moveinit",
                    initArgs: [
                        initArgs.name, initArgs.packageDir, initArgs.namedAddresses, initArgs.template,
                        initArgs.assumeYes, initArgs.assumeNo, initArgs.frameworkGitRev, initArgs.frameworkLocalDir, initArgs.skipFetchLatestGitDeps]
                })
            } catch (error) {
                console.error(error)
                setInitializing(false)
                setcliStatus({ type: "error", message: "Failed to initialize config" })
                setShowDialog(true)
            }
        }
    }

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data
            if (message.type === "cliStatus") {
                if (message.message) {
                    setcliStatus({
                        type: message.success ? "success" : "error",
                        message: message.message
                    });
                    setInitializing(false)
                    setShowDialog(true)
                }
            }
        }
        window.addEventListener("message", messageHandler)
        return () => window.removeEventListener("message", messageHandler)
    }, [])

    return (
        <div className="mx-auto max-w-2xl">
            <Card className="min-h-screen border-gray-800 bg-gray-900/50">
                <Button
                    variant="outline"
                    className="h-12 flex items-center justify-center gap-2 hover:bg-gray-700 mt-2 ml-2"
                    onClick={() => navigate("/aptos/move/help")}
                >
                    <span>Back</span>
                </Button>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Init Project</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "simple" | "advanced")}>
                        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                            <TabsTrigger value="simple" className="data-[state=active]:bg-gray-700">
                                Simple
                            </TabsTrigger>
                            <TabsTrigger value="advanced" className="data-[state=active]:bg-gray-700">
                                Advanced
                            </TabsTrigger>
                        </TabsList>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">
                                Name (required)
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={initArgs.name}
                                onChange={handleInputChange}
                                className="bg-gray-800 border-gray-700 text-white"
                                required
                            />
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <TabsContent value="simple">
                                <div className="space-y-2">
                                    <Label htmlFor="template" className="text-white">
                                        Template (Optional)
                                    </Label>
                                    <Select onValueChange={handleTemplateChange} value={initArgs.template}>
                                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                            <SelectValue placeholder="[Please select a template]" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                            {templates.map((template) => (
                                                <SelectItem key={template} value={template}>
                                                    {template}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>
                            <TabsContent value="advanced">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="packageDir" className="text-white">
                                            Package Directory
                                        </Label>
                                        <Input
                                            id="packageDir"
                                            name="packageDir"
                                            value={initArgs.packageDir}
                                            onChange={handleInputChange}
                                            className="bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="namedAddresses" className="text-white">
                                            Named Addresses
                                        </Label>
                                        <Input
                                            id="namedAddresses"
                                            name="namedAddresses"
                                            value={initArgs.namedAddresses}
                                            onChange={handleInputChange}
                                            className="bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="template" className="text-white">
                                            Template
                                        </Label>
                                        <Select onValueChange={handleTemplateChange} value={initArgs.template}>
                                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                                <SelectValue placeholder="[Please select a template]" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                {templates.map((template) => (
                                                    <SelectItem key={template} value={template}>
                                                        {template}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="assumeYes"
                                            name="assumeYes"
                                            checked={initArgs.assumeYes}
                                            onCheckedChange={(checked) =>
                                                setInitArgs((prev) => ({ ...prev, assumeYes: checked as boolean }))
                                            }
                                        />
                                        <Label htmlFor="assumeYes" className="text-white">
                                            Assume Yes
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="assumeNo"
                                            name="assumeNo"
                                            checked={initArgs.assumeNo}
                                            onCheckedChange={(checked) =>
                                                setInitArgs((prev) => ({ ...prev, assumeNo: checked as boolean }))
                                            }
                                        />
                                        <Label htmlFor="assumeNo" className="text-white">
                                            Assume No
                                        </Label>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="frameworkGitRev" className="text-white">
                                            Framework Git Revision
                                        </Label>
                                        <Input
                                            id="frameworkGitRev"
                                            name="frameworkGitRev"
                                            value={initArgs.frameworkGitRev}
                                            onChange={handleInputChange}
                                            className="bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="frameworkLocalDir" className="text-white">
                                            Framework Local Directory
                                        </Label>
                                        <Input
                                            id="frameworkLocalDir"
                                            name="frameworkLocalDir"
                                            value={initArgs.frameworkLocalDir}
                                            onChange={handleInputChange}
                                            className="bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="skipFetchLatestGitDeps"
                                            name="skipFetchLatestGitDeps"
                                            checked={initArgs.skipFetchLatestGitDeps}
                                            onCheckedChange={(checked) =>
                                                setInitArgs((prev) => ({ ...prev, skipFetchLatestGitDeps: checked as boolean }))
                                            }
                                        />
                                        <Label htmlFor="skipFetchLatestGitDeps" className="text-white">
                                            Skip Fetch Latest Git Dependencies
                                        </Label>
                                    </div>
                                </div>
                            </TabsContent>
                            <Button type="submit" disabled={initializing} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                {initializing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Initializing Project...</span>
                                    </div>
                                ) : (
                                    "Initialize Project"
                                )}
                            </Button>
                        </form>
                    </Tabs>
                </CardContent>
            </Card>
            <StatusDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                loading={initializing}
                status={cliStatus}
                loadingTitle="Initializing..."
                loadingMessage="Please wait while Initialize Project..."
                successTitle="Initializion Successful"
                errorTitle="Initializion Failed"
                successAction={{
                    label: "Go to Compiler",
                    onClick: () => navigate("/aptos/move/compile"),
                }}
            />
        </div>
    )
}
