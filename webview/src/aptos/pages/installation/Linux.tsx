"use client"

import { Info, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Card, CardContent } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"

export default function LinuxInstallationGuide() {
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
                    <h1 className="text-4xl font-bold text-white">Install the Aptos CLI on Linux</h1>
                    <p className="text-gray-400">
                        For Linux, the easiest way to install the Aptos CLI tool is via Python script, although if that does not
                        work, you can also install manually via downloading pre-compiled binaries. The pre-compiled binaries
                        approach is not generally recommended as updating is very manual.
                    </p>
                </div>

                <Alert className="border-yellow-600/20 bg-yellow-600/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-200">
                        Note: If you are using an ARM architecture, you will have to install using the steps here:{" "}
                        <Link to="/aptos/specific-version" className="text-yellow-400 hover:underline">
                            Install Specific Aptos CLI Versions (Advanced)
                        </Link>
                    </AlertDescription>
                </Alert>

                <Tabs defaultValue="python" className="space-y-6">
                    <TabsList className="bg-gray-900">
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
                                        <p>In the terminal, use one of the following commands:</p>
                                    </div>
                                    <Card className="border-gray-800 bg-gray-900">
                                        <CardContent className="p-4">
                                            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                                                <code>curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3</code>
                                            </pre>
                                        </CardContent>
                                    </Card>
                                    <p className="text-gray-400 pl-8">Or use the equivalent wget command:</p>
                                    <Card className="border-gray-800 bg-gray-900">
                                        <CardContent className="p-4">
                                            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                                                <code>wget -qO- "https://aptos.dev/scripts/install_cli.py" | python3</code>
                                            </pre>
                                        </CardContent>
                                    </Card>
                                    <Alert className="border-yellow-600/20 bg-yellow-600/10 mt-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                        <AlertDescription className="text-yellow-200">
                                            If you receive the error{" "}
                                            <code className="bg-yellow-900/30 px-1 rounded">
                                                {"Couldn't find distutils or packaging. We will install the latest version"}
                                            </code>
                                            , you can fix it by running{" "}
                                            <code className="bg-yellow-900/30 px-1 rounded ml-1">pip3 install packaging</code> then repeating
                                            this step.
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            3
                                        </span>
                                        <p>
                                            (Optional) It can be helpful to add the Aptos CLI to a folder in your PATH, or to add it to your
                                            PATH directly.
                                        </p>
                                    </div>
                                    <ul className="list-disc pl-14 text-gray-400 space-y-1">
                                        <li>The steps to add a folder to your PATH are shell dependent.</li>
                                        <li>
                                            You can run <code className="bg-gray-800 px-1 py-0.5 rounded">echo $SHELL</code> to print the
                                            default shell for your machine, then google specific steps to add a folder to your PATH for that
                                            shell.
                                        </li>
                                    </ul>
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
                                    If you would like to update the Aptos CLI to the latest version, you can run "aptos update".
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
                                            <a href="https://github.com/aptos-labs/aptos-core/releases" className="text-blue-400 hover:underline">
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
                                        <p>Click the "Assets" expandable menu for the latest release to see the pre-compiled binaries.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            3
                                        </span>
                                        <p>Download the zip file for Linux.</p>
                                    </div>
                                    <ul className="list-disc pl-14 text-gray-400 space-y-1">
                                        <li>
                                            It will have a name like:{" "}
                                            <code className="bg-gray-800 px-1 py-0.5 rounded">aptos-cli-{"<version>"}-Ubuntu-x86_64.zip</code>
                                        </li>
                                        <li>Make sure you choose the right zip file for your computer architecture.</li>
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
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            5
                                        </span>
                                        <p>Move the extracted Aptos binary file into your preferred folder.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            6
                                        </span>
                                        <p>Open a terminal and navigate to your preferred folder.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            7
                                        </span>
                                        <p>
                                            Make <code className="bg-gray-800 px-1 py-0.5 rounded">~/aptos</code> an executable by running{" "}
                                            <code className="bg-gray-800 px-1 py-0.5 rounded">chmod +x ~/aptos</code>.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            8
                                        </span>
                                        <p>
                                            Verify that this installed version works by running{" "}
                                            <code className="bg-gray-800 px-1 py-0.5 rounded">~/aptos help</code>.
                                        </p>
                                    </div>
                                    <p className="text-gray-400 pl-8">
                                        You should see instructions for how to use all CLI commands. These can be helpful in the future when
                                        you are trying to understand how to use specific commands.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">
                                            9
                                        </span>
                                        <p>
                                            (Optional) It can be helpful to add the Aptos CLI to a folder in your PATH, or to add it to your
                                            PATH directly.
                                        </p>
                                    </div>
                                    <ul className="list-disc pl-14 text-gray-400 space-y-1">
                                        <li>The steps to add a folder to your PATH are shell dependent.</li>
                                        <li>
                                            You can run <code className="bg-gray-800 px-1 py-0.5 rounded">echo $SHELL</code> to print the
                                            default shell for your machine, then google specific steps to add a folder to your PATH for that
                                            shell.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <Alert className="border-blue-600/20 bg-blue-600/10">
                                <Info className="h-4 w-4 text-blue-400" />
                                <AlertDescription className="text-blue-200">
                                    When using the pre-compiled binaries method, you can update the Aptos CLI by deleting your existing
                                    installation, then following the installation steps again.
                                </AlertDescription>
                            </Alert>
                        </section>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
