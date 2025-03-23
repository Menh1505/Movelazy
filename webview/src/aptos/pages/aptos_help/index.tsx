"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function AptosHelp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos/project")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-white-800/50 hover:bg-red-800"
            >
              Back
            </Button>
          </div>

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos account
            </Button>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos config
            </Button>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos genesis
            </Button>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos governance
            </Button>
          </div> */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos/info")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos info
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos/init")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos init
            </Button>
          </div>

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos key
            </Button>
          </div> */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos/move")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos move
            </Button>
          </div>

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos multisig
            </Button>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos node
            </Button>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos stake
            </Button>
          </div> */}
          {/* 
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              onClick={() => navigate("/aptos")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Aptos update
            </Button>
          </div> */}

        </CardContent>
      </Card>
    </div>
  );
}
