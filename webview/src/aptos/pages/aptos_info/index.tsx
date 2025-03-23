"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Cpu, GitBranch, GitCommit, Package, Clock, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

interface BuildInfo {
    build_branch: string;
    build_cargo_version: string;
    build_clean_checkout: string;
    build_commit_hash: string;
    build_is_release_build: string;
    build_os: string;
    build_pkg_version: string;
    build_profile_name: string;
    build_rust_channel: string;
    build_rust_version: string;
    build_tag: string;
    build_time: string;
    build_using_tokio_unstable: string;
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-400">{label}</p>
            <p className="text-base font-semibold text-white break-all">{value}</p>
        </div>
    </div>
)

export default function AptosInfo() {
    const navigate = useNavigate()
    const [cliStatus, setcliStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" })
    const [info, setInfo] = useState<BuildInfo>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (window.vscode) {
            window.vscode.postMessage({ command: "aptos.info" })
        }
    }, [])

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data
            if (message.type === "cliStatus") {
                if (message.message) {
                    setcliStatus({
                        type: message.success ? "success" : "error",
                        message: message.message
                    });
                    setInfo(JSON.parse(message.message).Result);
                }
                setIsLoading(false);
            }
        }

        window.addEventListener("message", messageHandler)
        return () => window.removeEventListener("message", messageHandler)
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 p-0">
            <div className="min-h-screen max-w-4xl mx-auto">
                <Card className="min-h-screen border-gray-700 bg-gray-800/50 overflow-hidden">
                    <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                        <CardTitle className="text-2xl font-bold text-white">Aptos Information</CardTitle>
                    </CardHeader>

                    <CardContent className="p-4">
                        {isLoading ? (
                            <div className="text-white text-lg font-semibold">
                                Loading...
                            </div>
                        ) : cliStatus.type === "error" ? (
                            <div className="text-red-500 text-lg font-semibold">
                                Error: {cliStatus.message}
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InfoItem
                                        icon={<GitBranch className="w-5 h-5 text-blue-400" />}
                                        label="Branch"
                                        value={info?.build_branch || ""}
                                    />
                                    <InfoItem
                                        icon={<Package className="w-5 h-5 text-green-400" />}
                                        label="Package Version"
                                        value={info?.build_pkg_version || ""}
                                    />
                                    <InfoItem
                                        icon={<GitCommit className="w-5 h-5 text-yellow-400" />}
                                        label="Commit Hash"
                                        value={info?.build_commit_hash || ""}
                                    />
                                    <InfoItem icon={<Cpu className="w-5 h-5 text-red-400" />} label="OS" value={info?.build_os || ""} />
                                    <InfoItem
                                        icon={<Settings className="w-5 h-5 text-purple-400" />}
                                        label="Profile"
                                        value={info?.build_profile_name || ""}
                                    />
                                    <InfoItem icon={<Clock className="w-5 h-5 text-pink-400" />} label="Build Time" value={info?.build_time || ""} />
                                </div>
                                <div className="mt-6 space-y-4">
                                    <InfoItem
                                        icon={<Package className="w-5 h-5 text-indigo-400" />}
                                        label="Cargo Version"
                                        value={info?.build_cargo_version || ""}
                                    />
                                    <InfoItem
                                        icon={<Settings className="w-5 h-5 text-teal-400" />}
                                        label="Rust Version"
                                        value={info?.build_rust_version || ""}
                                    />
                                    <InfoItem
                                        icon={<Cpu className="w-5 h-5 text-orange-400" />}
                                        label="Rust Channel"
                                        value={info?.build_rust_channel || ""}
                                    />
                                </div>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-green-400 border-green-400">
                                        {info?.build_is_release_build === "true" ? "Release Build" : "Debug Build"}
                                    </Badge>
                                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                                        {info?.build_clean_checkout === "true" ? "Clean Checkout" : "Modified Checkout"}
                                    </Badge>
                                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                        {info?.build_using_tokio_unstable === "true" ? "Tokio Unstable" : "Tokio Stable"}
                                    </Badge>
                                </div>
                            </>
                        )}
                        <Button
                            onClick={() => navigate("/aptos/help")}
                            variant="outline"
                            className="w-full bg-grey-600 hover:bg-red-700 text-white mt-6"
                        >
                            Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

