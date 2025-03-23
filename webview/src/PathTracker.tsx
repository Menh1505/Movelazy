import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function PathTracker() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Gửi current path xuống VSCode khi path thay đổi
        if (window.vscode) {
            window.vscode.postMessage({
                command: "updatePath",
                path: location.pathname,
            });
        }


    }, [location]);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data
            if (message.type === "pathChanged") {
                if (message.path !== "/") {
                    // console.log("Navigate to last path: ", message.path);
                    navigate(message.path.toString());
                }
            }
        }

        window.addEventListener("message", messageHandler)
        return () => window.removeEventListener("message", messageHandler)
    }, [navigate]);

    return null; // Component không cần render gì cả
};