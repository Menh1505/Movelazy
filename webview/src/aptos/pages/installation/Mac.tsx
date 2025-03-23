
"use client"

import { Terminal } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"

export default function MacInstallationGuide() {
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
                    <h1 className="text-4xl font-bold text-white">Install the Aptos CLI on Mac</h1>
                    <p className="text-gray-400">
                        For Mac, the easiest way to install the Aptos CLI is with the package manager{" "}
                        <code className="bg-gray-800 px-1 py-0.5 rounded">brew</code>.
                    </p>
                </div>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Installation</h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">1</span>
                                <p>
                                    Ensure you have <code className="bg-gray-800 px-1 py-0.5 rounded">brew</code> installed{" "}
                                    <a
                                        href="https://brew.sh/"
                                        className="text-blue-400 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        https://brew.sh/
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">2</span>
                                <p>Open a new terminal and enter the following commands.</p>
                            </div>
                            <Card className="border-gray-800 bg-gray-900">
                                <CardContent className="p-4">
                                    <pre className="text-sm text-gray-300">
                                        <code>brew update{"\n"}brew install aptos</code>
                                    </pre>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700">3</span>
                                <p>
                                    Open another terminal and run <code className="bg-gray-800 px-1 py-0.5 rounded">aptos help</code> to
                                    verify the CLI is installed.
                                </p>
                            </div>
                            <Card className="border-gray-800 bg-gray-900">
                                <CardContent className="p-4">
                                    <pre className="text-sm text-gray-300">
                                        <code>aptos help</code>
                                    </pre>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Alert className="border-yellow-600/20 bg-yellow-600/10">
                        <Terminal className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-200">
                            If brew does not work for you, you can try the steps here:{" "}
                            <Link to="/aptos/specific-version" className="text-yellow-400 hover:underline">
                                Install Specific Aptos CLI Versions (Advanced)
                            </Link>
                        </AlertDescription>
                    </Alert>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Upgrading the CLI</h2>
                    <p className="text-gray-400">Upgrading the CLI with brew just takes 2 commands:</p>
                    <Card className="border-gray-800 bg-gray-900">
                        <CardContent className="p-4">
                            <pre className="text-sm text-gray-300">
                                <code>brew update{"\n"}brew upgrade aptos</code>
                            </pre>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
