"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { TestArgs } from "../../types/testArgs"
import { StatusDialog } from "../../components/status-dialog"

export default function MoveTest() {
    const navigate = useNavigate()
    const [testing, setTesting] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [testStatus, setTestStatus] = useState<{ type: "success" | "error"; message: string }>({ type: "success", message: "" })
    const [formData, setFormData] = useState<TestArgs>({
        namedAddresses: "",
        filter: "",
        ignoreCompileWarnings: false,
        packageDir: "",
        outputDir: "",
        overrideStd: "",
        skipFetchLatestGitDeps: false,
        skipAttributeChecks: false,
        dev: false,
        checkTestCode: false,
        optimize: "",
        bytecodeVersion: "",
        compilerVersion: "",
        languageVersion: "",
        moveVersion: "",
        instructions: "",
        coverage: false,
        dump: false,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (window.vscode) {
            setTesting(true)
            setShowDialog(true)
            try {
                window.vscode.postMessage({
                    command: "aptos.movetest",
                    testArgs: formData
                })
            } catch (error) {
                console.error(error)
                setTesting(false)
                setTestStatus({ type: "error", message: "Failed to test" })
                setShowDialog(true)
            }
        }
    }

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data
            if (message.type === "cliStatus") {
                if (message.message) {
                    setTestStatus({
                        type: message.success ? "success" : "error",
                        message: message.message
                    });
                    setTesting(false)
                    setShowDialog(true)
                }
            }
        }
        window.addEventListener("message", messageHandler)
        return () => window.removeEventListener("message", messageHandler)
    }, [])

    return (
        <div className="min-h-screen bg-black">
            <Card className="min-h-screen mx-auto max-w-3xl border-gray-800 bg-gray-900/50">
                <Button
                    variant="outline"
                    className="h-12 flex items-center justify-center gap-2 hover:bg-gray-700 mt-2 ml-2"
                    onClick={() => navigate("/aptos/move/help")}
                >
                    <span>Back</span>
                </Button>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Aptos Move Test</CardTitle>
                    <CardDescription className="text-gray-400">Run Move unit tests for a package</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="simple" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="simple" className="data-[state=active]:bg-gray-700">Simple</TabsTrigger>
                            <TabsTrigger value="advanced" className="data-[state=active]:bg-gray-700">Advanced</TabsTrigger>
                        </TabsList>
                        <TabsContent value="simple">
                            <form onSubmit={onSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <Label htmlFor="namedAddresses" className="text-white">Named Addresses</Label>
                                    <Input
                                        id="namedAddresses"
                                        name="namedAddresses"
                                        placeholder="Named addresses for move binary"
                                        value={formData.namedAddresses}
                                        onChange={handleInputChange}
                                        required={true}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Run Move Test
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="advanced">
                            <form onSubmit={onSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <Label htmlFor="namedAddresses" className="text-white">Named Addresses</Label>
                                    <Input
                                        id="namedAddresses"
                                        name="namedAddresses"
                                        placeholder="Named addresses for move binary"
                                        value={formData.namedAddresses}
                                        onChange={handleInputChange}
                                        required={true}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="filter">Filter</Label>
                                    <Input
                                        id="filter"
                                        name="filter"
                                        placeholder="Enter filter string"
                                        value={formData.filter}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="ignoreCompileWarnings"
                                        name="ignoreCompileWarnings"
                                        checked={formData.ignoreCompileWarnings}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, ignoreCompileWarnings: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="ignoreCompileWarnings">Ignore Compile Warnings</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="packageDir">Package Directory</Label>
                                    <Input
                                        id="packageDir"
                                        name="packageDir"
                                        placeholder="Path to move package"
                                        value={formData.packageDir}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="outputDir">Output Directory</Label>
                                    <Input
                                        id="outputDir"
                                        name="outputDir"
                                        placeholder="Path to save compiled package"
                                        value={formData.outputDir}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="overrideStd">Override Standard Library</Label>
                                    <Select
                                        onValueChange={(value) => handleSelectChange("overrideStd", value)}
                                        value={formData.overrideStd}
                                    >
                                        <SelectTrigger className="bg-gray-800 text-white">
                                            <SelectValue placeholder="Select version" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mainnet">Mainnet</SelectItem>
                                            <SelectItem value="testnet">Testnet</SelectItem>
                                            <SelectItem value="devnet">Devnet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="skipFetchLatestGitDeps"
                                        name="skipFetchLatestGitDeps"
                                        checked={formData.skipFetchLatestGitDeps}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, skipFetchLatestGitDeps: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="skipFetchLatestGitDeps">Skip Fetching Latest Git Dependencies</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="skipAttributeChecks"
                                        name="skipAttributeChecks"
                                        checked={formData.skipAttributeChecks}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, skipAttributeChecks: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="skipAttributeChecks">Skip Attribute Checks</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dev"
                                        name="dev"
                                        checked={formData.dev}
                                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, dev: checked as boolean }))}
                                    />
                                    <Label htmlFor="dev">Dev Mode</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="checkTestCode"
                                        name="checkTestCode"
                                        checked={formData.checkTestCode}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, checkTestCode: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="checkTestCode">Check Test Code</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="optimize">Optimization Level</Label>
                                    <Select onValueChange={(value) => handleSelectChange("optimize", value)} value={formData.optimize}>
                                        <SelectTrigger className="bg-gray-800 text-white">
                                            <SelectValue placeholder="Select optimization level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="extra">Extra</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bytecodeVersion">Bytecode Version</Label>
                                    <Input
                                        id="bytecodeVersion"
                                        name="bytecodeVersion"
                                        placeholder="Enter bytecode version"
                                        value={formData.bytecodeVersion}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="compilerVersion">Compiler Version</Label>
                                    <Input
                                        id="compilerVersion"
                                        name="compilerVersion"
                                        placeholder="Enter compiler version"
                                        value={formData.compilerVersion}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="languageVersion">Language Version</Label>
                                    <Input
                                        id="languageVersion"
                                        name="languageVersion"
                                        placeholder="Enter language version"
                                        value={formData.languageVersion}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Move Version</Label>
                                    <RadioGroup
                                        onValueChange={(value) => handleSelectChange("moveVersion", value)}
                                        value={formData.moveVersion}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="move-2" id="move-2" />
                                            <Label htmlFor="move-2">Move 2</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="move-1" id="move-1" />
                                            <Label htmlFor="move-1">Move 1</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instructions">Maximum Instructions</Label>
                                    <Input
                                        id="instructions"
                                        name="instructions"
                                        type="number"
                                        placeholder="Enter maximum instructions"
                                        value={formData.instructions}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="coverage"
                                        name="coverage"
                                        checked={formData.coverage}
                                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, coverage: checked as boolean }))}
                                    />
                                    <Label htmlFor="coverage">Collect Coverage</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dump"
                                        name="dump"
                                        checked={formData.dump}
                                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, dump: checked as boolean }))}
                                    />
                                    <Label htmlFor="dump">Dump Storage State</Label>
                                </div>


                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={testing}>
                                    {testing ? "Testing..." : "Run Move Test"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <StatusDialog
                    open={showDialog}
                    onOpenChange={setShowDialog}
                    loading={testing}
                    status={testStatus}
                    loadingTitle="Testing..."
                    loadingMessage="Please wait while Testing Project..."
                    successTitle="Testing Successful"
                    errorTitle="Testing Failed"
                />
            </Card>
        </div>
    )
}

