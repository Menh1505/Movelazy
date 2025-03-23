import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SolNavbar } from "./components/SolNavbar";
import { useState, useEffect } from "react";

interface cliStatus {
  loading: boolean;
  initialized?: boolean;
  error?: string;
}

const SolPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<cliStatus>({ loading: true });

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;

      switch (message.type) {
        case "settings":
          setStatus({
            loading: false,
            initialized: true,
          });
          if (location.pathname === "/sol") {
            navigate("/sol/project");
          }
          break;
        case "cliStatus":
          setStatus({
            loading: message.loading,
            initialized: message.initialized,
            error: message.error,
          });
          break;
      }
    };

    window.addEventListener("message", messageHandler);
    window.vscode.postMessage({ command: "solidity.getSettings" });

    return () => window.removeEventListener("message", messageHandler);
  }, [navigate, location]);

  useEffect(() => {
    if (
      !status.loading &&
      !status.initialized &&
      location.pathname === "/sol/compiler"
    ) {
      navigate("/sol/project");
    }
  }, [status, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-[#0e0f0e]">
      <SolNavbar />
      <main className="p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default SolPage;
