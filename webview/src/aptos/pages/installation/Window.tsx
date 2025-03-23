"use client"

import { Info, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Card, CardContent } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"

export default function WindowsInstallationGuide() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Back Button */}
                <Button
                    variant="outline"
                    className="h-10 flex items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                    onClick={() => navigate("/aptos/cli-not-found")}
                >
                    <span>Back</span>
                </Button>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-white">Install the Aptos CLI on Windows</h1>
                    <p className="text-gray-400">
                        For Windows, the easiest way to install the Aptos CLI tool is via Python script. If that does not work, you
                        can also install manually via pre-compiled binaries. The pre-compiled binaries approach is not generally
                        recommended as updating is very manual.
                    </p>
                </div>

                <Tabs defaultValue="python" className="space-y-6">
                    <TabsList className="bg-gray-900 flex flex-wrap md:flex-col min-h-fit">
                        <TabsTrigger value="python" className="data-[state=active]:bg-gray-800">
                            Install via Python Script
                        </TabsTrigger>
                        <TabsTrigger value="binary" className="data-[state=active]:bg-gray-800">
                            Install via Pre-Compiled Binaries
                        </TabsTrigger>
                    </TabsList>





                    <TabsContent value="python" className="space-y-6">
                        <section className="space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            1
                                        </span>
                                        <p>
                                            Ensure you have Python 3.6+ installed by running{" "}
                                            <code className="bg-gray-800 px-1 py-0.5 rounded">python3 --version</code>
                                        </p>
                                    </div>
                                    <p className="text-gray-400 pl-8">
                                        If python3 is not installed, you can find installation instructions on{" "}
                                        <a
                                            href="https://python.org"
                                            className="text-blue-400 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            python.org
                                        </a>
                                        .
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            2
                                        </span>
                                        <p>In PowerShell, run the install script:</p>
                                    </div>
                                    <Card className="border-gray-800 bg-gray-900">
                                        <CardContent className="p-4">
                                            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                                                <code>
                                                    Invoke-WebRequest -Uri "https://aptos.dev/scripts/install_cli.py" -OutFile
                                                    "$env:TEMP\install_cli.py"
                                                </code>
                                            </pre>
                                        </CardContent>
                                    </Card>
                                    <Alert className="border-yellow-600/20 bg-yellow-600/10 mt-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                        <AlertDescription className="text-yellow-200">
                                            If you receive the error{" "}
                                            <code className="bg-yellow-900/30 px-1 rounded">
                                                ModuleNotFoundError: No module named packaging
                                            </code>{" "}
                                            you can install
                                            <code className="bg-yellow-900/30 px-1 rounded ml-1">packaging</code> by running{" "}
                                            <code className="bg-yellow-900/30 px-1 rounded">pip3 install packaging</code> then repeat this
                                            step.
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            3
                                        </span>
                                        <p>Copy and run the command to update your PATH from the terminal.</p>
                                    </div>
                                    <p className="text-gray-400 pl-8">
                                        It should look something like:{" "}
                                        <code className="bg-gray-800 px-1 py-0.5 rounded">
                                            {'setx PATH "%PATH%;C:\\Users\\<your_account_name>\\.aptoscli\\bin"'}
                                        </code>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            4
                                        </span>
                                        <p>
                                            Verify the script is installed by opening a new terminal and running{" "}
                                            <code className="bg-gray-800 px-1 py-0.5 rounded">aptos help</code>
                                        </p>
                                    </div>
                                    <ul className="list-disc pl-14 text-gray-400 space-y-1">
                                        <li>You should see a list of commands you can run using the CLI.</li>
                                        <li>In the future, this is a helpful resource to learn exactly how each command works.</li>
                                    </ul>
                                </div>
                            </div>

                            <Alert className="border-blue-600/20 bg-blue-600/10">
                                <Info className="h-4 w-4 text-blue-400" />
                                <AlertDescription className="text-blue-200">
                                    If you would like to update the Aptos CLI to the latest version via script, you can run{" "}
                                    <code className="bg-blue-900/30 px-1 rounded">aptos update</code>.
                                </AlertDescription>
                            </Alert>
                        </section>
                    </TabsContent>

                    <TabsContent value="binary" className="space-y-6">
                        <section className="space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            1
                                        </span>
                                        <p>
                                            Go to the{" "}
                                            <a href="https://github.com/aptos-labs/aptos-core/releases" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                                Aptos CLI release page
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            2
                                        </span>
                                        <p>Expand "Assets" to see the pre-compiled binaries.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            3
                                        </span>
                                        <p>Download the zip file for Windows.</p>
                                    </div>
                                    <ul className="list-disc pl-14 text-gray-400 space-y-1">
                                        <li>
                                            It will have a name like:{" "}
                                            <code className="bg-gray-800 px-1 py-0.5 rounded">
                                                {"aptos-cli-<version>-Windows-x86_64.zip"}
                                            </code>
                                        </li>
                                        <li>You will likely have to dismiss warnings that this is a suspicious file when downloading.</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            4
                                        </span>
                                        <p>Unzip the downloaded file.</p>
                                    </div>
                                    <p className="text-gray-400 pl-8">
                                        Move the file to whichever folder you would like to call{" "}
                                        <code className="bg-gray-800 px-1 py-0.5 rounded">aptos</code> from in the future.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            5
                                        </span>
                                        <p>Right click, then copy the path to the executable.</p>
                                    </div>
                                    <p className="text-gray-400 pl-8">
                                        Ex.{" "}
                                        <code className="bg-gray-800 px-1 py-0.5 rounded">
                                            {"C:\\Users\\<username>\\Downloads\\aptos-cli-1.1.0-Windows-x86_64\\aptos.exe"}
                                        </code>
                                    </p>
                                </div>

                                <Alert className="border-blue-600/20 bg-blue-600/10">
                                    <Info className="h-4 w-4 text-blue-400" />
                                    <AlertDescription className="text-blue-200">
                                        You may want to add this path to your PATH environment variable to simplify calling the Aptos CLI
                                        going forward.
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            6
                                        </span>
                                        <p>Open PowerShell via the Start Menu.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            7
                                        </span>
                                        <p>
                                            Verify the installation by running the{" "}
                                            <code className="bg-gray-800 px-1 py-0.5 rounded">help</code> command.
                                        </p>
                                    </div>
                                    <p className="text-gray-400 pl-8">
                                        Use the path you copied earlier to call the Aptos CLI. Ex.{" "}
                                        <code className="bg-gray-800 px-1 py-0.5 rounded">
                                            {"C:\\Users\\<username>\\Downloads\\aptos-cli-1.1.0-Windows-x86_64\\aptos.exe help"}
                                        </code>
                                    </p>
                                </div>
                            </div>

                            <Alert className="border-blue-600/20 bg-blue-600/10">
                                <Info className="h-4 w-4 text-blue-400" />
                                <AlertDescription className="text-blue-200">
                                    When installing with pre-compiled binaries, you can update the Aptos CLI by deleting your existing
                                    installation, then following the installation steps again.
                                </AlertDescription>
                            </Alert>
                        </section>
                    </TabsContent>
                </Tabs>

                <Alert className="border-yellow-600/20 bg-yellow-600/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-200">
                        If neither of the above methods work, you will have to build the CLI from source by following these steps:{" "}
                        <Link to="/aptos/specific-version" className="text-yellow-400 hover:underline">
                            Install Specific Aptos CLI Versions (Advanced)
                        </Link>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
