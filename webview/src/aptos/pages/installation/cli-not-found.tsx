"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { CommandIcon as CommandLine, Apple, ComputerIcon as Windows, LaptopIcon as Linux, Wrench } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CliNotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Back Button */}
                <Button
                    variant="outline"
                    className="h-10 flex items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                    onClick={() => navigate("/")}
                >
                    <span>Back</span>
                </Button>

                <Alert variant="destructive" className="border-red-600/20 bg-red-600/10">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <AlertTitle className="text-red-400 text-lg">Aptos CLI Not Found</AlertTitle>
                    <AlertDescription className="text-red-200 mt-2">
                        The Aptos Command Line Interface (CLI) is not installed on your system. Please choose your operating system
                        below to view the installation instructions.
                    </AlertDescription>
                </Alert>

                <Card className="border-gray-800 bg-gray-900/50">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Button
                                variant="outline"
                                className="h-24 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                                onClick={() => navigate("/aptos/mac")}
                            >
                                <Apple className="h-6 w-6" />
                                <span>Install on macOS</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-24 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                                onClick={() => navigate("/aptos/windows")}
                            >
                                <Windows className="h-6 w-6" />
                                <span>Install on Windows</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-24 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                                onClick={() => navigate("/aptos/linux")}
                            >
                                <Linux className="h-6 w-6" />
                                <span>Install on Linux</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-24 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                                onClick={() => navigate("/aptos/specific-version")}
                            >
                                <Wrench className="h-6 w-6" />
                                <span>Specific Version Installation</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <div className="flex items-center gap-3 text-gray-400">
                        <CommandLine className="h-5 w-5" />
                        <p>
                            The Aptos CLI provides essential tools for interacting with the Aptos blockchain, managing accounts, and
                            deploying smart contracts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
