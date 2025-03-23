import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Alert, AlertDescription } from "./ui/alert"
import { Button } from "./ui/button"

export interface StatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  status: {
    type: "success" | "error" | null
    message: string
  }
  loadingTitle?: string
  loadingMessage?: string
  successTitle?: string
  errorTitle?: string
  successAction?: {
    label: string
    onClick: () => void
  }
  link?: {
    label: string
    transactionLink?: string
  }
  preventCloseWhileLoading?: boolean
}

export function StatusDialog({
  open,
  onOpenChange,
  loading,
  status,
  loadingTitle = "Processing...",
  loadingMessage = "Please wait while processing...",
  successTitle = "Operation Successful",
  errorTitle = "Operation Failed",
  successAction,
  preventCloseWhileLoading = true,
  link,
}: StatusDialogProps) {
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open: boolean) => {
        if (!loading || !preventCloseWhileLoading) {
          onOpenChange(open)
        }
      }}
    >
      <AlertDialogContent className="bg-gray-800 border border-gray-700 max-h-[85vh] overflow-hidden flex flex-col p-6">
        {loading ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-gray-200">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{loadingTitle}</span>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4 overflow-y-auto">
              <p className="text-gray-300">{loadingMessage}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClose} className="hover:bg-gray-700">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-gray-200">
                {status.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span>{status.type === "success" ? successTitle : errorTitle}</span>
              </AlertDialogTitle>
            </AlertDialogHeader>

            {status.message && (
              <div className="flex-1 overflow-y-auto my-4">
                <Alert
                  variant={status.type === "success" ? "default" : "destructive"}
                  className="bg-gray-900 border border-gray-700"
                >
                  <AlertDescription>
                    <pre
                      className={`font-mono text-sm whitespace-pre-wrap break-all ${status.type === "success" ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {status.message}
                    </pre>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-gray-700">Close</AlertDialogCancel>
              {status.type === "success" && successAction && (
                <AlertDialogAction className="bg-blue-600 hover:bg-blue-700" onClick={successAction.onClick}>
                  {successAction.label}
                </AlertDialogAction>
              )}
              {status.type === "success" && link && (
                <Button asChild>
                  <a
                    href={link.transactionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    View on Explorer
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="ml-2 h-4 w-4"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </Button>
              )}
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

