import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { RootLayout } from "./RootLayout";
import HomePage from "./home";
//------------------- Solidity imports --------------------- //
import SolPage from "./sol";
import CompilerPage from "./sol/pages/compiler";
import TesterPage from "./sol/pages/tester";
import DeployerPage from "./sol/pages/deployer";
import ProjectPageSol from "./sol/pages/project";
//------------------- Aptos imports --------------------- //
import AptosPage from "./aptos";
import TesterAptosPage from "./aptos/pages/tester";
import ProjectPageAptos from "./aptos/pages/project";
import CliNotFound from "./aptos/pages/installation/cli-not-found";
import LinuxInstallationGuide from "./aptos/pages/installation/Linux";
import MacInstallationGuide from "./aptos/pages/installation/Mac";
import WindowsInstallationGuide from "./aptos/pages/installation/Window";
import SpecificInstallationGuide from "./aptos/pages/installation/SpecificVersion";
import AptosInitForm from "./aptos/pages/aptos_init";
import AptosHelp from "./aptos/pages/aptos_help";
import AptosMove from "./aptos/pages/aptos_move";
import MoveHelp from "./aptos/pages/aptos_move/help";
import MoveInit from "./aptos/pages/aptos_move/init";
import MoveCompile from "./aptos/pages/aptos_move/compile";
import AptosInfo from "./aptos/pages/aptos_info";
import MoveDeploy from "./aptos/pages/aptos_move/deploy";
import MoveTest from "./aptos/pages/aptos_move/test";

// Router configuration
const router = createMemoryRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "sol",
        element: <SolPage />,
        children: [
          {
            path: "project",
            element: <ProjectPageSol />,
          },
          {
            path: "compiler",
            element: <CompilerPage />,
          },
          {
            path: "tester",
            element: <TesterPage />,
          },
          {
            path: "deployer",
            element: <DeployerPage />,
          },
        ],
      },
      {
        path: "aptos",
        element: <AptosPage />,
        children: [
          {
            path: "cli-not-found",
            element: <CliNotFound />,
          },
          {
            path: "mac",
            element: <MacInstallationGuide />,
          },
          {
            path: "linux",
            element: <LinuxInstallationGuide />,
          },
          {
            path: "windows",
            element: <WindowsInstallationGuide />,
          },
          {
            path: "info",
            element: <AptosInfo />,
          },
          {
            path: "init",
            element: <AptosInitForm />,
          },
          {
            path: "help",
            element: <AptosHelp />,
          },
          {
            path: "move",
            element: <AptosMove />,
            children: [
              {
                path: "help",
                element: <MoveHelp />,
              },
              {
                path: "init",
                element: <MoveInit />,
              },
              {
                path: "compile",
                element: <MoveCompile />,
              },
              {
                path: "test",
                element: <MoveTest />,
              },
              {
                path: "deploy",
                element: <MoveDeploy />,
              },
            ],
          },
          {
            path: "specific-version",
            element: <SpecificInstallationGuide />,
          },
          {
            path: "project",
            element: <ProjectPageAptos />,
          },
          {
            path: "tester",
            element: <TesterAptosPage />,
          },
        ],
      },
    ],
  },
]);



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode >
);
