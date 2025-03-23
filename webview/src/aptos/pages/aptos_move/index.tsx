"use client"

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AptosMove() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/aptos/move/help");
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black">
            <main className="p-0">
                <Outlet />
            </main>
        </div>
    );
}