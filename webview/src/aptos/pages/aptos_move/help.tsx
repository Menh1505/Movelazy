"use client";

import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function MoveHelp() {
  const navigate = useNavigate();

  return (
    <Card className="min-h-screen w-full border-gray-800 bg-gray-900/50">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <Button
            onClick={() => navigate("/aptos/help")}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-white-800/50 hover:bg-red-800"
          >
            Back
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <Button
            onClick={() => navigate("/aptos/move/init")}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
          >
            move init
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <Button
            onClick={() => navigate("/aptos/move/compile")}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
          >
            move compile
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <Button
            onClick={() => navigate("/aptos/move/deploy")}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
          >
            move deploy
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <Button
            onClick={() => navigate("/aptos/move/test")}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
          >
            move test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
