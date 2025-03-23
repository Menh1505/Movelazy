import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "./assets/logo.svg";
import { VSCodeApi } from "./utils/vscode";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./aptos/components/ui/card";
import { Button } from "./aptos/components/ui/button";

declare global {
  interface Window {
    vscode: VSCodeApi;
  }
}

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md border-none">
        <CardHeader className="space-y-2 text-center">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-24 w-24" />
            <CardTitle className="mt-4 font-pacifico text-3xl">
              Movelazy
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate("/sol")}
          >
            <span>Solidity</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate("/aptos/project")}
          >
            <span>Aptos</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
